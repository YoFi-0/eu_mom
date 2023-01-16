import { Router } from 'express'
import {apiMiddlewares} from '../../middlewares/middlewares'
const api = Router()

api.use(apiMiddlewares)

api.get('/', (req, res) => {
    res.json({
        res: true,
        data: [
            'api route avalible'
        ]
    })
})


export default api