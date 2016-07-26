/**
 * 发生验证码倒计时
 */
!function (win, $) {

    function SendCode(element, options) {
        /**
         * 点击按钮
         * @type {Element}
         */
        this.$btn = $(element);
        this.run = options.run || false;
        /**
         * 倒计时时长（秒）
         * @type {number|*}
         */
        this.secs = options.secs || 60;
        /**
         * 禁用按钮样式
         * @type {string|*}
         */
        this.disClass = options.disClass || '';
        /**
         * 倒计时显示文本
         * @type {string|*}
         */
        this.runStr = options.runStr || '{%s}秒后重新获取';
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
        var _this = this,
            secs = _this.secs;

        _this.$btn.html(_this.getStr(secs)).css('pointer-events', 'none').addClass(_this.disClass);

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
        return this.runStr.replace(/\{([^{]*?)%s(.*?)\}/g, secs);
    };

    /**
     * 重置按钮
     */
    SendCode.prototype.resetBtn = function () {
        var _this = this;
        _this.$btn.html(_this.resetStr).css('pointer-events', 'auto').removeClass(_this.disClass);
    };

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                sendcode = $this.data('ydui.sendcode');

            if (!sendcode) {
                $this.data('ydui.sendcode', (sendcode = new SendCode(this, option)));
                if ($.type(option) == 'object' && option.run) {
                    sendcode.start();
                }
            }
            if ($.type(option) == 'string') {
                sendcode[option] && sendcode[option].apply(sendcode, args);
            }
        });
    }

    // 给Data API方式调用的添加默认参数
    $(win).on('load', function () {
        $('[data-ydui-sendcode]').each(function () {
            var $this = $(this);
            Plugin.call($this, win.YDUI.util.parseOptions($this.data('ydui-sendcode')));
        });
    });

    $.fn.sendCode = Plugin;

}(window, jQuery);