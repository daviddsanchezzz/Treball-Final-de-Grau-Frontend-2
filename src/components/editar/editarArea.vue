<template>
    <div class="space-y-4 mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800">{{ $t('editarArea') }}</h2>
  
      <form @submit.prevent="editarArea">
        <div class="mb-4">
          <label for="nombre" class="block text-sm font-medium text-gray-700">{{ $t('nomArea') }}</label>
          <input
            type="text"
            id="nombre"
            v-model="nombreArea"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      
        <div class="mb-4 flex flex-row w-full justify-between gap-8">
          <div class="w-1/2">
            <label for="tutor" class="block text-sm font-medium text-gray-700">{{ $t('percentatgeTutor') }}</label>
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
            <label for="avaluador" class="block text-sm font-medium text-gray-700">{{ $t('percentatgeAvaluador') }}</label>
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
            type="button"
            @click="cancelarEdicion"
            class="btn-cancel"
          >
            {{ $t('cancel') }}
          </button>
          <button 
            type="submit"
            class="btn-confirm"
          >
            {{ $t('actualitzarArea') }}
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
        nombreArea: this.nombre,  
        percentatgeAvaluadors: 0,
        percentatgeTutor: 0,
      };
    },
    methods: {
      async editarArea() {
        const suma = parseFloat(this.percentatgeAvaluadors) + parseFloat(this.percentatgeTutor);
        const epsilon = 0.01; // margen de error permitido

        if (Math.abs(suma - 100) > epsilon) {
          toast.error('Els dos percentatges han de sumar 100');
          return;
        }
        else{
          try {
            const response = await api.fetch(`/areas/${this.areaId}/editar`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                areaId: this.areaId, 
                nombre: this.nombreArea,
                tutor: this.percentatgeTutor,
                avaluador: this.percentatgeAvaluadors,
              }),
            });

            if (response.ok) {
              toast.success('Área actualizada correctamente.');  // corregido success
              this.$emit('areaEditada');
              this.$emit('regresar');
            } else {
              const data = await response.json();
              toast.error(`Error al actualizar: ${data.error || 'Error desconocido'}`);
            }
          } catch (err) {
            toast.error('Error al actualizar el área.');
            console.error(err);
          }

        }
      },
      async obtenerDatos() {
        try {
          const response = await api.fetch(`/areas/porcentages/${this.areaId}`);
          if (!response.ok) {
            throw new Error('Error al obtener los porcentajes del área');
          }
          const data = await response.json();
          this.percentatgeTutor = data.percentatgeFinalTutor;
          this.percentatgeAvaluadors = data.percentatgeFinalAvaluadors;

        } catch (err) {
          toast.error('Error al obtener los porcentajes del área.');
        }
      },

      cancelarEdicion() {
        this.$emit('regresar');  // Emitir evento de cancelación al componente padre
      },
    },
    mounted(){
      this.obtenerDatos();
    }
  };
  </script>
  
  <style scoped>
  </style>
  