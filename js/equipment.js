// equipment.js - Versión con categorías dinámicas desde backend
const BACKEND_URL = 'https://jdb-backend.fly.dev';

let equipmentData = [];
let categoriasData = [];

// Función para obtener equipos desde el backend
async function getEquipmentData() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/products`);
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        
        return data.map(item => ({
            id: Number(item.id),
            name: item.name,
            description: item.description,
            imageUrl: item.imageUrl
                ? (item.imageUrl.startsWith('http') ? item.imageUrl : `img/${item.imageUrl}`)
                : 'img/noimage.avif',
            category: item.category.toLowerCase(),
            subcategory: item.subcategory,
            specs: Array.isArray(item.specs) ? item.specs : JSON.parse(item.specs || '[]'),
            features: Array.isArray(item.features) ? item.features : JSON.parse(item.features || '[]'),
            price: item.price,
            images: item.images || []
        }));
    } catch (error) {
        console.error('Error fetching equipment data:', error);
        return [];
    }
}

// Función para obtener categorías desde el backend
async function getCategorias() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/categorias`);
        if (!response.ok) throw new Error('Error al cargar categorías');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error cargando categorías:', error);
        return [
            { categoria: 'jdb', categoriaNombre: '🧪 JDBLab (Física)', subcategoria: 'fisica1', subcategoriaNombre: 'Física I', orden: 1 },
            { categoria: 'jdb', categoriaNombre: '🧪 JDBLab (Física)', subcategoria: 'fisica2', subcategoriaNombre: 'Física II', orden: 2 },
            { categoria: 'jdb', categoriaNombre: '🧪 JDBLab (Física)', subcategoria: 'fisica3', subcategoriaNombre: 'Física III', orden: 3 },
            { categoria: 'tecno', categoriaNombre: '🏗️ TecnoEquip (Ing. Civil)', subcategoria: 'suelos-campo', subcategoriaNombre: 'Suelos de Campo', orden: 1 },
            { categoria: 'tecno', categoriaNombre: '🏗️ TecnoEquip (Ing. Civil)', subcategoria: 'suelos-lab', subcategoriaNombre: 'Suelos de Laboratorio', orden: 2 },
            { categoria: 'tecno', categoriaNombre: '🏗️ TecnoEquip (Ing. Civil)', subcategoria: 'asfalto', subcategoriaNombre: 'Asfalto', orden: 3 },
            { categoria: 'tecno', categoriaNombre: '🏗️ TecnoEquip (Ing. Civil)', subcategoria: 'concreto', subcategoriaNombre: 'Concreto', orden: 4 },
            { categoria: 'tecno', categoriaNombre: '🏗️ TecnoEquip (Ing. Civil)', subcategoria: 'cemento', subcategoriaNombre: 'Cemento', orden: 5 },
            { categoria: 'tecno', categoriaNombre: '🏗️ TecnoEquip (Ing. Civil)', subcategoria: 'agregado', subcategoriaNombre: 'Agregado', orden: 6 },
            { categoria: 'tecno', categoriaNombre: '🏗️ TecnoEquip (Ing. Civil)', subcategoria: 'general', subcategoriaNombre: 'Equipo General', orden: 7 }
        ];
    }
}

// Generar dropdown de categorías
function generarCategoryDropdown(categorias) {
    const categorySelector = document.querySelector('.category-selector');
    if (!categorySelector) return;
    
    const categoriasUnicas = [...new Map(categorias.map(item => [item.categoria, item])).values()];
    
    const dropdownHTML = `
        <div class="category-dropdown" id="categoryDropdown">
            <div class="category-dropdown-header">
                <span>${categoriasUnicas[0].categoriaNombre}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="category-dropdown-backdrop"></div>
            <div class="category-dropdown-menu">
                ${categoriasUnicas.map(cat => `
                    <div class="category-dropdown-item ${categoriasUnicas.indexOf(cat) === 0 ? 'active' : ''}" 
                         data-category="${cat.categoria}">
                        ${cat.categoriaNombre}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    categorySelector.innerHTML = dropdownHTML;
    initializeDropdown();
}

