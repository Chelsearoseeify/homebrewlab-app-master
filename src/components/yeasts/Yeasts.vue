<!--
  Yeasts template to handle yeasts
  by Federico Macchi
-->

<!--
  Cosa manca:
  GRAFICA & VARIE
  2) Styling sulla UI in generale
  3) Decidere quali e quanti campi mostrare in tabella
  4) Syling del modale che mostra tutti i campi
  5) Un po' di documentazione su alcune funzioni
  6) Validazione del form POST e PUT
-->

<!--
  Cosa è stato implementato:
  1) GET ottiene dati dell'utente dal server e li stampa nella tabella
  2) POST aggiunge nuovo lievito
  3) DELETE item
  4) PUT item
  3) Cliccando sul nome di un elemento si apre un modale che mostra tutti gli altri attributi
  4) La tabella dei lieviti è filtrabile: si può cercare per nome usando la barra di ricerca oppure ordinare in modo ascendente (discendente) ogni singola colonna
-->

<!-- Cosa non funziona bene:
  1) Alle volte si aprono contemporaneamente N modali uguali invece che uno solo, inoltre la X per chiudere il modale non si vede mai. (soprattutto se è aperta la console si aprono anche 5/6 modali identici uno sopra all'altro)
-->

<!-- NOTE
  const self = this; serve per tenere salvato il riferimento a this: infatti se all'interno di una funzione si usa un'altra funzione annidata (vedi success, error delle chiamate AJAX) this si riferirà al this della chiamata e non al this del template di VUE. Per cui all'interno delle funzioni si usa const self = this; e dentro alle funzioni annidate si usa self per riferirsi agli elementi di VUE, mentre this per riferirsi agli elementi interni alla funzione annidata.

  Le classi "add_item" e "edit_item" servono per essere usate in combinazione all'id per selezionare i vari input dei form: siccome i form "aggiungi elemento" e "modifica elemento" sono identici e gli id/name devono corrispondere con quelli backend (altrimenti la validazione fallisce) ho utilizzato le classi CSS (senza nessun CSS associato). Quindi per selezionare il campo "form" si utilizza:
  $('.edit_item#form').funzione() => campo form di edit_item
  $('.add_item#form').funzione() => campo form di add_item

  La variabile (array) modal_more_content è una variabile d'appoggio che viene letta dal modale show_more per mostrare tutte le proprietà del singolo oggetto. È inoltre usata per inviare le richieste di DELETE e PUT (che hanno bisogno dell'id e dei vecchi dati)

  La variabile (array) modal_more_properties contiene i nomi di tutte le proprietà di un lievito che saranno inserite nel modal show_more: rimuovendo un elemento di questo array si rimuoverà dal modale la corrispondente proprietà

  if(process.env.NODE_ENV === 'development') => serve per nascondere le console.log una volta usciti dalla modalità sviluppo

  Le varibili token e user contengono rispettivamente il token dell'utente corrente e i suoi dati principali (verranno usati per popolare in automatico il campo proprietario e per effettuare le richieste al server). I valori vengono inizialmente salvati nello storage del browser dal file authenticate.js
-->

