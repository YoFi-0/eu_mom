const allBooks = document.querySelectorAll('.all_books .book')
const booksContainer = document.querySelector('.all_books') as HTMLDivElement
const update_form = document.querySelector('#update_form') as HTMLFormElement
const back_to_books = document.querySelector('#back_to_books') as HTMLButtonElement
const form_book_id = document.querySelector('#book_id') as HTMLInputElement
const form_writer_name = document.querySelector('#writer_name') as HTMLInputElement
const form_writer_email = document.querySelector('#writer_email') as HTMLInputElement
const form_book_name = document.querySelector('#book_name') as HTMLInputElement
const form_book_type = document.querySelector('#book_type') as HTMLSelectElement
const form_book_prints = document.querySelector('#book_prints') as HTMLInputElement
const form_image_tester = document.querySelector('#image_tester') as HTMLImageElement
const form_img_book = document.querySelector('#img_book') as HTMLInputElement
const delete_book = document.querySelector('#delete_book') as HTMLButtonElement
const deleteBookDiv = document.querySelector('.delete_book') as HTMLDivElement
const book_input_delete = document.querySelector('#book_input_delete') as HTMLInputElement
const gals = document.querySelector('.glass') as HTMLDivElement


const sleepUpdate = async(dlay:number) => {
    await new Promise(r => setTimeout(r, dlay))
}


delete_book.onclick = async() =>{
    gals.style.display = 'block'
    deleteBookDiv.style.display = 'block'
    book_input_delete.value = form_book_id.value
    await sleepUpdate(500)
    gals.style.opacity = '1'
    deleteBookDiv.style.scale = '1'
}

gals.onclick = async() =>{
    gals.style.opacity = '0'
    deleteBookDiv.style.scale = '0'
    await sleepUpdate(500)
    book_input_delete.value = ''
    gals.style.display = 'none'
    deleteBookDiv.style.display = 'none'
    
}

const books_types:{
    diplayer:string
    value:string
}[] = []
Array.from(form_book_type.children).forEach(option => {
    books_types.push({
        diplayer:option.textContent!,
        value:(option as HTMLOptionElement).value
    })
    option.remove()
})
const makeBooksClickble = () => {
    const allBooks = document.querySelectorAll('.all_books .book')
    allBooks.forEach(bookElm => {
        const book = bookElm as HTMLDivElement
        const {book_id, book_type, prints, writer_email, writer_name} = book.dataset as  {
            book_id:string
            writer_name:string
            writer_email:string
            prints:string
            book_type:string
        }
        const bookName = book.querySelector('p')!.textContent!
        const bookImage = (book.querySelector('img') as HTMLImageElement).src
        book.onclick = () =>{
            const finalOption = {
                diplayer:'',
                value:''
            }
            booksContainer.style.display = 'none'
            update_form.style.display = 'block'
            form_book_id.value = book_id
            form_writer_name.value =writer_name
            form_writer_email.value = writer_email
            form_book_name.value = bookName
            form_book_prints.value = prints
            form_image_tester.parentElement!.style.background = "#1c2869"
            form_image_tester.style.display = "block"
            form_image_tester.src = bookImage
            books_types.forEach(type => {
                const option = document.createElement('option')
                if(book.dataset.book_type == type.value){
                    finalOption.diplayer = type.diplayer,
                    finalOption.value = type.value
                    return
                }
                option.textContent = type.diplayer
                option.value = type.value
                form_book_type.appendChild(option)
            })
            const finaloption = document.createElement('option')
            finaloption.textContent = finalOption.diplayer
            finaloption.value = finalOption.value
            form_book_type.prepend(finaloption)
            form_book_type.value = finalOption.value
            //select add
    
            //select add
        }
    })
}

const host = 'http://127.0.0.1:8000'
const socket = io(host)
socket.emit('get_my_books')
socket.on("send_my_books", (data) => {
    data.data.forEach(record => {
        const book =  document.createElement('div')
        const bookImag = document.createElement('img')
        const bookName = document.createElement('p')
        book.classList.add('book')
        book.dataset.writer_name = record.writer_name
        book.dataset.book_id = record.id
        book.dataset.writer_email = record.writer_email
        book.dataset.prints = record.book_prints
        book.dataset.book_type = record.book_type
        bookImag.src = `${host}${record.book_image_url}`
        bookImag.alt = record.book_name
        bookName.textContent = record.book_name
        book.appendChild(bookImag)
        book.appendChild(bookName)
        booksContainer.appendChild(book)
    })
    makeBooksClickble()
})


back_to_books.onclick = () =>{
    Array.from(form_book_type.children).forEach(option => {
        option.remove()
    })
    form_book_id.value = ''
    form_writer_name.value = ''
    form_writer_email.value = ''
    form_book_name.value = ''
    form_book_prints.value = ''
    form_image_tester.src = ''
    //select rest

    //select rest

    booksContainer.style.display = 'flex'
    update_form.style.display = 'none'
}

