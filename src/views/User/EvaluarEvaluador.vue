<template>
  <div class="max-w-[100%] mx-auto bg-white">
    <EvaluarTrabajo 
      v-if="trabajo"
      :titulo="trabajo.titulo"
      :descripcion="trabajo.descripcion"
      :estudiante="trabajo.estudiante"
      :tutorId="trabajo.tutorId"

    />

    <div class="overflow-x-auto mt-6" v-if="criterios.length && puntosDeControl.length">
      <table class="min-w-full border border-gray-300">
        <thead>
          <tr class="bg-gray-100 text-sm text-center">
            <th class="border px-4 py-2">{{$t('criterios')}}</th>
            <th class="border px-4 py-2">{{$t('entraFinal')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="criterio in criterios" :key="criterio.id" class="text-center">
            <td class="border px-4 py-2 text-sm">  {{ getNombreCriterio(criterio) }} </td>
            <td
            v-if="notas[criterio.criterioId]"
              class="border px-2 py-2"
              :class="getNotaClase(notas[criterio.criterioId]?.nota)"
            >
            <input
              v-if="notas[criterio.criterioId]"
              type="number"
              v-model.number="notas[criterio.criterioId].nota"
              min="0"
              max="10"
              step="1"
              class="w-16 p-1 text-sm border rounded text-center bg-white"
            />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="border bg-gray-50 text-center text-sm">
            <td class="px-4 py-2 border font-bold">{{$t('numericaFinal')}}</td>
            <td
              class="px-4 py-2 border font-bold"
              :class="getNotaClase(notaFinal)"
            >
              {{ notaFinal !== null ? notaFinal : '-' }}
            </td>
          </tr>
          <tr class="border bg-gray-50 text-center text-sm">
            <td class="px-4 py-2 border font-bold">{{$t('alfanumericaFinal')}}</td>
            <td
              class="px-4 py-2 border font-bold"
            >
              {{ notaAlfabetica }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="my-4">
      <div class="flex items-center">
        <label for="matriculaHonor" class="mr-4 text-sm font-medium text-gray-700">
          {{$t('mh')}}
        </label>
        <input 
          type="checkbox" 
          id="matriculaHonor"
          v-model="matriculaHonor"
          class="h-6 w-6 border-2 border-gray-300 rounded-full bg-white checked:bg-green-500 checked:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out"
        />
      </div>
          
      <div class="mt-4">
        <label for="observaciones" class="block">{{$t('observacions')}}:</label>
        <input 
          type="text" 
          id="observaciones"
          v-model="observaciones" 
          placeholder="..."
          class="mt-2 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div class="mt-6 flex justify-end">
        <button
        class="btn-cancel"
        @click="$emit('cerrar')"
      >
        {{$t('tancar')}}
      </button>
        <button
          class="btn-confirm"
          @click="guardarEvaluacion"
        >
        {{$t('guardarAvaluacio')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EvaluarTrabajo from '../../components/EvaluarTrabajo.vue';
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

const toast = useToast()

export default {
  props: {
    trabajoId: Number,
  },
  components: {
    EvaluarTrabajo,
  },
  data() {
    return {
      usuarioId: localStorage.getItem('usuarioId') || '',
      rubricaId: null,
      rubrica: null,
      criterios: [],
      puntosDeControl: [],
      notas: {},
      trabajo: null, // Variable para almacenar los datos del trabajo
      rol: null,
      matriculaHonor: false,
      observaciones: '',
    };
  },
  methods: {
    async cargarDatos() {
      try {
        // 1. Obtener detalles del trabajo
        const trabajoRes = await api.get(`/trabajos/${this.trabajoId}`);
        this.trabajo = trabajoRes.data;

        // 2. Obtener rubricaId desde backend
        const datosRes = await api.get(`/trabajo/${this.trabajoId}/usuario/${this.usuarioId}/datos`);
        this.rubricaId = datosRes.data.rubricaId;
        this.rol = datosRes.data.rolNombre;

        // 3. Obtener criterios y puntos de control usando rubricaId
        const rubricaRes = await api.get(`/criterios/${this.rubricaId}/puntoControl`);
        this.rubrica = rubricaRes.data.rubrica;
        this.criterios = rubricaRes.data.criterios;
        this.criterios.sort((a, b) => a.criterioId - b.criterioId);

        const puntosRes = await api.get(`/rubricas/${this.rubricaId}/puntosDeControl`);
        this.puntosDeControl = puntosRes.data;

        this.criterios.forEach(criterio => {
          this.notas[criterio.criterioId] = { nota: null };
        });
        // 4. Cargar evaluación y notas
        const evaluacionYNotas = await this.cargarEvaluacionYNotas(this.trabajoId, this.usuarioId);
        if (evaluacionYNotas) {
          this.matriculaHonor = evaluacionYNotas.matricula;
          this.observaciones = evaluacionYNotas.observaciones || '';
          evaluacionYNotas.notas.forEach(n => {
            if (n.cpc && n.cpc.criterioId !== undefined) {
              this.notas[n.cpc.criterioId] = n;
            }
          });
        }
      } catch (error) {
        console.error("Error al cargar datos de evaluación:", error);
      }
    },
    async cargarEvaluacionYNotas(trabajoId, evaluadorId) {
      try {
        // Buscar la evaluación y todas las notas asociadas al trabajo y evaluador
        const evaluacionConNotas = await api.get(`/evaluaciones/${trabajoId}/evaluador/${evaluadorId}`);

        if (evaluacionConNotas.data) {
          return evaluacionConNotas.data;  // Devuelves la evaluación y las notas asociadas
        } else {
          return null;  // Si no existe la evaluación ni las notas, devuelves null
        }
      } catch (error) {
        console.error("Error al cargar la evaluación y las notas:", error);
      }
    },
    async guardarEvaluacion() {
      try {
        for (const criterioId in this.notas) {
          const notaObj = this.notas[criterioId];
          const nota = notaObj?.nota;
          // Si la nota es null o un número entre 0 y 10, la validación pasa
          if (nota !== null && (isNaN(nota) || nota < 0 || nota > 10)) {
            toast.error(`Totes les notes han d'estar entre 0 y 10`);
            return;  // Salimos si alguna nota no es válida
          }
        }        
    
        const notasPromises = Object.keys(this.notas).map(async (criterioId) => {
        const notaObj = this.notas[criterioId];
        if (notaObj && notaObj.nota !== null && notaObj.nota !== '') {
          await api.post('/notasEvaluador', {
            criterioId: parseInt(criterioId),
            profesorId: parseInt(this.usuarioId),
            trabajoId: parseInt(this.trabajo.id),
            nota: parseFloat(notaObj.nota),
          });
        }
      });

        await Promise.all(notasPromises);

        const evaluacionData = {
          trabajoId: parseInt(this.trabajo.id),
          evaluadorId: parseInt(this.usuarioId),
          observaciones: this.observaciones || '',
          matricula: this.matriculaHonor,
          notaFinal: parseFloat(this.notaFinal),
        };

        const response = await api.post('/evaluaciones/evaluador', evaluacionData);
        if (response.status === 201 || response.status === 200) {
          toast.success('Evaluació guardada correctament')
        }

      } catch (error) {
        console.error("Error al guardar la evaluación:", error);
        toast.error('Error al guardar la evaluació')
      }
    },
    getNombreCriterio(criterio) {
      const { locale } = useI18n()
      if (locale.value === 'ca') return criterio.criterioNombre
      if (locale.value === 'es' && criterio.criterioNombreEs !== null && criterio.criterioNombreEs !== '') return criterio.criterioNombreEs
      if (locale.value === 'en' && criterio.criterioNombreEn !== null && criterio.criterioNombreEn !== '') return criterio.criterioNombreEn
      return criterio.criterioNombre
    },

    getNotaClase(nota) {
      const valor = parseInt(nota);
      if (isNaN(valor) || valor < 0 || valor > 10) return '';
      return `n${valor}`;
    }
  },
  mounted() {
    this.cargarDatos();
  },
  computed: {
    notaFinal() {
      const notasNumericas = Object.values(this.notas)
        .map(n => n?.nota)
        .filter(n => n !== null && n !== '' && !isNaN(n));

      if (notasNumericas.length === 0) return null;

      const suma = notasNumericas.reduce((acc, curr) => acc + parseFloat(curr), 0);
      return (suma / notasNumericas.length).toFixed(1);
    },
    notaAlfabetica() {
    const nota = this.notaFinal;
    if (nota === null) return '-';

    if (nota >= 9) return 'A';
    if (nota >= 7) return 'B';
    if (nota >= 5) return 'C+';
    if (nota >= 3) return 'C-';
    return 'D';  
  }


  }
};
</script>
