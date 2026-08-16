<template>
    <div class="card container" style="max-width:520px;">
        <h2 class="center">Crear cuenta</h2>

        <div>
            <label>
                Nombre <span class="required">*</span>
                <span class="tooltip" tabindex="0">ⓘ<span class="tooltiptext">Nombre completo para mostrar en el dashboard.</span></span>
            </label>
            <input v-model="name" placeholder="Nombre" @input="clearError('name')" :class="{'input-error': errors.name}" :style="errors.name ? errorStyle : {}" />
            <div v-if="errors.name" class="form-error">{{ errors.name }}</div>
        </div>

        <div>
            <label>
                Usuario <span class="required">*</span>
                <span class="tooltip" tabindex="0">ⓘ<span class="tooltiptext">Elige un usuario público (mínimo 3 caracteres).</span></span>
            </label>
            <input v-model="username" placeholder="Usuario" @input="clearError('username')" :class="{'input-error': errors.username}" :style="errors.username ? errorStyle : {}" />
            <div v-if="errors.username" class="form-error">{{ errors.username }}</div>
        </div>

        <div>
            <label>
                Contraseña <span class="required">*</span>
                <span class="tooltip" tabindex="0">ⓘ<span class="tooltiptext">Debe tener al menos 6 caracteres; combina letras y números si es posible.</span></span>
            </label>
            <input v-model="password" type="password" placeholder="Contraseña" @input="clearError('password')" :class="{'input-error': errors.password}" :style="errors.password ? errorStyle : {}" />
            <div v-if="errors.password" class="form-error">{{ errors.password }}</div>
        </div>

        <div style="margin-top:6px; font-size:13px; color:#475569;">
            Los campos marcados con <span class="required">*</span> son obligatorios.
        </div>

        <div style="margin-top:12px;">
            <button class="btn" :disabled="!isValid" @click="register">Registrar</button>
        </div>
    </div>
</template>
<style scoped>
.card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    max-width: 400px;
    margin: 50px auto;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    width: 100%;
    padding: 10px;
    background: #38bdf8;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background: #0ea5e9;
}
</style>
<script>
import { registerUser } from "../services/api";

export default {
    data() {
        return {
            name: "",
            username: "",
            password: "",
            errors: {}
        };
    },
    computed: {
        isValid() {
            return this.name.trim().length > 0 && this.username.trim().length >= 3 && this.password.length >= 6 && Object.keys(this.errors).length === 0;
        }
        ,
        errorStyle() {
            return {
                border: '1px solid #dc2626',
                boxShadow: '0 0 0 4px rgba(220,38,38,0.06)'
            };
        }
    },
    methods: {
        clearError(field) {
            if (this.errors[field]) this.$set(this.errors, field, null);
        },
        validate() {
            this.errors = {};
            if (!this.name || this.name.trim().length === 0) this.errors.name = "El nombre es requerido";
            if (!this.username || this.username.trim().length < 3) this.errors.username = "El usuario debe tener al menos 3 caracteres";
            if (!this.password || this.password.length === 0) this.errors.password = "La contraseña es requerida";
            else if (this.password.length < 6) this.errors.password = "La contraseña debe tener al menos 6 caracteres";
            return Object.keys(this.errors).length === 0;
        },
        async register() {
            if (!this.validate()) return;
            try {
                const { res, session } = await registerUser(this.name, this.username, this.password);
                alert("Usuario registrado: " + (session.name || this.username));
                this.$router.push('/dashboard');
            } catch (e) {
                alert("Error al registrar");
            }
        }
    }
};
</script>