// Inicializar el comportamiento del dropdown
function initializeDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    if (!dropdown) return;
    
    const header = dropdown.querySelector('.category-dropdown-header');
    const backdrop = dropdown.querySelector('.category-dropdown-backdrop');
    const items = dropdown.querySelectorAll('.category-dropdown-item');
    
    header.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });
    
    backdrop.addEventListener('click', function() {
        dropdown.classList.remove('open');
    });
    
    items.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            items.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const headerSpan = header.querySelector('span');
            headerSpan.textContent = this.textContent.trim();
            
            dropdown.classList.remove('open');
            
            const category = this.dataset.category;
            document.querySelectorAll('.filter-group').forEach(group => {
                group.classList.remove('active');
            });
            
            const targetGroup = document.querySelector(`.${category}-filters`);
            if (targetGroup) {
                targetGroup.classList.add('active');
                targetGroup.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                const allBtn = targetGroup.querySelector('.filter-btn[data-subcategory^="all"]');
                if (allBtn) allBtn.classList.add('active');
            }
            
            if (typeof filterEquipment === 'function') {
                currentPage = 1;
                filterEquipment();
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dropdown.classList.contains('open')) {
            dropdown.classList.remove('open');
        }
    });
}

// Generar filtros de subcategorías
function generarSubcategoryFilters(categorias) {
    const subcategoryFiltersContainer = document.querySelector('.subcategory-filters');
    if (!subcategoryFiltersContainer) return;
    
    subcategoryFiltersContainer.innerHTML = '';
    
    const categoriaAgrupada = categorias.reduce((acc, cat) => {
        if (!acc[cat.categoria]) {
            acc[cat.categoria] = [];
        }
        acc[cat.categoria].push(cat);
        return acc;
    }, {});
    
    Object.keys(categoriaAgrupada).forEach((catKey, index) => {
        const filterGroup = document.createElement('div');
        filterGroup.className = `filter-group ${catKey}-filters ${index === 0 ? 'active' : ''}`;
        
        const filterLabel = document.createElement('span');
        filterLabel.className = 'filter-label';
        filterLabel.textContent = 'Filtrar:';
        filterGroup.appendChild(filterLabel);
        
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.dataset.subcategory = `all-${catKey}`;
        allBtn.textContent = 'Todos';
        filterGroup.appendChild(allBtn);
        
        const subcategorias = categoriaAgrupada[catKey].sort((a, b) => a.orden - b.orden);
        
        subcategorias.forEach(subcat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.subcategory = subcat.subcategoria;
            btn.textContent = subcat.subcategoriaNombre;
            filterGroup.appendChild(btn);
        });
        
        subcategoryFiltersContainer.appendChild(filterGroup);
    });
}

function getSubcategoryName(subcategory) {
    const subcat = categoriasData.find(c => c.subcategoria === subcategory);
    return subcat ? subcat.subcategoriaNombre : subcategory;
}

