<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
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
        Recuperar contrasenya
      </h3>

      <form @submit.prevent="enviarCorreu">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-600 mb-1">Correu electrònic</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="nom@uab.cat"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00B48A]"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full font-semibold btn-confirm ml-0"
        >
          Enviar enllaç per restablir la contrasenya
        </button>
        <button
          @click="$emit('regresar')"
          :disabled="loading"
          class="w-full btn-cancel mt-2"
        >
          Cancel·lar
        </button>
      </form>

      <p v-if="mensaje" class="text-red-500 text-center mt-4">{{ mensaje }}</p>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification';
const toast = useToast()

export default {
  data() {
    return {
      email: '',
      loading: false,
      mensaje: '',
    };
  },
  methods: {
    async enviarCorreu() {
      try {
        this.loading = true;
        const toast = useToast();

        // Aquí va la crida a l'API que envia l'enllaç de restabliment
        await this.$http.post('/api/forgot-password', {
          email: this.email,
        });

        toast.success('S\'ha enviat un enllaç per restablir la contrasenya al teu correu.');
      } catch (error) {
        toast.error('Hi ha hagut un error en enviar el correu.');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
