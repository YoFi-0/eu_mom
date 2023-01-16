import Sequelize from 'sequelize'
import {config} from 'dotenv'
config()
const DB_HOST:string = process.env.DB_HOST!
const DB_PASSWORD:string = process.env.DB_PASSWORD || ''
const DB_DIALECT:Sequelize.Dialect = process.env.DB_DIALECT! as Sequelize.Dialect
const DB_POOL:boolean = process.env.DB_POOL == 'true' ? true : false
const DB_USER:string = process.env.DB_USER!
const DB_PORT:number = isNaN(Number(process.env.DB_PORT)) ? 3306 : Number(process.env.DB_PORT)
const DB_DATABASE_NAME:string = process.env.DB_NAME!


export const Connection:Sequelize.Sequelize = new Sequelize.Sequelize(
    DB_DATABASE_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host: DB_HOST,
        dialect: DB_DIALECT,
        port: DB_PORT,
        pool: DB_POOL ? {
            max: 5,
            min: 5,
            acquire: 30000,
            idle: 10000
        } : undefined
    }
)