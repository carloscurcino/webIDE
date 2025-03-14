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
    output.classList.remove("error");
    btn.innerText = "STOP";

    // Cria um novo Worker
    let worker = new Worker('./js/worker.js');

    // Envia o código Python para o Worker
    worker.postMessage({ code });

    // Recebe a mensagem do Worker
    worker.onmessage = function (event) {
        const { result, error } = event.data;
        if (result) {
            output.value = result;
        } else if (error) {
            output.value = error;
            output.classList.add("error");
        }
        btn.innerText = "RUN";
    };

    // Trata erros do Worker
    worker.onerror = function (error) {
        output.value = `Erro no Worker: ${error.message}`;
        btn.innerText = "RUN";
    };
}