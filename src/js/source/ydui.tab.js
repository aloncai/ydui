!function (win, $) {

    function Tab(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Tab.DEFAULTS, options || {});
        this.init();
        this.bindEvent();
    }

    Tab.DEFAULTS = {
        nav: '.tab-nav-item',
        panel: '.tab-panel-item',
        activeClass: 'tab-active'
    };

    Tab.prototype.init = function () {
        var _this = this;
        var $element = _this.$element;
        _this.$nav = $element.find(_this.options.nav);
        _this.$panel = $element.find(_this.options.panel);
    };

    Tab.prototype.bindEvent = function () {
        var _this = this;
        _this.$nav.each(function (e) {
            $(this).on('click.ydui.tab', function () {
                _this.show(e);
            });
        });
    };

    Tab.prototype.show = function (index) {
        var _this = this;

        var $curNav = _this.$nav.eq(index);

        // 如果切换动画进行时或者当前二次点击 禁止重复操作
        if (_this.transitioning || $curNav.hasClass(_this.options.activeClass))return;

        var e = $.Event('open.ydui.tab', {
            index: index
        });

        $curNav.trigger(e);

        // 给tab导航添加选中样式
        _this.active($curNav, _this.$nav);

        // 给tab内容添加选中样式
        _this.active(_this.$panel.eq(index), _this.$panel, function () {
            $curNav.trigger({
                type: 'opened.ydui.tab',
                index: index
            });
        });
    };

    Tab.prototype.active = function ($element, $container, callback) {
        var _this = this,
            activeClass = _this.options.activeClass;

        _this.transitioning = true; // 用于动画进行中禁止再次触发

        var $avtive = $container.filter('.' + activeClass);

        // 判断动画执行完毕后回调
        $element.one('webkitTransitionEnd', function () {
            $.type(callback) == 'function' && callback();
            _this.transitioning = false;
        }).emulateTransitionEnd(150);

        $avtive.removeClass(activeClass);
        $element.addClass(activeClass);
    };

    function Plugin(option) {
        return this.each(function () {
            new Tab($(this), option);
        });
    }

    $(win).on('load', function () {
        $('[data-ydui-tab]').each(function () {
            var $this = $(this);
            $this.tab(win.YDUI.util.parseOptions($this.data('data-ydui-tab')));
        });
    });

    $.fn.tab = Plugin;

}(window, jQuery);