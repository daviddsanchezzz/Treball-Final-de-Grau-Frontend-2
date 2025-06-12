<template>
  <div class="p-4 space-y-4 mx-auto bg-white shadow-md rounded-md">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">{{$t('crearArea')}}</h2>
    <form @submit.prevent="submitArea">
      <div class="mb-4">
        <label for="nombre" class="block text-sm font-medium text-gray-700">{{$t('nomArea')}}</label>
        <input
          type="text"
          id="nombre"
          v-model="nombre"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div class="mb-4 flex flex-row w-full justify-between gap-8">
        <div class="w-1/2">
          <label for="tutor" class="block text-sm font-medium text-gray-700">{{$t('percentatgeTutor')}}</label>
          <div class="relative">
            <input
              type="number"
              id="tutor"
              v-model="percentatgeTutor"
              min="0"
              max="100"
              step="0.01"
              class="mt-1 block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>
        <div class="w-1/2">
          <label for="avaluador" class="block text-sm font-medium text-gray-700">{{$t('percentatgeAvaluador')}}</label>
          <div class="relative">
            <input
              type="number"
              id="avaluador"
              v-model="percentatgeAvaluadors"
              min="0"
              max="100"
              step="0.01"
              class="mt-1 block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
          </div>    
        </div>
            
        
      </div>
    
      <div class="flex justify-end space-x-4">
        <button
          class=" btn-cancel"
          @click="cancelarCrear()"
        >
          {{ $t('cancel') }}
        </button>
        <button
          type="submit"
          class=" btn-confirm"
        >
        {{$t('crearArea')}}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()  

export default {
  name: 'CrearArea',
  emits: ['regresar'],
  data() {
    return {
      nombre: '',
      percentatgeTutor: 60,
      percentatgeAvaluadors: 40,
    }
  },
  methods: {
    async submitArea() {
      if (parseFloat(this.percentatgeAvaluadors) + parseFloat(this.percentatgeTutor) !== 100) {
        toast.error('Els dos percentatges han de sumar 100');
        return;
      }
      else{
        try {
          const response = await axios.post('http://localhost:3000/areas', {
            nombre: this.nombre,
            tutor: this.percentatgeTutor,
            avaluador: this.percentatgeAvaluadors,
          })
          console.log('Área creada:', response.data)
          this.nombre = ''
          toast.success(this.$t('areaCreada'))
          this.$emit('regresar')
        } catch (error) {
          console.error('Error al crear área:', error)
          toast.error(this.$t('errorAreaCrear'))
        }

      }
    },
    cancelarCrear() {
      this.$emit('regresar')
    }
  }
}
</script>
