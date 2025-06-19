<template>
  <div class="max-w-[90%] mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">{{ $t('rubrica.detailsTitle') }}</h2>
      <button @click="$emit('cerrarDetalles')" class="text-gray-700 hover:text-black">
        <font-awesome-icon icon="times" />
      </button>
    </div>

    <div v-if="rubrica">
      <h3 class="mt-4 text-lg font-semibold">{{ $t('rubrica.name') }}: {{ rubrica.nombre }}</h3>
      <p>{{ rubrica.descripcion }}</p>
      <p>{{ $t('rubrica.role') }}: {{ rubrica.rol.nombre }}</p>
    </div>

    <div v-if="!mostrarFormulario && !mostrarEditarCriterio && !mostrarEditarPunto">
      <h3 class="mt-4 text-lg font-semibold">{{ $t('rubrica.criteriaTitle') }}</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300 mt-4">
          <thead>
            <tr class="bg-gray-100 text-base">
              <th class="border px-4 py-2" colspan="2">{{ $t('rubrica.criteria') }}</th>
              <template v-if="puntosDeControl.length > 1">
                <th
                  v-for="punto in puntosDeControl"
                  :key="punto.puntoControlId"
                  class="border px-4 py-2"
                >
                  {{ punto.puntoControlNombre }} <br />
                  <button
                    @click="editarPuntoControl(punto)"
                    class="text-gray-700 text-xs font-semibold py-1 px-2 rounded hover:text-black transition duration-200"
                  >
                    <font-awesome-icon icon="pen" />
                  </button>
                </th>
                <th class="border px-4 py-2">{{ $t('rubrica.final') }}</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="criterio in criterios"
              :key="criterio.criterioId"
              class="text-center"
            >
              <td class="border w-0 whitespace-nowrap text-center">
                <button
                  @click="editarCriterio(criterio)"
                  class="text-gray-700 text-xs font-semibold py-1 px-3 rounded hover:text-black transition duration-200"
                >
                  <font-awesome-icon icon="pen" />
                </button>
              </td>
              <td class="border px-4 py-2 text-xs">
                {{ getNombreCriterio(criterio) }}
              </td>
              <template v-if="puntosDeControl.length > 1">
                <td
                  v-for="punto in puntosDeControl"
                  :key="punto.puntoControlId"
                  class="border px-4 py-2 text-xs"
                >
                  {{
                    criterio.puntosDeControl.find(
                      (p) => p.puntoControlId === punto.puntoControlId
                    )?.pesoRelacion
                  }}
                </td>
                <td class="border px-4 py-2">-</td>
              </template>
            </tr>
          </tbody>
          <tfoot v-if="puntosDeControl.length > 1">
            <tr class="border bg-gray-50 text-center text-sm">
              <td class="px-4 py-2 border" colspan="2">
                {{ $t('rubrica.percentagePerPoint') }}
              </td>
              <td
                v-for="punto in puntosDeControl"
                :key="punto.puntoControlId"
                class="px-4 py-2 border"
              >
                {{ punto.pesoPuntoControl }}%
              </td>
              <td class="px-4 py-2 border">{{ sumaPesos }}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Botón para mostrar el formulario -->
    <div class="mt-6" v-if="!mostrarFormulario && !mostrarEditarCriterio && !mostrarEditarPunto">
      <button @click="mostrarFormulario = true" class="btn-confirm">
        {{ $t('rubrica.addCriterion') }}
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
import CrearCriterio from "../crear/CrearCriterio.vue";
import editarCriterio from "../editar/editarCriteri.vue";
import editarPuntoControl from "../editar/editarPuntoControl.vue";
import api from '@/services/api'
import { useI18n } from 'vue-i18n'

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
        const res = await api.get(`/criterios/${this.rubricaId}/puntoControl`);
        this.rubrica = res.data.rubrica;
        this.criterios = res.data.criterios.sort((a, b) => a.criterioId - b.criterioId);

        const puntosRes = await api.get(`/rubricas/${this.rubricaId}/puntosDeControl`);
        this.puntosDeControl = puntosRes.data.map(punto => ({
          puntoControlId: punto.id,
          puntoControlNombre: punto.nombre,
          pesoPuntoControl: punto.peso
        })).sort((a, b) => a.puntoControlId - b.puntoControlId);

      } catch (error) {
        console.error("Error al obtener los datos de la rúbrica", error);
      }
    },
    getNombreCriterio(criterio) {
      const { locale } = useI18n()
      if (locale.value === 'ca') return criterio.criterioNombre
      if (locale.value === 'es' && criterio.criterioNombreEs !== null) return criterio.criterioNombreEs
      if (locale.value === 'en' && criterio.criterioNombreEn) return criterio.criterioNombreEn
      return criterio.criterioNombre
    },
    actualizarRubrica() {
      this.mostrarFormulario = false;
      this.mostrarEditarCriterio = null;
      this.mostrarEditarPunto = null;
      this.obtenerDatosRubrica();
    },
    editarCriterio(criterio) {
      this.mostrarEditarCriterio = criterio;
    },
    editarPuntoControl(punto) {
      this.mostrarEditarPunto = punto;
    }
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
