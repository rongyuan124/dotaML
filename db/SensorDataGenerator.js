/**
 * Created by pengwei on 6/18/15.
 */
var Feed = require('../feed/Feed');
var feedId = 'Qkvvix6QWx';
var now = new Date().getTime();
var bufferedData = [];

for(var t = 0; t < 100000; t++){
    var value = Math.sin(t/1000) * 20 + Math.random() * 5;
    value = value.toFixed(2);
    var time = now - t * 5000;
    bufferedData.push({time:time, value:value});
}

var feed = new Feed(null, null, {
    feedId: feedId
});

feed.addBufferedData(bufferedData);