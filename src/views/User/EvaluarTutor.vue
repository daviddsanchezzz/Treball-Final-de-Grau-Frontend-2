<template>
  <div class="max-w-[100%] mx-auto bg-white" id="pdf-content">
    <EvaluarTrabajo 
      v-if="trabajo"
      :titulo="trabajo.titulo"
      :descripcion="trabajo.descripcion"
      :estudiante="trabajo.estudiante"
      :tutorId="trabajo.tutorId"
      :estado="trabajo.estado"
      :tutor="true"
      @cambiar-estado="cambiarEstadoTrabajo"
    />

    <div v-if="!mostrarResumen">

      <div v-if="criterios.length && puntosDeControl.length && datosCargados" class="mt-6">
        <table class="min-w-full border border-gray-300 mt-4">
          <thead>
            <tr class="bg-gray-100 text-base">
              <th class="border px-4 py-2">{{$t('criterios')}}</th>
              <template v-if="puntosDeControl.length > 1">
                <th v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="border px-4 py-2" colspan="2">
                  {{ punto.puntoControlNombre}} <br />
                </th>
                <th class="border px-4 py-2">Final</th>
              </template>
            </tr>
            <tr class="bg-gray-100 text-xs">
              <th class="border px-4 py-2"></th>
              <template v-for="(puntoControl, index) in puntosDeControl" :key="index">
                <th class="border px-4 py-2">{{$t('pes')}}</th>
                <th class="border px-4 py-2">{{$t('nota')}}</th>
              </template>
              <th class="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="criterio in criterios" :key="criterio.criterioId" class="text-center">
              <td class="border px-4 py-2 text-xs">
                {{ getNombreCriterio(criterio) }}
              </td>
              <template v-for="punto in puntosDeControl" :key="punto.puntoControlId">
                <td class="border px-4 py-2 text-xs">
                  {{
                    pesos[punto.puntoControlId][criterio.criterioId]
                  }}
                </td>
                <td class="border px-2 py-2"
                :class="notas[punto.puntoControlId] ? getNotaClase(notas[punto.puntoControlId][criterio.criterioId]) : ''"
                >
                  <input
                    v-if="pesos[punto.puntoControlId][criterio.criterioId] > 0"
                    type="number"
                    v-model.number="notas[punto.puntoControlId][criterio.criterioId]"
                    min="0"
                    max="10"
                    step="1"
                    class="w-16 p-1 text-xs border rounded text-center bg-white"
                    @input="onNotaChange(punto.puntoControlId)" 

                  />
                  <div v-else class=" px-4 py-2 text-xs">-</div>
                </td>
              </template>
            </tr>
          </tbody>
          <tfoot v-if="puntosDeControl.length > 1">
            <tr class="border bg-gray-50 text-center text-sm">
              <td class="px-4 py-2 border">{{$t('rubrica.percentagePerPoint')}}</td>
              <td v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="px-4 py-2 border" colspan="2">
                {{ punto.pesoPuntoControl }}%
              </td>
              <td class="px-4 py-2 border">{{ sumaPesos }}%</td>
            </tr>

            <tr class="border bg-gray-50 text-center text-sm">
              <td class="px-4 py-2 border">{{$t('numericaPunt')}}</td>
              <td v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="px-4 py-2 border" colspan="2"
              :class="getNotaClase(notasFinales[punto.puntoControlId])"
              >
              {{ (notasFinales[punto.puntoControlId] !== undefined && notasFinales[punto.puntoControlId] !== null) ? notasFinales[punto.puntoControlId].toFixed(1) : '-' }}
            </td>
              <td class="px-4 py-2 border flex flex-row"
              :class="getNotaClase(notaFinal)"
              >
              {{ notaFinal }} 
              <button
              @click="mostrarEditar=true"
              class="text-gray-700 hover:text-black ml-2"
            >
              <font-awesome-icon icon="pen" />
            </button>
            </td>
            </tr>

            <tr class="border bg-gray-50 text-center text-sm">
              <td class="px-4 py-2 border">{{$t('alfanumericaPunt')}}</td>
              <td v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="px-4 py-2 border" colspan="2">
                {{ notaAlfabetica(notasFinales[punto.puntoControlId]) }}
              </td>
              <td class="px-4 py-2 border"> {{ notaAlfabetica(notaFinal) }} </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Observaciones del punto de control -->
      <div class="mt-4" v-for="punto in puntosDeControl" :key="punto.puntoControlId">
        <label for="observaciones" class="block">{{$t('observacionsPunt')}} {{ punto.puntoControlNombre }}:</label>
        <input 
          type="text" 
          id="observaciones"
          v-model="observaciones[punto.puntoControlId]" 
          placeholder="..."
          class="mt-2 p-2 border border-gray-300 rounded w-full"
        />
        <div class="mt-6 flex justify-end">
          <button
            class="btn-confirm"
            @click="guardarEvaluacion(punto.puntoControlId)"
          >
            {{$t('guardarPunt')}} {{ punto.puntoControlNombre }}
          </button>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
          <button class="btn-second mx-4" @click="mostrarResumen = true">
            {{$t('resum')}}
          </button>
        
        <button
          class="btn-cancel"
          @click="$emit('cerrar')"
        >
          {{$t('tancar')}}
        </button>
      </div>
    </div>

    <editarNotaFinal
      v-if="mostrarEditar==true"
      :notaFinal="notaFinal"
      @restaurar="restaurarNotaFinal()"
      @guardar="(nuevaNota) => guardarNotaFinal(nuevaNota)"
      @cancelar="mostrarEditar=false"
    />

    <ResumenDefensa 
      v-if="mostrarResumen && trabajo"
      :titulo="trabajo.titulo"
      :descripcion="trabajo.descripcion"
      :estudiante="trabajo.estudiante"
      :estado="trabajo.estado"
      :tutor="true"
      :trabajo="trabajo"
      :criterios="criterios"
      :puntosDeControl="puntosDeControl"
      :notas="notas"
      :pesos="pesos"
      :observaciones="observaciones"
      :notasFinales="notasFinales"
      :notaFinal="notaFinal"
      :puntosFinal="sumaPesos"
      @cerrar="mostrarResumen=false"
      @cambiar-estado="cambiarEstadoTrabajo"
    />
  </div>
