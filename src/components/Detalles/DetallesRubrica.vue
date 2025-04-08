<template>
  <div class="max-w-[90%] mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">Detalls de la Rúbrica</h2>
      <button @click="$emit('cerrarDetalles')" class="text-gray-700 hover:text-black">
        <font-awesome-icon icon="times" />
      </button>
    </div>

    <div v-if="rubrica">
      <h3 class="mt-4 text-lg font-semibold">Nom: {{ rubrica.nombre }}</h3>
      <p>{{ rubrica.descripcion }}</p>
      <p>Rol: {{ rubrica.rol.nombre }}</p>
    </div>

    <div v-if="criterios.length && !mostrarFormulario && !mostrarEditarCriterio && !mostrarEditarPunto">
      <h3 class="mt-4 text-lg font-semibold">Criteris i Punts de Control</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300 mt-4">
          <thead>
            <tr class="bg-gray-100 text-base">
              <th class="border px-4 py-2" colspan="2">Criteris</th>
              <template v-if="puntosDeControl.length > 1">
                <th v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="border px-4 py-2">
                  {{ punto.puntoControlNombre }} <br />
                  <button
                    @click="editarPuntoControl(punto)"
                    class="text-gray-700 text-xs font-semibold py-1 px-2 rounded hover:text-black transition duration-200"
                  >
                    <font-awesome-icon icon="pen" />
                  </button>
                </th>
                
                <th class="border px-4 py-2">Final</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="criterio in criterios" :key="criterio.criterioId" class="text-center">
              <td class="border w-0 whitespace-nowrap text-center"> 
                <button
                  @click="editarCriterio(criterio)"
                  class="text-gray-700 text-xs font-semibold py-1 px-3 rounded hover:text-black transition duration-200"
                >
                  <font-awesome-icon icon="pen" />
                </button>
              </td>
              <td class="border px-4 py-2 text-xs">
                {{ criterio.criterioNombre }}
                <div class="flex justify-center mt-2">
                </div>
              </td>
              <template v-if="puntosDeControl.length > 1">
                <td v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="border px-4 py-2 text-xs">
                  {{
                    criterio.puntosDeControl.find(p => p.puntoControlId === punto.puntoControlId)?.pesoRelacion
                  }}
                </td>
                <td class="border px-4 py-2">-</td>
              </template>
            </tr>
          </tbody>
          <tfoot v-if="puntosDeControl.length > 1">
            <tr class="border bg-gray-50 text-center text-sm">
              <td class="px-4 py-2 border" colspan="2">Percentatge de cada punt de control</td>
              <td v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="px-4 py-2 border">
                {{ punto.pesoPuntoControl }}%
              </td>
              <td class="px-4 py-2 border">{{ sumaPesos }}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div v-else>
      <p class="text-gray-500"> </p>
    </div>

    <!-- Botón para mostrar el formulario -->
    <div class="mt-6" v-if="!mostrarFormulario && !mostrarEditarCriterio && !mostrarEditarPunto">
      <button
        @click="mostrarFormulario = true"
        class="btn-confirm"
      >
        Afegir Criteri
      </button>
    </div>

    <!-- Componente CrearCriterio -->
    <CrearCriterio
      v-if="mostrarFormulario"
      :rubricaId="rubricaId"
      :PuntosControl="puntosDeControl"
      @cerrar="actualizarRubrica"
    />
    <editarCriterio
      v-if="mostrarEditarCriterio"
      :criterio="mostrarEditarCriterio"
      @cerrar="actualizarRubrica"
    />

    <editarPuntoControl 
      v-if="mostrarEditarPunto"
      :punto="mostrarEditarPunto"
      @cerrar="actualizarRubrica"
    />

  
  </div>
</template>

<script>
import axios from "axios";
import CrearCriterio from "../crear/CrearCriterio.vue";
import editarCriterio from "../editar/editarCriteri.vue";
import editarPuntoControl from "../editar/editarPuntoControl.vue";


export default {
  components: {
    CrearCriterio,
    editarCriterio,
    editarPuntoControl
  },
  props: {
    rubricaId: Number,
  },
  data() {
    return {
      rubrica: null,
      criterios: [],
      puntosDeControl: [],
      mostrarFormulario: false, 
      mostrarEditarCriterio: null,
      mostrarEditarPunto: null
    };
  },
  methods: {
    async obtenerDatosRubrica() {
      try {
        const res = await axios.get(`http://localhost:3000/criterios/${this.rubricaId}/puntoControl`);
        
        this.rubrica = res.data.rubrica;
        this.criterios = res.data.criterios;

        // Obtener la lista única de puntos de control con su peso
        this.puntosDeControl = [];
        res.data.criterios.forEach((criterio) => {
          criterio.puntosDeControl.forEach((punto) => {
            if (!this.puntosDeControl.some((p) => p.puntoControlId === punto.puntoControlId)) {
              this.puntosDeControl.push({
                puntoControlId: punto.puntoControlId,
                puntoControlNombre: punto.puntoControlNombre,
                pesoPuntoControl: punto.pesoPuntoControl,
              });
            }
          });
        });
      } catch (error) {
        console.error("Error al obtener los datos de la rúbrica", error);
      }
    },
    actualizarRubrica() {
      this.mostrarFormulario = false;
      this.mostrarEditarCriterio = null;
      this.mostrarEditarPunto = null
      this.obtenerDatosRubrica();
    },
    editarCriterio(criterio) {
      this.mostrarEditarCriterio = criterio
    },
    editarPuntoControl(punto) {
      this.mostrarEditarPunto=punto
    },
  },
  mounted() {
    this.obtenerDatosRubrica();
  },
  computed: {
    sumaPesos() {
      return this.puntosDeControl.reduce((total, punto) => total + (punto.pesoPuntoControl || 0), 0);
    }
  }
};
</script>
