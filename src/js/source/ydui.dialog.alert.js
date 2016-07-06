/**
 * alert
 */
!function (win, $) {
    var dialog = $.dialog = $.dialog || {},
        doc = win.document,
        body = doc.querySelectorAll('body')[0];

    /**
     * 弹出警示框
     * @param mes       提示文字String 【必填】
     * @param callback  回调函数Function 【可选】
     */
    dialog.alert = function (mes, callback) {
        var dom = doc.createElement('div'), _id = 'YDUI_ALERT';
        dom.innerHTML =
            '<div>' +
            '    <div class="mask-black"></div>' +
            '    <div class="m-confirm m-alert">' +
            '        <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
            '        <div class="confirm-ft">' +
            '            <a href="javascript:;" class="confirm-btn primary">确定</a>' +
            '        </div>' +
            '    </div>' +
            '</div>';
        var old = doc.querySelector('#' + _id);
        old && dom.parentNode.removeChild(dom);

        $.pageScroll.lock();

        body.appendChild(dom);

        dom.querySelectorAll('a')[0].onclick = function () {
            dom.parentNode.removeChild(dom);
            $.pageScroll.unlock();
            typeof callback === 'function' && callback();
        };
    };
}(window, YDUI);