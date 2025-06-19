<template>
    <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 class="text-lg font-semibold mb-4 text-center"> {{ $t('editarNotaFinal') }}</h2>
  
        <input
          type="number"
          v-model.number="notaEditada"
          min="0"
          max="10"
          step="0.1"
          class="w-full p-2 border rounded mb-4 text-center"
        />
  
        <div class="flex justify-center items-center">
          <button
            class="btn-confirm mr-2 ml-0"
            @click="emitirGuardar"
          >
            {{ $t('guardar') }}
          </button>
  
          <button
            class="btn-second mr-2"
            @click="emitirRestaurar"
          >
            {{ $t('restaurar') }}
          </button>
  
          <button
            class="btn-cancel"
            @click="$emit('cancelar')"
          >
            {{ $t('cancel') }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      notaFinal: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        notaEditada: this.notaFinal
      };
    },
    methods: {
      emitirGuardar() {
        this.$emit('guardar', this.notaEditada);
      },
      emitirRestaurar() {
        this.$emit('restaurar');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Puedes personalizar si quieres aquí */
  </style>
  