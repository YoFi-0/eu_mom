import { Router } from 'express'
import UsersTable from '../../database/models/users'
import { DB_Publishers, DB_Stars, DB_Users } from '../../config/types'
import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
import StarsTable from '../../database/models/stars'
import PublishersTable from '../../database/models/publishers'
import { Op } from 'sequelize'
const deletFile = promisify(fs.unlink)
const reddire = promisify(fs.readdir)
const index = Router()

index.get('/', async(req, res) => {

    var allstars 
    try{
        allstars = await StarsTable.findAll({
            logging:false,
            order:[
                ['stars', 'ASC']
            ]
        })
    } catch(err){
        console.log(err)
        res.status(500)
        return res.send('server error')
    }

    const finalArray:{
        name:string,
        stars:string,
        id:number
        books:string[],
        user_image:string,
        user_id:number
    }[] = []
    const stars_ides:number[] = []
    if(allstars.length != 0){
        for(let record of allstars){
           const star:DB_Stars = record.get()
            if(stars_ides.length == 5){
                break;
            }
            if(!stars_ides.includes(star.publisher_id)){
                stars_ides.push(star.publisher_id)
                const getAllPubRecurds = allstars.filter(value => {
                    const fStar:DB_Stars = value.get()
                    if(fStar.publisher_id == star.publisher_id){
                        return true
                    }
                })

                const midStar:DB_Stars = getAllPubRecurds[Math.trunc(getAllPubRecurds.length / 2)].get()
                finalArray.push({
                    name:'',
                    id:star.publisher_id,
                    stars:`/images/starts/${midStar.stars}_.svg`,
                    books:[],
                    user_image:'',
                    user_id:NaN
                })
            }
        }
    }

    var highePups
    try{
        highePups =  await PublishersTable.findAll({
            where:{
                [Op.or]:stars_ides.map(value => {
                    return {id:value}
                })
            },
            logging:false
        })
    } catch(err){
        console.log(err)
        res.status(500)
        return res.send('server error')
    }
    if(highePups.length == 0 && allstars.length != 0 ){
        console.log('algo is wrong')
        res.status(500)
        return res.send('server error')
    }

    const files_path =  path.join(__dirname, '../../public/publisher_files/books')
    const allBoosImages = await reddire(files_path)
    for(let record of highePups){
        const pub:DB_Publishers = record.get()
        for(let pubStar of finalArray){
            if(pubStar.id == pub.id){
                pubStar.name = pub.name
                pubStar.user_image = pub.image_url
                pubStar.user_id = pub.user_id
                var i = 1
                for(let book of allBoosImages){
                    if(i == 5){
                        break;
                    }
                    if(book.includes(`${pub.user_id}_book_img.png`)){
                        i++
                        pubStar.books.push(`/publisher_files/books/${book}`)
                    }
                }
            }
        }
    }
    var getUserId
    

   

    if(req.session.isLogin && req.session.user_data){
        return res.render('index2', {
            isLogin:true,
            username:req.session.user_data.name,
            email:req.session.user_data.email,
            picture:req.session.user_data.picture,
            user_type:req.session.user_data.type,
            finalArray:finalArray,
            user_profile: `/stars/${req.session.pub_id}`,
        })
    }
    return res.render('index2', {
        finalArray:finalArray,
        isLogin:false
    })
})

index.post('/log_out', (req, res) => {
    req.session.destroy(() => {
        return null
    })
   return res.redirect('/')
})

index.post('/delete_acount', async(req, res) => {
    if(!req.session.user_data || !req.session.user_data?.id){
        res.send('user not found')
        return
    }
    try{
        const user_data_path = path.join(__dirname, '../../public/publisher_files')
        const allData =  await reddire(user_data_path)
        for(let file of allData) {
            if(file == (`${req.session.user_data!.id}_license.pdf`) || file == (`${req.session.user_data!.id}_img.png`)){
                await deletFile(path.join(user_data_path, file))
                console.log(file)
            } else if(file == 'books'){
                const booksFileBath = path.join(user_data_path, file)
                const allBooks = await reddire(booksFileBath)
                for(let book of allBooks){
                    const user_book_images = book.split('-')[1]
                    if(user_book_images == '3_book_img.png'){
                        console.log(book)
                        await deletFile(path.join(booksFileBath, book))
                    }
                }
            }
        }
    } catch(err){
        console.log(err)
        res.send('server_err')
        return
    }

    try{
      const is_user_deleted =  await UsersTable.destroy({
            where:{
                id:req.session.user_data.id
            } as DB_Users,
            logging:false
        })
        if(is_user_deleted != 0){
            req.session.destroy(() => {
                return null
            })
            res.redirect('/')
            return
        }
        res.send('user not found')
        return
    } catch(err){
        console.log(err)
        res.status(500)
        res.send('server error')
        return
    }
    
})
export default index