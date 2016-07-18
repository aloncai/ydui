/**
 * ydui
 */
!function (win) {
    var ydui = {};

    win.addEventListener('load', function () {
        /* 直接绑定FastClick */
        if (typeof FastClick == 'function') {
            var a = FastClick.attach(document.body);
            console.log(a);

        }
    }, false);

    if (typeof define === 'function') {
        define(ydui);
    } else {
        win.YDUI = ydui;
    }

}(window);