const jimp = require("jimp");
const jpeg = require("jpeg-js");
const {terminal} = require("0x81-utils")

module.exports = class {
    constructor (qualityFactor) {
        this.qualityFactor = qualityFactor;
    }

    async parseResize (raw) {
        if (this.qualityFactor === 1) {
            return await this.jpeg(raw);
        } else {
            return await this.jimp(raw);
        }
    }

    jpeg (raw) {
        return jpeg.decode(raw).data.toJSON().data;
    }

    async jimp (raw) {
        return await new Promise(resolve => {
            jimp.read(raw).then(img => {
                img = img.resize(terminal.dim.width(), terminal.dim.height());
                resolve(img.bitmap.data.toJSON().data);
            })
        })
    }
}