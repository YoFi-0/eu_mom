import { Router } from 'express'
import PublishersTable from '../../database/models/publishers'
import { DB_Publishers, DB_Stars } from '../../config/types'
import StarsTable from '../../database/models/stars'
import {books_types, books_langs} from '../../config/functions'
const users = Router()


users.get('/:pub_id', async(req, res) => {
    const pub_id = Number(req.params.pub_id)
    if(isNaN(pub_id)){
        res.status(404)
        return res.send('user not found')
    }
    var get_user
    var getStars
    try{
        get_user = await PublishersTable.findOne({
            where: {
                id:pub_id
            } as DB_Publishers,
            logging:false
        })
    } catch(err){
        console.log(err)
        res.status(500)
        return res.send('server error')
    }
    if(!get_user){
        res.status(404)
        return res.send('user not found')
    }
    const finaleUser:DB_Publishers = get_user.get()
    try{
        getStars = await StarsTable.findAll({
            where:{
                publisher_id:finaleUser.id,
            } as DB_Stars,
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
    var fainalStar:DB_Stars = getStars.length != 0 ? getStars[Math.trunc(getStars.length / 2)].get() : 0
    var your_stars = null
    if(req.session.user_data && req.session.user_data.id){
        for(let record of getStars){
            const star:DB_Stars = record.get()
            if(star.user_id == req.session.user_data?.id){
                your_stars = star.stars
                break;
            }
        }
    }
    const arrayNum5 = [1, 2, 3, 4, 5, 6]
    res.render('show_publidher', {
        pub_data:finaleUser,
        fainalStar:fainalStar.stars,
        image_path_style: fainalStar.stars ? `/images/starts/${fainalStar.stars}_.svg` : `/images/starts/0_.svg`,
        books_types:books_types,
        books_langs:books_langs,
        arrayNum5:arrayNum5,
        licensFile:`/publisher_files/${finaleUser.user_id}_license.pdf`,
        your_stars: your_stars ? your_stars : 0,
        pub_social: finaleUser.social ? JSON.parse(finaleUser.social) : null
    })
})


export default users