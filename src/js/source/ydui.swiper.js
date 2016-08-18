/**
 * swiper
 */
!function ($, win) {

    function Swiper(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Swiper.DEFAULTS, options || {});
        this.init();
        this.initEvent();
    }

    Swiper.DEFAULTS = {
        loop: true,//是否循环
        autoplay: 3000,//循环时间
        simulateTouch: true//是否仿生拖动事件
    };

    Swiper.prototype.setSlidesSize = function () {
        $('.swiper-slide').css({width: $(win).width()});
    };

    Swiper.prototype.width = 0;

    var touches = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
    };

    Swiper.prototype.setTranslate = function(x) {
        this.$element.find('.swiper-wrapper').css('transform','translate3d(' + x + 'px,0,0)');
    };

    Swiper.prototype.updateContainerSize = function () {
        var _this = this;

        var width = _this.$element[0].clientWidth;

        width = width - parseInt(_this.$element.css('padding-left'), 10) - parseInt(_this.$element.css('padding-right'), 10);

        _this.width = width;
    };

    Swiper.prototype.onTouchStart = function (e) {
        e.preventDefault();

        var _this = this;
        var isTouchEvent = e.type === 'touchstart';
        if (!isTouchEvent && 'which' in e && e.which === 3) return;

        // 记录鼠标起始拖动位置
        touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
    };

    Swiper.prototype.onTouchMove = function (e) {
        e.preventDefault();

        var deltaSlide = e.clientX - touches.currentX;

        var of = touches.startX + deltaSlide;

        this.setTranslate(of);

    };

    Swiper.prototype.onTouchEnd = function (e) {
        e.preventDefault();
    };

    Swiper.prototype.initEvent = function () {
        var _this = this;

        var touchEvents = _this.touchEvents();

        _this.$element[0]['addEventListener'](touchEvents.start, _this.onTouchStart, false);

        _this.$element[0]['addEventListener'](touchEvents.move, _this.onTouchMove, false);

        _this.$element[0]['addEventListener'](touchEvents.end, _this.onTouchEnd, false);

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
            start: touch  ? 'touchstart' : 'mousedown',
            move: touch  ? 'touchmove' : 'mousemove',
            end: touch  ? 'touchend' : 'mouseup'
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