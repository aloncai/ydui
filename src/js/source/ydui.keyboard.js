/**
 * KeyBoard
 */
!function ($, win) {
    var $body = $(win.document.body);

    function KeyBoard(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, KeyBoard.DEFAULTS, options || {});
        this.init();
    }

    KeyBoard.DEFAULTS = {
        disorder: false,
        title: '安全键盘',
        target: '',
        fuck: true
    };

    KeyBoard.prototype.init = function () {
        var _this = this;

        _this.inputNums = '';

        _this.toggleClass = 'keyboard-show';

        function getDot() {
            var s = '';
            for (var i = 0; i < 6; i++) {
                s += '<li><i></i></li>';
            }
            return s;
        }

        var hd = '' +
            '<div class="keyboard-head"><strong>输入数字密码</strong></div>' +
            '<div class="keyboard-error"></div>' +
            '<ul id="J_Hei" class="keyboard-password">' + getDot() + '</ul>';

        var ft = '' +
            '<div class="keyboard-title">' + _this.options.title + '</div>' +
            '<ul class="keyboard-numbers"></ul>';

        _this.$element.prepend(_this.options.fuck ? hd : '').append(ft);

        _this.$numsBox = _this.$element.find('.keyboard-numbers');

        _this.$mask = $('<div class="mask-black"></div>');
    };

    /**
     * 打开键盘窗口
     * @param options KeyBoard参数 可选
     */
    KeyBoard.prototype.open = function (options) {
        var _this = this,
            $element = _this.$element,
            $numsBox = _this.$numsBox;

        // 处理后事件绑定
        if (options) {
            _this.options = $.extend(KeyBoard.DEFAULTS, options);
        }

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
        _this.$mask.on('click.ydui.keyboard.mask', function (e) {
            e.preventDefault();
            _this.close();
        });

        // 数字
        $element.on('click.ydui.keyboard.nums', '.J_Nums', function (e) {
            e.preventDefault();

            if (_this.inputNums.length >= 6)return;

            _this.inputNums = _this.inputNums + $(this).html();

            _this.clearError();
            _this.fillPassword();
        });

        // 退格
        $element.on('click.ydui.keyboard.backspace', '#J_Backspace', function (e) {
            e.preventDefault();
            _this.backspace();
        });

        // 取消
        $element.on('click.ydui.keyboard.cancel', '#J_Cancel', function (e) {
            e.preventDefault();
            _this.close();
        });

    };

    /**
     * 解绑事件
     */
    KeyBoard.prototype.unbindEvent = function () {
        this.$element.off('click.ydui.keyboard');
        $(win).off('hashchange.ydui.keyboard');
    };

    /**
     * 填充密码
     */
    KeyBoard.prototype.fillPassword = function () {
        var _this = this;
        var length = _this.inputNums.length;

        if (_this.options.target) {
            $(_this.options.target).val(_this.inputNums);
        }

        $('#J_Hei').find('i').hide();
        $('#J_Hei').find('li:lt(' + length + ')').find('i').show();
        if (length >= 6) {
            _this.$element.trigger($.Event('done.ydui.keyboard', {
                val: _this.inputNums
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

        // 重置输入数字以便清空显示的点点点
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
                    arr.push('<li><button type="button" id="J_Cancel">取消</button>' + nums.slice(k, k + 3).join('') + '<button type="button" id="J_Backspace"></button></li>');
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
            strArr.push('<button type="button" class="J_Nums">' + (i % 10) + '</button>');
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

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {

            var $this = $(this),
                keyboard = $this.data('ydui.keyboard');

            if (!keyboard) {
                $this.data('ydui.keyboard', (keyboard = new KeyBoard(this, option)));
            }

            if ($.type(option) == 'string') {
                keyboard[option] && keyboard[option].apply(keyboard, args);
            }
        });
    }

    $.fn.keyBoard = Plugin;

}(jQuery, window);

