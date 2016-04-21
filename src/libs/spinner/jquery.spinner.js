/**
 * @extends jquery 1.11.2
 * @fileOverview 加减插件
 * @author 一点
 * @email surging2@qq.com
 * @url http://www.ydcss.com
 * @version 0.1
 * @date 2015/12/8
 * Copyright (c) 2010-2016
 */
!function(spinner){
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], spinner);
    } else if (typeof exports !== 'undefined') {
        module.exports = spinner;
    } else {
        spinner(jQuery);
    }
}(function($){
    $.fn.spinner = function (option) {
        return this.each(function () {
            var st = $.extend({
                input: '.J_Input',
                add: '.J_Add',
                minus: '.J_Del',
                min: 1,//最小值
                max: 100,//最大值 number or function
                isMaxDataAttr: false,//当isMaxDataAttr为true时，将读取 $(st.input).data('max') 值
                callback: null//修改时回调 function(value, ele){} [value：当前值 ele：当前文本框jq对象]
            }, option);

            var $input = $(st.input, this),
                $add = $(st.add, this),
                $minus = $(st.minus, this);

            if (typeof st.max == 'function') st.max = ~~st.max();
            if (st.isMaxDataAttr) st.max = $input.data('max') || st.max;

            $add.on('click', function () {
                var v = $input.val(), temp = ++v;
                if (temp > st.max)return;
                setValue(temp);
            });

            $minus.on('click', function () {
                var v = $input.val(), temp = --v;
                if (temp < st.min)return;
                setValue(temp);
            });

            $input.on('change', function () {
                setValue($(this).val());
            }).on('keydown', function(event){
                if(event.keyCode == 13){
                    setValue($(this).val());
                    return false;
                }
            });

            function setValue(v) {
                if (!/^\d*$/.test(v)) v = st.min;
                if (v > st.max)v = st.max;
                if (v < st.min)v = st.min;
                $input.val(v);
                typeof st.callback == 'function' && st.callback(v, $input);
            }
        });
    };
});