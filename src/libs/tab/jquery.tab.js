/**
 * 基于jquery的选项卡插件
 * Author: 陆楚良
 * Version: 1.0.2
 * Date: 2015/03/12
 * QQ: 519998338
 *
 * https://git.oschina.net/luchg/jquery.tab.js.git
 *
 * License: http://www.apache.org/licenses/LICENSE-2.0
 */
!function (tab) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], tab);
    } else if (typeof exports !== 'undefined') {
        module.exports = tab;
    } else {
        tab(this.jQuery);
    }
}(function($){
    $.fn.tab = function (op) {
        this.each(function () {
            var c = $.extend({
                    eType: 'click',
                    card: '',
                    panel: '',
                    curClass: 'z-crt',
                    extend: null
                }, op),
                d = {config: c};
            c.card = $(c.card, this);
            c.panel = $(c.panel, this);
            d.lastIndex = d.index = c.card.filter('.' + c.curClass).index();
            d.show = function (i) {
                if (i != d.index) {
                    d.lastIndex = d.index;
                    d.index = i;
                    c.card.eq(d.lastIndex).removeClass(c.curClass);
                    c.panel.eq(d.lastIndex).hide();
                    c.card.eq(i).addClass(c.curClass);
                    c.panel.eq(i).show();
                }
            };
            c.card.each(function (i) {
                $(this).on(c.eType, function () {
                    d.show(i);
                });
            });
            $.type(c.extend) == 'function' && c.extend.call(d);
        });
        return this;
    };
});