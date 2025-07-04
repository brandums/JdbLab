
// Acordeón de preguntas frecuentes
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar otros items abiertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar el item actual
            item.classList.toggle('active');
        });
    });
}

function setupFormValidation() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const phone = form.querySelector('#phone');
            const subject = form.querySelector('#subject');
            const message = form.querySelector('#message');
            const replyto = form.querySelector('#replyto');
            let isValid = true;

            // Resetear errores
            form.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));

            // Validación
            if (!name.value.trim()) {
                name.parentElement.classList.add('error');
                isValid = false;
            }

            if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.parentElement.classList.add('error');
                isValid = false;
            }

            if (!phone.value.trim()) {
                phone.parentElement.classList.add('error');
                isValid = false;
            }

            if (!subject.value) {
                subject.parentElement.classList.add('error');
                isValid = false;
            }

            if (!message.value.trim()) {
                message.parentElement.classList.add('error');
                isValid = false;
            }

            if (isValid) {
                // Asignar email como replyto
                replyto.value = email.value;

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.querySelector('span').textContent;

                submitBtn.querySelector('span').textContent = 'Enviando...';
                submitBtn.disabled = true;

                // Enviar a Web3Forms usando fetch()
                const formData = new FormData(form);

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                    }).then(response => {
                    if (response.ok) {
                        const existingSuccess = form.querySelector('.form-success-message');
                        if (existingSuccess) existingSuccess.remove();

                        const successMessage = document.createElement('div');
                        successMessage.className = 'form-success-message';
                        successMessage.innerHTML = `
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>¡Mensaje enviado con éxito!</h4>
                                <p>Nos pondremos en contacto contigo en breve.</p>
                            </div>
                        `;

                        form.insertBefore(successMessage, form.querySelector('.form-submit'));

                        form.querySelectorAll('.form-group').forEach(el => {
                            el.style.opacity = '0.5';
                            el.style.pointerEvents = 'none';
                        });

                        submitBtn.querySelector('span').textContent = 'Mensaje Enviado';

                        setTimeout(() => {
                            form.reset();
                            successMessage.remove();
                            submitBtn.querySelector('span').textContent = originalText;
                            submitBtn.disabled = false;
                            form.querySelectorAll('.form-group').forEach(el => {
                                el.style.opacity = '1';
                                el.style.pointerEvents = 'auto';
                            });
                        }, 5000);
                    } else {
                        alert("Ocurrió un error al enviar el mensaje.");
                        submitBtn.querySelector('span').textContent = originalText;
                        submitBtn.disabled = false;
                    }
                }).catch(() => {
                    alert("Error de red. Inténtalo más tarde.");
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.disabled = false;
                });
            }
        });

        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', function () {
                if (this.value.trim()) {
                    this.parentElement.classList.remove('error');
                }
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", setupFormValidation);


// Animaciones específicas para la página de contacto
function setupContactAnimations() {
    // Animación de entrada para los elementos
    gsap.utils.toArray('[data-text-animate]').forEach((el, i) => {
        const delay = el.dataset.delay || 0;
        gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1 + parseFloat(delay),
            ease: "power3.out"
        });
    });
    
    // Efecto hover para las tarjetas de contacto
    const contactCards = document.querySelectorAll('.contact-info-card');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupFAQ();
    setupFormValidation();
    setupContactAnimations();
});