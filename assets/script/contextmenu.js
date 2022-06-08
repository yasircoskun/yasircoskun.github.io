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
        menu.dataset.directoryContext = ""
    }
});

menuOption.forEach(x => {
    x.addEventListener("click", e => {
        // eval(openWin(e.target));
        console.log(menu.dataset.directoryContext)
        e.target.dataset.directoryContext = menu.dataset.directoryContext;
        openWin(e.target)
    });
})

window.addEventListener("contextmenu", e => {
    e.preventDefault();
    let insideFolder = ["content", "desktop"]
    if(insideFolder.indexOf(e.target.className) != -1){
        if(e.target.className == "desktop"){
            menu.dataset.directoryContext = "/contents";
        }else if(e.target.className == "content"){
            menu.dataset.directoryContext = e.target.parentElement.dataset.fileName;
        }
        const origin = {
            left: e.pageX,
            top: e.pageY
        };
        setPosition(origin);
    }
    return false;
});