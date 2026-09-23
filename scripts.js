document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.list .item');
    const dots = document.querySelectorAll('.indicators .dot');
    const numberIndicator = document.querySelector('.indicators .numbers');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const mainContainer = document.querySelector('.main-container');

    let activeIndex = 0;
    const totalItems = items.length;
    let autoSlideInterval = null;
    const AUTO_SLIDE_TIME = 5000;

    // --- 1. ATUALIZAÇÃO DO SLIDER ---
    function updateSlider(index) {
        const currentActiveItem = document.querySelector('.list .item.active');
        const currentActiveDot = document.querySelector('.indicators .dot.active');

        if (currentActiveItem) {
            currentActiveItem.classList.remove('active');
            const img = currentActiveItem.querySelector('.product-img img');
            if (img) img.style.transform = '';
        }

        if (currentActiveDot) {
            currentActiveDot.classList.remove('active');
        }

        items[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');

        if (numberIndicator) {
            numberIndicator.textContent = String(index + 1).padStart(2, '0');
        }
    }

    function nextSlide() {
        activeIndex = (activeIndex + 1) % totalItems;
        updateSlider(activeIndex);
    }

    function prevSlide() {
        activeIndex = (activeIndex - 1 + totalItems) % totalItems;
        updateSlider(activeIndex);
    }

    // --- 2. EVENTOS DOS BOTÕES ---
    nextBtn?.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn?.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            activeIndex = index;
            updateSlider(activeIndex);
            resetAutoSlide();
        });
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        }
    });

    // --- 3. EFEITO TILT 3D NO MOUSE ---
    mainContainer.addEventListener('mousemove', (e) => {
        const activeImg = document.querySelector('.item.active .product-img img');
        if (!activeImg) return;

        const { innerWidth, innerHeight } = window;
        const xPercent = (e.clientX / innerWidth - 0.5) * 2;
        const yPercent = (e.clientY / innerHeight - 0.5) * 2;

        activeImg.style.transform = `
            translate3d(${xPercent * 15}px, ${yPercent * 15}px, 0px)
            rotateY(${xPercent * 10}deg)
            rotateX(${-yPercent * 10}deg)
        `;
    });

    mainContainer.addEventListener('mouseleave', () => {
        const activeImg = document.querySelector('.item.active .product-img img');
        if (activeImg) {
            activeImg.style.transform = 'translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)';
        }
    });

    // --- 4. SWIPE NO MOBILE ---
    let touchStartX = 0;
    let touchEndX = 0;

    mainContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });

    mainContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (Math.abs(touchStartX - touchEndX) > 50) {
            if (touchStartX > touchEndX) nextSlide();
            else prevSlide();
        }
        startAutoSlide();
    }, { passive: true });

    // --- 5. AUTOMATIZAÇÃO ---
    function startAutoSlide() {
        if (!autoSlideInterval) {
            autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_TIME);
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    mainContainer.addEventListener('mouseenter', stopAutoSlide);
    mainContainer.addEventListener('mouseleave', startAutoSlide);

    updateSlider(activeIndex);
    startAutoSlide();
});