<template>
    <nav class="navbar">
        <h2 class="logo">Inventario</h2>

        <div class="links">
            <router-link to="/products">Productos</router-link>

            <template v-if="!isLoggedIn">
                <router-link to="/">Login</router-link>
                <router-link to="/register">Registro</router-link>
            </template>

            <template v-else>
                <router-link to="/dashboard">Dashboard</router-link>
                <router-link to="/users">Usuarios</router-link>
                <a href="#" @click.prevent="logout">Cerrar sesión</a>
            </template>
        </div>
    </nav>
</template>

<script>
import { getCurrentSession, logoutCurrent } from '../services/api'

export default {
    data() {
        return {
            isLoggedIn: !!getCurrentSession()
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
}

.links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
}

.links a:hover {
    color: #38bdf8;
}

.router-link-active {
    border-bottom: 2px solid #38bdf8;
}
</style>