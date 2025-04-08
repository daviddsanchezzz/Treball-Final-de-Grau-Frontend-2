<template>
  <div
    v-if="visible"
    :class="[
      'fixed top-4 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded-md shadow-lg opacity-70 transition-opacity duration-300 w-4/5 max-w-xl',
      tipo === 'success' ? 'bg-green-800' : 'bg-red-600'
    ]"
  >
    <p>{{ mensaje }}</p>
  </div>
</template>

<script>
export default {
  props: {
    mensaje: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      default: 'success',  // Puede ser 'success' o 'error'
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.visible = false;
    }, 3000); // Se oculta después de 3 segundos
  },
};
</script>
