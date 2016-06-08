/**
 * @extends jQuery-1.11.2
 * @fileOverview 加减插件
 * @author 一点
 * @email surging2@qq.com
 * @url http://www.ydui.org
 * @version 0.2
 * @date 2016/04/26
 * Copyright (c) 2010-2016
 */
!function (spinner) {
    // RequireJS && SeaJS && GlightJS
    if (typeof define === 'function') {
        define(['jquery'], spinner);
    } else {
        spinner(jQuery);
    }
}(function ($) {
    $.fn.spinner = function (option) {
        return this.each(function () {
            var st = $.extend({
                input: '.J_Input',
                add: '.J_Add',
                minus: '.J_Del',
                unit: 1,//等同于最小值
                max: 100,//最大值 number or function  取值有两种：参数max 和 input's data-max；后者优先级大于前者
                callback: null//修改时回调 function(value, ele){} [value：当前值 ele：当前文本框jq对象]
            }, option);

            var $input = $(st.input, this),
                $add = $(st.add, this),
                $minus = $(st.minus, this);

            $input.val(st.unit);

            /**
             * 获取倍数
             * @returns {number}
             */
            function getUnit() {
                return $.type(st.unit) == 'function' ? ~~st.unit() : st.unit;
            }

            /**
             * 获取最大值
             * @returns {number}
             */
            function getMax() {
                return $input.data('max') || $.type(st.max) == 'function' ? ~~st.max() : st.max;
            }

            $add.on('click', function () {
                var val = $input.val(), temp = ~~val + getUnit();
                if (temp > getMax())return;
                setValue(temp);
            });

            $minus.on('click', function () {
                var val = $input.val(), unit = getUnit(), temp = val - unit;
                if (temp < unit)return;
                setValue(temp);
            });

            $input.on('change', function () {
                setValue($(this).val());
            }).on('keydown', function (event) {
                if (event.keyCode == 13) {
                    setValue($(this).val());
                    return false;
                }
            });

            function setValue(val) {
                var unit = getUnit();
                var max = getMax();

                if (!/^\d*$/.test(val)) val = unit;
                if (val > max)val = max;

                if (val % unit > 0) {
                    val = ~~val - ~~val % unit + unit;
                    if (val > max) val -= ~~unit;
                }
                if (val < unit) {
                    val = unit;
                    if (val < unit) val = unit;
                }
                $input.val(val);
                typeof st.callback == 'function' && st.callback(val, $input);
            }
        });
    };
});