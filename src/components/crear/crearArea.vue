<template>
  <div class="p-4 space-y-4 mx-auto bg-white shadow-md rounded-md">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Crear Área</h2>
    <form @submit.prevent="submitArea">
      <div class="mb-4">
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nom de l'àrea</label>
        <input
          type="text"
          id="nombre"
          v-model="nombre"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div class="flex justify-end space-x-4">
        <button
          class=" btn-cancel"
          @click="cancelarCrear()"
        >
          Cancel·lar
        </button>
        <button
          type="submit"
          class=" btn-confirm"
        >
          Crear Área
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CrearArea',
  emits: ['areaCreada'],
  data() {
    return {
      nombre: '',
    }
  },
  methods: {
    async submitArea() {
      try {
        const response = await axios.post('http://localhost:3000/areas', {
          nombre: this.nombre,
        })
        console.log('Área creada:', response.data)
        this.nombre = ''
        this.$emit('areaCreada')
      } catch (error) {
        console.error('Error al crear área:', error)
      }
    },
    cancelarCrear() {
      this.$emit('cancelar')
    }
  }
}
</script>
