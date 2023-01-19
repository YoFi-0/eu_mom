//libs
import express from 'express'
import server_config, {finalSesstion, wrapSesstion} from './config/server_config'
import routeRoute from './routes/pages/route'
import indexRoute from './routes/pages'
import {config} from 'dotenv'
// import apiRoute from './routes/APIs/api'
import { isProduction, port } from './config/functions'
import usersRoute from './routes/pages/users'
import GoogleRoute from './routes/pages/google'
import publisher_settingsRoute from './routes/pages/publisher_settings'
import complete_regRoute from './routes/pages/complete_reg'
const app = express()
import http from 'http'
const server =  http.createServer(app)
import {Server, Socket} from "socket.io"
config()
const io = new Server(server, {cors: {origin: `${process.env.PROTOCOL}://${process.env.DOMAIN}`}});


import { Connection } from './database/connection'
import { DB_Books, DB_Stars, DB_Users, GoogleUser, RegUserSesstinData, UserSesstinData } from './config/types'
import PublishersTable from './database/models/publishers'
import BooksTable from './database/models/books'
import StarsTable from './database/models/stars'
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

type  sokectSEsstion  = {
    isLogin: boolean,
    hero:boolean,
    user_data:UserSesstinData,
    reg_user_data:RegUserSesstinData,
    msg:string,
}

app.use('/route', routeRoute)
app.use('/', indexRoute)
// app.use('/api', apiRoute)
app.use('/google', GoogleRoute)
app.use('/stars', usersRoute)
app.use('/complete_reg', complete_regRoute)
app.use('/publisher_settings', publisher_settingsRoute)


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


io.use(wrapSesstion(finalSesstion))
io.on('connection', (socket) => {
    const session =  (socket.request as any).session as sokectSEsstion
    const httpPath = socket.request.headers.referer?.replace(`${process.env.PROTOCOL}://${process.env.DOMAIN}`, '')
    console.log('a user connected');
    if(!httpPath){
        return
    }
    io_get_my_books(socket, session, httpPath)
    io_get_create_rate(socket, session, httpPath)
});

const io_get_create_rate = (socket:Socket, session:sokectSEsstion, path:string) =>{
    socket.on('get_create_rate', async(data) => {
        if(!data.pu_id || !data.rate){
            return
        }
        if(!session.user_data || !session.user_data.id){
            return socket.emit('send_create_rate',{
                res:false,
                msg:'not_login'
            })
        }
        try{

           const isUpdated =  await StarsTable.update({
                stars:data.rate
            } as DB_Stars, {
                where:{
                    publisher_id:data.pu_id,
                    user_id:session.user_data.id
                } as DB_Stars,
                logging:false
            })
            if(isUpdated[0] == 0){
                await StarsTable.create({
                    stars:data.rate,
                    publisher_id:data.pu_id,
                    user_id:session.user_data.id
                } as DB_Stars, {
                    logging:false
                })
            }
            return socket.emit('send_create_rate',{
                res:true,
                msg:'not_login'
            })
            
        } catch(err){
            console.log(err)
            return socket.emit('send_create_rate',{
                res:false,
                msg:'err'
            })
        }
    })
}

const io_get_my_books = (socket:Socket, session:sokectSEsstion, path:string) =>{
    socket.on("get_my_books", async(data) => {
        var getAllBooks
        try{
             getAllBooks = await BooksTable.findAll({
             where:{
                 user_id:data?.user_id ? Number(data?.user_id) : session.user_data.id
             } as DB_Books,
             logging:false
            })
        } catch(err){
             socket.emit('send_my_books', {
                 res:false,
                 err:true,
                 data:null
             })
         return
        }
        if(getAllBooks.length == 0){
             socket.emit('send_my_books', {
                 res:false,
                 data:null
             })
             return
        }
        socket.emit('send_my_books', {
             res:true,
             data:getAllBooks.map(bookDB => {
                const book:DB_Books = bookDB.get()
                delete book.user_id
                return book
             })
         })
     });
}

