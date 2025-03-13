var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: "python",
    theme: "dracula",
    autoCloseBrackets: true,
});

editor.on('change', function () {
    editor.save();
});