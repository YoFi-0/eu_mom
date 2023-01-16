import { Router } from 'express'
const index = Router()

index.get('/', (req, res) => {
    if(req.session.isLogin && req.session.user_data){
        return res.render('index', {
            isLogin:true,
            username:req.session.user_data.name,
            email:req.session.user_data.email,
            picture:req.session.user_data.picture,
            user_type:req.session.user_data.type
        })
    }
    return res.render('index', {
        isLogin:false
    })
})

index.post('/log_out', (req, res) => {
    req.session.destroy(() => {
        return null
    })
   return res.redirect('/')
})
export default index