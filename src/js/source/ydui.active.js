/**
 * 解决:active这个高端洋气的CSS伪类不能使用问题，之所以放在这里，防止页面未引入ydui.js，也能正常使用:active
 */
!function (win) {
    win.document.addEventListener('touchstart', function (event) {
        /* do nothing */
    }, false);
}(window);