<template>
    <div class="users-page">
        <div class="page-header">
            <div>
                <p class="eyebrow">Gestión</p>
                <h1>Usuarios</h1>
            </div>
        </div>

        <div v-if="loading" class="loading">Cargando usuarios...</div>

        <div v-else class="content-grid">
            <section class="panel">
                <div class="panel-header">
                    <h2>Listado de usuarios</h2>
                </div>

                <div class="user-list">
                    <div v-if="users.length === 0" class="empty-state">No hay usuarios registrados.</div>

                    <div v-for="user in users" :key="user.id" class="user-item"
                        :class="{ active: selectedUser && selectedUser.id === user.id }">
                        <div>
                            <strong>{{ user.name }}</strong>
                            <small>{{ user.username }}</small>
                        </div>

                        <div class="user-actions">
                            <button class="secondary" @click="selectUser(user)">Seleccionar</button>
                            <button class="danger" @click="removeUser(user.id)">Eliminar</button>
                        </div>
                    </div>
                </div>

                <div v-if="totalPages > 1" class="pagination">
                    <button :disabled="page === 1" @click="goToPage(page - 1)">Anterior</button>
                    <span>Página {{ page }} / {{ totalPages }}</span>
                    <button :disabled="page === totalPages" @click="goToPage(page + 1)">Siguiente</button>
                </div>
            </section>

            <section class="panel details-panel">
                <div class="panel-header">
                    <h2>Consultar y actualizar</h2>
                </div>

                <div class="search-box">
                    <input v-model="searchId" type="number" min="1" placeholder="Buscar por ID" />
                    <button @click="searchUserById">Buscar</button>
                </div>

                <div v-if="message" class="message success">{{ message }}</div>
                <div v-if="error" class="message error">{{ error }}</div>

                <form v-if="selectedUser || form.id" class="user-form" @submit.prevent="saveUser">
                    <div class="field-group">
                        <label>ID</label>
                        <input v-model="form.id" type="number" disabled />
                    </div>

                    <div class="field-group">
                        <label>Nombre</label>
                        <input v-model="form.name" type="text" required />
                    </div>

                    <div class="field-group">
                        <label>Usuario</label>
                        <input v-model="form.username" type="text" required />
                    </div>

                    <div class="field-group">
                        <label>Correo</label>
                        <input v-model="form.email" type="email" />
                    </div>

                    <div class="field-group">
                        <label>Rol</label>
                        <input v-model="form.role" type="text" />
                    </div>

                    <div class="field-group">
                        <label>Contraseña</label>
                        <input v-model="form.password" type="password" placeholder="Nueva contraseña" />
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="primary">Guardar cambios</button>
                    </div>
                </form>

                <div v-else class="empty-state">Seleccione un usuario para ver su información.</div>
            </section>
        </div>
    </div>
</template>

<script>
import { listUsers, getUserById, updateUser, deleteUser, sanitizeUser } from '../services/users'

const emptyForm = () => ({
    id: '',
    name: '',
    username: '',
    email: '',
    role: '',
    password: ''
})

