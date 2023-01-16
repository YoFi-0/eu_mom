declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SERVRE_PORT:string
            SESTION_SECRIT:string
            PRODUCTION:string
            DB_HOST:string
            DB_PORT:string
            DB_USER:string
            DB_PASSWORD:string
            DB_NAME:string
            DB_POOL:string
            DB_DIALECT:string
            GOOGLE_AUTH_CLIENT_ID:string
            GOOGLE_AUTH_CLIENT_SECRET:string
            PROTOCOL:string
            DOMAIN:string
        }
    }
}

export {};