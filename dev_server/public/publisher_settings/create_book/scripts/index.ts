const image_tester = document.querySelector('#image_tester') as HTMLImageElement
const img_book = document.querySelector('#img_book') as HTMLInputElement
const sleep_nono = async(dlay:number) => {
    await new Promise(r => setTimeout(r, dlay))
}


img_book.onchange = async() => {
    image_tester.style.opacity = '0'
    await sleep_nono(500)
    image_tester.style.display = 'none'
    await sleep_nono(300)
    
    const file = img_book.files
    image_tester.style.removeProperty('display')
    await sleep_nono(200)
    image_tester.style.opacity = '1'
    image_tester.parentElement!.style.border = 'none'
    image_tester.parentElement!.style.background = '#1c2869'
    if (file && file[0]) {
        image_tester.src = URL.createObjectURL(file[0])
    }
}