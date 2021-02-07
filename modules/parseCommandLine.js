const config = require("./cli.json");
require("0x81-utils");
const chunk = require("./chunk");

module.exports = () => {
    let arguments = [...process.argv].returnShift().returnShift();
    let filename = arguments.shift();

    if (!filename) {
        throw "No filename provided.";
    }

    let options = chunk(arguments, 2);
    let object = Object.fromEntries(options.map(opt => {
        if (opt[0] in config) {
            return [config[opt[0]].name, !isNaN(Number(opt[1])) ? Number(opt[1]) : opt[1]];
        }
    }))

    for (let key in config) {
        if (!(config[key].name in object) && config[key].required) {
            object[config[key].name] = config[key].default;
        }
    }

    object.filename = filename;
    return object;
}