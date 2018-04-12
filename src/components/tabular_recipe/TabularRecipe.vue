<!--
  Tabular recipe calculator based on homebrewlib
  by Forian Daniel
-->

<template>
<div class="recipe">

  <div style="margin-bottom: 2em; display: inline-block;">
    <div class="ui input fluid" style="width:200px;">
      <input id="recipe_name" name="recipe_name" type="text" style="text-align:left;" v-model="recipe.name" v-on:change="rename_recipe"/>
    </div>
  </div>

  <div style="display: inline-block;">
    <div style="width:250px; display: inline-block;">
      <select v-model="selected_style" class="ui fluid search dropdown">
        <option value="">Seleziona stile</option>
        <span  v-for="category in BJCPstyles">
          <option v-for="(style, index) in category.subcategory" v-bind:value="style.id">{{style.name}}</option>
        </span>
      </select>
    </div>
  </div>

  <div style="display: inline-block;">
    <div class="ui calendar input" id="production_date" v-on:mouseup="init_calendar">
      <div class="ui input left icon">
        <i class="calendar icon"></i>
        <input type="text" placeholder="Seleziona data" style="text-align:left;">
      </div>
    </div>
  </div>

  <div class="ui button positive" onclick="">Salva</div>

  <!--  <div id="beer" class="ui sticky" style="float:right;"> -->
    <div id="beer">
<!--    <div style="width:250px;">
      <h3>Proprietà birra</h3>-->
      <img id="pint" src="./pint.png" style="width:60px; float:left; margin-bottom:50px; margin-right:10px;">
      <div>Volume: {{recipe.state[recipe.state.length - 1].vol.toFixed(1)}}</div>
      <div>Densità originale: {{recipe.state[recipe.state.length - 1].og.toFixed(3)}}</div>
      <div>Densità finale: {{recipe.state[recipe.state.length - 1].fg.toFixed(3)}}</div>
      <div>Alcol (vol): {{recipe.state[recipe.state.length - 1].abv.toFixed(1)}}</div>
      <div>Colore (EBC): {{recipe.state[recipe.state.length - 1].ebc.toFixed(1)}}</div>
      <div>Amarezza (IBU): {{recipe.state[recipe.state.length - 1].ibu.toFixed(1)}}</div>
      <div>Carbonazione (g/l): {{recipe.state[recipe.state.length - 1].co2.toFixed(1)}}</div>
  <!--    </div>-->
    </div>

<div style="clear:left;" class="step">

  <div style="display: inline-block;">
    <h3>Impianto</h3>
    <div style="width:200px; display: inline-block;">
      <select v-model="selected_equipment" class="ui fluid search dropdown" v-on:change="set_equipment(selected_equipment)">
        <option value="">Seleziona impianto</option>
        <option v-for="(equip, index) in equipments" v-bind:value="index">{{equip.name}}</option>
      </select>
    </div>
  </div>
</div>

<!-- MASHING -->
<div class="step">

  <!-- INGREDIENTS -->
  <div>
    <h3>Ammostamento</h3>
    <div style="display:inline-block;">Acqua mashing<br/>
      <div class="ui input small fluid right labeled" style="width:90px;">
        <input type="number" v-model.number="recipe.process.mash.mash_water" step="0.1" min="0">
        <div class="ui basic label">litri</div>
      </div>
    </div>
    <div style="display:inline-block;">Acqua sparging<br/>
      <div class="ui input small fluid right labeled" style="width:90px;">
        <input type="number" v-model.number="recipe.process.mash.sparge_water" step="0.1" min="0">
        <div class="ui basic label">litri</div>
      </div>
    </div>
    <div style="display:inline-block;width:75px;">
      <div>Efficienza</div>
      <div class="ui input small fluid right labeled">
        <input type="number" v-model.number="recipe.equipment.mash_efficiency_weight" step="0.01">
        <div class="ui basic label">%</div>
      </div>
    </div>

    <div v-for="(selection, index) in recipe.process.mash.malts">
      <div style="display:inline-block; width:300px;">
        <div v-if="index==0">Malto</div>
        <select v-model="selection.id" class="ui fluid search dropdown small" v-on:change="update_ebc(index);">
          <option v-for="malt in available_malts" v-bind:value="malt.id">{{malt.name}}</option>
        </select>
      </div>
      <div style="display:inline-block;width:100px;">
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="selection.ebc" min="0" max="2000">
          <div class="ui basic label">EBC</div>
        </div>
      </div>
      <div style="display:inline-block;width:85px;">
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="selection.weight"  v-on:change="update_percentage();" step="0.1" min="0">
          <div class="ui basic label">kg</div>
        </div>
      </div>
      <div style="display:inline-block;width:100px;">
        {{selection.percentage}} % <i class="minus square icon grey" @click="drop_malt(index); update_percentage()"></i>
      </div>
    </div>
    <i class="add square icon grey" @click="add_malt()"></i>

    <div class="wort">
      <div style="display:inline-block;width:80px;">
        <div>Volume</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.state[1].vol" step="0.1">
          <div class="ui basic label">l</div>
      </div>
      </div>
      <div style="display:inline-block;width:60px;">
        <div>Perdite</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.equipment.mash_loss" step="0.1">
          <div class="ui basic label">l</div>
      </div>
      </div>
      <div style="display:inline-block;width:100px;">
        <div>Densità OG</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.state[1].og" step="0.001">
          <div class="ui basic label">kg/l</div>
        </div>
      </div>
    </div>

  </div>

