/**
 * YDUI 可伸缩布局方案
 * rem计算方式：设计图尺寸px / 100 = 实际rem  例: 100px = 1rem
 */
!function (win) {

    /* 设计图文档宽度 */
    var docWidth = 750;

    var doc = win.document,
        docEl = doc.documentElement, resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';

    var recalc = (function refreshRem() {
        var clientWidth = docEl.getBoundingClientRect().width;

        /* 8.55：为防止页面最小宽度过小[320px]，11：为防止页面最大宽度过大，导致PC端浏览页面丑陋 */
        docEl.style.fontSize = Math.max(Math.min(20 * (clientWidth / docWidth), 11), 8.55) * 5 + 'px';

        return refreshRem;
    })();

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);

    /* 解决:active这个高端洋气的CSS伪类不能使用问题 */
    doc.addEventListener('touchstart', function () {
    }, false);
}(window);