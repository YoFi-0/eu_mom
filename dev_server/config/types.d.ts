export type GoogleUser = {
    picture:string
    id:string
    displayName:string
    email:string
}?

export type DB_Users = {
    id:number
    email:string
    google_id:string ,
    type: "publisher" | "user"  
}

export type BodyFileType = {
    name:string
    mimetype:string,
    mv:Function,
    size:number,
    tempFilePath:string
    data:Buffer
    truncated:boolean
    encoding:string
    md5:string
}

export type DB_Publishers = {
    id:number
    user_id:number
    name:string
    license_type: "internationally" | "locally"
    location:string
    books_langs:string
    social:string | null
    books_types:string
    image_url:string
}

export type SocialObj_from_DB_Publishers = {
    facebook:string,
    twitter:string,
    instagram:string
    phone:string
}

export type DB_Books = {
    id:number
    user_id:number
    writer_name:string
    writer_email:string
    book_name:string
    book_type:string
    book_prints:number
    book_image_url:string
}


export type UserSesstinData = {
    id:number
    email:string
    google_id:string,
    name:string,
    picture:string,
    type: "publisher" |  "user" 
}
export type RegUserSesstinData = {
    email:string
    google_id:string,
    name:string,
    picture:string, 
}
