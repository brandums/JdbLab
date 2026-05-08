document.addEventListener('DOMContentLoaded', async function() {
    equipmentData = await getEquipmentData();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = equipmentData.find(item => item.id === productId);

    if (!product) {
        window.location.href = 'equipment.html';
        return;
    }

    const whatsappButton = document.getElementById('whatsapp-button');
    const whatsappMessage = `Hola, estoy interesado en solicitar una cotización para el producto: ${product.name} (ID: ${product.id}). Por favor, envíenme más información.`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    whatsappButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(`https://wa.me/59177893463?text=${encodedMessage}`, '_blank');
    });
    
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('breadcrumb-product').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-id').textContent = product.id;

    const priceContainer = document.getElementById('product-price');
    if (product.price && product.price != 0) {
        priceContainer.textContent = `Precio: Bs. ${product.price.toLocaleString()}`;
    } else {
        priceContainer.style.display = 'none';
    }
    
    const categoryMap = {
        'jdb': 'JDBLab (Física)',
        'tecno': 'TecnoEquip (Ingeniería Civil)'
    };
    document.getElementById('product-category').textContent = categoryMap[product.category] || product.category;
    
    const allImages = [product.imageUrl];
    if (product.images && product.images.length > 0) {
        allImages.push(...product.images);
    }
    
    setupImageGallery(allImages, product.name);
    
    const specsList = document.getElementById('product-specs');
    if (product.specs && product.specs.length > 0) {
        product.specs.forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            specsList.appendChild(li);
        });
    } else {
        specsList.innerHTML = '<li>No hay especificaciones disponibles</li>';
    }
    
    const featuresList = document.getElementById('product-features');
    if (product.features && product.features.length > 0) {
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    } else {
        featuresList.innerHTML = '<li>No hay características disponibles</li>';
    }
    
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
                <h3>No se encontraron equipos relacionados</h3>
            </div>
        `;
    }
    
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
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
    }
    
    if (typeof gsap !== 'undefined') {
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
    }
});

function setupImageGallery(images, productName) {
    const mainImageContainer = document.querySelector('.main-image');
    const mainImage = document.getElementById('product-main-image');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    
    if (!mainImage || !thumbnailsContainer) return;
    
    thumbnailsContainer.innerHTML = '';
    
    if (!images || images.length === 0) return;
    
    mainImage.src = images[0];
    mainImage.alt = productName;
    
    mainImageContainer.addEventListener('click', () => {
        openImagePopup(images, images.indexOf(mainImage.src), productName);
    });
    
    images.forEach((imgSrc, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';
        if (index === 0) thumb.classList.add('active');
        
        const thumbImg = document.createElement('img');
        thumbImg.src = imgSrc;
        thumbImg.alt = `${productName} - Imagen ${index + 1}`;
        
        thumb.appendChild(thumbImg);
        
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            mainImage.src = imgSrc;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        
        thumbnailsContainer.appendChild(thumb);
    });
}

function openImagePopup(images, startIndex = 0, productName = '') {
    if (!images || images.length === 0) return;
    
    let currentIndex = startIndex;
    const totalImages = images.length;
    const scrollY = window.scrollY;
    
    const overlay = document.createElement('div');
    overlay.className = 'image-popup-overlay';
    
    const content = document.createElement('div');
    content.className = 'image-popup-content';
    
    const img = document.createElement('img');
    img.src = images[currentIndex];
    img.alt = productName || 'Vista ampliada';
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'close-popup';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Cerrar');
    
    content.appendChild(closeBtn);
    content.appendChild(img);
    
    const closePopup = () => {
        overlay.remove();
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
        document.removeEventListener('keydown', handleKeydown);
    };
    
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            closePopup();
        } else if (totalImages > 1 && e.key === 'ArrowLeft') {
            e.preventDefault();
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = totalImages - 1;
            updateImage(newIndex);
        } else if (totalImages > 1 && e.key === 'ArrowRight') {
            e.preventDefault();
            let newIndex = currentIndex + 1;
            if (newIndex >= totalImages) newIndex = 0;
            updateImage(newIndex);
        }
    };
    
    let updateImage = null;
    
    if (totalImages > 1) {
        const prevBtn = document.createElement('div');
        prevBtn.className = 'nav-popup prev';
        prevBtn.innerHTML = '❮';
        prevBtn.setAttribute('aria-label', 'Imagen anterior');
        
        const nextBtn = document.createElement('div');
        nextBtn.className = 'nav-popup next';
        nextBtn.innerHTML = '❯';
        nextBtn.setAttribute('aria-label', 'Imagen siguiente');
        
        const counter = document.createElement('div');
        counter.className = 'popup-counter';
        counter.textContent = `${currentIndex + 1} / ${totalImages}`;
        
        content.appendChild(prevBtn);
        content.appendChild(nextBtn);
        content.appendChild(counter);
        
        updateImage = (newIndex) => {
            currentIndex = newIndex;
            img.src = images[currentIndex];
            counter.textContent = `${currentIndex + 1} / ${totalImages}`;
            img.style.animation = 'none';
            img.offsetHeight;
            img.style.animation = 'zoomIn 0.2s ease';
        };
        
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = totalImages - 1;
            updateImage(newIndex);
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let newIndex = currentIndex + 1;
            if (newIndex >= totalImages) newIndex = 0;
            updateImage(newIndex);
        });
    }
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePopup();
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });
    
    overlay.appendChild(content);
    
    document.body.appendChild(overlay);
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    document.addEventListener('keydown', handleKeydown);
}