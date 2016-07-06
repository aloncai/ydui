/**
 * toast
 */
!function (win, $) {
    var dialog = $.dialog = $.dialog || {},
        doc = win.document,
        body = doc.querySelectorAll('body')[0];

    /**
     * 弹出提示层
     * @param mes       提示文字String 【必填】
     * @param type      类型String success or error 【必填】
     * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
     * @param callback  回调函数Function 【可选】
     */
    dialog.toast = function (mes, type, timeout, callback) {
        var al = arguments.length;
        if (al < 2) {
            console.error('From YDUI\'s tipMes: Please set two or more parameters!!!');
            return;
        }

        var ico = type == 'error' ? 'tipmes-error-ico' : 'tipmes-success-ico';
        var dom = doc.createElement('div'), _id = 'YDUI_TIPMES';
        dom.id = _id;
        dom.innerHTML =
            '<div>' +
            '    <div class="mask-white"></div>' +
            '    <div class="m-tipmes">' +
            '        <div class="' + ico + '"></div>' +
            '        <p class="tipmes-content">' + (mes || '') + '</p>' +
            '    </div>' +
            '</div>';

        var old = doc.querySelector('#' + _id);
        old && dom.parentNode.removeChild(dom);

        $.pageScroll.lock();

        body.appendChild(dom);

        if (typeof timeout === 'function' && arguments.length >= 3) {
            callback = timeout;
            timeout = 2000;
        }

        var inter = setTimeout(function () {
            clearTimeout(inter);
            $.pageScroll.unlock();
            dom.parentNode.removeChild(dom);
            typeof callback === 'function' && callback();
        }, (~~timeout || 2000) + 100);//100为动画时间
    };
}(window, YDUI);