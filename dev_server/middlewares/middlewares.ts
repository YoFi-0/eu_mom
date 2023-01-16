import type {Request, Response, NextFunction} from 'express'

export const isLogin  = (req:Request, res:Response, next:NextFunction) =>{
    if(req.session.isLogin){
        next()
    } else {
        res.status(500)
    }
}
export const isPublisher  = (req:Request, res:Response, next:NextFunction) =>{
    if(req.session.user_data && req.session.user_data.type == 'publisher'){
        next()
    } else {
        res.status(500)
    }
}

export const heroSesstion  = (req:Request, res:Response, next:NextFunction) =>{
    if(req.session.hero){
        next()
    } else {
        res.status(500)
    }
}

export const apiMiddlewares = (req:Request, res:Response, next:NextFunction) =>{ 
    next()
}

export const isInMidOfReg = (req:Request, res:Response, next:NextFunction) => {
    if(req.session.hero && req.session.reg_user_data){
        next()
        return
    }
    return res.redirect('/')
}