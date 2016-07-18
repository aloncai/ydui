!function (win, $) {

    var doc = win.document,
        SPACE = ' ',
        addClass = function (el, cls) {
            var className = el && el.className;
            if (el) {
                className = (SPACE + className + SPACE);
                !~className.indexOf(SPACE + cls + SPACE) && (el.className = (className + cls).trim());
            }
        }, removeClass = function (el, cls) {
            var className = el && el.className;

            if (className) {
                className = (SPACE + className + SPACE).replace(SPACE + cls + SPACE, SPACE);
                el.className = className.trim();
            }
        };

    function SendCode(options) {
        this.btn = doc.querySelector(options.btn);
        this.times = options.times;
        this.disClass = options.disClass;
        this.timer = null;
    }

    SendCode.init = function (options) {
        return new SendCode(options);
    };

    SendCode.prototype.start = function () {
        var self = this, secs = this.times;
        self.btn.innerHTML = secs + ' 秒后重新获取';
        self.btn.disabled = true;
        addClass(self.btn, self.disClass);

        self.timer = setInterval(function () {
            secs--;
            self.btn.innerHTML = secs + ' 秒后重新获取';
            if (secs <= 0) {
                self.resetBtn();
                clearInterval(self.timer);
            }
        }, 1000);
    };

    SendCode.prototype.resetBtn = function () {
        var self = this;
        self.btn.innerHTML = '重新获取验证码';
        self.btn.disabled = false;
        removeClass(self.btn, self.disClass);
    };

    $.SendCode = SendCode;

}(window, YDUI);