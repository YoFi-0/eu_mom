import { Request, Response, Router } from 'express'
import { isInMidOfReg } from '../../middlewares/middlewares'
import UsersTable from '../../database/models/users'
import { BodyFileType, DB_Publishers, DB_Users, SocialObj_from_DB_Publishers } from '../../config/types'
import { Op } from 'sequelize'
import path from 'path'
import {promisify} from 'util'
import PublishersTable from '../../database/models/publishers'
import { books_langs, books_types, writeFileExpress } from '../../config/functions'
const complete_reg = Router()

complete_reg.use(isInMidOfReg)



complete_reg.get('/', async(req, res) => {
    res.render('complete_reg',{
        username:req.session.reg_user_data?.name,
        photo:req.session.reg_user_data?.picture,
        badMsg:'',
        books_types:books_types,
        books_langs:books_langs
    })
})

complete_reg.post('/user', async(req, res) => {
    const {email, google_id, name, picture} = req.session.reg_user_data!
    if(!google_id || !email || !name || !picture){
        console.log('no sesstion data => /complete_reg/user (post)') 
        res.status(500)
        return res.send('server error')
    }
    var getUser
    try{
        const isUserFound = await UsersTable.findOne({
            where: {
                [Op.or]:[
                    {email:email} as DB_Users,
                    {google_id:google_id} as DB_Users
                ]
            },
            logging:false
        })
        if(isUserFound){
            console.log('there is a user in the database => /complete_reg/user (post)') 
            res.status(500)
            return res.send('server error')
        }
        getUser =  await UsersTable.create({
            email:email,
            google_id:google_id,
            type: 'user'
        } as DB_Users, {logging:false})
        getUser = await getUser.save()
    } catch(err){
        console.log('err => /complete_reg/user (post)') 
        console.log(err)
        res.status(500)
        return res.send('server error')
    }
    const user:DB_Users = getUser.get()
    req.session.isLogin = true
    req.session.user_data = {
        name:name,
        email:email,
        picture:picture,
        google_id:google_id,
        id:user.id,
        type:user.type
    }
    delete req.session.reg_user_data
    res.redirect('/')
})

const publisherPost = async(req:Request, res:Response, {
    _1msg,
    _2msg,
    _3msg
}:{
    _1msg:string
    _2msg:string
    _3msg:string
}) => {
    type reqBody = {
        publisher_name:string
        country:string
        city:string
        publisher_type:string
        books_langs:string
        books_types:string
        social:string
    }
    const form = req.body as reqBody

    if(!form.books_langs || !form.books_types || !form.city || !form.country || !form.publisher_name || !form.publisher_type){
        res.send(_3msg)
        return
    }

    if(!req.files){
        res.send(_1msg)
        return
    }

   
    const license_pdf = req.files.license_pdf as BodyFileType
    const publisher_image = req.files.publisher_image  as BodyFileType
    if(!license_pdf){
        res.send(_1msg)
        return
    }
    if(license_pdf.mimetype.split('/')[1].toLowerCase() != 'pdf'){
        res.send(_2msg)
        return
    }
    var isHaveSocial = true

    if(!isHaveSocial){
        isHaveSocial = false
    }
    if(form.social){
        try{
            const socialObj = JSON.parse(form.social)  as SocialObj_from_DB_Publishers
            if(!socialObj.facebook && !socialObj.instagram && !socialObj.twitter && !socialObj.phone){
                isHaveSocial = false
            }
        } catch(err){
            isHaveSocial = false
        }
    }
    const {email, google_id, name, picture} = req.session.reg_user_data!
    if(!google_id || !email || !name || !picture){
        console.log('no sesstion data => /complete_reg/publisher (post)') 
        res.status(500)
        return res.send('server error')
    }
    var getUser
    try{
        const isUserFound = await UsersTable.findOne({
            where: {
                [Op.or]:[
                    {email:email} as DB_Users,
                    {google_id:google_id} as DB_Users
                ]
            },
            logging:false
        })
        if(isUserFound){
            console.log('there is a user in the database => /complete_reg/publisher (post)') 
            res.status(500)
            return res.send('server error')
        }
    } catch(err){
        console.log('err => /complete_reg/publisher (post)') 
        console.log(err)
        res.status(500)
        return res.send('server error')
    }
    const files_path =  path.join(__dirname, '../../public/publisher_files')

    
    try{
        getUser =  await UsersTable.create({
            email:email,
            google_id:google_id,
            type: 'publisher'
        } as DB_Users, {logging:false})
        getUser = await getUser.save()
    } catch(err){
        console.log('err => /complete_reg/publisher (post)') 
        console.log(err)
        res.status(500)
        return res.send('server error')
    }
    const user:DB_Users = getUser.get()
    try{
        const isLicense_pdfCreated =  await writeFileExpress(license_pdf ,path.join(files_path, `${user.id}_license.pdf`))
        if(!isLicense_pdfCreated){
            console.log('connot create file license_pdf => /complete_reg/publisher (post)') 
            res.status(500)
            return res.send('server error')
        }
        if(publisher_image){
            const isPublisher_imageCreated = await writeFileExpress(publisher_image ,path.join(files_path, `${user.id}_img.png`))
            if(!isPublisher_imageCreated){
                console.log('connot create file publisher_image => /complete_reg/publisher (post)') 
                res.status(500)
                return res.send('server error')
            }
        }
        await PublishersTable.create({
            books_langs:form.books_langs,
            books_types:form.books_types,
            image_url:publisher_image ? `/publisher_files/${user.id}_img.png` : null,
            location:`${form.country}_----_${form.city}`,
            license_type:form.publisher_type,
            name:form.publisher_name,
            social:isHaveSocial ? form.social : null,
            user_id:user.id
        } as DB_Publishers , {logging:false})
    }catch(err){
        console.log('err => /complete_reg/publisher (post)') 
        console.log(err)
        res.status(500)
        return res.send('server error')
    }
    req.session.isLogin = true
    req.session.user_data = {
        name:name,
        email:email,
        picture:picture,
        google_id:google_id,
        id:user.id,
        type:user.type
    }
    delete req.session.reg_user_data
    res.redirect('/')
}

complete_reg.post('/publisher', (req, res) => {
    publisherPost(req, res, {
        _1msg:'يجب عليك رفع ملف الرخصة على صيغة PDF',
        _2msg: 'صيغة الملف ليست pdf',
        _3msg:"رجاءً إملئ كل الحقول المطلوبة"
    })
})
export default complete_reg