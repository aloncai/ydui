/**
 * InfiniteScroll
 */
!function (window) {
    "use strict";

    function InfiniteScroll (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, InfiniteScroll.DEFAULTS, options || {});
        this.init();
    }

    InfiniteScroll.DEFAULTS = {
        binder: window,
        initLoad: true,
        pageSize: 0,
        loadFunction: null,
        loadingHtml: '加载中...',
        doneTxt: '没有更多数据了'
    };

    InfiniteScroll.prototype.init = function () {
        var _this = this;

        if (~~_this.options.pageSize <= 0) {
            console.error('[YDUI warn]: 需指定pageSize参数【即每页请求数据的长度】');
            return;
        }

        _this.$element.append(_this.$tag = $('<div class="J_InfiniteScrollTag"></div>'));

        _this.initLoadingTip();

        _this.bindScroll();
    };

    InfiniteScroll.prototype.initLoadingTip = function () {
        var _this = this;

        _this.$element.append(_this.$loading = $('<div class="list-loading">' + _this.options.loadingHtml + '</div>'));
    };

    InfiniteScroll.prototype.bindScroll = function () {

        var _this = this,
            options = _this.options,
            $binder = $(options.binder),
            isWindow = $binder.get(0) === window,
            contentHeight = isWindow ? $(window).height() : $binder.height();

        options.initLoad && _this.checkLoad();

        $binder.on('scroll.ydui.infinitescroll', function () {

            if (_this.loading || _this.isDone)return;

            var contentTop = isWindow ? $(window).scrollTop() : $binder.offset().top;

            // 当浏览器滚动到底部时，此时 _this.$tag.offset().top 等于 contentTop + contentHeight
            if (_this.$tag.offset().top <= contentTop + contentHeight + contentHeight / 10) {
                _this.checkLoad();
            }
        });
    };

    InfiniteScroll.prototype.checkLoad = function () {
        var _this = this,
            options = _this.options;

        _this.loading = true;
        _this.$loading.show();

        typeof options.loadFunction == 'function' && options.loadFunction().done(function (len) {
            if (~~len <= 0) {
                console.error('[YDUI warn]: 需在 resolve() 方法里回传本次获取记录的总数');
                return;
            }

            if (len < options.pageSize) {
                _this.$element.append('<div class="list-donetip">' + options.doneTxt + '</div>');
                _this.isDone = true;
            }
            _this.$loading.hide();
            _this.loading = false;
        });
    };

    function Plugin (option) {
        return this.each(function () {
            new InfiniteScroll(this, option);
        });
    }

    $.fn.infiniteScroll = Plugin;

}(window);