</div>


<!-- BOILING -->
<div class="step">

  <!-- INGREDIENTS -->
  <div>
    <h3>Bollitura</h3>
    <div style="display:inline-block;">Durata<br/>
      <div class="ui input small fluid right labeled" style="width:90px;">
        <input type="number" v-model.number="recipe.process.boil.time" min="0">
        <div class="ui basic label">min</div>
      </div>
    </div>
    <div style="display:inline-block;">Whirlpool<br/>
      <div class="ui input small fluid right labeled" style="width:90px;">
        <input type="number" v-model.number="recipe.process.boil.whirlpool" min="0">
        <div class="ui basic label">min</div>
      </div>
    </div>

    <div v-for="(selection, index) in recipe.process.boil.hops">
      <div style="display:inline-block; width:250px;">
        <div v-if="index==0">Luppolo</div>
        <select v-model="selection.id" class="ui fluid search dropdown small" v-on:change="update_aa(index);">
          <option v-for="hop in available_hops" v-bind:value="hop.id">{{hop.name}} ({{hop.type}})</option>
        </select>
      </div>
      <div style="display:inline-block;width:100px;">
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="selection.aa" step="0.1" min="0">
          <div class="ui basic label">AA%</div>
        </div>
      </div>
      <div style="display:inline-block;width:80px;">
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="selection.weight" min="0">
          <div class="ui basic label">g</div>
      </div>
      </div>
      <div style="display:inline-block; width:110px;">
        <select class="ui fluid search dropdown small">
          <option >Forward</option>
          <option >Dopo break</option>
          <option >Whirlpool</option>
          <option >Dry</option>
        </select>
      </div>
      <div style="display:inline-block;width:90px;">
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="selection.time" min="0">
          <div class="ui basic label">min</div>
        </div>
      </div>
<!--      <div style="display:inline-block;width:25px;">
        <div v-if="index==0">HB</div>
        <div class="ui checkbox small">
          <input type="checkbox" v-model="selection.after_hot_break">
          <label></label>
        </div>
      </div>
      <div style="display:inline-block;width:25px;">
        <div v-if="index==0">Dry</div>
        <div class="ui checkbox small">
          <input type="checkbox" v-model="selection.dry_hopping">
          <label></label>
        </div>
      </div> -->
      <div style="display:inline-block;width:90px;">
        <div class="ui input small fluid disabled right labeled">
          <input type="number" v-model.number="selection.time" min="0">
          <div class="ui basic label">IBU</div>
        </div>
      </div>
      <i class="minus square icon grey" @click="drop_hop(index);"></i>
    </div>
    <i class="add square icon grey" @click="add_hop()"></i>

    <div>
      <div style="display:inline-block;">
        <div>Zucchero</div>
        <div class="ui input small fluid right labeled" style="width:85px;">
          <input type="number" v-model.number="recipe.process.boil.sugar_addition.qty" step="0.1" min="0">
          <div class="ui basic label">kg</div>
      </div>
      </div>
      <div style="display:inline-block;">
        <div>Acqua</div>
        <div class="ui input small fluid right labeled" style="width:85px;">
          <input type="number" v-model.number="recipe.process.boil.water_addition" step="0.1" min="0">
          <div class="ui basic label">litri</div>
        </div>
      </div>
    </div>

    <div class="wort">
      <div style="display:inline-block;width:80px;">
        <div>Volume</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.state[2].vol" step="0.1">
          <div class="ui basic label">l</div>
        </div>
      </div>
      <div style="display:inline-block;width:60px;">
        <div>Perdite</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.equipment.boil_loss" step="0.1">
          <div class="ui basic label">l</div>
        </div>
      </div>
      <div style="display:inline-block;width:100px;">
        <div>Densità OG</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.state[2].og" step="0.001">
          <div class="ui basic label">kg/l</div>
        </div>
      </div>
    </div>

  </div>

