<template>
  <div class="max-w-5xl mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow">
    <div class="flex items-center justify-between">
      <button @click="cerrarDetalles" class="ml-auto text-gray-700 hover:text-black">
        <font-awesome-icon icon="times" />
      </button>
    </div>

    <div v-if="area" class="relative top-0 left-0 w-full">
      <h2 class="text-2xl font-semibold text-gray-800">{{ $t('detallsArea') }}: {{ area.area }}</h2>

      <div class="mt-6">
        <h4 class="text-lg font-semibold text-gray-700">{{ $t('rubriques') }}:</h4>

        <div v-if="area.rubricas && area.rubricas.length === 0">
          <p class="text-gray-600 text-sm">{{ $t('encaraNoAsignada') }}</p>
        </div>

        <ul v-else class="divide-y divide-gray-200 mt-4">
          <li
            v-for="(rubrica, index) in area.rubricas"
            :key="index"
            class="p-4 flex justify-between items-center"
          >
            <div>
              <p class="text-gray-800">{{ rubrica.rubrica }}</p>
              <p class="text-gray-600 text-sm">{{ rubrica.rolNombre }}</p>
            </div>
            <button @click="confirmarEliminarRubrica(rubrica.rubricaId)" class="text-gray-700 hover:text-black">
              <font-awesome-icon icon="trash" />
            </button>
          </li>
        </ul>

        <div v-if="area.rubricas && area.rubricas.length < 2 && !mostrarSelector" class="mt-4">
          <button
            @click="mostrarSelector = !mostrarSelector"
            class="btn-confirm text-white px-2 py-1 rounded-md transition"
          >
            {{ $t('assignarRubrica') }}
          </button>
        </div>

        <!-- Buscador de rúbricas -->
        <div v-if="mostrarSelector" class="mt-4 space-y-4">
          <div>
            <label class="block mb-2 text-sm text-gray-700">{{ $t('cercaRubrica') }}:</label>
            <input
              v-model="busquedaRubrica"
              @focus="mostrarSugerencias = true"
              @blur="ocultarSugerenciasConRetraso"
              type="text"
              :placeholder="$t('nomRubrica')"
              class="w-full px-4 py-2 border rounded-md"
            />
            <ul
              v-if="mostrarSugerencias && rubricasFiltradas.length > 0"
              class="border mt-1 rounded-md bg-white shadow max-h-40 overflow-y-auto"
            >
              <li
                v-for="rubrica in rubricasFiltradas"
                :key="rubrica.id"
                @mousedown.prevent="seleccionarRubrica(rubrica)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {{ rubrica.nombre }} ({{ $t(rubrica.rol.nombre.toLowerCase()) }})
              </li>
            </ul>

          </div>

          <div>
            <button
              @click="mostrarSelector = !mostrarSelector"
              class="btn-cancel"
            >
              {{ $t('cancelar') }}
            </button>
            <button
              @click="asignarRubrica"
              class="btn-confirm"
            >
              {{ $t('afegir') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <p>{{ $t('cargando') }}...</p>
    </div>

    <!-- Componente de confirmación -->
    <ConfirmacionEliminacion
      v-if="mostrarConfirmacion"
      :mensaje="$t('confirmarEliminarRubrica')"
      :visible="mostrarConfirmacion"
      @confirmado="eliminarRubrica"
      @cancelado="cancelarEliminacion"
    />
  </div>
</template>


<script>
import ConfirmacionEliminacion from '../ConfirmacionEliminacion.vue';  // Asegúrate de importar el componente de confirmación
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const toast = useToast()
export default {
  props: {
    areaId: {
      type: String,
      required: true
    }
  },
  components: {
    ConfirmacionEliminacion
  },
  data() {
    return {
      area: null,
      mostrarSelector: false,
      rubricasDisponibles: [],
      rubricaSeleccionada: null,
      busquedaRubrica: '',
      mostrarSugerencias: false,
      mostrarConfirmacion: false,  // Variable para controlar la visibilidad del modal de confirmación
      rubricaIdAEliminar: null,  // Para almacenar la rúbrica seleccionada para eliminar
    };
  },
  computed: {
    rubricasFiltradas() {
      const query = this.busquedaRubrica.toLowerCase();
      return this.rubricasDisponibles.filter(r =>
        r.nombre.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async obtenerDetallesArea() {
      try {
        const response = await api.get(`/areas/${this.areaId}`);
        this.area = response.data;
      } catch (error) {
        console.error('Error al obtener los detalles del área:', error);
      }
    },
    cerrarDetalles() {
      this.$emit('regresar');
    },
    confirmarEliminarRubrica(rubricaId) {
      this.rubricaIdAEliminar = rubricaId;
      this.mostrarConfirmacion = true;  // Mostrar el modal de confirmación
    },
    cancelarEliminacion() {
      this.mostrarConfirmacion = false;  // Cerrar el modal sin eliminar
      this.rubricaIdAEliminar = null;
    },

    async eliminarRubrica() {
      try {
        await api.delete(`/rubricas/desasignar`, {
          data: {
            areaId: this.areaId,
            rubricaId: this.rubricaIdAEliminar
          }
        });
        await this.obtenerDetallesArea();  // Refrescar los detalles después de la eliminación
        this.mostrarConfirmacion = false;  // Cerrar el modal de confirmación
      } catch (error) {
        console.error('Error al eliminar la rúbrica:', error);
        toast.error('Error al eliminar la rúbrica')
      }
    },
    async obtenerRubricasDisponibles() {
      try {
        const response = await api.get(`/rubricas`);
        this.rubricasDisponibles = response.data;
      } catch (error) {
        console.error('Error al obtener rúbricas disponibles:', error);
      }
    },
    seleccionarRubrica(rubrica) {
      this.rubricaSeleccionada = rubrica;
      this.busquedaRubrica = rubrica.nombre;
      this.mostrarSugerencias = false;
    },
    ocultarSugerenciasConRetraso() {
      setTimeout(() => {
        this.mostrarSugerencias = false;
      }, 200);  // Espera para permitir el clic
    },
    async asignarRubrica() {
      if (!this.rubricaSeleccionada) return;

      try {
        await api.post(`/rubricas/asignar`, {
          areaId: this.areaId,
          rubricaId: this.rubricaSeleccionada.id
        });

        this.mostrarSelector = false;
        this.rubricaSeleccionada = null;
        this.busquedaRubrica = '';
        
        await this.obtenerDetallesArea();  // Refrescar datos
      } catch (error) {
        console.error('Error al asignar rúbrica:', error);
        toast.error('Error al asignar rúbrica')
      }
    }
  },
  watch: {
    areaId() {
      this.obtenerDetallesArea();
    }
  },
  mounted() {
    this.obtenerDetallesArea();
    this.obtenerRubricasDisponibles();
  }
};
</script>

<style scoped>
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}
</style>
