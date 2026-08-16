const PRODUCTS_MOCK = [
    { id: 1, name: 'Leche Entera', category: 'Lácteos', price: 18.9, stock: 24, sku: 'LT-001', color: '#E0F2FE', emoji: '🥛' },
    { id: 2, name: 'Yogur Natural', category: 'Lácteos', price: 14.5, stock: 36, sku: 'YN-014', color: '#DCFCE7', emoji: '🥣' },
    { id: 3, name: 'Queso Fresco', category: 'Lácteos', price: 32.4, stock: 18, sku: 'QF-022', color: '#FEF3C7', emoji: '🧀' },
    { id: 4, name: 'Pan Integral', category: 'Panadería', price: 21.2, stock: 42, sku: 'PI-204', color: '#FDE68A', emoji: '🍞' },
    { id: 5, name: 'Croissant', category: 'Panadería', price: 12.8, stock: 48, sku: 'CR-118', color: '#FECACA', emoji: '🥐' },
    { id: 6, name: 'Manzana Roja', category: 'Frutas', price: 9.5, stock: 80, sku: 'MR-008', color: '#FECACA', emoji: '🍎' },
    { id: 7, name: 'Plátano', category: 'Frutas', price: 8.7, stock: 65, sku: 'PL-032', color: '#FEF3C7', emoji: '🍌' },
    { id: 8, name: 'Naranja', category: 'Frutas', price: 10.2, stock: 58, sku: 'NR-077', color: '#FED7AA', emoji: '🍊' },
    { id: 9, name: 'Arroz Blanco', category: 'Abarrotes', price: 26.1, stock: 31, sku: 'AB-019', color: '#E2E8F0', emoji: '🍚' },
    { id: 10, name: 'Frijoles Negros', category: 'Abarrotes', price: 23.4, stock: 29, sku: 'FN-042', color: '#DDD6FE', emoji: '🫘' },
    { id: 11, name: 'Aceite de Oliva', category: 'Abarrotes', price: 47.9, stock: 14, sku: 'AO-003', color: '#CFFAFE', emoji: '🫒' },
    { id: 12, name: 'Pasta Rigatoni', category: 'Abarrotes', price: 19.3, stock: 52, sku: 'PR-055', color: '#E2E8F0', emoji: '🍝' },
    { id: 13, name: 'Jabón Líquido', category: 'Hogar', price: 28.6, stock: 22, sku: 'JL-091', color: '#E0F2FE', emoji: '🧼' },
    { id: 14, name: 'Detergente', category: 'Hogar', price: 34.8, stock: 20, sku: 'DT-115', color: '#DBEAFE', emoji: '🧴' },
    { id: 15, name: 'Papel Higiénico', category: 'Hogar', price: 31.1, stock: 16, sku: 'PH-214', color: '#F3E8FF', emoji: '🧻' },
    { id: 16, name: 'Galletas de Avena', category: 'Repostería', price: 16.9, stock: 54, sku: 'GA-302', color: '#FDE68A', emoji: '🍪' },
    { id: 17, name: 'Brownie', category: 'Repostería', price: 22.5, stock: 39, sku: 'BR-401', color: '#F5D0FE', emoji: '🍫' },
    { id: 18, name: 'Agua Mineral', category: 'Bebidas', price: 11.9, stock: 71, sku: 'AM-086', color: '#BAE6FD', emoji: '💧' },
    { id: 19, name: 'Refresco Cola', category: 'Bebidas', price: 15.4, stock: 62, sku: 'RC-106', color: '#BFDBFE', emoji: '🥤' },
    { id: 20, name: 'Jugo de Naranja', category: 'Bebidas', price: 17.6, stock: 48, sku: 'JN-142', color: '#FDE68A', emoji: '🍊' }
]

// TODO: cuando exista el endpoint real del backend, cambiar esto por:
// const response = await fetch('/api/products')
// return response.json()

export async function fetchProducts({ page = 1, pageSize = 8, search = '', category = 'Todos' } = {}) {
    const normalizedSearch = search.trim().toLowerCase()
    const filtered = PRODUCTS_MOCK.filter((product) => {
        const matchesSearch = !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch)
        const matchesCategory = category === 'Todos' || product.category === category
        return matchesSearch && matchesCategory
    })

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * pageSize
    const items = filtered.slice(start, start + pageSize)

    return {
        items,
        total,
        page: safePage,
        pageSize,
        totalPages,
        categories: ['Todos', ...new Set(PRODUCTS_MOCK.map((product) => product.category))]
    }
}

export default PRODUCTS_MOCK
