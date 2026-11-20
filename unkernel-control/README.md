# Unkernel Control

A static browser terminal for [Unkernel](https://github.com/pithings/unkernel). The VM runs locally in the browser tab using the official JavaScript SDK.

## Open

After GitHub Pages publishes this folder, visit:

`https://gmanog.github.io/unkernel-control/`

## Use

1. Open the page in a modern browser that supports WebAssembly JSPI.
2. Select **Boot Linux**.
3. Use the terminal to run commands in Unkernel's built-in BusyBox shell.
4. Select **Power off** to shut down the guest.

This starter uses the built-in base shell. It does not download an Alpine or Debian distro image. The VM is local to the browser tab; closing the tab ends the running session.

## Important scope

This is an independent control panel, not an MCP server and not connected to Gemini. No remote service receives terminal commands. The project intentionally does not expose the VM to the public internet.

The SDK is imported from esm.sh. The page needs an internet connection to download the SDK and its WebAssembly module.

## Source

- Unkernel: https://github.com/pithings/unkernel
- JavaScript SDK: https://www.npmjs.com/package/unkernel
