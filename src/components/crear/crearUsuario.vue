<template>
  <div class="space-y-4 mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Crear Usuari</h2>
    <form @submit.prevent="crearUsuario">
      <div class="mb-4">
        <label class="block text-gray-700">Nom</label>
        <input
          v-model="nombre"
          type="text"
          class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Email</label>
        <input
          v-model="email"
          type="email"
          class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Contrasenya</label>
        <input
          v-model="contraseña"
          type="password"
          class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4 flex" >
        <label class="inline-flex items-center space-x-2"> 
          <input
            v-model="esAdmin"
            type="checkbox"
            class="form-checkbox text-green-600"
          />
          <span>Administrador</span>
        </label>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button
          class="btn-cancel"
          @click="cancelarCrear()"
        >
          Cancel·lar
        </button>
        <button
          type="submit"
          class="btn-confirm"
        >
          Crear Usuari
        </button>
      </div>
    </form>

    <!-- Componente de notificación -->
    <SaltoNotificacion 
      v-if="mensaje" 
      :mensaje="mensaje" 
      :tipo="tipoNotificacion" 
    />
  </div>
</template>

<script>
import axios from 'axios';
import SaltoNotificacion from '../SaltoNotificacion.vue';  // Asegúrate de importar el componente

export default {
  components: {
    SaltoNotificacion
  },
  props: {
    
  },
  data() {
    return {
      nombre: '',
      email: '',
      contraseña: '',
      esAdmin: false,
      mensaje: '',  // Para el mensaje de la notificación
      tipoNotificacion: '',  // 'success' o 'error'
    };
  },
  methods: {
    async crearUsuario() {
      try {
        const response = await axios.post('http://localhost:3000/usuarios', {
          nombre: this.nombre,
          email: this.email,
          contraseña: this.contraseña,
          esAdmin: this.esAdmin,  // Usamos el valor de la prop esAdmin
        });

        if (response.status === 201) { // Solo si la respuesta es exitosa
          this.mensaje = 'Usuario creado correctamente';
          this.tipoNotificacion = 'success';
          this.nombre = '';
          this.email = '';
          this.contraseña = '';
          this.esAdmin = false;
          
          // Emitir el evento al componente padre indicando que el usuario fue creado
          this.$emit('usuarioCreado', { nombre: this.nombre, esAdmin: this.esAdmin });
        }
      } catch (error) {
        console.error(error);
        this.mensaje = error.response?.data?.error || 'Error al crear usuario';
        this.tipoNotificacion = 'error';
      }
    },
    cancelarCrear(){
      this.$emit('cancelar')
    }
  },
};
</script>
