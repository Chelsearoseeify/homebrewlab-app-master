<!--
  Tabular recipe calculator based on homebrewlib
  by Forian Daniel
-->

<template>

<div class="equipment">

  <p>Configura i tuoi impianti di produzione in base alle loro caratteristiche.
    <br/>Questo ti permette di riusare facilmente le configurazioni e di avere ricette più precise.</p>

  <div>Impianto:
    <div style="width:300px; display: inline-block; margin-bottom: 20px;">
      <select v-model="selection" class="ui fluid search dropdown small" v-on:change="set_equipment(selection)">
        <option value="">Seleziona impianto</option>
        <option v-for="(equip, index) in equipments" v-bind:value="index">{{equip.name}}</option>
      </select>
    </div>
    <div class="ui button" onclick="">Aggiungi</div>
    <div class="ui button" onclick="">Salva</div>
    <div class="ui button" onclick="">Elimina</div>
  </div>

  <table v-if="equipment.name">
    <tr>
      <td style="padding-right:80px;" valign="top">

        <h3>Ammostamento</h3>

        <table class="input_table">
          <tr>
            <td class="label_column">Efficienza ammostamento</td>
            <td class="input_column">
              <div class="ui input small fluid">
                <input type="number" v-model.number="equipment.mash_efficiency_weight" step="0.01">
              </div>
            </td>
            <td>%</td>
          </tr>
          <tr>
            <td class="label_column">Volume pentola ammostamento</td>
            <td class="input_column">
              <div class="ui input small fluid">
                <input type="number" v-model.number="equipment.mash_max_volume" step="0.1">
              </div>
            </td>
            <td>litri</td>
          </tr>
          <tr>
            <td class="label_column">Volume sotto falso fondo filtrante</td>
            <td class="input_column">
              <div class="ui input small fluid">
                <input type="number" v-model.number="equipment.mash_false_bottom_volume" step="0.1">
              </div>
            </td>
            <td>litri</td>
          </tr>
          <tr>
            <td class="label_column">Perdita ammostamento</td>
            <td class="input_column">
              <div class="ui input small fluid">
                <input type="number" v-model.number="equipment.mash_loss" step="0.1">
              </div>
            </td>
            <td>litri</td>
          </tr>
          <tr>
            <td class="label_column">Volume pentola acqua per sparging</td>
            <td class="input_column">
              <div class="ui input small fluid">
                <input type="number" v-model.number="equipment.sparge_max_volume" step="0.1">
              </div>
            </td>
            <td>litri</td>
          </tr>
        </table>


        <h3>Bollitura</h3>

        <table class="input_table">
          <tr>
            <td class="label_column">Volume pentola bollitura</td>
            <td class="input_column">
              <div class="ui input small fluid">
                <input type="number" v-model.number="equipment.boil_max_volume" step="1">
              </div>
            </td>
            <td>litri</td>
          </tr>
          <tr>
            <td class="label_column">Perdita bollitura</td>
            <td class="input_column">
              <div class="ui input small fluid">
                <input type="number" v-model.number="equipment.boil_loss" step="0.1">
              </div>
            </td>
            <td>litri</td>
          </tr>
          <tr>
            <td class="label_column">Evaporazione acqua durante bollitura</td>
            <td class="input_column">
              <div class="ui input small fluid">
                <input type="number" v-model.number="equipment.boil_evaporation_rate" step="0.1">
              </div>
            </td>
            <td>litri/ora</td>
          </tr>
        </table>


        <h3>Fermentazione</h3>

        <table class="input_table">
          <tr>
            <td class="label_column">Volume fermentatore</td>
            <td class="input_column">
              <div class="ui input small fluid">
                <input type="number" v-model.number="equipment.fermentation_max_volume" step="1">
              </div>
            </td>
            <td>litri</td>
          </tr>
          <tr>
            <td class="label_column">Perdita fermentazione</td>
            <td class="input_column">
              <div class="ui input small fluid">
                <input type="number" v-model.number="equipment.fermentation_loss" step="0.1">
              </div>
            </td>
            <td>litri</td>
          </tr>
        </table>
      </td>

      <td valign="top" style="padding-top: 3em;">
        <img src="./equipment.png" style="width:272px;">
      </td>

    </tr>
  </table>


</div>
</template>

<style scoped>

.label_column {
  width: 250px;
}

.input_column {
  width: 80px;
  padding-right: 5px;
}

</style>


<script>

export default {
  name: 'Equipment',

  props: ['equipments'],

  data () {
    return {
      selection: "",
      equipment: {}
    }
  },

  mounted () {
    $(".equipment .ui.dropdown").dropdown({});
  },

  methods: {
    set_equipment: function (index) {
      this.equipment = this.equipments[index];
    }
  }

}
</script>
