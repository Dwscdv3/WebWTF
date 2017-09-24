window.onerror = function (msg, url, linenumber) {
    alert("运行脚本时发生了一个错误：\n" + msg + "\n\n这可能是一个 bug，或是您的浏览器不兼容最新的标准。");
    return true;
}