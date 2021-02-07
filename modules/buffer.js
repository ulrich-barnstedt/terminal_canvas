const SOI = Buffer.from([0xff, 0xd8]);
const EOI = Buffer.from([0xff, 0xd9]);

module.exports = class {
    constructor (doneFn) {
        this.chunks = [];
        this.tracker = {
            start : process.hrtime.bigint(),
            frameCount : 0
        }

        this.doneFn = doneFn;
    }

    handle (chunk) {
        const eoiPos = chunk.indexOf(EOI);
        const soiPos = chunk.indexOf(SOI);

        if (eoiPos === -1) {
            this.chunks.push(chunk);
        } else {
            const part1 = chunk.slice(0, eoiPos + 2);
            if (part1.length) {
                this.chunks.push(part1);
            }
            if (this.chunks.length) {
                this.tracker.frameCount++;
                this.doneFn(Buffer.concat([...this.chunks]), this.tracker)
            }
            this.chunks = [];
        }
        if (soiPos > -1) {
            this.chunks = [];
            const part2 = chunk.slice(soiPos)
            this.chunks.push(part2);
        }
    }
}