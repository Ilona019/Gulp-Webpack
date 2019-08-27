const filters = document.querySelectorAll('.filter__title');

const classes = {
    isActive: 'is-active'
}

const toggleClass = (el, className) => {
    if (el.classList.contains(className)){
        el.classList.remove(className);
    }
    else{
        el.classList.add(className);
    }
}

let i = 0;
while(i < 3) {
    filters[i++].addEventListener('click', (e) => {
            toggleClass(e.currentTarget, classes.isActive);
    });
}