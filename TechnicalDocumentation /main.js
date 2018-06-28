window.addEventListener('DOMContentLoaded', ()=>{
    console.log('hello from the console');
    const $nav = document.querySelector('ul[data-js="nav-bar"]');
     $nav.addEventListener('click', scrollToElement);
});

function scrollToElement(e) {
    e.preventDefault();
    const elementToScrollTo = document.querySelector(`${e.target.getAttribute('href')}`);
    elementToScrollTo.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    });
}