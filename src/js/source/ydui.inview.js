/**
 * 判断元素是否处于可视窗口
 */
!function ($, win) {

    var $doc = $(win.document);

    function InView(element, callback) {
        this.$element = $(element);
        this.bindEvent(callback);
    }

    /**
     * 绑定事件
     * @param callback
     */
    InView.prototype.bindEvent = function (callback) {
        var _this = this;
        var fnCheckInView = _this.checkInView;

        callback.call(_this, fnCheckInView(_this.$element));

        $(win).on('scroll resize', function () {
            callback.call(_this, fnCheckInView(_this.$element));
        });
    };

    /**
     * 判断是否显示在窗口中
     * @param $element
     * @returns {number}【0未显示， 1露头， 2局部， 3包含， 4露尾】
     */
    InView.prototype.checkInView = function ($element) {

        var scrollTop = $doc.scrollTop(),
            scrollBottom = $doc.scrollTop() + $(win).height(),
            offset = $element.offset(),
            top = offset.top,
            bottom = top + $element.height();

        var status = 0;
        if (top >= scrollTop && top <= scrollBottom && bottom <= scrollBottom) {
            status = 3;
        } else {
            if (top >= scrollTop && top < scrollBottom) {
                status = 1;
            } else if (bottom > scrollTop && bottom <= scrollBottom) {
                status = 4;
            } else if (top < scrollTop && bottom > scrollBottom) {
                status = 2;
            } else {
                status = 0;
            }
        }
        return status;
    };

    $.fn.inView = function (callback) {
        return this.each(function () {
            new InView(this, callback);
        });
    };

}(jQuery, window);
