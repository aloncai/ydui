/**
 * @extends jQuery-2.1.1
 * @fileOverview YDUI 移动端工具类
 * @author Surging
 * @email surging2@qq.com
 * @version 0.1.1
 * @date 2015/11/25
 * Copyright (c) 2014-2016
 *
 */
!function (win) {
    'use strict';

    var util = {};

    /**
     * 确认提示框
     * @param title 标题String 【可选】
     * @param mes   内容String 【必填】
     * @param opts  按钮们Array 或 “确定按钮”回调函数Function 【必填】
     * @constructor
     */
    util.confirm = function (title, mes, opts) {
        var that = this, al = arguments.length;
        if (al < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if (typeof arguments[1] != 'function' && al == 2 && !arguments[1] instanceof Array) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (al == 2) {
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

        var $temp = $();
        $.each(btnArr, function (k, val) {
            var _style = '';
            if (typeof val.color == 'boolean') {
                _style = 'class="confirm-btn ' + (val.color ? 'primary' : 'default') + '"';
            } else if (typeof val.color == 'string') {
                _style = 'style="color: ' + val.color + '"';
            }
            var $btn = $('<a href="javascript:;" ' + _style + '>' + (val.txt || '') + '</a>');
            $btn.on('click', function () {
                if (!val.stay) {
                    that.pageScroll.unlock();
                    $('#J_YDConfirm').remove();
                }
                val.callback && val.callback();
            });
            $temp = $temp.add($btn);
        });

        var $str = $(
            '<div id="J_YDConfirm">' +
            '    <div class="mask-black"></div>' +
            '    <div class="m-confirm">' +
            '        <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
            '        <div class="confirm-bd">' + mes + '</div>' +
            '        <div class="confirm-ft" id="J_YDBtns"></div>' +
            '    </div>' +
            '</div>').remove();

        $str.find('#J_YDBtns').append($temp);

        that.pageScroll.lock();

        $body.append($str);
    };

    /**
     * 弹出警示框
     * @param mes       提示文字String 【必填】
     * @param callback  回调函数Function 【可选】
     */
    util.alert = function (mes, callback) {
        var $str = $(
            '<div>' +
            '    <div class="mask-black"></div>' +
            '    <div class="m-confirm m-alert">' +
            '        <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
            '        <div class="confirm-ft">' +
            '            <a href="javascript:;" class="confirm-btn primary" id="J_AlertEnter">确定</a>' +
            '        </div>' +
            '    </div>' +
            '</div>').remove();

        util.pageScroll.lock();

        $body.append($str);

        $('#J_AlertEnter').on('click', function () {
            $str.remove();
            util.pageScroll.unlock();
            typeof callback === 'function' && callback();
        });
    };

    /**
     * 弹出提示层
     * @param mes       提示文字String 【必填】
     * @param type      类型String success or error 【必填】
     * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
     * @param callback  回调函数Function 【可选】
     */
    util.tipMes = function (mes, type, timeout, callback) {
        var al = arguments.length;
        if (al < 2) {
            console.error('From YDUI\'s tipMes: Please set two or more parameters!!!');
            return;
        }

        var ico = type == 'error' ? 'tipmes-error-ico' : 'tipmes-success-ico';
        var $str = $(
            '<div>' +
            '    <div class="mask-white"></div>' +
            '    <div class="m-tipmes">' +
            '        <div class="' + ico + '"></div>' +
            '        <p class="tipmes-content">' + (mes || '') + '</p>' +
            '    </div>' +
            '</div>').remove();

        util.pageScroll.lock();

        $body.append($str);

        if (typeof timeout === 'function' && arguments.length >= 3) {
            callback = timeout;
            timeout = 2000;
        }

        var inter = setTimeout(function () {
            clearTimeout(inter);
            util.pageScroll.unlock();
            $str.remove();
            typeof callback === 'function' && callback();
        }, (~~timeout || 2000) + 100);//100为动画时间
    };

    /**
     * 加载中
     * @param text 显示文字String 【可选】
     */
    util.showLoading = function (text) {
        var $str = $('' +
        '<div id="J_ToastLoading">' +
        '    <div class="mask-white"></div>' +
        '    <div class="m-loading">' +
        '        <div class="ld-loading">' +
        '            <div class="m-loading-leaf m-loading-leaf-0"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-1"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-2"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-3"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-4"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-5"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-6"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-7"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-8"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-9"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-10"></div>' +
        '            <div class="m-loading-leaf m-loading-leaf-11"></div>' +
        '        </div>' +
        '        <p class="ld-toast-content">' + (text || '数据加载中') + '</p>' +
        '    </div>' +
        '</div>').remove();

        util.pageScroll.lock();
        $body.append($str);
    };

    /**
     * 移除加载中
     */
    util.hideLoading = function () {
        util.pageScroll.unlock();
        $('#J_ToastLoading').remove();
    };

    /**
     * 页面滚动方法
     * @type {{lock, unlock}}
     * lock：禁止页面滚动, unlock：释放页面滚动
     */
    util.pageScroll = function () {
        var fn = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        var islock = false;

        return {
            lock: function () {
                if (islock)return;
                islock = true;
                $(document).on('touchmove', fn);
            },
            unlock: function () {
                islock = false;
                $(document).unbind('touchmove', fn);
            }
        };
    }();

    /**
     * 时间补零
     * @param i
     * @returns {*}
     */
    util.checkTime = function (i) {
        return i < 10 ? '0' + i : i;
    };

    /**
     * 日期格式化
     * @param format 日期格式 {%d天}{%h时}{%m分}{%s秒}{%f毫秒}
     * @param time 单位 毫秒
     * @returns {string}
     */
    util.timestampTotime = function (format, time) {
        var that = this, t = {};
        t.f = time % 1000;
        time = Math.floor(time / 1000);
        t.s = time % 60;
        time = Math.floor(time / 60);
        t.m = time % 60;
        time = Math.floor(time / 60);
        t.h = time % 24;
        t.d = Math.floor(time / 24);

        var ment = function (a) {
            return '$1' + that.checkTime(a) + '$2';
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
     * @param format 时间格式 {%d天}{%h时}{%m分}{%s秒}{%f毫秒}
     * @param time 时间 毫秒
     * @param speed 速度 毫秒
     * @param callback(ret) 倒计时结束回调函数 ret 时间字符 ；ret == '' 则倒计时结束
     * DEMO: YDUI.util.countdown('{%d天}{%h时}{%m分}{%s秒}{%f毫秒}', 60000, 1000, function(ret){ console.log(ret); }
     */
    util.countdown = function (format, time, speed, callback) {
        var that = this, tm = new Date().getTime();
        var timer = setInterval(function () {
            var l_time = time - new Date().getTime() + tm;
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
     * @param arg2 数值2
     * @param op 操作符string 【+ - * /】
     * @returns {Object} arg1 与 arg2运算的精确结果
     */
    util.calc = function (arg1, arg2, op) {
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
            r = win.location.search.substr(1).match(reg),
            qs = '';
        if (r != null)qs = decodeURIComponent(r[2]);
        return qs;
    };

    /**
     * 本地存储
     */
    util.localStorage = function () {
        var ls = win.localStorage;
        return {
            set: function (key, value) {
                ls.setItem(key, value);
            },
            get: function (key) {
                return ls.getItem(key);
            },
            remove: function (key) {
                ls.removeItem(key);
            }
        };
    }();

    /**
     * Session存储
     */
    util.sessionStorage = function () {
        var ls = win.sessionStorage;
        return {
            set: function (key, value) {
                ls.setItem(key, value);
            },
            get: function (key) {
                return ls.getItem(key);
            },
            remove: function (key) {
                ls.removeItem(key);
            }
        };
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
                var m = win.document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
                return (m && m[1]) ? decodeURIComponent(m[1]) : '';
            },
            /**
             * 设置 Cookie
             * @param {String}  name
             * @param {String}  val
             * @param {Number} expires 单位（小时）
             * @param {String}  domain
             * @param {String}  path
             * @param {Boolean} secure
             */
            set: function (name, val, expires, domain, path, secure) {
                var text = String(encodeURIComponent(val)),
                    date = expires;

                // 从当前时间开始，多少小时后过期
                if (typeof date === 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + expires * 60 * 60 * 1000);
                }

                date instanceof Date && (text += '; expires=' + date.toUTCString());

                !!domain && (text += '; domain=' + domain);

                !!path && (text += '; path=' + path);

                secure && (text += '; secure');

                win.document.cookie = name + '=' + text;
            }
        }
    }();

    /**
     * 获取浏览器UA
     * @return {String}
     */
    util.getUA = function () {
        return win.navigator && win.navigator.userAgent || '';
    };

    /**
     * 是否移动终端
     * @return {Boolean}
     */
    util.isMobile = function () {
        return !!getUA.match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in win.document.documentElement;
    };

    /**
     * 是否IOS终端
     * @returns {boolean}
     */
    util.isIOS = function () {
        return !!getUA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    };

    /**
     * 是否微信端
     * @returns {boolean}
     */
    util.isWeixin = function () {
        return getUA.indexOf('MicroMessenger') > -1;
    };

    var $body = $('body');
    var getUA = util.getUA();
    win.isMobile = util.isMobile();
    win.isWeixin = util.isWeixin();
    win.isIOS = util.isIOS();

    // RequireJS && SeaJS && GlightJS
    if (typeof define === 'function') {
        define(['jquery'], util);
    } else {
        var ydui = win.YDUI = win.YDUI || {};
        ydui.util = util;
    }
}(window);