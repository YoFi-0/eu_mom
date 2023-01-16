"use strict";
const show_nav = document.querySelector('.show_nav');
const controller = document.querySelector('.controller');
const sleepNav = async (dlay) => {
    await new Promise(r => setTimeout(r, dlay));
};
var isCntrollerShowd = false;
var isCanClikeNav = true;
show_nav.onclick = async () => {
    if (!isCanClikeNav) {
        return;
    }
    if (isCntrollerShowd) {
        isCanClikeNav = false;
        isCntrollerShowd = false;
        controller.style.animation = 'toRight 0.3s 1 forwards';
        show_nav.style.removeProperty('color');
        await sleepNav(500);
        controller.style.width = "0";
        isCanClikeNav = true;
        controller.style.removeProperty('animation');
    }
    else {
        isCanClikeNav = false;
        isCntrollerShowd = true;
        controller.style.width = "100%";
        controller.style.animation = 'fromRight 0.3s 1';
        show_nav.style.color = "#FFF";
        await sleepNav(500);
        isCanClikeNav = true;
        controller.style.removeProperty('animation');
    }
};
