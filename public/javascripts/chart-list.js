var EXAMPLES = [
    {
        id: 'area-rainfall',
        title: '雨量流量关系图',
        type: 'line'
    },  {
        id: 'area-simple',
        title: '大数据量面积图',
        type: 'line'
    },  {
        id: 'area-stack',
        title: '堆叠区域图',
        type: 'line'
    },  {
        id: 'bar-animation-delay',
        title: '柱状图动画延迟',
        type: 'bar'
    },  {
        id: 'bar-brush',
        title: '柱状图框选',
        type: 'bar'
    },  {
        id: 'bar-gradient',
        title: '特性示例：渐变色 阴影 点击缩放',
        type: 'bar'
    },  {
        id: 'bar-negative',
        title: '正负条形图',
        type: 'bar'
    },  {
        id: 'bar-negative2',
        title: '交错正负轴标签',
        type: 'bar'
    },  {
        id: 'bar-stack',
        title: '堆叠柱状图',
        type: 'bar'
    },  {
        id: 'bar-tick-align',
        title: '坐标轴刻度与标签对齐',
        type: 'bar'
    },  {
        id: 'bar-waterfall',
        title: '深圳月最低生活费组成（单位:元）',
        type: 'bar'
    },  {
        id: 'bar-waterfall2',
        title: '阶梯瀑布图',
        type: 'bar'
    },  {
        id: 'bar-y-category-stack',
        title: '堆叠条形图',
        type: 'bar'
    },  {
        id: 'bar-y-category',
        title: '世界人口总量 - 条形图',
        type: 'bar'
    },  {
        id: 'bar1',
        title: '某地区蒸发量和降水量',
        type: 'bar'
    },  {
        id: 'boxplot-light-velocity',
        title: 'Boxplot Light Velocity',
        type: 'boxplot'
    },  {
        id: 'boxplot-light-velocity2',
        title: 'Boxplot Light Velocity2',
        type: 'boxplot'
    },  {
        id: 'boxplot-multi',
        title: 'Multiple Categories',
        type: 'boxplot'
    },  {
        id: 'bubble-gradient',
        title: '气泡图',
        type: 'scatter'
    },  {
        id: 'calendar-charts',
        title: 'Calendar Charts',
        type: 'graph'
    },  {
        id: 'calendar-effectscatter',
        title: '2016年某人每天的步数',
        type: 'scatter'
    },  {
        id: 'calendar-graph',
        title: 'Calendar Graph',
        type: 'graph'
    },  {
        id: 'calendar-heatmap',
        title: '2016年某人每天的步数',
        type: 'heatmap'
    },  {
        id: 'calendar-horizontal',
        title: 'Calendar Horizontal',
        type: 'heatmap'
    },  {
        id: 'calendar-lunar',
        title: '2017 三月',
        type: 'scatter'
    },  {
        id: 'calendar-pie',
        title: 'Calendar Pie',
        type: 'scatter'
    },  {
        id: 'calendar-vertical',
        title: 'Calendar Vertical',
        type: 'heatmap'
    },  {
        id: 'candlestick-brush',
        title: 'Candlestick Brush',
        type: 'candlestick'
    },  {
        id: 'candlestick-sh-2015',
        title: '2015 年上证指数',
        type: 'candlestick'
    },  {
        id: 'candlestick-sh',
        title: '上证指数',
        type: 'candlestick'
    },  {
        id: 'candlestick-touch',
        title: '移动端 K线图',
        type: 'bar'
    },  {
        id: 'confidence-band',
        title: 'Confidence Band',
        type: 'line'
    },  {
        id: 'dynamic-data',
        title: '动态数据',
        type: 'bar'
    },  {
        id: 'dynamic-data2',
        title: '动态数据 + 时间坐标轴',
        type: 'line'
    },  {
        id: 'effectScatter-bmap',
        title: '全国主要城市空气质量 - 百度地图',
        type: 'scatter'
    },  {
        id: 'effectScatter-map',
        title: '全国主要城市空气质量',
        type: 'scatter'
    },  {
        id: 'funnel-align',
        title: '漏斗图(对比)',
        type: 'funnel'
    },  {
        id: 'funnel-customize',
        title: '漏斗图',
        type: 'funnel'
    },  {
        id: 'funnel-mutiple',
        title: '漏斗图',
        type: 'funnel'
    },  {
        id: 'funnel',
        title: '漏斗图',
        type: 'funnel'
    },  {
        id: 'gauge-car-dark',
        title: 'Gauge Car Dark',
        type: 'gauge'
    },  {
        id: 'gauge-car',
        title: 'Gauge Car',
        type: 'gauge'
    },  {
        id: 'gauge',
        title: 'Gauge',
        type: 'gauge'
    },  {
        id: 'geo-lines',
        title: '模拟迁徙',
        type: 'map'
    },  {
        id: 'geo-map-scatter',
        title: 'Geo Map Scatter',
        type: 'scatter'
    },  {
        id: 'graph-circular-layout',
        title: 'Les Miserables',
        type: 'graph'
    },  {
        id: 'graph-force',
        title: '力引导布局',
        type: 'graph'
    },  {
        id: 'graph-force2',
        title: '力引导布局',
        type: 'graph'
    },  {
        id: 'graph-grid',
        title: '笛卡尔坐标系上的 Graph',
        type: 'graph'
    },  {
        id: 'graph-life-expectancy',
        title: 'Graph Life Expectancy',
        type: 'graph'
    },  {
        id: 'graph-npm',
        title: 'NPM Dependencies',
        type: 'graph'
    },  {
        id: 'graph-simple',
        title: 'Graph 简单示例',
        type: 'graph'
    },  {
        id: 'graph-webkit-dep',
        title: 'Graph Webkit Dep',
        type: 'graph'
    },  {
        id: 'graph',
        title: 'Les Miserables',
        type: 'graph'
    },  {
        id: 'grid-multiple',
        title: '雨量流量关系图',
        type: 'line'
    },  {
        id: 'heatmap-bmap',
        title: '热力图与百度地图扩展',
        type: 'heatmap'
    },  {
        id: 'heatmap-cartesian',
        title: '笛卡尔坐标系上的热力图',
        type: 'heatmap'
    },  {
        id: 'heatmap-large-piecewise',
        title: '热力图 - 颜色的离散映射',
        type: 'heatmap'
    },  {
        id: 'heatmap-large',
        title: '热力图 - 2w 数据',
        type: 'heatmap'
    },  {
        id: 'heatmap-map',
        title: '全国主要城市空气质量',
        type: 'heatmap'
    },  {
        id: 'line-aqi',
        title: 'Beijing AQI',
        type: 'line'
    },  {
        id: 'line-draggable',
        title: 'Try Dragging these Points',
        type: 'line'
    },  {
        id: 'line-easing',
        title: 'Line Easing',
        type: 'line'
    },  {
        id: 'line-graphic',
        title: 'Line Graphic',
        type: 'bar'
    },  {
        id: 'line-log',
        title: '对数轴示例',
        type: 'line'
    },  {
        id: 'line-marker',
        title: '未来一周气温变化',
        type: 'line'
    },  {
        id: 'line-pen',
        title: 'Click to Add Points',
        type: 'line'
    },  {
        id: 'line-polar',
        title: '极坐标双数值轴',
        type: 'line'
    },  {
        id: 'line-polar2',
        title: '极坐标双数值轴',
        type: 'line'
    },  {
        id: 'line-sections',
        title: '一天用电量分布',
        type: 'line'
    },  {
        id: 'line-stack',
        title: '折线图堆叠',
        type: 'line'
    },  {
        id: 'line-step',
        title: 'Step Line',
        type: 'line'
    },  {
        id: 'line-tooltip-touch',
        title: '触屏 tooltip 和 dataZoom 示例',
        type: 'line'
    },  {
        id: 'line-y-category',
        title: 'Line Y Category',
        type: 'line'
    },  {
        id: 'lines-airline',
        title: '65k+ 飞机航线',
        type: 'map'
    },  {
        id: 'lines-bmap-bus',
        title: '北京公交路线 - 百度地图',
        type: 'map'
    },  {
        id: 'lines-bmap-effect',
        title: '北京公交路线 - 线特效',
        type: 'map'
    },  {
        id: 'lines-bmap',
        title: '杭州热门步行路线 - 百度地图',
        type: 'map'
    },  {
        id: 'map-china-dataRange',
        title: 'iphone销量',
        type: 'map'
    },  {
        id: 'map-china',
        title: 'Map China',
        type: 'map'
    },  {
        id: 'map-HK',
        title: '香港18区人口密度 （2011）',
        type: 'map'
    },  {
        id: 'map-locate',
        title: 'Map Locate',
        type: 'map'
    },  {
        id: 'map-parallel-prices',
        title: 'Prices and Earnings 2012',
        type: 'scatter'
    },  {
        id: 'map-province',
        title: '34 省切换查看',
        type: 'map'
    },  {
        id: 'map-usa',
        title: 'USA Population Estimates (2012)',
        type: 'map'
    },  {
        id: 'map-world-dataRange',
        title: 'World Population (2010)',
        type: 'map'
    },  {
        id: 'map-world',
        title: 'Map World',
        type: '0'
    },  {
        id: 'mix-line-bar',
        title: '折柱混合',
        type: 'bar'
    },  {
        id: 'mix-timeline-finance',
        title: '2002全国宏观经济指标',
        type: 'bar'
    },  {
        id: 'mix-zoom-on-value',
        title: 'Mix Zoom On Value',
        type: 'bar'
    },  {
        id: 'multiple-x-axis',
        title: '多 X 轴示例',
        type: 'line'
    },  {
        id: 'multiple-y-axis',
        title: '多 Y 轴示例',
        type: 'bar'
    },  {
        id: 'parallel-aqi',
        title: 'Parallel Aqi',
        type: 'parallel'
    },  {
        id: 'parallel-nutrients',
        title: 'Parallel Nutrients',
        type: 'parallel'
    },  {
        id: 'pictorialBar-body-fill',
        title: 'PictorialBar Body Fill',
        type: 'pictorialBar'
    },  {
        id: 'pictorialBar-dotted',
        title: 'PictorialBar Dotted',
        type: 'line'
    },  {
        id: 'pictorialBar-forest',
        title: 'PictorialBar Forest',
        type: 'pictorialBar'
    },  {
        id: 'pictorialBar-hill',
        title: 'PictorialBar Hill',
        type: 'pictorialBar'
    },  {
        id: 'pictorialBar-spirit',
        title: 'PictorialBar Spirit',
        type: 'pictorialBar'
    },  {
        id: 'pictorialBar-vehicle',
        title: 'Vehicles in X City',
        type: 'pictorialBar'
    },  {
        id: 'pictorialBar-velocity',
        title: 'PictorialBar Velocity',
        type: 'pictorialBar'
    },  {
        id: 'pie-custom',
        title: 'Customized Pie',
        type: 'pie'
    },  {
        id: 'pie-doughnut',
        title: '环形图',
        type: 'pie'
    },  {
        id: 'pie-nest',
        title: '嵌套环形图',
        type: 'pie'
    },  {
        id: 'pie-pattern',
        title: '饼图纹理',
        type: 'pie'
    },  {
        id: 'pie-roseType',
        title: '南丁格尔玫瑰图',
        type: 'pie'
    },  {
        id: 'pie-simple',
        title: '某站点用户访问来源',
        type: 'pie'
    },  {
        id: 'radar-aqi',
        title: 'AQI - 雷达图',
        type: 'radar'
    },  {
        id: 'radar-custom',
        title: '自定义雷达图',
        type: 'radar'
    },  {
        id: 'radar-multiple',
        title: '多雷达图',
        type: 'radar'
    },  {
        id: 'radar',
        title: '基础雷达图',
        type: 'radar'
    },  {
        id: 'radar2',
        title: '浏览器占比变化',
        type: 'radar'
    },  {
        id: 'sankey-energy',
        title: 'Sankey Diagram',
        type: 'sankey'
    },  {
        id: 'sankey-product',
        title: 'Sankey Diagram',
        type: 'sankey'
    },  {
        id: 'scatter-anscombe-quartet',
        title: 'Anscombe&#39;s quartet',
        type: 'scatter'
    },  {
        id: 'scatter-aqi-color',
        title: 'Scatter Aqi Color',
        type: 'scatter'
    },  {
        id: 'scatter-large',
        title: '大规模散点图',
        type: 'scatter'
    },  {
        id: 'scatter-life-expectancy-timeline',
        title: '各国人均寿命与GDP关系演变',
        type: 'scatter'
    },  {
        id: 'scatter-map-brush',
        title: 'Scatter Map Brush',
        type: 'scatter'
    },  {
        id: 'scatter-map',
        title: '全国主要城市空气质量',
        type: 'scatter'
    },  {
        id: 'scatter-matrix',
        title: 'Scatter Matrix',
        type: 'parallel'
    },  {
        id: 'scatter-nutrients-matrix',
        title: 'Scatter Nutrients Matrix',
        type: 'scatter'
    },  {
        id: 'scatter-nutrients',
        title: 'Scatter Nutrients',
        type: 'scatter'
    },  {
        id: 'scatter-painter-choice',
        title: 'Master Painter Color Choices Throughout History',
        type: 'scatter'
    },  {
        id: 'scatter-polar-punchCard',
        title: 'Punch Card of Github',
        type: 'scatter'
    },  {
        id: 'scatter-punchCard',
        title: 'Punch Card of Github',
        type: 'scatter'
    },  {
        id: 'scatter-single-axis',
        title: '单轴散点图',
        type: 'scatter'
    },  {
        id: 'scatter-weibo',
        title: '微博签到数据点亮中国',
        type: 'scatter'
    },  {
        id: 'scatter-weight',
        title: '男性女性身高体重分布',
        type: 'scatter'
    },  {
        id: 'scatter-world-population',
        title: 'World Population (2011)',
        type: 'scatter'
    },  {
        id: 'themeRiver-basic',
        title: 'ThemeRiver Basic',
        type: 'themeRiver'
    },  {
        id: 'themeRiver-lastfm',
        title: 'ThemeRiver Lastfm',
        type: 'themeRiver'
    },  {
        id: 'treemap-disk',
        title: 'Disk Usage',
        type: 'treemap'
    },  {
        id: 'treemap-drill-down',
        title: 'ECharts 配置项查询分布',
        type: 'treemap'
    },  {
        id: 'treemap-obama',
        title: 'How $3.7 Trillion is Spent',
        type: 'treemap'
    },  {
        id: 'treemap-visual',
        title: 'Gradient Mapping',
        type: 'treemap'
    },  {
        id: 'watermark',
        title: '水印 - ECharts 下载统计',
        type: 'bar'
    } 
];

