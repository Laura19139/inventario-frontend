<template>
  <div class="products-page">
    <div class="products-header">
      <div>
        <p class="eyebrow">Inventario</p>
        <h1>Productos</h1>
      </div>

      <div class="toolbar">
        <input v-model="search" type="text" placeholder="Buscar producto..." />
        <select v-model="category">
          <option v-for="option in categories" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div class="catalog-main">
      <div v-if="loading" class="loading">Cargando productos...</div>

      <div v-else class="product-grid">
        <article v-for="product in products" :key="product.id" class="product-card">
          <div class="thumb" :style="{ background: product.color }">
            <span>{{ product.emoji }}</span>
          </div>

          <div class="content">
            <div class="meta-row">
              <span class="badge">{{ product.category }}</span>
              <span class="sku">{{ product.sku }}</span>
            </div>

            <h3>{{ product.name }}</h3>

            <div class="stats">
              <div>
                <small>Precio</small>
                <strong>{{ formatCOP(product.price) }}</strong>
              </div>
              <div>
                <small>Stock</small>
                <strong>{{ product.stock }}</strong>
              </div>
            </div>

            <button class="action-btn">Ver detalle</button>
          </div>
        </article>
      </div>

      <div v-if="!loading" class="pagination">
        <button :disabled="page === 1" @click="goToPage(page - 1)">Anterior</button>
        <span>Página {{ page }} / {{ totalPages }}</span>
        <button :disabled="page === totalPages" @click="goToPage(page + 1)">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchProducts } from '../services/products'

export default {
  data() {
    return {
      loading: true,
      products: [],
      search: '',
      category: 'Todos',
      categories: ['Todos'],
      page: 1,
      pageSize: 8,
      totalPages: 1,
      total: 0
    }
  },
  watch: {
    search() {
      this.page = 1
      this.loadProducts()
    },
    category() {
      this.page = 1
      this.loadProducts()
    }
  },
  mounted() {
    this.loadProducts()
  },
  methods: {
    formatCOP(value) {
      const rounded = Math.round(Number(value) || 0)
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(rounded)
    },
    async loadProducts() {
      this.loading = true
      try {
        const result = await fetchProducts({
          page: this.page,
          pageSize: this.pageSize,
          search: this.search,
          category: this.category
        })

        this.products = result.items
        this.total = result.total
        this.totalPages = result.totalPages
        this.categories = result.categories
      } finally {
        this.loading = false
      }
    },
    goToPage(nextPage) {
      if (nextPage < 1 || nextPage > this.totalPages) return
      this.page = nextPage
      this.loadProducts()
    }
  }
}
</script>

<style scoped>
.products-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 16px 60px;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

.eyebrow.small {
  margin-bottom: 4px;
  font-size: 10px;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.7rem);
  color: #0f172a;
}

.toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar input,
.toolbar select {
  border: 1px solid #dfe7f1;
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  min-width: 180px;
  font-size: 14px;
  color: #0f172a;
}

.catalog-main {
  min-width: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(148,163,184,0.2);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.12);
}

.thumb {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.2rem;
}

.content {
  padding: 18px 18px 20px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.badge {
  display: inline-flex;
  background: #e2e8f0;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #334155;
}

.sku {
  font-size: 11px;
  color: #64748b;
}

h3 {
  margin: 0 0 14px;
  font-size: 1.1rem;
  color: #0f172a;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.stats small {
  display: block;
  margin-bottom: 4px;
  color: #64748b;
}

.stats strong {
  font-size: 1rem;
  color: #0f172a;
}

.action-btn {
  width: 100%;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #38bdf8, #0284c7);
  color: white;
  padding: 10px 12px;
  font-weight: 700;
  cursor: pointer;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 28px;
}

.pagination button {
  border: 1px solid #cbd5e1;
  background: white;
  color: #0f172a;
  border-radius: 10px;
  padding: 9px 14px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 40px 0;
  color: #475569;
}

@media (max-width: 600px) {
  .products-header {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar {
    width: 100%;
  }

  .toolbar input,
  .toolbar select {
    width: 100%;
  }
}
</style>
