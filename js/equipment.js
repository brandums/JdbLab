document.addEventListener('DOMContentLoaded', async function() {
    equipmentData = await getEquipmentData();
    // Elementos del DOM
    const categoryTabs = document.querySelectorAll('.category-tab');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const equipmentGrid = document.getElementById('equipment-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    const searchInput = document.getElementById('equipment-search');
    const paginationContainer = document.getElementById('pagination');
    
    // Variables de estado
    let currentPage = 1;
    const itemsPerPage = 12;
    
    // Mostrar grupo de filtros solo cuando no es "Todos"
    document.querySelector('.jdb-filters').classList.remove('active');
    document.querySelector('.tecno-filters').classList.remove('active');
    
    // Manejar clic en pestañas de categoría
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            currentPage = 1; // Resetear a primera página
            
            // Actualizar pestaña activa
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar/ocultar filtros correspondientes
            const category = this.dataset.category;
            document.querySelectorAll('.filter-group').forEach(group => {
                group.classList.remove('active');
            });
            
            if (category === 'jdb') {
                document.querySelector('.jdb-filters').classList.add('active');
            } else if (category === 'tecno') {
                document.querySelector('.tecno-filters').classList.add('active');
            } // "all" no muestra filtros
            
            // Resetear filtros
            filterBtns.forEach(btn => btn.classList.remove('active'));
            if (category !== 'all') {
                document.querySelector(`.filter-group.active .filter-btn[data-subcategory^="all"]`).classList.add('active');
            }
            
            // Filtrar equipos
            filterEquipment();
        });
    });
    
    // Manejar clic en botones de filtro
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentPage = 1; // Resetear a primera página
            const filterGroup = this.closest('.filter-group');
            
            // Solo un botón activo por grupo
            filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar equipos
            filterEquipment();
        });
    });
    
    // Buscador
    searchInput.addEventListener('input', function() {
        currentPage = 1;
        filterEquipment();
    });
    
    // Función para filtrar y mostrar equipos
    function filterEquipment() {
        const activeCategory = document.querySelector('.category-tab.active').dataset.category;
        const activeSubcategory = document.querySelector('.filter-group.active .filter-btn.active')?.dataset.subcategory || '';
        const searchTerm = searchInput.value.toLowerCase();
        
        // Filtrar equipos
        let filteredEquipment = equipmentData;
        
        // Filtrar por categoría
        if (activeCategory !== 'all') {
            filteredEquipment = filteredEquipment.filter(equip => equip.category === activeCategory);
        }
        
        // Filtrar por subcategoría (si hay filtros activos)
        if (activeCategory !== 'all' && !activeSubcategory.startsWith('all')) {
            filteredEquipment = filteredEquipment.filter(equip => equip.subcategory === activeSubcategory);
        }
        
        // Filtrar por búsqueda
        if (searchTerm) {
            filteredEquipment = filteredEquipment.filter(equip => 
                equip.name.toLowerCase().includes(searchTerm) || 
                equip.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Mostrar resultados con paginación
        displayEquipment(filteredEquipment);
        setupPagination(filteredEquipment);
    }
    
    // Función para mostrar equipos en el grid con paginación
    function displayEquipment(equipments) {
        equipmentGrid.innerHTML = '';
        
        if (equipments.length === 0) {
            noResults.style.display = 'block';
            resultsCount.textContent = '0';
            paginationContainer.innerHTML = '';
            return;
        }
        
        noResults.style.display = 'none';
        resultsCount.textContent = equipments.length;
        
        // Calcular índices para paginación
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, equipments.length);
        const paginatedItems = equipments.slice(startIndex, endIndex);
        
        // Mostrar equipos de la página actual
        paginatedItems.forEach(equip => {
            const categoryName = equip.category === 'jdb' ? 'JDBLab (Física)' : 'TecnoEquip (Ing. Civil)';
            const subcategoryName = getSubcategoryName(equip.subcategory);
            
            const card = document.createElement('div');
            card.className = 'equipment-card';
            card.innerHTML = `
                <div class="equipment-image" onclick="window.location.href='equipmentView.html?id=${equip.id}'">
                    <img src="${equip.imageUrl}" alt="${equip.name}">
                </div>
                <div class="equipment-info">
                    <span class="equipment-category">${categoryName} • ${subcategoryName}</span>
                    <h3 class="equipment-name">${equip.name}</h3>
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
    
    // Configurar paginación
    function setupPagination(equipments) {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(equipments.length / itemsPerPage);
        
        if (pageCount <= 1) return;
        
        // Botón Anterior
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
        
        // Números de página
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
        
        // Botón Siguiente
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
    
    // Función para obtener nombre legible de subcategoría
    function getSubcategoryName(subcategory) {
        const names = {
            'fisica1': 'Física I',
            'fisica2': 'Física II',
            'fisica3': 'Física III',
            'suelos-campo': 'Suelos Campo',
            'suelos-lab': 'Suelos Lab',
            'asfalto': 'Asfalto',
            'concreto': 'Concreto',
            'cemento': 'Cemento',
            'agregado': 'Agregado',
            'general': 'General'
        };
        
        return names[subcategory] || subcategory;
    }
    
    // Mostrar todos los equipos al cargar
    filterEquipment();
});