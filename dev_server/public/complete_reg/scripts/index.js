"use strict";
const am_a_publisher_button = document.querySelector('#am_a_publisher_button');
const type_userDiv = document.querySelector('.type-user');
const publisher_form = document.querySelector('.publisher-form');
const backButton = document.querySelector('#backButton');
const uplodedFile = document.querySelector('#license_pdf');
const alertP = document.querySelector('#alert');
const alertDiv = document.querySelector('.alert');
const alertOkButton = alertDiv.querySelector('button');
const galss = document.querySelector('.glass');
const socialButton = document.querySelector('#social');
const social_forms = document.querySelector('.social_forms');
const cancelSocial = document.querySelector('#cancelSocial');
const addSocial = document.querySelector('#addSocial');
const allSocialsTextEera = document.querySelector('#allSocialsTextEera');
const done = document.querySelector('#done');
const test_image = document.querySelector('#test_image');
const img_input = document.querySelector('#image');
img_input.onchange = async () => {
    test_image.style.opacity = '0';
    await sleep(500);
    test_image.style.removeProperty('opacity');
    test_image.style.display = 'none';
    await sleep(300);
    const file = img_input.files;
    test_image.style.removeProperty('display');
    test_image.parentElement.style.border = 'none';
    test_image.parentElement.style.background = '#1c2869';
    if (file && file[0]) {
        test_image.src = URL.createObjectURL(file[0]);
    }
};
const sleep = async (dlay) => {
    await new Promise(r => setTimeout(r, dlay));
};
const socialURLS = {
    facebook: "",
    twitter: "",
    instagram: "",
    phone: "",
};
const hideAlret = async () => {
    galss.style.opacity = '0';
    alertDiv.style.scale = '0';
    social_forms.style.scale = '0';
    await sleep(500);
    alertDiv.style.display = 'none';
    alertP.textContent = '';
    galss.style.display = 'none';
    social_forms.style.display = 'none';
};
const showAlert = async (msg) => {
    alertDiv.style.display = 'block';
    alertP.textContent = msg;
    galss.style.display = 'block';
    await sleep(500);
    galss.style.opacity = '1';
    alertDiv.style.scale = '1';
};
socialButton.onclick = async () => {
    galss.style.display = 'block';
    social_forms.style.display = 'block';
    await sleep(500);
    galss.style.opacity = '1';
    social_forms.style.scale = '1';
};
galss.onclick = async () => {
    hideAlret();
};
alertOkButton.onclick = async () => {
    hideAlret();
};
cancelSocial.onclick = () => {
    hideAlret();
    social_forms.querySelectorAll('.urlSocial').forEach(elm => {
        const input = elm.querySelector('input');
        input.value = '';
        if (input.dataset.type) {
            socialURLS[input.dataset.type] = '';
        }
    });
    allSocialsTextEera.value = '';
};
social_forms.querySelectorAll('.urlSocial').forEach(elm => {
    const input = elm.querySelector('input');
    console.log(input);
    if (input.dataset.type) {
        input.onkeyup = () => {
            socialURLS[input.dataset.type] = input.value;
            allSocialsTextEera.value = JSON.stringify(socialURLS);
        };
        input.onchange = () => {
            socialURLS[input.dataset.type] = input.value;
            allSocialsTextEera.value = JSON.stringify(socialURLS);
            console.log(JSON.parse(allSocialsTextEera.value));
        };
    }
});
addSocial.onclick = () => {
    hideAlret();
};
var isCanClick = true;
am_a_publisher_button.onclick = async () => {
    if (isCanClick) {
        isCanClick = false;
        type_userDiv.style.animation = "hide 1s 1";
        await sleep(1000);
        publisher_form.style.removeProperty('display');
        publisher_form.style.animation = "show 1s 1";
        type_userDiv.style.removeProperty('animation');
        type_userDiv.style.display = 'none';
        await sleep(1000);
        isCanClick = true;
        publisher_form.style.removeProperty('animation');
    }
};
backButton.onclick = async () => {
    if (isCanClick) {
        isCanClick = false;
        publisher_form.style.animation = "hide 1s 1";
        await sleep(1000);
        type_userDiv.style.removeProperty('display');
        type_userDiv.style.animation = "show 1s 1";
        publisher_form.style.removeProperty('animation');
        publisher_form.style.display = 'none';
        await sleep(1000);
        isCanClick = true;
        type_userDiv.style.removeProperty('animation');
    }
};
/*

<div class="attrr">
    <p>strgdqwd</p>
    <i class="fa-solid fa-x"></i>
</div>

*/
const allOpstins = [];
document.querySelectorAll('.my_select').forEach(elm => {
    const options = elm.querySelector('.options');
    const searchInput = elm.querySelector('input[type=text]');
    const finalInput = elm.querySelector('input[type=hidden]');
    finalInput.value = '';
    const attrsDiv = elm.querySelector('.attrrs');
    const codeElm = elm.querySelector('code');
    var allData = [];
    allOpstins.push(options);
    Array.from(options.children).forEach(elm => {
        const element = elm;
        element.onclick = () => {
            var canAdd = true;
            Array.from(attrsDiv.children).forEach(elm => {
                if (elm.querySelector('p')?.textContent == element.textContent) {
                    canAdd = false;
                }
            });
            if (!canAdd) {
                return;
            }
            searchInput.value = "";
            const attrDiv = document.createElement('div');
            attrDiv.classList.add('attrr');
            const attrName = document.createElement('p');
            attrName.textContent = element.textContent;
            allData.push(element.dataset.value);
            const x_icon = document.createElement('i');
            x_icon.classList.add('fa-solid');
            x_icon.classList.add('fa-x');
            attrDiv.appendChild(attrName);
            attrDiv.appendChild(x_icon);
            attrsDiv?.appendChild(attrDiv);
            Array.from(attrsDiv.children).forEach(elm => {
                elm.querySelector('i').onclick = () => {
                    allData = allData.filter(word => word != elm.querySelector('p').dataset.value);
                    finalInput.value = allData.join('-');
                    elm.remove();
                    if (attrsDiv.children.length == 0) {
                        codeElm.style.display = 'block';
                    }
                    else {
                        codeElm.style.display = 'none';
                    }
                };
            });
            finalInput.value = allData.join('-');
            codeElm.style.display = 'none';
        };
    });
    searchInput.onkeyup = () => {
        Array.from(options.children).forEach(elm => {
            const element = elm;
            element.style.display = 'block';
            if (!element.textContent?.includes(searchInput.value)) {
                element.style.display = 'none';
            }
        });
    };
    searchInput.onfocus = async () => {
        options.style.display = 'block';
    };
});
window.onclick = (e) => {
    allOpstins.forEach(elm => {
        if (e.target.dataset.id != elm.dataset.id) {
            elm.style.display = 'none';
        }
    });
};
window.onload = () => {
    console.log(document.cookie);
    if (alertP.textContent != '') {
        showAlert(alertP.textContent);
    }
};
uplodedFile.onchange = () => {
    const fileNameViewr = document.querySelector('#file_name');
    const fileUploderName = uplodedFile.value.split('\\')[uplodedFile.value.split('\\').length - 1];
    if (fileUploderName.split('.')[1]
        .toLowerCase() == 'pdf') {
        fileNameViewr.style.removeProperty('display');
        fileNameViewr.textContent = fileUploderName;
        hideAlret();
        return;
    }
    showAlert('صيغة الملف ليست PDF');
};