var CHART_TYPES = {
    scatter: 'Scatter',
    line: 'Line',
    bar: 'Bar',
    map: 'Map',
    pie: 'Pie',
    radar: 'Radar',
    candlestick: 'Candlestick',
    boxplot: 'Boxplot',
    heatmap: 'Heatmap',
    graph: 'Graph',
    treemap: 'Treemap',
    parallel: 'Parallel',
    sankey: 'Sankey',
    funnel: 'Funnel',
    gauge: 'Gauge',
    pictorialBar: 'PictorialBar',
    themeRiver: 'ThemeRiver'
};

var charts = [];

$(document).ready(function() {

    // chart type as category
    var $container = $('#explore-container .chart-list-panel');
    var $nav = $('#left-chart-nav ul');
    for (var type in CHART_TYPES) {
        $container.append('<h3 class="chart-type-head" id="chart-type-'
            + type + '">' + CHART_TYPES[type] + '</h3>')
            .append('<div class="row" id="chart-row-' + type + '"></div>');
        $nav.append($('<li>').append(
            '<a class="left-chart-nav-link" id="left-chart-nav-' + type + '" '
            + 'href="#chart-type-' + type + '">'
                + '<div class="chart-icon"></div>'
                + '<div class="chart-name">' + CHART_TYPES[type] + '</div>'
            + '</a>'));
    }

    // load charts
    for (var eid = 0, elen = EXAMPLES.length; eid < elen; ++eid) {
        // show title if exists
        var title = EXAMPLES[eid].title || '未命名图表';

        // append dom element
        var $row = $('<div class="col-lg-3 col-md-4 col-sm-6"></div>');
        var $chart = $('<div class="chart"></div>');
        $('#chart-row-' + EXAMPLES[eid].type).append($row.append($chart));

        $link = $('<a class="chart-link" href="./editor.html?c='
            + EXAMPLES[eid].id + '"></a>');
        $chart.append($link);
        $link.append('<h4 class="chart-title">' + title + '</h4>');

        // load chart image
        $chartArea = $('<img class="chart-area" src="data/thumb/'
            + EXAMPLES[eid].id + '.png" />');
        $link.append($chartArea);
    }

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

});
