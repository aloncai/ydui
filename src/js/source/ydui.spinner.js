/**
 * Spinner Plugin
 */
!function (window) {
    "use strict";

    function Spinner (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Spinner.DEFAULTS, options || {});
        this.init();
    }

    Spinner.DEFAULTS = {
        input: '.J_Input',
        add: '.J_Add',
        minus: '.J_Del',
        unit: 1,
        max: 0,
        longpress: true,
        callback: null
    };

    Spinner.prototype.init = function () {
        var _this = this,
            options = _this.options;

        _this.$input = $(options.input, _this.$element);
        _this.$add = $(options.add, _this.$element);
        _this.$minus = $(options.minus, _this.$element);

        _this.checkParameters();

        _this.initInputVal();

        _this.bindEvent();
    };

    Spinner.prototype.tapParams = {};

    Spinner.prototype.initInputVal = function () {
        var _this = this,
            options = _this.options,
            v = _this.$input.val();

        _this.$input.val(!v || v % options.unit != 0 ? options.unit : v);
    };

    Spinner.prototype.isNumber = function (val) {
        //return /^([0]|[1-9]\d*)(\.\d{1,2})?$/.test(val);
        return /^\d*$/.test(val);
    };

    Spinner.prototype.FixNumber = function (val) {
        //return parseFloat(val);
        return parseInt(val);
    };

    Spinner.prototype.checkParameters = function () {

        var _this = this,
            options = _this.options;

        var params = [
            {param: 'unit', default: 1},
            {param: 'max', default: 0}
        ];

        $.each(params, function (k, v) {
            var _val = options[v.param],
                _dataVal = _this.$input.data(v.param);

            if (!!_dataVal) {
                _val = _dataVal;
                if (!_this.isNumber(_dataVal)) {
                    _val = options[v.param];
                    if (typeof _val == 'function') {
                        _val = _val();
                    }
                }
            } else {
                if (typeof options[v.param] == 'function') {
                    var _fnVal = options[v.param]();

                    _val = _fnVal;
                    if (!_this.isNumber(_fnVal)) {
                        _val = options[v.param];
                    }
                }
            }

            if (!_this.isNumber(_val)) {
                _val = v.default;
            }

            options[v.param] = _this.FixNumber(_val);
        });
    };

    Spinner.prototype.setValue = function (type) {
        var _this = this,
            options = _this.options,
            max = options.max,
            unit = options.unit,
            $input = _this.$input,
            val = _this.FixNumber($input.val());

        if (!_this.isNumber(val)) val = unit;

        if (!!$input.attr('readonly') || !!$input.attr('disabled'))return;

        var newVal;
        if (type == 'add') {
            newVal = val + unit;
            if (max != 0 && newVal > max)return;
        } else {
            newVal = val - unit;
            if (newVal < unit)return;
        }
        val = newVal;

        if (val > max && max != 0) val = max;

        if (val % unit > 0) {
            val = val - val % unit + unit;
            if (val > max && max != 0) val -= unit;
        }

        if (val < unit) val = unit;

        _this.$input.val(val);

        typeof options.callback == 'function' && options.callback(val, _this.$input);

        if (options.longpress) {

            var currentDate = new Date().getTime() / 1000,
                intervalTime = currentDate - _this.tapStartTime;

            if (intervalTime < 1) intervalTime = 0.5;

            var secondCount = intervalTime * 10;
            if (intervalTime == 30) secondCount = 50;
            if (intervalTime >= 40) secondCount = 100;

            _this.tapParams.timer = setTimeout(function () {
                _this.setValue(type);
            }, 1000 / secondCount);
        }
    };

    Spinner.prototype.bindEvent = function () {
        var _this = this,
            options = _this.options,
            isMobile = YDUI.device.isMobile,
            mousedownEvent = 'mousedown.ydui.spinner',
            mouseupEvent = 'mouseup.ydui.spinner',
            mouseleaveEvent = 'mouseleave.ydui.spinner';

        if (isMobile) {
            mousedownEvent = 'touchstart.ydui.spinner';
            mouseupEvent = 'touchend.ydui.spinner';
            mouseleaveEvent = 'touchcencel.ydui.spinner';
        }

        _this.$add.on(mousedownEvent, function (e) {
            if (options.longpress) {
                e.preventDefault();
                e.stopPropagation();
                _this.tapStartTime = new Date().getTime() / 1000;

                _this.$add.on(mouseupEvent, function () {
                    _this.clearTapTimer();
                }).on(mouseleaveEvent, function () {
                    _this.clearTapHandlers();
                });
            }

            _this.setValue('add');
        });

        _this.$minus.on(mousedownEvent, function (e) {
            if (options.longpress) {
                e.preventDefault();
                e.stopPropagation();

                _this.tapStartTime = new Date().getTime() / 1000;

                _this.$minus.on(mouseupEvent, function () {
                    _this.clearTapTimer();
                }).on(mouseleaveEvent, function () {
                    _this.clearTapHandlers();
                });
            }

            _this.setValue('minus');
        });

        _this.$input.on('change.ydui.spinner', function () {
            _this.setValue($(this).val());
        }).on('keydown', function (event) {
            if (event.keyCode == 13) {
                _this.setValue($(this).val());
                return false;
            }
        });
    };

    Spinner.prototype.clearTapTimer = function () {
        var _this = this;
        clearTimeout(_this.tapParams.timer);
    };

    Spinner.prototype.clearTapHandlers = function () {
        var _this = this;

        _this.$add.off('mouseup.ydui.spinner', function () {
            _this.clearTapTimer();
        }).off('mouseleave.ydui.spinner', function () {
            _this.clearTapHandlers();
        });
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                spinner = $this.data('ydui.spinner');

            if (!spinner) {
                $this.data('ydui.spinner', (spinner = new Spinner(this, option)));
            }

            if (typeof option == 'string') {
                spinner[option] && spinner[option].apply(spinner, args);
            }
        });
    }

    $(window).on('load.ydui.spinner', function () {
        $('[data-ydui-spinner]').each(function () {
            var $this = $(this);
            $this.spinner(window.YDUI.util.parseOptions($this.data('ydui-spinner')));
        });
    });

    $.fn.spinner = Plugin;
}(window);
