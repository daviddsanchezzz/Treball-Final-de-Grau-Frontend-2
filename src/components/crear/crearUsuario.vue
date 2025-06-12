<template>
  <div class="space-y-4 mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ $t('crearUsuari') }}</h2>
    <form @submit.prevent="crearUsuario">
      <div class="mb-4">
        <label class="block text-gray-700">{{ $t('nombre') }}</label>
        <input
          v-model="nombre"
          type="text"
          class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">{{ $t('email') }}</label>
        <input
          v-model="email"
          type="email"
          class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">{{ $t('contrasenya') }}</label>
        <input
          v-model="contraseña"
          type="password"
          class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4 flex">
        <label class="inline-flex items-center space-x-2">
          <input
            v-model="esAdmin"
            type="checkbox"
            class="form-checkbox text-green-600"
          />
          <span>{{ $t('administrador') }}</span>
        </label>
      </div>

      <div class="flex justify-end space-x-4">
        <button
          class="btn-cancel"
          @click="cancelarCrear()"
        >
          {{ $t('cancel') }}
        </button>
        <button
          type="submit"
          class="btn-confirm"
        >
          {{ $t('crearUsuari') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification'

const toast = useToast()

export default {
  data() {
    return {
      nombre: '',
      email: '',
      contraseña: '',
      esAdmin: false,
    };
  },
  methods: {
    async crearUsuario() {
      try {
        const response = await axios.post('http://localhost:3000/usuarios', {
          nombre: this.nombre,
          email: this.email,
          contraseña: this.contraseña,
          esAdmin: this.esAdmin,
        });

        if (response.status === 201) {
          this.nombre = '';
          this.email = '';
          this.contraseña = '';
          this.esAdmin = false;
          
          toast.success(this.$t('usuarioCreadoCorrectamente'));
          this.$emit('usuarioCreado', { nombre: this.nombre, esAdmin: this.esAdmin });
        }
      } catch (error) {
        console.error(error);
        toast.error(this.$t('errorCrearUsuario'));
      }
    },
    cancelarCrear() {
      this.$emit('cancelar')
    }
  },
};
</script>
