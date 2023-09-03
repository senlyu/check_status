var portscanner = require('portscanner')
 
function check_status(port, server, callback) {
    // Checks the status of a single port
    portscanner.checkPortStatus(port, server, callback)
}

module.exports = { check_status }