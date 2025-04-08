<template>
  <div class="p-4 space-y-4 mx-auto bg-white shadow-md rounded-md">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Crear Rúbrica</h2>
    <form @submit.prevent="submitRubrica">
      <div class="mb-4">
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nom de la rúbrica</label>
        <input
          type="text"
          id="nombre"
          v-model="nombre"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div class="mb-4">
        <label for="rolId" class="block text-sm font-medium text-gray-700">Seleccionar rol</label>
        <select
          id="rolId"
          v-model="rolId"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option v-for="rol in roles" :key="rol.id" :value="rol.id">
            {{ rol.nombre }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label for="numPuntosDeControl" class="block text-sm font-medium text-gray-700">Nombre de punts de control</label>
        <input
          type="number"
          id="numPuntosDeControl"
          v-model="numPuntosDeControl"
          min="1"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
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
          Crear Rúbrica
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      nombre: '',
      rolId: null,
      numPuntosDeControl: 1,
      roles: [],
    };
  },
  mounted() {
    this.obtenerRoles();
  },
  methods: {
    async obtenerRoles() {
      try {
        const response = await axios.get('http://localhost:3000/roles');
        this.roles = response.data;
        if (this.roles.length > 0) {
          this.rolId = this.roles[0].id; // seleccionar el primero por defecto
        }
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
    },
    async submitRubrica() {
      console.log(this.nombre)
      console.log(this.rolId)
      console.log(this.numPuntosDeControl)

      try {
        await axios.post('http://localhost:3000/rubricas', {
          nombre: this.nombre,
          rolId: this.rolId,
          numPuntosDeControl: this.numPuntosDeControl,
        });
        this.nombre = '';
        this.numPuntosDeControl = 1;
        this.$emit('rubricaCreada')
      } catch (error) {
        console.error('Error al crear rúbrica:', error);
      }
    },
    cancelarCrear(){
      this.$emit('cancelar')
    }
  },
};
</script>
