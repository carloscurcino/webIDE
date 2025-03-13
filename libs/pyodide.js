async function main() {
    let pyodide = await loadPyodide();
    console.log(pyodide.runPython(`
    import sys
    sys.version
    `));
    pyodide.runPython("print(1 + 2)");
}
main();

function clearConsole() {
    document.getElementById("output").value = "";
}

async function runCode() {
    let code = document.getElementById("editor").value;
    let output = document.getElementById("output");
    let btn = document.getElementById("run-btn");
    btn.innerText = "STOP"

    let pyodide = await loadPyodide();

    // Redireciona a saída padrão do Python para uma variável
    pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
        `);
    console.log(code, typeof code)
    // Executa o código Python
    try {
        pyodide.runPython(code);
        // Obtém a saída padrão do Python
        let result = pyodide.runPython("sys.stdout.getvalue()");
        // Exibe a saída no textarea
        output.value = result;
    } catch (err) {
        output.value = `Erro ao executar o código Python: ${err}`;
    } finally {
        btn.innerText = "RUN"
    }
}