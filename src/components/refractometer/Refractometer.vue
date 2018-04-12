<!--
  Refractometer Brix readings conversion based on homebrewlib
  by Forian Daniel
-->

<template>
<div class="refractometer">

  <!-- main user interface -->

  <p>Trasforma Brix letti con il rifrattometro in densità e °Plato,
  tenendo conto del fattore di correzione del rifrattometro.<br/>
  Per abilitare i campi di input bisogna selezionare il rifrattometro di riferimento.</p>

  <div>Rifrattometro usato:
    <div style="width:300px; display: inline-block;">
      <select id="selector" v-model="selected_refractometer" class="ui fluid search dropdown small" v-on:change="set_refractometer">
        <option value="">Seleziona rifrattometro</option> <!-- Default prompt -->
        <option v-for="(ref, index) in refractometers" v-bind:value="index">{{ref.name}}</option>
      </select>
    </div>
    <div class="ui button" v-on:click="calibrate_modal">Calibra</div>
    <div class="ui button" v-on:click="delete_modal">Elimina</div>
    <div class="ui button" v-on:click="add_modal">Aggiungi</div>
  </div>

  <!-- Transformation area visible only if refractometer selected -->
  <div v-if="selected_refractometer >= 0" style="margin-top: 2em;">

    <!-- Transformation of Brix for non fermented wort -->
    <h3>Densità iniziale (mosto non fermentato)</h3>

    <div class="input_div">Brix  <!-- Brix input -->
      <div style="width:100px;">
        <div class="ui input fluid brix">
          <input v-model.number="obrix" type="number" step="0.1" min="0"/>
        </div>
      </div>
    </div>

    <div class="input_div">Densità  <!-- Output of specific gravity, input disabled -->
      <div style="width:100px;">
        <div class="ui input fluid disabled">
          <input v-model.number="og" type="number" step="0.001"/>
        </div>
      </div>
    </div>

    <div class="input_div">°Plato  <!-- Output of plato degrees, input disabled -->
      <div style="width:100px;">
        <div class="ui input fluid disabled">
          <input v-model.number="oplato" type="number" step="0.1"/>
        </div>
      </div>
    </div>


    <!-- Transformation of Brix for fermenting/fermented wort -->
    <h3>Densità finale (mosto in fermentazione o fermentato)</h3>

    <div class="input_div">Brix  <!-- Brix input -->
      <div style="width:100px;">
        <div class="ui input fluid brix" v-bind:class="{disabled: obrix == 0}">
          <input v-model.number="fbrix" type="number" step="0.1" min="0"/>
        </div>
      </div>
    </div>

    <div class="input_div">Densità  <!-- density output, disabled -->
      <div style="width:100px;">
        <div class="ui input fluid disabled">
          <input v-model.number="fg" type="number" step="0.001"/>
        </div>
      </div>
    </div>

    <div class="input_div">°Plato  <!-- plato output, disabled -->
      <div style="width:100px;">
        <div class="ui input fluid disabled">
          <input v-model.number="fplato" type="number" step="0.1"/>
        </div>
      </div>
    </div>


    <!-- Alcohol and attenuation estimation, all inputs disabled -->
    <h3>Alcol</h3>

    <div class="input_div">g/l  <!-- ABW -->
      <div style="width:100px;">
        <div class="ui input fluid disabled">
          <input v-model.number="abw" type="number" step="0.1"/>
        </div>
      </div>
    </div>

    <div class="input_div">Vol <!-- ABV -->
      <div style="width:100px;">
        <div class="ui input fluid disabled">
          <input v-model.number="abv" type="number" step="0.1"/>
        </div>
      </div>
    </div>

    <div class="input_div">Attenuazione (%)  <!-- Attenuation -->
      <div style="width:100px;">
        <div class="ui input fluid disabled">
          <input v-model.number="attenuation" type="number" step="0.1"/>
        </div>
      </div>
    </div>

  </div>



  <!-- modal windows -->

  <!-- refractometer calibration  -->
  <div class="ui modal calibrate">
    <i class="close icon"></i>

    <div class="header">
      Calibrazione rifrattometro "{{refractometer.name}}"
    </div>

    <div class="scrolling content">
      <p>Per calibrare il tuo rifrattometro servono almeno due misure di confronto
      fra la rifrazione del mosto misurata dal rifrattometro in Brix e i valori di
      densità del mosto misurati da un densimetro standard.</p>
      <table>
        <tr>
          <td valign="top">
            <h3>Mosto non fermentato</h3>
            <table>
              <tr>
                <td>Densità</td>
                <td>Brix</td>
                <td></td>
              </tr>
              <tr v-for="(reading, index) in refractometer.readings">
                <td style="width:80px">
                  <div class="ui input fluid">
                    <input v-model.number="reading.sg" type="number" step="0.001"/>
                  </div>
                </td>
                <td style="width:80px">
                  <div class="ui input fluid">
                    <input v-model.number="reading.brix" type="number" step="0.1" v-on:change="calibrate"/>
                  </div>
                </td>
                <td>
                  <i v-if="index != 0" class="minus square icon" @click="delete_reading(index)"></i>
                </td>
              </tr>
            </table>
            <i class="add square icon" @click="add_reading"></i>
            <div class="ui popup">
              Aggiungi una nuova lettura per aumentare la precisione.
            </div>

          </td>
          <td valign="top" style="padding-left: 50px;">
            <h3>Fattore di correzione: {{refractometer.correction.toFixed(3)}}</h3>
          </td>
        </tr>
      </table>
    </div>

    <div class="actions">
      <div class="ui positive button right labeled icon">
        Salva calibrazione
        <i class="checkmark icon"></i>
      </div>
    </div>

  </div>


  <!-- refractometer deletion -->
  <div class="ui mini modal delete">
    <i class="close icon"></i>

    <div class="header">
      Elimina rifrattometro
    </div>

    <div class="content">
      <p>Sicuro di voler eliminare il rifrattometro "{{refractometer.name}}"?</p>
    </div>

    <div class="actions">
      <div class="ui cancel black button">Annulla</div>
      <div class="ui negative button" v-on:click="delete_refractometer">Elimina</div>
    </div>

  </div>


  <!-- creation of new refractometer -->
  <div class="ui modal add" id="ref">
    <i class="close icon"></i>

    <div class="header">
      Aggiungi nuovo rifrattometro
    </div>

    <div class="content">
      <div class="input_div">Nome rifrattometro:
        <div style="width:400px; display: inline-block;">
          <div class="ui input fluid">
            <input v-model.number="new_refractometer" type="text"/>
          </div>
        </div>
      </div>
      <p style="margin-top:20px">Il nuovo rifrattometro verrà aggiunto alla tua lista di rifrattometri
      con il fattore di correzione di 1,04 (valore medio empirico). Per calcoli
      più precisi, calibra il tuo nuovo rifrattometro con misure reali usando il
      pulsante Calibra. Senza una calibrazione corretta del rifrattometro sarà comunque
      possibile usare il convertitore di Brix, ma i valori di densità e °Plato ottenuti saranno solo
      approssimati.</p>
    </div>

    <div class="actions">
      <div class="ui deny button black">Annulla</div>
      <div class="ui positive button" v-on:click="add_refractometer">Aggiungi</div>
      <div class="ui positive button" v-on:click="add_and_calibrate">Calibra subito</div>
    </div>

  </div>

