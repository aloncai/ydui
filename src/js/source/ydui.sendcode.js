!function (win, $) {

    var doc = win.document, SPACE = ' ';

    function SendCode(options) {
        /**
         * 点击按钮
         * @type {Element}
         */
        this.btn = doc.querySelector(options.btn);
        /**
         * 倒计时时长（秒）
         * @type {number|*}
         */
        this.times = options.times || 60;
        /**
         * 禁用按钮样式
         * @type {string|*}
         */
        this.disClass = options.disClass || '';
        /**
         * 倒计时显示文本
         * @type {string|*}
         */
        this.runStr = options.runStr || '{%ss} 秒后重新获取';
        /**
         * 倒计时结束后按钮显示文本
         * @type {string|*}
         */
        this.resetStr = options.resetStr || '重新获取验证码';
        /**
         * 定时器
         * @type {null}
         */
        this.timer = null;
    }

    /**
     * 开始倒计时
     */
    SendCode.prototype.start = function () {
        var self = this, secs = this.times;
        self.btn.innerHTML = self.getStr(secs);
        self.btn.style.cssText = 'pointer-events: none';
        self.addClass(self.btn, self.disClass);

        self.timer = setInterval(function () {
            secs--;
            self.btn.innerHTML = self.getStr(secs);
            if (secs <= 0) {
                self.resetBtn();
                clearInterval(self.timer);
            }
        }, 1000);
    };

    /**
     * 获取倒计时显示文本
     * @param secs
     * @returns {string}
     */
    SendCode.prototype.getStr = function (secs) {
        return this.runStr.replace(/\{([^{]*?)%ss(.*?)\}/g, secs);
    };

    /**
     * 重置按钮
     */
    SendCode.prototype.resetBtn = function () {
        var self = this;
        self.btn.innerHTML = self.resetStr;
        self.btn.style.cssText = 'pointer-events: auto';
        self.removeClass(self.btn, self.disClass);
    };

    /**
     * 添加样式
     * @param el
     * @param cls
     */
    SendCode.prototype.addClass = function (el, cls) {
        var className = el && el.className;
        if (el) {
            className = (SPACE + className + SPACE);
            !~className.indexOf(SPACE + cls + SPACE) && (el.className = (className + cls).trim());
        }
    };

    /**
     * 移除样式
     * @param el
     * @param cls
     */
    SendCode.prototype.removeClass = function (el, cls) {
        var className = el && el.className;

        if (className) {
            className = (SPACE + className + SPACE).replace(SPACE + cls + SPACE, SPACE);
            el.className = className.trim();
        }
    };

    $.SendCode = SendCode;

}(window, YDUI);