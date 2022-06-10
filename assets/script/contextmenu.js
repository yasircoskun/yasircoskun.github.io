const menu = document.querySelector(".menu");
const menuOption = document.querySelectorAll(".menu-option");

let menuVisible = false;

const toggleMenu = command => {
    menu.style.display = command === "show" ? "block" : "none";
    menuVisible = !menuVisible;
};

const setPosition = ({ top, left }) => {
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    toggleMenu("show");
};

window.addEventListener("click", e => {
    if (menuVisible){
        toggleMenu("hide");
        delete menu.dataset.directoryContext
        delete menu.dataset.filePath
        menu.querySelector('#fiv-icon-md').style.display = "none";
        menu.querySelector('#fiv-icon-pdf').style.display = "none";
    }
});

menuOption.forEach(x => {
    x.addEventListener("click", e => {
        // eval(openWin(e.target));
        console.log(menu.dataset.directoryContext)
        e.target.dataset.directoryContext = menu.dataset.directoryContext;
        e.target.dataset.filePath = menu.dataset.filePath
        openWin(e.target)
    });
})

window.addEventListener("contextmenu", e => {
    e.preventDefault();
    let insideFolder = ["content", "desktop", "fiv-cla fiv-icon-md", "fiv-cla fiv-icon-pdf"]
    if(insideFolder.indexOf(e.target.className) != -1){
        if(e.target.className == "desktop"){
            menu.dataset.directoryContext = "/contents";
        }else if(e.target.className == "content"){
            menu.dataset.directoryContext = e.target.parentElement.dataset.fileName;
        }else if([...e.target.classList].indexOf('fiv-icon-md') != -1){
            menu.dataset.filePath = e.target.parentElement.dataset.name;
            menu.querySelector('#fiv-icon-md').style.display = "block";
        }else if([...e.target.classList].indexOf('fiv-icon-pdf') != -1){
            menu.dataset.filePath = e.target.parentElement.dataset.name;
            menu.querySelector('#fiv-icon-pdf').style.display = "block";
        }
        const origin = {
            left: e.pageX,
            top: e.pageY
        };
        setPosition(origin);
    }
    return false;
});