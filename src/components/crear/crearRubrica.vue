<template>
  <div class="p-4 space-y-4 mx-auto bg-white shadow-md rounded-md">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">{{$t('crearRubricaTitulo')}}</h2>
    <form @submit.prevent="submitRubrica">
      <div class="mb-4">
        <label for="nombre" class="block text-sm font-medium text-gray-700">{{$t('crearRubricaNombre')}}</label>
        <input
          type="text"
          id="nombre"
          v-model="nombre"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div class="mb-4">
        <label for="rolId" class="block text-sm font-medium text-gray-700">{{$t('crearRubricaSeleccionarRol')}}</label>
        <select
          id="rolId"
          v-model="rolId"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option v-for="rol in roles" :key="rol.id" :value="rol.id">
            {{ $t(rol.nombre.toLowerCase()) }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label for="numPuntosDeControl" class="block text-sm font-medium text-gray-700">{{$t('crearRubricaNumPuntosControl')}}</label>
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
        {{ $t('cancel') }}
      </button>
        <button
          type="submit"
          class="btn-confirm"
        >
          {{$t('crearRubricaCrear')}}
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
      try {
        await axios.post('http://localhost:3000/rubricas', {
          nombre: this.nombre,
          rolId: this.rolId,
          numPuntosDeControl: this.numPuntosDeControl,
        });
        this.nombre = '';
        this.numPuntosDeControl = 1;
        toast.success(this.$t('crearRubricaExito'))
        this.$emit('rubricaCreada')
      } catch (error) {
        console.error('Error al crear rúbrica:', error);
        toast.error(this.$t('crearRubricaError'))
      }
    },
    cancelarCrear(){
      this.$emit('cancelar')
    }
  },
};
</script>
