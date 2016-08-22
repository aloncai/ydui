/**
 * slider
 */
!function ($, win) {

    function Slider(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Slider.DEFAULTS, options || {});
        this.init();
    }

    Slider.DEFAULTS = {
        loop: true,//是否循环
        speed: 300,
        autoplay: 2000,//循环时间
        simulateTouch: true//是否仿生拖动事件
    };

    Slider.prototype.setSlidesSize = function () {
        var _this = this;

        _this.$element.css('transform', 'translate3d(-' + $(window).width() + 'px,0,0)')
            .find('.slider-item').css({width: _this.winWidth});

        return _this;
    };

    Slider.prototype.width = 0;

    Slider.prototype.cloneItem = function () {
        var _this = this;
        var $element = _this.$element;
        if (_this.options.loop) {
            $element.prepend($element.find('.slider-item:last-child').clone());
            $element.append($element.find('.slider-item:first-child').clone());
        }
        _this.setSlidesSize();

        return _this;
    };

    Slider.prototype.move = function (index) {

        var _this = this,
            $element = _this.$element;

        _this.transitioning = true;

        _this.setTranslate(-index * $(win).width());

        $element.one('webkitTransitionEnd', function () {
            _this.transitioning = false;
        }).emulateTransitionEnd(_this.options.speed);
    };

    Slider.prototype.initInterVal = function () {
        var _this = this;
        _this.autoPlayId = setInterval(function () {
            //  _this.move(++_this.index);
        }, _this.options.autoplay);

        return this;
    };

    Slider.prototype.setTranslate = function (x) {
        var _this = this;
        _this.$element.css({
            'transitionDuration': _this.options.speed + 'ms',
            'transform': 'translate3d(' + x + 'px,0,0)'
        });
    };

    Slider.prototype.stop = function () {
        clearInterval(this.autoPlayId);
        return this;
    };

    var touches = {
        moveingTag: 0,//移动状态(start,move,end)标记
        startClientX: 0,//起始拖动坐标
        pianyiX: 0,
        fuck: 0
    };

    Slider.prototype.updateContainerSize = function () {
        var _this = this;

        var width = _this.$element[0].clientWidth;

        width = width - parseInt(_this.$element.css('padding-left'), 10) - parseInt(_this.$element.css('padding-right'), 10);

        _this.width = width;
    };

    Slider.prototype.onTouchStart = function (event) {

        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        if (touches.moveingTag == 0) {
            touches.moveingTag = 1;
            // 记录鼠标起始拖动位置
            touches.startClientX = event.clientX;
        }
    };

    Slider.prototype.cursor = function () {
        this.$element.css('cursor', '-webkit-grabbing');
    };

    Slider.prototype.onTouchMove = function (event) {

        var _this = this;

        event.preventDefault();
        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        var deltaSlide = touches.fuck = event.clientX - touches.startClientX;
        //_this.cursor();

        if (touches.moveingTag == 1 && deltaSlide != 0) {
            touches.moveingTag = 2;
        }
        if (touches.moveingTag == 2) {
            _this.setTranslate(-_this.index * $(win).width() + deltaSlide);
        }
    };

    Slider.prototype.onTouchEnd = function (event) {

        event.preventDefault();

        var _this = this;

        if (touches.moveingTag == 2) {
            touches.moveingTag = 0;

            if (_this.transitioning)return;

            if (Math.abs(touches.fuck) <= .1 * _this.winWidth) {
                // 弹回去
                _this.setTranslate(-_this.index * $(win).width());
            } else {
                if (touches.fuck > 0) {
                    if (_this.index == 0) {
                        _this.index = 3;
                        _this.resetTranslate(-3 * _this.winWidth + 'px');
                    }
                    _this.stop().move(--_this.index);
                } else {
                    if (_this.index == 3) {
                        _this.index = 0;
                        _this.resetTranslate('0px');
                    }
                    _this.stop().move(++_this.index);
                }
            }
        }
    };

    /**
     * 偷偷地将DOM移动到合适位置
     * @param x
     */
    Slider.prototype.resetTranslate = function (x) {
        this.$element.css('transitionDuration', '0ms').css('transform', 'translate3d(' + x + ',0,0)');
    };

    Slider.prototype.initEvent = function () {
        var _this = this;

        $('#J_Prev').on('click', function () {
            if (_this.transitioning)return;

            if (_this.index == 0) {
                _this.index = 3;
                _this.resetTranslate(-3 * _this.winWidth + 'px');
            }

            _this.stop().move(--_this.index);
        });

        $('#J_Next').on('click', function () {
            if (_this.transitioning)return;

            if (_this.index == 3) {
                _this.index = 0;
                _this.resetTranslate('0px');
            }

            _this.stop().move(++_this.index);
        });

        var touchEvents = _this.touchEvents();

        _this.$element.find('.slider-item')
            .on(touchEvents.start, function (e) {
                _this.onTouchStart(e);
            }).on(touchEvents.move, function (e) {
                _this.onTouchMove(e);
            }).on(touchEvents.end, function (e) {
                _this.onTouchEnd(e);
            });

        $(win).on('resize', function () {
            _this.setSlidesSize();
        });

        _this.initInterVal();

        return this;
    };

    Slider.prototype.init = function () {
        var _this = this;
        _this.index = 1;
        _this.autoPlayId = null;
        _this.transitioning = false;
        _this.winWidth = $(win).width();
        _this.cloneItem().initEvent();
    };

    Slider.prototype.supportTouch = (win.Modernizr && !!Modernizr.touch) || (function () {
        return !!(('ontouchstart' in win) || win.DocumentTouch && document instanceof DocumentTouch);
    })();

    Slider.prototype.touchEvents = function () {
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
                slider = $this.data('ydui.slider');

            if (!slider) {
                $this.data('ydui.slider', (slider = new Slider(this, option)));
            }

            if ($.type(option) == 'string') {
                slider[option] && slider[option].apply(slider, args);
            }
        });
    }

    $.fn.slider = Plugin;

}(jQuery, window);