</div>
</template>



<style scoped>

.input_div {
  display: inline-block;
}

</style>


<script>

"use strict";

const EMPTY_REFRACTOMETER = { name: "", correction: 1};

export default {
  name: 'Refractometer',

  data () {
    return {
      og: 1.0,
      obrix: 0.0,
      oplato: 0.0,
      fg: 1.0,
      fbrix: 0.0,
      fplato: 0.0,
      abw: 0.0,
      abv: 0.0,
      attenuation: 0.0,
      refractometers: [  // to be initialized with user's own refractometers
        {
          name: "Rifrattometro standard",
          correction: 1.02861,
          readings: [ {sg: 1.039, brix: 10} ],
        }
      ],
      selected_refractometer: -1,  // initially, no refractometer is selected
      refractometer: EMPTY_REFRACTOMETER,  // auxiliary object to prevent render errors if no refractometer is selected
      new_refractometer: "",  // hold name of new refractometer upon creation
    };
  },

  watch: {  // automatically update specific gravity and Plato values after Brix changes
    'obrix': function() {
      this.transformObrix();
      if (this.fbrix != 0) this.transformFbrix();
    },
    'fbrix': function() {
      this.transformFbrix();
    },
  },

  mounted: function () {  // initialize Semantic UI modules
    $('.ui.modal').modal({});
    $('.ui.modal').modal({blurring: true});
    $(".refractometer .ui.dropdown").dropdown();
    $(".add.square.icon").popup({delay: { show: 500, hide: 0 }});
  },

  methods: {

    // set current refractometer to use in calculations
    set_refractometer: function () {
      if (this.selected_refractometer >= -1 && this.selected_refractometer < this.refractometers.length) {
        this.refractometer = this.refractometers[this.selected_refractometer];
        $(".refractometer .ui.dropdown").dropdown("set selected", this.selected_refractometer);
        this.obrix = 0.0;
        this.fbrix = 0.0;
      }
    },

    // add new refractometer to list
    add_refractometer: function () {
      this.refractometers.push( {
          name: this.new_refractometer,
          correction: 1.04,
          readings: [ {sg: 1.000, brix: 0} ],
        }
      );
      this.new_refractometer = "";
      this.selected_refractometer = this.refractometers.length - 1;
      this.set_refractometer();
    },

    // add and immediately calibrate new refractometer
    add_and_calibrate: function () {
      this.add_refractometer();
      this.calibrate_modal();
    },

    // delete refractometer from list
    delete_refractometer: function () {
      if (this.selected_refractometer >= 0 && this.selected_refractometer < this.refractometers.length) {
        this.refractometers.splice(this.selected_refractometer,1);
        $('.refractometer .ui.dropdown').dropdown('restore defaults');
        this.refractometer = EMPTY_REFRACTOMETER,  // auxiliary values to be overwritten
        this.selected_refractometer = -1;
      }
    },

    // open calibration modal window
    calibrate_modal: function () {
      if (this.selected_refractometer >= 0 && this.selected_refractometer < this.refractometers.length)
        $('.ui.modal.calibrate').modal('show');
    },

    // add new gravity-Brix reading to calculate correction factor
    add_reading: function () {
      this.refractometer.readings.push({ sg: 1.000, brix: 0.0 });
    },

    // delete gravity-Brix reading
    delete_reading: function (index) {
      this.refractometer.readings.splice(index,1);
      this.calibrate();
    },

    // calibrate refractomete, i.e., calculate correction factor from readings
    calibrate: function () {
      var brix  = 0;
      var plato = 0;
      for (var i=0; i<this.refractometer.readings.length; i++)
        if (this.refractometer.readings[i].brix != 0) {
          brix  += this.refractometer.readings[i].brix;
          plato += homebrewlib.sg2p(this.refractometer.readings[i].sg);
        }
      if (plato != 0)
        this.refractometer.correction = brix / plato;
    },

    // open delete modal window
    delete_modal: function () {
      if (this.selected_refractometer >= 0 && this.selected_refractometer < this.refractometers.length)
        $('.ui.modal.delete').modal('show');
    },

    // open refractometer creation modal window
    add_modal: function () {
      $('.ui.modal.add#ref').modal('show');
    },

    // transform Brix values of non fermented wort
    transformObrix: function () {
      var og = homebrewlib.obrix2sg(this.obrix, this.refractometer.correction);
      this.oplato = homebrewlib.sg2p(og).toFixed(1);
      this.og = og.toFixed(3);
    },

    // transform Brix values of fermenting/fermented wort
    transformFbrix: function () {
      var fg = homebrewlib.fbrix2sg(this.fbrix, this.refractometer.correction, this.obrix);
      this.fplato = homebrewlib.sg2p(fg).toFixed(1);
      this.fg = fg.toFixed(3);
      var abw = homebrewlib.get_ABW(this.obrix, this.fbrix, this.refractometer.correction);
      this.abv = homebrewlib.ABW2ABV(fg, abw).toFixed(2);
      this.abw = abw.toFixed(2);
      this.attenuation = homebrewlib.get_attenuation(this.oplato, this.fplato).toFixed(1);
    }
  }
};

</script>
