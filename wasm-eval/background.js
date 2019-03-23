console.log("Hello, WASM with wasm-eval CSP!");

// This is our recommended way of loading WebAssembly.
// https://developers.google.com/web/updates/2018/04/loading-wasm
(async () => {
    const fibonacciURL = chrome.runtime.getURL("fibonacci.wasm");

    try {
        console.log("STEAMING test...");
        const fetchPromise = fetch(fibonacciURL);
        const { instance } = await WebAssembly.instantiateStreaming(fetchPromise);
        const result = instance.exports.fibonacci(42);
        console.log(`The *streamed* 42nd Fibonacci number is ${ result }.`);
    }
    catch(e) {
        console.error("Unable to instantiate streaming of wasm module:", e);
    }


    try {
        console.log("COMPILING test...");
        const response = await fetch(fibonacciURL);
        const buffer = await response.arrayBuffer();
        const module = await WebAssembly.compile(buffer);
        const instance = await WebAssembly.instantiate(module);
        const result = instance.exports.fibonacci(42);
        console.log(`The *compiled* 42nd Fibonacci number is ${ result }.`);
    }
    catch(e) {
        console.error("Unable to compile wasm module:", e);
    }

})();