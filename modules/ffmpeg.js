const {spawn} = require("child_process");
const {terminal} = require("0x81-utils")
const {EventEmitter} = require("events")
const BufferHandler = require("./buffer");

module.exports = class {
    constructor (video, quality) {
        this.video = video;
        this.quality = quality;
    }

    main (offset, count, fps) {

        let options = [
            "-ss", `${(offset / fps) * (3 / 4)}`,
            "-i", this.video,
            //"-vf", `-vf 'trim=start_frame=${offset}:end_frame=${offset + count + 1}'`,
            //"-vf" : `select=\"gte(n\\, ${offset + 1000})\"`,
            "-ss", `${(offset / fps) * (1 / 4)}`,
            "-f" , "mjpeg",
            "-s", `${terminal.dim.width() * this.quality}x${terminal.dim.height() * this.quality}`,
            //"-filter:v", `fps=fps=120`,
            "-frames", `${count}`,
            //"-r", `${fps}`,
            "pipe:1"
        ]

        let proc = spawn("ffmpeg", options);
        let emitter = new EventEmitter();

        let bufSt = new BufferHandler((frame, tracker) => {
            emitter.emit("frame", frame, tracker);
        })

        proc.stdout.on("data", part => {
            bufSt.handle(part);
        })

        proc.stdout.on("close", (code) => {
            emitter.emit("end", code);
        })

        proc.stderr.on("data", d => {
            emitter.emit("err", d.toString());
        })

        return emitter;
    }

    async getMeta () {
        let proc = spawn("ffmpeg", ["-i", this.video]);
        let fc;
        let fps;

        proc.stderr.on("data", d => {
            if (fc && fps) return;
            let str = d.toString();
            let orig = d.toString();

            if (str.includes("NUMBER_OF_FRAMES:")) {
                str = str.split("NUMBER_OF_FRAMES: ")[1];
                str = str.split("\r\n")[0];

                fc = str;
            }

            str = orig;

            if (str.includes("fps,")) {
                str = str.split("fps,")[0];
                str = str.split(",").pop();

                fps = str;
            }
        })

        return await new Promise((resolve) => {
            proc.stdout.on("close", (code) => {
                resolve([Number(fc), Number(fps)]);
            })
        });
    }
}
