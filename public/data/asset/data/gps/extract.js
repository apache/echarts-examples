function toArrayBuffer(buffer) {

    // 创建一个Uint8类型的数组对象。
    var view = new Uint8Array(buffer.length);

    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];  // 把buffer的数据拷贝到ab缓存内。
    }
    return view;
}
function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}



var fs = require('fs');

var CHUNK_COUNT = 230;

for (var i = 0; i < CHUNK_COUNT; i++) {
    var buffer = fs.readFileSync(`gps_${i}.bin`);
    var array = new Float32Array(toArrayBuffer(buffer).buffer);
    var newArray = new Float32Array(Math.floor(array.length / 4) * 2);

    for (var k = 0; k < newArray.length; k += 2) {
        newArray[k] = array[k * 2];
        newArray[k + 1] = array[k * 2 + 1];
    }
    var buffer = toBuffer(newArray.buffer);
    fs.writeFileSync(`gps_${i}.bin`, buffer);
}