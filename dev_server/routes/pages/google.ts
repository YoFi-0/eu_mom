import {Router} from 'express'
import passport from 'passport'
import googleAuth2 from 'passport-google-oauth2'
import {config} from 'dotenv'
import {DB_Users, GoogleUser } from '../../config/types'
import UsersTable from '../../database/models/users'
const invoiceRoute = Router()
config()
const GoogleStartgy = googleAuth2.Strategy

passport.deserializeUser((user, done) => {
    done(null, user as any)
})
passport.serializeUser((user, done) => {
    done(null, user as any)
})


passport.use(new GoogleStartgy({
    clientID:process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret:process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL:`${process.env.PROTOCOL}://${process.env.DOMAIN}/google/ok`,
    passReqToCallback:true,
} as any,
    function (request:any, accessToken:any, refreshToken:any, profile:any, done:any) {
        return done(null, profile)
    }
))
invoiceRoute.get('/', passport.authenticate('google', {scope:['profile', 'email']}))

invoiceRoute.get('/ok', passport.authenticate('google', {failureFlash: '/not_ok'}) , async(req, res):Promise<void> => {
    const reqUserData  = req.user as GoogleUser
    if(!reqUserData){
        res.status(500)
        console.log('no google user')
        res.send('server error')
        return
    }
    var isUserFound
    try{
        isUserFound = await UsersTable.findOne({
            where:{
                email:reqUserData.email,
            } as DB_Users,
            logging:false
        })
    } catch(err){
        res.status(500)
        console.log(err)
        res.send('server error')
        return
    }
    if(isUserFound){
        const user_from_db:DB_Users = isUserFound.get()
        req.session.isLogin = true
        req.session.user_data = {
            name:reqUserData.displayName,
            email:reqUserData.email,
            picture:reqUserData.picture,
            google_id:reqUserData.id,
            id:user_from_db.id,
            type:user_from_db.type
        }
        res.redirect('/')
        return
    }
    
    try{
        req.session.reg_user_data = {
            name:reqUserData.displayName,
            email:reqUserData.email,
            picture:reqUserData.picture,
            google_id:reqUserData.id,
        }
        req.session.hero = true
        res.redirect('/complete_reg')
        return
        // اكمال الإعدادات الباقية هل هو كاتب او ناشر
        // غكمال بيناته اللخاصة على حسب إختياره
    } catch(err){
        res.status(500)
        console.log(err)
        res.send('server error')
        return
    }
})
invoiceRoute.get('/not_ok', (req, res)=> {
    res.send('not okay')
})


export default invoiceRoute