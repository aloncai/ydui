/**
 * ydui
 */
!function (window) {
    "use strict";

    var doc = window.document,
        ydui = {};

    /**
     * 直接绑定FastClick
     */
    $(window).on('load', function () {
        typeof FastClick == 'function' && FastClick.attach(doc.body);
    });

    ydui.util = {
        /**
         * 格式化参数
         * @param string
         */
        parseOptions: function (string) {
            if ($.isPlainObject(string)) {
                return string;
            }

            var start = (string ? string.indexOf('{') : -1),
                options = {};

            if (start != -1) {
                try {
                    options = (new Function('', 'var json = ' + string.substr(start) + '; return JSON.parse(JSON.stringify(json));'))();
                } catch (e) {
                }
            }
            return options;
        },
        /**
         * 页面滚动方法【移动端】
         * @type {{lock, unlock}}
         * lock：禁止页面滚动, unlock：释放页面滚动
         */
        pageScroll: function () {
            var fn = function (e) {
                e.preventDefault();
                e.stopPropagation();
            };
            var islock = false;

            return {
                lock: function () {
                    if (islock)return;
                    islock = true;
                    doc.addEventListener('touchmove', fn);
                },
                unlock: function () {
                    islock = false;
                    doc.removeEventListener('touchmove', fn);
                }
            };
        }()
    };

    /**
     * 判断css3动画是否执行完毕
     * @git http://blog.alexmaccaw.com/css-transitions
     * @param duration
     */
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false,
            $el = this;

        $(this).one('webkitTransitionEnd', function () {
            called = true;
        });

        var callback = function () {
            if (!called) $($el).trigger('webkitTransitionEnd');
        };

        setTimeout(callback, duration);
    };

    if (typeof define === 'function') {
        define(ydui);
    } else {
        window.YDUI = ydui;
    }

}(window);
/**
 * ActionSheet
 */
!function (window) {
    "use strict";

    var doc = window.document,
        $doc = $(doc),
        $body = $(doc.body),
        $mask = $('<div class="mask-black"></div>');

    function ActionSheet (element, closeElement) {
        this.$element = $(element);
        this.closeElement = closeElement;
        this.toggleClass = 'actionsheet-toggle';
    }

    ActionSheet.prototype.open = function () {
        var _this = this;
        $body.append($mask);

        // 点击遮罩层关闭窗口
        $mask.on('click.ydui.actionsheet.mask', function () {
            _this.close();
        });

        // 第三方关闭窗口操作
        if (_this.closeElement) {
            $doc.on('click.ydui.actionsheet', _this.closeElement, function () {
                _this.close();
            });
        }

        _this.$element.addClass(_this.toggleClass).trigger('open.ydui.actionsheet');
    };

    ActionSheet.prototype.close = function () {
        var _this = this;
        $mask.off('click.ydui.actionsheet.mask').remove();
        _this.$element.removeClass(_this.toggleClass).trigger('close.ydui.actionsheet');
        //$doc.off('click.ydui.actionsheet', _this.closeElement);
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                actionsheet = $this.data('ydui.actionsheet');

            if (!actionsheet) {
                $this.data('ydui.actionsheet', (actionsheet = new ActionSheet(this, option.closeElement)));
                if (!option || typeof option == 'object') {
                    actionsheet.open();
                }
            }

            if (typeof option == 'string') {
                actionsheet[option] && actionsheet[option].apply(actionsheet, args);
            }
        });
    }

    $doc.on('click.ydui.actionsheet.data-api', '[data-ydui-actionsheet]', function (e) {
        e.preventDefault();

        var options = window.YDUI.util.parseOptions($(this).data('ydui-actionsheet')),
            $target = $(options.target),
            option = $target.data('ydui.actionsheet') ? 'open' : options;

        Plugin.call($target, option);
    });

    $.fn.actionSheet = Plugin;

}(window);
/**
 * 解决:active这个高端洋气的CSS伪类不能使用问题
 */
!function (window) {
    window.document.addEventListener('touchstart', function (event) {
        /* do nothing */
    }, false);
}(window);
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
/**
 * CitySelect
 */
!function (window) {
    "use strict";

    function CitySelect (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, CitySelect.DEFAULTS, options || {});
        this.init();
    }

    CitySelect.DEFAULTS = {
        provance: '.provance',
        city: '.city',
        area: '.area',
        d_provance: '',
        d_city: '',
        d_area: ''
    };

    CitySelect.prototype.init = function () {
        var _this = this,
            options = _this.options;

        _this.$provance = $(options.provance, _this.$element);
        _this.$city = $(options.city, _this.$element);
        _this.$area = $(options.area, _this.$element);

        if (typeof yduiCitys == 'undefined') {
            console.error('请在ydui.js前引入ydui.citys.js。下载地址：http://static.ydcss.com/uploads/ydui/ydui.citys.js');
            return;
        }

        _this.citys = yduiCitys;

        var _defaultProvance = _this.$provance.data('default');
        var _defaultCity = _this.$city.data('default');
        var _defaultArea = _this.$area.data('default');

        if (_defaultProvance)
            options.d_provance = _defaultProvance;

        if (_defaultCity)
            options.d_city = _defaultCity;

        if (_defaultArea)
            options.d_area = _defaultArea;

        _this.loadProvance();

        _this.bindEvent();
    };

    CitySelect.prototype.bindEvent = function () {
        var _this = this;

        !!_this.$city[0] && _this.$provance.on('change', function () {
            _this.loadCity();
        });
        !!_this.$area[0] && _this.$city.on('change', function () {
            _this.loadArea();
        });
    };

    CitySelect.prototype.loadProvance = function () {
        var _this = this,
            options = _this.options;

        var arr = [];
        $.each(_this.citys, function (k, v) {
            arr.push($('<option value="' + v.n + '" ' + (options.d_provance && v.n.indexOf(options.d_provance) > -1 ? 'selected' : '') + '>' + v.n + '</option>').data('city', v.c));
        });
        _this.$provance.html(arr);
        _this.$city.length > 0 && _this.loadCity();
    };

    CitySelect.prototype.loadCity = function () {
        var _this = this,
            options = _this.options;

        var arr = [];
        $.each(_this.$provance.find('option:selected').data('city'), function (k, v) {
            arr.push($('<option value="' + v.n + '" ' + (options.d_city && v.n.indexOf(options.d_city) > -1 ? 'selected' : '') + '>' + v.n + '</option>').data('area', v.a));
        });
        _this.$city.html(arr);
        _this.$area.length > 0 && _this.loadArea();
    };

    CitySelect.prototype.loadArea = function () {
        var _this = this,
            options = _this.options;

        var arr = [];
        $.each(_this.$city.find('option:selected').data('area'), function (k, v) {
            arr.push($('<option value="' + v + '" ' + (options.d_area && v.indexOf(options.d_area) > -1 ? 'selected' : '') + '>' + v + '</option>'));
        });
        _this.$area.html(arr);
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                citySelect = $this.data('ydui.citySelect');

            if (!citySelect) {
                $this.data('ydui.citySelect', (citySelect = new CitySelect(this, option)));
            }

            if (typeof option == 'string') {
                citySelect[option] && citySelect[option].apply(citySelect, args);
            }
        });
    }

    // 直接给Data API方式绑定事件
    $(window).on('load', function () {
        $('[data-ydui-cityselect]').each(function () {
            var $this = $(this);
            $this.citySelect(window.YDUI.util.parseOptions($this.data('ydui-cityselect')));
        });
    });

    $.fn.citySelect = Plugin;
}(window);
/**
 * device
 */
