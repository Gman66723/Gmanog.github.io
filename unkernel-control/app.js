import { checkSupport, createKernel } from "https://esm.sh/unkernel";

const $ = (id) => document.getElementById(id);
const terminal = $("terminal");
const statusEl = $("status");
const bootButton = $("boot");
const commandInput = $("command");
const sendButton = $("send");
const powerButton = $("poweroff");
const interruptButton = $("interrupt");
const clearButton = $("clear");

let vm = null;
let shell = null;
let booting = false;
let shuttingDown = false;
let decoder = new TextDecoder();

function setStatus(label, running = false) {
  statusEl.classList.toggle("running", running);
  statusEl.querySelector("span").textContent = label;
}
function setControls(running) {
  commandInput.disabled = !running;
  sendButton.disabled = !running;
  powerButton.disabled = !running;
  interruptButton.disabled = !running;
  clearButton.disabled = false;
  bootButton.disabled = booting || running;
  bootButton.textContent = running ? "Running" : booting ? "Booting…" : "Boot Linux";
  if (running) commandInput.placeholder = "Enter a Linux command…";
  else commandInput.placeholder = "Boot Linux to enter a command…";
}
function line(text, kind = "") {
  const node = document.createElement("div");
  node.className = "terminal-line" + (kind ? " " + kind : "");
  node.textContent = text;
  terminal.append(node);
  terminal.scrollTop = terminal.scrollHeight;
}
function clearTerminal() {
  terminal.replaceChildren();
}
function showWelcome() {
  terminal.innerHTML = '<div class="welcome"><div class="welcome-symbol">›_</div><strong>Unkernel is ready when you are.</strong><p>Boot the VM to start a Linux shell. Your commands run locally in this browser tab.</p></div>';
}
async function readShellOutput(activeShell) {
  const reader = activeShell.output.getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        const text = decoder.decode(value, { stream: true });
        if (text) line(text);
      }
    }
  } catch (error) {
    if (!shuttingDown) line("Terminal output stopped: " + error.message, "system");
  } finally {
    reader.releaseLock();
  }
}
async function boot() {
  if (booting || vm) return;
  booting = true;
  setStatus("Starting VM…");
  setControls(false);
  clearTerminal();
  line("Checking browser support…", "system");
  try {
    const support = await checkSupport();
    if (!support.ok) throw new Error(support.problems.join("\n"));
    line("Booting Unkernel (built-in base shell)…", "system");
    vm = await createKernel({ worker: false });
    shell = await vm.spawn();
    decoder = new TextDecoder();
    void readShellOutput(shell);
    setStatus("Linux running", true);
    setControls(true);
    line("Connected to the Unkernel shell.", "system");
    line("Try: uname -a   |   ls /   |   help");
    bootButton.textContent = "Running";
    bootButton.disabled = true;
    shell.ended.then((result) => {
      if (vm && !shuttingDown) {
        line("\nShell ended (" + JSON.stringify(result) + ").", "system");
        if (result.type === "exit") finishVM();
      }
    }).catch(() => {});
    vm.exited.then((result) => {
      if (vm) {
        line("VM stopped (" + JSON.stringify(result) + ").", "system");
        finishVM();
      }
    }).catch(() => {});
    commandInput.focus();
  } catch (error) {
    line("Could not start Unkernel: " + error.message, "error");
    setStatus("Boot failed");
    vm = null;
    shell = null;
    setControls(false);
  } finally {
    booting = false;
    if (!vm) {
      bootButton.disabled = false;
      bootButton.textContent = "Boot Linux";
    }
  }
}
function finishVM() {
  vm = null;
  shell = null;
  shuttingDown = false;
  setStatus("Not running");
  setControls(false);
  bootButton.disabled = false;
  bootButton.textContent = "Boot Linux";
}
async function sendCommand(value) {
  if (!shell || !value.trim()) return;
  const command = value;
  commandInput.value = "";
  try {
    await shell.write(command + "\n");
  } catch (error) {
    line("Input error: " + error.message, "error");
  }
}
$("command-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  await sendCommand(commandInput.value);
});
bootButton.addEventListener("click", boot);
clearButton.addEventListener("click", clearTerminal);
interruptButton.addEventListener("click", async () => {
  if (shell) await shell.write("\u0003");
});
powerButton.addEventListener("click", async () => {
  if (!shell || shuttingDown) return;
  shuttingDown = true;
  powerButton.disabled = true;
  line("Sending poweroff…", "system");
  try {
    await shell.write("poweroff\n");
  } catch (error) {
    line("Power off failed: " + error.message, "error");
    shuttingDown = false;
  }
});
setControls(false);
setStatus("Not running");
