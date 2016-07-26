!function (win, $) {

    var doc = win.document,
        $doc = $(doc),
        $body = $(doc.body),
        $html = $('html'),
        $mask = $('<div class="mask-black"></div>');

    function ActionSheet(element, closeElement) {
        /**
         * DOM
         * @type {*|HTMLElement}
         */
        this.$element = $(element);
        /**
         * 第三方关闭窗口操作
         */
        this.closeElement = closeElement;
        /**
         * 切换窗口显示/关闭样式
         * @type {string}
         */
        this.toggleClass = 'actionsheet-toggle';
    }

    /**
     * 打开窗口
     */
    ActionSheet.prototype.open = function () {
        var _this = this;
        $body.append($mask);

        // 点击遮罩层关闭窗口
        $mask.on('click.ydui.actionsheet.mask', function () {
            _this.close();
        });

        // 第三方关闭窗口操作
        if (_this.closeElement) {
            $doc.on('click.ydui.actionsheet', _this.closeElement, function () {
                _this.close();
            });
        }

        _this.$element.addClass(_this.toggleClass).trigger('open.ydui.actionsheet');
    };

    /**
     *
     */
    ActionSheet.prototype.close = function () {
        var _this = this;
        $mask.off('click.ydui.actionsheet.mask').remove();
        _this.$element.removeClass(_this.toggleClass).trigger('close.ydui.actionsheet');
        $doc.off('click.ydui.actionsheet', _this.closeElement);
        $html.off('.ydui.actionsheet');
    };

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                actionsheet = $this.data('ydui.actionsheet');

            if (!actionsheet) {
                $this.data('ydui.actionsheet', (actionsheet = new ActionSheet(this, option.closeElement)));
                if ($.type(option) == 'object') {
                    actionsheet.open();
                }
            }

            if ($.type(option) == 'string') {
                actionsheet[option] && actionsheet[option].apply(actionsheet, args);
            }
        });
    }

    $doc.on('click', '[data-ydui-actionsheet]', function (e) {
        e.preventDefault();

        var options = win.YDUI.util.parseOptions($(this).data('ydui-actionsheet')),
            $target = $(options.target),
            option = $target.data('ydui.actionsheet') ? 'open' : options;

        Plugin.call($target, option);
    });

    $.fn.actionSheet = Plugin;

}(window, jQuery);