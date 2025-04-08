<template>
    <div class="max-w-md mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-2xl font-semibold mb-4 text-center text-green-700">Canviar contrasenya</h2>
  
      <form @submit.prevent="cambiarContrasenya">
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1" for="actual">Contrasenya actual</label>
          <input
            v-model="contrasenyaActual"
            type="password"
            id="actual"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500"
            required
          />
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1" for="nova">Nova contrasenya</label>
          <input
            v-model="novaContrasenya"
            type="password"
            id="nova"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500"
            required
          />
        </div>
  
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-1" for="confirmar">Confirma la nova contrasenya</label>
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
            class="w-full bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded transition duration-300 my-4"
          >
            Actualitzar contrasenya
          </button>
  
          <button
            type="button"
            @click="goBack"
            class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300"
          >
            Cancel·lar
          </button>
  
          <a
            href="#"
            class="block text-center text-sm text-blue-500 hover:text-blue-700 mt-4"
          >
            He oblidat la meva contrasenya
          </a>
        </div>
      </form>
  
      <SaltoNotificacion  v-if="mensaje" :mensaje="mensaje" :tipo="tipo" />
    </div>
  </template>
  
  <script>
  import SaltoNotificacion from '../../components/SaltoNotificacion.vue'; // Asegúrate de que la ruta sea correcta
  
  export default {
    name: 'CambiarContrasenya',
    components: {
      SaltoNotificacion,
    },
    data() {
      return {
        contrasenyaActual: '',
        novaContrasenya: '',
        confirmarContrasenya: '',
        mensaje: '',
        tipo: ''
      };
    },
    methods: {
      
        async cambiarContrasenya() {
            // Reiniciar mensajes
            this.mensaje = '';
            this.tipo = '';

            if (this.novaContrasenya !== this.confirmarContrasenya) {
                this.mensaje = 'Les contrasenyes no coincideixen.';
                this.tipo = 'error';
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('usuarioId');

                const response = await fetch(`http://localhost:3000/usuarios/${userId}/editar-contrasenya`, {
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

                const data = await response.json();

                if (!response.ok) {
                this.mensaje = data.message || 'Error desconegut.';
                this.tipo = 'error';
                return;
                }

                this.mensaje = data.message || 'Contrasenya actualitzada correctament.';
                this.tipo = 'success';

                this.contrasenyaActual = '';
                this.novaContrasenya = '';
                this.confirmarContrasenya = '';

                setTimeout(() => {
                this.$router.go(-1);
                }, 2000);

            } catch (err) {
                this.mensaje = 'Error de connexió amb el servidor.';
                this.tipo = 'error';
            }
            },

      goBack() {
        this.$router.go(-1); // Vuelve a la página anterior
      }
    }
  };
  </script>
  