!function (window) {
    var doc = window.document,
        ydui = window.YDUI,
        ua = window.navigator && window.navigator.userAgent || '';

    var ipad = !!ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = !!ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && !!ua.match(/(iPhone\sOS)\s([\d_]+)/);

    ydui.device = {
        /**
         * 是否移动终端
         * @return {Boolean}
         */
        isMobile: !!ua.match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in doc.documentElement,
        /**
         * 是否IOS终端
         * @returns {boolean}
         */
        isIOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        /**
         * 是否Android终端
         * @returns {boolean}
         */
        isAndroid: !!ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        /**
         * 是否ipad终端
         * @returns {boolean}
         */
        isIpad: ipad,
        /**
         * 是否ipod终端
         * @returns {boolean}
         */
        isIpod: ipod,
        /**
         * 是否iphone终端
         * @returns {boolean}
         */
        isIphone: iphone,
        /**
         * 是否webview
         * @returns {boolean}
         */
        isWebView: (iphone || ipad || ipod) && !!ua.match(/.*AppleWebKit(?!.*Safari)/i),
        /**
         * 是否微信端
         * @returns {boolean}
         */
        isWeixin: ua.indexOf('MicroMessenger') > -1,
        /**
         * 设备像素比
         */
        pixelRatio: window.devicePixelRatio || 1
    };
}(window);
/**
 * dialog
 */
!function (window, ydui) {
    "use strict";

    var dialog = ydui.dialog = ydui.dialog || {},
        $body = $(window.document.body);

    /**
     * 确认提示框
     * @param title 标题String 【可选】
     * @param mes   内容String 【必填】
     * @param opts  按钮们Array 或 “确定按钮”回调函数Function 【必填】
     * @constructor
     */
    dialog.confirm = function (title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if (typeof arguments[1] != 'function' && args == 2 && !arguments[1] instanceof Array) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (args == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div id="' + ID + '">' +
            '   <div class="mask-black"></div>' +
            '   <div class="m-confirm">' +
            '       <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
            '       <div class="confirm-bd">' + mes + '</div>' +
            '   </div>' +
            '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');

        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }

            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function () {
                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });

        $dom.find('.m-confirm').append($btnBox);

        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };

    /**
     * 弹出警示框
     * @param mes       提示文字String 【必填】
     * @param callback  回调函数Function 【可选】
     */
    dialog.alert = function (mes, callback) {

        var ID = 'YDUI_ALERT';

        $('#' + ID).remove();

        var $dom = $('' +
            '<div id="' + ID + '">' +
            '   <div>' +
            '       <div class="mask-black"></div>' +
            '       <div class="m-confirm m-alert">' +
            '           <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
            '           <div class="confirm-ft">' +
            '               <a href="javascript:;" class="confirm-btn primary">确定</a>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        ydui.util.pageScroll.lock();

        $body.append($dom);

        $dom.find('a').on('click', function () {
            $dom.remove();
            ydui.util.pageScroll.unlock();
            typeof callback === 'function' && callback();
        });
    };

    /**
     * 弹出提示层
     */
    dialog.toast = function () {
        var timer = null;
        /**
         * @param mes       提示文字String 【必填】
         * @param type      类型String success or error 【必填】
         * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
         * @param callback  回调函数Function 【可选】
         */
        return function (mes, type, timeout, callback) {

            clearTimeout(timer);

            var ID = 'YDUI_TOAST';

            $('#' + ID).remove();

            var args = arguments.length;
            if (args < 2) {
                console.error('From YDUI\'s toast: Please set two or more parameters!!!');
                return;
            }

            var $dom = $('' +
                '<div id="' + ID + '">' +
                '   <div class="mask-white"></div>' +
                '   <div class="m-toast">' +
                '       <div class="' + (type == 'error' ? 'toast-error-ico' : 'toast-success-ico') + '"></div>' +
                '       <p class="toast-content">' + (mes || '') + '</p>' +
                '   </div>' +
                '</div>');

            ydui.util.pageScroll.lock();

            $body.append($dom);

            if (typeof timeout === 'function' && arguments.length >= 3) {
                callback = timeout;
                timeout = 2000;
            }

            timer = setTimeout(function () {
                clearTimeout(timer);
                ydui.util.pageScroll.unlock();
                $dom.remove();
                typeof callback === 'function' && callback();
            }, (~~timeout || 2000) + 100);//100为动画时间
        };
    }();

    /**
     * 顶部提示层
     */
    dialog.notify = function () {

        var timer = null;

        /**
         * @param mes       提示文字String 【必填】
         * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
         */
        return function (mes, timeout, callback) {

            clearTimeout(timer);

            var ID = 'YDUI_NOTIFY';

            $('#' + ID).remove();

            var $dom = $('<div id="' + ID + '"><div class="m-notify">' + (mes || '') + '</div></div>');

            $body.append($dom);

            var next = function () {
                $dom.remove();
                typeof callback == 'function' && callback();
            };

            var closeNotify = function () {
                clearTimeout(timer);

                $dom.find('.m-notify').addClass('notify-out');

                $dom.one('webkitTransitionEnd', next).emulateTransitionEnd(150);
            };

            $dom.on('click', closeNotify);

            if (~~timeout > 0) {
                timer = setTimeout(closeNotify, timeout + 200);
            }
        }
    }();

    /**
     * 加载中提示框
     */
    dialog.loading = function () {

        var ID = 'YDUI_LOADING';

        return {
            /**
             * 加载中 - 显示
             * @param text 显示文字String 【可选】
             */
            open: function (text) {
                $('#' + ID).remove();

                var $dom = $('' +
                    '<div id="' + ID + '">' +
                    '    <div class="mask-white"></div>' +
                    '    <div class="m-loading">' +
                    '        <div class="loading-hd">' +
                    '            <div class="loading-leaf loading-leaf-0"></div>' +
                    '            <div class="loading-leaf loading-leaf-1"></div>' +
                    '            <div class="loading-leaf loading-leaf-2"></div>' +
                    '            <div class="loading-leaf loading-leaf-3"></div>' +
                    '            <div class="loading-leaf loading-leaf-4"></div>' +
                    '            <div class="loading-leaf loading-leaf-5"></div>' +
                    '            <div class="loading-leaf loading-leaf-6"></div>' +
                    '            <div class="loading-leaf loading-leaf-7"></div>' +
                    '            <div class="loading-leaf loading-leaf-8"></div>' +
                    '            <div class="loading-leaf loading-leaf-9"></div>' +
                    '            <div class="loading-leaf loading-leaf-10"></div>' +
                    '            <div class="loading-leaf loading-leaf-11"></div>' +
                    '        </div>' +
                    '        <p class="loading-txt">' + (text || '数据加载中') + '</p>' +
                    '    </div>' +
                    '</div>').remove();

                ydui.util.pageScroll.lock();
                $body.append($dom);
            },
            /**
             * 加载中 - 隐藏
             */
            close: function () {
                ydui.util.pageScroll.unlock();
                $('#' + ID).remove();
            }
        };
    }();
}(window, YDUI);
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 *
 * Update: Only supports IOS devices.
 */
