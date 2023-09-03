const DELAYS = [
    10,
    30,
    60,
    5*60,
    60*60,
    24*60*60,
]


const { check_status } = require('./check_status')
const { post_to_main } = require('./discord')

class Task {
    constructor(params) {
        this.params = params
    }

    async start() {}
    stop() {}

    async restart() {
        this.stop()
        await this.start()
    }
}



class WebTask extends Task {
    init() {
        this.server_address = this.params.server_address
        this.port = this.params.port
        this.rate = 0
        this.name = this.params.name
    }

    async start() {
        console.log(`${this.name} start listening...`)
        await this.loop_run()
    }

    stop() {
        if (this.work) {
            clearTimeout(this.work)
        }
    }

    async loop_run() {
        while (true) {
            await this.run(DELAYS[this.rate]*1000)
        }
    }

    async run(timer) {
        let self = this
        return new Promise((resolve, reject)=>{
            this.work = setTimeout(() => {
                check_status(self.port, self.server_address).then(async (status) =>{
                    self.rate = await self.timer_status_trans(self, status)
                    resolve()
                }).catch(async (err)=>{
                    await self.log_status()
                    reject(err)
                })
            }, timer)
        })
    }

    async log_status() {
        return
    }

    content_generate(status, current_level) {
        let msg = `${this.name}: ${status}, server: ${this.server_address}, port: ${this.port}, current level: ${current_level}.`
        if (current_level>=4) {
            msg = msg + ' ' + `Next check will be ${Date(Date.now()+DELAYS[this.rate]*1000)} `
        }
        return msg
    }

    async report_status(status, current_level) {
        let msg = this.content_generate(status, current_level)
        if (status!=="normal") {
            await post_to_main(msg)
        }
        console.log(msg)
    }

    async timer_status_trans(self, status) {
        let status_rate
        if (status==="open") {
            status_rate = 0
            let current = self.rate
            if (current!==0) {
                await self.report_status("back to normal", status_rate)
            } else {
                await self.report_status("normal", status_rate)
            }
        } else if (status==="closed") {
            status_rate = Math.min(self.rate + 1, DELAYS.length - 1)
            await self.report_status("closed", status_rate)
        }
        return status_rate
    }
}

module.exports = { WebTask }