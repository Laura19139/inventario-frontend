<template>
    <div class="card container" style="max-width:420px;">
        <h2 class="center">Iniciar sesión</h2>

        <div>
            <label>
                Usuario <span class="required">*</span>
                <span class="tooltip" tabindex="0">ⓘ<span class="tooltiptext">Ingresa tu nombre de usuario o correo registrado.</span></span>
            </label>
            <input v-model="username" placeholder="Usuario" @input="clearError('username')" :class="{'input-error': errors.username}" :style="errors.username ? errorStyle : {}" />
            <div v-if="errors.username" class="form-error">{{ errors.username }}</div>
        </div>

        <div>
            <label>
                Contraseña <span class="required">*</span>
                <span class="tooltip" tabindex="0">ⓘ<span class="tooltiptext">Mínimo 6 caracteres. Usa una contraseña segura.</span></span>
            </label>
            <input v-model="password" type="password" placeholder="Contraseña" @input="clearError('password')" :class="{'input-error': errors.password}" :style="errors.password ? errorStyle : {}" />
            <div v-if="errors.password" class="form-error">{{ errors.password }}</div>
        </div>

        <div style="margin-top:6px; font-size:13px; color:#475569;">
            Los campos marcados con <span class="required">*</span> son obligatorios.
        </div>

        <div style="margin-top:12px;">
            <button class="btn" :disabled="!isValid" @click="login">Ingresar</button>
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
import { loginUser } from "../services/api";

export default {
    data() {
        return {
            username: "",
            password: "",
            errors: {}
        };
    },
    computed: {
        isValid() {
            return this.username.trim().length > 0 && this.password.length >= 6 && Object.keys(this.errors).length === 0;
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
            if (!this.username || this.username.trim().length === 0) this.errors.username = "El usuario es requerido";
            if (!this.password || this.password.length === 0) this.errors.password = "La contraseña es requerida";
            else if (this.password.length < 6) this.errors.password = "La contraseña debe tener al menos 6 caracteres";
            return Object.keys(this.errors).length === 0;
        },
        async login() {
            if (!this.validate()) return;
            try {
                const { res, session } = await loginUser(this.username, this.password);
                alert("Bienvenido " + (session.name || this.username));
                this.$router.push('/dashboard');
            } catch (e) {
                alert("Error en login");
            }
        }
    }
};
</script>