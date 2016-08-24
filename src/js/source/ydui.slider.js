/**
 * Slider
 * TODO 图片懒加载
 * TODO 上一个 下一个
 * TODO 点点点
 */
!function ($, win) {
    "use strict";

    function Slider(element, options) {
        this.$element = $(element).find('.slider-wrapper');
        this.options = $.extend({}, Slider.DEFAULTS, options || {});
        this.init();
    }

    var touches = {
        moveTag: 0, // 移动状态(start,move,end)标记
        startClientX: 0, // 起始拖动坐标
        moveOffset: 0 // 移动偏移量（左右移动宽度）
    };

    Slider.DEFAULTS = {
        loop: true, // 是否循环
        speed: 600, // 移动速度
        autoplay: 2000 // 循环时间
    };

    /**
     * 初始化
     */
    Slider.prototype.init = function () {
        var _this = this;
        _this.index = 1;
        _this.autoPlayId = null;
        _this.winWidth = _this.$element.width();
        _this.cloneItem().bindEvent();
    };

    /**
     * 绑定事件
     */
    Slider.prototype.bindEvent = function () {
        var _this = this;

        $('#J_Prev').on('click', function () {

            var winWidth = _this.$element.width();
            if (_this.index == 0) {
                _this.index = 3;
                _this.setTranslate(0, -3 * winWidth);
            }

            _this.stop().move(--_this.index);
        });

        $('#J_Next').on('click', function () {

            if (_this.index == 3) {
                _this.index = 0;
                _this.setTranslate(0, 0);
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

        ~~_this.options.autoplay > 0 && _this.play();
    };

    /**
     * 复制第一个和最后一个item，以便无缝循环
     * @returns {Slider}
     */
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

    /**
     * 设置item宽度
     */
    Slider.prototype.setSlidesSize = function () {
        var _this = this,
            winWidth = _this.$element.width();

        _this.$element.css('transform', 'translate3d(-' + winWidth + 'px,0,0)')
            .find('.slider-item').css({width: winWidth});
    };

    /**
     * 自动播放
     */
    Slider.prototype.play = function () {
        var _this = this;

        _this.autoPlayId = setInterval(function () {

            if (_this.index == 3) {
                _this.index = 0;
                _this.setTranslate(0, 0);
            }

            _this.move(++_this.index);

        }, _this.options.autoplay);
    };

    /**
     * 停止播放
     * @returns {Slider}
     */
    Slider.prototype.stop = function () {
        clearInterval(this.autoPlayId);
        return this;
    };

    /**
     * 根据索引移动
     * @param index
     */
    Slider.prototype.move = function (index) {

        var _this = this;

        _this.setTranslate(_this.options.speed, -index * _this.$element.width());
    };

    /**
     * 左右滑动Slider
     * @param speed 移动速度 0：当前是偷偷摸摸的移动啦，生怕给你看见
     * @param x 横向移动宽度
     */
    Slider.prototype.setTranslate = function (speed, x) {
        this.$element.css({
            'transitionDuration': speed + 'ms',
            'transform': 'translate3d(' + x + 'px,0,0)'
        });
    };

    /**
     * 开始滑动
     * @param event
     */
    Slider.prototype.onTouchStart = function (event) {
        event.preventDefault();

        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        var _this = this;

        if (touches.moveTag == 0) {
            touches.moveTag = 1;
            // 记录鼠标起始拖动位置
            touches.startClientX = event.clientX;

            if (_this.index == 0) {
                _this.index = 3;
                _this.setTranslate(0, -3 * _this.$element.width());
                return;
            }

            if (_this.index == 3) {
                _this.index = 0;
                _this.setTranslate(0, 0);
            }
        }
    };

    /**
     * 滑动中
     * @param event
     */
    Slider.prototype.onTouchMove = function (event) {
        event.preventDefault();

        var _this = this;

        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        var deltaSlide = touches.moveOffset = event.clientX - touches.startClientX;

        if (deltaSlide == 0) {
            touches.moveTag = 0;
            return;
        }

        if (deltaSlide != 0 && touches.moveTag != 0) {

            if (touches.moveTag == 1) {
                touches.moveTag = 2;
            }
            if (touches.moveTag == 2) {
                _this.setTranslate(0, -_this.index * _this.$element.width() + deltaSlide);
            }
        }
    };

    /**
     * 滑动后
     * @param event
     */
    Slider.prototype.onTouchEnd = function (event) {
        event.preventDefault();

        var _this = this,
            winWidth = _this.$element.width();

        var moveOffset = touches.moveOffset;

        if (moveOffset == 0 && touches.moveTag == 1) {
            touches.moveTag = 0;
            _this.setTranslate(_this.options.speed, -_this.index * _this.$element.width());
            return;
        }

        if (touches.moveTag == 2) {
            touches.moveTag = 0;

            if (Math.abs(moveOffset) <= _this.$element.width() * .1) {
                // 弹回去
                _this.setTranslate(_this.options.speed, -_this.index * _this.$element.width());
            } else {
                if (moveOffset > 0) {
                    if (_this.index == 0) {
                        _this.index = 3;
                        _this.setTranslate(0, -3 * winWidth);
                    }
                    _this.stop().move(--_this.index);
                } else {
                    if (_this.index == 3) {
                        _this.index = 0;
                        _this.setTranslate(0, 0);
                    }
                    _this.stop().move(++_this.index);
                }
            }
        }
    };

    /**
     * 判断是否支持touch事件
     * @type {*|boolean}
     */
    Slider.prototype.supportTouch = (win.Modernizr && !!Modernizr.touch) || (function () {
        return !!(('ontouchstart' in win) || win.DocumentTouch && document instanceof DocumentTouch);
    })();

    /**
     * 当前设备事件
     * @type {{start, move, end}}
     */
    Slider.prototype.touchEvents = function () {
        var _this = this,
            supportTouch = _this.supportTouch;

        return {
            start: supportTouch ? 'touchstart' : 'mousedown',
            move: supportTouch ? 'touchmove' : 'mousemove',
            end: supportTouch ? 'touchend' : 'mouseup'
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