</div>


<!-- FERMENTATION -->
<div class="step">

  <!-- INGREDIENTS -->
  <div>
    <h3>Fermentazione</h3>

    <div style="display:inline-block;">Temperatura<br/>
      <div class="ui input small fluid right labeled" style="width:80px;">
        <input type="number" v-model.number="recipe.process.ferment.temperature">
        <div class="ui basic label">°C</div>
      </div>
    </div>
    <div style="display:inline-block; width:400px;">Lievito<br/>
      <select v-model="recipe.process.ferment.yeast.id" class="ui fluid search dropdown small" v-on:change="update_attenuation();">
        <option v-for="yeast in available_yeasts" v-bind:value="yeast.id">{{yeast.name}} ({{yeast.type}})</option>
      </select>
    </div>
    <div style="display:inline-block;">
      <div class="ui input small fluid right labeled" style="width:90px;">
        <input type="number" v-model.number="recipe.process.ferment.yeast.attenuation">
        <div class="ui basic label">Att.%</div>
      </div>
    </div>

    <div>
      <div style="display:inline-block;">
        <div>Zucchero</div>
        <div class="ui input small fluid right labeled" style="width:85px;">
          <input type="number" v-model.number="recipe.process.ferment.sugar_addition.qty" step="0.1" min="0">
          <div class="ui basic label">°C</div>
        </div>
      </div>
      <div style="display:inline-block;">
        <div>Acqua (l)</div>
        <div class="ui input small fluid right labeled" style="width:85px;">
          <input type="number" v-model.number="recipe.process.ferment.water_addition" step="0.1" min="0">
          <div class="ui basic label">°C</div>
        </div>
      </div>
    </div>

    <div class="wort">
      <div style="display:inline-block;width:80px;">
        <div>Volume</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.state[3].vol" step="0.1">
          <div class="ui basic label">l</div>
        </div>
      </div>
      <div style="display:inline-block;width:60px;">
        <div>Perdite</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.equipment.fermentation_loss" step="0.1">
          <div class="ui basic label">l</div>
        </div>
      </div>
      <div style="display:inline-block;width:100px;">
        <div>Densità FG</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.state[3].fg" step="0.001">
          <div class="ui basic label">kg/l</div>
        </div>
      </div>
<!--      <div style="display:inline-block;width:70px;">
        <div>Atten.</div>
        <div class="ui input small fluid disabled right labeled">
          <input type="number" v-model.number="recipe.process.ferment.yeast.attenuation" step="0.1">
          <div class="ui basic label">%</div>
        </div>
      </div> -->
      <div style="display:inline-block;width:100px;">
        <div>Alcol</div>
        <div class="ui input small fluid disabled right labeled">
          <input type="number" v-model.number="recipe.state[3].abv" step="0.1">
          <div class="ui basic label">% vol</div>
        </div>
      </div>
    </div>

  </div>

</div>


<!-- BOTTLING/KEGGING -->
<div class="step">

  <!-- INGREDIENTS -->
  <div>
    <h3>Imbottigliamento</h3>
    <div style="position:relative;">
      <div style="display:inline-block; width:100px;"> <!-- to be fixed!!! -->
        Saccarosio
      </div>
      <div style="display:inline-block; width:70px;">
        <div class="ui input fluid small right labeled">
          <input type="number" v-model.number="recipe.process.bottle.prime[0]" min="0">
          <div class="ui basic label">g/l</div>
        </div>
      </div>
      <div style="display:inline-block; width:70px;">
        <div class="ui input fluid small disabled right labeled">
          <input type="number" :value="recipe.process.bottle.prime[0]*recipe.state[3]" min="0">
          <div class="ui basic label">g</div>
        </div>
      </div>
    </div>
