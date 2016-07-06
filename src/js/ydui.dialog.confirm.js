/**
 * confirm
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

        // 创建confirm主题DOM
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
}(window, YDUI);