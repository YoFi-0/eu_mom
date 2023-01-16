import { Router } from 'express'
import { heroSesstion, isLogin, isPublisher } from '../../middlewares/middlewares'
import PublishersTable from '../../database/models/publishers'
import { DB_Publishers, BodyFileType, SocialObj_from_DB_Publishers } from '../../config/types'
import { books_langs, books_types, writeFileExpress } from '../../config/functions'
import path from 'path'
const publisher_settings = Router()

publisher_settings.use(isLogin)
publisher_settings.use(heroSesstion)
publisher_settings.use(isPublisher)


publisher_settings.get('/', async(req, res) => {
    if(!req.session.user_data){
        res.send("server error")
        return
    }
    var getPublisher
    try{
        getPublisher=  await PublishersTable.findOne({
            where:{
                user_id:req.session.user_data.id
            } as DB_Publishers,
            logging:false
        })
    } catch(err){
        console.log(err)
        res.send("server error")
    }
    if(!getPublisher){
        req.session.destroy(() => {
            return null
        })
        res.send("server error")
        return
    }
    const publisher_info:DB_Publishers = getPublisher.get()
    res.render('publisher_settings', {
        books_langs:books_langs, //
        books_types:books_types, //
        db_langs:publisher_info.books_langs, //
        db_types:publisher_info.books_types, //
        publisher_name:publisher_info.name, // 
        publisher_id:publisher_info.id, //
        publisher_img:publisher_info.image_url, // 
        publisher_license_type:publisher_info.license_type, //
        publisher_location_city:publisher_info.location.split('_----_')[1], //
        publisher_location_country:publisher_info.location.split('_----_')[0],
        publisher_social: publisher_info.social ? JSON.parse(publisher_info.social) : null
    })
})

publisher_settings.post('/', async(req, res) => {
    type reqBody = {
        publisher_name:string
        country:string
        city:string
        publisher_type:string
        books_langs:string
        books_types:string
        social:string
        publisher_id:string
    };
    const {publisher_name, books_langs, books_types , city, country , publisher_type,  social, publisher_id} =  req.body as reqBody
    if(!publisher_id){
        res.redirect('/publisher_settings')
        return
    }


    var isHaveImageUrl = false

    if(req.files){
        const files_path =  path.join(__dirname, '../../public/publisher_files')
        const license_pdf = req.files.license_pdf as BodyFileType
        const publisher_image = req.files.publisher_image as BodyFileType
        if(license_pdf){
            const isLicense_pdfCreated =await writeFileExpress(license_pdf, path.join(files_path, `${req.session.user_data!.id}_license.pdf`))
            if(!isLicense_pdfCreated){
                console.log('connot create file license_pdf => /publisher_settings (post)') 
                res.status(500)
                return res.send('server error')
            }
        }
        if(publisher_image){
            const isPublisher_imageCreated = await writeFileExpress(publisher_image, path.join(files_path, `${req.session.user_data!.id}_img.png`))
            if(!isPublisher_imageCreated){
                console.log('connot create file publisher_image => /publisher_settings (post)') 
                res.status(500)
                return res.send('server error')
            }
            isHaveImageUrl = true
        }
    }

    if(!req.body){
        res.redirect('/publisher_settings')
        return
    }
    

    try{
        const getPublisher = await PublishersTable.findOne({
            where:{
                user_id:req.session.user_data!.id,
                id:Number(publisher_id)
            } as DB_Publishers,
            logging:false
        })
        if(!getPublisher){
            req.session.destroy(() => {
                return null
            })
            res.redirect('/')
            return
        }

        const publisher:DB_Publishers = getPublisher.get()
        var finalSocialObj:SocialObj_from_DB_Publishers | null = null
        if(social){
            var obgSocial:SocialObj_from_DB_Publishers
            try{
                obgSocial = JSON.parse(social)
                finalSocialObj = obgSocial
            } catch(err){
                console.log('connot decod json files => /publisher_settings (post)') 
                res.status(500)
                res.send('server error')
                return
            }
        }
        await PublishersTable.update({
            name: publisher_name ? publisher_name : publisher.name,
            books_langs: books_langs ? books_langs : publisher.books_langs,
            books_types: books_types ? books_types : publisher.books_types,
            license_type: publisher_type ? publisher_type : publisher.license_type,
            location : city && country ? `${country}_----_${city}` : publisher.location,
            social: social ? social : publisher.social,
            image_url: isHaveImageUrl ? `/publisher_files/${req.session.user_data!.id}_img.png` : publisher.image_url,
        } as DB_Publishers, {
            where:{
                user_id:req.session.user_data!.id,
                id:Number(publisher_id)
            } as DB_Publishers,
            logging:false
        })
    } catch(err){
        console.log(err)
        res.status(500)
        res.send('server error')
        return
    }
    console.log('done')
    res.redirect('/publisher_settings')
})
publisher_settings.get('/create_book', (req, res) => {
    res.render('publisher_settings_create_book')
})

export default publisher_settings

function promisify(mv: Function) {
    throw new Error('Function not implemented.')
}
