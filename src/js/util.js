/**
 * @extends jQuery 2.1.1
 * @fileOverview YDUI 移动端工具类
 * @author Surging
 * @email surging2@qq.com
 * @version 0.1.1
 * @date 2015/11/25
 * Copyright (c) 2014-2016
 *
 */
!function (win, $) {
    'use strict';

    var ydui = win.YDUI = win.YDUI || {},
        util = ydui.util = ydui.util || {};

    /**
     * 确认提示框
     * @param title
     * @param mes
     * @param callback
     * @param txtArr
     * @constructor
     */
    util.confirm = function (title, mes, callback, txtArr) {
        title = title || '提示';
        mes = mes || '确认要删除吗？';

        var t1 = '取消';
        var t2 = '确定';
        if (txtArr instanceof Array) {
            t1 = txtArr[0] || '取消';
            t2 = txtArr[1] || '确定';
        }
        var $str = $(
            '<div>' +
            '    <div class="mask-black"></div>' +
            '    <div class="m-confirm">' +
            '        <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
            '        <div class="confirm-bd">' + mes + '</div>' +
            '        <div class="confirm-ft">' +
            '            <a href="javascript:;" class="confirm-btn default" id="J_ConfirmCancel">' + t1 + '</a>' +
            '            <a href="javascript:;" class="confirm-btn primary" id="J_ConfirmEnter">' + t2 + '</a>' +
            '        </div>' +
            '    </div>' +
            '</div>');

        $str.remove();

        $('body').append($str);
        $('#J_ConfirmCancel').on('click', function () {
            $str.remove();
        });
        $('#J_ConfirmEnter').on('click', function () {
            typeof callback === 'function' && callback();
            $str.remove();
        });
    };

    /**
     * 弹出警示框
     * @param title     提示标题
     * @param mes       提示文字
     * @param callback  回调函数
     */
    util.alert = function (title, mes, callback) {
        var $str = $(
            '<div>' +
            '    <div class="mask-black"></div>' +
            '    <div class="m-confirm m-alert">' +
            '        <div class="confirm-bd">' + mes + '</div>' +
            '        <div class="confirm-ft">' +
            '            <a href="javascript:;" class="confirm-btn primary" id="J_ConfirmEnter">确定</a>' +
            '        </div>' +
            '    </div>' +
            '</div>');

        $str.remove();

        $('body').append($str);

        $('#J_ConfirmEnter').on('click', function () {
            typeof callback === 'function' && callback();
            $str.remove();
        });
    };

    /**
     * 弹出提示层
     * @param mes       提示文字
     * @param timeout   多久后消失 毫秒
     * @param type      类型 succes error
     * @param callback  回调函数
     */
    util.tipMes = function (mes, type, timeout, callback) {
        var ico = type == 'error' ? 'tipmes-error-ico' : 'tipmes-success-ico';
        var $str = $(
            '<div>' +
            '    <div class="mask-white"></div>' +
            '    <div class="m-tipmes">' +
            '        <div class="' + ico + '"></div>' +
            '        <p class="tipmes-content">' + mes + '</p>' +
            '    </div>' +
            '</div>');

        $str.remove();

        $('body').append($str);
        var inter = setTimeout(function () {
            $str.remove();
            clearTimeout(inter);
            typeof callback === 'function' && callback();
        }, (timeout || 2000) + 100);//100为动画时间
    };

    /**
     * 加载中
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
        '</div>');

        $str.remove();

        $('body').append($str);
    };

    /**
     * 移除加载中
     */
    util.hideLoading = function () {
        $('#J_ToastLoading').remove();
    };

    /**
     * 节流
     * @param method
     * @param context
     */
    util.throttle = function (method, context) {
        clearTimeout(method.tid);
        method.tid = setTimeout(function () {
            method.call(context);
        }, 200);
    };

    /**
     * 时间补零
     * @param i
     * @returns {*}
     */
    util.checkTime = function (i) {
        return i < 10 ? '0' + i : i;
    };

    /**
     * 转换时间
     * @param format 时间格式 {%d天}{%h时}{%m分}{%s秒}{%f毫秒}
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
     * @param op 操作符string + - * /
     * @returns {Object} arg1 乘 arg2的精确结果
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
     * 整型转IP
     * @param num
     * @returns {string}
     */
    util.int2IP = function (num) {
        var str;
        var tt = [];
        tt[0] = (num >>> 24) >>> 0;
        tt[1] = ((num << 8) >>> 24) >>> 0;
        tt[2] = (num << 16) >>> 24;
        tt[3] = (num << 24) >>> 24;
        str = String(tt[0]) + '.' + String(tt[1]) + '.' + String(tt[2]) + '.' + String(tt[3]);
        return str;
    };

    /**
     * 读取图片文件 并返回图片的base64 img
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
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = win.location.search.substr(1).match(reg);
        if (r != null)return decodeURIComponent(r[2]);
        return '';
    };

    /**
     * 判读是否支持本地存储
     * @returns {boolean}
     */
    util.isSupportStorage = function () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    };

    /**
     * 本地存储(一个参数为get,两个参数为set)
     * @param key 键
     * @param value 值
     */
    util.localStorage = function (key, value) {
        if (isSupportStorage) {
            var ls = win.localStorage;
            if (arguments.length >= 2) {
                ls.setItem(key, value);
            } else {
                return ls.getItem(key);
            }
        }
    };

    /**
     * Session存储(一个参数为get,两个参数为set)
     * @param key 键
     * @param value 值
     */
    util.sessionStorage = function (key, value) {
        if (isSupportStorage) {
            var ls = win.sessionStorage;
            if (arguments.length >= 2) {
                ls.setItem(key, value);
            } else {
                return ls.getItem(key);
            }
        }
    };

    /**
     * 删除本地存储
     * @param key
     * @returns {boolean|*}
     */
    util.removeSessionStorage = function (key) {
        return isSupportStorage && sessionStorage.removeItem(key);
    };

    /**
     * 获取 Cookie
     * @param  {String} name
     * @return {String}
     */
    util.getCookie = function (name) {
        var m = win.document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
        return (m && m[1]) ? decodeURIComponent(m[1]) : '';
    };

    /**
     * 设置 Cookie
     * @param {String}  name
     * @param {String}  val
     * @param {Number} expires 单位（小时）
     * @param {String}  domain
     * @param {String}  path
     * @param {Boolean} secure
     */
    util.setCookie = function (name, val, expires, domain, path, secure) {
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
    };

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

    var getUA = util.getUA();
    var isSupportStorage = util.isSupportStorage();
    win.isWeixin = util.isWeixin();
    win.isIOS = util.isIOS();

}(window, jQuery);