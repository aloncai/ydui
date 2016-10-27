/**
 * Spinner
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

    Spinner.prototype.setValue = function (val) {
        var _this = this,
            options = _this.options,
            max = options.max,
            unit = options.unit;

        val = _this.FixNumber(val);

        if (!_this.isNumber(val)) val = unit;

        if (val > max && max != 0) val = max;

        if (val % unit > 0) {
            val = val - val % unit + unit;
            if (val > max && max != 0) val -= unit;
        }

        if (val < unit) val = unit;

        _this.$input.val(val);

        typeof options.callback == 'function' && options.callback(val, _this.$input);
    };

    Spinner.prototype.bindEvent = function () {
        var _this = this,
            options = _this.options,
            unit = options.unit,
            max = options.max,
            isMobile = !!(window.navigator && window.navigator.userAgent || '').match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in window.document.documentElement,
            triggerEvent = isMobile ? 'touchstart.ydui.spinner' : 'click.ydui.spinner';

        _this.$add.on(triggerEvent, function () {
            var $input = _this.$input,
                val = $input.val(),
                temp = _this.FixNumber(val) + unit;

            if ((max != 0 && temp > max) || !!$input.attr('readonly') || !!$input.attr('disabled'))return;
            _this.setValue(temp);
        });

        _this.$minus.on(triggerEvent, function () {
            var $input = _this.$input,
                val = $input.val(),
                temp = val - unit;

            if (temp < unit || !!$input.attr('readonly') || !!$input.attr('disabled'))return;
            _this.setValue(temp);
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