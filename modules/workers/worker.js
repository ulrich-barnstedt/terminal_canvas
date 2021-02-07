const ffmpeg = require("../ffmpeg");
const imageProcessor = require("./jimpEgProcessor")

process.on("message", (com) => {
    switch (com.action) {
        case "lRender":
            lRender(com);
            break;
    }
})

async function lRender (command) {
    let output = [];
    let filename = "./in/" + command.filename;
    let img = new imageProcessor(command.quality)

    let instance = new ffmpeg(filename, command.quality);
    let runningFF = instance.main(command.offset, command.heapSize * (command.quality === 1 ? 2 : 3), command.fps);

    runningFF.on("frame", async (frame) => {
        output.push(await img.parseResize(frame));
    })

    runningFF.on("end", () => {
        process.send(output.slice(0, command.heapSize));
    })
}