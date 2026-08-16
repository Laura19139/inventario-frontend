<template>
    <div class="container">
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                <h2>Dashboard</h2>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="btn secondary" @click="$router.push('/users')">Usuarios</button>
                    <button class="btn" @click="logout">Cerrar sesión</button>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-top:16px;">
                <div class="card">
                    <h4>Sesión activa</h4>
                    <div v-if="current">
                        <p><strong>{{ current.name }}</strong></p>
                        <p class="muted">{{ current.username }}</p>
                    </div>
                    <div v-else>
                        <p>No hay sesión activa</p>
                    </div>
                </div>

                <div class="card">
                    <h4>Sesiones guardadas</h4>
                    <p style="font-size:20px; margin:8px 0;">{{ sessionsCount }}</p>
                </div>

                <div class="card">
                    <h4>Sesiones quemadas</h4>
                    <p style="font-size:20px; margin:8px 0;">{{ burned }}</p>
                </div>
            </div>

            <div style="margin-top:18px;">
                <h4>Historial</h4>
                <div v-if="sessions.length === 0">No hay sesiones guardadas.</div>
                <ul>
                    <li v-for="s in sessions" :key="s.id">
                        <strong>{{ s.username }}</strong> — {{ new Date(s.createdAt).toLocaleString() }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { getCurrentSession, getSessions, getSessionsCount, getBurnedCount, logoutCurrent } from "../services/api";

export default {
    data() {
        return {
            current: null,
            sessions: [],
            sessionsCount: 0,
            burned: 0
        };
    },
    created() {
        this.refresh();
    },
    methods: {
        refresh() {
            this.current = getCurrentSession();
            this.sessions = getSessions().reverse();
            this.sessionsCount = getSessionsCount();
            this.burned = getBurnedCount();
        },
        logout() {
            logoutCurrent();
            this.$router.push('/');
        }
    }
};
</script>

<style scoped>
.card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    max-width: 700px;
    margin: 50px auto;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
}

.btn {
    background: #ef4444;
    color: white;
}

.btn.secondary {
    background: #0ea5e9;
    color: white;
}
</style>
