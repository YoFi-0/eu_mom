"use strict";
const server_stars = document.querySelector('.server_stars');
const allbooks = document.querySelectorAll('.books .book');
const back_to_user = document.querySelector('.back_to_user');
const sleepShowr = async (dlay) => {
    await new Promise(r => setTimeout(r, dlay));
};
const books_types_2 = [];
const form_book_type_2 = document.querySelector('#form_book_type_2');
Array.from(form_book_type_2.children).forEach(option => {
    books_types_2.push({
        diplayer: option.textContent,
        value: option.dataset.value
    });
    option.remove();
});
var isCanShow = true;
const show_Book = async (book) => {
    if (!isCanShow) {
        return;
    }
    isCanShow = false;
    const { book_name, book_type, prints, writer_email, writer_name } = book.dataset;
    const bookImage = book.querySelector('img').src;
    const book_type_viewer = document.querySelector('#book_type');
    console.log(book_type);
    books_types_2.forEach(elm => {
        console.log(elm.value);
        if (elm.value == book_type) {
            book_type_viewer.textContent = elm.diplayer;
        }
    });
    const book_writer_viewer = document.querySelector('#book_writer');
    book_writer_viewer.textContent = writer_name;
    const witer_email_viewer = document.querySelector('#witer_email');
    witer_email_viewer.textContent = writer_email;
    const Book_name = document.querySelector('#Book_name');
    Book_name.textContent = book_name;
    const book_prints_viewer = document.querySelector('#book_prints');
    book_prints_viewer.textContent = `( ${prints} )`;
    const book_image_viewer = document.querySelector('#book_image');
    book_image_viewer.src = bookImage;
    const zero = async () => {
        const profaile = document.querySelector('.book_show .profaile');
        profaile.style.translate = '200% 0';
        const book_type = document.querySelector('.book_show .type');
        book_type.style.translate = '200% 0';
        const rest_info = document.querySelector('.book_show .rest_info');
        rest_info.style.translate = '200% 0';
        const book_tester = document.querySelector('.book_show .book');
        book_tester.style.opacity = '0';
        const backShaddow = document.querySelector('.book_show .backcollor');
        backShaddow.style.opacity = '0';
    };
    const first = async () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        await sleepShowr(100);
        document.body.style.padding = '0';
        const header = document.querySelector('#header');
        header.style.translate = "0 -200%";
        const card = document.querySelector('#user_card');
        card.style.opacity = '0';
        const booksDiv = document.querySelector('.books');
        booksDiv.style.translate = '0 500%';
        booksDiv.style.opacity = '0';
        await sleepShowr(500);
        booksDiv.style.display = 'none';
        card.style.display = 'none';
        header.style.display = 'none';
        const book_show = document.querySelector('.book_show');
        book_show.style.display = 'flex';
    };
    const tow = async () => {
        const groop = async () => {
            await sleepShowr(500);
            const profaile = document.querySelector('.book_show .profaile');
            profaile.style.removeProperty('translate');
            await sleepShowr(500);
            const book_type = document.querySelector('.book_show .type');
            book_type.style.removeProperty('translate');
            await sleepShowr(500);
            const rest_info = document.querySelector('.book_show .rest_info');
            rest_info.style.removeProperty('translate');
        };
        await sleepShowr(500);
        groop();
        const backShaddow = document.querySelector('.book_show .backcollor');
        backShaddow.style.removeProperty('opacity');
        await sleepShowr(500);
        const book_tester = document.querySelector('.book_show .book');
        book_tester.style.removeProperty('opacity');
    };
    await zero();
    await first();
    await tow();
    await sleepShowr(2000);
    isCanShow = true;
};
const hideBook = async () => {
    if (!isCanShow) {
        return;
    }
    isCanShow = false;
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
    const zero = async () => {
        const groop = async () => {
            await sleepShowr(500);
            const profaile = document.querySelector('.book_show .profaile');
            profaile.style.translate = '200% 0';
            await sleepShowr(500);
            const book_type = document.querySelector('.book_show .type');
            book_type.style.translate = '200% 0';
            await sleepShowr(500);
            const rest_info = document.querySelector('.book_show .rest_info');
            rest_info.style.translate = '200% 0';
        };
        groop();
        const book_tester = document.querySelector('.book_show .book');
        book_tester.style.opacity = '0';
        await sleepShowr(500);
        const backShaddow = document.querySelector('.book_show .backcollor');
        backShaddow.style.opacity = '0';
    };
    const first = async () => {
        const booksDiv = document.querySelector('.books');
        const card = document.querySelector('#user_card');
        const header = document.querySelector('#header');
        await sleepShowr(100);
        booksDiv.style.removeProperty('display');
        card.style.removeProperty('display');
        header.style.removeProperty('display');
        await sleepShowr(500);
        document.body.style.removeProperty('padding');
        header.style.removeProperty('translate');
        card.style.removeProperty('opacity');
        booksDiv.style.removeProperty('translate');
        booksDiv.style.removeProperty('opacity');
        const book_show = document.querySelector('.book_show');
        book_show.style.display = 'none';
    };
    const tow = async () => {
        const groop = async () => {
            await sleepShowr(500);
            const profaile = document.querySelector('.book_show .profaile');
            profaile.style.removeProperty('translate');
            await sleepShowr(500);
            const book_type = document.querySelector('.book_show .type');
            book_type.style.removeProperty('translate');
            await sleepShowr(500);
            const rest_info = document.querySelector('.book_show .rest_info');
            rest_info.style.removeProperty('translate');
        };
        await sleepShowr(500);
        groop();
        const backShaddow = document.querySelector('.book_show .backcollor');
        backShaddow.style.removeProperty('opacity');
        await sleepShowr(500);
        const book_tester = document.querySelector('.book_show .book');
        book_tester.style.removeProperty('opacity');
    };
    await zero();
    await first();
    await tow();
    await sleepShowr(2000);
    isCanShow = true;
};
allbooks.forEach(elm => {
    const book = elm;
    console.log(book);
    book.onclick = () => {
        show_Book(book);
    };
});
back_to_user.onclick = () => {
    hideBook();
};
const user_id = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
const host = 'http://127.0.0.1:8000';
const socket = io(host);
const getSocket = () => {
    socket.emit('get_my_books', {
        user_id: user_id
    });
    socket.on("send_my_books", (data) => {
        const booksDiv = document.querySelector('.books');
        data.data.forEach(record => {
            const book = document.createElement('div');
            const book_image = document.createElement('img');
            book.classList.add('book');
            book_image.src = record.book_image_url;
            book.appendChild(book_image);
            book.dataset.book_name = record.book_name;
            book.dataset.prints = record.book_prints;
            book.dataset.book_type = record.book_type;
            book.dataset.writer_email = record.writer_email;
            book.dataset.writer_name = record.writer_name;
            booksDiv.appendChild(book);
            book.onclick = () => {
                show_Book(book);
            };
        });
    });
};
getSocket();
var lastStar = 5;
var isStrChanged = false;
Array.from(server_stars.children).forEach((elm, i) => {
    const star = elm;
    if (star.src.endsWith('/images/starts/star_e.svg')) {
        if (!isStrChanged) {
            console.log('yay');
            lastStar = i;
            isStrChanged = true;
        }
    }
    star.onmouseover = () => {
        var isHoverd = true;
        Array.from(server_stars.children).forEach((elm, j) => {
            const jStar = elm;
            if (i == j - 1) {
                isHoverd = false;
            }
            if (isHoverd) {
                jStar.src = '/images/starts/star_f.svg';
            }
            else {
                jStar.src = '/images/starts/star_e.svg';
            }
        });
    };
    star.onmouseleave = () => {
        var isPasst = false;
        Array.from(server_stars.children).forEach((elm, j) => {
            const jStar = elm;
            if (j == lastStar) {
                isPasst = true;
            }
            if (isPasst) {
                jStar.src = '/images/starts/star_e.svg';
                return;
            }
            jStar.src = '/images/starts/star_f.svg';
        });
    };
    star.onclick = () => {
        lastStar = i + 1;
        const rate = i + 1;
        socket.emit('get_create_rate', {
            pu_id: Number(user_id),
            rate: rate
        });
    };
});
socket.on("send_create_rate", (data) => {
    console.log(data);
});
