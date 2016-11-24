'use strict';
Error.stackTraceLimit = 200;

var glob = require('glob');
var fs = require('fs');
var path = require('path');
var etpl = require('etpl');
var DOMParser = require('xmldom').DOMParser;
var _ = require('lodash');
var Canvas = require('canvas');

require('app-module-path').addPath('../public/vendors/echarts/');

var tpl = fs.readFileSync('../public/javascripts/chart-list.tpl.js', 'utf-8');
var echarts = require('echarts');

etpl.config({
    commandOpen: '/**',
    commandClose: '*/'
});
global.document = {
    createElement: function (nodeType) {
        if (nodeType === 'canvas') {
            return new Canvas(150, 150);
        }
    }
}

global.Image = Canvas.Image;

var _intervalIdList = [];
var _timeoutIdList = [];

var _oldSetTimeout = global.setTimeout;
var _oldSetInterval = global.setInterval;

global.setTimeout = function (func, delay) {
    var id = _oldSetTimeout(func, delay);
    _timeoutIdList.push(id);
    return id;
};
global.setInterval = function (func, gap) {
    var id = _oldSetInterval(func, gap);
    _intervalIdList.push(id);
    return id;
};
function _clearTimeTickers() {
    for (var i = 0; i < _intervalIdList.length; i++) {
        clearInterval(_intervalIdList[i]);
    }
    for (var i = 0; i < _timeoutIdList.length; i++) {
        clearTimeout(_timeoutIdList[i]);
    }
    _intervalIdList = [];
    _timeoutIdList = [];
}

var $ = {
    get: function (url, callback, dataType) {
        if (!url.match(/^http/)) {
            var content = fs.readFileSync('../public/' + url, 'utf-8');
            if (url.match(/.json$/) || dataType === 'json') {
                content = JSON.parse(content);
            }
            else if (url.match(/.(xml|gexf)$/) || dataType === 'xml') {
                content = new DOMParser().parseFromString(content, 'text/xml');
            }
            if (callback) {
                callback(content);
            }
        }
    }
};

$.getJSON = $.get;

function getTmpMyChart() {
    var canvas = new Canvas(700, 560);
    var myChart = echarts.init(canvas);
    myChart.setOption = function () {};
    myChart.dispatchAction = function (action) {
        this.pendingActions.push(action);
    };
    myChart.on = function (name, handler, context) {
        this.eventsHandlers.push({
            name: name,
            func: handler,
            context: context
        });
    }
    return myChart;
}

function _setTimeout(cb) {
    cb && cb();
}

var myChart = getTmpMyChart();

var noThumbList = ['bmap'];

glob('../public/data/*.js', function (err, files) {
    var code = etpl.compile(tpl)({
        examples: files.map(function (fileName) {
            console.log(fileName);

            var optionGenCode = fs.readFileSync(fileName);
            var option;
            var optionGenFunc = new Function(
                'myChart', 'app', 'echarts', '$', 'Image', 'setTimeout',
                optionGenCode + ';return option;'
            );
            var app = {
                inNode: true
            };
            myChart.pendingActions = [];
            myChart.eventsHandlers = [];

            var option = optionGenFunc(myChart, app, echarts, $, Canvas.Image, _setTimeout);
            var id = path.basename(fileName, '.js');

            var optionNeedFix = option;
            // In timeline
            if (option.options) {
                optionNeedFix = option.options[0];
                _.merge(optionNeedFix, option.baseOption, true);
            }
            if (!_.isArray(optionNeedFix.series)) {
                optionNeedFix.series = [optionNeedFix.series];
            }
            optionNeedFix.series.forEach(function (seriesOpt) {
                if (seriesOpt.type === 'graph') {
                    seriesOpt.force = seriesOpt.force || {};
                    seriesOpt.force.layoutAnimation = false;
                }
                seriesOpt.animation = false;
            });

            optionNeedFix.animation = false;
            optionNeedFix.textStyle = {
                fontFamily: 'noto-thin',
                fontSize: 14
            };
            _clearTimeTickers();

            if (!_.find(noThumbList, function (name) {
                return fileName.indexOf(name) >= 0;
            })) {
                createThumb(id, option, myChart.pendingActions, myChart.eventsHandlers);
            }

            var type = optionNeedFix.series.length && optionNeedFix.series[0].type;
            var defaultName = id.split('-').map(function (item) {
                return item.charAt(0).toUpperCase() + item.slice(1);
            }).join(' ');
            //  FIXME
            if (type === 'lines' || type === 'effectScatter') {
                type = 'map';
            }
            return {
                id: id,
                title: app.title || (optionNeedFix.title && optionNeedFix.title.text) || defaultName,
                type: app.category || type
            };
        })
    });

    fs.writeFileSync('../public/javascripts/chart-list.js', code, 'utf-8');

    myChart.dispose();
    console.log('Finish update ' + files.length + ' examples.');
});

// Generate thumb
require('../public/vendors/echarts/extension/dataTool.js');
require('../public/vendors/echarts/theme/vintage');
require('../public/vendors/echarts/theme/dark');
// require('../public/vendors/echarts/map/js/china');
// require('../public/vendors/echarts/map/js/world');
var maps = ['china', 'world'];
maps.forEach(function (name) {
    var json = fs.readFileSync('../public/vendors/echarts/map/json/' + name + '.json', 'utf-8');
    echarts.registerMap(name, JSON.parse(json));
});
// Font must be add expicity
var font = new Canvas.Font('noto-thin', __dirname + '/noto-thin.ttf');

font.addFace(__dirname + '/noto-thin.ttf', 'bolder');
echarts.setCanvasCreator(function () {
    var canvas = new Canvas(128, 128);
    var ctx = canvas.getContext('2d');
    ctx.addFont(font);
    return canvas;
});
function createThumb(id, option, actions, handlers) {
    var canvas = new Canvas(700, 560);
    var ctx = canvas.getContext('2d');
    ctx.addFont(font);
    var myChart = echarts.init(canvas);
    try {
        console.time('Updated thumb');
        var needsRefresh = false;
        // No throttle
        option.brush && (option.brush.throttleType = null);
        handlers.forEach(function (handler) {
            needsRefresh = true;
            myChart.on(handler.name, handler.func, handler.context);
        });

        // FIXME blend mode seems wrong in large mode
        if (id.match('lines-airline')) {
            option.series[0].large = false;
        }

        myChart.setOption(option);
        actions.forEach(function (action) {
            needsRefresh = true;
            myChart.dispatchAction(action);
        });
        if (needsRefresh) {
            myChart.getZr().refreshImmediately();
        }
        console.timeEnd('Updated thumb');
        fs.writeFileSync('../public/data/thumb/' + id + '.png', canvas.toBuffer());
    }
    catch (e) {
        console.error(e.toString());
        console.error('-------------------------------------Thumb error');
    }
    // Must dispose after used, or the animation instance will always run
    myChart.dispose();
}