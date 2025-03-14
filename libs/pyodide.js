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

    let worker = new Worker('./js/worker.js');
    if (btn.innerText === "STOP") {
        // Envia a mensagem de interrupção para o Worker
        if (worker) {
            worker.postMessage('stop');
            worker.terminate();
            worker = null;
        }
        btn.innerText = "RUN";
        return;
    }

    btn.innerText = "STOP";

    // Cria um novo Worker

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