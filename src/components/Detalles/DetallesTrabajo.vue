<template>
  <div class="relative p-6 border rounded-lg shadow">
    <!-- Cruz para cerrar -->
    <button @click="$emit('cerrar')" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl">
      &times; <!-- Cruz -->
    </button>

    <h3 class="text-xl font-semibold mb-4 text-gray-800">Detalls del treball</h3>
    <p class="mb-2"><strong>Títol:</strong> {{ trabajo.titulo }}</p>
    <p class="mb-2"><strong>Estudiant:</strong> {{ trabajo.estudiante }}</p>
    <p class="mb-2"><strong>Descripció:</strong> {{ trabajo.descripcion || 'No disponible' }}</p>

    <!-- Tutor -->
    <p class="mb-2"><strong>Tutor:</strong> {{ tutorNombre || 'No assignat' }}</p>

    <!-- Área -->
    <p class="mb-2"><strong>Àrea:</strong> {{ areaNombre || 'No assignada' }}</p>

    <!-- Evaluadores -->
    <p class="mb-2"><strong>Avaluadors:</strong></p>
    <div v-if="evaluadores.length > 0">
      <div v-for="(evaluador) in evaluadores" :key="evaluador.id" class="flex items-center justify-between px-3 hover:bg-white transition border-b border-gray-200">
        <div class="flex items-center space-x-4">
          <span class="text-gray-800 font-medium">{{ evaluador.nombre }}</span>
        </div>
        <button @click="mostrarConfirmacion(evaluador.id)" 
                class="text-gray-700 hover:black text-lg px-4 py-2 transition">
          <font-awesome-icon icon="trash" />
        </button>
      </div>
    </div>
    
    <div v-else>
      No hi ha avaluadors assignats
    </div>

    <!-- Componente de confirmación de eliminación -->
    <ConfirmacionEliminacion
      v-if="confirmacionVisible"
      :mensaje="`Estàs segur que vols eliminar l'avaluador?`"
      :visible="confirmacionVisible"
      @confirmado="eliminarEvaluador"
      @cancelado="cancelarEliminacion"
    />

    <!-- Botón para añadir evaluadores -->
    <button @click="toggleMostrarSelectorEvaluadores" class="mt-4 text-white px-4 py-2 rounded btn-confirm ml-0">
      Afegir Avaluadors
    </button>

    <!-- Selector de evaluadores -->
    <div v-if="mostrarSelectorEvaluadores" class="absolute bottom-0 left-0 w-full h-[calc(100%-20px)] bg-gray-500 bg-opacity-50 flex justify-center items-start pt-10">
      <div class="bg-white p-6 rounded-lg shadow-lg max-h-full w-full md:w-96">
        <h4 class="text-lg mb-4">Selecciona un avaluador</h4>

        <!-- Buscador de evaluadores -->
        <input
          v-model="busquedaEvaluador"
          @focus="mostrarSugerencias = true"
          @blur="ocultarSugerenciasConRetraso"
          type="text"
          placeholder="Cerca un avaluador"
          class="w-full px-4 py-2 border rounded-md"
        />

        <ul
          v-if="mostrarSugerencias && evaluadoresFiltrados.length > 0"
          class="border mt-1 rounded-md bg-white shadow max-h-40 overflow-y-auto"
        >
          <li
            v-for="evaluador in evaluadoresFiltrados"
            :key="evaluador.id"
            @mousedown.prevent="seleccionarEvaluador(evaluador)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {{ evaluador.nombre }}
          </li>
        </ul>
        
        <div class="mt-4">
          <button @click="cerrarSelector" class="btn-cancel text-black px-4 py-2 rounded ">
            Cancel·lar
          </button>
          <button @click="añadirEvaluador" class="btn-confirm ml-4 text-white px-4 py-2 rounded " :disabled="!evaluadorSeleccionado">
            Afegir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ConfirmacionEliminacion from '../ConfirmacionEliminacion.vue';

