/**
 * ydui
 */
!function (win) {
    var ydui = {},
        doc = win.document;

    window.addEventListener('load', function () {
        /* 直接绑定FastClick */
        if (typeof FastClick == 'function') {
            FastClick.attach(document.body);
        }

        /* 解决:active这个高端洋气的CSS伪类不能使用问题 */
        doc.addEventListener('touchstart', function () {
        }, false);
    }, false);

    if (typeof define === 'function') {
        define(ydui);
    } else {
        win.YDUI = ydui;
    }

}(window);