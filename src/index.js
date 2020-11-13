(async () => {
    const express = require('express')
    const app = express()
    const path = require('path')
    const port = 4000
    const fetch = require('node-fetch')
    let gameAPIdata = await (await fetch('https://api.prodigygame.com/game-api/status')).json()
     let version = gameAPIdata.data.prodigyGameFlags.gameDataVersion
    let prodigydata = await (await fetch(`https://cdn.prodigygame.com/game/data/production/${version}/data.json`)).json()

    app.get('/v1/:type/:id', async function (req, res) {
        let gameAPIdata = await (await fetch('https://api.prodigygame.com/game-api/status')).json()
     let version = gameAPIdata.data.prodigyGameFlags.gameDataVersion
        prodigydata = await (await fetch(`https://cdn.prodigygame.com/game/data/production/${version}/data.json`)).json()
        try {
            if (!prodigydata[req.params.type][req.params.id]) {
                res.status(404)
                res.send({
                    "status": "error",
                    "message": `Cannot get ${req.params.type} with ID ${req.params.id}`
                })
            } else {
                res.send(prodigydata[req.params.type][req.params.id])
            }
        } catch {
            res.status(404)
            res.send({
                "status": "error",
                "message": "Unable to get the requested resource"
            })
        }
    });
    app.get('/v1/:type', async function (req, res) {
        let gameAPIdata = await (await fetch('https://api.prodigygame.com/game-api/status')).json()
        let version = gameAPIdata.data.prodigyGameFlags.gameDataVersion
        prodigydata = await (await fetch(`https://cdn.prodigygame.com/game/data/production/${version}/data.json`)).json()
        if (!prodigydata[req.params.type]) {
            res.status(404)
            res.send({
                "status": "error",
                "message": `Unable to get asset type ${req.params.type}`
            })
        } else {
            res.send(prodigydata[req.params.type])
        }
    });
    app.get('/', function (req, res) {
        res.status(200)
        res.sendFile(path.join(__dirname + '/src/HTML/index.html'));
    });
    app.get('/v1/', function (req, res) {
        res.status(404)
        res.send({
            "status": "error",
            "message": "Provide an asset type"
        })
    })
    app.get('/docs/', function (req, res) {
        res.status(200)
        res.sendFile(path.join(__dirname + '/src/HTML/docs.html'));
    })
    app.get('/docs/:endpoint/', function (req, res) {
        const docs = Object.keys(prodigydata)
        if (!docs.includes(req.params.endpoint)) {
            res.status(404)
            res.sendFile(path.join(__dirname + '/src/HTML/404.html'))
        } else {
            res.status(200)
            res.sendFile(path.join(__dirname + `/src/HTML/${req.params.endpoint}.html`));
        }
    })

    app.listen(port, () => {
        console.log(`Prodigy API is up on port ${port}`)
    })

})()
