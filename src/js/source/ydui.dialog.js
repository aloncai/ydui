/**
 * dialog
 */
!function (win, ydui) {
    "use strict";

    var $ = win.$,
        dialog = ydui.dialog = ydui.dialog || {},
        $body = $(win.document.body);

    /**
     * 确认提示框
     * @param title 标题String 【可选】
     * @param mes   内容String 【必填】
     * @param opts  按钮们Array 或 “确定按钮”回调函数Function 【必填】
     * @constructor
     */
    dialog.confirm = function (title, mes, opts) {
        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if ($.type(arguments[1]) != 'function' && args == 2 && !arguments[1] instanceof Array) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (args == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if ($.type(opts) === 'function') {
            btnArr = [{
                txt: '取消',
                color: false
            }, {
                txt: '确定',
                color: true,
                callback: function () {
                    opts && opts();
                }
            }];
        }

        var $dom = $('' +
            '<div id="YDUI_CONFRIM">' +
            '   <div class="mask-black"></div>' +
            '   <div class="m-confirm">' +
            '       <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
            '       <div class="confirm-bd">' + mes + '</div>' +
            '   </div>' +
            '</div>').remove();

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');
        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if ($.type(val.color) == 'boolean') {
                $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
            } else if ($.type(val.color) == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }

            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function () {
                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });

        $dom.find('.m-confirm').append($btnBox);

        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };

    /**
     * 弹出警示框
     * @param mes       提示文字String 【必填】
     * @param callback  回调函数Function 【可选】
     */
    dialog.alert = function (mes, callback) {
        var $dom = $('' +
            '<div id="YDUI_ALERT">' +
            '   <div>' +
            '       <div class="mask-black"></div>' +
            '       <div class="m-confirm m-alert">' +
            '           <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
            '           <div class="confirm-ft">' +
            '               <a href="javascript:;" class="confirm-btn primary">确定</a>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>').remove();

        ydui.util.pageScroll.lock();

        $body.append($dom);

        $dom.find('a').on('click', function () {
            $dom.remove();
            ydui.util.pageScroll.unlock();
            $.type(callback) === 'function' && callback();
        });
    };

    /**
     * 弹出提示层
     * @param mes       提示文字String 【必填】
     * @param type      类型String success or error 【必填】
     * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
     * @param callback  回调函数Function 【可选】
     */
    dialog.toast = function (mes, type, timeout, callback) {
        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s toast: Please set two or more parameters!!!');
            return;
        }

        var $dom = $('' +
            '<div id="YDUI_TOAST">' +
            '   <div class="mask-white"></div>' +
            '   <div class="m-toast">' +
            '       <div class="' + (type == 'error' ? 'toast-error-ico' : 'toast-success-ico') + '"></div>' +
            '       <p class="toast-content">' + (mes || '') + '</p>' +
            '   </div>' +
            '</div>').remove();

        ydui.util.pageScroll.lock();

        $body.append($dom);

        if ($.type(timeout) === 'function' && arguments.length >= 3) {
            callback = timeout;
            timeout = 2000;
        }

        var inter = setTimeout(function () {
            clearTimeout(inter);
            ydui.util.pageScroll.unlock();
            $dom.remove();
            $.type(callback) === 'function' && callback();
        }, (~~timeout || 2000) + 100);//100为动画时间
    };

    /**
     * 加载中提示框
     */
    dialog.loading = function () {
        return {
            /**
             * 加载中 - 显示
             * @param text 显示文字String 【可选】
             */
            open: function (text) {
                var $dom = $('' +
                    '<div id="YDUI_LOADING">' +
                    '    <div class="mask-white"></div>' +
                    '    <div class="m-loading">' +
                    '        <div class="loading-hd">' +
                    '            <div class="loading-leaf loading-leaf-0"></div>' +
                    '            <div class="loading-leaf loading-leaf-1"></div>' +
                    '            <div class="loading-leaf loading-leaf-2"></div>' +
                    '            <div class="loading-leaf loading-leaf-3"></div>' +
                    '            <div class="loading-leaf loading-leaf-4"></div>' +
                    '            <div class="loading-leaf loading-leaf-5"></div>' +
                    '            <div class="loading-leaf loading-leaf-6"></div>' +
                    '            <div class="loading-leaf loading-leaf-7"></div>' +
                    '            <div class="loading-leaf loading-leaf-8"></div>' +
                    '            <div class="loading-leaf loading-leaf-9"></div>' +
                    '            <div class="loading-leaf loading-leaf-10"></div>' +
                    '            <div class="loading-leaf loading-leaf-11"></div>' +
                    '        </div>' +
                    '        <p class="loading-txt">' + (text || '数据加载中') + '</p>' +
                    '    </div>' +
                    '</div>').remove();

                ydui.util.pageScroll.lock();
                $body.append($dom);
            },
            /**
             * 加载中 - 隐藏
             */
            close: function () {
                ydui.util.pageScroll.unlock();
                $('#YDUI_LOADING').remove();
            }
        };
    }();
}(window, YDUI);