<template>
    <div class="space-y-4 mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800">Editar Àrea</h2>
  
      <form @submit.prevent="editarArea">
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1" for="nombre">Nou nom de l'àrea</label>
          <input
            v-model="nombreArea"
            type="text"
            id="nombre"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500"
            required
          />
        </div>
  
        <div class="flex justify-end space-x-4">
 
          <button
            type="button"
            @click="cancelarEdicion"
            class="btn-cancel"
          >
            Cancel·lar
          </button>
          <button 
          type="submit"
          class="btn-confirm"
        >
          Actualizar Àrea
        </button>
        </div>
      </form>
  
      <SaltoNotificacion
        v-if="mensaje"
        :mensaje="mensaje"
        :tipo="tipoNotificacion"
      />
    </div>
  </template>
  
  <script>
  import SaltoNotificacion from '../SaltoNotificacion.vue'; 
  
  export default {
    name: 'EditarArea',
    props: {
      areaId: {
        type: Number,
        required: true,
      },
      nombre: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        nombreArea: this.nombre,  // Copiamos el valor de la prop en el data para manipularlo
        mensaje: '',  // Mensaje para la notificación
        tipoNotificacion: '',  // Tipo de notificación (éxito o error)
      };
    },
    methods: {
      async editarArea() {
        this.mensaje = '';  // Limpiar mensaje anterior
  
        try {
          const response = await fetch(`http://localhost:3000/areas/${this.areaId}/editar`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ areaId: this.areaId, nombre: this.nombreArea }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            this.tipoNotificacion = 'success';
            this.mensaje = 'Área actualizada correctamente.';

            this.$emit('areaEditada');
  
            setTimeout(() => {
              this.$emit('regresar');
            }, 1000);
          } else {
            this.tipoNotificacion = 'error';
            this.mensaje = data.error || 'Error al actualizar el área.';
          }
        } catch (err) {
          this.tipoNotificacion = 'error';
          this.mensaje = 'Error de conexión al servidor.';
        }
      },
      cancelarEdicion() {
        this.$emit('regresar');  // Emitir evento de cancelación al componente padre
      },
    },
    components: {
      SaltoNotificacion,
    },
  };
  </script>
  
  <style scoped>
  </style>
  