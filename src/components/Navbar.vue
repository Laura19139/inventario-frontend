<template>
    <nav class="navbar">
        <h2 class="logo">Inventario</h2>

        <div class="links">
            <router-link to="/products" class="nav-link">Productos</router-link>

            <template v-if="!isLoggedIn">
                <router-link to="/" class="nav-link">Login</router-link>
                <router-link to="/register" class="nav-link">Registro</router-link>
            </template>

            <template v-else>
                <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
                <router-link to="/users" class="nav-link">Usuarios</router-link>
            </template>

            <div class="cart-menu" @mouseenter="showCartPreview" @mouseleave="hideCartPreview">
                <router-link to="/cart" class="nav-link cart-link">
                    <span class="cart-icon">🛒</span>
                    <span>Carrito</span>
                </router-link>

                <div v-if="cartPreviewVisible" class="cart-preview">
                    <div v-if="cartItems.length === 0" class="preview-empty">Carrito vacío</div>

                    <template v-else>
                        <div v-for="item in cartItems" :key="item.id" class="preview-item">
                            <span class="preview-emoji">{{ item.emoji }}</span>
                            <div class="preview-copy">
                                <strong>{{ item.name }}</strong>
                                <small>{{ item.quantity }} x ${{ item.price.toFixed(2) }}</small>
                            </div>
                            <span class="preview-total">${{ (item.quantity * item.price).toFixed(2) }}</span>
                        </div>

                        <div class="preview-footer">
                            <span>Total</span>
                            <strong>${{ subtotal.toFixed(2) }}</strong>
                        </div>
                    </template>
                </div>
            </div>

            <template v-if="isLoggedIn">
                <a href="#" class="nav-link logout-link" @click.prevent="logout">Cerrar sesión</a>
            </template>
        </div>
    </nav>
</template>

<script>
import { getCurrentSession, logoutCurrent } from '../services/api'

export default {
    data() {
        return {
            isLoggedIn: !!getCurrentSession(),
            cartPreviewVisible: false,
            cartItems: [
                { id: 1, name: 'Leche Entera', quantity: 1, price: 18.9, emoji: '🥛' },
                { id: 2, name: 'Pan Integral', quantity: 2, price: 21.2, emoji: '🍞' },
                { id: 3, name: 'Manzana Roja', quantity: 3, price: 9.5, emoji: '🍎' }
            ]
        }
    },
    computed: {
        subtotal() {
            return this.cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
        }
    },
    created() {
        this.refreshSession()
        window.addEventListener('storage', this.refreshSession)
        window.addEventListener('session-changed', this.refreshSession)
    },
    beforeUnmount() {
        window.removeEventListener('storage', this.refreshSession)
        window.removeEventListener('session-changed', this.refreshSession)
    },
    methods: {
        refreshSession() {
            this.isLoggedIn = !!getCurrentSession()
        },
        showCartPreview() {
            this.cartPreviewVisible = true
        },
        hideCartPreview() {
            this.cartPreviewVisible = false
        },
        logout() {
            logoutCurrent()
            this.refreshSession()
            this.$router.push('/')
        }
    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1e293b;
    padding: 15px 30px;
    color: white;
}

.logo {
    font-size: 20px;
    font-weight: bold;
}

.links {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
}

.nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s ease, transform 0.2s ease;
}

.nav-link:hover {
    color: #7dd3fc;
    transform: translateY(-1px);
}

.nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 100%;
    height: 2px;
    background: #38bdf8;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.2s ease;
}

.nav-link:hover::after,
.router-link-active::after {
    transform: scaleX(1);
}

.router-link-active {
    color: #7dd3fc;
}

.logout-link {
    color: #fca5a5;
}

.cart-menu {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.cart-link {
    font-weight: 700;
    margin-left: auto;
}

.cart-icon {
    font-size: 1.1rem;
}

.cart-preview {
    position: absolute;
    top: calc(100% + 14px);
    right: 0;
    width: 310px;
    background: rgba(15, 23, 42, 0.96);
    border: 1px solid rgba(148, 163, 184, 0.25);
    border-radius: 16px;
    box-shadow: 0 18px 35px rgba(15, 23, 42, 0.28);
    padding: 14px;
    color: white;
    z-index: 20;
}

.preview-item {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.preview-emoji {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: rgba(56, 189, 248, 0.15);
}

.preview-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.preview-copy strong {
    font-size: 0.82rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.preview-copy small {
    color: #cbd5e1;
}

.preview-total {
    font-size: 0.8rem;
    font-weight: 700;
    color: #7dd3fc;
}

.preview-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid rgba(148, 163, 184, 0.18);
    font-size: 0.9rem;
}

.preview-empty {
    text-align: center;
    color: #cbd5e1;
    padding: 10px 0 4px;
}

</style>