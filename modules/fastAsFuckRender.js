const {terminal, cursor} = require("0x81-utils")
const chunk = require("./chunk")
const chalk = require("chalk")
const {EventEmitter} = require("events")

module.exports = class {
    constructor (fps, char) {
        this.fps = fps;

        if (!char) {
            this.char = "█";
        } else {
            this.char = char;
        }
    }

    inflateArray (array) {
        return chunk(chunk(array,4), terminal.dim.width());
    }

    renderFrame (array, noGui) {
        let lines = this.inflateArray(array);

        lines.forEach((line, height) => {
            if (noGui) return;
            cursor.move(0, height);
            let text = line.map(pixel => chalk.rgb(pixel[0], pixel[1], pixel[2])(this.char)).join("");
            cursor.write(text);
        })
    }

    async playArray (array, noGui) {
        let interval = 1000 / this.fps;

        let ev = new EventEmitter;
        let index = 0;

        let paused = false;
        ev.on("pause", () => paused = true);
        ev.on("play", () => paused = false);
        ev.on("seek", (frames) => {
            let newV = index + frames;
            if (newV > array.length - 1) {
                index = array.length;
                return;
            }
            if (newV < 0) {
                index = 0;
                return;
            }
            index = newV;
        });

        await new Promise(resolve => {
            let intervalLoop = setInterval(() => {
                if (paused) return;

                if (index >= array.length) {
                    clearInterval(intervalLoop);
                    resolve();
                    return;
                }

                this.renderFrame(array[index], noGui);
                index++;
            }, interval);
        });

        return ev;
    }
}