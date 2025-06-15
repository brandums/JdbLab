// Datos de los equipos
const equipmentData = [
    // Equipos JDBLab (Física)
    {
        id: 1,
        name: "Kit de Óptica Básica",
        description: "Kit completo para experimentos de óptica geométrica y física ondulatoria.",
        imageUrl: "img/banner.jpg",
        category: "jdb",
        subcategory: "fisica1",
        specs: ["Incluye lentes, prismas y soportes", "Manual de experimentos incluido"],
        features: ["Ideal para laboratorios educativos", "Materiales duraderos"]
    },
    {
        id: 2,
        name: "Banco Óptico Profesional",
        description: "Sistema completo para estudios avanzados de óptica con láser.",
        imageUrl: "img/banner.jpg",
        category: "jdb",
        subcategory: "fisica2",
        specs: ["Precisión de 0.1mm", "Incluye fuente láser"],
        features: ["Para nivel universitario", "Certificado de calibración"]
    },
    {
        id: 3,
        name: "Sistema de Electrónica Básica",
        description: "Set completo para prácticas de circuitos eléctricos y electrónicos.",
        imageUrl: "img/banner.jpg",
        category: "jdb",
        subcategory: "fisica3",
        specs: ["Incluye multímetro digital", "Más de 50 componentes"],
        features: ["Manual con 20 experimentos", "Seguridad certificada"]
    },
    
    // Equipos TecnoEquip (Ingeniería Civil)
    {
    id: 4,
    name: "Penetrómetro Dinámico",
    description: "Equipo profesional para ensayos de penetración dinámica estándar (DPL/DPM) en estudios de suelos.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "suelos-campo",
    specs: [
        "Capacidad de impacto: 100 kN",
        "Precisión de medición: ±1%",
        "Peso del martillo: 63.5 kg",
        "Altura de caída: 76 cm",
        "Longitud de varilla: 1 metro (modular)",
        "Material: acero aleado reforzado"
    ],
    features: [
        "Portátil y fácil de ensamblar en campo",
        "Robusta construcción para terrenos difíciles",
        "Compatible con normas ASTM D1586 y ISO 22476",
        "Incluye sistema de registro manual o electrónico",
        "Mango ergonómico y base estabilizadora",
        "Maletín de transporte reforzado incluido"
    ]
}
,
    {
        id: 5,
        name: "Compactador Proctor",
        description: "Para determinación de la densidad máxima y humedad óptima de suelos.",
        imageUrl: "img/banner.jpg",
        category: "tecno",
        subcategory: "suelos-lab",
        specs: ["Motor: 1/2 HP", "Velocidad: 30 golpes/min"],
        features: ["Norma AASHTO T99", "Incluye moldes"]
    },
    {
        id: 6,
        name: "Máquina de Ensayos Universales",
        description: "Sistema multipropósito para ensayos de compresión, tracción y flexión.",
        imageUrl: "img/banner.jpg",
        category: "tecno",
        subcategory: "concreto",
        specs: ["Capacidad: 2000 kN", "Control digital"],
        features: ["Software incluido", "Certificación ISO"]
    },
    {
        id: 7,
        name: "Viscosímetro Saybolt",
        description: "Para determinación de la viscosidad de asfaltos y derivados.",
        imageUrl: "img/banner.jpg",
        category: "tecno",
        subcategory: "asfalto",
        specs: ["Rango: 30-1000 cSt", "Precisión ±2%"],
        features: ["Baño termostático incluido", "Norma ASTM D88"]
    },
    {
        id: 8,
        name: "Horno de Secado",
        description: "Para determinación de contenido de humedad en materiales de construcción.",
        imageUrl: "img/banner.jpg",
        category: "tecno",
        subcategory: "general",
        specs: ["Capacidad: 200L", "Rango: 40-250°C"],
        features: ["Control digital PID", "Certificado de calibración"]
    },
    {
    id: 16,
    name: "Núcleo para Extracción de Muestras",
    description: "Equipo manual para extraer muestras inalteradas de suelos.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "suelos-campo",
    specs: ["Diámetro: 4\"", "Material: acero inoxidable"],
    features: ["Fácil transporte", "Alta resistencia"]
},
{
    id: 17,
    name: "Tamizadora Eléctrica",
    description: "Sistema vibratorio para análisis granulométrico de agregados.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "agregado",
    specs: ["Capacidad: 8 tamices", "Motor 1/3 HP"],
    features: ["Temporizador incorporado", "Norma ASTM C136"]
},
{
    id: 18,
    name: "Prensa para Cemento",
    description: "Para ensayos de resistencia a la compresión de morteros.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "cemento",
    specs: ["Capacidad: 500 kN", "Pantalla digital"],
    features: ["Norma EN 196", "Alta precisión"]
},
{
    id: 19,
    name: "Cámara Climática",
    description: "Para curado controlado de muestras de concreto.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "concreto",
    specs: ["Rango: 10-50°C", "Humedad: 90-100%"],
    features: ["Control de temperatura/humedad", "Puerta doble acrílica"]
},
{
    id: 20,
    name: "Balanza de Precisión",
    description: "Balanza digital para laboratorio de suelos y agregados.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "general",
    specs: ["Precisión: 0.01 g", "Capacidad: 5 kg"],
    features: ["Calibración automática", "Pantalla retroiluminada"]
},
{
    id: 21,
    name: "Moldes cilíndricos para concreto",
    description: "Moldes reutilizables para probetas de compresión.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "concreto",
    specs: ["Dimensión: Ø150x300 mm", "Material: acero pintado"],
    features: ["Abertura rápida", "Cumple norma ASTM"]
},
{
    id: 22,
    name: "Extractor de núcleos rotatorio",
    description: "Para toma de muestras cilíndricas de pavimento asfáltico.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "asfalto",
    specs: ["Diámetro: 2 a 6\"", "Motor gasolina 5 HP"],
    features: ["Sistema de enfriamiento", "Base estabilizadora"]
},
{
    id: 23,
    name: "Horno para asfalto",
    description: "Para determinación del contenido de asfalto por ignición.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "asfalto",
    specs: ["Temperatura máx: 600°C", "Sensor de humo"],
    features: ["Control automático", "Norma AASHTO T308"]
},
{
    id: 24,
    name: "Medidor de humedad de suelos",
    description: "Dispositivo digital portátil para humedad en campo.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "suelos-campo",
    specs: ["Rango: 0–50%", "Pantalla LCD"],
    features: ["Lectura instantánea", "Portátil y recargable"]
},
{
    id: 25,
    name: "Set de corte directo",
    description: "Equipo para análisis de resistencia al corte de suelos.",
    imageUrl: "img/banner.jpg",
    category: "tecno",
    subcategory: "suelos-lab",
    specs: ["Carga: hasta 2 kN", "Velocidad variable"],
    features: ["Celdas de acero inoxidable", "Sistema digital de medición"]
}

];