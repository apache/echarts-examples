var lang = window.EC_DEMO_LANG;
var isCN = lang !== 'en';

var CHART_TYPES = {
    line: ['折线图', 'Line'],
    bar: ['柱状图', 'Bar'],
    pie: ['饼图', 'Pie'],
    scatter: ['散点图', 'Scatter'],
    map: ['地理坐标/地图', 'GEO/Map'],
    candlestick: ['K 线图', 'Candlestick'],
    radar: ['雷达图', 'Radar'],
    boxplot: ['盒须图', 'Boxplot'],
    heatmap: ['热力图', 'Heatmap'],
    graph: ['关系图', 'Graph'],
    lines: ['路径图', 'Lines'],
    tree: ['树图', 'Tree'],
    treemap: ['矩形树图', 'Treemap'],
    sunburst: ['旭日图', 'Sunburst'],
    parallel: ['平行坐标系', 'Parallel'],
    sankey: ['桑基图', 'Sankey'],
    funnel: ['漏斗图', 'Funnel'],
    gauge: ['仪表盘', 'Gauge'],
    pictorialBar: ['象形柱图', 'PictorialBar'],
    themeRiver: ['主题河流图', 'ThemeRiver'],
    calendar: ['日历坐标系', 'Calendar'],
    custom: ['自定义系列', 'Custom'],

    dataset: ['数据集', 'Dataset'],
    dataZoom: ['数据区域缩放', 'DataZoom'],
    drag: ['拖拽', 'Drag'],
    rich: ['富文本', 'Rich Text'],

    globe: ['3D 地球', '3D Globe'],
    bar3D: ['3D 柱状图', '3D Bar'],
    scatter3D: ['3D 散点图', '3D Scatter'],
    surface: ['3D 曲面', '3D Surface'],
    map3D: ['3D 地图', '3D Map'],
    lines3D: ['3D 路径图', '3D Lines'],
    line3D: ['3D 折线图', '3D Line'],
    scatterGL: ['GL 散点图', 'Scatter GL'],
    linesGL: ['GL 路径图', 'Lines GL'],
    flowGL: ['GL 矢量场图', 'Flow GL'],
    graphGL: ['GL 关系图', 'Graph GL']
};

var COLORS = {
    default: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    light: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
    dark: ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42']
};

var blackMap = (function (list) {
    var map = {};
    for (var i = 0; i < list.length; i++) {
        map[list[i]] = 1;
    }
    return location.href.indexOf('github.io') >= 0 ? {} : map;
})([
    'effectScatter-map',
    'geo-lines',
    'geo-map-scatter',
    'heatmap-map',
    'lines-airline',
    'map-china',
    'map-china-dataRange',
    'map-labels',
    'map-locate',
    'map-province',
    'map-world',
    'map-world-dataRange',
    'scatter-map',
    'scatter-map-brush',
    'scatter-weibo',
    'scatter-world-population',
    'geo3d',
    'geo3d-with-different-height',
    'globe-country-carousel',
    'globe-with-echarts-surface',
    'map3d-alcohol-consumption',
    'map3d-wood-map',
    'scattergl-weibo'
]);


// Params parser
var params = {};
(location.search || '').substr(1).split('&').forEach(function (item) {
    var kv = item.split('=');
    params[kv[0]] = kv[1];
});

$('#theme .' + (params.theme || 'default')).addClass('selected');

if (params.theme === 'dark') {
    $('#theme').addClass('dark');
}

// Add popover
$('#theme a').popover({
    html: true,
    content: function () {
        var theme = $(this).attr('class').replace('selected', '').trim();
        return '<div class="theme-palette ' + theme + '">'
            + COLORS[theme].map(function (color) {
                return '<span style="background-color:' + color + '"></span>'
            }).join('')
            + '</div>';
    },
    placement: 'bottom',
    trigger: 'hover'
});

var charts = [];

