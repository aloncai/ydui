/**
 * loading
 */
!function (win, $) {
    var dialog = $.dialog = $.dialog || {},
        doc = win.document,
        body = doc.querySelectorAll('body')[0];

    dialog.loading = function () {
        return {
            /**
             * 加载中 - 显示
             * @param text 显示文字String 【可选】
             */
            show: function (text) {
                var dom = doc.createElement('div'), _id = 'YDUI_LOADING';
                dom.id = _id;
                dom.innerHTML =
                    '    <div class="mask-white"></div>' +
                    '    <div class="m-loading">' +
                    '        <div class="ld-loading">' +
                    '            <div class="m-loading-leaf m-loading-leaf-0"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-1"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-2"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-3"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-4"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-5"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-6"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-7"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-8"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-9"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-10"></div>' +
                    '            <div class="m-loading-leaf m-loading-leaf-11"></div>' +
                    '        </div>' +
                    '        <p class="ld-toast-content">' + (text || '数据加载中') + '</p>' +
                    '    </div>';
                var old = doc.querySelector('#' + _id);
                old && dom.parentNode.removeChild(dom);

                $.pageScroll.lock();
                body.appendChild(dom);
            },
            /**
             * 加载中 - 隐藏
             */
            hide: function () {
                $.pageScroll.unlock();

                var dom = doc.querySelector('#YDUI_LOADING');
                dom.parentNode.removeChild(dom);
            }
        };
    }();

}(window, YDUI);