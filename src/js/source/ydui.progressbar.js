!function (win, $) {

    var doc = win.document;

    var pathTemplate = 'M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}';

    function ProgressBar(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, ProgressBar.DEFAULTS, options || {});
    }

    ProgressBar.DEFAULTS = {
        strokeWidth: 4,
        strokeColor: '#BFBFBF',
        trailWidth: 4,//底【边框】
        trailColor: '#646464',//底【颜色】
        fill: null,
        progress: 1
    };

    ProgressBar.prototype.set = function (progress) {
        var _this = this,
            svgView = _this.createSvgView();

        if (!progress) progress = _this.options.progress;
        if (progress > 1)progress = 1;

        var path = svgView.trailPath,
            length = path.getTotalLength();

        path.style.strokeDasharray = length + ' ' + length;
        path.style.strokeDashoffset = length - progress * length;

        _this.$element.find('svg').remove();

        _this.$element.append(svgView.svg);
    };

    ProgressBar.prototype.createSvgView = function () {
        var _this = this,
            options = _this.options;

        var svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.style.display = 'block';
        svg.style.width = '100%';

        var path = _this.createPath(options);
        svg.appendChild(path);

        var trailPath = null;
        if (options.trailColor || options.trailWidth) {
            trailPath = _this.createTrailPath(options);
            svg.appendChild(trailPath);
        }

        return {
            svg: svg,
            trailPath: trailPath
        }
    };

    ProgressBar.prototype.createTrailPath = function (options) {

        var _this = this;

        var pathString = _this.getPathString(options.trailWidth);

        return _this.createPathElement(pathString, options.trailColor, options.trailWidth, options.fill);
    };

    ProgressBar.prototype.createPath = function (options) {
        var _this = this,
            width = options.strokeWidth;

        if (options.trailWidth && options.trailWidth > options.strokeWidth) {
            width = options.trailWidth;
        }

        var pathString = _this.getPathString(width);
        return _this.createPathElement(pathString, options.strokeColor, options.strokeWidth, options.fill);
    };

    ProgressBar.prototype.getPathString = function (widthOfWider) {
        var _this = this,
            r = 50 - widthOfWider / 2;
        return _this.render(pathTemplate, {
            radius: r,
            '2radius': r * 2
        });
    };

    ProgressBar.prototype.createPathElement = function (pathString, color, width, fill) {

        var path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathString);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', width);

        if (fill) {
            path.setAttribute('fill', fill);
        } else {
            path.setAttribute('fill-opacity', '0');
        }

        return path;
    };

    ProgressBar.prototype.render = function (template, vars) {
        var rendered = template;

        for (var key in vars) {
            if (vars.hasOwnProperty(key)) {
                var val = vars[key];
                var regExpString = '\\{' + key + '\\}';
                var regExp = new RegExp(regExpString, 'g');

                rendered = rendered.replace(regExp, val);
            }
        }

        return rendered;
    };

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                progressbar = $this.data('ydui.progressbar');

            if (!progressbar) {
                $this.data('ydui.progressbar', (progressbar = new ProgressBar(this, option)));
                if (!option || $.type(option) == 'object') {
                    progressbar.set();
                }
            }

            if ($.type(option) == 'string') {
                progressbar[option] && progressbar[option].apply(progressbar, args);
            }
        });
    }


    $('[data-ydui-progressbar]').each(function () {
        var options = win.YDUI.util.parseOptions($(this).data('ydui-progressbar'));

        Plugin.call($(this), options);
    });

    $.fn.progressBar = Plugin;

}(window, jQuery);