export default {
  name: 'DetallesTrabajo',
  components: {
    ConfirmacionEliminacion,
  },
  props: {
    trabajo: Object,
  },
  data() {
    return {
      tutorNombre: null,
      evaluadores: [],
      areaNombre: null,
      confirmacionVisible: false,
      eliminarId: null,
      mostrarSelectorEvaluadores: false,  // Esta es la propiedad del estado
      busquedaEvaluador: '',
      evaluadorSeleccionado: null,
      evaluadoresDisponibles: [],
      mostrarSugerencias: false,
    };
  },
  computed: {
    evaluadoresFiltrados() {
      const query = this.busquedaEvaluador.toLowerCase();
      return this.evaluadoresDisponibles.filter(evaluador =>
        evaluador.nombre.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    async obtenerEvaluadores() {
      if (this.trabajo.id) {
        try {
          const response = await axios.get(`http://localhost:3000/trabajos/${this.trabajo.id}/evaluadores`);
          this.evaluadores = response.data.evaluadores || [];
        } catch (error) {
          console.error('Error al obtener los evaluadores', error);
          this.evaluadores = [];
        }
      }
    },

    toggleMostrarSelectorEvaluadores() {
      this.mostrarSelectorEvaluadores = !this.mostrarSelectorEvaluadores;
      if (this.mostrarSelectorEvaluadores) {
        this.obtenerEvaluadoresDisponibles();
      }
    },

    async obtenerEvaluadoresDisponibles() {
      try {
        const response = await axios.get('http://localhost:3000/usuarios');
        this.evaluadoresDisponibles = response.data.filter(usuario =>
          !this.evaluadores.some(evaluador => evaluador.id === usuario.id)
        );
      } catch (error) {
        console.error('Error al obtener evaluadores disponibles', error);
      }
    },

    seleccionarEvaluador(evaluador) {
      this.evaluadorSeleccionado = evaluador;
      this.busquedaEvaluador = evaluador.nombre;
      this.mostrarSugerencias = false;
    },

    ocultarSugerenciasConRetraso() {
      setTimeout(() => {
        this.mostrarSugerencias = false;
      }, 200);
    },

    async añadirEvaluador() {
      if (this.evaluadorSeleccionado) {
        try {
          await axios.post(`http://localhost:3000/trabajos/asignarEvaluador`, {
            usuarioId: this.evaluadorSeleccionado.id,
            trabajoId: this.trabajo.id,
          });

          this.obtenerEvaluadores();
          this.mostrarSelectorEvaluadores = false;
          this.busquedaEvaluador = '';
        } catch (error) {
          console.error('Error al añadir evaluador', error);
        }
      }
    },

    cerrarSelector() {
      this.mostrarSelectorEvaluadores = false;
    },

    mostrarConfirmacion(id) {
      this.eliminarId = id;
      this.confirmacionVisible = true;
    },

    async eliminarEvaluador() {
      try {
        await axios.delete(`http://localhost:3000/trabajos/${this.trabajo.id}/evaluador/${this.eliminarId}`);
        await this.obtenerEvaluadores();
        this.confirmacionVisible = false;
      } catch (error) {
        console.error('Error al eliminar el evaluador', error);
        this.confirmacionVisible = false;
      }
    },

    cancelarEliminacion() {
      this.confirmacionVisible = false;
    },

    async obtenerTutorYArea() {
      try {
        if (this.trabajo.tutorId) {
          const tutorResponse = await axios.get(`http://localhost:3000/usuarios/${this.trabajo.tutorId}`);
          this.tutorNombre = tutorResponse.data.nombre;
        } else {
          this.tutorNombre = 'No assignat';
        }

        if (this.trabajo.areaId) {
          const areaResponse = await axios.get(`http://localhost:3000/areas/${this.trabajo.areaId}`);
          this.areaNombre = areaResponse.data.area;

        } else {
          this.areaNombre = 'No assignada';
        }
      } catch (error) {
        console.error('Error obtenint tutor o àrea:', error);
        this.tutorNombre = 'Error';
        this.areaNombre = 'Error';
      }
    },

  },
  mounted() {
    this.obtenerEvaluadores();
    this.obtenerTutorYArea();
  },
};
</script>
