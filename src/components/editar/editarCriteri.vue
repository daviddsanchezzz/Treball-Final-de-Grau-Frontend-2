<template>
  <div class="max-w-[90%] mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow mt-8">
    <h2 class="text-xl font-semibold text-gray-800">Editar Criteri</h2>
    <form @submit.prevent="guardarCambios">
      <!-- Nombre del criterio -->
      <div class="mt-4">
        <label for="nombre" class="block text-sm font-semibold text-gray-700">Nom del Criteri</label>
        <input
          v-model="nombre"
          type="text"
          id="nombre"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <!-- Pesos por punto de control -->
      <div v-if="criterio.puntosDeControl.length > 1" class="mt-4">
        <h3 class="text-sm font-semibold text-gray-700">Pesos per cada Punt de Control</h3>
        <div class="flex flex-row justify-center">
          <div
            v-for="punto in criterio.puntosDeControl.slice().sort((a, b) => a.puntoControlId - b.puntoControlId)"
            :key="punto.puntoControlId"
            class="mt-2 mx-8"
          >
            <label :for="'peso-' + punto.puntoControlId" class="block text-sm text-gray-700">
              {{ punto.puntoControlNombre }}
            </label>
            <input
              v-model.number="pesosPuntosControl[punto.puntoControlId]"
              type="number"
              :id="'peso-' + punto.puntoControlId"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="mt-6 flex justify-end gap-2">
        <button type="button" @click="$emit('cerrar')" class="btn-cancel">
          Cancel·lar
        </button>
        <button type="button" @click="mostrarConfirmacionEliminar" class="btn-delete">
          Eliminar Criteri
        </button>
        <button type="submit" class="btn-confirm">
          Guardar Canvis
        </button>
      </div>
    </form>

    <ConfirmacionEliminacion
      :mensaje="'Estàs segur que vols eliminar aquest criteri?'"
      :visible="mostrarConfirmacion"
      @confirmado="eliminarCriterio"
      @cancelado="cancelarEliminacion"
    />
  </div>
</template>

<script>
import axios from 'axios';
import ConfirmacionEliminacion from '../ConfirmacionEliminacion.vue'; // Asegúrate de importar el componente

export default {
  components: {
    ConfirmacionEliminacion,
  },
  props: {
    criterio: Object,
  },
  data() {
    return {
      nombre: this.criterio.criterioNombre,
      pesosPuntosControl: {},
      mostrarConfirmacion: false, // Estado para mostrar el componente de confirmación
    };
  },
  methods: {
    async guardarCambios() {
      try {
        await axios.put(`http://localhost:3000/criterios/${this.criterio.criterioId}`, {
          nuevoNombre: this.nombre,
          nuevosPesosPuntosControl: this.pesosPuntosControl,
        });
        this.$emit('cerrar');
      } catch (error) {
        console.error('Error al guardar los cambios del criteri:', error);
      }
    },

    // Muestra la confirmación de eliminación
    mostrarConfirmacionEliminar() {
      this.mostrarConfirmacion = true;
    },

    // Cancela la eliminación
    cancelarEliminacion() {
      this.mostrarConfirmacion = false;
    },

    // Elimina el criterio si se confirma
    async eliminarCriterio() {
      try {
        await axios.delete(`http://localhost:3000/criterios/${this.criterio.criterioId}`);
        this.$emit('cerrar'); // o podrías emitir otro evento como 'criterioEliminado'
      } catch (error) {
        console.error('Error al eliminar el criteri:', error);
      } finally {
        this.mostrarConfirmacion = false;
      }
    },
  },
  mounted() {
    this.criterio.puntosDeControl.forEach((punto) => {
      this.pesosPuntosControl[punto.puntoControlId] = punto.pesoRelacion ?? 1;
    });
  },
};
</script>

<style scoped>
/* Aquí van los estilos si son necesarios */
</style>
