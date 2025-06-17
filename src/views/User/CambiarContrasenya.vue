<template>
    <div class="max-w-md mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-2xl font-semibold mb-4 text-center text-green-700">{{$t('changePassword')}}</h2>
  
      <form @submit.prevent="cambiarContrasenya">
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1" for="actual"> {{$t('actualPassword')}} </label>
          <input
            v-model="contrasenyaActual"
            type="password"
            id="actual"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500"
            required
          />
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1" for="nova"> {{ $t('newPassword') }}</label>
          <input
            v-model="novaContrasenya"
            type="password"
            id="nova"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500"
            required
          />
        </div>
  
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-1" for="confirmar">{{$t('confirmPassword')}}</label>
          <input
            v-model="confirmarContrasenya"
            type="password"
            id="confirmar"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500"
            required
          />
        </div>
  
        <div>
          <button
            type="submit"
            class="w-full btn-confirm ml-0 mb-2"
          >
          {{ $t('changePassword') }}
        </button>
  
          <button
            type="button"
            @click="goBack"
            class="w-full btn-delete"
          >
            {{ $t('cancel') }}
          </button>
        </div>
      </form>
  
    </div>
  </template>
  
  <script>
  import { useToast } from 'vue-toastification'
  import api from '@/services/api'

  const toast = useToast()
  
  export default {
    name: 'CambiarContrasenya',
    data() {
      return {
        contrasenyaActual: '',
        novaContrasenya: '',
        confirmarContrasenya: '',
      };
    },
    methods: {
      
        async cambiarContrasenya() {
            if (this.novaContrasenya !== this.confirmarContrasenya) {
                toast.error(this.$t('passwordsDontMatch'))
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('usuarioId');

                const response = await api.fetch(`/usuarios/${userId}/editar-contrasenya`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    contraseñaActual: this.contrasenyaActual,
                    nuevaContraseña: this.novaContrasenya
                })
                });

                if (!response.ok) {
                  toast.error(this.$t('passwordChangeError'))
                  return;
                }

                this.contrasenyaActual = '';
                this.novaContrasenya = '';
                this.confirmarContrasenya = '';

                toast.success(this.$t('passwordChangedSuccess'))

                setTimeout(() => {
                this.$router.go(-1);
                }, 2000);

            } catch (err) {
              toast.error(this.$t('passwordChangeError'))
            }
            },

      goBack() {
        this.$router.go(-1); // Vuelve a la página anterior
      }
    }
  };
  </script>
  