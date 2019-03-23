Runs Google's [Fibonacci WebAssembly demo](https://webassembly.studio/?f=aakxyho2ho) within a chrome extension.


## Default CSP

Scripts running within the Chrome background page have a restrictive Content Security Policy by default. The `default-csp` folder contains an extension that uses the default csp and demonstrates that both `WebAssembly.instantiateStreaming` and `WebAssembly.compile` are prohibited.

```
CompileError: WebAssembly.instantiateStreaming(): Wasm code generation disallowed by embedder
CompileError: WebAssembly.compile(): Wasm code generation disallowed by embedder
```

## unsafe-eval

The extension in the `unsafe-eval` folder has a CSP that allows any scripts to run.

```
"content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"
```

This allows WASM to run fine but the overly relaxed policy is too permissive and would greatly increase our attack surface.


## wasm-eval

The extension in the `wasm-eval` folder uses `wasm-eval`:

```
"content_security_policy": "script-src 'self' 'wasm-eval'; object-src 'self'"
```

This runs fine and is much more restictive against most script injection attacks but it remains a concern that any arbitrary code can be run.


## SRI hash

Ideally we would be able to be very explicit about which code is allowed to run and could use an [SRI hash](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity). The `sri-sha256` folder attempts to use this approach:

```
"content_security_policy": "script-src 'self' 'sha256-490d42eaa2c34bb7f102193c6945ac805f4100ed1e8d2f7382cd690bcc80d77a'; object-src 'self'"
```

Where the `sha256-` value is the sha 256 hash of `fibonacci.wasm`:

```
$ shasum -a 256 -b fibonacci.wasm
490d42eaa2c34bb7f102193c6945ac805f4100ed1e8d2f7382cd690bcc80d77a *fibonacci.wasm
```

Unfortunately when attempting to use this explicit policy, both streaming and compilation styles are disallowed:

```
CompileError: WebAssembly.instantiateStreaming(): Wasm code generation disallowed by embedder
CompileError: WebAssembly.compile(): Wasm code generation disallowed by embedder
```