!function () {
    'use strict';

    /**
     * Instantiate fast-clicking listeners on the specified layer.
     *
     * @constructor
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    function FastClick (layer, options) {

        var oldOnClick;

        options = options || {};

        /**
         * Whether a click is currently being tracked.
         *
         * @type boolean
         */
        this.trackingClick = false;


        /**
         * Timestamp for when click tracking started.
         *
         * @type number
         */
        this.trackingClickStart = 0;


        /**
         * The element being tracked for a click.
         *
         * @type EventTarget
         */
        this.targetElement = null;


        /**
         * X-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartX = 0;


        /**
         * Y-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartY = 0;


        /**
         * Touchmove boundary, beyond which a click will be cancelled.
         *
         * @type number
         */
        this.touchBoundary = options.touchBoundary || 10;


        /**
         * The FastClick layer.
         *
         * @type Element
         */
        this.layer = layer;

        /**
         * The minimum time between tap(touchstart and touchend) events
         *
         * @type number
         */
        this.tapDelay = options.tapDelay || 200;

        /**
         * The maximum time for a tap
         *
         * @type number
         */
        this.tapTimeout = options.tapTimeout || 700;

        // Some old versions of Android don't have Function.prototype.bind
        function bind (method, context) {
            return function () {
                return method.apply(context, arguments);
            };
        }


        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }

        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);

        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
        // layer when they are cancelled.
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function (type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };

            layer.addEventListener = function (type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
                            if (!event.propagationStopped) {
                                callback(event);
                            }
                        }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }

        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (typeof layer.onclick === 'function') {

            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
            // - the old one won't work if passed to addEventListener directly.
            oldOnClick = layer.onclick;
            layer.addEventListener('click', function (event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }

    /**
     * iOS requires exceptions.
     *
     * @type boolean
     */
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);

    /**
     * iOS 6.0-7.* requires the target element to be manually derived
     *
     * @type boolean
     */
    var deviceIsIOSWithBadTarget = /OS [6-7]_\d/.test(navigator.userAgent);

    /**
     * Determine whether a given element requires a native click.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element needs a native click
     */
    FastClick.prototype.needsClick = function (target) {

        switch (target.nodeName.toLowerCase()) {

            // Don't send a synthetic click to disabled inputs (issue #62)
            case 'button':
            case 'select':
            case 'textarea':
                if (target.disabled) {
                    return true;
                }

                break;
            case 'input':

                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                if (target.type === 'file' || target.disabled) {
                    return true;
                }

                break;
            case 'label':
            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
            case 'video':
                return true;
        }

        return (/\bneedsclick\b/).test(target.className);
    };

    /**
     * Determine whether a given element requires a call to focus to simulate click into element.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
     */
    FastClick.prototype.needsFocus = function (target) {
        switch (target.nodeName.toLowerCase()) {
            case 'textarea':
            case 'select':
                return true;
            case 'input':
                switch (target.type) {
                    case 'button':
                    case 'checkbox':
                    case 'file':
                    case 'image':
                    case 'radio':
                    case 'submit':
                        return false;
                }

                // No point in attempting to focus disabled inputs
                return !target.disabled && !target.readOnly;
            default:
                return (/\bneedsfocus\b/).test(target.className);
        }
    };

    /**
     * Send a click event to the specified element.
     *
     * @param {EventTarget|Element} targetElement
     * @param {Event} event
     */
    FastClick.prototype.sendClick = function (targetElement, event) {
        var clickEvent, touch;

        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }

        touch = event.changedTouches[0];

        // Synthesise a click event, with an extra attribute so it can be tracked
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };

    /**
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.focus = function (targetElement) {
        var length;

        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
        var unsupportedType = ['date', 'time', 'month', 'number', 'email'];
        if (targetElement.setSelectionRange && unsupportedType.indexOf(targetElement.type) === -1) {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };

    /**
     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
     *
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.updateScrollParent = function (targetElement) {
        var scrollParent, parentElement;

        scrollParent = targetElement.fastClickScrollParent;

        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
        // target element was moved to another parent.
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }

                parentElement = parentElement.parentElement;
            } while (parentElement);
        }

        // Always update the scroll top tracker if possible.
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };

    /**
     * @param {EventTarget} eventTarget
     * @returns {Element|EventTarget}
     */
    FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {

        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }

        return eventTarget;
    };

    /**
     * On touch start, record the position and scroll offset.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchStart = function (event) {
        var targetElement, touch, selection;

        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
        if (event.targetTouches.length > 1) {
            return true;
        }

        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];

        // Only trusted events will deselect text on iOS (issue #49)
        selection = window.getSelection();
        if (selection.rangeCount && !selection.isCollapsed) {
            return true;
        }

        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            event.preventDefault();
        }

        return true;
    };

    /**
     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.touchHasMoved = function (event) {
        var touch = event.changedTouches[0], boundary = this.touchBoundary;

        return Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary;
    };

    /**
     * Update the last position.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchMove = function (event) {
        if (!this.trackingClick) {
            return true;
        }

        // If the touch has moved, cancel the click tracking
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }

        return true;
    };

    /**
     * Attempt to find the labelled control for the given label element.
     *
     * @param {EventTarget|HTMLLabelElement} labelElement
     * @returns {Element|null}
     */
    FastClick.prototype.findControl = function (labelElement) {

        // Fast path for newer browsers supporting the HTML5 control attribute
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }

        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }

        // If no for attribute exists, attempt to retrieve the first labellable descendant element
        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
    };

    /**
     * On touch end, determine whether to send a click event at once.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchEnd = function (event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

        if (!this.trackingClick) {
            return true;
        }

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }

        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
            return true;
        }

        // Reset to prevent wrong click cancel on input (issue #156).
        this.cancelNextClick = false;

        this.lastClickTime = event.timeStamp;

        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;

        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
        // is performing a transition or scroll, and has to be re-detected manually. Note that
        // for this to function correctly, it must be called *after* the event target is checked!
        // See issue #57; also filed as rdar://13048589 .
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];

            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }

        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {

            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
            if ((event.timeStamp - trackingClickStart) > 100 || (window.top !== window && targetTagName === 'input')) {
                this.targetElement = null;
                return false;
            }

            this.focus(targetElement);
            this.sendClick(targetElement, event);

            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
            if (targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
            }

            return false;
        }


        // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
        // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
        scrollParent = targetElement.fastClickScrollParent;
        if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
            return true;
        }

        // Prevent the actual click from going though - unless the target node is marked as requiring
        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }

        return false;
    };

    /**
     * On touch cancel, stop tracking the click.
     *
     * @returns {void}
     */
    FastClick.prototype.onTouchCancel = function () {
        this.trackingClick = false;
        this.targetElement = null;
    };

    /**
     * Determine mouse events which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onMouse = function (event) {

        // If a target element was never set (because a touch event was never fired) allow the event
        if (!this.targetElement) {
            return true;
        }

        if (event.forwardedTouchEvent) {
            return true;
        }

        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }

        // Derive and check the target element to see whether the mouse event needs to be permitted;
        // unless explicitly enabled, prevent non-touch click events from triggering actions,
        // to prevent ghost/doubleclicks.
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

            // Prevent any user-added listeners declared on FastClick element from being fired.
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {

                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
            }

            // Cancel the event
            event.stopPropagation();

            return false;
        }

        // If the mouse event is permitted, return true for the action to go through.
        return true;
    };

    /**
     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
     * an actual click which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onClick = function (event) {
        var permitted;

        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }

        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }

        permitted = this.onMouse(event);

        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
        if (!permitted) {
            this.targetElement = null;
        }

        // If clicks are permitted, return true for the action to go through.
        return permitted;
    };

    /**
     * Remove all FastClick's event listeners.
     *
     * @returns {void}
     */
    FastClick.prototype.destroy = function () {
        var layer = this.layer;
        layer.removeEventListener('click', this.onClick, true);
        layer.removeEventListener('touchstart', this.onTouchStart, false);
        layer.removeEventListener('touchmove', this.onTouchMove, false);
        layer.removeEventListener('touchend', this.onTouchEnd, false);
        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
    };

    /**
     * Factory method for creating a FastClick object
     *
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    FastClick.attach = function (layer, options) {
        if (deviceIsIOS) {
            return new FastClick(layer, options);
        }
    };

    window.FastClick = FastClick;
}();
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

        $binder.on('scroll', function () {

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
/**
 * KeyBoard
 */
