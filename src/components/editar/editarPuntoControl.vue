<template>
    <div class="max-w-[90%] mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow mt-8">
      <h2 class="text-xl font-semibold text-gray-800">Editar Punt de Control</h2>
      <form @submit.prevent="guardarCambios">
        <!-- Nombre -->
        <div class="mt-4">
          <label for="nombre" class="block text-sm font-semibold text-gray-700">Nom del Punt de Control</label>
          <input
            v-model="nombre"
            type="text"
            id="nombre"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
  
        <!-- Peso -->
        <div class="mt-4">
          <label for="peso" class="block text-sm font-semibold text-gray-700">Pes</label>
          <input
            v-model.number="peso"
            type="number"
            id="peso"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
  
        <!-- Botones -->
        <div class="mt-6 flex justify-end gap-2">
          <button type="button" @click="$emit('cerrar')" class="btn-cancel">
            Cancel·lar
          </button>
          <button type="submit" class="btn-confirm">
            Guardar Canvis
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
    props: {
      punto: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        nombre: this.punto.puntoControlNombre,
        peso: this.punto.pesoPuntoControl,
      };
    },
    methods: {
      async guardarCambios() {
        try {
          await api.put(`/puntos-de-control/${this.punto.puntoControlId}`, {
            nombre: this.nombre,
            peso: this.peso,
          });
          toast.success('Punt de control actualitzat correctament')
          this.$emit('cerrar');
        } catch (error) {
          toast.error('Error al actualitzar el punt de control')
          console.error('Error al guardar los canvis del punt de control:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>

  </style>
  