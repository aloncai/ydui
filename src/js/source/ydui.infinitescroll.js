/**
 * InfiniteScroll
 */
!function (window) {
    "use strict";

    var util = window.YDUI.util,
        key = 'fuck';

    function InfiniteScroll (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, InfiniteScroll.DEFAULTS, options || {});
        this.init();
    }

    InfiniteScroll.DEFAULTS = {
        binder: window,
        initLoad: true,
        pageSize: 0,
        lazyLoad: true,
        contentBox: '',
        backposition: true,
        loadFunction: null,
        loadingHtml: '加载中...',
        doneTxt: '没有更多数据了',
        loadFormCache: null
    };

    InfiniteScroll.prototype.init = function () {
        var _this = this,
            options = _this.options;

        if (~~options.pageSize <= 0) {
            console.error('[YDUI warn]: 需指定pageSize参数【即每页请求数据的长度】');
            return;
        }

        _this.$element.append(_this.$tag = $('<div class="J_InfiniteScrollTag"></div>'));

        _this.ConOffsetTop = _this.$element.offset().top;

        _this.initLoadingTip();

        _this.bindScroll();

        _this.loadCacheList();

        _this.bindLinkRedirect();
    };

    InfiniteScroll.prototype.initLoadingTip = function () {
        var _this = this;

        _this.$element.append(_this.$loading = $('<div class="list-loading">' + _this.options.loadingHtml + '</div>'));
    };

    InfiniteScroll.prototype.scrollPosition = function () {

        var _this = this,
            $binder = $(_this.options.binder);

        var ff = util.sessionStorage.get(key);

        ff && $binder.stop().animate({scrollTop: ff.offsetTop}, 0, function () {
            _this.scrolling = false;
        });

        _this.bindLinkRedirect();

        util.sessionStorage.remove(key);
    };

    InfiniteScroll.prototype.loadCacheList = function () {
        var _this = this;

        util.pageScroll.lock();

        var storage = util.sessionStorage.get(key);

        if(!storage)return;
        //

        //总需滚动的页码数
        var num = storage.page;

        var listArr = [];

        for (var i = 1; i <= num; i++) {
            var _data = util.sessionStorage.get('LIST' + i);

            var a = {};
            a.page = i;
            a.data = _data;

            listArr.push(a);

            if (i == num && _data.length < _this.options.pageSize) {
                //判断是否处于所有数据加载完毕的状态
                _this.isDone = true;
            }
        }
        _this.options.loadFormCache(listArr, num).done(function () {
            _this.options.backposition && _this.scrollPosition();
        });
    };

    InfiniteScroll.prototype.bindScroll = function () {

        var _this = this,
            options = _this.options,
            $binder = $(options.binder),
            isWindow = $binder.get(0) === window,
            contentHeight = isWindow ? $(window).height() : $binder.height();

        options.initLoad && !util.sessionStorage.get(key) && _this.checkLoad();

        $binder.on('scroll.ydui.infinitescroll', function () {

            if (_this.loading || _this.isDone)return;

            var contentTop = isWindow ? $(window).scrollTop() : $binder.offset().top;

            // 当浏览器滚动到底部时，此时 _this.$tag.offset().top 等于 contentTop + contentHeight
            if (_this.$tag.offset().top <= contentTop + contentHeight + contentHeight / 10) {
                _this.checkLoad();
            }
        });
    };

    InfiniteScroll.prototype.bindLinkRedirect = function () {

        var _this = this;

        $(_this.options.binder).on('click.ydui.infinitescroll', '.J_Link', function (e) {
            e.preventDefault();

            var $this = $(this);

            util.sessionStorage.set(key, {
                offsetTop: $(_this.options.binder).scrollTop() + $this.offset().top - _this.ConOffsetTop,
                page: $this.data('page')
            });

            location.href = $this.attr('href');
        });
    };

    InfiniteScroll.prototype.checkLoad = function () {
        var _this = this,
            options = _this.options;

        _this.loading = true;
        _this.$loading.show();

        typeof options.loadFunction == 'function' && options.loadFunction().done(function (listArr, page) {
            var len = listArr.length;

            if (~~len <= 0) {
                console.error('[YDUI warn]: 需在 resolve() 方法里回传本次获取记录集合');
                return;
            }

            if (len < options.pageSize) {
                _this.$element.append('<div class="list-donetip">' + options.doneTxt + '</div>');
                _this.isDone = true;
            }
            _this.$loading.hide();
            _this.loading = false;

            if (options.backposition) {
                util.sessionStorage.set('LIST' + page, listArr);
            }
        });
    };

    function Plugin (option) {
        return this.each(function () {
            new InfiniteScroll(this, option);
        });
    }

    $.fn.infiniteScroll = Plugin;

}(window);