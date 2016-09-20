/**
 * LazyLoad
 * @example $(selector).find("img").lazyLoad();
 */
!function ($, win) {
    "use strict";

    function LazyLoad (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, LazyLoad.DEFAULTS, options || {});
        this.init();
    }

    LazyLoad.DEFAULTS = {
        attr: 'data-url',
        $container: $(win),
        placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'
    };

    LazyLoad.prototype.init = function () {
        var _this = this;

        _this.bindImgEvent();

        _this.loadImg();

        _this.options.$container.on('scroll', function () {
            _this.loadImg();
        });

        $(win).on('resize', function () {
            _this.loadImg();
        });
    };

    /**
     * 加载图片
     */
    LazyLoad.prototype.loadImg = function () {
        var _this = this,
            options = _this.options;

        var contentHeight = options.$container.height(),
            contentTop = options.$container.get(0) === win ? $(win).scrollTop() : options.$container.offset().top;

        _this.$element.each(function () {
            var $img = $(this);

            var post = $img.offset().top - contentTop,
                posb = post + $img.height();

            // 判断是否位于可视区域内
            if ((post >= 0 && post < contentHeight) || (posb > 0 && posb <= contentHeight)) {
                $img.trigger('appear.ydui.lazyload');
            }
        });
    };

    /**
     * 给所有图片绑定单次自定义事件
     */
    LazyLoad.prototype.bindImgEvent = function () {
        var _this = this,
            options = _this.options;

        _this.$element.each(function () {
            var $img = $(this);

            // 若未填写img src则默认给个小小小小小小的图标
            if ($img.is("img") && !$img.attr("src")) {
                $img.attr("src", options.placeholder);
            }

            $img.one("appear.ydui.lazyload", function () {
                if ($img.is("img")) {
                    $img.attr("src", $img.attr(options.attr));
                }
            });
        });
    };

    function Plugin (option) {
        var $this = $(this),
            lazyload = $this.data('ydui.lazyload');

        if (!lazyload) {
            $this.data('ydui.lazyload', new LazyLoad(this, option));
        }
    }

    $.fn.lazyLoad = Plugin;

}(jQuery, window);