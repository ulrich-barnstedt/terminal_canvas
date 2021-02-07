const args = require("./modules/parseCommandLine")();
const renderEngine = require("./modules/renderEngine");
const ffmpeg = require("./modules/ffmpeg");
const fastAsFuck = require("./modules/fastAsFuckRender");

(async () => {
    let ffm = new ffmpeg(`./in/${args.filename}`, args.quality);
    let metaVars = await ffm.getMeta();

    let engine = new renderEngine(args, metaVars);
    engine.startWorkers();
    await engine.initialCompute();

    let terminalRender = new fastAsFuck(metaVars[1]);

    while (true) {
        let frames = engine.requestBuffer();
        if (frames === []) break;

        if (args.noGui) {
            console.log(frames.length)
        }

        await terminalRender.playArray(frames, args.noGui);
    }
})();


/*
    /*setInterval(() => {
        //console.log();
        engine.requestBuffer()
    }, 500);*/

/*engine.requestBuffer();
setTimeout(() => {
    engine.requestBuffer();
}, 1000)
setTimeout(() => {
    engine.requestBuffer();
}, 2000)
setTimeout(() => {
    engine.requestBuffer();
}, 3000)*/