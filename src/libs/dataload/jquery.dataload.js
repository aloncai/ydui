/**
 * @extends jquery 1.11.2
 * @fileOverview 加载更多插件
 * @author 一点
 * @email surging2@qq.com
 * @url http://www.ydcss.com
 * @version 0.1
 * @date 2015/12/11
 * Copyright (c) 2010-2016
 */
!function (dataload) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], dataload);
    } else if (typeof exports !== 'undefined') {
        module.exports = dataload;
    } else {
        dataload(jQuery);
    }
}(function ($) {
    $.fn.dataload = function (option) {
        return this.each(function () {
            var st = $.extend({
                url: '',
                type: 'get',
                dataType: 'json',
                data: {},
                page: 1,
                jsonpCallback: '',
                pageSize: 10,
                pagestr: 'page',//传递后台的页码参数
                initLoad: true,//是否初始化就加载数据
                loadtype: 'click',//再次请求数据方式 [scroll：滚动加载 click：点击加载]
                triggerdom: '',//触发事件DOM initLoad 为 false时，必填
                appenddom: '',//插入html的DOM 用于计算文档高度 选填 不填将计算this的高度
                loadmoredom: '',//加载更多按钮DOM loadtype 为 click时，必填
                loadingdom: '',//加载中DOM
                callback: null//回调函数 返回data和page
            }, option);

            var _this = this,
                $loadmore = $(st.loadmoredom, _this),
                $loading = $(st.loadingdom, _this);

            $(_this).append('<div id="J_DataLoadTag"></div>');

            var loader = {
                isloading: false,//是否加载中
                isdone: false,//数据是否请求完成
                page: st.page,//页码
                pageSize: st.pageSize,//需要和后台传的数值一致
                /**
                 * Ajax请求获取列表数据
                 */
                getContent: function () {
                    var that = this;

                    if (loader.isloading || loader.isdone) return;
                    loader.isloading = true;

                    that.showLoading();

                    st.data[st.pagestr] = loader.page;//设置分页页码

                    if (st.dataType == 'jsonp' && st.jsonpCallback) {
                        $.ajaxSetup({
                            jsonpCallback: st.jsonpCallback
                        });
                    }

                    $.ajax({
                        url: st.url,
                        type: st.type,
                        data: st.data,
                        dataType: st.dataType,
                        cache: false,
                        success: function (ret) {
                            loader.page++;
                            typeof st.callback == 'function' && st.callback(ret, loader.page - 1);

                            if (ret.length < loader.pageSize) {
                                loader.hideLoadMore();
                                loader.isdone = true;
                                return;
                            }
                            loader.showLoadMore();
                        },
                        error: function () {
                            console.error('网络错误');
                        },
                        complete: function () {
                            that.hideLoading();
                            loader.isloading = false;
                        }
                    });
                },
                /**
                 * 隐藏加载更多按钮
                 */
                hideLoadMore: function () {
                    st.loadtype == 'click' && $loadmore.hide();
                },
                /**
                 * 显示加载更多按钮
                 */
                showLoadMore: function () {
                    st.loadtype == 'click' && $loadmore.show();
                },
                /**
                 * 请求加载时显示加载中图标
                 */
                showLoading: function () {
                    this.hideLoadMore();
                    $loading.show();
                },
                /**
                 * 加载完毕隐藏加载中图标
                 */
                hideLoading: function () {
                    $loading.hide();
                }
            };
            if (st.initLoad) {
                loader.getContent();
            } else {
                if (!st.triggerdom) {
                    console.error('参数【triggerdom】必填');
                    return;
                }
                $(st.triggerdom, _this).one('click', function () {
                    loader.getContent();
                });
            }

            /**
             * 节流
             * @param method
             * @param context
             */
            function throttle(method, context) {
                clearTimeout(method.tid);
                method.tid = setTimeout(function () {
                    method.call(context);
                }, 200);
            }

            if (st.loadtype == 'scroll') {//滚动加载
                var winHeight = $(window).height();

                $(window).on('scroll', function () {
                    throttle(function () {
                        if ($('#J_DataLoadTag').offset().top <= winHeight + $(window).scrollTop() + winHeight / 4) {
                            loader.getContent();
                        }
                    }, window);
                });
            } else {//点击加载
                if (!st.loadmoredom) {
                    console.error('参数【loadmoredom】必填');
                    return;
                }
                $loadmore.on('click', function () {
                    loader.getContent();
                });
            }
        });
    };
});
