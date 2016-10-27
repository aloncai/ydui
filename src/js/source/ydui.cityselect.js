/**
 * CitySelect
 */
!function (window) {
    "use strict";

    function CitySelect (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, CitySelect.DEFAULTS, options || {});
        this.init();
    }

    CitySelect.DEFAULTS = {
        provance: '.provance',
        city: '.city',
        area: '.area',
        d_provance: '',
        d_city: '',
        d_area: ''
    };

    CitySelect.prototype.init = function () {
        var _this = this,
            options = _this.options;

        _this.$provance = $(options.provance, _this.$element);
        _this.$city = $(options.city, _this.$element);
        _this.$area = $(options.area, _this.$element);

        if (typeof yduiCitys == 'undefined') {
            console.error('请在ydui.js前引入ydui.citys.js。下载地址：http://static.ydcss.com/uploads/ydui/ydui.citys.js');
            return;
        }

        _this.citys = yduiCitys;

        var _defaultProvance = _this.$provance.data('default');
        var _defaultCity = _this.$city.data('default');
        var _defaultArea = _this.$area.data('default');

        if (_defaultProvance)
            options.d_provance = _defaultProvance;

        if (_defaultCity)
            options.d_city = _defaultCity;

        if (_defaultArea)
            options.d_area = _defaultArea;

        _this.loadProvance();

        _this.bindEvent();
    };

    CitySelect.prototype.bindEvent = function () {
        var _this = this;

        !!_this.$city[0] && _this.$provance.on('change.ydui.cityselect', function () {
            _this.loadCity();
        });
        !!_this.$area[0] && _this.$city.on('change.ydui.cityselect', function () {
            _this.loadArea();
        });
    };

    CitySelect.prototype.loadProvance = function () {
        var _this = this,
            options = _this.options;

        var arr = [];
        $.each(_this.citys, function (k, v) {
            arr.push($('<option value="' + v.n + '" ' + (options.d_provance && v.n.indexOf(options.d_provance) > -1 ? 'selected' : '') + '>' + v.n + '</option>').data('city', v.c));
        });
        _this.$provance.html(arr);
        _this.$city.length > 0 && _this.loadCity();
    };

    CitySelect.prototype.loadCity = function () {
        var _this = this,
            options = _this.options;

        var arr = [];
        $.each(_this.$provance.find('option:selected').data('city'), function (k, v) {
            arr.push($('<option value="' + v.n + '" ' + (options.d_city && v.n.indexOf(options.d_city) > -1 ? 'selected' : '') + '>' + v.n + '</option>').data('area', v.a));
        });
        _this.$city.html(arr);
        _this.$area.length > 0 && _this.loadArea();
    };

    CitySelect.prototype.loadArea = function () {
        var _this = this,
            options = _this.options;

        var arr = [];
        $.each(_this.$city.find('option:selected').data('area'), function (k, v) {
            arr.push($('<option value="' + v + '" ' + (options.d_area && v.indexOf(options.d_area) > -1 ? 'selected' : '') + '>' + v + '</option>'));
        });
        _this.$area.html(arr);
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                citySelect = $this.data('ydui.cityselect');

            if (!citySelect) {
                $this.data('ydui.cityselect', (citySelect = new CitySelect(this, option)));
            }

            if (typeof option == 'string') {
                citySelect[option] && citySelect[option].apply(citySelect, args);
            }
        });
    }

    $(window).on('load.ydui.cityselect', function () {
        $('[data-ydui-cityselect]').each(function () {
            var $this = $(this);
            $this.citySelect(window.YDUI.util.parseOptions($this.data('ydui-cityselect')));
        });
    });

    $.fn.citySelect = Plugin;
}(window);