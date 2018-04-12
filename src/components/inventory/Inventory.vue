<!--
  Hops template to handle hops
  by Mathyas Giudici
-->
<template>
<div class="inventory">
  <div class="margin inventory">

    <!-- header di ricerca -->
    <div class="ui right aligned category search" style="width:500px; display: inline-block;">
        <div class="ui icon input" style="width:490px;">
          <input class="prompt" id="cerca" type="text" placeholder="Cerca nel tuo inventario..." tabindex="0" @keyup="filter_table"/>
          <i class="search icon"></i>
        </div>
    </div>

    <!-- body con tabella + componente visualizzazione -->
    <div class="ui grid">
      <div class="ten wide column">
        <table id="userData" class="ui sortable celled compact table" style="table-layout: fixed;">
          <thead>
            <tr>
              <th v-for="entry in table_columns">
                {{ entry | map }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="properties in inventory" >
              <td v-for="entry in table_columns" @click="show_more(properties)" >
                  <a class="ui-action">
                    {{ properties[entry] | clean_up }}
                  </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="more_content!==null" class="six wide column">
        <div class="ui fixed sticky" >
          <div v-if="more_content['inventoryType']=='hop' "><deschops v-bind:more_content="more_content"></deschops></div>
           <div>
             <div id="actions">
                 <div class="ui button" @click="show_edit_modal"><i class="edit icon"></i>Modifica</div>
                 <div class="ui button" @click="show_delete_modal"><i class="trash icon"></i>Elimina</div>
            </div>
           </div>
         </div>
      </div>
  </div> <!-- end grid -->

  </div> <!-- end margin hops -->

  <!-- modhops component -->
  <modhops v-bind:more_content="more_content" v-bind:url="url" v-bind:token="token" v-on:update="update" ></modhops>

</div>
</template>

<style scoped type="text/css">
  a.ui-action {
    cursor: pointer !important;
  }
  #actions {
    margin-top:15px;
  }
  .ui.grid{
    margin-top:2px;
    margin-right:5px;
  }
  .intro {
    text-align: justify;
    font-size: 16px;
    line-height: 24px;
  }
  .required {
    color: #FF0000;
    font-weight: bolder;
  }
  .is-danger {
    color: #FF0000;
  }
  .ui.fixed.sticky {
    max-width: inherit;
  }
  .six.wide.column{
    padding-top: 15px;
  }
</style>

<script type="text/javascript">

"use strict";

import { getCookie } from '../../assets/cookie';
import * as toFilter from '../../assets/filters';

//Importo da luppoli
import Desc_Hops from '../hops/desc_hops/Desc_Hops.vue';
import Mod_Hops from '../hops/mod_hops/Mod_Hops.vue';
import * as modal_function_hops from '../hops/mod_hops/mod_hops_function.js';

export default {
  name: 'Inventory',

  components: {
    'deschops': Desc_Hops ,
    'modhops' : Mod_Hops
  },

  data: function() {
    return {
      token : localStorage.getItem("id_token") || getCookie('id_token'),
      url: "https://homebrewlab.it/inventory",
      /* Contains the information of the current user */
      user_email: sessionStorage.getItem("user.email"),
      user_name: sessionStorage.getItem("user.name"),
      user_locale: sessionStorage.getItem("user.locale"),
      user_picture: sessionStorage.getItem("user.picture"),

      table_columns: toFilter.table_columns_inventory(),

      inventory: [
        {
          inventoryType: "",
          name: "",
          origin: "",
          type: "",
          price: "",
        },
        {
          inventoryType: "hop",
          name: "Prova Inventario luppolo",
          origin: "Italia",
          owner: "private",
          type: "pellets",
          aac: "0.6",
          bac : "0.5",
          oil : "10",
          weight : "30",
          price: "1.50",
          description: "Questa è la prova per il luppolo, tutto questo dopo sarà da eliminare; ma per adesso vediamo come funziona tutta la faccenda",
        },
        {
          inventoryType: "misc",
          name: "Prova Inventario misc",
          origin: "Italia",
          owner: "public",
          type: "ciaone",
          bac : "0.5",
          oil : "10",
          weight : "30",
          price: "1.50",
        },
      ],

      // malts : [],
      // hops : [],
      // yeasts : [],
      // misc : [],

      more_content : null,

    }
  },

  mounted: function () {
    $(".add.square.icon.show_more").popup({delay: { show: 500, hide: 0 }});
    $('.ui.sticky').sticky({setSize:true}).sticky();
    $('table').tablesort();
    $('.ui.search').search();
  },

  filters: {
    map: function(string){
      return toFilter.map(string);
    },
    clean_up: function(string){
      return toFilter.clean_up(string);
    }
  },

  methods: {
    display_inventory: function() {
      /* Empty the stack */
      let head = 0
      , howmany = this.inventory.length;
      this.inventory = this.inventory.splice(head, howmany);

      const self = this;

      $.ajax({
        url: this.url,
        method: "GET",
        headers: {
          "Authorization": "Bearer " + this.token,
          "accept": "application/json",
        },
        success: function(server_reply) {
          if(process.env.NODE_ENV === 'development') {
            console.info(server_reply);
          }
           self.add_item_to_stack(server_reply);
        },
        error: function(error) {
          if(process.env.NODE_ENV === 'development') {
            console.error(error);
          }
        }
      });
    },

    add_item_to_stack: function(items_to_add) {
      for(let i in items_to_add) {
        this.inventory.push(items_to_add[i]);
      }
      if(process.env.NODE_ENV === 'development') {
        console.info(this.inventory);
      }
    },

    filter_table: function() {
      let td
      , i
      , filter = document.getElementById("cerca").value.toUpperCase()
      , tr = document.getElementById("userData").getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
          if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    },

    show_more: function(key) {
        this.more_content= key;
    },

    show_edit_modal: function(event) {
      switch(this.more_content['inventoryType']) {
        case 'hop' :
            return modal_function_hops.show_edit_modal(event,this.more_content);
        break;
        default:
            return swal("Comando non trovato");
        break;
      }
    },

    show_delete_modal: function () {
      switch(this.more_content['inventoryType']) {
        case 'hop' :
            return modal_function_hops.show_delete_modal();
        break;
        default:
            return swal("Comando non trovato");
        break;
      }
    },

    update: function (){
      this.display_inventory();
    }

  },
  beforeMount(){
    this.display_inventory();
  }
}

</script>
