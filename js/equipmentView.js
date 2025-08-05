document.addEventListener('DOMContentLoaded', async function() {
    equipmentData = await getEquipmentData();
    // Obtener el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Buscar el producto en los datos
    const product = equipmentData.find(item => item.id === productId);


    if (!product) {
        // Redirigir si no se encuentra el producto
        window.location.href = 'equipment.html';
        return;
    }
    
    // Mostrar los datos del producto
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('breadcrumb-product').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-id').textContent = product.id;
    
    // Establecer categoría
    const categoryMap = {
        'jdb': 'JDBLab (Física)',
        'tecno': 'TecnoEquip (Ingeniería Civil)'
    };
    document.getElementById('product-category').textContent = categoryMap[product.category] || product.category;
    
    // Establecer imagen principal
    const mainImage = document.getElementById('product-main-image');
    mainImage.src = product.imageUrl;
    mainImage.alt = product.name;
    
    // Agregar especificaciones
    const specsList = document.getElementById('product-specs');
    product.specs.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
    });
    
    // Agregar características
    const featuresList = document.getElementById('product-features');
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // Mostrar productos relacionados (misma categoría)
    const relatedProducts = equipmentData.filter(item => 
        item.category === product.category && item.subcategory == product.subcategory && item.id !== product.id
    ).slice(0, 4);
    
    const relatedContainer = document.getElementById('related-products');
    if (relatedProducts.length > 0) {
        relatedProducts.forEach(related => {
            const card = document.createElement('div');
            card.className = 'related-product-card';
            card.innerHTML = `
                <a href="equipmentView.html?id=${related.id}">
                    <div class="related-product-image">
                        <img src="${related.imageUrl}" alt="${related.name}">
                    </div>
                    <div class="related-product-info">
                        <h3>${related.name}</h3>
                        <p>${related.description.substring(0, 100)}...</p>
                        <a href="equipmentView.html?id=${related.id}" class="related-product-link">
                            Ver detalles <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </a>
            `;
            relatedContainer.appendChild(card);
        });
    } else {
        relatedContainer.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 40px;">
            <img style="width: 200px;" src="img/empty.svg" alt="No se encontraron resultados">
            <h3>No se encontraron equipos</h3>
        </div>
    `;
    }
    
    // Inicializar animaciones
    gsap.registerPlugin(ScrollTrigger);
    
    // Animación de entrada
    gsap.from('.product-detail-grid > *', {
        scrollTrigger: {
            trigger: '.product-detail-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power2.out'
    });
    
    // Animación de productos relacionados
    gsap.from('.related-product-card', {
        scrollTrigger: {
            trigger: '.related-products-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)'
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
                x: distanceX * 0.15,
                y: distanceY * 0.15,
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
});