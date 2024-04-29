import Logger from 'pretty-logger';

interface Log {
    info: (message: string) => void,
    error: (message: string) => void,
    warn: (message: string) => void,
    warning: (message: string) => void,
    debug: (message: string) => void,
    trace: (message: string) => void,
}

// configure level one time, it will be set to every instance of the logger
Logger.setLevel('info'); // only warnings and errors will be shown
Logger.setLevel('info', true); // only warnings and errors will be shown and no message about the level change will be printed

var customConfig = {
    showMillis: true,
    showTimestamp: true,
    info: "green",
    error: ["bgRed", "bold"],
    debug: "rainbow"
};


var log: Log = new Logger(customConfig) // custom config parameters will be used, defaults will be used for the other parameters
//var log = new Logger(); // you can also do this to accept the defaults

// log.error("An error occurred"); // will be red
// 	log.warn("I've got a bad feeling about this!"); // will be yellow
// 	log.info("Something just happened, thought you should know!"); // will be green
//     log.debug("The value of x is: " + x); // will be blue
//     log.trace("Heres some more stuff to help out."); // will be gray
export default log;