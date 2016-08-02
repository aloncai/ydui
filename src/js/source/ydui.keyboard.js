!function ($) {
    function KeyBoard(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, KeyBoard.DEFAULTS, options || {});

        this.init();
        this.bindEvent();
    }

    KeyBoard.DEFAULTS = {
        target: ''
    };

    var $mask = $('<div class="mask-white"></div>');

    KeyBoard.prototype.bindEvent = function () {
        var _this = this;
        _this.$target.on('click', function () {
            _this.show();
        });

        _this.$element.on('click', 'a', function () {
            var c = _this.$target.val();
            _this.$target.val(c + $(this).html());
        });

    };

    KeyBoard.prototype.init = function () {
        var _this = this;
        _this.$target = $(this.options.target).attr('readonly', true);

        _this.nums = this.createNums();
        _this.titleHtml = '<div class="keyboard-title">' + _this.options.title + '</div>';
    };

    KeyBoard.prototype.show = function () {
        var _this = this;

        var a = _this.createDOM();

        $('body').append($mask);
        _this.$element.addClass('keyboard-show').find('ul').html(a);

        $mask.on('click', function () {
            $(this).remove();
            _this.$element.removeClass('keyboard-show');
        });
    };

    KeyBoard.prototype.createNums = function () {
        var strArr = [];
        for (var i = 0; i < 10; i++) {
            strArr.push('<a href="javascript:;">' + i + '</a>');
        }
        return strArr;
    };

    /**
     * 退格
     */
    KeyBoard.prototype.backspace = function () {

    };

    KeyBoard.prototype.createDOM = function () {
        var _this = this,
            nums = _this.upsetOrder(_this.nums);

        var arr = [];
        $.each(nums, function (k) {
            if (k % 3 == 0) {
                if (k >= nums.length - 2) {
                    arr.push('<li><a href="javascript:;">取消</a>' + nums.slice(k, k + 3).join('') + '<a href="javascript:;"><i class="backspace"></i></a></li>');
                } else {
                    arr.push('<li>' + nums.slice(k, k + 3).join('') + '</li>');
                }
            }
        });

        return arr.join('');
    };

    /**
     * 打乱数组顺序
     * @param arr
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
                if (!option || $.type(option) == 'object') {
                    // keyboard.show();
                }
            }

            if ($.type(option) == 'string') {
                keyboard[option] && keyboard[option].apply(keyboard, args);
            }
        });
    }

    $.fn.keyBoard = Plugin;

}(jQuery);