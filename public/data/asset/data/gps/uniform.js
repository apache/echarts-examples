const fs = require('fs');

const CHUNK_COUNT = 230;

const buffer0 = fs.readFileSync(`gps_0.bin`);
const chunkSize = buffer0.byteLength / 4;
const dataAll = new Int32Array(chunkSize * CHUNK_COUNT);
const pointCount = dataAll.length / 2;

let offset = 0;

function toArrayBuffer(buf) {
    var view = new Uint8Array(buf.length);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return view.buffer;
}

for (let i = 0; i < CHUNK_COUNT; i++) {
    const buffer = fs.readFileSync(`gps_${i}.bin`);
    const array = new Int32Array(toArrayBuffer(buffer));
    for (let k = 0; k < chunkSize; k++) {
        dataAll[offset++] = array[k];
    }
}


for (let i = 0; i < CHUNK_COUNT; i++) {
    let newArray = new Int32Array(chunkSize);
    for (let k = 0; k < chunkSize;) {
        let idx = Math.round(Math.random() * (pointCount - 1));
        newArray[k++] = dataAll[idx * 2];
        newArray[k++] = dataAll[idx * 2 + 1];
    }

    fs.writeFileSync(`../gps2/gps_${i}.bin`, Buffer.from(newArray.buffer));
}