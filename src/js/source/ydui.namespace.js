/**
 * namespace
 */
!function (win) {
    var ydui = {};

    // RequireJS && SeaJS && GlightJS
    if (typeof define === 'function') {
        define(ydui);
    } else {
        win.YDUI = ydui;
    }
}(window);