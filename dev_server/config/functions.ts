import { randomBytes } from 'crypto'
import { config } from 'dotenv'
import { BodyFileType } from './types'
config()

export const serverFilePath = process.env.PRODUCTION == 'true' ? 'web_server' : 'dev_server'
export const isProduction = process.env.PRODUCTION == 'true'  ? true : false

export const port:number = isNaN(Number(process.env.SERVRE_PORT)) ? 8080 : Number(process.env.SERVRE_PORT);
export const  getOneHoure = () =>{
    return 1000 * 60 * 60
}
export const  getOneDay = () =>{
    return 1000 * 60 * 60 * 24
}

export const getRandomString = (len:number) =>{
    return randomBytes(len).toString('hex');
}

export const writeFileExpress = async(fileObj:BodyFileType, path:string):Promise<boolean> =>{
   return await new Promise((r) => {
        fileObj.mv(path, (err:any) => {
            if(err){
                console.log(err)
                r(false)
            } else {
                r(true)
            }
        })
    })
}

export const books_types = [
    {
        value:'lala',
        en_name:"lala_en",
        ar_name:"خواطر"
    },
    {
        value:'lele',
        en_name:"lele_en",
        ar_name:"أشعار"
    },
    {
        value:'bobo',
        en_name:"bobo_en",
        ar_name:"روايات"
    },
    {
        value:'coco',
        en_name:"coco_an",
        ar_name:"فنتازيا"
    },
    {
        value:'dodo',
        en_name:"dodo_en",
        ar_name:"مجموعة مقالات"
    },
    {
        value:'mama',
        en_name:"mama_en",
        ar_name:"تنمية بشرية"
    },
    {
        value:'tete',
        en_name:"tete_en",
        ar_name:"قصص قصيرة"
    },
    {
        value:'ququ',
        en_name:"ququ_en",
        ar_name:"قصص اطفال "
    },
    {
        value:'zam_zam',
        en_name:"zam zam",
        ar_name:"فلسفة"
    },
    {
        value:'l7l7',
        en_name:"l7l7_en",
        ar_name:"دينية"
    },
]
export const books_langs = [
    {
        value:'ar',
        en_name:"arabic",
        ar_name:"عربي"
    },
    {
        value:'en',
        en_name:"english",
        ar_name:"إنقليزي"
    },
    {
        value:'fr',
        en_name:"france",
        ar_name:"فرنسي"
    },
    {
        value:'som',
        en_name:"somalia",
        ar_name:"صومالي"
    },
    {
        value:'tn',
        en_name:"tonice",
        ar_name:"تونسي"
    },
    {
        value:'bng',
        en_name:"bngladish",
        ar_name:"بنقلاديش"
    },
    {
        value:'ind',
        en_name:"india",
        ar_name:"هندي"
    },
    {
        value:'ph',
        en_name:"phalapin",
        ar_name:"فلبين"
    },
    {
        value:'eg',
        en_name:"egipt",
        ar_name:"مصر"
    },
    {
        value:'mlz',
        en_name:"malizia",
        ar_name:"ماليزيا"
    },
    {
        value:'sw',
        en_name:"swiden",
        ar_name:"السويد"
    },
]


    