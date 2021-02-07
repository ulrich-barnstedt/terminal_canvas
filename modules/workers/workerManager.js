const {fork} = require("child_process")

module.exports = class {
    constructor (file) {
        this.file = file;
    }

    start () {
        this.proc = fork(this.file);
    }

    async processData (options) {
        this.proc.send(options);

        return new Promise(resolve => {
            this.proc.once("message", data => resolve(data));
        })
    }
}