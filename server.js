import express from 'express'
import http from 'http'
import socketio from 'socket.io'
import randomColor from 'randomcolor'
import ramda from 'ramda'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

import MongoClient from 'mongodb';

var url = "mongodb://localhost:27017/jogo";

MongoClient.connect(url, function (err, database) {

    var dbo = database.db("jogo");

    var db = {
        players: [],
        points: {}
    }

    sockets.on('connection', (socket) => {
        const playerId = socket.id

        dbo.collection("jogo").findOne({}, function (err, result) {
            socket.emit('setup', result)
        })

        socket.on('disconnect', () => {
            console.log('disconnect')
        })

        socket.on('add-player', (command) => {

            db.players[playerId] = {
                x: command.x,
                y: command.y,
                color: command.color
            }

            socket.emit('sync', db)
        })


        setInterval(() => {
            dbo.collection("jogo").findOne({}, function (err, result) {
                if (err) throw err;
                console.log('synced')
                socket.emit('sync', result)
            })
        }, 1000)

        socket.on('sync', (syncDb) => {
            dbo.collection("jogo").findOne({}, function (err, result) {
                if (err) throw err;
                if (Object.keys(syncDb.points).length > Object.keys(result.points).length) {
                    socket.emit('sync', result)
                    let points = Object.assign(syncDb.points, result.points)
                    dbo.collection("jogo").updateOne({_id: MongoClient.ObjectID(ramda.clone(result._id))}, {
                        $set: {
                            points: points,
                            players: syncDb.players,
                            teste: 'oi'
                        }
                    }, function (err, res) {
                        if (err) throw err;
                        if (res.result.nModified > 0) {
                            console.log(res.result.nModified + " document(s) updated");
                        }
                    })
                }
            });
        })

    })

    server.listen(3333, () => {
        console.log(`> Server listening on port: 3333`)
    })

});
