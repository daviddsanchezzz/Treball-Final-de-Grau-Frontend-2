<template>
    <div v-if="visible" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center mt-0 h-full">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <p>{{ mensaje }} Aquesta acció no es pot desfer.</p>
        <div class="mt-4">
          <button @click="cancelar" class="btn-cancel ">Cancel·lar</button>
          <button @click="confirmar" class="btn-delete ml-2">Sí</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      mensaje: {
        type: String,
        required: true,
      },
      visible: {
        type: Boolean,
        required: true,
      },
    },
    methods: {
      confirmar() {
        this.$emit("confirmado");
      },
      cancelar() {
        this.$emit("cancelado");
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos adicionales si es necesario */
  </style>
  