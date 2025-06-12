<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div v-if="!verOlvidadoContraseña" class="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <!-- Logo + título -->
      <div class="flex flex-col items-center mb-8">
        <img src="/logo-uab.svg" alt="UAB Logo" class="h-12 mb-3" />
        <h1 class="text-xl font-semibold text-gray-800 text-center">
          Avaluador de Treballs Final d'Estudis
        </h1>
        <h2 class="text-sm font-medium text-[#00785A] text-center">
          Universitat Autònoma de Barcelona
        </h2>
      </div>

      <h3 class="text-lg font-semibold text-gray-700 text-center mb-6">
        Iniciar sessió
      </h3>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="nom@uab.cat"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00B48A]"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-600 mb-1">Contrasenya</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00B48A]"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 rounded-lg bg-[#00785A] text-white font-semibold hover:bg-[#006149] transition duration-300"
        >
          Iniciar sessió
        </button>
      </form>

      <div class="flex justify-center mt-4">
        <button
          class="text-sm text-blue-500 hover:text-blue-700"
          @click="verOlvidadoContraseña = true"
        >
          He oblidat la meva contrasenya
        </button>
      </div>

    </div>

    <OlvidadoContraseña 
      v-if="verOlvidadoContraseña"
      @regresar="verOlvidadoContraseña=false"
    />
    
  </div>
</template>

<script>
import axios from 'axios';
import OlvidadoContraseña from './User/OlvidadoContraseña.vue';
import { useToast } from 'vue-toastification'

const toast = useToast()
export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
      verOlvidadoContraseña: false,
    };
  },
  components:{
    OlvidadoContraseña,
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3000/usuarios/login', {
          email: this.email,
          contraseña: this.password,
        });

        const { token, data: { id, nombre, esAdmin } } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('usuarioId', id);
        localStorage.setItem('esAdmin', esAdmin);
        localStorage.setItem('nombre', nombre);

        this.$router.push(`/user/${id}`);
      } catch (err) {
        toast.error('Usuari o contrasenya incorrectes')
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
</style>