!function (window) {
    "use strict";

    var $body = $(window.document.body),
        isMobile = !!(window.navigator && window.navigator.userAgent || '').match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in window.document.documentElement,
        triggerEvent = isMobile ? 'touchstart' : 'click';

    function KeyBoard (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, KeyBoard.DEFAULTS, options || {});
        this.init();
    }

    KeyBoard.DEFAULTS = {
        disorder: false,
        title: '安全键盘'
    };

    KeyBoard.prototype.init = function () {
        var _this = this;

        _this.inputNums = '';

        _this.toggleClass = 'keyboard-show';

        function getDot () {
            var s = '';
            for (var i = 0; i < 6; i++) {
                s += '<li><i></i></li>';
            }
            return s;
        }

        var hd = '' +
            '<div class="keyboard-head"><strong>输入数字密码</strong></div>' +
            '<div class="keyboard-error"></div>' +
            '<ul class="keyboard-password J_FillPwdBox">' + getDot() + '</ul>';

        var ft = '' +
            '<div class="keyboard-title">' + _this.options.title + '</div>' +
            '<ul class="keyboard-numbers"></ul>';

        _this.$element.prepend(hd).append(ft);

        _this.$numsBox = _this.$element.find('.keyboard-numbers');

        _this.$mask = $('<div class="mask-black"></div>');
    };

    /**
     * 打开键盘窗口
     */
    KeyBoard.prototype.open = function () {
        var _this = this,
            $element = _this.$element,
            $numsBox = _this.$numsBox;

        $element.addClass(_this.toggleClass);

        if (_this.options.disorder || $numsBox.data('loaded-nums') != 1) {
            $numsBox.data('loaded-nums', 1).html(_this.createNumsHtml());
        }

        // 显示遮罩层
        $body.append(_this.$mask);

        _this.bindEvent();
    };

    /**
     * 关闭键盘窗口
     */
    KeyBoard.prototype.close = function () {
        var _this = this;

        _this.$mask.remove();
        _this.$element.removeClass(_this.toggleClass);
        _this.unbindEvent();

        _this.inputNums = '';
        _this.fillPassword();

        _this.clearError();
    };

    /**
     * 事件绑定
     */
    KeyBoard.prototype.bindEvent = function () {
        var _this = this,
            $element = _this.$element;

        // 遮罩层
        _this.$mask.on(triggerEvent + '.ydui.keyboard.mask', function (e) {
            e.preventDefault();
            _this.close();
        });

        // 数字
        $element.on(triggerEvent + '.ydui.keyboard.nums', '.J_Nums', function (e) {
            e.preventDefault();

            if (_this.inputNums.length >= 6)return;

            _this.inputNums = _this.inputNums + $(this).html();

            _this.clearError();
            _this.fillPassword();
        });

        // 退格
        $element.on(triggerEvent + '.ydui.keyboard.backspace', '.J_Backspace', function (e) {
            e.preventDefault();
            _this.backspace();
        });

        // 取消
        $element.on(triggerEvent + '.ydui.keyboard.cancel', '.J_Cancel', function (e) {
            e.preventDefault();
            _this.close();
        });
    };

    /**
     * 解绑事件
     */
    KeyBoard.prototype.unbindEvent = function () {
        this.$element.off(triggerEvent + '.ydui.keyboard');
        $(window).off('hashchange.ydui.keyboard');
    };

    /**
     * 填充密码
     */
    KeyBoard.prototype.fillPassword = function () {
        var _this = this,
            inputNums = _this.inputNums,
            length = inputNums.length;

        var $li = _this.$element.find('.J_FillPwdBox').find('li');
        $li.find('i').hide();
        $li.filter(':lt(' + length + ')').find('i').show();

        if (length >= 6) {
            _this.$element.trigger($.Event('done.ydui.keyboard', {
                password: inputNums
            }));
        }
    };

    /**
     * 清空错误信息
     */
    KeyBoard.prototype.clearError = function () {
        this.$element.find('.keyboard-error').html('');
    };

    /**
     * 提示错误信息
     * @param mes
     */
    KeyBoard.prototype.error = function (mes) {
        var _this = this;
        _this.$element.find('.keyboard-error').html(mes);

        // 重置已输入的数字以便清空显示的点点点
        _this.inputNums = '';
        _this.fillPassword();
    };

    /**
     * 退格处理
     */
    KeyBoard.prototype.backspace = function () {
        var _this = this;

        var _inputNums = _this.inputNums;
        if (_inputNums) {
            _this.inputNums = _inputNums.substr(0, _inputNums.length - 1);
        }

        _this.fillPassword();
    };

    /**
     * 创建键盘HTML
     * @returns {string}
     */
    KeyBoard.prototype.createNumsHtml = function () {
        var _this = this,
            nums = _this.createNums();

        _this.options.disorder && _this.upsetOrder(nums);

        var arr = [];
        $.each(nums, function (k) {
            if (k % 3 == 0) {
                if (k >= nums.length - 2) {
                    arr.push('<li><a href="javascript:;" class="J_Cancel">取消</a>' + nums.slice(k, k + 3).join('') + '<a href="javascript:;" class="J_Backspace"></a></li>');
                } else {
                    arr.push('<li>' + nums.slice(k, k + 3).join('') + '</li>');
                }
            }
        });

        return arr.join('');
    };

    /**
     * 创建键盘数字
     * @returns {Array} DOM数组
     */
    KeyBoard.prototype.createNums = function () {
        var _this = this;
        var disorder = _this.options.disorder;

        if (disorder && _this.cacheNums) {
            return _this.cacheNums;
        }

        var strArr = [];
        for (var i = 1; i <= 10; i++) {
            strArr.push('<a href="javascript:;" class="J_Nums">' + (i % 10) + '</div>');
        }

        if (!disorder) {
            _this.cacheNums = strArr;
        }

        return strArr;
    };

    /**
     * 打乱数组顺序
     * @param arr 数组
     * @returns {*}
     */
    KeyBoard.prototype.upsetOrder = function (arr) {
        var floor = Math.floor,
            random = Math.random,
            len = arr.length, i, j, temp,
            n = floor(len / 2) + 1;
        while (n--) {
            i = floor(random() * len);
            j = floor(random() * len);
            if (i !== j) {
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        return arr;
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {

            var $this = $(this),
                keyboard = $this.data('ydui.keyboard');

            if (!keyboard) {
                $this.data('ydui.keyboard', (keyboard = new KeyBoard(this, option)));
            }

            if (typeof option == 'string') {
                keyboard[option] && keyboard[option].apply(keyboard, args);
            }
        });
    }

    $.fn.keyBoard = Plugin;

}(window);
/**
 * LazyLoad
 * @example $(selector).find("img").lazyLoad();
 */