$(document).ready(function() {

    // chart type as category
    var $container = $('#explore-container .chart-list-panel');
    var $nav = $('#left-chart-nav ul');
    for (var type in CHART_TYPES) {
        if (CHART_TYPES.hasOwnProperty(type)) {
            $container.append('<h3 class="chart-type-head" id="chart-type-'
                + type + '">'
                + (
                    isCN
                        ? CHART_TYPES[type][0] + '<span>' + CHART_TYPES[type][1] + '</span>'
                        : CHART_TYPES[type][1]
                )
                + '</h3>')
                .append('<div class="row" id="chart-row-' + type + '"></div>');
            $nav.append($('<li>').append(
                '<a class="left-chart-nav-link" id="left-chart-nav-' + type + '" '
                + 'href="#chart-type-' + type + '">'
                    + '<div class="chart-icon"></div>'
                    + '<div class="chart-name">' + CHART_TYPES[type][isCN ? 0 : 1] + '</div>'
                + '</a>'));
        }
    }


    function addExamples(examples, isGL) {
        var remainExamples = new Array(examples.length);
        for (var i = 0; i < examples.length; ++i) {
            remainExamples[i] = {categoryIndex: 0, item: examples[i]};
        }
        // The examples has been sorted by `difficulty` asc.
        remainExamples.reverse();

        // load charts
        while (remainExamples.length) {
            var wrap = remainExamples.pop();
            var exampleItem = wrap.item;

            if (blackMap.hasOwnProperty(exampleItem.id)) {
                continue;
            }

            // show title if exists
            var title = exampleItem.title || (isCN ? '未命名图表' : 'Unnamed Chart');

            // append dom element
            var $row = $('<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6"></div>');
            var $chart = $('<div class="chart"></div>');

            var category = exampleItem.category;
            if (!(category instanceof Array)) {
                category = [category];
            }
            $('#chart-row-' + category[wrap.categoryIndex]).append($row.append($chart));
            ++wrap.categoryIndex;
            // Here sort the display sequence by category.
            // But category has lower priority than dificulty.
            if (wrap.categoryIndex < category.length) {
                remainExamples.unshift(wrap);
            }

            var hash = ['c=' + exampleItem.id];
            var exampleTheme = exampleItem.theme || params.theme;
            if (isGL) {
                hash.push('gl=1');
            }
            if (exampleTheme) {
                hash.push('theme=' + exampleTheme);
            }

            var $link = $('<a target="_blank" class="chart-link" href="./editor.html?' + hash.join('&') + '"></a>');
            $chart.append($link);
            $link.append('<h4 class="chart-title">' + title + '</h4>');

            var themePostfix = (isGL || !params.theme) ? '' : ('-' + params.theme);

            // load chart image
            var $chartArea = $('<img class="chart-area" src="../images/placeholder.jpg?_v_=' + CDN_PAY_VERSION
                + '" data-original="' + CDN_PAY_ROOT_PATH + '/' + (isGL ? 'data-gl' : 'data') + '/thumb' + themePostfix + '/'
                + exampleItem.id + '.jpg?_v_=' + CDN_PAY_VERSION + '" />');
            $link.append($chartArea);
        }
    }

    addExamples(EXAMPLES, false);
    addExamples(EXAMPLES_GL, true);

    // chart nav highlighting as scrolling
    var waypoints = $('.chart-type-head').waypoint(function (direction) {
        var names = this.element.id.split('-');
        if (names.length === 3) {
            $('#left-chart-nav li').removeClass('active');
            $('#left-chart-nav-' + names[2]).parent('li').addClass('active');
        }
    }, {
        offset: 70
    });

    window.addEventListener('hashchange', function () {
        // move window down at the height of navbar so that title will not
        // be hidden when goes to hash tag
        scrollBy(0, -80);

        // changes highlighting as hash tag changes
        var names = location.hash.split('-');
        if (names.length === 3) {
            $('#left-chart-nav li').removeClass('active');
            $('#left-chart-nav-' + names[2]).parent('li').addClass('active');
        }
    });

    // highlight the first chart in chart navbar
    $('#left-chart-nav li').first().addClass('active');

    $container.find('img.chart-area').lazyload();
});
