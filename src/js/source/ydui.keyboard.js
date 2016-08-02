!function ($) {
    function KeyBoard() {

    }

    var $mask = $('<div class="mask-white"></div>');
    var nums = [
        '<a href="javascript:;">0</a>',
        '<a href="javascript:;">1</a>',
        '<a href="javascript:;">2</a>',
        '<a href="javascript:;">3</a>',
        '<a href="javascript:;">4</a>',
        '<a href="javascript:;">5</a>',
        '<a href="javascript:;">6</a>',
        '<a href="javascript:;">7</a>',
        '<a href="javascript:;">8</a>',
        '<a href="javascript:;">9</a>'
    ];

    KeyBoard.prototype.show = function () {

    };

    KeyBoard.prototype.createNums = function () {
        var strArr = [];
        for (var i = 0; i < 10; i++) {
            strArr.push('<a href="javascript:;">' + i + '</a>');
        }
        return strArr;
    };

    /**
     * 打乱数组顺序
     * @param arr
     * @returns {*}
     */
    KeyBoard.prototype.upsetOrder = function (arr) {
        var floor = Math.floor,
            random = Math.random,
            len = arr.length, i, j, temp,
            n = floor(len / 2) + 1;
        while (n--) {
            i = floor(random() * len);
            j = floor(random() * len);
            if (i !== j) {
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        return arr;
    };

    var htmlStart = '' +
        '<div class="m-keyboard keyboard-show">' +
        '    <div class="keyboard-title">YDUI安全键盘</div>' +
        '    <ul class="keyboard-numbers">';

    var htmlEnd = '' +
        '    </ul>' +
        '</div>';

    var arr = [];

    // 打乱数组顺序
    function mess(arr) {
        var _floor = Math.floor, _random = Math.random,
            len = arr.length, i, j, arri,
            n = _floor(len / 2) + 1;
        while (n--) {
            i = _floor(_random() * len);
            j = _floor(_random() * len);
            if (i !== j) {
                arri = arr[i];
                arr[i] = arr[j];
                arr[j] = arri;
            }
        }
        return arr;
    }

    mess(nums);


    $.each(nums, function (k) {
        if (k % 3 == 0) {
            if (k >= nums.length - 2) {
                arr.push('<li><a href="javascript:;"></a>' + nums.slice(k, k + 3).join('') + '<a href="javascript:;"><i class="backspace"></i></a></li>');
            } else {
                arr.push('<li>' + nums.slice(k, k + 3).join('') + '</li>');
            }
        }
    });

    $('body').append(htmlStart + arr.join('') + htmlEnd);

    //$('#J_Input').on('click', function () {
    //    $('#J_KeyBoard').addClass('keyboard-show');
    //});
}(jQuery);