const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('discord_urls.json', 'utf8'));
const axios = require('axios');
require('dotenv').config();

let channel = process.env.NODE_MODE!=="PROD" ? obj.test : obj.main

function post_to_main(msg) {
    return axios({
        method: 'post',
        url: channel,
        data: {
            content: msg,
        }
    });
}

module.exports = { post_to_main }