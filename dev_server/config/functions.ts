import { randomBytes } from 'crypto'
import { config } from 'dotenv'
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

export const books_types = [
    {
        value:'lala',
        en_name:"lala_en",
        ar_name:"مشمش"
    },
    {
        value:'lele',
        en_name:"lele_en",
        ar_name:"لي لي"
    },
    {
        value:'bobo',
        en_name:"bobo_en",
        ar_name:"بوبو"
    },
    {
        value:'coco',
        en_name:"coco_an",
        ar_name:"كو كو"
    },
    {
        value:'dodo',
        en_name:"dodo_en",
        ar_name:"دو دو"
    },
    {
        value:'mama',
        en_name:"mama_en",
        ar_name:"ماما"
    },
    {
        value:'tete',
        en_name:"tete_en",
        ar_name:"تيتي"
    },
    {
        value:'ququ',
        en_name:"ququ_en",
        ar_name:"كيو كيو"
    },
    {
        value:'zam_zam',
        en_name:"zam zam",
        ar_name:"زام زيم"
    },
    {
        value:'l7l7',
        en_name:"l7l7_en",
        ar_name:"لحلح"
    },
]
export const books_langs = [
    {
        value:'ar',
        en_name:"arabic",
        ar_name:"مشمش"
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


    