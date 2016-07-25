!function (win, $) {

    function Tab(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Tab.DEFAULTS, options || {});
        this.bindEvent();
    }

    Tab.DEFAULTS = {
        nav: '.tab-nav-item',
        content: '.tab-panel-item',
        activeClass: 'tab-active'
    };

    Tab.prototype.bindEvent = function () {
        var _this = this;

        _this.$element.on('click.ydui.tab', _this.options.nav, function (e) {
            e.preventDefault();
            _this.show($(this));
        });
    };

    Tab.prototype.show = function ($nav) {

        var _this = this;

        var activeIndex = $(_this.options.nav).index($nav);

        _this.active($nav, _this.$element.find('.tab-nav'));
        _this.active($(_this.options.content).eq(activeIndex), _this.$element.find('.tab-panel'));
    };

    Tab.prototype.active = function ($element, $container, callback) {
        var _this = this;
        var activeClass = _this.options.activeClass;

        var $avtive = $container.find('.tab-active');

        $avtive.removeClass(activeClass);
        $element.addClass(activeClass);

    };

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                tab = $this.data('ydui.tab');

            if (!tab) {
                $this.data('ydui.tab', (tab = new Tab($(this), option)));
            }

            if (typeof option == 'string') {
                tab[option] && tab[option].apply(tab, args);
            }
        });
    }

    $(win).on('load', function () {
        $('[data-ydui-tab]').each(function () {
            var $this = $(this);
            $this.tab();
        });
    });

    $.fn.tab = Plugin;

}(window, jQuery);