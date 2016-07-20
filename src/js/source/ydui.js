/**
 * ydui
 */
!function (win, $) {
    var ydui = {},
        doc = win.document;

    var getUA = function () {
        return win.navigator && win.navigator.userAgent || '';
    };

    ydui.util = {
        /**
         * 是否移动终端
         * @return {Boolean}
         */
        isMobile: function () {
            return !!getUA.match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in doc.documentElement;
        },
        /**
         * 是否IOS终端
         * @returns {boolean}
         */
        isIOS: function () {
            return !!getUA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        },
        /**
         * 是否微信端
         * @returns {boolean}
         */
        isWeixin: function () {
            return getUA.indexOf('MicroMessenger') > -1;
        },
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
                    options = (new Function('',
                        'var json = ' + string.substr(start) +
                        '; return JSON.parse(JSON.stringify(json));'))();
                } catch (e) {
                }
            }
            return options;
        }
    };

    win.addEventListener('load', function () {
        /* 直接绑定FastClick */
        if (typeof FastClick == 'function') {
            FastClick.attach(doc.body);
        }
    }, false);

    if (typeof define === 'function') {
        define(ydui);
    } else {
        win.YDUI = ydui;
    }

}(window, jQuery);