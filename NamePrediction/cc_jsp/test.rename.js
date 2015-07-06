var jstz = require("../dist/jstz").jstz, expected_tz = process.argv[2], actual_tz = null;

"undefined" === typeof expected_tz ? (actual_tz = jstz.determine().name(), console.log(actual_tz)) : (process.env.TZ = expected_tz, 
actual_tz = jstz.determine().name(), expected_tz === actual_tz ? console.log("Successfully validated ", expected_tz, "===", actual_tz) : console.log("Assertion failed ", expected_tz, "!==", actual_tz));
