const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show')
        }
    })
});

const hiddenElemnet = document.querySelectorAll('.hidden');

hiddenElemnet.forEach((el) => observer.observe(el));






const show_header = document.querySelector('#show_header');
const header = document.querySelector('#header');
const hied_header = document.querySelector('#hied_header');
show_header.onclick = () => {
    header.style.width = '100%';
    header.style.padding = '0 max(2vw, 2em)';
    header.style.paddingTop = 'max(0.5vw, 0.5em)';
    document.body.style.overflow = 'hidden'
};
hied_header.onclick = () => {
    header.style.removeProperty('width');
    header.style.removeProperty('padding');
    header.style.removeProperty('paddingTop');
    document.body.style.removeProperty('overflow');
};







let link = document.querySelector('.link');
let saerhDisblie = document.querySelector('.saerh-disblie');
const searchBar = document.querySelector('#search')
const searchs = document.querySelector('#searchs')

const host = 'http://127.0.0.1:8000'
const socket = io(host)


var isClicked = false
var breValu = ''
var lastNum = 0
// window.onclick = () => {
//     isClicked = false
//     saerhDisblie.style.display = "none";
// }
const getMore = () => {
    if(breValu != searchBar.value){
        lastNum = 0
    } else {
        lastNum += 10
    }
    breValu = searchBar.value
    socket.emit('get_pub', {
        from:lastNum,
        value:searchBar.value,
    })
}
link.onclick = () => {
   
    if (!isClicked) {
        console.log(isClicked)        
        isClicked = true
        saerhDisblie.style = "opacity: 1;transition: all 0.6s ease 0s;display: block;"
        Array.from(searchs.children).forEach(elm => {
            elm.remove()
        });
        getMore()
    } else {
        isClicked = false
        saerhDisblie.style.display = "none";
    }
};
socket.on('send_pub', (data) => {
    if(!data.data){
        const recordDiv = document.createElement('div')
        recordDiv.classList.add('card')
        const holderDiv = document.createElement('div')
        holderDiv.classList.add('taitel')
        const user_name = document.createElement('h1')


        user_name.textContent = 'لا يوجد نتائج'
        holderDiv.appendChild(user_name)
    
        recordDiv.appendChild(holderDiv)
        searchs?.appendChild(recordDiv)
        return
    }
    data.data.forEach(record => {
        const recordDiv = document.createElement('div')
        recordDiv.classList.add('card')
        const user_image = document.createElement('img')
        const holderDiv = document.createElement('div')
        holderDiv.classList.add('taitel')
        const user_name = document.createElement('h1')
        const urlll = document.createElement('a')

        user_image.src = record.image_url || '/src/img/Frame 7 1.svg'
        urlll.textContent = record.name
        urlll.href = `/stars/${record.id}`
        
        user_name.appendChild(urlll)
        holderDiv.appendChild(user_name)
    
        recordDiv.appendChild(user_image)
        recordDiv.appendChild(holderDiv)
        searchs?.appendChild(recordDiv)
    });
    if(data.data.length == 10){
        const recordDiv = document.createElement('div')
        recordDiv.classList.add('card')
        const holderDiv = document.createElement('div')
        holderDiv.classList.add('taitel')
        const user_name = document.createElement('h1')

        user_name.textContent = 'المزيد'
        holderDiv.appendChild(user_name)
    
        recordDiv.onclick = () =>{
            getMore()
            recordDiv.remove()
        }
        recordDiv.appendChild(holderDiv)
        searchs?.appendChild(recordDiv)
    } else {
        const recordDiv = document.createElement('div')
        recordDiv.classList.add('card')
        const holderDiv = document.createElement('div')
        holderDiv.classList.add('taitel')
        const user_name = document.createElement('h1')

        user_name.textContent = 'إنتهت انتائج'
        holderDiv.appendChild(user_name)
    
        recordDiv.appendChild(holderDiv)
        searchs?.appendChild(recordDiv)
    }
})

