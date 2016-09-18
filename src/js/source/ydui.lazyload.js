/**
 * LazyLoad for Mobile
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
        container: $(win)
    };

    LazyLoad.prototype.init = function () {
        var _this = this;

        _this.cache = _this.getCache();

        _this.loadimg();

        _this.options.container.on('scroll', function () {
            _this.loadimg();
        });

        $(win).on('resize', function () {
            _this.loadimg();
        });
    };

    /**
     * 将所有图片存起来
     * @returns {Array}
     */
    LazyLoad.prototype.getCache = function () {
        var _this = this,
            _cache = [];

        _this.$element.each(function () {
            var $this = $(this);

            var data = {
                $img: $this,
                tag: $this[0].tagName.toLowerCase(),
                url: $this.attr(_this.options["attr"])
            };
            _cache.push(data);
        });

        return _cache;
    };

    /**
     * 判断图片在可视区域就加载出来
     */
    LazyLoad.prototype.loadimg = function () {
        var _this = this,
            options = _this.options;

        var contHeight = options.container.height(),
            contop = options.container.get(0) === win ? $(win).scrollTop() : options.container.offset().top;

        var _cache = _this.cache;

        _this.$element.each(function () {
            var $this = $(this);

            $this.one('loadfuck', function () {

            });
        });

        // TODO 采取one事件绑定方案 禁止遍历多个
        $.each(_cache, function (key, data) {
            var $img = data.$img,
                tag = data.tag,
                url = data.url;

            $img.one('loadfuck', function () {

            });

            if ($img && tag == "img" && url) {
                var post = $img.offset().top - contop,
                    posb = post + $img.height();

                // 判断是否位于可视区域内
                if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                    $img.attr("src", url);
                    data.$img = null;
                }
            }
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