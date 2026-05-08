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
        
        // Transformamos los datos para mantener la estructura esperada
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
        // Fallback a categorías hardcodeadas en caso de error
        return [
            { categoria: 'jdb', categoriaNombre: '🧪 Equipos JDBLab (Física)', subcategoria: 'fisica1', subcategoriaNombre: 'Física I', orden: 1 },
            { categoria: 'jdb', categoriaNombre: '🧪 Equipos JDBLab (Física)', subcategoria: 'fisica2', subcategoriaNombre: 'Física II', orden: 2 },
            { categoria: 'jdb', categoriaNombre: '🧪 Equipos JDBLab (Física)', subcategoria: 'fisica3', subcategoriaNombre: 'Física III', orden: 3 },
            { categoria: 'tecno', categoriaNombre: '🏗️ Equipos TecnoEquip (Ingeniería Civil)', subcategoria: 'suelos-campo', subcategoriaNombre: 'Suelos de Campo', orden: 1 },
            { categoria: 'tecno', categoriaNombre: '🏗️ Equipos TecnoEquip (Ingeniería Civil)', subcategoria: 'suelos-lab', subcategoriaNombre: 'Suelos de Laboratorio', orden: 2 },
            { categoria: 'tecno', categoriaNombre: '🏗️ Equipos TecnoEquip (Ingeniería Civil)', subcategoria: 'asfalto', subcategoriaNombre: 'Asfalto', orden: 3 },
            { categoria: 'tecno', categoriaNombre: '🏗️ Equipos TecnoEquip (Ingeniería Civil)', subcategoria: 'concreto', subcategoriaNombre: 'Concreto', orden: 4 },
            { categoria: 'tecno', categoriaNombre: '🏗️ Equipos TecnoEquip (Ingeniería Civil)', subcategoria: 'cemento', subcategoriaNombre: 'Cemento', orden: 5 },
            { categoria: 'tecno', categoriaNombre: '🏗️ Equipos TecnoEquip (Ingeniería Civil)', subcategoria: 'agregado', subcategoriaNombre: 'Agregado', orden: 6 },
            { categoria: 'tecno', categoriaNombre: '🏗️ Equipos TecnoEquip (Ingeniería Civil)', subcategoria: 'general', subcategoriaNombre: 'Equipo General', orden: 7 }
        ];
    }
}

// Generar tabs de categorías dinámicamente
function generarCategoryTabs(categorias) {
    const categoryTabsContainer = document.querySelector('.category-tabs');
    if (!categoryTabsContainer) {
        console.error('No se encontró .category-tabs');
        return;
    }
    
    categoryTabsContainer.innerHTML = '';
    
    // Agregar botón "Todos"
    const allTab = document.createElement('button');
    allTab.className = 'category-tab';
    allTab.dataset.category = 'all';
    allTab.textContent = '📋 Todos los Equipos';
    categoryTabsContainer.appendChild(allTab);
    
    // Obtener categorías únicas
    const categoriasUnicas = [...new Map(categorias.map(item => [item.categoria, item])).values()];
    
    categoriasUnicas.forEach((cat, index) => {
        const tab = document.createElement('button');
        tab.className = `category-tab ${index === 0 ? 'active' : ''}`;
        tab.dataset.category = cat.categoria;
        tab.textContent = cat.categoriaNombre;
        categoryTabsContainer.appendChild(tab);
    });
    
    // Si hay categorías, activar la primera
    if (categoriasUnicas.length > 0) {
        allTab.classList.remove('active');
        const firstTab = categoryTabsContainer.querySelector('.category-tab:not([data-category="all"])');
        if (firstTab) firstTab.classList.add('active');
    }
}

