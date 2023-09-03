var portscanner = require('portscanner')
 
function check_status(port, server) {
    // Checks the status of a single port
    return portscanner.checkPortStatus(port, server)
}

module.exports = { check_status }