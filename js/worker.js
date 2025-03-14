self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.js');

self.onmessage = async function (event) {
    const { code } = event.data;
    let pyodide = await loadPyodide();

    // Redireciona a saída padrão do Python para uma variável
    pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
    `);

    // Executa o código Python
    try {
        pyodide.runPython(code);
        // Obtém a saída padrão do Python
        let result = pyodide.runPython("sys.stdout.getvalue()");
        // Envia o resultado de volta para o thread principal
        self.postMessage({ result });
    } catch (err) {
        self.postMessage({ error: `Erro ao executar o código Python: ${err}` });
    }
};