import type { Express } from "express"
import session from 'express-session'
import expressCookie from 'cookie-parser'
import path from 'path'
import Redis from 'ioredis'
import { config } from 'dotenv'
import fileUpload from 'express-fileupload'
import connectRedis from 'connect-redis'
import FileStore from 'session-file-store'
import {getOneDay, serverFilePath, isProduction} from '../config/functions'

const useSesstion = () =>{
    const RedisStore = connectRedis(session)
    const RedisClint = new Redis()
    return session({
        secret: process.env.SESTION_SECRIT!,
        resave: false,
        name: "YOFI_SESSTION",
        saveUninitialized: true,
        cookie: { 
            httpOnly: true,
            maxAge: getOneDay()
        },
        store: new RedisStore({
            client: RedisClint,
            disableTouch: true,
        })
    })
}
export const finalSesstion = useSesstion()
export const wrapSesstion = (express_middleWare:any) => (socket:any, next:any)  => express_middleWare(socket.request, {},next)
config()
const rootDirPath = `${__dirname}/../`
export default  (app:Express, express:any) =>{
    process.on('uncaughtException', err => {
        if(!isProduction){
            process.exit(1)
        }
        console.log(err)
    })
    app.use(fileUpload())
    app.use(expressCookie())
    app.use(express.json())
    app.use(express.static(path.join(rootDirPath ,'public')))
    app.set('view engine', 'ejs')
    app.set('views', path.join(rootDirPath , 'views'));
    app.use(express.urlencoded({extended: false}))
    app.use(finalSesstion)
}