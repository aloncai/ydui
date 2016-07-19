/**
 * ydui
 */
!function (win) {
    var ydui = {};

    win.addEventListener('load', function () {
        /* 直接绑定FastClick */
        if (typeof FastClick == 'function') {
            FastClick.attach(document.body);
        }
    }, false);

    if (typeof define === 'function') {
        define(ydui);
    } else {
        win.YDUI = ydui;
    }

}(window);