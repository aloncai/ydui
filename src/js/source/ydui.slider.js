/**
 * Slider
 * TODO 图片懒加载
 * TODO 上一个 下一个
 */
!function ($, win) {
    "use strict";

    function Slider(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Slider.DEFAULTS, options || {});
        this.init();
    }

    Slider.DEFAULTS = {
        speed: 600, // 移动速度
        autoplay: 2000 // 循环时间
    };

    /**
     * 初始化
     */
    /**
     * 初始化
     */
    Slider.prototype.init = function () {
        var _this = this;
        _this.index = 1;
        _this.autoPlayId = null;
        _this.$wrapper = _this.$element.find('.slider-wrapper');
        _this.$pagination = _this.$element.find('.slider-pagination');
        _this.createBullet();
        _this.cloneItem().bindEvent();
    };

    /**
     * 绑定事件
     */
    Slider.prototype.bindEvent = function () {
        var _this = this;

        $('#J_Prev').on('click', function () {

            var _width = _this.$wrapper.width();
            if (_this.index == 0) {
                _this.index = 3;
                _this.setTranslate(0, -3 * _width);
            }

            _this.move(--_this.index);
        });

        $('#J_Next').on('click', function () {

            if (_this.index == 3) {
                _this.index = 0;
                _this.setTranslate(0, 0);
            }

            _this.move(++_this.index);
        });

        var touchEvents = _this.touchEvents();

        _this.$wrapper.find('.slider-item')
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
        var _this = this,
            $wrapper = _this.$wrapper;

        var $f = $wrapper.find('.slider-item:first-child').clone();
        var $l = $wrapper.find('.slider-item:last-child').clone();

        $wrapper.prepend($l);
        $wrapper.append($f);

        _this.setSlidesSize();

        return _this;
    };

    /**
     * 创建点点点
     */
    Slider.prototype.createBullet = function () {
        var _this = this;

        var len = _this.$wrapper.find('.slider-item').length;

        _this.$pagination.append('<span class="slider-pagination-active"></span>' + new Array(len).join('<span></span>'));
    };

    /**
     * 设置item宽度
     */
    Slider.prototype.setSlidesSize = function () {
        var _this = this,
            _width = _this.$wrapper.width();

        _this.$wrapper.css('transform', 'translate3d(-' + _width + 'px,0,0)')
            .find('.slider-item').css({width: _width});
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
        var _this = this;
        clearInterval(_this.autoPlayId);
        return _this;
    };

    /**
     * 根据索引移动
     * @param index
     */
    Slider.prototype.move = function (index) {
        var _this = this;
        _this.setTranslate(_this.options.speed, -index * _this.$wrapper.width());
    };

    /**
     * 左右滑动Slider
     * @param speed 移动速度 0：当前是偷偷摸摸的移动啦，生怕给你看见
     * @param x 横向移动宽度
     */
    Slider.prototype.setTranslate = function (speed, x) {
        var _this = this;

        var index = _this.index % 3 >= 3 ? 0 : _this.index % 3 - 1;

        !!_this.$pagination[0] && _this.$pagination.find('span')
            .removeClass('slider-pagination-active')
            .eq(index).addClass('slider-pagination-active');

        _this.$wrapper.css({
            'transitionDuration': speed + 'ms',
            'transform': 'translate3d(' + x + 'px,0,0)'
        });
    };

    Slider.prototype.touches = {
        moveTag: 0, // 移动状态(start,move,end)标记
        startClientX: 0, // 起始拖动坐标
        moveOffset: 0, // 移动偏移量（左右移动宽度）
        touchStartTime: 0
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

        if (_this.touches.moveTag == 0) {
            _this.touches.moveTag = 1;

            // 记录鼠标起始拖动位置
            _this.touches.startClientX = event.clientX;
            // 记录开始触摸时间
            _this.touches.touchStartTime = Date.now();

            if (_this.index == 0) {
                _this.index = 3;
                _this.setTranslate(0, -3 * _this.$wrapper.width());
                return;
            }

            if (_this.index > 3) {
                _this.index = 1;
                _this.setTranslate(0, -_this.$wrapper.width());
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

        _this.stop();

        var deltaSlide = _this.touches.moveOffset = event.clientX - _this.touches.startClientX;

        if (deltaSlide != 0 && _this.touches.moveTag != 0) {
            if (_this.touches.moveTag == 1) {
                _this.touches.moveTag = 2;
            }
            if (_this.touches.moveTag == 2) {
                _this.setTranslate(0, -_this.index * _this.$wrapper.width() + deltaSlide);
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
            moveOffset = _this.touches.moveOffset;

        if (_this.touches.moveTag == 2) {
            _this.touches.moveTag = 0;

            // 计算开始触摸到结束触摸时间，用以计算是否需要执行下一页
            var timeDiff = Date.now() - _this.touches.touchStartTime;

            if (timeDiff > 300 && Math.abs(moveOffset) <= _this.$wrapper.width() * .5) {
                // 弹回去
                _this.setTranslate(_this.options.speed, -_this.index * _this.$wrapper.width());
            } else {
                if (moveOffset > 0) {
                    // 左移
                    _this.move(--_this.index);
                } else {
                    // 右移
                    _this.move(++_this.index);
                }
            }
        }
    };

    /**
     * 当前设备支持的事件
     * @type {{start, move, end}}
     */
    Slider.prototype.touchEvents = function () {
        var supportTouch = (win.Modernizr && !!Modernizr.touch) || (function () {
                return !!(('ontouchstart' in win) || win.DocumentTouch && document instanceof DocumentTouch);
            })();

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