<!--    <div>
      <div style="display:inline-block; width:100px;">
        Destrosio
      </div>
      <div style="display:inline-block; width:70px;">
        <div class="ui input fluid small right labeled">
          <input type="number" v-model.number="recipe.process.bottle.sugar" min="0">
          <div class="ui basic label">g/l</div>
        </div>
      </div>
      <div style="display:inline-block; width:70px;">
        <div class="ui input fluid small disabled right labeled">
          <input type="number" v-model.number="recipe.process.bottle.sugar" min="0">
          <div class="ui basic label">g</div>
        </div>
      </div>
    </div>
    <div>
      <div style="display:inline-block; width:100px;">
        Estratto secco
      </div>
      <div style="display:inline-block; width:70px;">
        <div class="ui input fluid small right labeled">
          <input type="number" v-model.number="recipe.process.bottle.sugar" min="0">
          <div class="ui basic label">g/l</div>
        </div>
      </div>
      <div style="display:inline-block; width:70px;">
        <div class="ui input fluid small disabled right labeled">
          <input type="number" v-model.number="recipe.process.bottle.sugar" min="0">
          <div class="ui basic label">g</div>
        </div>
      </div>
    </div>
    <div>
      <div style="display:inline-block; width:100px;">
        Mosto di birra
      </div>
      <div style="display:inline-block; width:70px;">
        <div class="ui input fluid small right labeled">
          <input type="number" v-model.number="recipe.process.bottle.sugar" min="0">
          <div class="ui basic label">l</div>
        </div>
      </div>
    </div>
-->
    <div class="wort">
      <div style="display:inline-block;width:80px;">
        <div>Volume</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.state[4].vol" step="0.1">
          <div class="ui basic label">l</div>
        </div>
      </div>
      <div style="display:inline-block;width:60px;">
        <div>Perdite</div>
        <div class="ui input small fluid right labeled">
          <input type="number" v-model.number="recipe.equipment.bottling_loss" step="0.1">
          <div class="ui basic label">l</div>
        </div>
      </div>
      <div style="display:inline-block;width:90px;">
        <div>CO2</div>
        <div class="ui input small fluid disabled right labeled">
          <input type="number" v-model.number="recipe.state[4].co2" step="0.1">
          <div class="ui basic label">g/l</div>
        </div>
      </div>
    </div>

  </div>

</div>

</div>
</template>

<style scoped>

.step {
  background:#f5f5f5;
  padding:10px;
  margin:5px 0px 5px 0px;
}

.wort {
  background:#e0e0e0;
  padding:5px 5px 5px 5px;
  margin-top:5px;
}

.label_column {
  width: 130px;
}

.input_column {
  width: 80px;
  padding-right: 5px;
}


.ui.input input {
  padding-left: 0.5em;
  padding-right: 0em;
  text-align: right;

}

.ui.labeled.input>.label:not(.corner) {
  padding-left: 0.5em;
  padding-right: 0.5em;
}
/*
.ui.selection.dropdown {
  padding: 0.3em 0em 0.3em 0.3em;
}
*/
</style>


<script>

// constants needed to propery initialize Vue's setters/getters
const EMPTY_MALT = { id:0, name:"", ebc:0, weight:0, unit:"kg", percentage:0 };
const EMPTY_HOP = { id:0, name:"", type:"", aa:0, weight:0, time:0, after_hot_break:false, dry_hopping:false, ibu:0 };
const EMPTY_YEAST = { id:0, name:"", type:"", aa:0, weight:0, time:0 };


