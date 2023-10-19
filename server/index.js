import dotenv from 'dotenv'
import express from 'express'
import logger from 'morgan'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config()
const port = process.env.PORT ?? 3000

const app  = express()

const server = createServer(app)// TODO: Creamos un servidor
const io = new Server(server, {
    connectionStateRecovery: {}
})

const db = createClient({
    url: process.env.URL_DB,
    authToken: process.env.DB_TOKEN
})

await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        user TEXT
    )
`)

io.on('connection', async (socket) => {
    console.log('a user has connected!')

    socket.on('disconnect', () => {
        console.log('an user has disconnect')
    })

    socket.on('chat message', async (msg) => {
        let result
        const username = socket.handshake.auth.username ?? 'anonymous'
        try {
            result = await db.execute({
                sql: `INSERT INTO messages (content, user) VALUES (:message, :username)`,
                args: { message: msg, username }
            })
        } catch (error) {
            console.log(error)
            return
        }

        console.log('message_:', msg, result.lastInsertRowid.toString())
        io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
    })

    // TODO: Rescatamos las información que nos envia el cliente en el socket
    // console.log('auht_:',socket.handshake.auth)
    // console.log('address:',socket.handshake.address)
    // console.log('headers_:',socket.handshake.headers)
    // console.log('query:',socket.handshake.query)
    // console.log('time:',socket.handshake.time)

    if (!socket.recovered) { // Recuperase los mensajes sin conexion
        try {
            const results = await db.execute({
                sql: `SELECT id, content, user FROM messages WHERE id > ?`,
                args: [socket.handshake.auth.serverOffset ?? 0]
            })

            results.rows.forEach( row => {
                socket.emit('chat message', row.content, row.id.toString(), row.user)
            })
        } catch (error) {
            console.log(error)
        }
    }
})

// TODO: Para tracear los logs de las peticiones
app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/public/index.html')
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})