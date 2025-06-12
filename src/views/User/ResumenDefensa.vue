<template>
    <div class="max-w-[100%] mx-auto bg-white py-4">
      <div id="pdf-content">

        <div class="text-xl font-semibold mb-4">
          Resum de la rúbrica del Tutor
        </div>
    
        <div class="mt-6">
          <table class="min-w-full border border-gray-300">
            <thead>
              <tr class="bg-gray-100 text-base">
                <th class="border px-4 py-2">Criteris</th>
                <template v-if="puntosDeControl.length > 1">
                  <th v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="border px-4 py-2" colspan="2">
                    {{ punto.puntoControlNombre }}
                  </th>
                  <th class="border px-4 py-2">Final</th>
                </template>
              </tr>
              <tr class="bg-gray-100 text-xs">
                <th class="border px-4 py-2"></th>
                <template v-for="(puntoControl, index) in puntosDeControl" :key="index">
                  <th class="border px-4 py-2">Pes</th>
                  <th class="border px-4 py-2">Nota</th>
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
                    {{ pesos[punto.puntoControlId][criterio.criterioId] }}
                  </td>
                  <td class="border px-2 py-2 text-xs"
                  :class="getNotaClase(notas[punto.puntoControlId][criterio.criterioId])"
                  >
                    {{ notas[punto.puntoControlId][criterio.criterioId] }}
                  </td>
                </template>
                <td class="border px-4 py-2 text-xs"></td>
              </tr>
            </tbody>
            <tfoot v-if="puntosDeControl.length > 1">
              <tr class="border bg-gray-50 text-center text-sm">
                <td class="px-4 py-2 border">Percentatge de cada punt de control</td>
                <td v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="px-4 py-2 border" colspan="2">
                  {{ punto.pesoPuntoControl }}%
                </td>
                <td class="px-4 py-2 border">{{ puntosFinal }}%</td>
              </tr>
    
              <tr class="border bg-gray-50 text-center text-sm">
                <td class="px-4 py-2 border">Nota numèrica de cada punt de control</td>
                <td v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="px-4 py-2 border" colspan="2"
                :class="getNotaClase(notasFinales[punto.puntoControlId])"
                >
                  {{ (notasFinales[punto.puntoControlId] !== undefined && notasFinales[punto.puntoControlId] !== null) 
                    ? notasFinales[punto.puntoControlId].toFixed(1) 
                    : '-' }}
                </td>
                <td class="px-4 py-2 border" :class="getNotaClase(notaFinal)">
                  {{ notaFinal }}
                </td>
              </tr>
    
              <tr class="border bg-gray-50 text-center text-sm">
                <td class="px-4 py-2 border">Nota alfanumèrica de cada punt de control</td>
                <td v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="px-4 py-2 border" colspan="2">
                  {{ notaAlfabetica(notasFinales[punto.puntoControlId]) }}
                </td>
                <td class="px-4 py-2 border"> 
                  {{ notaAlfabetica(notaFinal) }} 
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
    
        <div v-for="punto in puntosDeControl" :key="punto.puntoControlId" class="mt-4">
          <h3 class="font-medium">Observacions per al punt de control {{ punto.puntoControlNombre }}:</h3>
          <p class="text-xs">{{ observaciones[punto.puntoControlId] }}</p>
        </div>

        <div class="mt-8 mb-4" v-if="evaluadores.length > 0">
          <div class="text-xl font-semibold">
            Resum de les rúbriques dels Evaluadors

          </div>


          <div class="overflow-x-auto mt-6" v-if="criteriosEvaluadores.length && puntosDeControlEvaluadores.length">
            <table class="min-w-full border border-gray-300">
              <thead>
                <tr class="bg-gray-100 text-sm text-center">
                  <th class="border px-4 py-2">Criteris</th>
                  <template v-for="(evaluador, index) in evaluadores" :key="evaluador.evaluadorId">
                    <th class="border px-4 py-2">Avaluador {{index+1}}</th>
                  </template>
                  <th class="border px-4 py-2">Final</th>

                </tr>
              </thead>
              <tbody>
                <tr v-for="criterio in criteriosEvaluadores" :key="criterio.id" class="text-center text-sm">
                  <td class="border px-4 py-2 ">{{ getNombreCriterio(criterio) }}</td>
                  <template v-for="evaluador in evaluadores" :key="evaluador.evaluadorId">
                    <td class="border px-4 py-2"
                      :class="getNotaClase(evaluador.criterios[criterio.criterioId] )"
                    > {{ evaluador.criterios[criterio.criterioId] }} </td>
                  </template>
                  <td class="border px-2 py-2"
                    :class="getNotaClase(notasMediasFinales[criterio.criterioId])"
                  > {{notasMediasFinales[criterio.criterioId].toFixed(1)}}</td>

                </tr>
            
                <tr class="border bg-gray-50 text-center text-sm">
                  <td class="px-4 py-2 border font-semibold">Nota numerica final</td>
                  <template v-for="evaluador in evaluadores" :key="evaluador.evaluadorId">
                    <td class="border px-4 py-2"
                      :class="getNotaClase(evaluador.notaFinal)"
                    > {{ evaluador.notaFinal }}</td>
                  </template>
                  <td class="px-4 py-2 border font-semibold"
                    :class="getNotaClase(notaFinalEvaluadores)"
                  > {{notaFinalEvaluadores}}</td>


                </tr>
                <tr class="border bg-gray-50 text-center text-sm">
                  <td class="px-4 py-2 border font-semibold">Nota alfabetica final</td>
                  <template v-for="evaluador in evaluadores" :key="evaluador.evaluadorId">
                    <td class="border px-4 py-2">  {{ notaAlfabetica(evaluador.notaFinal) }}</td>
                  </template>
                  <td class="px-4 py-2 border font-semibold"> {{ notaAlfabetica(notaFinalEvaluadores) }}</td>
                </tr>

                <tr class="border bg-gray-50 text-center text-sm">
                  <td class="px-4 py-2 border font-semibold">Treball propost per matricula d'honor</td>
                  <template v-for="evaluador in evaluadores" :key="evaluador.evaluadorId">
                    <td class="border px-4 py-2">  {{ evaluador.matricula ? 'Sí' : 'No' }}</td>
                  </template>
                  <td class="px-4 py-2 border font-semibold"> </td>

                </tr>
              </tbody>
            </table>
          </div>
      

          <div v-for="(evaluador, index) in evaluadores" :key="evaluador.evaluadorId" class="mt-4">
            <h3 class="font-medium">Observacions de l'avaluador {{ index+1 }}:</h3>
            <p class="text-xs"> {{evaluador.observaciones}}</p>
          </div>

          <div class="mt-8 mb-4">
            <table class="min-w-full border border-gray-300">
              <thead>
                <tr class="bg-gray-100 text-sm text-center">
                  <td class="px-4 py-2 border font-bold">Avaluació Final</td>
                  <td class="px-4 py-2 border font-bold">Percentatge</td>
                  <td class="px-4 py-2 border font-bold">Nota</td>
                </tr>
              </thead>
              <tbody class="text-center text-sm" >
                <tr>
                  <td class="px-4 py-2 border">Avaluació Tutor</td>
                  <td class="px-4 py-2 border">{{ percentatgeFinalTutor }} %</td>
                  <td class="px-4 py-2 border"
                    :class="getNotaClase(localNotaFinal)"
                  >{{localNotaFinal}}</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 border">Avaluació Avaluadors</td>
                  <td class="px-4 py-2 border"> {{percentatgeFinalAvaluadors}} % </td>
                  <td class="px-4 py-2 border"
                    :class="getNotaClase(notaFinalEvaluadores)"
                  >{{notaFinalEvaluadores}}</td>
                </tr>
              
                <tr class="border bg-gray-50 text-center text-sm font-semibold">
                  <td class="px-4 py-2 border">Nota final del treball</td>
                  <td class="px-4 py-2 border">100%</td>
                  <td class="px-4 py-2 border"
                  :class="getNotaClase(notaFinalTrabajo)"
                  >{{notaFinalTrabajo}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>  

      </div>


      <div class="mt-6 flex justify-end">     
        <button
            class="btn-second mx-4"
            @click="exportarAPdf()"
        >
            Exportar a PDF
        </button>   
        <button
            class="btn-confirm mr-4"
            @click="guardarEvaluacionFinal()"
            v-if="evaluadores.length > 0"
        >
            Guardar avaluació final
        </button>
        <button
          class="btn-cancel"
          @click="$emit('cerrar')"
        >
          Tancar
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useToast } from 'vue-toastification'
  import html2pdf from 'html2pdf.js';
  import { useI18n } from 'vue-i18n'


  const toast = useToast()

  export default {
    props: {
      trabajo: Object,
      criterios: Array,
      puntosDeControl: Array,
      notas: Object,
      pesos: Object,
      observaciones: Object,
      notasFinales: Object,
      notaFinal: Number,
      puntosFinal: Number
    },
    data(){
        return{
            evaluadores: [],
            notaFinalEvaluadores: null,
            notaFinalTrabajo: null,
            rubricaEvaluadoresId: null ,
            rubricaEvaluadores: null ,
            criteriosEvaluadores: [],
            puntosDeControlEvaluadores: [],
            localNotaFinal: parseFloat(this.notaFinal),
            notasMediasFinales: [],
            percentatgeFinalTutor: null,
            percentatgeFinalAvaluadors: null,
        }
    },
    methods: {
      exportarAPdf() {
        const element = document.getElementById('pdf-content'); 
        const opt = {
          margin: 10,
          filename: 'documento.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
          html2canvas: {
        scale: 2, // Intenta con una escala más baja, por ejemplo 0.5 o 0.8
        letterRendering: true,
        logging: true,
        useCORS: true
      }

        };

        html2pdf().set(opt).from(element).save();
      },
      getNotaClase(nota) {
        const valor = parseInt(nota);
        if (isNaN(valor) || valor < 0 || valor > 10) return '';
        return `n${valor}`;
      },

      notaAlfabetica(nota) {
        if (nota === null || nota === undefined) return '-';
        if (nota >= 9) return 'A';
        if (nota >= 7) return 'B';
        if (nota >= 5) return 'C+';
        if (nota >= 3) return 'C-';
        return 'D';
      },
      async cargarEvaluadores(){
        const datosRes = await axios.get(`http://localhost:3000/rubricaEvaluador/${this.trabajo.id}`);
        this.rubricaEvaluadoresId = datosRes.data.rubricaId;

        const porcentajesRes =  await axios.get(`http://localhost:3000/areas/porcentagesTrabajo/${this.trabajo.id}`);
        this.percentatgeFinalTutor = porcentajesRes.data.percentatgeFinalTutor;
        this.percentatgeFinalAvaluadors = porcentajesRes.data.percentatgeFinalAvaluadors;


        const rubricaRes = await axios.get(`http://localhost:3000/criterios/${this.rubricaEvaluadoresId}/puntoControl`);
        this.rubricaEvaluadores = rubricaRes.data.rubrica;
        this.criteriosEvaluadores = rubricaRes.data.criterios;
        this.criteriosEvaluadores.sort((a, b) => a.criterioId - b.criterioId);

        const puntosRes = await axios.get(`http://localhost:3000/rubricas/${this.rubricaEvaluadoresId}/puntosDeControl`);
        this.puntosDeControlEvaluadores = puntosRes.data;    
        
        const evaluadores = await axios.get(`http://localhost:3000/evaluaciones/evaluadores/${this.trabajo.id}`);
        this.evaluadores=evaluadores.data

        let suma = 0;
        let totalEvaluadores = this.evaluadores.length;
        if(totalEvaluadores > 0){
            this.evaluadores.forEach(evaluador => {
            if (evaluador.notaFinal != null) {
              suma += evaluador.notaFinal;
            }
          });

          this.notaFinalEvaluadores = totalEvaluadores > 0 ? suma / totalEvaluadores : 0;  // Para evitar división por 0
          this.notaFinalEvaluadores = parseFloat(this.notaFinalEvaluadores.toFixed(1))

          if (this.notaFinalEvaluadores != null && this.localNotaFinal != null) {
            let tutor = this.localNotaFinal * (this.percentatgeFinalTutor / 100);
            let ev = this.notaFinalEvaluadores * (this.percentatgeFinalAvaluadors / 100);

            let final = ev + tutor;
            this.notaFinalTrabajo = parseFloat(final.toFixed(1));
          } else {
            this.notaFinalTrabajo = '-';
          }

          this.calcularNotasMedias();

        }


      },
      calcularNotasMedias() {
        // Recorremos los evaluadores
        this.evaluadores.forEach(evaluador => {
          // Verificamos si `criterios` es un objeto y no está vacío
          if (evaluador.criterios && typeof evaluador.criterios === 'object') {
            // Iteramos sobre las claves del objeto `criterios`
            Object.keys(evaluador.criterios).forEach(criterioId => {
              const nota = evaluador.criterios[criterioId];

              // Inicializamos la estructura para el criterio si no existe
              if (!this.notasMediasFinales[criterioId]) {
                this.notasMediasFinales[criterioId] = {
                  sumaNotas: 0,
                  contador: 0
                };
              }

              // Sumar la nota del criterio para este evaluador
              this.notasMediasFinales[criterioId].sumaNotas += nota;
              this.notasMediasFinales[criterioId].contador++;
            });
          } else {
            console.error(`No se encontró un objeto de criterios para el evaluador`);
          }
        });

        // Calculamos la media para cada criterio
        for (let criterioId in this.notasMediasFinales) {
          const media = this.notasMediasFinales[criterioId].sumaNotas / this.notasMediasFinales[criterioId].contador;
          this.notasMediasFinales[criterioId] = media; // Guardamos la media
        }

      },
      async guardarEvaluacionFinal(){
        try {
          const response = await axios.put(`http://localhost:3000/trabajos/actualizarNotas/${this.trabajo.id}`,{
            notaMediaEvaluadores: this.notaFinalEvaluadores, 
            notaFinalTutor: this.localNotaFinal, 
            notaFinalTrabajo: this.notaFinalTrabajo
            });
          console.log('Notes actualitzades correctament', response.data);
          toast.success('Notes actualitzades correctament')
          this.$emit('cambiar-estado', 'FINALIZADO');

        } catch (error) {
          console.log('Error al actualitzar les notes', error);
          toast.error('Error al actualitzar les notes')
        }

      },
      getNombreCriterio(criterio){
        const { locale } = useI18n()

        if (locale.value === 'ca') return criterio.criterioNombre
        if (locale.value === 'es' && criterio.criterioNombreEs !== null) return criterio.criterioNombreEs
        if (locale.value === 'en' && criterio.criterioNombreEn !== null && criterio.criterioNombreEn !== '') return criterio.criterioNombreEn
        return criterio.criterioNombre // fallback
      },

      
    },
    mounted(){
      this.cargarEvaluadores();
    }
  };
  </script>
  
  