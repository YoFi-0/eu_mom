const uplodedFile = document.querySelector('#license_pdf') as HTMLInputElement
const alertP = document.querySelector('#alert') as HTMLParagraphElement
const alertDiv = document.querySelector('.alert') as HTMLDivElement
const alertOkButton = alertDiv!.querySelector('button') as HTMLButtonElement
const galss = document.querySelector('.glass') as HTMLDivElement
const socialButton = document.querySelector('#social') as HTMLButtonElement
const social_forms = document.querySelector('.social_forms') as HTMLDivElement
const cancelSocial = document.querySelector('#cancelSocial') as HTMLButtonElement
const addSocial = document.querySelector('#addSocial') as HTMLButtonElement
const allSocialsTextEera = document.querySelector('#allSocialsTextEera') as HTMLTextAreaElement
const done = document.querySelector('#done') as HTMLButtonElement
const test_image = document.querySelector('#test_image') as HTMLImageElement
const img_input = document.querySelector('#image') as HTMLInputElement
const delete_user_form = document.querySelector('.delete_user') as HTMLDivElement
const delete_acount_boutton = document.querySelector('#delete_acount') as HTMLButtonElement

img_input.onchange = async() => {
    test_image.style.opacity = '0'
    await sleep(500)
    test_image.style.removeProperty('opacity')
    test_image.style.display = 'none'
    await sleep(300)
    const file = img_input.files
    test_image.style.removeProperty('display')
    test_image.parentElement!.style.border = 'none'
    test_image.parentElement!.style.background = '#1c2869'
    if (file && file[0]) {
        test_image.src = URL.createObjectURL(file[0])
    }
}


const sleep = async(dlay:number) => {
    await new Promise(r => setTimeout(r, dlay))
}

type SocialUrlsType = {
    facebook:string
    twitter:string
    instagram:string
    phone:string
}
type socialURLSPropTypes = "facebook" | "twitter" | "instagram" | "phone"
const socialURLS:SocialUrlsType = {
    facebook:"",
    twitter:"",
    instagram:"",
    phone:"",
}

const hideAlret = async() => {
    galss.style.opacity = '0'
    alertDiv.style.scale = '0'
    social_forms.style.scale = '0'
    delete_user_form.style.scale = '0'
    await sleep(500)
    alertDiv.style.display = 'none'
    alertP.textContent = ''
    galss.style.display = 'none'
    social_forms.style.display = 'none'
    delete_user_form.style.display = 'none'
}

delete_acount_boutton.onclick = async() =>{
    galss.style.display = 'block'
    delete_user_form.style.display = 'block'
    await sleep(500)
    delete_user_form.style.scale = '1'
    galss.style.opacity = '1'
}

const showAlert = async(msg:string) => {
    alertDiv.style.display = 'block'
    alertP.textContent = msg
    galss.style.display = 'block'
    await sleep(500)
    galss.style.opacity = '1'
    alertDiv.style.scale = '1'
}



socialButton.onclick = async() => {
    galss.style.display = 'block'
    social_forms.style.display = 'block'
    await sleep(500)
    galss.style.opacity = '1'
    social_forms.style.scale = '1'
}
galss.onclick = async() => {
    hideAlret()
}

alertOkButton.onclick = async() =>{
    hideAlret()
}
cancelSocial.onclick = () =>{
    hideAlret()
}
social_forms.querySelectorAll('.urlSocial').forEach(elm => {
    const input = elm.querySelector('input') as HTMLInputElement
    console.log(input)
    if(input!.dataset.type){
        socialURLS[input!.dataset.type as socialURLSPropTypes] = input.value
        input.onchange = () =>{
            socialURLS[input!.dataset.type as socialURLSPropTypes] = input.value
            console.log(input.value)
            allSocialsTextEera.value = JSON.stringify(socialURLS)
            console.log(JSON.parse(allSocialsTextEera.value))
        }
    }
})
addSocial.onclick = () => {
    hideAlret()
    console.log(allSocialsTextEera.value)
}



/*

<div class="attrr">
    <p>strgdqwd</p>
    <i class="fa-solid fa-x"></i>
</div>

*/

