!function (win, $) {

    var $doc = $(win.document),
        $body = $('body'),
        $mask = $('<div class="mask-black"></div>');

    function ActionSheet(element, closeElement) {
        this.$element = $(element);
        this.closeElement = closeElement;
        this.toggleClass = 'actionsheet-toggle';
    }

    ActionSheet.prototype.open = function () {
        var _this = this;
        $body.append($mask);
        $mask.on('click.ydui.actionsheet.mask', function () {
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
        $mask.off('click.ydui.actionsheet.mask').remove();
        _this.$element.removeClass(_this.toggleClass).trigger('close.ydui.actionsheet');
        $doc.off('click.ydui.actionsheet', _this.closeElement);
    };

    function Plugin(option, closeElement) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                actionsheet = $this.data('ydui.actionsheet');

            if (!actionsheet) {
                $this.data('ydui.actionsheet', (actionsheet = new ActionSheet(this, option.closeElement)));
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