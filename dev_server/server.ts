//libs
import express from 'express'
import server_config from './config/server_config'
import routeRoute from './routes/pages/route'
import indexRoute from './routes/pages'
import apiRoute from './routes/APIs/api'
import { isProduction, port } from './config/functions'
import GoogleRoute from './routes/pages/google'
import complete_reg from './routes/pages/complete_reg'
const app = express()
import http from 'http'
const server =  http.createServer(app)
import {Server} from "socket.io"
const io = new Server(server);
import { Connection } from './database/connection'
import { DB_Users, GoogleUser, RegUserSesstinData, UserSesstinData } from './config/types'
server_config(app, express)



declare module 'express-session' {
    interface SessionData {
        isLogin: boolean,
        hero:boolean,
        user_data:UserSesstinData,
        reg_user_data:RegUserSesstinData,
        msg:string,
    }
}

app.use('/route', routeRoute)
app.use('/', indexRoute)
app.use('/api', apiRoute)
app.use('/google', GoogleRoute)
app.use('/complete_reg', complete_reg)


server.listen(port, async()=>{
    try{
        await Connection.sync({
            logging: false,
            force: false
        })
        console.log('database connected')
    } catch(err) {
        console.log('database Error')
        console.log(err)
    }
    
    console.log(`production Mode ${isProduction ? 'on' : 'off'}`)
    console.log(`yofi server start on port => ${port}`)
})

io.on('connection', (socket) => {
    console.log('a user connected');
});