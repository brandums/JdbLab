document.addEventListener('DOMContentLoaded', () => {
    // Inicializar GSAP con ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Preloader animation
    const preloaderTL = gsap.timeline();
    preloaderTL.to('.preloader', {
        opacity: 0,
        duration: 0.5,
        delay: 0.7,
        ease: 'power2.inOut'
    });
    preloaderTL.to('.preloader', {
        display: 'none',
        duration: 0
    });
    
    // Animación del cursor personalizado
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {        
        // Efecto hover en botones
        document.querySelectorAll('.magnetic, a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    scale: 2,
                    backgroundColor: 'rgba(41, 98, 255, 0.3)',
                    duration: 0.3
                });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: 'rgba(41, 98, 255, 0.5)',
                    duration: 0.3
                });
            });
        });
    }
    
    // Animación del navbar al hacer scroll
    gsap.to('.navbar', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '+=100',
            scrub: true,
            onUpdate: (self) => {
                if (self.progress > 0) {
                    document.querySelector('.navbar').classList.add('scrolled');
                } else {
                    document.querySelector('.navbar').classList.remove('scrolled');
                }
            }
        }
    });
    
    // Animación del hero section
    const heroTL = gsap.timeline();
    heroTL.from('.hero-title .char', {
        y: 50,
        opacity: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.5
    });
    heroTL.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.5');
    heroTL.from('.hero-buttons', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.4');
    heroTL.from('.hero-scroll', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.3');
    
    // Animación de la sección "About"
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.about-content', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Animación de los stats
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-count');
        const count = { value: 0 };
        
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(count, {
                    value: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        stat.textContent = Math.floor(count.value);
                    }
                });
            }
        });
    });
    
    // Animación mejorada para los servicios
    gsap.set('.service-card', {
        y: 50,
        opacity: 0
    });

    ScrollTrigger.batch('.service-card', {
        start: 'top 80%',
        onEnter: batch => {
            gsap.to(batch, {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 1,
                ease: 'back.out(1.2)'
            });
        },
        once: true
    });

    // Animación mejorada para los testimonios
    gsap.set('.testimonial-card', {
        y: 50,
        opacity: 0
    });

    ScrollTrigger.batch('.testimonial-card', {
        start: 'top 80%',
        onEnter: batch => {
            gsap.to(batch, {
                y: 0,
                opacity: 1,
                stagger: 0.2,
                duration: 0.5,
                ease: 'power2.out'
            });
        },
        once: true
    });
    
    // Animación del CTA
    gsap.from('.cta-content h2 .char', {
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.cta-content p, .cta-content .btn', {
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1
    });
    
    // Animación del footer
    gsap.from('.footer-col', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    // Efecto magnético en botones
    document.querySelectorAll('.magnetic').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const distanceX = x - centerX;
            const distanceY = y - centerY;
            
            gsap.to(button, {
                x: distanceX * 0.2,
                y: distanceY * 0.2,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
    
    // Efecto 3D en tarjetas
    document.querySelectorAll('.service-card, .testimonial-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            gsap.to(card, {
                rotationX: angleX,
                rotationY: angleY,
                transformPerspective: 1000,
                ease: 'power1.out',
                duration: 0.5
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                ease: 'elastic.out(1, 0.5)',
                duration: 1
            });
        });
    });
    
    // Efecto hover en enlaces del navbar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                color: '#2962ff',
                duration: 0.3
            });
        });
        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                gsap.to(link, {
                    color: '#1a237e',
                    duration: 0.3
                });
            }
        });
    });
    
    // Efecto en el botón de WhatsApp
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('mouseenter', () => {
            gsap.to(whatsappBtn, {
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to('.whatsapp-tooltip', {
                opacity: 1,
                x: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        whatsappBtn.addEventListener('mouseleave', () => {
            gsap.to(whatsappBtn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to('.whatsapp-tooltip', {
                opacity: 0,
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }
    
    // Animación de las partículas (si se usa particles.js)
    if (typeof particlesJS === 'function') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
});