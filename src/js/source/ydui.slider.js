/**
 * Slider
 * TODO 图片懒加载
 * TODO 鼠标移动上去不要停掉定时器
 */
!function ($, win) {
    "use strict";

    function Slider(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Slider.DEFAULTS, options || {});
        this.init();
    }

    Slider.DEFAULTS = {
        speed: 300, // 移动速度
        autoplay: 3000, // 循环时间
        bulletClass: 'slider-pagination-item',
        bulletActiveClass: 'slider-pagination-item-active'
    };

    /**
     * 初始化
     */
    Slider.prototype.init = function () {
        var _this = this,
            $element = _this.$element;

        _this.index = 1;
        _this.autoPlayId = null;
        _this.$wrapper = $element.find('.slider-wrapper');
        _this.$pagination = $element.find('.slider-pagination');
        _this.itemNums = _this.$wrapper.find('.slider-item').length;
        _this.createBullet();
        _this.cloneItem().bindEvent();
    };

    /**
     * 绑定事件
     */
    Slider.prototype.bindEvent = function () {
        var _this = this,
            touchEvents = _this.touchEvents();

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
     * 复制第一个和最后一个item
     * @returns {Slider}
     */
    Slider.prototype.cloneItem = function () {
        var _this = this,
            $wrapper = _this.$wrapper,
            $sliderItem = _this.$wrapper.find('.slider-item'),
            $firstChild = $sliderItem.filter(':first-child').clone(),
            $lastChild = $sliderItem.filter(':last-child').clone();

        $wrapper.prepend($lastChild);
        $wrapper.append($firstChild);

        _this.setSlidesSize();

        return _this;
    };

    /**
     * 创建点点点
     */
    Slider.prototype.createBullet = function () {
        var _this = this,
            initActive = '<span class="' + (_this.options.bulletClass + ' ' + _this.options.bulletActiveClass) + '"></span>';

        _this.$pagination.append(initActive + new Array(_this.itemNums).join('<span class="' + _this.options.bulletClass + '"></span>'));
    };

    /**
     * 设置item宽度
     */
    Slider.prototype.setSlidesSize = function () {
        var _this = this,
            _width = _this.$wrapper.width();

        _this.$wrapper.css('transform', 'translate3d(-' + _width + 'px,0,0)');
        _this.$wrapper.find('.slider-item').css({width: _width});
    };

    /**
     * 自动播放
     */
    Slider.prototype.play = function () {
        var _this = this;

        _this.autoPlayId = setInterval(function () {

            if (_this.index > _this.itemNums) {
                _this.index = 1;
                _this.setTranslate(0, -_this.$wrapper.width());
            }

            _this.setTranslate(_this.options.speed, -(++_this.index * _this.$wrapper.width()));

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
     * 当前页码标识加高亮
     */
    Slider.prototype.activeBullet = function () {
        var _this = this,
            itemNums = _this.itemNums,
            bulletActiveClass = _this.options.bulletActiveClass;

        var index = _this.index % itemNums >= itemNums ? 0 : _this.index % itemNums - 1;

        !!_this.$pagination[0] && _this.$pagination.find('.' + _this.options.bulletClass)
            .removeClass(bulletActiveClass)
            .eq(index).addClass(bulletActiveClass);
    };

    /**
     * 延迟加载图片
     */
    Slider.prototype.loadImage = function () {
        var _this = this,
            $img = _this.$wrapper.find('.slider-item').eq(_this.index).find('img');

        $img.data('load') != 1 && $img.attr('src', $img.data('src')).data('load', 1);
    };

    /**
     * 左右滑动Slider
     * @param speed 移动速度 0：当前是偷偷摸摸的移动啦，生怕给你看见
     * @param x 横向移动宽度
     */
    Slider.prototype.setTranslate = function (speed, x) {
        var _this = this;

        _this.loadImage();

        _this.activeBullet();

        _this.$wrapper.css({
            'transitionDuration': speed + 'ms',
            'transform': 'translate3d(' + x + 'px,0,0)'
        });
    };

    /**
     * 处理滑动一些标识
     */
    Slider.prototype.touches = {
        moveTag: 0, // 移动状态(start,move,end)标记
        startClientX: 0, // 起始拖动坐标
        moveOffset: 0, // 移动偏移量（左右拖动宽度）
        touchStartTime: 0 // 开始触摸的时间点
    };

    /**
     * 开始滑动
     * @param event
     */
    Slider.prototype.onTouchStart = function (event) {
        event.preventDefault();

        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        var _this = this,
            itemNums = _this.itemNums;

        if (_this.touches.moveTag == 0) {
            _this.touches.moveTag = 1;

            // 记录鼠标起始拖动位置
            _this.touches.startClientX = event.clientX;
            // 记录开始触摸时间
            _this.touches.touchStartTime = Date.now();

            if (_this.index == 0) {
                _this.index = itemNums;
                _this.setTranslate(0, -itemNums * _this.$wrapper.width());
                return;
            }
            console.log(_this.index, itemNums);
            if (_this.index > itemNums) {

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

        // 拖动偏移量
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
            speed = _this.options.speed,
            _width = _this.$wrapper.width(),
            moveOffset = _this.touches.moveOffset;

        if (_this.touches.moveTag == 2) {
            _this.touches.moveTag = 0;

            // 计算开始触摸到结束触摸时间，用以计算是否需要滑至下一页
            var timeDiff = Date.now() - _this.touches.touchStartTime;

            // 拖动时间超过300毫秒或者未拖动超过内容一半
            if (timeDiff > 300 && Math.abs(moveOffset) <= _this.$wrapper.width() * .5) {
                // 弹回去
                _this.setTranslate(speed, -_this.index * _this.$wrapper.width());
            } else {
                // --为左移，++为右移
                _this.setTranslate(speed, -((moveOffset > 0 ? --_this.index : ++_this.index) * _width));
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

    // 直接给Data API方式绑定事件
    $(win).on('load', function () {
        $('[data-ydui-slider]').each(function () {
            var $this = $(this);
            $this.slider(win.YDUI.util.parseOptions($this.data('ydui-slider')));
        });
    });

    $.fn.slider = Plugin;

}(jQuery, window);