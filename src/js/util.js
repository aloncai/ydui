/**
 * @extends jquery 2.1.1
 * @fileOverview YDUI 移动端工具类
 * @author Surging
 * @email surging2@qq.com
 * @version 0.1
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
     * @constructor
     */
    util.confirm = function (title, mes, callback) {
        title = title || '提示';
        mes = mes || '确认要删除吗？';
        var $str = $(
            '<div>' +
            '    <div class="mask-black"></div>' +
            '    <div class="m-confirm">' +
            '        <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
            '        <div class="confirm-bd">' + mes + '</div>' +
            '        <div class="confirm-ft">' +
            '            <a href="javascript:;" class="confirm-btn default" id="J_ConfirmCancel">取消</a>' +
            '            <a href="javascript:;" class="confirm-btn primary" id="J_ConfirmEnter">确定</a>' +
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
            '    <div class="m-confirm alert">' +
            '        <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
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
     * 转换时间
     * @param ts 单位 秒
     * @returns {string}
     */
    util.timestampTotime = function (ts) {
        var _this = this,
            dd = _this.checkTime(parseInt(ts / 60 / 60 / 24, 10)),
            hh = _this.checkTime(parseInt(ts / 60 / 60 % 24, 10)),
            mm = _this.checkTime(parseInt(ts / 60 % 60, 10)),
            ss = _this.checkTime(parseInt(ts % 60, 10));
        return ts <= 0 ? '已过期' : (dd > 0 ? dd + '天' : '') + (hh > 0 ? hh + '时' : '') + (mm > 0 ? mm + '分' : '') + (ss > 0 ? ss + '秒' : '');
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
     * 时间补零
     * @param i
     * @returns {*}
     */
    util.checkTime = function (i) {
        if (i < 10) {
            i = '0' + i;
        }
        return i;
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
     * 判读是否支持localStorage本地存储
     * @returns {boolean}
     */
    util.supportLocalStorage = function () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    };

    /**
     * 设置HTML5本地存储 IE8+
     * @param key
     * @param value
     */
    util.setLocalStorage = function (key, value) {
        if (this.supportLocalStorage()) {
            try {
                localStorage.removeItem(key);
                localStorage.setItem(key, value);
            } catch (e) {
                throw e;
            }
        }
    };

    /**
     * 获取HTML5本地存储 IE8+
     * @param key
     * @returns {*}
     */
    util.getLocalStorage = function (key) {
        if (this.supportLocalStorage()) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                return '';
            }
        }
        return '';
    };

    /**
     * 删除HTML5本地存储 IE8+
     * @param key
     * @returns {boolean|*}
     */
    util.removeLocalStorage = function (key) {
        return this.supportLocalStorage() && localStorage.removeItem(key);
    };

    /**
     * 设置HTML5本地存储 IE8+
     * @param key
     * @param value
     */
    util.setSessionStorage = function (key, value) {
        if (this.supportLocalStorage()) {
            try {
                sessionStorage.removeItem(key);
                sessionStorage.setItem(key, value);
            } catch (e) {
                throw e;
            }
        }
    };

    /**
     * 获取HTML5本地存储 IE8+
     * @param key
     * @returns {*}
     */
    util.getSessionStorage = function (key) {
        if (this.supportLocalStorage()) {
            try {
                return sessionStorage.getItem(key);
            } catch (e) {
                return '';
            }
        }
        return '';
    };

    /**
     * 删除HTML5本地存储 IE8+
     * @param key
     * @returns {boolean|*}
     */
    util.removeSessionStorage = function (key) {
        return this.supportLocalStorage() && sessionStorage.removeItem(key);
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
        var ua = util.getUA();
        return !!ua.match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in win.document.documentElement;
    };

    /**
     * 是否IOS终端
     * @returns {boolean}
     */
    util.isIOS = function () {
        var ua = util.getUA();
        return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    };

    /**
     * 是否微信端
     * @returns {boolean}
     */
    util.isWeixin = function () {
        var ua = util.getUA();
        return ua.indexOf('MicroMessenger') > -1;
    };
}(window, jQuery);