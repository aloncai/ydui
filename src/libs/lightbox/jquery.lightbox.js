/**
 * @extends jquery 1.11.2
 * @fileOverview 移动端灯箱插件【只为移动端】
 * @author 一点
 * @ps 浏览器后退关闭操作处理参看 http://photoswipe.com/
 * @email surging2@qq.com
 * @url http://www.ydcss.com
 * @version 0.1
 * @date 2015/12/9
 * Copyright (c) 2010-2016
 */
!function (lightbox) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], lightbox);
    } else if (typeof exports !== 'undefined') {
        module.exports = lightbox;
    } else {
        lightbox(jQuery);
    }
}(function ($) {
    $.fn.lightbox = function (option) {
        return this.each(function () {
            var st = $.extend({imgs: 'img'}, option);

            var $imgs = $(this).find(st.imgs), imgslength = $imgs.length, $body = $('body');

            if (imgslength <= 0) return;

            var touch = {
                sliding: 0,
                startClientX: 0,
                startPixelOffset: 0,
                pixelOffset: 0,//偏移量（移动位置）
                currentSlide: 0,//当前选中索引
                /**
                 *
                 * @param event
                 */
                slideStart: function (event) {
                    if (event.originalEvent.touches)
                        event = event.originalEvent.touches[0];
                    if (touch.sliding == 0) {
                        touch.sliding = 1;
                        touch.startClientX = event.clientX;
                    }
                },
                slide: function (event) {
                    event.preventDefault();
                    if (event.originalEvent.touches)
                        event = event.originalEvent.touches[0];
                    var deltaSlide = event.clientX - touch.startClientX;

                    if (touch.sliding == 1 && deltaSlide != 0) {
                        touch.sliding = 2;
                        touch.startPixelOffset = touch.pixelOffset;
                    }
                    if (touch.sliding == 2) {
                        var touchPixelRatio = 1;
                        if ((touch.currentSlide == 0 && event.clientX > touch.startClientX) || (touch.currentSlide == imgslength - 1 && event.clientX < touch.startClientX)) {
                            touchPixelRatio = 3;
                        }
                        var of = touch.pixelOffset = touch.startPixelOffset + deltaSlide / touchPixelRatio;
                        $('#J_LightBoxImg').css('-webkit-transform', 'translate3d(' + of + 'px,0,0)').removeClass('lightbox-animate');
                    }
                },
                slideEnd: function () {
                    if (touch.sliding == 2) {
                        touch.sliding = 0;
                        touch.currentSlide = touch.pixelOffset < touch.startPixelOffset ? touch.currentSlide + 1 : touch.currentSlide - 1;
                        touch.currentSlide = Math.min(Math.max(touch.currentSlide, 0), imgslength - 1);
                        var of = touch.pixelOffset = touch.currentSlide * -$body.width();
                        $('#J_LightBoxImg').addClass('lightbox-animate').css('-webkit-transform', 'translate3d(' + of + 'px,0,0)');
                        $('#J_Current').html(touch.currentSlide + 1);
                    }
                },
                getImgsHtml: function () {
                    var imgshtml = '';
                    $imgs.each(function () {
                        imgshtml +=
                            '<div class="lightbox-item J_LightBoxItem" style="width: ' + (100 / $imgs.length) + '%;">' +
                            '   <div class="lightbox-img">' +
                            '       <img src="' + ($(this).data('img') || $(this).attr('src')) + '"/>' +
                            '   </div>' +
                            '</div>';
                    });
                    return imgshtml;
                },
                /**
                 * 将lightbox代码插入显示
                 * @param index
                 */
                showLightBox: function (index) {
                    var style = 'width: ' + imgslength * 100 + '%; -webkit-transform: translate3d(' + -$body.width() * index + 'px, 0px, 0px);';
                    $body.append($(
                        '<div class="m-lightbox" id="J_LightBox">' +
                        '    <div class="lightbox-header">' +
                        '        <div class="center"><span id="J_Current">' + (index + 1 || 1) + '</span><em>/</em>' + imgslength + '</div>' +
                        '        <a href="javascript:history.back();">关闭</a>' +
                        '    </div>' +
                        '    <div class="lightbox-con" id="J_LightBoxImg" style="' + style + '">' + touch.getImgsHtml() + '</div>' +
                        '</div>'));
                    touch.currentSlide = index;//设置点击图片的索引
                    touch.pixelOffset = -$body.width() * index;//偏移量设定

                    //判断是否支持touch事件
                    var isSupportTouch = (window.Modernizr && Modernizr.touch === true) || (function () {
                            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
                        })();

                    $('#J_LightBoxImg').on(isSupportTouch ? 'touchstart' : 'mousedown', touch.slideStart)
                        .on(isSupportTouch ? 'touchend' : 'mouseup', touch.slideEnd)
                        .on(isSupportTouch ? 'touchmove' : 'mousemove', touch.slide);
                }
            };

            //给图片加上点击事件
            $imgs.each(function (index) {
                $(this).on('click', function () {
                    window.history.pushState('', '', window.location.href.split('#')[0] + '#lightbox');
                    touch.showLightBox(index);
                });
            });

            //地址栏发生变化时移除
            $(window).on('hashchange', function () {
                $('#J_LightBox').remove();
            });
        });
    };
});
