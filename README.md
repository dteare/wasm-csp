Runs Google's [Fibonacci WebAssembly demo](https://webassembly.studio/?f=aakxyho2ho) within a chrome extension.

## Validate WASM module

You can validate `fibonacci.wasm` runs fine without a Content Security Policy by running a local web server and loading main.html.

## Content Security Policy

Scripts running within the Chrome background page have a restrictive Content Security Policy by default. When using WASM with the default policy, both `WebAssembly.instantiateStreaming` and `WebAssembly.compile` are prohibited.

```
CompileError: WebAssembly.instantiateStreaming(): Wasm code generation disallowed by embedder
CompileError: WebAssembly.compile(): Wasm code generation disallowed by embedder
```

Updating the content security policy to allow 'wasm-eval' resolves this issue.

`"content_security_policy": "script-src 'self' 'wasm-eval'; object-src 'self'"`

Ideally we would be able to be very explicit about which code is allowed to run and could use an [SRI hash](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity). 

```
"content_security_policy": "script-src 'self' 'sha256-490d42eaa2c34bb7f102193c6945ac805f4100ed1e8d2f7382cd690bcc80d77a'; object-src 'self'"
```

Where the `sha256-` value is the sha 256 hash of `fibonacci.wasm`:

```
$ shasum -a 256 -b fibonacci.wasm
490d42eaa2c34bb7f102193c6945ac805f4100ed1e8d2f7382cd690bcc80d77a *fibonacci.wasm
```

When attempting to use this explicit policy, both streaming and compilation styles are disallowed:

```
CompileError: WebAssembly.instantiateStreaming(): Wasm code generation disallowed by embedder
CompileError: WebAssembly.compile(): Wasm code generation disallowed by embedder
```