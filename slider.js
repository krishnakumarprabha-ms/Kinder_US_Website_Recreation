const slider = document.getElementById("slider");
const dots = document.querySelectorAll(".linker");

let index = 0;
const totalSlides = dots.length;
let interval;

/* highlight active dot */
function updateDots() {
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
}

/* go to specific slide */
function goToSlide(slideIndex) {
    index = slideIndex;

    slider.scrollTo({
        left: window.innerWidth * index,
        behavior: "smooth"
    });

    updateDots();
}

/* automatic sliding */
function autoSlide() {
    index = (index + 1) % totalSlides;
    goToSlide(index);
}

/* start auto slider */
function startSlider() {
    interval = setInterval(autoSlide, 5000);
}

/* stop slider on hover */
function stopSlider() {
    clearInterval(interval);
}

/* dot click events */
dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        goToSlide(i);
    });
});

/* hover behaviour */
slider.addEventListener("mouseenter", stopSlider);
slider.addEventListener("mouseleave", startSlider);

/* start slider initially */
startSlider();