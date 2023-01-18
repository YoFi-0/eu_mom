import { Router } from 'express'
import UsersTable from '../../database/models/users'
import { DB_Users } from '../../config/types'
import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
const deletFile = promisify(fs.unlink)
const reddire = promisify(fs.readdir)
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