export default {
  name: 'Recipe',

  props: ['equipments'],

  data () {
    return {
      data_store: {},
      recipe: {},
      selected_equipment: "",
      selected_style: "",
      available_malts: [
        {id:1, name : 'Maris Otter', weight : 6.2, ebc : 3.2 },
        {id:2, name : 'Pilsner', weight : 0.4, ebc  : 3 },
        {id:3, name : 'Crystal', weight : 0.4, ebc  : 160 },
        {id:4, name : 'Brown Malt', weight : 0.2, ebc  : 200 },
        {id:5, name : 'Black Malt', weight : 0.2, ebc  : 1200 }
      ],
      available_hops: [
        {id:1, name : 'East Kent Goldings', type : 'Pellet', weight : 55, aa : 5.9, time : 60, after_hot_break : true, dry_hopping: false},
        {id:2, name : 'Cascade', type : 'Pellet', weight : 55, aa : 5.5, time : 60, after_hot_break : true, dry_hopping: false},
        {id:3, name : 'Citra', type : 'Pellet', weight : 55, aa : 13.5, time : 60, after_hot_break : true, dry_hopping: false},
        {id:4, name : 'Tettnanger', type : 'Pellet', weight : 55, aa : 4.5, time : 60, after_hot_break : true, dry_hopping: false},
      ],
      available_yeasts: [
        {id:1, name: 'WYeast Labs London ESB', type : 'liquid', attenuation : 83},
        {id:2, name: 'WYeast Labs Weighenstephan Weizen', type : 'liquid', attenuation : 75},
        {id:3, name: "Mangrove Jack's West Coast APA", type : 'liquid', attenuation : 80},
        {id:4, name: 'Fermentis Safale US05', type : 'dry', attenuation : 78},
      ],
      BJCPstyles: STYLES.styleguide.class[0].category,
    }
  },

  watch: {
    $route: function () {
      if (this.$route.name == "TabularRecipe")
        this.set_recipe(this.$route.params.id);
    },
    'recipe.process.mash.mash_water': function (newVal, oldVal) {
      this.recipe.state[0].vol = newVal;
    },
    'recipe.process': {
      handler: function (newVal, oldVal) { this.recipe.brew(); this.update_beer_color(); },
      deep: true
    },
    'recipe.equipment': {
      handler: function (newVal, oldVal) { this.recipe.brew(); },
      deep: true
    },
  },

  created() {
    this.data_store[this.$route.params.id] = homebrewlib.newRecipe();
    this.recipe = this.data_store[this.$route.params.id];
    this.init_recipe(this.recipe, this.$route.params.id);
  },

  updated () {
    $(".recipe .ui.dropdown").dropdown({});
  },

  mounted () {
    $(".recipe .ui.dropdown").dropdown({});
    $('#beer').sticky({context: '.recipe'});
    this.update_beer_color();
  },

  methods: {

    init_recipe: function (recipe, id) {
      recipe.reset();
      recipe.id = id;
      recipe.name = "Nome ricetta";
      recipe.process.mash.malts = [ jQuery.extend({}, EMPTY_MALT) ];
      recipe.process.boil.hops = [ jQuery.extend({}, EMPTY_HOP) ];
      recipe.process.ferment.yeast = jQuery.extend({}, EMPTY_YEAST);
    },


    set_recipe: function (recipe_id) {
      if (!this.data_store[recipe_id]) {
        this.data_store[recipe_id] = homebrewlib.newRecipe();
        this.init_recipe(this.data_store[recipe_id],recipe_id);
      }
      this.recipe = this.data_store[recipe_id];
    },

    rename_recipe: function () {
      this.$emit('tabRenamingRequest', this.recipe.name);
    },

    add_malt: function () {
      this.recipe.process.mash.malts.push( jQuery.extend({}, EMPTY_MALT) );
    },

    drop_malt: function (index) {
      this.recipe.process.mash.malts.splice(index,1);
    },

    add_hop: function () {
      this.recipe.process.boil.hops.push( jQuery.extend({},EMPTY_HOP) );
    },

    drop_hop: function (index) {
      this.recipe.process.boil.hops.splice(index,1);
    },

    update_ebc: function (index) {
      for (var i=0; i<this.available_malts.length; i++) {
        if (this.available_malts[i].id == this.recipe.process.mash.malts[index].id) {
          this.recipe.process.mash.malts[index].ebc = this.available_malts[i].ebc;
          break;
        }
      }
    },

    update_aa: function (index) {
      for (var i=0; i<this.available_hops.length; i++) {
        if (this.available_hops[i].id == this.recipe.process.boil.hops[index].id) {
          this.recipe.process.boil.hops[index].aa = this.available_hops[i].aa;
          break;
        }
      }
    },

    update_percentage: function () {
      var total = 0;
      var i = 0;
      for (i=0; i<this.recipe.process.mash.malts.length; i++)
        total += this.recipe.process.mash.malts[i].weight;
      if (total)
        for (i=0; i<this.recipe.process.mash.malts.length; i++)
          this.recipe.process.mash.malts[i].percentage = (this.recipe.process.mash.malts[i].weight/total*100).toFixed(1);
    },

    update_attenuation: function() {
      for (var i=0; i<this.available_yeasts.length; i++) {
        if (this.available_yeasts[i].id == this.recipe.process.ferment.yeast.id) {
          this.recipe.process.ferment.yeast.attenuation = this.available_yeasts[i].attenuation;
          break;
        }
      }
    },

    update_beer_color: function () {
      var ebc = this.recipe.state[this.recipe.state.length-1].ebc.toFixed(0);
      if (ebc < 0)  ebc = 0;
      if (ebc > 60) ebc = 60;
      $("#pint").attr("class", "ebc-" + ebc);
    },

    set_equipment: function (index) {
      this.recipe.equipment = JSON.parse(JSON.stringify(this.equipments[index]));
    },

    init_calendar: function () {
      $('#production_date').calendar({
        type: 'date',
        firstDayOfWeek: 1,
        formatter: {
          date: function (date, settings) {
            if (!date) return '';
            var day = date.getDate();
            var month = settings.text.months[date.getMonth()];
            var year = date.getFullYear();
            return day + ' ' + month + ' ' + year;
          }
        },
      });
    }

  }
}
</script>