// Generar filtros de subcategorías dinámicamente
function generarSubcategoryFilters(categorias) {
    const subcategoryFiltersContainer = document.querySelector('.subcategory-filters');
    if (!subcategoryFiltersContainer) {
        console.error('No se encontró .subcategory-filters');
        return;
    }
    
    subcategoryFiltersContainer.innerHTML = '';
    
    // Agrupar por categoría
    const categoriaAgrupada = categorias.reduce((acc, cat) => {
        if (!acc[cat.categoria]) {
            acc[cat.categoria] = [];
        }
        acc[cat.categoria].push(cat);
        return acc;
    }, {});
    
    // Crear grupos de filtros para cada categoría
    Object.keys(categoriaAgrupada).forEach((catKey, index) => {
        const filterGroup = document.createElement('div');
        filterGroup.className = `filter-group ${catKey}-filters ${index === 0 ? 'active' : ''}`;
        
        // Botón "Todos"
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.dataset.subcategory = `all-${catKey}`;
        allBtn.textContent = 'Todos';
        filterGroup.appendChild(allBtn);
        
        // Ordenar subcategorías por orden
        const subcategorias = categoriaAgrupada[catKey].sort((a, b) => a.orden - b.orden);
        
        // Crear botones de subcategorías
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

// Función auxiliar para obtener nombre de subcategoría
function getSubcategoryName(subcategory) {
    const subcat = categoriasData.find(c => c.subcategoria === subcategory);
    return subcat ? subcat.subcategoriaNombre : subcategory;
}

// Función auxiliar para obtener nombre de categoría
function getCategoryName(category) {
    const cat = categoriasData.find(c => c.categoria === category);
    return cat ? cat.categoriaNombre : category;
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando carga de equipos...');
    
    try {
        // Cargar datos del backend
        console.log('📡 Cargando categorías...');
        categoriasData = await getCategorias();
        console.log('✅ Categorías cargadas:', categoriasData.length);
        
        console.log('📡 Cargando productos...');
        equipmentData = await getEquipmentData();
        console.log('✅ Productos cargados:', equipmentData.length);
        
        // Generar UI dinámica
        generarCategoryTabs(categoriasData);
        generarSubcategoryFilters(categoriasData);
        
    } catch (error) {
        console.error('❌ Error en la inicialización:', error);
    }
    
    // Elementos del DOM
    const categoryTabsContainer = document.querySelector('.category-tabs');
    const subcategoryFiltersContainer = document.querySelector('.subcategory-filters');
    const equipmentGrid = document.getElementById('equipment-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    const searchInput = document.getElementById('equipment-search');
    const paginationContainer = document.getElementById('pagination');
    
    // Variables de estado
    let currentPage = 1;
    const itemsPerPage = 12;
    
    // Manejar clic en pestañas de categoría (usar delegación de eventos)
    if (categoryTabsContainer) {
        categoryTabsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('category-tab')) {
                currentPage = 1;
                
                // Actualizar tabs
                categoryTabsContainer.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const category = e.target.dataset.category;
                
                // Mostrar/ocultar filtros de subcategoría
                document.querySelectorAll('.filter-group').forEach(group => {
                    group.classList.remove('active');
                });
                
                if (category !== 'all') {
                    const targetGroup = document.querySelector(`.${category}-filters`);
                    if (targetGroup) {
                        targetGroup.classList.add('active');
                        // Activar el botón "Todos" de esta categoría
                        targetGroup.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                        const allBtn = targetGroup.querySelector('.filter-btn[data-subcategory^="all"]');
                        if (allBtn) allBtn.classList.add('active');
                    }
                }
                
                filterEquipment();
            }
        });
    }
    
    // Manejar clic en botones de filtro (delegación de eventos)
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
    
    // Buscador
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentPage = 1;
            filterEquipment();
        });
    }
    
    // Función para filtrar y mostrar equipos
    function filterEquipment() {
        const activeCategoryTab = document.querySelector('.category-tab.active');
        const activeCategory = activeCategoryTab ? activeCategoryTab.dataset.category : 'all';
        
        const activeSubcategoryBtn = document.querySelector('.filter-group.active .filter-btn.active');
        const activeSubcategory = activeSubcategoryBtn ? activeSubcategoryBtn.dataset.subcategory : '';
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        let filteredEquipment = equipmentData;
        
        // Filtrar por categoría
        if (activeCategory && activeCategory !== 'all') {
            filteredEquipment = filteredEquipment.filter(equip => equip.category === activeCategory);
        }
        
        // Filtrar por subcategoría
        if (activeCategory && activeCategory !== 'all' && activeSubcategory && !activeSubcategory.startsWith('all')) {
            filteredEquipment = filteredEquipment.filter(equip => equip.subcategory === activeSubcategory);
        }
        
        // Filtrar por búsqueda
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
                    <h3 class="equipment-name" style="cursor: pointer;" onclick="window.location.href='equipmentView.html?id=${equip.id}'">${equip.name}</h3>
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
            prevBtn.innerHTML = '&laquo; Anterior';
            prevBtn.addEventListener('click', () => {
                currentPage--;
                filterEquipment();
                window.scrollTo({top: equipmentGrid.offsetTop - 100, behavior: 'smooth'});
            });
            paginationContainer.appendChild(prevBtn);
        }
        
        for (let i = 1; i <= pageCount; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                filterEquipment();
                window.scrollTo({top: equipmentGrid.offsetTop - 100, behavior: 'smooth'});
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        if (currentPage < pageCount) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'pagination-btn';
            nextBtn.innerHTML = 'Siguiente &raquo;';
            nextBtn.addEventListener('click', () => {
                currentPage++;
                filterEquipment();
                window.scrollTo({top: equipmentGrid.offsetTop - 100, behavior: 'smooth'});
            });
            paginationContainer.appendChild(nextBtn);
        }
    }
    
    // Iniciar filtrado (se ejecutará cuando los datos estén listos)
    filterEquipment();
});