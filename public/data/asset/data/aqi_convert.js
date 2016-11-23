var Papa = require('papaparse');
var fs = require('fs');

var res = Papa.parse(fs.readFileSync('./aqi.csv', 'utf-8'));
var arr = res.data.filter(function (item) {
    return item[2] === '北京';
}).map(function (item) {
    return [item[5], +item[3]];
});

fs.writeFileSync('aqi-beijing.json', JSON.stringify(arr), 'utf-8');