const allOpstins:HTMLDivElement[] = []
document.querySelectorAll('.my_select').forEach(elm => {
   const options =  elm.querySelector('.options') as HTMLDivElement
   const searchInput = elm.querySelector('input[type=text]') as HTMLInputElement
   const finalInput = elm.querySelector('input[type=hidden]') as HTMLInputElement
   finalInput.value = ''
   const database_values = finalInput.dataset.pre_value
   const database_values_arr = database_values?.split('-')
   const attrsDiv =elm.querySelector('.attrrs')
   const codeElm = elm.querySelector('code') as HTMLElement
   var allData:string[] = []
   allOpstins.push(options)
   Array.from(options.children).forEach(elm => {
        const element = elm as HTMLParagraphElement
        console.log(database_values_arr)
        if(database_values_arr){
            for(let value of database_values_arr){
                if(element.dataset.value! == value){
                    searchInput.value = ""
                    const attrDiv =  document.createElement('div')
                    attrDiv.classList.add('attrr')
                    const attrName = document.createElement('p')
                    attrName.textContent = element.textContent
                    attrName.dataset.value = element.dataset.value!
                    allData.push(element.dataset.value!)
                    const x_icon = document.createElement('i')
                    x_icon.classList.add('fa-solid')
                    x_icon.classList.add('fa-x')
                    attrDiv.appendChild(attrName)
                    attrDiv.appendChild(x_icon)
                    attrsDiv?.appendChild(attrDiv)
                    finalInput.value = allData.join('-')
                    codeElm.style.display = 'none'
                }
            }
        }
        Array.from(attrsDiv!.children).forEach(elm => {
            elm.querySelector('i')!.onclick = () => {
                allData = allData.filter(word => word != elm.querySelector('p')!.dataset.value)
                finalInput.value = allData.join('-')
                elm.remove()
                if(attrsDiv!.children.length == 0){
                    codeElm.style.display = 'block'
                } else {
                    codeElm.style.display = 'none'
                }
            }
        })
        element.onclick = () => {
            var canAdd = true
            Array.from(attrsDiv!.children).forEach(elm => {
                if(elm.querySelector('p')?.textContent == element.textContent){
                    canAdd = false
                }
            })
            if(!canAdd){
                return
            }
            searchInput.value = ""
            const attrDiv =  document.createElement('div')
            attrDiv.classList.add('attrr')
            const attrName = document.createElement('p')
            attrName.textContent = element.textContent
            attrName.dataset.value = element.dataset.value!
            allData.push(element.dataset.value!)
            const x_icon = document.createElement('i')
            x_icon.classList.add('fa-solid')
            x_icon.classList.add('fa-x')
            attrDiv.appendChild(attrName)
            attrDiv.appendChild(x_icon)
            attrsDiv?.appendChild(attrDiv)
            Array.from(attrsDiv!.children).forEach(elm => {
                elm.querySelector('i')!.onclick = () => {
                    allData = allData.filter(word => word != elm.querySelector('p')!.dataset.value)
                    finalInput.value = allData.join('-')
                    elm.remove()
                    if(attrsDiv!.children.length == 0){
                        codeElm.style.display = 'block'
                    } else {
                        codeElm.style.display = 'none'
                    }
                }
            })
            finalInput.value = allData.join('-')
            codeElm.style.display = 'none'
        }
   })
   searchInput.onkeyup = () => {
    Array.from(options.children).forEach(elm => {
        const element = elm as HTMLParagraphElement
        element.style.display = 'block'
        if(!element.textContent?.includes(searchInput.value)){
            element.style.display = 'none'
        }
   })
   }
   searchInput.onfocus = async() =>{
        options.style.display = 'block'
   }
})

window.onclick = (e) => {
    allOpstins.forEach(elm => {
        if((e.target as HTMLElement).dataset.id != elm.dataset.id){
            elm.style.display = 'none'
        }
    })
}

window.onload = () => {
    console.log(document.cookie)
    if(alertP.textContent != ''){
        showAlert(alertP.textContent!)
    }
}

uplodedFile.onchange = () => {
    const fileNameViewr = document.querySelector('#file_name') as HTMLParagraphElement
    const fileUploderName = uplodedFile.value.split('\\')[uplodedFile.value.split('\\').length - 1]
       if(fileUploderName.split('.')[1]
        .toLowerCase() == 'pdf'){
            fileNameViewr.style.removeProperty('display')
            fileNameViewr!.textContent = fileUploderName
            hideAlret()
            return
        }
        showAlert('صيغة الملف ليست PDF')
}