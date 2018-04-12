<!--
  Hops template to handle hops
  by Mathyas Giudici
-->
<template>
<div class="hops">
  <div class="margin hops">

    <!-- header di ricerca -->
    <!-- <div class="ui right aligned category search" style="width:500px; display: inline-block;">
        <div class="ui icon input" style="width:490px;">
          <input class="prompt" id="cerca" type="text" placeholder="Cerca tra i luppoli..." tabindex="0" @keyup="filter_table"/>
          <i class="search icon"></i>
        </div>
    </div>
    <div class="ui button" v-on:click="show_add_modal"><i class="plus icon"></i> Aggiungi nuovo luppolo</div> -->
    <form role="search" class="ui form" id="search_form">
    <div class="two fields">
      <div class="field">
        <div class="ui action input">
          <input id="cerca" type="text" placeholder="Cerca tra i luppoli per nome..." tabindex="0" @keyup="filter_table"/>
          <button class="ui button"><i class="search icon"></i>Cerca</button>
        </div>
      </div>
      <div class="field">
          <div class="ui button" v-on:click="show_add_modal" style="height:38px; line-height: 1.2em;"><i class="plus icon"></i> Aggiungi nuovo luppolo</div>
      </div>
    </div>
    </form>

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
            <tr v-for="properties in hops" >
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
          <deschops v-bind:more_content="more_content"></deschops>
           <div>
             <div id="actions">
                 <div class="ui button" @click="show_add_modal_inventory"><i class="file alternate icon"></i>Aggiungi ad Inventario</div>
                 <div class="ui button" v-if="more_content!==null && more_content['owner'] == 'private' " @click="show_edit_modal"><i class="edit icon"></i>Modifica</div>
                 <div class="ui button"  v-if="more_content!==null && more_content['owner'] == 'private' " @click="show_delete_modal"><i class="trash icon"></i>Elimina</div>
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
import Desc_Hops from './desc_hops/Desc_Hops.vue';
import Mod_Hops from './mod_hops/Mod_Hops.vue';
import * as modal_function from './mod_hops/mod_hops_function.js';

export default {
  name: 'Hops',

  components: {
    'deschops': Desc_Hops ,
    'modhops' : Mod_Hops
  },

  data: function() {
    return {
      token : localStorage.getItem("id_token") || getCookie('id_token'),
      url: "https://homebrewlab.it/hops",
      /* Contains the information of the current user */
      user_email: sessionStorage.getItem("user.email"),
      user_name: sessionStorage.getItem("user.name"),
      user_locale: sessionStorage.getItem("user.locale"),
      user_picture: sessionStorage.getItem("user.picture"),

      table_columns: toFilter.table_columns_hops(),

      hops: [
        {
          inventoryType: "hop",
          name: "Prova",
          origin: "Italia",
          owner: "private",
          type: "pellets",
          aac: "0.6",
          bac : "0.5",
          oil : "10",
          weight : "30",
          price: "1.50",
          description: "Questa è la prova per il luppolo, tutto questo dopo sarà da eliminare; ma per adesso vediamo come funziona tutta la faccenda",
        }
      ],

      more_content : null,

    }
  },

  mounted: function () {
    $('.ui.form').form();
    $('.ui.sticky').sticky({setSize:true}).sticky();
    $('table').tablesort();
    $('.ui.search').search();
    modal_function.toMount();
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
      , howmany = this.hops.length;
      this.hops = this.hops.splice(head, howmany);

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
        this.hops.push(items_to_add[i]);
      }
      if(process.env.NODE_ENV === 'development') {
        console.info(this.hops);
      }
    },

    filter_table: function() {
      let td
      , i
      , filter = document.getElementById("cerca").value.toUpperCase()
      , tr = document.getElementById("userData").getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
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

    show_add_modal: function (event) {
      modal_function.show_add_modal(event);
    },

    show_add_modal_inventory: function (event) {
      modal_function.show_add_modal_inventory(event,this.more_content);
    },

    show_edit_modal: function(event) {
      modal_function.show_edit_modal(event,this.more_content);
    },

    show_delete_modal: function () {
      modal_function.show_delete_modal();
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
