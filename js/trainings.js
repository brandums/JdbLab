// Variables globales
let selectedCourse = null;
const WHATSAPP_NUMBER = '59177893463'; // Reemplaza con tu número

// Cargar capacitaciones desde el backend
async function loadCapacitaciones() {
    try {
        showLoading();
        const response = await fetch('https://jdb-backend.fly.dev/api/capacitaciones');
        if (!response.ok) {
            throw new Error('Error al cargar las capacitaciones');
        }
        
        const capacitaciones = await response.json();
        displayCapacitaciones(capacitaciones);
    } catch (error) {
        console.error('Error:', error);
        showError();
    }
}

// Mostrar estado de carga
function showLoading() {
    const container = document.getElementById('capacitaciones-container');
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Cargando capacitaciones...</p>
        </div>
    `;
}

// Mostrar error
function showError() {
    const container = document.getElementById('capacitaciones-container');
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Error al cargar las capacitaciones</h3>
            <p>Por favor, intenta nuevamente más tarde.</p>
            <button class="btn btn-primary" onclick="loadCapacitaciones()">Reintentar</button>
        </div>
    `;
}

// Mostrar capacitaciones en la página
function displayCapacitaciones(capacitaciones) {
    const container = document.getElementById('capacitaciones-container');
    
    if (!capacitaciones || capacitaciones.length === 0) {
        container.innerHTML = `
            <div class="no-courses">
                <i class="fas fa-book-open"></i>
                <h3>No hay capacitaciones disponibles</h3>
                <p>Próximamente añadiremos nuevos cursos.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = capacitaciones.map(course => `
        <div class="course-card" data-text-animate>
            <div class="course-image">
                <img src="${course.imageUrl || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'}" alt="${course.name}">
                <div class="course-overlay">
                    <button class="btn-view-details" data-id="${course.id}">Únete</button>
                </div>
            </div>
            <div class="course-content">
                <h3 class="course-title">${course.name}</h3>
                <p class="course-description">${course.description || 'Curso especializado para profesionales.'}</p>
                <div class="course-meta">
                    <div class="course-price">${course.price || 'Consultar'}</div>
                    <button class="btn-inscribirse" data-id="${course.id}">Inscribirse</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Agregar event listeners a los botones
    addEventListeners(capacitaciones);
}

// Agregar event listeners a los botones
function addEventListeners(capacitaciones) {
    document.querySelectorAll('.btn-inscribirse').forEach(button => {
        button.addEventListener('click', (e) => {
            const courseId = e.target.getAttribute('data-id');
            selectedCourse = capacitaciones.find(c => c.id === courseId);
            openModal();
        });
    });
    
    document.querySelectorAll('.btn-view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const courseId = e.target.getAttribute('data-id');
            selectedCourse = capacitaciones.find(c => c.id === courseId);
            openModal();
        });
    });
}

// Abrir modal de inscripción
function openModal() {
    if (!selectedCourse) return;
    
    const modal = document.getElementById('inscription-modal');
    const courseInfo = document.getElementById('modal-course-info');
    
    courseInfo.innerHTML = `
        <p><strong>Curso:</strong> ${selectedCourse.name}</p>
        <p><strong>Precio:</strong> ${selectedCourse.price || 'Consultar'}</p>
        ${selectedCourse.description ? `<p><strong>Descripción:</strong> ${selectedCourse.description}</p>` : ''}
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('inscription-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('inscription-form').reset();
}

// Manejar envío del formulario
function handleSubmit(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    
    if (!nombre || !telefono || !email) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }
    
    // Formatear mensaje para WhatsApp - SOLUCIÓN AL PROBLEMA
    const message = `Hola, me interesa inscribirme en el curso:%0A%0A*${encodeURIComponent(selectedCourse.name)}*%0APrecio: ${encodeURIComponent(selectedCourse.price || 'Consultar')}%0A%0A*Mis datos:*%0ANombre: ${encodeURIComponent(nombre)}%0ATeléfono: ${encodeURIComponent(telefono)}%0AEmail: ${encodeURIComponent(email)}`;
    
    // SOLUCIÓN: Dos métodos diferentes para abrir WhatsApp
    openWhatsApp(message);
    
    // Cerrar el modal después de enviar
    closeModal();
}

// SOLUCIÓN: Función mejorada para abrir WhatsApp
function openWhatsApp(message) {
    // Método 1: Intentar con el método estándar
    const standardUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`;
    
    // Método 2: Alternativa con web.whatsapp.com (a veces funciona mejor)
    const webUrl = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`;
    
    // Método 3: Para la app móvil (usando intent)
    const mobileUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${message}`;
    
    // Detectar si es dispositivo móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // En móvil, intentamos primero con el esquema de app nativa
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = mobileUrl;
        document.body.appendChild(iframe);
        
        // Fallback después de un tiempo
        setTimeout(() => {
            document.body.removeChild(iframe);
            window.location.href = standardUrl;
        }, 1000);
    } else {
        // En escritorio, abrimos directamente la versión web
        window.open(standardUrl, '_blank');
    }
}

// Inicializar eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Cargar capacitaciones
    loadCapacitaciones();
    
    // Cerrar modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    
    // Enviar formulario
    document.getElementById('inscription-form').addEventListener('submit', handleSubmit);
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('inscription-modal');
        if (e.target === modal) {
            closeModal();
        }
    });
});