</template>

<script>
import EvaluarTrabajo from '../../components/EvaluarTrabajo.vue';
import editarNotaFinal from '../../components/editar/editarNotaFinal.vue';
import ResumenDefensa from './ResumenDefensa.vue';
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

import { useToast } from 'vue-toastification'

const toast = useToast()

export default {
  props: {
    trabajoId: Number,
  },
  components: {
    EvaluarTrabajo,
    ResumenDefensa,
    editarNotaFinal
  },
  data() {
    return {
      usuarioId: localStorage.getItem('usuarioId') || '',
      rubricaId: null,
      rubrica: null,
      criterios: [],
      puntosDeControl: {},
      notas: {},
      pesos: {},
      notasFinales: [],
      trabajo: null, // Variable para almacenar los datos del trabajo
      rol: null,
      observaciones: [],
      datosCargados: false,
      mostrarResumen: false,
      mostrarEditar: false,
      notaFinalDefensa: null,
    };
  },
  methods: {
    async cargarDatos() {
      try {
        // Obtener detalles del trabajo
        const trabajoRes = await api.get(`/trabajos/${this.trabajoId}`);
        this.trabajo = trabajoRes.data;
        console.log(this.trabajo)

        // Obtener rubricaId desde backend
        const datosRes = await api.get(`/trabajo/${this.trabajoId}/usuario/${this.usuarioId}/datos`);
        this.rubricaId = datosRes.data.rubricaId;
        this.rol = datosRes.data.rolNombre;

        // Obtener criterios y puntos de control usando rubricaId
        const rubricaRes = await api.get(`/criterios/${this.rubricaId}/puntoControl`);
        this.rubrica = rubricaRes.data.rubrica;
        this.criterios = rubricaRes.data.criterios;
        this.criterios.sort((a, b) => a.criterioId - b.criterioId);

        this.puntosDeControl = [];
        const puntosUnicos = {};

        this.pesos = {}; // Inicializa pesos vacío

        this.criterios.forEach(criterio => {
          criterio.puntosDeControl.forEach(punto => {
            const puntoId = punto.puntoControlId;
            const criterioId = criterio.criterioId;
            const peso = punto.pesoRelacion;

            if (!this.pesos[puntoId]) {
              this.pesos[puntoId] = {};
            }

            this.pesos[puntoId][criterioId] = peso;
          });
        });

        this.criterios.forEach(criterio => {
          criterio.puntosDeControl.forEach(puntoControl => {
            const clave = `${puntoControl.puntoControlId}-${puntoControl.puntoControlNombre}-${puntoControl.pesoPuntoControl}`;

            if (puntosUnicos[clave]) {
              puntosUnicos[clave].cantidad += 1;
            } else {
              puntosUnicos[clave] = {
                puntoControlId: puntoControl.puntoControlId,
                puntoControlNombre: puntoControl.puntoControlNombre,
                pesoPuntoControl: puntoControl.pesoPuntoControl,
                cantidad: 1
              };
            }
          });
        });

        this.puntosDeControl = Object.values(puntosUnicos);
        this.puntosDeControl.sort((a, b) => a.puntoControlId - b.puntoControlId);
        
        const evaluacionesRes = await api.get(`/${this.usuarioId}/evaluaciones/${this.trabajoId}/tutor`);

        // Inicializar la variable this.notas
        this.notas = {}; // Inicializar la estructura de notas vacía

        // Iterar sobre las evaluaciones y asignar las notas a la estructura this.notas
        evaluacionesRes.data.forEach((evaluacion) => {
          if (!this.notas[evaluacion.puntoControlId]) {
              this.notas[evaluacion.puntoControlId] = {};
          }
          this.observaciones[evaluacion.puntoControlId] = evaluacion.observacionPC;
          this.notasFinales[evaluacion.puntoControlId] = evaluacion.notaFinalPC;
          evaluacion.puntoControl.criterios.forEach((criterio) => {
            if (criterio.notas.length > 0) {
              this.notas[criterio.puntoControlId][criterio.criterioId] = criterio.notas[0].nota;
            }
            else{
              this.notas[criterio.puntoControlId][criterio.criterioId] = null;
            }
            

          });
        });

        this.datosCargados=true;
      } catch (error) {
        console.error("Error al cargar datos de evaluación:", error);
      }
    },
    async guardarEvaluacion(puntoControlId) {
      try {
        if (this.notas[puntoControlId] && typeof this.notas[puntoControlId] === 'object') {
          const notas = Object.values(this.notas[puntoControlId]);

          // Comprobamos que todas las notas estén entre 0 y 10 o sean null
          const todasValidas = notas.every(nota => {
            return (nota === null || (nota >= 0 && nota <= 10));
          });

          if (todasValidas) {
            const notaFinal = this.notasFinales[puntoControlId];
            const notaFinalPC = notaFinal !== undefined && notaFinal !== null
              ? parseFloat(notaFinal.toFixed(1))
              : null;          
            const observacionPC = this.observaciones[puntoControlId] || ''; 

            // 🔽 Guardar todas las notas individuales de los criterios
            const criteriosNotas = this.notas[puntoControlId];
            for (const criterioId in criteriosNotas) {
              const nota = criteriosNotas[criterioId];

              // Llamada al backend para cada nota
              await api.post('/notasTutor', {
                criterioId: parseInt(criterioId),
                puntoControlId: parseInt(puntoControlId),
                profesorId: this.usuarioId,
                trabajoId: this.trabajoId,
                nota: nota
              });
            }

            // 🔽 Guardar la nota final y observación del punto de control
            const response = await api.post('/evaluaciones/tutor', {
              trabajoId: this.trabajoId,         
              puntoControlId: puntoControlId,    
              notaFinalPC: notaFinalPC,         
              observacionPC: observacionPC,      
            });

            console.log('Evaluación guardada exitosamente:', response.data);
            toast.success(`Evaluació actualitzada correctament`)
          } else {
            toast.error(`Totes les notes han d'estar entre 0 i 10`);
          }
        }

      } catch (error) {
        console.error("Error al guardar la evaluación:", error);
        toast.error('Error al guardar la evaluació')
      }
    },
    async guardarNotaFinal(nota){
      try {
        const response = await api.put(`/trabajos/editarNotaTutor/${this.trabajoId}`, {
          nota: nota
        });

        this.notaFinalDefensa = nota;
        console.log('Nota final del tutor actualizada:', response.data);
        toast.success('Nota actualitzada correctament')
        this.mostrarEditar=false;

      } catch (error) {
        console.error('Error al guardar la nota final del tutor:', error);
      }

    },
    async restaurarNotaFinal(){
      try {
        const response = await api.put(`/trabajos/resetearNotaTutor/${this.trabajoId}`);

        this.notaFinalDefensa=null;
        console.log('Nota final del tutor reseteada:', response.data);
        this.mostrarEditar=false;
        toast.success('Nota restaurada correctament')
      } catch (error) {
        console.error('Error al resetear la nota final del tutor:', error);
      }


    },
    getNotaClase(nota) {
      const valor = parseInt(nota);
      if (isNaN(valor) || valor < 0 || valor > 10) return '';
      return `n${valor}`;
    },
    getNombreCriterio(criterio) {
      const { locale } = useI18n()
      if (locale.value === 'ca') return criterio.criterioNombre
      if (locale.value === 'es' && criterio.criterioNombreEs !== null && criterio.criterioNombreEs !== '') return criterio.criterioNombreEs
      if (locale.value === 'en' && criterio.criterioNombreEn !== null && criterio.criterioNombreEn !== '') return criterio.criterioNombreEn
      return criterio.criterioNombre
    },
    recalcularNotaFinal(puntoControlId) {
      let sumaNotas = 0;
      let sumaPesos = 0;

      // Iterar sobre los criterios de ese punto de control
      this.criterios.forEach(criterio => {
        // Verificar si la nota es válida (es decir, si existe una nota para ese criterio en el punto de control)
        if (this.notas[puntoControlId] && this.notas[puntoControlId][criterio.criterioId] !== null) {
          const nota = this.notas[puntoControlId][criterio.criterioId];
          const peso = this.pesos[puntoControlId][criterio.criterioId];

          // Sumar la nota multiplicada por el peso
          sumaNotas += (nota * peso);
          // Sumar el peso
          sumaPesos += peso;
        }
      });

      // Si hay pesos, calculamos la nota final
      if (sumaPesos > 0) {
        this.notasFinales[puntoControlId] = sumaNotas / sumaPesos;
      } else {
        this.notasFinales[puntoControlId] = 0;
      }
    },
    onNotaChange(puntoControlId) {
      // Recalcular la nota final cuando se cambia una nota
      this.recalcularNotaFinal(puntoControlId);
    },
    async cambiarEstadoTrabajo(nuevoEstado) {
      try {
        // Enviar la solicitud para cambiar el estado del trabajo
        const response = await api.put(`/trabajos/${this.trabajoId}/estados`, {
          nuevoEstado: nuevoEstado
        });

        // Actualizar el estado localmente
        this.trabajo.estado = nuevoEstado;
        console.log('Estado del trabajo actualizado:', response.data);
      } catch (error) {
        console.error('Error al cambiar el estado del trabajo:', error);
      }
    },
    
    // Ejemplo de llamada en el frontend con Axios
    async  obtenerNotaFinalTutor() {
      try {
        const response = await api.get(`/trabajos/nota-final-tutor/${this.trabajoId}`);
        
        if(response.data.notaFinalTutor != null){
          this.notaFinalDefensa = response.data.notaFinalTutor
        }
      } catch (error) {
        console.error('Error al obtener la nota final del tutor:', error);
      }
    }

    



  },
  mounted() {
    this.datosCargados = false;
    this.cargarDatos();
    this.obtenerNotaFinalTutor();

  },
  computed: {
    notaAlfabetica() {
    return (nota) => {
      if (nota === null) return '-';

      const valorNota = parseFloat(nota);  // Asegúrate de convertir la nota en número

      if (isNaN(valorNota)) return '-'; // Si no es un número, devuelve '-'

      if (valorNota >= 9) return 'A';
      if (valorNota >= 7) return 'B';
      if (valorNota >= 5) return 'C+';
      if (valorNota >= 3) return 'C-';
      return 'D';
    }
  },
    sumaPesos() {
      return this.puntosDeControl.reduce((total, punto) => total + (punto.pesoPuntoControl || 0), 0);
    },
    notaFinal() {
      if(this.notaFinalDefensa == null){
        let sum = 0;
        let totalPesos = 0;

        this.puntosDeControl.forEach(punto => {
          if (this.notasFinales[punto.puntoControlId] !== undefined && this.notasFinales[punto.puntoControlId] !== null) {
            sum += this.notasFinales[punto.puntoControlId] * punto.pesoPuntoControl;
            totalPesos += punto.pesoPuntoControl;
          }
        });

        return sum > 0 ? (sum / totalPesos).toFixed(1) : '-';
      }
      else{
        return this.notaFinalDefensa
      }
    }
  }
};
</script>
