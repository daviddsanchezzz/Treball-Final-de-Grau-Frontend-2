<template>
  <div class="min-h-screen bg-gray-100 pb-2">
    <HeaderComp
      :usuario="usuarioNombre"
      :es-admin="esAdmin"
      :user-id="usuarioId"
    />
    <div class="max-w-6xl mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow space-y-8 my-8">
      <!-- Header -->
      <div class="space-y-8" v-if="!mostrarTrabajoEvaluador && !mostrarTrabajoTutor">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold text-gray-800">{{ $t('mis_trabajos') }}</h2>

          <!-- Filtro de Estado -->
          <div class="mt-4">
            <label for="estado" class="block text-sm font-medium text-gray-700">{{ $t('filtrar_estado') }}</label>
            <select
              v-model="estadoFiltro"
              id="estado"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">{{ $t('todos') }}</option>
              <option value="PENDIENTE">{{ $t('pendiente') }}</option>
              <option value="EN_PROGRESO">{{ $t('en_progreso') }}</option>
              <option value="FINALIZADO">{{ $t('finalizado') }}</option>
            </select>
          </div>
        </div>

        <!-- Buscador -->
        <div class="mt-6">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('buscar_trabajo')"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <!-- Lista de trabajos -->
        <div v-if="trabajos.length > 0" class="mt-6">
          <ul class="divide-y divide-gray-200">
            <li
              v-for="(trabajo, index) in filteredTrabajos"
              :key="index"
              class="p-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div>
                <p class="text-gray-800 font-medium">{{ trabajo.trabajo.titulo }}</p>

                <div class="flex flex-row  items-center">
                  <p class="text-gray-600 text-sm mr-4">{{ $t('estudiante') }}: {{ trabajo.trabajo.estudiante }}</p>
                  <p 
                    class="text-white text-[10px] px-1 py-0.5 rounded-full ml-2 font-medium"
                    :class="rolClases(trabajo.rol)"
                  >
                    {{ $t(trabajo.rol.toLowerCase())    }}
                    
                  </p>
                </div>
              </div>
              <div class="flex gap-4 items-center">
                <span
                  v-if="trabajo.trabajo.estado"
                  class="text-white text-[10px] px-1 py-0.5 rounded-full ml-2 font-medium"
                  :class="estadoClases(trabajo.trabajo.estado)"
                >
                  {{ estadoTexto(trabajo.trabajo.estado) }}
                </span>
                <button
                  @click="evaluarTrabajo(trabajo.trabajo.id, trabajo.rol)"
                  class="btn-confirm px-2 py-1 rounded-md transition"
                >
                  {{ $t('evaluar') }}
                </button>
              </div>
            </li>
          </ul>
        </div>

        <div v-else class="mt-6">
          <p class="text-lg text-gray-600">{{ $t('sin_trabajos') }}</p>
        </div>
      </div>

      <EvaluarEvaluador  
        v-if="mostrarTrabajoEvaluador"
        :trabajoId="mostrarTrabajoEvaluador"
        @cerrar="cerrarEvaluador()"
      />
      <EvaluarTutor 
        v-if="mostrarTrabajoTutor"
        :trabajoId="mostrarTrabajoTutor"
        @cerrar="cerrarEvaluador()"
      />
    </div>
  </div>
</template>


<script>
import HeaderComp from '@/components/HeaderComp.vue'
import EvaluarTutor from './User/EvaluarTutor.vue'
import EvaluarEvaluador from './User/EvaluarEvaluador.vue'
import api from '@/services/api'



export default {
  name: 'MisTrabajos',
  components: {
    HeaderComp,
    EvaluarTutor,
    EvaluarEvaluador
  },
  data() {
    return {
      usuarioId: localStorage.getItem('usuarioId') || '',
      usuarioNombre: localStorage.getItem('nombre') || '',
      esAdmin: localStorage.getItem('esAdmin') === 'true',
      trabajos: [],
      searchQuery: '',
      estadoFiltro: '',
      mostrarTrabajoEvaluador: null,
      mostrarTrabajoTutor:null,
    }
  },
  computed: {
    filteredTrabajos() {
      return this.trabajos.filter(trabajo => {
        const lowerSearchQuery = this.searchQuery.toLowerCase()
        const matchesSearchQuery = trabajo.trabajo.titulo.toLowerCase().includes(lowerSearchQuery)
        const matchesEstadoFiltro = this.estadoFiltro
          ? trabajo.trabajo.estado === this.estadoFiltro
          : true
        return matchesSearchQuery && matchesEstadoFiltro
      })
    },
  },
  methods: {
    async obtenerTrabajos() {
      try {
        const response = await api.get(`/usuarios/${this.usuarioId}/trabajos`)
        let trabajos = response.data;

        // Definimos el orden para los estados y los roles
        const estadoOrden = { PENDIENTE: 2, EN_PROGRESO: 1, FINALIZADO: 3 };
        const rolOrden = { Tutor: 1, Evaluador: 2 };

        // Ordenar los trabajos primero por estado y luego por rol
        trabajos = trabajos.sort((a, b) => {
          const estadoA = estadoOrden[a.trabajo.estado] || 99;
          const estadoB = estadoOrden[b.trabajo.estado] || 99;
          if (estadoA !== estadoB) {
            return estadoA - estadoB;
          }

          const rolA = rolOrden[a.rol] || 99;
          const rolB = rolOrden[b.rol] || 99;
          return rolA - rolB;
        });

        this.trabajos = trabajos;
        console.log(this.trabajos)
      } catch (error) {
        console.error('Error al obtener los trabajos:', error)
      }
    },

    evaluarTrabajo(trabajoId, trabajoRol) {
      if(trabajoRol == "Tutor"){
        this.mostrarTrabajoTutor = trabajoId
      }
      else{
        this.mostrarTrabajoEvaluador = trabajoId
      }
    },
    estadoClases(estado) {
      const clases = {
        PENDIENTE: 'bg-yellow-500',
        EN_PROGRESO: 'bg-blue-500',
        FINALIZADO: 'bg-green-500',
      }
      return clases[estado] || 'bg-gray-500'
    },
    estadoTexto(estado) {
      const textos = {
        PENDIENTE: this.$t('pendiente'),
        EN_PROGRESO: this.$t('en_progreso'),
        FINALIZADO: this.$t('finalizado'),
      }
      return textos[estado] || 'Desconegut'
    },
    rolClases(rol) {
      const clases = {
        Tutor: 'bg-purple-500',      // Morado para tutor
        Evaluador: 'bg-teal-500',    // Verde-azulado para evaluador
      }
      return clases[rol] || 'bg-gray-400'; // Gris si no reconoce el rol
    },

    cerrarEvaluador(){
      this.mostrarTrabajoEvaluador=null;
      this.mostrarTrabajoTutor=null;
      this.obtenerTrabajos();
    }
  },
  mounted() {
    this.obtenerTrabajos()
  },
}
</script>

<style scoped>
input {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 5px rgba(59, 130, 246, 0.4);
}

li:hover {
  background-color: #f9fafb;
}
</style>
