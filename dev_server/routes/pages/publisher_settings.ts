import { Router } from 'express'
import { heroSesstion, isLogin, isPublisher } from '../../middlewares/middlewares'
import PublishersTable from '../../database/models/publishers'
import { DB_Publishers, BodyFileType, SocialObj_from_DB_Publishers, DB_Books } from '../../config/types'
import { books_langs, books_types, writeFileExpress } from '../../config/functions'
import path from 'path'
import BooksTable from '../../database/models/books'
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
        // var finalSocialObj:SocialObj_from_DB_Publishers | null = null
        // if(social){
        //     var obgSocial:SocialObj_from_DB_Publishers
        //     try{
        //         obgSocial = JSON.parse(social)
        //         finalSocialObj = obgSocial
        //     } catch(err){
        //         console.log('connot decod json files => /publisher_settings (post)') 
        //         res.status(500)
        //         res.send('server error')
        //         return
        //     }
        // }
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
publisher_settings.get('/create_book', async(req, res) => {
    var getPublisher
    try{
        getPublisher = await PublishersTable.findOne({
            where:{
                user_id:req.session.user_data!.id
            } as DB_Publishers
        })
    } catch(err){
        console.log(err)
        res.status(500)
        res.send('server error')
        return
    }
    if(!getPublisher){
        req.session.destroy(() => {
            return null
        })
        res.redirect('/')
        return
    }
    const publisher:DB_Publishers = getPublisher.get()
    const bookTypes = publisher.books_types.split('-')
    var finalArray = []
    for(let j = 0; j < books_types.length; j++){
        for(let i = 0; i < bookTypes.length; i++){
            if(books_types[j].value == bookTypes[i]){
                finalArray.push(books_types[j])
                break;
            }
        }
    }
    res.render('publisher_settings_create_book', {
        books_types:finalArray
    })
})


publisher_settings.post('/create_book', async(req, res) => {
    type reqBody = {
        name_of_the_writer:string
        email_of_the_writer:string
        name_of_the_book:string
        prints_of_the_book:string
        type_of_the_book:string
    };
    if(!req.files || !req.files!.image_of_the_book){
        res.send('missing filds')
        return
    }

    
    const{email_of_the_writer, name_of_the_book, name_of_the_writer, prints_of_the_book, type_of_the_book} =  req.body as reqBody
    if(!email_of_the_writer || !name_of_the_book || !name_of_the_writer || !prints_of_the_book || !type_of_the_book){
        res.send('missing filds')
        return
    }
    if(isNaN(Number(prints_of_the_book))){
        res.send('عدد طبعات الكتاب يجب ان تكون رقماً')
        return
    }
    try{
        var createBook = await BooksTable.create({
            book_image_url:`not_yet`,
            book_name:name_of_the_book,
            book_prints:Number(prints_of_the_book),
            book_type:type_of_the_book,
            user_id:req.session.user_data!.id,
            writer_email:email_of_the_writer,
            writer_name:name_of_the_writer,
        } as DB_Books, {
            logging:false
        })
        createBook  = await createBook.save() 
        const DB_Book:DB_Books = createBook.get()
        const image_of_the_book =  req.files.image_of_the_book as BodyFileType
        const files_path =  path.join(__dirname, '../../public/publisher_files')
        const isImage_of_the_bookCreated = writeFileExpress(image_of_the_book, path.join(files_path, `books/${DB_Book.id}-${req.session.user_data!.id}_book_img.png`))
        if(!isImage_of_the_bookCreated){
            await BooksTable.destroy({
                where:{
                    user_id:req.session.user_data!.id,
                    id:DB_Book.id
                } as DB_Books,
                logging:false
            })
            throw Error("connot create book image")
        }
        await BooksTable.update({
            book_image_url:`/publisher_files/books/${DB_Book.id}-${req.session.user_data!.id}_book_img.png`
        }as DB_Books, {where:{
            user_id:req.session.user_data!.id,
            id:DB_Book.id
        } as DB_Books, logging:false})
    } catch(err){
        console.log(err)
        res.status(500)
        res.send('server error')
        return
    }
    console.log('book created')
    res.redirect('/publisher_settings/create_book')
})

publisher_settings.get('/update_book', async(req, res) => {
    res.render('publisher_settings_control', {
        books_types:books_types
    })
})
publisher_settings.post('/update_book', async(req, res) => {
    type reqBodyType = {
        id_of_the_book:string
        name_of_the_writer:string
        email_of_the_writer:string
        name_of_the_book:string
        type_of_the_book:string
        prints_of_the_book:string
    };
    
    
    
    const {email_of_the_writer,id_of_the_book, name_of_the_book, name_of_the_writer, prints_of_the_book, type_of_the_book} = req.body as reqBodyType
    if(!id_of_the_book || isNaN(Number(id_of_the_book))){
        res.send('missing filds')
        return
    }

    try{
       const isBookFound =  BooksTable.findOne({
            where:{
                id:Number(id_of_the_book),
                user_id:Number(req.session.user_data?.id)
            } as DB_Books
        })
        if(!isBookFound){
            res.send('book not found')
            return
        }
    } catch(err){
        console.log(err) 
        res.status(500)
        res.send("server error")
        return
    }

    if(prints_of_the_book && isNaN(Number(prints_of_the_book))){
        res.send('عدد طبعات الكتاب يجب ان تكون رقماً')
        return
    }
    if(req.files){
        const book_image = req.files.image_of_the_book as BodyFileType
        const files_path =  path.join(__dirname, '../../public/publisher_files')
        const isBook_imageCreated = await writeFileExpress(book_image, path.join(files_path, `books/${id_of_the_book}-${req.session.user_data!.id}_book_img.png`))
        if(!isBook_imageCreated){
            console.log('connot create file book_image => /publisher_settings/update_book (post)') 
            res.status(500)
            res.send("server error")
            return
        }
    }
    try{
        await BooksTable.update({
            book_name:name_of_the_book,
            book_prints:Number(prints_of_the_book),
            book_type:type_of_the_book,
            writer_email:email_of_the_writer,
            writer_name:name_of_the_writer,
            book_image_url:`/publisher_files/books/${id_of_the_book}-${req.session.user_data!.id}_book_img.png`
        } as DB_Books, {
            logging: false,
            where:{
                id:Number(id_of_the_book),
                user_id: req.session.user_data!.id
            } as DB_Books
        })
    } catch(err){
        console.log(err) 
        res.status(500)
        res.send("server error")
        return
    }
    res.redirect('/publisher_settings/update_book')
})

publisher_settings.post('/delete_book', async(req, res) => {
    const book_id = req.body.book_id
    if(!book_id){
        res.send('there is no book')
        return
    }

    if(isNaN(Number(book_id))){
        res.send('invalid data')
        return
    }
    try{
     const isBookDeleted =  await BooksTable.destroy({
            where:{
                id:book_id,
                user_id:req.session.user_data!.id
            } as DB_Books,
            logging:false
        })
        if(isBookDeleted != 0){
            console.log('book deleted')
            res.redirect('/publisher_settings/update_book')
            return
        } else {
            res.send('there is no book to delete')
            return
        }
    } catch(err){
        console.log('connot create file book_image => /publisher_settings/delete_book (post)') 
        res.status(500)
        res.send("server error")
        return
    }
})

export default publisher_settings

function promisify(mv: Function) {
    throw new Error('Function not implemented.')
}
