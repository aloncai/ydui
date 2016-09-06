/**
 * 解决:active这个高端洋气的CSS伪类不能使用问题
 */
!function (win) {
    win.document.addEventListener('touchstart', function (event) {
        /* do nothing */
    }, false);
}(window);