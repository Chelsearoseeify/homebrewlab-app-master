<template>
  <div>

    <!-- Displays the home page for the logged in users, aka the lab -->
    <div v-show="isLoggedIn()">

      <!-- Main menu -->
  		<div class="ui secondary menu" style="margin-bottom:-15px;">

        <router-link to="/" onclick="$('.ui.tabular.menu :first-child').click();">
          <img src="static/logo.png" width="38px" height="45px" style="cursor:pointer; margin-left:10px; margin-top:10px"/>
        </router-link>

  			<div class="ui dropdown item" tabindex="1">
  				Ricette
  				<div class="menu" tabindex="-1">
            <div class="item" v-on:click="addRecipeTab('Nuova ricetta', '/tabular_recipe')">Nuova ricetta tabellare</div>
  				<!--	<div class="item" v-on:click="addRecipeTab('Nuova ricetta', '/tabular_recipe')">Nuova ricetta grafica</div> -->
  				</div>
  			</div>

  			<div class="ui dropdown item" tabindex="0">
  				Ingredienti
  				<div class="menu" tabindex="-1">
            <div class="item" v-on:click="addTab('Inventario', '/inventory')">Inventario</div>
            <div class="divider"></div>
  					<div class="item" v-on:click="addTab('Malti', '/malts')">Malti</div>
  					<div class="item" v-on:click="addTab('Luppoli', '/hops')">Luppoli</div>
  					<div class="item" v-on:click="addTab('Lieviti', '/yeasts')">Lieviti</div>
  					<div class="item" v-on:click="addTab('Varie', '/misc')">Varie</div>
  				</div>
  			</div>

  			<div class="ui dropdown item" tabindex="2">
  				Profili
  				<div class="menu" tabindex="-1">
  					<div class="item" v-on:click="addTab('Impianto', '/equipment')">Impianto</div>
  	<!--				<div class="item" v-on:click="addTab('Ammostamento', '/mash_profile')">Ammostamento</div>
  					<div class="item" v-on:click="addTab('Carbonazione', '/carbonation_profile')">Carbonazione</div>
  					<div class="item" v-on:click="addTab('Fermentazione', '/fermentation_profile')">Fermentazione</div> -->
  				</div>
  			</div>

  			<div class="ui dropdown item" tabindex="3">
  				Strumenti
  				<div class="menu" tabindex="-1">
  					<div class="item" v-on:click="addTab('Rifrattometro', '/refractometer')">Rifrattometro</div>
            <div class="item" v-on:click="addTab('Flow', '/flow')">Flow</div>
  				</div>
  			</div>

  			<div class="right menu">

  				<div  class="ui dropdown item" tabindex="4">
  					<img src="static/it.png" style="max-height:15px; max-width:23px; height:100%; width:auto">
  					<div class="menu" tabindex="-1" style="font-size:14px;">
  						<div class="item">More Languages TBA</div>
  				  </div>
  			  </div>

    			<div  class="ui dropdown item" tabindex="5">
    				<img class="ui medium circular image" id="profile-picture" src="static/avatar.png" style="max-height:40px; max-width:40px; height:100%; width:auto">
    				<div class="menu" tabindex="-1" style="font-size:14px;">
    					<div class="item" v-on:click="addTab('Utente', '/user')">Utente</div>
    					<div class="item" v-on:click="addTab('Preferenze', '/preferences')">Preferenze</div>
    					<div class="divider"></div>
    					<div id="btn_logout" class="item" @click="handleLogout()">Esci</div>
    				</div>
    			</div>

  		  </div>

  	  </div>


      <!-- Tabs -->
      <tabs v-bind:tabs="tabs" v-on:tabRemovalRequest="removeTab"></tabs>


      <!-- Component container -->
      <div class="component-container">
        <transition name="component-fade" mode="out-in">
          <keep-alive>
            <router-view v-on:tabRenamingRequest="renameRecipe" v-bind:equipments="equipments"></router-view>
          </keep-alive>
        </transition>
      </div>

    </div>

    <!-- Displays the landing page with login button -->
    <div v-show="!isLoggedIn()">
      <landing v-bind:landing="landing"></landing>
    </div>

  </div>

</template>

<style scoped>

  body {
    margin: 0em 1em 1em 1em;
  }

  .component-container {
    padding: 0px 20px;
  }

  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .2s ease;
  }

  .component-fade-enter, .component-fade-leave-to
  {
    opacity: 0;
  }

</style>



<script type="text/javascript">
  import Tabs from './components/tabs/Tabs.vue';
  import Landing from './components/landing_page/Landing.vue';
  import { isLoggedIn, logout } from './assets/auth';
  import { getCookie } from './assets/cookie';

  export default {
    name: 'app',

    components: {
      'tabs': Tabs,
      'landing': Landing
    },

    data: function () {
      return {
        tabs: [
          { name:'Home', path: '/' }
        ],
        landing: '',
        recipe_count: 0,
        equipments: [
          {
            name: "Acciaio inox 50l",
            id: 1,

            mash_max_volume : 50,
            mash_efficiency_weight : 0.751,
            mash_efficiency_potential : 0.91,
            mash_false_bottom_volume: 5,
            mash_loss : 0,

            sparge_max_volume : 50,

            boil_max_volume : 70,
            boil_evaporation_rate : 8.3,
            boil_loss : 2,

            whirlpool_loss : 0,

            fermentation_max_volume: 60,
            fermentation_loss: 1.5,
          },
          {
            name: "Mini inox 8l",
            id: 2,

            mash_max_volume : 11.5,
            mash_efficiency_weight : 0.70,
            mash_false_bottom_volume: 2,
            mash_loss : 1,

            sparge_max_volume : 8,

            boil_max_volume : 14.5,
            boil_evaporation_rate : 2.1,
            boil_loss : 0.5,

            whirlpool_loss : 0,

            fermentation_max_volume: 15,
            fermentation_loss: 0.5,
          },
        ],
      }
    },

    mounted: function () {
      $(document).ready(function() {
        $('.ui.secondary.menu .ui.dropdown.item').dropdown({
          on: 'hover',
          delay : {
            hide   : 50,
            show   : 50,
            search : 50,
            touch  : 50
          }
        });
        $('.ui.menu a.item').on('click', function() {
          $(this)
            .addClass('active')
            .siblings()
            .removeClass('active')
          ;
        });
        const profile_picture = localStorage.getItem("user.picture") || getCookie('user.picture');
        if(profile_picture != null) {
          $("#profile-picture").attr("src", profile_picture);
        }
      });
    },

    methods: {
      handleLogout: function() {
        logout();
      },
      isLoggedIn: function() {
        return isLoggedIn();
      },
      addTab: function (name, path) {
        var already_open = 0;
        for (var i=0; i<this.tabs.length; i++)
          if (this.tabs[i].path == path) {
            already_open = 1;
            break;
          }
        if (!already_open)
          this.tabs.push({'name': name, 'path': path});
        this.$router.push(path);
      },

      addRecipeTab: function (name, path) {
        this.tabs.push({'name': name + " " + this.recipe_count, 'path': path + "/" + this.recipe_count});
        this.$router.push(path + "/" + this.recipe_count);
        this.recipe_count++;
      },

      removeTab: function (index) {
        this.$router.push("/");
        this.tabs.splice(index,1);
      },

      renameRecipe: function (name) {
        for (var i=0; i<this.tabs.length; i++)
          if (this.tabs[i].path == this.$route.fullPath) {
            this.tabs[i].name = name;
            break;
          }
      }
    }
  }
</script>
