document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                preloader.style.display = 'none';
            }
        });
    });

    // Cursor personalizado
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', function(e) {
        gsap.to(cursor, {
            x: e.clientX - 10,
            y: e.clientY - 10,
            duration: 0.1
        });
        
        gsap.to(cursorFollower, {
            x: e.clientX - 20,
            y: e.clientY - 20,
            duration: 0.3
        });
    });
    
    document.querySelectorAll('a, button, .nav-link, .btn, .feature-link, .service-features li').forEach(element => {
        element.addEventListener('mouseenter', function() {
            gsap.to(cursor, {
                scale: 1.5,
                backgroundColor: 'rgba(41, 98, 255, 0.5)',
                duration: 0.3
            });
            gsap.to(cursorFollower, {
                scale: 0.5,
                backgroundColor: 'rgba(41, 98, 255, 0.2)',
                duration: 0.3
            });
        });
        
        element.addEventListener('mouseleave', function() {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: 'rgba(41, 98, 255, 0.5)',
                duration: 0.3
            });
            gsap.to(cursorFollower, {
                scale: 1,
                backgroundColor: 'transparent',
                duration: 0.3
            });
        });
    });

    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDotsContainer = document.querySelector('.hero-dots');
    const heroPrevBtn = document.querySelector('.hero-prev');
    const heroNextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    
    // Create dots
    heroSlides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('hero-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        heroDotsContainer.appendChild(dot);
    });
    
    const heroDots = document.querySelectorAll('.hero-dot');
    
    function goToSlide(index) {
        heroSlides[currentSlide].classList.remove('active');
        heroDots[currentSlide].classList.remove('active');
        
        currentSlide = (index + heroSlides.length) % heroSlides.length;
        
        heroSlides[currentSlide].classList.add('active');
        heroDots[currentSlide].classList.add('active');
        
        // Animate content
        const heroContent = heroSlides[currentSlide].querySelector('.hero-content');
        gsap.from(heroContent.children, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }
    
    heroPrevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    heroNextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    
    // Auto slide
    let slideInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
    }
    
    heroPrevBtn.addEventListener('click', resetInterval);
    heroNextBtn.addEventListener('click', resetInterval);
    heroDots.forEach(dot => dot.addEventListener('click', resetInterval));

    // Animate numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            stat.textContent = Math.floor(current);
        }, 16);
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        gsap.to(window, {
            scrollTo: 0,
            duration: 1,
            ease: 'power3.inOut'
        });
    });

    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Scroll animations with GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('section').forEach(section => {
        const heading = section.querySelector('.section-header');
        
        if (heading) {
            gsap.from(heading.children, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                },
                ease: 'power3.out'
            });
        }
    });
    
    // Animate feature cards
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            ease: 'back.out'
        });
    });
    
    // Animate about images
    const aboutImages = document.querySelectorAll('.about-images img');
    aboutImages.forEach((img, i) => {
        gsap.from(img, {
            x: i % 2 === 0 ? 50 : -50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: img,
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            ease: 'power3.out'
        });
    });
    
    // Animate experience badge
    const experienceBadge = document.querySelector('.experience-badge');
    if (experienceBadge) {
        gsap.from(experienceBadge, {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            delay: 0.4,
            scrollTrigger: {
                trigger: experienceBadge,
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            ease: 'elastic.out(1, 0.5)'
        });
    }
});