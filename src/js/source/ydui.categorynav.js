/**
 * ScrollTab
 */
!function (window) {
    "use strict";

    function ScrollTab (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, ScrollTab.DEFAULTS, options || {});
        this.init();
    }

    ScrollTab.DEFAULTS = {};

    var fuck = false;
    ScrollTab.prototype.init = function () {
        var _this = this;

        _this.offsetTop = $('.category-content').offset().top;

        var contentHeight = $('.category-content').height();

        $('.category-content').on('resize scroll', function () {
            if (fuck)return;
            $('.category-content-item').each(function () {
                var $this = $(this);
                var post = $this.offset().top;

                if ($('.category-content').scrollTop() == 0) {
                    $('.categroy-item').removeClass('crt').eq(0).addClass('crt');
                    return;
                }

                if ($('.category-content').scrollTop() + 3 >= $('.category-content-item').height() * $('.category-content-item').length - $('.category-content').height()) {
                    $('.categroy-item').removeClass('crt').eq($('.categroy-item').length - 1).addClass('crt');
                    return;
                }

                if (post <= _this.offsetTop) {
                    $('.categroy-item').removeClass('crt').eq($this.index()).addClass('crt');
                }
            });
        });

        $('.categroy-item').on('click', function () {
            var $this = $(this);

            if (fuck)return;
            fuck = true;

            $('.categroy-item').removeClass('crt');
            $this.addClass('crt');

            var offset = $('.category-content-item').eq($this.index()).offset().top;

            var post = offset + $('.category-content').scrollTop();

            offset && $('.category-content').stop().animate({
                scrollTop: post - _this.offsetTop + 1
            }, 200, function () {
                fuck = false;
            });
        });
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var target = this,
                $this = $(target),
                scrollTab = $this.data('ydui.scrollTab');

            if (!scrollTab) {
                $this.data('ydui.scrollTab', (scrollTab = new ScrollTab(target, option)));
            }

            if (typeof option == 'string') {
                scrollTab[option] && scrollTab[option].apply(scrollTab, args);
            }
        });
    }

    $.fn.scrollTab = Plugin;

}(window);