<template>
<div class="yeasts">
  <div style="display: inline-block">
    <p class="intro">Da questa pagina puoi visualizzare i lieviti presenti nel tuo inventario. Puoi aggiungere un nuovo lievito cliccando  sull'apposito pulsante, oppure vedere la lista aggiornata dei lieviti che possiedi cliccando sul pulsante <b>i tuoi lieviti</b>. Cliccando sul nome di un lievito, puoi vedere tutte le proprietà ad esso associate. </p>
    <div class="ui button" v-on:click="display_inventory"><i class="info circle icon"></i> I tuoi lieviti</div>
    <div class="ui button" v-on:click="show_add_modal"><i class="plus icon"></i> Aggiungi nuovo lievito</div>
  </div>
  <div v-show="yeasts.length >= 0" class="margin">
    <h1 id="notification">I tuoi lieviti</h1>
    <form role="search" class="ui form">
      <div class="field">
        <label>Cerca tra gli elementi per nome</label>
        <input id="cerca" type="text" placeholder="Cerca..." tabindex="0" @keyup="filter_table"/>
      </div>
    </form>
    <table id="userData" class="ui sortable celled striped table">
      <thead>
        <tr>
          <th v-for="entry in table_columns">
            {{ entry | map }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="properties in yeasts">
          <td v-for="entry in table_columns" @click="show_more(properties)">
            <span v-if="entry === 'name'">
              <a class="ui-action">
                {{ properties[entry] | clean_up }}
              </a>
            </span>
            <span v-else>
              {{ properties[entry] | clean_up }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="ui modal add">
    <i class="close icon"></i>
    <div id="modal_add_title" class="header">
      Aggiungi nuovo lievito
    </div>
    <div class="scrolling content">
      <p id="modal_add_edit_content">Aggiungi un nuovo lievito compilando il form sottostante.
        Il campo inventario, rappresenta la quantità che possiedi del lievito
        inserito: sebbene non obbligatorio, è utile per tenere traccia del costo
        delle tue ricette in materie prime.</p>
      <form @submit.prevent="validate_form('add_item_form')" data-vv-scope="add_item_form" class="ui form segment" id="add_item_form" name="add_item_form">
        <div class="field">
          <label class="label" for="name">Nome <span class="required">*</span></label>
          <p :class="{ 'control': true }">
            <input v-validate="'required|alpha_spaces'" :class="{ 'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Nome nuovo elemento" name="name" id="name" class="add_item" required/>
            <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
          </p>
        </div>
        <div class="field">
          <label class="label" for="language">Lingua <span class="required">*</span></label>
          <p :class="{ 'control': true }">
            <input v-validate="'required|alpha_spaces'" :class="{ 'input': true, 'is-danger': errors.has('language') }" type="text" placeholder="Lingua nuovo elemento" name="language" id="language" class="add_item" required/>
            <span v-show="errors.has('language')" class="help is-danger">{{ errors.first('language') }}</span>
          </p>
        </div>
        <div class="disabled field">
          <label for="owner">Proprietario <span class="required">*</span></label>
          <input type="text" value="" class="add_item"/>
        </div>
        <div class="disabled field">
          <label for="access">Accesso <span class="required">*</span></label>
          <input type="text" value="Private" class="add_item"/>
        </div>
        <div class="field">
          <label for="origin">Origine</label>
          <input type="text" placeholder="Origine nuovo elemento" name="origin" id="origin" class="add_item"/>
        </div>
        <div class="field">
          <label for="supplier">Fornitore</label>
          <input type="text" placeholder="Fornitore nuovo elemento" name="supplier" id="supplier" class="add_item"/>
        </div>
        <div class="field">
          <label for="type">Tipo di lievito <span class="required">*</span></label>
          <div class="ui selection dropdown">
            <input type="hidden" name="type" id="type" class="add_item"/>
            <i class="dropdown icon"></i>
            <div class="default text">Tipo di lievito</div>
            <div class="menu">
              <div class="item" data-value="Ale">Ale</div>
              <div class="item" data-value="Lager">Lager</div>
              <div class="item" data-value="Wheat">Wheat</div>
            </div>
          </div>
        </div>
        <div class="field">
          <label for="form">Forma <span class="required">*</span></label>
          <div class="ui selection dropdown">
            <input type="hidden" name="form" id="form" class="add_item"/>
            <i class="dropdown icon"></i>
            <div class="default text">Forma</div>
            <div class="menu">
              <div class="item" data-value="Liquid">Liquid</div>
              <div class="item" data-value="Dry">Dry</div>
            </div>
          </div>
        </div>
        <div class="field">
          <label for="flocculation">Flocculazione</label>
          <div class="ui selection dropdown">
            <input type="hidden" name="flocculation" id="flocculation" class="add_item"/>
            <i class="dropdown icon"></i>
            <div class="default text">Flocculazione</div>
            <div class="menu">
              <div class="item" data-value="Low">Low</div>
              <div class="item" data-value="Medium">Medium</div>
              <div class="item" data-value="High">High</div>
              <div class="item" data-value="Very High">Very High</div>
            </div>
          </div>
        </div>
        <div class="ui error message"></div>
      </form>
    </div>
    <div class="actions">
      <div id="add_item_submit_button" class="ui positive submit button" @click="add_item">Aggiungi</div>
      <div class="ui deny button black">Annulla</div>
    </div>
  </div>
    <div class="ui modal edit">
      <i class="close icon"></i>
      <div id="modal_edit_title" class="header">
        Modifica lievito
      </div>
      <div class="scrolling content">
        <p>Modifica il lievito.<br/>Per eliminare un campo, lascialo vuoto.</p>
        <form @submit.prevent="validate_form('edit_item_form')" class="ui form" id="edit_item_form" name="edit_item_form" data-vv-scope="edit_item_form">
          <div class="field">
            <label for="name">Nome <span class="required">*</span></label>
            <input type="text" placeholder="Nome nuovo elemento" name="name" id="name" class="edit_item" required/>
          </div>
          <div class="field">
            <label for="language">Lingua <span class="required">*</span></label>
            <input type="text" placeholder="Lingua nuovo elemento" name="language" id="language" class="edit_item" required/>
          </div>
          <div class="field" data-tooltip="Questo campo non può essere modificato" data-position="top center">
            <label for="owner">Proprietario <span class="required">*</span></label>
            <input type="text"class="edit_item" name="owner" id="owner" readonly/>
          </div>
          <div class="field" data-tooltip="Questo campo non può essere modificato" data-position="top center">
            <label for="access">Accesso <span class="required">*</span></label>
            <input type="text" class="edit_item" name="access" id="access" readonly/>
          </div>
          <div class="field">
            <label for="origin">Origine</label>
            <input type="text" placeholder="Origine nuovo elemento" name="origin" id="origin" class="edit_item"/>
          </div>
          <div class="field">
            <label for="supplier">Fornitore</label>
            <input type="text" placeholder="Fornitore nuovo elemento" name="supplier" id="supplier" class="edit_item"/>
          </div>
          <div class="field">
            <label for="type">Tipo di lievito <span class="required">*</span></label>
            <div class="ui selection dropdown">
              <input type="hidden" name="type" id="type" class="edit_item"/>
              <i class="dropdown icon"></i>
              <div class="default text">Tipo di lievito</div>
              <div class="menu">
                <div class="item" data-value="Ale">Ale</div>
                <div class="item" data-value="Lager">Lager</div>
                <div class="item" data-value="Wheat">Wheat</div>
              </div>
            </div>
          </div>
          <div class="field">
            <label for="form">Forma <span class="required">*</span></label>
            <div class="ui selection dropdown">
              <input type="hidden" name="form" id="form" class="edit_item"/>
              <i class="dropdown icon"></i>
              <div class="default text">Forma</div>
              <div class="menu">
                <div class="item" data-value="Liquid">Liquid</div>
                <div class="item" data-value="Dry">Dry</div>
              </div>
            </div>
          </div>
          <div class="field">
            <label for="flocculation">Flocculazione</label>
            <div class="ui selection dropdown">
              <input type="hidden" name="flocculation" id="flocculation" class="edit_item"/>
              <i class="dropdown icon"></i>
              <div class="default text">Flocculazione</div>
              <div class="menu">
                <div class="item" data-value="Low">Low</div>
                <div class="item" data-value="Medium">Medium</div>
                <div class="item" data-value="High">High</div>
                <div class="item" data-value="Very High">Very High</div>
              </div>
            </div>
          </div>
        </form>
      </div> <!-- End scrolling content -->
      <div class="actions">
        <div class="ui deny button black">Annulla</div>
        <div id="edit_item_submit_button" class="ui positive button" @click="edit_item">Modifica</div>
      </div>
    </div> <!-- End edit modal -->
  <div class="ui modal show_more">
    <i class="close icon"></i>
    <div class="header">
      <div id="modal_more_title">{{modal_more_title}}</div>
    </div>
    <div class="scrolling content">
      <div v-for="properties in modal_more_content">
        <div v-for="value in modal_more_properties">
          <p>{{ value | map }} : {{ properties[value] | clean_up }}</p>
        </div>
      </div>
    </div>
    <div class="actions">
      <div class="ui positive button" @click="show_edit_modal">Modifica</div>
      <div class="ui negative button" @click="remove_item">Elimina</div>
    </div>
  </div>
</div>

</template>

<style scoped type="text/css">
  a.ui-action {
    cursor: pointer !important;
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
  .margin {
    margin-top: 2.5%;
  }
  .is-danger {
    color: #FF0000;
  }
</style>

<script type="text/javascript">

"use strict";

import { getCookie } from '../../assets/cookie';
import { getData, postData, putData, deleteData }   from '../../assets/ajax_calls';

export default {
  name: 'Yeast',

  data: function() {
    return {
      token : localStorage.getItem("id_token") || getCookie('id_token'),
      endpoint: "yeasts",
      template_name: "Lievito",
      /* Contains the information of the current user */
      user_email: localStorage.getItem("user.email") || getCookie('user.email'),
      user_name: localStorage.getItem("user.name") || getCookie('user.name'),
      user_locale: localStorage.getItem("user.locale") || getCookie('user.locale'),
      user_picture: localStorage.getItem("user.picture") || getCookie('user.picture'),
      // This array represents the columns to insert in the table
      // Use the same names of the yeasts's properties and update the filter
      // map to display the correct names
      table_columns: [
          "name",
          "language",
          /*"owner",*/
          "access",
          /*"origin",
          "supplier",*/
          "type",
          "form",
          /*"flocculation",
          "minAttenuation",
          "maxAttenuation",
          "minTemperature",
          "maxTemperature",
          "cellsPerPack",
          "ageRate",
          "dateManufactoring",
          "bestBefore",
          "inventory",
          "price",
          "beerStyle",
          "createdAt",*/
          "updatedAt"
      ],
      modal_more_properties: ["name", "language", "owner", "access", "origin", "supplier", "type", "form", "flocculation", "minAttenuation", "maxAttenuation", "minTemperature", "maxTemperature", "cellsPerPack", "ageRate", "dateManufactoring",
          "bestBefore", "inventory", "price", "beerStyle", "createdAt", "updatedAt"],
      // yests is a array of object representing each yeast of the user
      yeasts: [
        {
          name: "",
          language: "",
          owner: "",
          access: "",
          origin: "",
          supplier: "",
          type: "",
          form: "",
          flocculation: "",
          minAttenuation: "",
          maxAttenuation: "",
          minTemperature: "",
          maxTemperature: "",
          cellsPerPack: "",
          ageRate:  "",
          dateManufactoring: "",
          bestBefore: "",
          inventory: "",
          price: "",
          beerStyle: "",
          createdAt: "",
          updatedAt: "",
          _id: ""
        }
      ],
      modal_more_title: "",
      modal_more_content: [
        {
          name: "",
          language: "",
          owner: "",
          access: "",
          origin: "",
          supplier: "",
          type: "",
          form: "",
          flocculation: "",
          minAttenuation: "",
          maxAttenuation: "",
          minTemperature: "",
          maxTemperature: "",
          cellsPerPack: "",
          ageRate:  "",
          dateManufactoring: "",
          bestBefore: "",
          inventory: "",
          price: "",
          beerStyle: "",
          createdAt: "",
          updatedAt: "",
        }
      ]
    }
  },

  mounted: function () {
    $(".add.square.icon.show_more").popup({delay: { show: 500, hide: 0 }});
    $('.dropdown').dropdown();
    $('table').tablesort();
  },

  filters: {
    map: function(string) {
      switch(string) {
        case 'name':
          return 'Nome';
        break;
        case 'language':
          return "Lingua";
        break;
        case 'owner':
          return 'Proprietario';
        break;
        case 'access':
          return 'Accesso';
        break;
        case 'origin':
          return "Origine";
        break;
        case 'supplier':
          return 'Fornitore';
        break;
        case 'type':
          return 'Tipo';
        break;
        case 'form':
          return "Forma";
        break;
        case 'flocculation':
          return 'Flocculazione';
        break;
        case 'minAttenuation':
          return 'Attenuazione minima';
        break;
        case 'maxAttenuation':
          return "Attenuazione massima";
        break;
        case 'minTemperature':
          return 'Temperatura minima';
        break;
        case 'maxTemperature':
          return 'Temperatura massima';
        break;
        case 'cellsPerPack':
          return "cellsPerPack";
        break;
        case 'ageRate':
          return 'Tasso d\'invecchiamento';
        break;
        case 'dateManufactoring':
          return 'Data produzione';
        break;
        case 'bestBefore':
          return "Scadenza";
        break;
        case 'inventory':
          return 'Quantità';
        break;
        case 'price':
          return 'Prezzo';
        break;
        case 'beerStyle':
          return "Stile birra";
        break;
        case 'createdAt':
          return 'Data creazione';
        break;
        case 'updatedAt':
          return 'Ultima modifica';
        break;
        case '_id':
          return 'Id'
        break;
        default:
          return 'Argomento sconosciuto';
        break;
      }
    },
    clean_up: function(string) {
      return (string !== undefined) ? string : "Non inserito";
    }
  },

  methods: {
    display_inventory: function() {
      let head = 0
      , howmany = this.yeasts.length;
      this.yeast = this.yeasts.splice(head, howmany);

      getData(this.endpoint).then(yeasts => {
        if(process.env.NODE_ENV === 'development') {
          console.info(yeasts);
        }
        this.add_item_to_stack(yeasts);
      });
    },
    add_item_to_stack: function(items_to_add) {
      for(let i in items_to_add) {
        this.yeasts.push(items_to_add[i]);
      }
      if(process.env.NODE_ENV === 'development') {
        console.info(this.yeasts);
      }
    },
    add_item: function() {
      const form = $('#add_item_form')
      , viewArr = form.serializeArray();
      let object = {};
      for (let i in viewArr) {
        object[viewArr[i].name] = viewArr[i].value;
      }
      postData(this.endpoint, this.template_name, object)
      .then(result => {
        this.display_inventory();
        $('.ui.modal.add').modal('hide');
      });
    },
    edit_item: function(event) {
      const self = this;
      let form = $('#edit_item_form')
      , viewArr = form.serializeArray()
      , object = {};
      for (let i in viewArr) {
        object[viewArr[i].name] = viewArr[i].value;
      }
      putData(this.endpoint, this.template_name, this.modal_more_content[0]._id, object)
      .then(result => {
        this.display_inventory();
        $('.ui.modal.edit').modal('hide');
      });
    },
    remove_item: function() {
      deleteData(this.endpoint, this.template_name, this.modal_more_content[0]._id)
      .then(result => {
        this.display_inventory();
        $('.ui.modal.show_more').modal('hide');
      });
    },
    validate_form: function(form_to_validate) {
      this.$validator.validateAll().then(result => {
        if (result) {
          if(form_to_validate === 'add_item_form') {
            add_item();
          }
          else if(form_to_validate === 'edit_item_form'){
            edit_item();
          }
        } else {
          alert("error in form " + form_to_validate);
        }
      });
    },
    show_add_modal: function (event) {
      event.preventDefault();
      $('.ui.modal.add').modal('show',{
        onApprove : function() {
            return false;
        },
        closable: false
      });
    },
    show_edit_modal: function(event) {
      event.preventDefault();
      const element = this.modal_more_content[0];
      console.warn(this.modal_more_content[0]);
      $('.ui.modal.show_more').modal('hide');
      $('.ui.modal.edit').modal('toggle',{
        onApprove : function() {
            return false;
        }
      });
      $('.edit_item#name').val(element.name);
      $('.edit_item#language').val(element.language);
      $('.edit_item#owner').val(element.owner);
      $('.edit_item#access').val(element.access);
      $('.edit_item#origin').val(element.origin);
      $('.edit_item#supplier').val(element.supplier);
      $('.dropdown').dropdown('set selected', element.type);
      $('.dropdown').dropdown('set selected', element.form);
      $('.dropdown').dropdown('set selected', element.flocculation);
    },
    show_more_modal: function () {
      $('.ui.modal.show_more').modal('toggle');
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
      this.modal_more_title = "Stai visualizzando: " + key.name;
      this.modal_more_content.splice(0, 1);
      this.modal_more_content.push(key);
      $('.ui.modal.show_more').modal('toggle');
    }
  },
  beforeMount(){
    this.display_inventory();
  }
}

</script>
