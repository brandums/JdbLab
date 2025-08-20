// equipment-data.js
let equipmentData = [];

async function fetchEquipmentData() {
    try {
        const response = await fetch('https://jdb-backend.fly.dev/api/products');
        if (!response.ok) throw new Error('Error al cargar equipos');
        
        const data = await response.json();
        
        // Transformamos los datos para mantener la estructura esperada
        return data.map(item => ({
            id: Number(item.id),
            name: item.name,
            description: item.description,
            imageUrl: item.imageUrl
                    ? (item.imageUrl.startsWith('http') ? item.imageUrl : `img/${item.imageUrl}`)
                    : 'img/noimage.avif',

            category: item.category.toLowerCase(), // Aseguramos minúsculas
            subcategory: item.subcategory,
            specs: Array.isArray(item.specs) ? item.specs : JSON.parse(item.specs),
            features: Array.isArray(item.features) ? item.features : JSON.parse(item.features),
            price: item.price
        }));
    } catch (error) {
        console.error('Error fetching equipment data:', error);
        return []; // Retornamos array vacío como fallback
    }
}

// Cargamos los datos inmediatamente y exponemos una promesa
const equipmentDataPromise = fetchEquipmentData()
    .then(data => equipmentData = data);

// Para usar en equipment.js: await getEquipmentData()
async function getEquipmentData() {
    return equipmentData.length ? equipmentData : await equipmentDataPromise;
}