function getCategoryName(category) {
    const cat = categoriasData.find(c => c.categoria === category);
    return cat ? cat.categoriaNombre : category;
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando carga de equipos...');
    
    try {
        categoriasData = await getCategorias();
        console.log('✅ Categorías cargadas:', categoriasData.length);
        
        equipmentData = await getEquipmentData();
        console.log('✅ Productos cargados:', equipmentData.length);
        
        generarCategoryDropdown(categoriasData);
        generarSubcategoryFilters(categoriasData);
        
    } catch (error) {
        console.error('❌ Error en la inicialización:', error);
    }
    
    const subcategoryFiltersContainer = document.querySelector('.subcategory-filters');
    const equipmentGrid = document.getElementById('equipment-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    const searchInput = document.getElementById('equipment-search');
    const paginationContainer = document.getElementById('pagination');
    
    let currentPage = 1;
    const itemsPerPage = 12;
    
    if (subcategoryFiltersContainer) {
        subcategoryFiltersContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-btn')) {
                currentPage = 1;
                const filterGroup = e.target.closest('.filter-group');
                filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                filterEquipment();
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentPage = 1;
            filterEquipment();
        });
    }
    
    function filterEquipment() {
        const activeCategoryItem = document.querySelector('.category-dropdown-item.active');
        const activeCategory = activeCategoryItem ? activeCategoryItem.dataset.category : '';
        
        const activeSubcategoryBtn = document.querySelector('.filter-group.active .filter-btn.active');
        const activeSubcategory = activeSubcategoryBtn ? activeSubcategoryBtn.dataset.subcategory : '';
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        let filteredEquipment = equipmentData;
        
        if (activeCategory) {
            filteredEquipment = filteredEquipment.filter(equip => equip.category === activeCategory);
        }
        
        if (activeCategory && activeSubcategory && !activeSubcategory.startsWith('all')) {
            filteredEquipment = filteredEquipment.filter(equip => equip.subcategory === activeSubcategory);
        }
        
        if (searchTerm) {
            filteredEquipment = filteredEquipment.filter(equip => 
                equip.name.toLowerCase().includes(searchTerm) || 
                equip.description.toLowerCase().includes(searchTerm)
            );
        }
        
        displayEquipment(filteredEquipment);
        setupPagination(filteredEquipment);
    }
    
    function displayEquipment(equipments) {
        if (!equipmentGrid) return;
        
        equipmentGrid.innerHTML = '';
        
        if (equipments.length === 0) {
            if (noResults) noResults.style.display = 'block';
            if (resultsCount) resultsCount.textContent = '0';
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }
        
        if (noResults) noResults.style.display = 'none';
        if (resultsCount) resultsCount.textContent = equipments.length;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, equipments.length);
        const paginatedItems = equipments.slice(startIndex, endIndex);
        
        paginatedItems.forEach(equip => {
            const card = document.createElement('div');
            card.className = 'equipment-card';
            card.innerHTML = `
                <div class="equipment-image" onclick="window.location.href='equipmentView.html?id=${equip.id}'">
                    <img src="${equip.imageUrl}" alt="${equip.name}" onerror="this.src='img/noimage.avif'">
                </div>
                <div class="equipment-info">
                    <span class="equipment-category">${getSubcategoryName(equip.subcategory)}</span>
                    <h3 class="equipment-name" onclick="window.location.href='equipmentView.html?id=${equip.id}'">${equip.name}</h3>
                    <p class="equipment-description">${equip.description}</p>
                    <a href="equipmentView.html?id=${equip.id}" class="equipment-details-btn">
                        Ver detalles
                        <svg viewBox="0 0 13 10" height="10px" width="15px">
                            <path d="M1,5 L11,5"></path>
                            <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                    </a>
                </div>
            `;
            
            equipmentGrid.appendChild(card);
        });
    }
    
    function setupPagination(equipments) {
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(equipments.length / itemsPerPage);
        
        if (pageCount <= 1) return;
        
        if (currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'pagination-btn';
            prevBtn.innerHTML = '&laquo;';
            prevBtn.addEventListener('click', () => {
                currentPage--;
                filterEquipment();
                window.scrollTo({top: equipmentGrid.offsetTop - 80, behavior: 'smooth'});
            });
            paginationContainer.appendChild(prevBtn);
        }
        
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(pageCount, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                filterEquipment();
                window.scrollTo({top: equipmentGrid.offsetTop - 80, behavior: 'smooth'});
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        if (currentPage < pageCount) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'pagination-btn';
            nextBtn.innerHTML = '&raquo;';
            nextBtn.addEventListener('click', () => {
                currentPage++;
                filterEquipment();
                window.scrollTo({top: equipmentGrid.offsetTop - 80, behavior: 'smooth'});
            });
            paginationContainer.appendChild(nextBtn);
        }
    }
    
    filterEquipment();
    
    window.filterEquipment = filterEquipment;
});