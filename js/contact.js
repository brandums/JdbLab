
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

// Validación del formulario
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const phone = form.querySelector('#phone');
            const subject = form.querySelector('#subject');
            const message = form.querySelector('#message');
            let isValid = true;
            
            // Resetear errores
            form.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));
            
            // Validar campos
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
            
            // Si es válido, enviar formulario
            if (isValid) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.querySelector('span').textContent;
                
                // Simular envío
                submitBtn.querySelector('span').textContent = 'Enviando...';
                submitBtn.disabled = true;
                
                // Aquí iría el código real para enviar el formulario
                // Simulamos un envío con setTimeout
                setTimeout(() => {
                    // Mostrar mensaje de éxito
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success-message';
                    successMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <h4>¡Mensaje enviado con éxito!</h4>
                            <p>Nos pondremos en contacto contigo en breve.</p>
                        </div>
                    `;
                    
                    // Insertar antes del botón
                    form.insertBefore(successMessage, form.querySelector('.form-submit'));
                    
                    // Ocultar formulario
                    form.querySelectorAll('.form-group').forEach(el => {
                        el.style.opacity = '0.5';
                        el.style.pointerEvents = 'none';
                    });
                    
                    // Restaurar botón
                    submitBtn.querySelector('span').textContent = 'Mensaje Enviado';
                    
                    // Resetear formulario después de 5 segundos
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
                    
                }, 1500);
            }
        });
        
        // Validación en tiempo real
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.parentElement.classList.remove('error');
                }
            });
        });
    }
}

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