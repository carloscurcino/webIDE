self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.js');

let isRunning = false;

self.onmessage = async function (event) {
    console.log("Parando o código", event.data)
    if (event.data === 'stop') {
        isRunning = false;
        return;
    }

    const { code } = event.data;
    let pyodide = await loadPyodide();

    pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
    `);

    try {
        isRunning = true;
        pyodide.runPython(code);
        // Obtém a saída padrão do Python
        let result = pyodide.runPython("sys.stdout.getvalue()");
        // Envia o resultado de volta para o thread principal
        if (isRunning) self.postMessage({ result });
    } catch (err) {
        self.postMessage({ error: `Erro ao executar o código Python: ${err}` });
    }
};