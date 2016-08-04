!function ($, win) {
    var $body = $(win.document.body),
        $mask = $('<div class="mask-black"></div>');

    function KeyBoard(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, KeyBoard.DEFAULTS, options || {});
        this.fucknum = '';
        this.initElement();
    }

    KeyBoard.DEFAULTS = {
        disorder: false,
        title: '安全键盘',
        target: ''
    };

    KeyBoard.prototype.initElement = function () {
        var _this = this;

        _this.$element
            .prepend('<ul id="J_Hei" class="keyboard-password"><li><i></i></li><li><i></i></li><li><i></i></li><li><i></i></li><li><i></i></li><li><i></i></li></ul>')
            .prepend('<div class="keyboard-error"></div>')
            .prepend('<div class="keyboard-head"><strong>输入数字密码</strong></div>')
            .append('<div class="keyboard-title">' + _this.options.title + '</div>')
            .append('<ul class="keyboard-numbers"></ul>');
    };

    KeyBoard.prototype.open = function (options) {
        var _this = this,
            $element = _this.$element;

        $body.append($mask);

        if (options) {
            _this.options = $.extend({}, KeyBoard.DEFAULTS, options);
        }

        $element.addClass('keyboard-show');

        var $numsBox = $element.find('.keyboard-numbers');

        if (_this.options.disorder || $numsBox.data('fuck') != 1) {
            var html = _this.createNumsHtml();
            $numsBox.data('fuck', 1).html(html);
        }

        _this.bindEvent();
    };

    KeyBoard.prototype.close = function () {
        var _this = this;
        $mask.remove();
        _this.$element.removeClass('keyboard-show');
        _this.unbindEvent();
    };

    KeyBoard.prototype.bindEvent = function () {
        var _this = this,
            $element = _this.$element;

        $mask.on('click.ydui.keyboard.mask', function () {
            _this.close();
        });

        $element.on('click.ydui.keyboard.nums', '.J_Nums', function () {
            var c = _this.fucknum;

            if (c.length >= 6)return;

            _this.fucknum = _this.fucknum + $(this).html();


            _this.fillPassword();
        });

        $element.on('click.ydui.keyboard.backspace', '#J_Backspace', function () {
            _this.backspace();
        });

        $element.on('click.ydui.keyboard.cancel', '#J_Cancel', function () {
            _this.close();
        });
    };

    KeyBoard.prototype.unbindEvent = function () {
        this.$element.off('click.ydui.keyboard');
    };

    KeyBoard.prototype.fillPassword = function () {
        var _this = this;
        var length = _this.fucknum.length;

        if (_this.options.target) {
            $(_this.options.target).val(_this.fucknum);
        }

        $('#J_Hei').find('i').hide();
        $('#J_Hei').find('li:lt(' + length + ')').find('i').show();
        if (length >= 6) {
            _this.$element.trigger($.Event('over.ydui.keyboard', {
                val: _this.fucknum
            }));
        }
    };

    KeyBoard.prototype.error = function (mes) {
        this.$element.find('.keyboard-error').html(mes);
    };

    KeyBoard.prototype.backspace = function () {
        var _this = this;

        var c = _this.fucknum;
        if (c) {
            _this.fucknum = c.substr(0, c.length - 1);
        }

        _this.fillPassword();
    };

    KeyBoard.prototype.createNumsHtml = function () {
        var _this = this,
            nums = _this.createNums();

        _this.options.disorder && _this.upsetOrder(nums);

        var arr = [];
        $.each(nums, function (k) {
            if (k % 3 == 0) {
                if (k >= nums.length - 2) {
                    arr.push('<li><a href="javascript:;" id="J_Cancel">取消</a>' + nums.slice(k, k + 3).join('') + '<a href="javascript:;" id="J_Backspace"></a></li>');
                } else {
                    arr.push('<li>' + nums.slice(k, k + 3).join('') + '</li>');
                }
            }
        });

        return arr.join('');
    };

    KeyBoard.prototype.createNums = function () {
        var strArr = [];
        for (var i = 1; i <= 10; i++) {
            strArr.push('<a href="javascript:;" class="J_Nums">' + (i % 10) + '</a>');
        }
        return strArr;
    };

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