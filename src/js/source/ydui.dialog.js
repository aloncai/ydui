/**
 * dialog
 */
!function (win, $) {
    var dialog = $.dialog = $.dialog || {},
        doc = win.document,
        body = doc.querySelectorAll('body')[0];

    /**
     * 确认提示框
     * @param title 标题String 【可选】
     * @param mes   内容String 【必填】
     * @param opts  按钮们Array 或 “确定按钮”回调函数Function 【必填】
     * @constructor
     */
    dialog.confirm = function (title, mes, opts) {
        var that = $, al = arguments.length;
        if (al < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if (typeof arguments[1] != 'function' && al == 2 && !arguments[1] instanceof Array) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (al == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
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

        // 创建confirm主体DOM
        var dom = doc.createElement('div'), _id = 'YDUI_CONFRIM';
        dom.id = _id;
        dom.innerHTML =
            '<div class="mask-black"></div>' +
            '<div class="m-confirm">' +
            '    <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
            '    <div class="confirm-bd">' + mes + '</div>' +
            '</div>';

        var old = doc.querySelector('#' + _id);
        old && dom.parentNode.removeChild(dom);

        // 遍历按钮数组
        var temp = doc.createElement('div');
        temp.className = 'confirm-ft';
        btnArr.forEach(function (val, i) {
            var btn = doc.createElement('a');
            btn.href = 'javascript:;';
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                btn.className = 'confirm-btn ' + (val.color ? 'primary' : 'default');
            } else if (typeof val.color == 'string') {
                btn.setAttribute('style', 'color: ' + val.color);
            }
            btn.innerHTML = val.txt || '';

            // 给对应按钮添加点击事件
            (function (p) {
                btn.onclick = function () {
                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        that.pageScroll.unlock();
                        dom.parentNode.removeChild(dom);
                    }
                    btnArr[p].callback && btnArr[p].callback();
                }
            })(i);
            temp.appendChild(btn);
        });

        dom.querySelector('.m-confirm').appendChild(temp);

        // 禁止滚动屏幕【移动端】
        that.pageScroll.lock();

        body.appendChild(dom);
    };

    /**
     * 弹出警示框
     * @param mes       提示文字String 【必填】
     * @param callback  回调函数Function 【可选】
     */
    dialog.alert = function (mes, callback) {
        var dom = doc.createElement('div'), _id = 'YDUI_ALERT';
        dom.innerHTML =
            '<div>' +
            '    <div class="mask-black"></div>' +
            '    <div class="m-confirm m-alert">' +
            '        <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
            '        <div class="confirm-ft">' +
            '            <a href="javascript:;" class="confirm-btn primary">确定</a>' +
            '        </div>' +
            '    </div>' +
            '</div>';
        var old = doc.querySelector('#' + _id);
        old && dom.parentNode.removeChild(dom);

        $.pageScroll.lock();

        body.appendChild(dom);

        dom.querySelectorAll('a')[0].onclick = function () {
            dom.parentNode.removeChild(dom);
            $.pageScroll.unlock();
            typeof callback === 'function' && callback();
        };
    };

    /**
     * 弹出提示层
     * @param mes       提示文字String 【必填】
     * @param type      类型String success or error 【必填】
     * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
     * @param callback  回调函数Function 【可选】
     */
    dialog.toast = function (mes, type, timeout, callback) {
        var al = arguments.length;
        if (al < 2) {
            console.error('From YDUI\'s tipMes: Please set two or more parameters!!!');
            return;
        }

        var ico = type == 'error' ? 'tipmes-error-ico' : 'tipmes-success-ico';
        var dom = doc.createElement('div'), _id = 'YDUI_TIPMES';
        dom.id = _id;
        dom.innerHTML =
            '<div>' +
            '    <div class="mask-white"></div>' +
            '    <div class="m-tipmes">' +
            '        <div class="' + ico + '"></div>' +
            '        <p class="tipmes-content">' + (mes || '') + '</p>' +
            '    </div>' +
            '</div>';

        var old = doc.querySelector('#' + _id);
        old && dom.parentNode.removeChild(dom);

        $.pageScroll.lock();

        body.appendChild(dom);

        if (typeof timeout === 'function' && arguments.length >= 3) {
            callback = timeout;
            timeout = 2000;
        }

        var inter = setTimeout(function () {
            clearTimeout(inter);
            $.pageScroll.unlock();
            dom.parentNode.removeChild(dom);
            typeof callback === 'function' && callback();
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