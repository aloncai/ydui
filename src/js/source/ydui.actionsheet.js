!function (win, $) {

    var $doc = $(win.document),
        $body = $('body');

    function ActionSheet(option) {
        this.$element = $(option.target);
        this.closeElement = option.closeElement;
        this.$mask = $('<div class="mask-black"></div>');
        this.toggleClass = 'actionsheet-toggle';
    }

    ActionSheet.prototype.open = function () {
        var _this = this;
        $body.append(_this.$mask);
        _this.$mask.on('click', function () {
            _this.close();
        });
        if (_this.closeElement) {
            $doc.on('click.ydui.actionsheet', _this.closeElement, function () {
                _this.close();
            });
        }
        _this.$element.addClass(_this.toggleClass).trigger('open.ydui.actionsheet');
    };

    ActionSheet.prototype.close = function () {
        var _this = this;
        _this.$mask.remove();
        _this.$element.removeClass(_this.toggleClass).trigger('close.ydui.actionsheet');
        $doc.off('click.ydui.actionsheet', _this.closeElement);
    };

    function Plugin(option, closeElement) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                actionsheet = $this.data('ydui.actionsheet');

            if (!actionsheet) {
                $this.data('ydui.actionsheet', (actionsheet = new ActionSheet(option)));
                if (!option || typeof option == 'object') {
                    actionsheet.open();
                }
            }

            if (typeof option == 'string') {
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