!function (window) {
    "use strict";

    function LazyLoad (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, LazyLoad.DEFAULTS, options || {});
        this.init();
    }

    LazyLoad.DEFAULTS = {
        attr: 'data-url',
        binder: window,
        placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQIHWN4BQAA7ADrKJeAMwAAAABJRU5ErkJggg=='
    };

    LazyLoad.prototype.init = function () {
        var _this = this;

        _this.bindImgEvent();

        _this.loadImg();

        $(_this.options.binder).on('scroll', function () {
            _this.loadImg();
        });

        $(window).on('resize', function () {
            _this.loadImg();
        });
    };

    /**
     * 加载图片
     */
    LazyLoad.prototype.loadImg = function () {
        var _this = this,
            options = _this.options,
            $binder = $(options.binder);

        var contentHeight = $binder.height(),
            contentTop = $binder.get(0) === window ? $(window).scrollTop() : $binder.offset().top;

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

    $.fn.lazyLoad = function (option) {
        new LazyLoad(this, option);
    };

}(window);
/**
 * ProgressBar
 * Refer to: https://github.com/kimmobrunfeldt/progressbar.js.git
 */
!function (window) {
    "use strict";

    var doc = window.document,
        util = window.YDUI.util;

    function Circle (element, options) {
        this.pathTemplate = 'M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}';
        ProgressBar.apply(this, arguments);
    }

    Circle.prototype = new ProgressBar();

    Circle.prototype.getPathString = function (widthOfWider) {
        var _this = this,
            r = 50 - widthOfWider / 2;
        return _this.render(_this.pathTemplate, {
            radius: r,
            '2radius': r * 2
        });
    };

    Circle.prototype.initSvg = function (svg) {
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.style.display = 'block';
        svg.style.width = '100%';
    };

    function Line (element, options) {
        this.pathTemplate = 'M 0,{center} L 100,{center}';
        ProgressBar.apply(this, arguments);
    }

    Line.prototype = new ProgressBar();

    Line.prototype.getPathString = function (widthOfWider) {
        var _this = this;
        return _this.render(_this.pathTemplate, {
            center: widthOfWider / 2
        });
    };

    Line.prototype.initSvg = function (svg, options) {
        svg.setAttribute('viewBox', '0 0 100 ' + options.strokeWidth);
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.style.width = '100%';
        svg.style.height = '100%';
    };

    function ProgressBar (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, ProgressBar.DEFAULTS, options || {});
    }

    ProgressBar.DEFAULTS = {
        type: 'circle',
        strokeWidth: 0,
        strokeColor: '#E5E5E5',
        trailWidth: 0,
        trailColor: '#646464',
        fill: '',
        progress: 0,
        delay: true,
        container: window
    };

    ProgressBar.prototype.set = function (progress) {

        var _this = this,
            length = _this.trailPath.getTotalLength();

        if (!progress) progress = _this.options.progress;
        if (progress > 1)progress = 1;

        _this.trailPath.style.strokeDashoffset = length - progress * length;
    };

    ProgressBar.prototype.appendView = function () {
        var _this = this,
            options = _this.options,
            progress = options.progress,
            svgView = _this.createSvgView(),
            $element = _this.$element;

        _this.$container = options.container === window || options.container == 'window' ? $(window) : $(options.container);

        var path = svgView.trailPath,
            length = path.getTotalLength();

        path.style.strokeDasharray = length + ' ' + length;

        var $svg = $(svgView.svg);
        $svg.one('appear.ydui.progressbar', function () {
            _this.set(progress);
        });
        $element.append($svg);

        if (options.delay) {
            _this.checkInView($svg);

            _this.$container.on('scroll', function () {
                _this.checkInView($svg);
            });

            $(window).on('resize', function () {
                _this.checkInView($svg);
            });
        } else {
            $svg.trigger('appear.ydui.progressbar');
        }

        return this;
    };

    ProgressBar.prototype.checkInView = function ($svg) {

        var _this = this,
            $container = _this.$container,
            contentHeight = $container.height(),
            contentTop = $container.get(0) === window ? $(window).scrollTop() : $container.offset().top;

        var post = $svg.offset().top - contentTop,
            posb = post + $svg.height();

        if ((post >= 0 && post < contentHeight) || (posb > 0 && posb <= contentHeight)) {
            $svg.trigger('appear.ydui.progressbar');
        }
    };

    ProgressBar.prototype.createSvgView = function () {
        var _this = this,
            options = _this.options;

        var svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
        _this.initSvg(svg, options);

        var path = _this.createPath(options);
        svg.appendChild(path);

        var trailPath = null;
        if (options.trailColor || options.trailWidth) {
            trailPath = _this.createTrailPath(options);
            trailPath.style.strokeDashoffset = trailPath.getTotalLength();
            svg.appendChild(trailPath);
        }

        _this.svg = svg;
        _this.trailPath = trailPath;

        return {
            svg: svg,
            trailPath: trailPath
        }
    };

    ProgressBar.prototype.createTrailPath = function (options) {

        var _this = this;

        if (options.trailWidth == 0) {
            options.trailWidth = options.strokeWidth;
        }

        var pathString = _this.getPathString(options.trailWidth);

        return _this.createPathElement(pathString, options.trailColor, options.trailWidth);
    };

    ProgressBar.prototype.createPath = function (options) {
        var _this = this,
            width = options.strokeWidth;

        if (options.trailWidth && options.trailWidth > options.strokeWidth) {
            width = options.trailWidth;
        }

        var pathString = _this.getPathString(width);
        return _this.createPathElement(pathString, options.strokeColor, options.strokeWidth, options.fill);
    };

    ProgressBar.prototype.createPathElement = function (pathString, color, width, fill) {

        var path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathString);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', width);

        if (fill) {
            path.setAttribute('fill', fill);
        } else {
            path.setAttribute('fill-opacity', '0');
        }

        return path;
    };

    ProgressBar.prototype.render = function (template, vars) {
        var rendered = template;

        for (var key in vars) {
            if (vars.hasOwnProperty(key)) {
                var val = vars[key];
                var regExpString = '\\{' + key + '\\}';
                var regExp = new RegExp(regExpString, 'g');

                rendered = rendered.replace(regExp, val);
            }
        }

        return rendered;
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                progressbar = $this.data('ydui.progressbar');

            if (!progressbar) {
                if (option.type == 'line') {
                    $this.data('ydui.progressbar', (progressbar = new Line(this, option)));
                } else {
                    $this.data('ydui.progressbar', (progressbar = new Circle(this, option)));
                }
                if (!option || typeof option == 'object') {
                    progressbar.appendView();
                }
            }

            if (typeof option == 'string') {
                progressbar[option] && progressbar[option].apply(progressbar, args);
            }
        });
    }

    $('[data-ydui-progressbar]').each(function () {
        var $this = $(this);

        Plugin.call($this, util.parseOptions($this.data('ydui-progressbar')));
    });

    $.fn.progressBar = Plugin;

}(window);
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
        loadFunction: null,
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

        _this.$element.on('touchstart', function (e) {
            _this.onTouchStart(e);
        }).on('touchmove', function (e) {
            _this.onTouchMove(e);
        }).on('touchend', function (e) {
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
        $(document.body).on('touchmove', function (event) {
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

        typeof _this.options.loadFunction == 'function' && _this.options.loadFunction().done(function () {
            touches.isDraging = false;
            touches.loading = false;
            _this.resetDragTipTxt();
            _this.moveDragTip(0);
        });
    };

    PullRefresh.prototype.resetDragTipTxt = function () {
        var _this = this;

        _this.$dragTip.one('webkitTransitionEnd', function () {
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

        _this.$tip.on('click', function () {
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
/**
 * SendCode
 */
!function () {
    "use strict";

    function SendCode (element, options) {
        this.$btn = $(element);
        this.options = $.extend({}, SendCode.DEFAULTS, options || {});
    }

    SendCode.DEFAULTS = {
        run: false, // 是否自动倒计时
        secs: 60, // 倒计时时长（秒）
        disClass: '', // 禁用按钮样式
        runStr: '{%s}秒后重新获取', // 倒计时显示文本
        resetStr: '重新获取验证码' // 倒计时结束后按钮显示文本
    };

    SendCode.timer = null;

    /**
     * 开始倒计时
     */
    SendCode.prototype.start = function () {
        var _this = this,
            options = _this.options,
            secs = options.secs;

        _this.$btn.html(_this.getStr(secs)).css('pointer-events', 'none').addClass(options.disClass);

        _this.timer = setInterval(function () {
            secs--;
            _this.$btn.html(_this.getStr(secs));
            if (secs <= 0) {
                _this.resetBtn();
                clearInterval(_this.timer);
            }
        }, 1000);
    };

    /**
     * 获取倒计时显示文本
     * @param secs
     * @returns {string}
     */
    SendCode.prototype.getStr = function (secs) {
        return this.options.runStr.replace(/\{([^{]*?)%s(.*?)\}/g, secs);
    };

    /**
     * 重置按钮
     */
    SendCode.prototype.resetBtn = function () {
        var _this = this,
            options = _this.options;

        _this.$btn.html(options.resetStr).css('pointer-events', 'auto').removeClass(options.disClass);
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                sendcode = $this.data('ydui.sendcode');

            if (!sendcode) {
                $this.data('ydui.sendcode', (sendcode = new SendCode(this, option)));
                if (typeof option == 'object' && option.run) {
                    sendcode.start();
                }
            }
            if (typeof option == 'string') {
                sendcode[option] && sendcode[option].apply(sendcode, args);
            }
        });
    }

    $.fn.sendCode = Plugin;
}();
/**
 * Slider
 */
!function (window) {
    "use strict";

    function Slider (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Slider.DEFAULTS, options || {});
        this.init();
    }

    Slider.DEFAULTS = {
        speed: 300, // 移动速度
        autoplay: 3000, // 循环时间
        lazyLoad: false, // 是否延迟加载图片 data-src=""
        pagination: '.slider-pagination',
        wrapperClass: 'slider-wrapper',
        slideClass: 'slider-item',
        bulletClass: 'slider-pagination-item',
        bulletActiveClass: 'slider-pagination-item-active'
    };

    /**
     * 初始化
     */
    Slider.prototype.init = function () {
        var _this = this,
            options = _this.options,
            $element = _this.$element;

        _this.index = 1;
        _this.autoPlayTimer = null;
        _this.$pagination = $element.find(options.pagination);
        _this.$wrapper = $element.find('.' + options.wrapperClass);
        _this.itemNums = _this.$wrapper.find('.' + options.slideClass).length;

        options.lazyLoad && _this.loadImage(0);

        _this.createBullet();

        _this.cloneItem().bindEvent();
    };

    /**
     * 绑定事件
     */
    Slider.prototype.bindEvent = function () {
        var _this = this,
            touchEvents = _this.touchEvents();

        _this.$wrapper.find('.' + _this.options.slideClass)
        .on(touchEvents.start, function (e) {
            _this.onTouchStart(e);
        }).on(touchEvents.move, function (e) {
            _this.onTouchMove(e);
        }).on(touchEvents.end, function (e) {
            _this.onTouchEnd(e);
        });

        $(window).on('resize', function () {
            _this.setSlidesSize();
        });

        ~~_this.options.autoplay > 0 && _this.autoPlay();

        _this.$wrapper.on('click', function (e) {
            if (!_this.touches.allowClick) {
                e.preventDefault();
            }
        });
    };

    /**
     * 复制第一个和最后一个item
     * @returns {Slider}
     */
    Slider.prototype.cloneItem = function () {
        var _this = this,
            $wrapper = _this.$wrapper,
            $sliderItem = _this.$wrapper.find('.' + _this.options.slideClass),
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

        var _this = this;

        if (!_this.$pagination[0])return;

        var initActive = '<span class="' + (_this.options.bulletClass + ' ' + _this.options.bulletActiveClass) + '"></span>';

        _this.$pagination.append(initActive + new Array(_this.itemNums).join('<span class="' + _this.options.bulletClass + '"></span>'));
    };

    /**
     * 当前页码标识加高亮
     */
    Slider.prototype.activeBullet = function () {
        var _this = this;

        if (!_this.$pagination[0])return;

        var itemNums = _this.itemNums,
            index = _this.index % itemNums >= itemNums ? 0 : _this.index % itemNums - 1,
            bulletActiveClass = _this.options.bulletActiveClass;

        !!_this.$pagination[0] && _this.$pagination.find('.' + _this.options.bulletClass)
        .removeClass(bulletActiveClass)
        .eq(index).addClass(bulletActiveClass);
    };

    /**
     * 设置item宽度
     */
    Slider.prototype.setSlidesSize = function () {
        var _this = this,
            _width = _this.$wrapper.width();

        _this.$wrapper.css('transform', 'translate3d(-' + _width + 'px,0,0)');
        _this.$wrapper.find('.' + _this.options.slideClass).css({width: _width});
    };

    /**
     * 自动播放
     */
    Slider.prototype.autoPlay = function () {
        var _this = this;

        _this.autoPlayTimer = setInterval(function () {

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
    Slider.prototype.stopAutoplay = function () {
        var _this = this;
        clearInterval(_this.autoPlayTimer);
        return _this;
    };

    /**
     * 延迟加载图片
     * @param index 索引
     */
    Slider.prototype.loadImage = function (index) {
        var _this = this,
            $img = _this.$wrapper.find('.' + _this.options.slideClass).eq(index).find('img'),
            imgsrc = $img.data('src');

        $img.data('load') != 1 && !!imgsrc && $img.attr('src', imgsrc).data('load', 1);
    };

    /**
     * 左右滑动Slider
     * @param speed 移动速度 0：当前是偷偷摸摸的移动啦，生怕给你看见
     * @param x 横向移动宽度
     */
    Slider.prototype.setTranslate = function (speed, x) {
        var _this = this;

        _this.options.lazyLoad && _this.loadImage(_this.index);

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
        touchStartTime: 0, // 开始触摸的时间点
        isTouchEvent: false, // 是否触摸事件
        allowClick: false // 用于判断事件为点击还是拖动
    };

    /**
     * 开始滑动
     * @param event
     */
    Slider.prototype.onTouchStart = function (event) {
        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        var _this = this,
            touches = _this.touches;

        touches.allowClick = true;

        touches.isTouchEvent = event.type === 'touchstart';

        // 鼠标右键
        if (!touches.isTouchEvent && 'which' in event && event.which === 3) return;

        if (touches.moveTag == 0) {
            touches.moveTag = 1;

            // 记录鼠标起始拖动位置
            touches.startClientX = event.clientX;
            // 记录开始触摸时间
            touches.touchStartTime = Date.now();

            var itemNums = _this.itemNums;

            if (_this.index == 0) {
                _this.index = itemNums;
                _this.setTranslate(0, -itemNums * _this.$wrapper.width());
                return;
            }

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

        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        var _this = this,
            touches = _this.touches;

        touches.allowClick = false;

        if (touches.isTouchEvent && event.type === 'mousemove') return;

        // 拖动偏移量
        var deltaSlide = touches.moveOffset = event.clientX - touches.startClientX;

        if (deltaSlide != 0 && touches.moveTag != 0) {

            if (touches.moveTag == 1) {
                _this.stopAutoplay();
                touches.moveTag = 2;
            }
            if (touches.moveTag == 2) {
                _this.setTranslate(0, -_this.index * _this.$wrapper.width() + deltaSlide);
            }
        }
    };

    /**
     * 滑动后
     */
    Slider.prototype.onTouchEnd = function () {
        var _this = this,
            speed = _this.options.speed,
            _width = _this.$wrapper.width(),
            touches = _this.touches,
            moveOffset = touches.moveOffset;

        // 释放a链接点击跳转
        setTimeout(function () {
            touches.allowClick = true;
        }, 0);

        // 短暂点击并未拖动
        if (touches.moveTag == 1) {
            touches.moveTag = 0;
        }

        if (touches.moveTag == 2) {
            touches.moveTag = 0;

            // 计算开始触摸到结束触摸时间，用以计算是否需要滑至下一页
            var timeDiff = Date.now() - touches.touchStartTime;

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
        var supportTouch = (window.Modernizr && !!window.Modernizr.touch) || (function () {
                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            })();

        return {
            start: supportTouch ? 'touchstart' : 'mousedown',
            move: supportTouch ? 'touchmove' : 'mousemove',
            end: supportTouch ? 'touchend' : 'mouseup'
        };
    };

    function Plugin (option) {
        return this.each(function () {

            var $this = $(this),
                slider = $this.data('ydui.slider');

            if (!slider) {
                $this.data('ydui.slider', new Slider(this, option));
            }
        });
    }

    // 直接给Data API方式绑定事件
    $(window).on('load', function () {
        $('[data-ydui-slider]').each(function () {
            var $this = $(this);
            $this.slider(window.YDUI.util.parseOptions($this.data('ydui-slider')));
        });
    });

    $.fn.slider = Plugin;

}(window);
/**
 * Spinner
 */
!function (window) {
    "use strict";

    function Spinner (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Spinner.DEFAULTS, options || {});
        this.init();
    }

    Spinner.DEFAULTS = {
        input: '.J_Input',
        add: '.J_Add',
        minus: '.J_Del',
        unit: 1,
        max: 0,
        callback: null
    };

    Spinner.prototype.init = function () {
        var _this = this,
            options = _this.options;

        _this.$input = $(options.input, _this.$element);
        _this.$add = $(options.add, _this.$element);
        _this.$minus = $(options.minus, _this.$element);

        _this.checkParameters();

        _this.initInputVal();

        _this.bindEvent();
    };

    Spinner.prototype.initInputVal = function () {
        var _this = this,
            options = _this.options,
            v = _this.$input.val();

        _this.$input.val(!v || v % options.unit != 0 ? options.unit : v);
    };

    Spinner.prototype.isNumber = function (val) {
        //return /^([0]|[1-9]\d*)(\.\d{1,2})?$/.test(val);
        return /^\d*$/.test(val);
    };

    Spinner.prototype.FixNumber = function (val) {
        //return parseFloat(val);
        return parseInt(val);
    };

    Spinner.prototype.checkParameters = function () {

        var _this = this,
            options = _this.options;

        var params = [
            {param: 'unit', default: 1},
            {param: 'max', default: 0}
        ];

        $.each(params, function (k, v) {
            var _val = options[v.param],
                _dataVal = _this.$input.data(v.param);

            if (!!_dataVal) {
                _val = _dataVal;
                if (!_this.isNumber(_dataVal)) {
                    _val = options[v.param];
                    if (typeof _val == 'function') {
                        _val = _val();
                    }
                }
            } else {
                if (typeof options[v.param] == 'function') {
                    var _fnVal = options[v.param]();

                    _val = _fnVal;
                    if (!_this.isNumber(_fnVal)) {
                        _val = options[v.param];
                    }
                }
            }

            if (!_this.isNumber(_val)) {
                _val = v.default;
            }

            options[v.param] = _this.FixNumber(_val);
        });
    };

    Spinner.prototype.setValue = function (val) {
        var _this = this,
            options = _this.options,
            max = options.max,
            unit = options.unit;

        val = _this.FixNumber(val);

        if (!_this.isNumber(val)) val = unit;

        if (val > max && max != 0) val = max;

        if (val % unit > 0) {
            val = val - val % unit + unit;
            if (val > max && max != 0) val -= unit;
        }

        if (val < unit) val = unit;

        _this.$input.val(val);

        typeof options.callback == 'function' && options.callback(val, _this.$input);
    };

    Spinner.prototype.bindEvent = function () {
        var _this = this,
            options = _this.options,
            unit = options.unit,
            max = options.max,
            isMobile = !!(window.navigator && window.navigator.userAgent || '').match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in window.document.documentElement,
            triggerEvent = isMobile ? 'touchstart' : 'click';

        _this.$add.on(triggerEvent, function () {
            var $input = _this.$input,
                val = $input.val(),
                temp = _this.FixNumber(val) + unit;

            if ((max != 0 && temp > max) || !!$input.attr('readonly') || !!$input.attr('disabled'))return;
            _this.setValue(temp);
        });

        _this.$minus.on(triggerEvent, function () {
            var $input = _this.$input,
                val = $input.val(),
                temp = val - unit;

            if (temp < unit || !!$input.attr('readonly') || !!$input.attr('disabled'))return;
            _this.setValue(temp);
        });

        _this.$input.on('change', function () {
            _this.setValue($(this).val());
        }).on('keydown', function (event) {
            if (event.keyCode == 13) {
                _this.setValue($(this).val());
                return false;
            }
        });
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                spinner = $this.data('ydui.spinner');

            if (!spinner) {
                $this.data('ydui.spinner', (spinner = new Spinner(this, option)));
            }

            if (typeof option == 'string') {
                spinner[option] && spinner[option].apply(spinner, args);
            }
        });
    }

    // 直接给Data API方式绑定事件
    $(window).on('load', function () {
        $('[data-ydui-spinner]').each(function () {
            var $this = $(this);
            $this.spinner(window.YDUI.util.parseOptions($this.data('ydui-spinner')));
        });
    });

    $.fn.spinner = Plugin;
}(window);
/**
 * Tab
 */
!function (window) {
    "use strict";

    function Tab (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Tab.DEFAULTS, options || {});
        this.init();
        this.bindEvent();
        this.transitioning = false;
    }

    // 150ms 为切换动画执行时间
    Tab.TRANSITION_DURATION = 150;

    Tab.DEFAULTS = {
        nav: '.tab-nav-item',
        panel: '.tab-panel-item',
        activeClass: 'tab-active'
    };

    Tab.prototype.init = function () {
        var _this = this,
            $element = _this.$element;

        _this.$nav = $element.find(_this.options.nav);
        _this.$panel = $element.find(_this.options.panel);
    };

    /**
     * 給选项卡导航绑定点击事件
     */
    Tab.prototype.bindEvent = function () {
        var _this = this;
        _this.$nav.each(function (e) {
            $(this).on('click.ydui.tab', function () {
                _this.open(e);
            });
        });
    };

    /**
     * 打开选项卡
     * @param index 当前导航索引
     */
    Tab.prototype.open = function (index) {
        var _this = this;

        index = typeof index == 'number' ? index : _this.$nav.filter(index).index();

        var $curNav = _this.$nav.eq(index);

        // 如果切换动画进行时或者当前二次点击 禁止重复操作
        if (_this.transitioning || $curNav.hasClass(_this.options.activeClass))return;

        _this.transitioning = true;

        // 打开选项卡时绑定自定义事件
        $curNav.trigger($.Event('open.ydui.tab', {
            index: index
        }));

        // 给tab导航添加选中样式
        _this.active($curNav, _this.$nav);

        // 给tab内容添加选中样式
        _this.active(_this.$panel.eq(index), _this.$panel, function () {
            // 打开选项卡后绑定自定义事件
            $curNav.trigger({
                type: 'opened.ydui.tab',
                index: index
            });
            _this.transitioning = false;
        });
    };

    /**
     * 添加选中样式
     * @param $element 当前需要添加选中样式的对象
     * @param $container 当前对象的同级所有对象
     * @param callback 回调
     */
    Tab.prototype.active = function ($element, $container, callback) {
        var _this = this,
            activeClass = _this.options.activeClass;

        var $avtive = $container.filter('.' + activeClass);

        function next () {
            typeof callback == 'function' && callback();
        }

        // 动画执行完毕后回调
        $element.one('webkitTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION);

        $avtive.removeClass(activeClass);
        $element.addClass(activeClass);
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var target = this,
                $this = $(target),
                tab = $this.data('ydui.tab');

            if (!tab) {
                $this.data('ydui.tab', (tab = new Tab(target, option)));
            }

            if (typeof option == 'string') {
                tab[option] && tab[option].apply(tab, args);
            }
        });
    }

    // 直接给Data API方式绑定事件
    $(window).on('load', function () {
        $('[data-ydui-tab]').each(function () {
            var $this = $(this);
            $this.tab(window.YDUI.util.parseOptions($this.data('ydui-tab')));
        });
    });

    $.fn.tab = Plugin;

}(window);
/**
 * util
 */
!function (window) {
    "use strict";

    var util = window.YDUI.util = window.YDUI.util || {},
        doc = window.document;

    /**
     * 日期格式化
     * @param format 日期格式 {%d天}{%h时}{%m分}{%s秒}{%f毫秒}
     * @param time 单位 毫秒
     * @returns {string}
     */
    util.timestampTotime = function (format, time) {
        var t = {},
            floor = Math.floor;

        t.f = time % 1000;
        time = floor(time / 1000);
        t.s = time % 60;
        time = floor(time / 60);
        t.m = time % 60;
        time = floor(time / 60);
        t.h = time % 24;
        t.d = floor(time / 24);

        var ment = function (a) {
            if (a <= 0) {
                return '';
            }
            return '$1' + (a < 10 ? '0' + a : a) + '$2';
        };

        format = format.replace(/\{([^{]*?)%d(.*?)\}/g, ment(t.d));
        format = format.replace(/\{([^{]*?)%h(.*?)\}/g, ment(t.h));
        format = format.replace(/\{([^{]*?)%m(.*?)\}/g, ment(t.m));
        format = format.replace(/\{([^{]*?)%s(.*?)\}/g, ment(t.s));
        format = format.replace(/\{([^{]*?)%f(.*?)\}/g, ment(t.f));

        return format;
    };

    /**
     * js倒计时
     * @param format 时间格式 {%d}天{%h}时{%m}分{%s}秒{%f}毫秒
     * @param time 结束时间时间戳 毫秒
     * @param speed 速度
     * @param callback ret 倒计时结束回调函数 ret 时间字符 ；ret == '' 则倒计时结束
     * DEMO: YDUI.util.countdown('{%d天}{%h时}{%m分}{%s秒}{%f毫秒}', Date.parse(new Date()) + 60000, 1000, function(ret){ console.log(ret); });
     */
    util.countdown = function (format, time, speed, callback) {
        var that = this;
        var timer = setInterval(function () {
            var l_time = time - new Date().getTime();
            if (l_time > 0) {
                callback(that.timestampTotime(format, l_time));
            } else {
                clearInterval(timer);
                typeof callback == 'function' && callback('');
            }
        }, speed);
    };

    /**
     * js 加减乘除
     * @param arg1 数值1
     * @param op 操作符string 【+ - * /】
     * @param arg2 数值2
     * @returns {Object} arg1 与 arg2运算的精确结果
     */
    util.calc = function (arg1, op, arg2) {
        var ra = 1, rb = 1, m;

        try {
            ra = arg1.toString().split('.')[1].length;
        } catch (e) {
        }
        try {
            rb = arg2.toString().split('.')[1].length;
        } catch (e) {
        }
        m = Math.pow(10, Math.max(ra, rb));

        switch (op) {
            case '+':
            case '-':
                arg1 = Math.round(arg1 * m);
                arg2 = Math.round(arg2 * m);
                break;
            case '*':
                ra = Math.pow(10, ra);
                rb = Math.pow(10, rb);
                m = ra * rb;
                arg1 = Math.round(arg1 * ra);
                arg2 = Math.round(arg2 * rb);
                break;
            case '/':
                arg1 = Math.round(arg1 * m);
                arg2 = Math.round(arg2 * m);
                m = 1;
                break;
        }
        try {
            var result = eval('(' + '(' + arg1 + ')' + op + '(' + arg2 + ')' + ')/' + m);
        } catch (e) {
        }
        return result;
    };

    /**
     * 读取图片文件 并返回图片的DataUrl
     * @param obj
     * @param callback
     */
    util.getImgBase64 = function (obj, callback) {
        var that = this, dataimg = '', file = obj.files[0];
        if (!file)return;
        if (!/image\/\w+/.test(file.type)) {
            that.tipMes('请上传图片文件', 'error');
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            dataimg = this.result;
            typeof callback === 'function' && callback(dataimg);
        };
    };

    /**
     * 获取地址栏参数
     * @param name
     * @returns {*}
     */
    util.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg),
            qs = '';
        if (r != null)qs = decodeURIComponent(r[2]);
        return qs;
    };

    /**
     * 序列化
     * @param value
     * @returns {string}
     */
    util.serialize = function (value) {
        if (typeof value === 'string') return value;
        return JSON.stringify(value);
    };

    /**
     * 反序列化
     * @param value
     * @returns {*}
     */
    util.deserialize = function (value) {
        if (typeof value !== 'string') return undefined;
        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    };

    /**
     * 本地存储
     */
    util.localStorage = function () {
        return storage(window.localStorage);
    }();

    /**
     * Session存储
     */
    util.sessionStorage = function () {
        return storage(window.sessionStorage);
    }();

    /**
     * Cookie
     * @type {{get, set}}
     */
    util.cookie = function () {
        return {
            /**
             * 获取 Cookie
             * @param  {String} name
             * @return {String}
             */
            get: function (name) {
                var m = doc.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
                return (m && m[1]) ? decodeURIComponent(m[1]) : '';
            },
            /**
             * 设置 Cookie
             * @param {String}  name 名称
             * @param {String}  val 值
             * @param {Number} expires 单位（秒）
             * @param {String}  domain 域
             * @param {String}  path 所在的目录
             * @param {Boolean} secure 跨协议传递
             */
            set: function (name, val, expires, domain, path, secure) {
                var text = String(encodeURIComponent(val)),
                    date = expires;

                // 从当前时间开始，多少小时后过期
                if (typeof date === 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + expires * 1000);
                }

                date instanceof Date && (text += '; expires=' + date.toUTCString());

                !!domain && (text += '; domain=' + domain);

                text += '; path=' + (path || '/');

                secure && (text += '; secure');

                doc.cookie = name + '=' + text;
            }
        }
    }();

    /**
     * HTML5存储
     */
    function storage (ls) {
        var _util = util;
        return {
            set: function (key, value) {
                ls.setItem(key, _util.serialize(value));
            },
            get: function (key) {
                return _util.deserialize(ls.getItem(key));
            },
            remove: function (key) {
                ls.removeItem(key);
            },
            clear: function () {
                ls.clear();
            }
        };
    }

}(window);