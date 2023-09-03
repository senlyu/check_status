const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('discord_urls.json', 'utf8'));

const main_channel = obj.main
const axios = require('axios');

function post_to_main(msg) {
    return axios({
        method: 'post',
        url: main_channel,
        data: {
            content: msg,
        }
    });
}

module.exports = { post_to_main }