export default {
    data() {
        return {
            loading: true,
            users: [],
            allUsers: [],
            selectedUser: null,
            searchId: '',
            form: emptyForm(),
            message: '',
            error: '',
            page: 1,
            pageSize: 6,
            totalPages: 1
        }
    },
    mounted() {
        this.loadUsers()
    },
    methods: {
        syncUsersPage() {
            const start = (this.page - 1) * this.pageSize
            const end = start + this.pageSize
            this.users = this.allUsers.slice(start, end)
        },
        normalizeForm(user) {
            const safeUser = sanitizeUser(user || {})

            this.form = {
                id: safeUser?.id ?? '',
                name: safeUser?.name ?? '',
                username: safeUser?.username ?? '',
                email: safeUser?.email ?? '',
                role: safeUser?.role ?? '',
                password: safeUser?.password ? '********' : ''
            }

            this.selectedUser = safeUser
        },
        async loadUsers() {
            this.loading = true
            this.error = ''
            this.message = ''

            try {
                const data = await listUsers()
                this.allUsers = Array.isArray(data) ? data : []
                this.totalPages = Math.max(1, Math.ceil(this.allUsers.length / this.pageSize))

                if (this.page > this.totalPages) {
                    this.page = this.totalPages
                }

                this.syncUsersPage()

                if (this.users.length && !this.selectedUser) {
                    this.normalizeForm(this.users[0])
                } else if (!this.users.length) {
                    this.selectedUser = null
                    this.form = emptyForm()
                }
            } catch (err) {
                this.error = 'No se pudo cargar la lista de usuarios.'
            } finally {
                this.loading = false
            }
        },
        async searchUserById() {
            const rawId = String(this.searchId ?? '').trim()
            const id = Number(rawId)

            if (!rawId || Number.isNaN(id) || id <= 0) {
                this.error = 'Ingrese un identificador válido para consultar el usuario.'
                return
            }

            this.error = ''
            this.message = ''

            try {
                const user = await getUserById(id)
                this.normalizeForm(user)
                this.message = `Usuario con ID ${id} consultado correctamente.`
            } catch (err) {
                this.error = 'No se encontró ningún usuario con ese ID.'
                this.selectedUser = null
                this.form = emptyForm()
            }
        },
        selectUser(user) {
            this.error = ''
            this.message = ''
            this.normalizeForm(user)
        },
        async saveUser() {
            const id = this.form.id

            if (!id) {
                this.error = 'Seleccione un usuario antes de actualizar.'
                return
            }

            this.error = ''
            this.message = ''

            const payload = {
                id: Number(id),
                name: this.form.name,
                username: this.form.username,
                email: this.form.email,
                role: this.form.role,
                ...(this.form.password && this.form.password !== '********' ? { password: this.form.password } : {})
            }

            try {
                const updated = await updateUser(id, payload)
                const current = updated || { ...payload, id: Number(id) }

                this.allUsers = this.allUsers.map((user) => (Number(user.id) === Number(id) ? sanitizeUser({ ...user, ...current }) : user))
                this.totalPages = Math.max(1, Math.ceil(this.allUsers.length / this.pageSize))
                this.syncUsersPage()
                this.normalizeForm(current)
                this.message = 'Usuario actualizado correctamente.'
            } catch (err) {
                this.error = 'No se pudo actualizar el usuario.'
            }
        },
        async removeUser(id) {
            if (!id) return

            const confirmed = window.confirm('¿Confirmas la eliminación de este usuario?')
            if (!confirmed) return

            try {
                await deleteUser(id)
                this.allUsers = this.allUsers.filter((user) => Number(user.id) !== Number(id))
                this.totalPages = Math.max(1, Math.ceil(this.allUsers.length / this.pageSize))

                if (this.page > this.totalPages) {
                    this.page = this.totalPages
                }

                this.syncUsersPage()

                if (this.selectedUser && Number(this.selectedUser.id) === Number(id)) {
                    this.selectedUser = null
                    this.form = emptyForm()
                }

                this.message = 'Usuario eliminado correctamente.'
            } catch (err) {
                this.error = 'No se pudo eliminar el usuario.'
            }
        },
        goToPage(nextPage) {
            if (nextPage < 1 || nextPage > this.totalPages) return
            this.page = nextPage
            this.syncUsersPage()
        }
    }
}
</script>

<style scoped>
.users-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 16px 60px;
}

.page-header {
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

.content-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
    gap: 24px;
}

.panel {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.panel-header {
    margin-bottom: 18px;
}

.panel-header h2 {
    margin: 0;
    color: #0f172a;
    font-size: 1.2rem;
}

.user-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background: #f8fafc;
}

.user-item.active {
    border-color: #38bdf8;
    background: #e0f2fe;
}

.user-item strong,
.user-item small {
    display: block;
}

.user-item small {
    color: #64748b;
    margin-top: 4px;
}

.user-actions {
    display: flex;
    gap: 8px;
}

button {
    border: none;
    border-radius: 10px;
    padding: 10px 12px;
    cursor: pointer;
    font-weight: 700;
}

button.primary {
    background: linear-gradient(135deg, #38bdf8, #0284c7);
    color: white;
}

button.secondary {
    background: #e2e8f0;
    color: #0f172a;
}

button.danger {
    background: #fee2e2;
    color: #b91c1c;
}

.search-box {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
}

.search-box input,
.user-form input {
    width: 100%;
    border: 1px solid #dfe7f1;
    background: white;
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 14px;
    color: #0f172a;
}

.message {
    margin-bottom: 16px;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 14px;
}

.message.success {
    background: #dcfce7;
    color: #166534;
}

.message.error {
    background: #fee2e2;
    color: #b91c1c;
}

.user-form {
    display: grid;
    gap: 14px;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field-group label {
    font-weight: 600;
    color: #334155;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 18px;
    color: #334155;
    font-weight: 600;
}

.pagination button {
    background: #e2e8f0;
    color: #0f172a;
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.loading,
.empty-state {
    background: rgba(255, 255, 255, 0.85);
    border-radius: 16px;
    padding: 18px;
    text-align: center;
    color: #475569;
    border: 1px solid rgba(148, 163, 184, 0.2);
}

@media (max-width: 860px) {
    .content-grid {
        grid-template-columns: 1fr;
    }

    .user-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .user-actions {
        width: 100%;
        justify-content: flex-end;
    }
}
</style>
