<template>
  <div class="cart-page">
    <div class="cart-shell">
      <div class="cart-header">
        <div>
          <p class="eyebrow">Compra</p>
          <h1>Carrito de compras</h1>
        </div>
        <button class="secondary-btn" @click="$router.push('/products')">Seguir comprando</button>
      </div>

      <div class="cart-layout">
        <section class="items-panel">
          <div class="panel-header">
            <h2>Productos seleccionados</h2>
            <span class="chip">{{ cartItems.length }} artículos</span>
          </div>

          <div v-if="cartItems.length === 0" class="empty-state">
            Tu carrito está vacío.
          </div>

          <div v-else class="cart-items">
            <article v-for="item in cartItems" :key="item.id" class="cart-item">
              <div class="thumb" :style="{ background: item.color }">{{ item.emoji }}</div>

              <div class="info">
                <h3>{{ item.name }}</h3>
                <small>{{ item.category }}</small>
              </div>

              <div class="qty-box">
                <button>-</button>
                <span>{{ item.quantity }}</span>
                <button>+</button>
              </div>

              <div class="price-box">
                <strong>{{ formatCOP(item.price * item.quantity) }}</strong>
              </div>
            </article>
          </div>
        </section>

        <aside class="summary-panel">
          <div class="panel-header">
            <h2>Resumen</h2>
          </div>

          <div class="summary-row">
            <span>Subtotal</span>
            <strong>{{ formatCOP(subtotal) }}</strong>
          </div>
          <div class="summary-row">
            <span>Envío</span>
            <strong>{{ formatCOP(0) }}</strong>
          </div>
          <div class="summary-row discount">
            <span>Descuento</span>
            <strong>-{{ formatCOP(0) }}</strong>
          </div>

          <div class="total-row">
            <span>Total</span>
            <strong>{{ formatCOP(subtotal) }}</strong>
          </div>

          <button class="primary-btn">Finalizar compra</button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [
        { id: 1, name: 'Leche Entera', category: 'Lácteos', price: 18.9, quantity: 2, color: '#E0F2FE', emoji: '🥛' },
        { id: 2, name: 'Pan Integral', category: 'Panadería', price: 21.2, quantity: 1, color: '#FDE68A', emoji: '🍞' },
        { id: 4, name: 'Manzana Roja', category: 'Frutas', price: 9.5, quantity: 3, color: '#FECACA', emoji: '🍎' }
      ]
    }
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }
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
    }
  }
}
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px 60px;
}

.cart-shell {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 24px;
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.08);
  padding: 24px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
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

h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.7rem);
  color: #0f172a;
}

.secondary-btn,
.primary-btn,
.qty-box button {
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.secondary-btn {
  background: #e2e8f0;
  color: #0f172a;
  padding: 10px 14px;
  font-weight: 700;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.9fr);
  gap: 24px;
}

.items-panel,
.summary-panel {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  padding: 20px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.panel-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
}

.chip {
  display: inline-flex;
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 700;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cart-item {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) 120px 100px;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #e2e8f0;
}

.thumb {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.info h3 {
  margin: 0 0 4px;
  font-size: 1rem;
  color: #0f172a;
}

.info small {
  color: #64748b;
}

.qty-box {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px;
  width: 110px;
}

.qty-box button {
  width: 28px;
  height: 28px;
  background: #e2e8f0;
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 700;
}

.qty-box span {
  font-weight: 700;
  color: #0f172a;
}

.price-box {
  text-align: right;
  color: #0f172a;
  font-size: 1rem;
}

.summary-row,
.total-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #475569;
  margin-bottom: 12px;
}

.discount {
  color: #16a34a;
}

.total-row {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  font-size: 1.1rem;
  color: #0f172a;
  font-weight: 800;
}

.primary-btn {
  width: 100%;
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: white;
  padding: 12px 14px;
  font-weight: 700;
  margin-top: 18px;
}

.empty-state {
  padding: 24px 16px;
  border-radius: 14px;
  text-align: center;
  background: #f8fafc;
  color: #64748b;
  border: 1px dashed #cbd5e1;
}

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .cart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cart-item {
    grid-template-columns: 52px minmax(0, 1fr);
  }

  .qty-box,
  .price-box {
    grid-column: 2;
    justify-self: end;
  }
}
</style>
