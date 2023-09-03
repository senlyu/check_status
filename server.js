
const { WebTask } = require('./WebTask')
const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('service_map.json', 'utf8'));
const { post_to_main } = require('./discord')

post_to_main("start listening to: " + JSON.stringify(obj))
tasks = Object.keys(obj).map((key) => {
    value = obj[key]
    return new WebTask({ ...value, name: key })
}).map((task) => {
    task.init()
    return task.start().catch((e) => {
        console.log(e.toString())
        return post_to_main(e.toString())
    })
})
Promise.all(tasks).then(()=>{
    post_to_main("server stopped")
}).catch((e)=>{
    post_to_main("server stopped: " + e.toString())
})


