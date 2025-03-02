let data, swiper, slides, titleContainer;
let mediaQuery = window.matchMedia("(max-width: 992px)");

document.addEventListener("DOMContentLoaded", () => {
    slides = document.querySelectorAll(".swiper-slide");
    titleContainer = document.querySelector(".featured-products__right-container__title");

    setData();
});

mediaQuery.addEventListener("change", () => {
    slides.forEach(slide => slide.innerHTML = "");
    if (swiper) swiper.destroy();
    createSwiper();
});

async function setData() {
    try{
        const response = await fetch("https://api.escuelajs.co/api/v1/products/?categoryId=5&offset=0&limit=5")
        data = await response.json();
    } catch (error) {
        console.log(error);
    } finally {
        if (data) createSwiper();
    }
}

function createSwiper() {
    swiper = new Swiper(".mySwiper", {
        cssMode: !mediaQuery.matches,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        pagination: {
            el: !mediaQuery.matches ? ".swiper-pagination" : "",
        },
        mousewheel: true,
        keyboard: true,
        on: {
            init : initializeSwiper,
            slideChange: onChangeSlide
        }
    });
}

function initializeSwiper() {
    titleContainer.children[0].textContent = data[0].title;
    titleContainer.children[1].textContent = "€" + data[0].price;
    titleContainer.children[2].textContent = "€" + data[0].price * 1.2;

    const swiperWrapper = document.querySelector(".swiper-wrapper");
    for (let i = 0; i < swiperWrapper.children.length; i++) {
        const slide = swiperWrapper.children[i];

        const image = document.createElement("img");
        image.src = data[i].images[0];
        image.alt = data[i].title;

        slide.appendChild(image);
    }
}

function onChangeSlide() {
    titleContainer.children[0].textContent = data[swiper.activeIndex].title;
    titleContainer.children[1].textContent = "€" + data[swiper.activeIndex].price;
    titleContainer.children[2].textContent = "€" + data[swiper.activeIndex].price * 1.2;
}