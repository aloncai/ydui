!function (win, $) {

    var doc = win.document;

    function Tab(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Tab.DEFAULTS, options || {});
        this.init();
    }

    Tab.DEFAULTS = {
        nav: '.tab-nav-item',
        content: '.tab-panel-item',
        crtClass: 'tab-active'
    };

    Tab.prototype.init = function () {
        var _this = this;

        _this.$element.on('click.ydui.tab', _this.options.nav, function (e) {
            e.preventDefault();
            _this.show(this);
        });
    };

    Tab.prototype.show = function (curNav) {
        var _this = this;
        var crtClass = _this.options.crtClass;
        var $nav = _this.$element.find(_this.options.nav);
        var $content = _this.$element.find(_this.options.content);
console.log($(curNav));
        $nav.removeClass(crtClass);
        $(curNav).addClass(crtClass);

        $content.removeClass(crtClass);
        $content.eq($nav.filter('.' + crtClass).index()).addClass(crtClass);
    };

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                tab = $this.data('ydui.tab');

            if (!tab) {
                $this.data('ydui.tab', (tab = new Tab(this, option)));
                //if (typeof option == 'object') {
                //    tab.show();
                //}
            }

            if (typeof option == 'string') {
                tab[option] && tab[option].apply(tab, args);
            }
        });
    }

    $(doc).on('click.ydui.tab', '[data-ydui-tab] .tab-nav-item', function (e) {
        e.preventDefault();
        Plugin.call($(this), 'show');
    });

    $.fn.tab = Plugin;

}(window, jQuery);