/**
 * swiper
 */
!function ($, win) {

    function Swiper(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Swiper.DEFAULTS, options || {});
        this.init();
        this.initEvent();
        this.bbEvent();
        this.initInterVal();
        this.fuck();
    }

    Swiper.DEFAULTS = {
        loop: true,//是否循环
        autoplay: 3000,//循环时间
        simulateTouch: true//是否仿生拖动事件
    };

    Swiper.prototype.setSlidesSize = function () {
        this.$element.find('.swiper-slide').css({width: $(win).width()});
    };

    Swiper.prototype.width = 0;

    Swiper.prototype.fuck = function () {
        var _this = this;
        var $element = _this.$element;
        if (_this.options.loop) {
            $element.append($element.find('.swiper-slide:lt(2)').clone());
        }
    };

    Swiper.prototype.initInterVal = function () {
        var _this = this;
        var a = 0;
        setInterval(function () {
            ++a;
            if (a > 2) {
                a = 0;
                _this.$element.css({'background': 'red', 'transform': 'translate3d(0px,0,0)'});
            }
            _this.setTranslate(-a * $(win).width());
        }, _this.options.autoplay);
    };

    Swiper.prototype.bbEvent = function () {
        $('#J_Prev').on('click', function () {

        });

        $('#J_Next').on('click', function () {

        });
    };

    var touches = {
        moveingTag: 0,//移动状态(start,move,end)标记
        startClientX: 0,//起始拖动坐标
        startPixelOffset: 0,
        fuck: 0,
        pixelOffset: 0,//偏移量（移动位置）
        currentSlide: 0//当前选中索引
    };

    Swiper.prototype.setTranslate = function (x) {
        this.$element.css('transform', 'translate3d(' + x + 'px,0,0)');
    };

    Swiper.prototype.updateContainerSize = function () {
        var _this = this;

        var width = _this.$element[0].clientWidth;

        width = width - parseInt(_this.$element.css('padding-left'), 10) - parseInt(_this.$element.css('padding-right'), 10);

        _this.width = width;
    };

    Swiper.prototype.onTouchStart = function (event) {

        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        if (touches.moveingTag == 0) {
            touches.moveingTag = 1;
            // 记录鼠标起始拖动位置
            touches.startClientX = event.clientX;
        }
    };

    Swiper.prototype.onTouchMove = function (event) {
        var _this = this;

        event.preventDefault();
        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        var deltaSlide = touches.fuck = event.clientX - touches.startClientX;

        _this.$element[0].style.cursor = 'move';
        _this.$element[0].style.cursor = '-webkit-grabbing';
        _this.$element[0].style.cursor = '-moz-grabbin';
        _this.$element[0].style.cursor = 'grabbing';

        if (touches.moveingTag == 1 && deltaSlide != 0) {
            touches.moveingTag = 2;
            touches.startPixelOffset = touches.pixelOffset;
        }
        if (touches.moveingTag == 2) {
            var of = touches.pixelOffset = touches.startPixelOffset + deltaSlide;
            this.setTranslate(of);
        }
    };

    Swiper.prototype.onTouchEnd = function (event) {
        var $body = $('body');
        var imgslength = 3;

        if (touches.moveingTag == 2) {
            touches.moveingTag = 0;
            touches.currentSlide = touches.pixelOffset < touches.startPixelOffset ? touches.currentSlide + 1 : touches.currentSlide - 1;
            touches.currentSlide = Math.min(Math.max(touches.currentSlide, 0), imgslength - 1);
            var of = touches.pixelOffset = touches.currentSlide * -$body.width();

            if (Math.abs(touches.fuck) > 150) {
                this.setTranslate(of);
            } else {
                this.setTranslate(0);
            }
        }
    };

    Swiper.prototype.initEvent = function () {
        var _this = this;

        $('#J_Prev').on('click', function () {

        });

        $('#J_Next').on('click', function () {

        });

        var touchEvents = _this.touchEvents();

        _this.$element.find('.swiper-wrapper').on(touchEvents.start, function (e) {
            _this.onTouchStart(e);
        }).on(touchEvents.move, function (e) {
            _this.onTouchMove(e);
        }).on(touchEvents.end, function (e) {
            _this.onTouchEnd(e);
        });

        $(win).on('resize', function () {
            _this.setSlidesSize();
        });
    };

    Swiper.prototype.init = function () {
        this.setSlidesSize();
    };

    Swiper.prototype.supportTouch = (win.Modernizr && !!Modernizr.touch) || (function () {
        return !!(('ontouchstart' in win) || win.DocumentTouch && document instanceof DocumentTouch);
    })();

    Swiper.prototype.touchEvents = function () {
        var _this = this,
            touch = _this.supportTouch,
            simulateTouch = _this.options.simulateTouch;

        return {
            start: touch ? 'touchstart' : 'mousedown',
            move: touch ? 'touchmove' : 'mousemove',
            end: touch ? 'touchend' : 'mouseup'
        };
    };

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {

            var $this = $(this),
                swiper = $this.data('ydui.swiper');

            if (!swiper) {
                $this.data('ydui.swiper', (swiper = new Swiper(this, option)));
            }

            if ($.type(option) == 'string') {
                swiper[option] && swiper[option].apply(swiper, args);
            }
        });
    }

    $.fn.swiper = Plugin;

}(jQuery, window);