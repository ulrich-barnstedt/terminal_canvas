const workerManager = require("./workers/workerManager");

module.exports = class {
    constructor (cliArgs, meta) {
        this.meta = meta;
        this.maxBuff = cliArgs.threads;
        this.maxBuffLength = this.maxBuff * cliArgs.heapSize;
        this.mainBuffer = [];

        this.workers = [];
        this.workersBusy = [];

        this.offset = 0;
        this.cliArgs = cliArgs;
        this.frameCount = this.meta[0];
        this.heap = cliArgs.heapSize;
    }

    startWorkers () {
        for (let i = 0; i < this.maxBuff; i++) {
            this.workers[i] = new workerManager("./modules/workers/worker.js");
            this.workers[i].start();

            this.workersBusy[i] = 1;
        }
    }

    async initialCompute () {
        await this.assignEmptyWorker(this.offset);
    }

    requestBuffer () {
        let array = this.mainBuffer.flat();
        let part = array.splice(0, this.heap);

        this.mainBuffer = [array];

        this.checkFill();
        return part;
    }

    async checkFill () {
        if (this.offset + this.heap > this.frameCount) return;

        for (let workerID = 0; workerID < this.maxBuff; workerID++) {
            if (this.mainBuffer[0].length + this.heap * (workerID + 1) > this.maxBuffLength + this.heap) break;

            this.assignEmptyWorker(this.offset + this.heap * workerID);
        }
    }

    async assignEmptyWorker (offset) {
        for (let i = 0; i < this.workersBusy.length; i++) {
            if (this.workersBusy[i] !== 1) {
                continue;
            }

            let highest = this.workersBusy.reduce((acc, v) => v > acc ? v : acc);
            this.workersBusy[i] = highest + 1;

            let data = await this.workers[i].processData({
                action : "lRender",
                offset : offset,
                fps : this.meta[1],
                ...this.cliArgs
            });

            this.mainBuffer[highest + 1] = data;
            this.workersBusy[i] = 1;
            this.offset += this.heap;

            break;
        }
    }
}