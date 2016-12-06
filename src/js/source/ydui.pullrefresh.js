/**
 * PullRefresh
 */
!function (window) {
    "use strict";

    function PullRefresh (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, PullRefresh.DEFAULTS, options || {});
        this.init();
    }

    PullRefresh.DEFAULTS = {
        loadListFn: null,
        initLoad: true,
        dragDistance: 100,
        dragTxt: '按住下拉',
        doneTxt: '松开刷新',
        loadingTxt: '加载中...'
    };

    PullRefresh.prototype.init = function () {
        var _this = this;

        _this.$dragTip = $('<div class="list-dragtip"><span>' + _this.options.dragTxt + '</span></div>');

        _this.$element.after(_this.$dragTip);

        _this.offsetTop = _this.$element.offset().top;

        _this.initTip();

        _this.bindEvent();

        _this.options.initLoad && _this.checkLoad();
    };

    PullRefresh.prototype.bindEvent = function () {
        var _this = this;

        _this.$element.on('touchstart.ydui.pullrefresh', function (e) {
            _this.onTouchStart(e);
        }).on('touchmove.ydui.pullrefresh', function (e) {
            _this.onTouchMove(e);
        }).on('touchend.ydui.pullrefresh', function (e) {
            _this.onTouchEnd(e);
        });

        _this.stopWeixinDrag();
    };

    PullRefresh.prototype.touches = {
        loading: false,
        startClientY: 0,
        moveOffset: 0,
        isDraging: false
    };

    PullRefresh.prototype.stopWeixinDrag = function () {
        var _this = this;
        $(document.body).on('touchmove.ydui.pullrefresh', function (event) {
            _this.touches.isDraging && event.preventDefault();
        });
    };

    PullRefresh.prototype.onTouchStart = function (event) {
        var _this = this;

        if (_this.touches.loading) {
            event.preventDefault();
            return;
        }

        if (_this.$element.offset().top < _this.offsetTop) {
            return;
        }

        _this.touches.startClientY = event.originalEvent.touches[0].clientY;
    };

    PullRefresh.prototype.onTouchMove = function (event) {
        var _this = this,
            _touches = event.originalEvent.touches[0];

        if (_this.touches.loading) {
            event.preventDefault();
            return;
        }

        if (_this.touches.startClientY > _touches.clientY || _this.$element.offset().top < _this.offsetTop || _this.touches.loading) {
            return;
        }

        _this.touches.isDraging = true;

        _this.$dragTip.show().find('span').addClass('down');

        var deltaSlide = _touches.clientY - _this.touches.startClientY;

        if (deltaSlide >= _this.options.dragDistance) {
            _this.$dragTip.find('span').addClass('up').text(_this.options.doneTxt);
            deltaSlide = _this.options.dragDistance;
        }
        _this.touches.moveOffset = deltaSlide;

        _this.moveDragTip(deltaSlide);
    };

    PullRefresh.prototype.onTouchEnd = function (event) {

        var _this = this,
            touches = _this.touches;

        if (touches.loading) {
            event.preventDefault();
            return;
        }

        if (_this.$element.offset().top < _this.offsetTop) {
            return;
        }

        _this.$dragTip.addClass('list-draganimation');

        if (touches.moveOffset >= _this.options.dragDistance) {
            _this.checkLoad();
            return;
        }

        _this.touches.isDraging = false;

        _this.resetDragTipTxt();

        _this.moveDragTip(0);
    };

    PullRefresh.prototype.checkLoad = function () {
        var _this = this,
            touches = _this.touches;

        touches.loading = true;

        _this.$dragTip.find('span').removeClass('down up').text(_this.options.loadingTxt);

        typeof _this.options.loadListFn == 'function' && _this.options.loadListFn().done(function () {
            touches.isDraging = false;
            touches.loading = false;
            _this.resetDragTipTxt();
            _this.moveDragTip(0);
            touches.moveOffset = 0;
        });
    };

    PullRefresh.prototype.resetDragTipTxt = function () {
        var _this = this;

        _this.$dragTip.one('webkitTransitionEnd.ydui.pullrefresh', function () {
            $(this).removeClass('list-draganimation').hide().find('span').removeClass('down up').text(_this.options.dragTxt);
        }).emulateTransitionEnd(150);
    };

    PullRefresh.prototype.moveDragTip = function (y) {
        this.$dragTip.css({'transform': 'translate3d(0,' + y + 'px,0)'});
    };

    PullRefresh.prototype.initTip = function () {
        var _this = this,
            ls = window.localStorage;

        if (ls.getItem('LIST-PULLREFRESH-TIP') == 'YDUI')return;

        _this.$tip = $('<div class="list-draghelp"><div><span>下拉更新</span></div></div>');

        _this.$tip.on('click.ydui.pullrefresh', function () {
            $(this).remove();
        });

        _this.$element.after(_this.$tip);
        ls.setItem('LIST-PULLREFRESH-TIP', 'YDUI');

        setTimeout(function () {
            _this.$tip.remove();
        }, 5000);
    };

    function Plugin (option) {
        return this.each(function () {
            var self = this;
            new PullRefresh(self, option);
        });
    }

    $.fn.pullRefresh = Plugin;

}(window);
