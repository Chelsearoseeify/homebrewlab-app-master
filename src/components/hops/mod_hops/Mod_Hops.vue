<!--
  Mod_Hops template for edit and delete hops
  by Mathyas Giudici
-->
<template>
 <div class="modhops">

   <!-- modal per aggiungere luppolo -->
   <div class="ui modal add" id="idAddHops">
     <i class="close icon"></i>
     <div id="modal_add_title" class="header">
       Aggiungi nuovo luppolo
     </div>
     <div class="scrolling content">
       <p id="modal_add_edit_content">Aggiungi un nuovo luppolo mancante compilando il form sottostante.</p>
       <form @submit.prevent="validate_form('add_item_form')" data-vv-scope="add_item_form" class="ui form" id="add_item_form" name="add_item_form">
         <!-- Hidden Input -->
         <input type="hidden" name="inventoryType" value="hop" required/>
         <!-- Input Form -->
         <div class="two fields">
           <div class="required field">
             <label class="label" for="name">Nome</label>
             <p :class="{ 'control': true }">
               <input v-validate="'required|alpha_spaces'" :class="{ 'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Nome nuovo elemento" name="name" id="name" class="add_item" required/>
               <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
             </p>
           </div>
           <div class="required field">
             <label for="origin">Origine</label>
             <input type="text" placeholder="Origine nuovo elemento" name="origin" id="origin" class="add_item" required/>
           </div>
         </div>
         <div class="two fields">
           <div class="required field">
             <label for="owner">Proprietario</label>
             <select name="owner" class="ui dropdown" id="owner">
               <option value="public">Pubblico</option>
               <option value="private">Privato</option>
             </select>

           </div>
           <div class="required field">
             <label for="type">Tipo di Luppolo</label>
             <select name="type" class="ui dropdown" id="type">
               <option value="pellet">Pellet</option>
               <option value="cones">Coni</option>
               <option value="lupulin">Luppolina</option>
               <option value="hopsExtracts">Estratto di luppolo</option>
             </select>
           </div>
         </div>
         <div class="three fields">
           <div class="required field">
             <label for="aac">Alfa Acidi</label>
             <div class="ui right labeled input">
             <input type="number" min="0" max="100" step="0.1" placeholder="Alfa acidi" name="aac" id="aac" class="add_item" required/>
             <div class="ui basic label">AA%</div>
             </div>
           </div>
           <div class="field">
             <label for="bac">Beta Acidi indicativi</label>
             <div class="ui right labeled input">
             <input type="number" min="0" max="100" step="0.1" placeholder="Beta acidi indicativi" name="bac" id="bac" class="add_item" />
             <div class="ui basic label">BA%</div>
             </div>
           </div>
           <div class="field">
             <label for="oil">Oli totali indicativi</label>
             <div class="ui right labeled input">
             <input type="number" step="0.1" placeholder="Oli totali indicativi" name="oil" id="oil" class="add_item" />
             <div class="ui basic label">mL/100g</div>
             </div>
           </div>
         </div>
         <!-- <div class="two fields">
           <div class="required field">
             <label for="weight">Peso</label>
             <div class="ui right labeled input">
                 <input type="number" step="0.1" placeholder="Peso medio della confezione del luppolo" name="weight" id="weight" class="add_item" required/>
                 <div class="ui basic label">g</div>
             </div>
           </div>
           <div class="required field">
             <label for="price">Prezzo</label>
             <div class="ui right labeled input">
                 <input type="number" step="0.01" placeholder="Prezzo medio del luppolo" name="price" id="price" class="add_item" required/>
                 <label for="price" class="ui label">€</label>
             </div>
           </div>
         </div> -->
         <div class="field">
           <label>Descrizione</label>
           <div v-if="more_content==null"><textarea placeholder="Inserisci qui la descrizione..." name="description" id="description" class="add_item" rows="3"></textarea></div>
           <div v-else><textarea placeholder="Inserisci qui la descrizione..." name="description" id="description" class="add_item" rows="3">{{more_content['description']}}</textarea></div>
           </div>
         <div class="ui error message"></div>
       </form>
     </div> <!-- End scrolling content -->
     <div class="actions">
       <div class="ui deny button black">Annulla</div>
       <div id="add_item_submit_button" class="ui positive submit button" @click="add_item">Aggiungi</div>
     </div>
   </div>

   <!-- modal per aggiungere luppolo ad inventario -->
   <div class="ui modal add" id="idAddInventoryHops">
     <i class="close icon"></i>
     <div id="modal_add_inventory_title" class="header">
         Aggiungi luppolo all'inventario
     </div>
     <div class="scrolling content">
       <form @submit.prevent="validate_form('add_inventory_item_form')" class="ui form" id="add_inventory_item_form" name="add_inventory_item_form" data-vv-scope="add_inventory_item_form">
         <!-- Hidden Input -->
         <input type="hidden" name="inventoryType" value="hop" required/>
         <!-- Input Form -->
         <div class="two fields">
           <div class="required field">
             <label class="label" for="name">Nome</label>
             <p :class="{ 'control': true }">
               <input v-validate="'required|alpha_spaces'" :class="{ 'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Nome nuovo elemento" name="name" id="name" class="add_inventory_item" required/>
               <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
             </p>
           </div>
           <div class="required field">
             <label for="origin">Origine</label>
             <input type="text" placeholder="Origine nuovo elemento" name="origin" id="origin" class="add_inventory_item" required/>
           </div>
         </div>
         <div class="two fields">
           <div class="required field">
             <label for="owner">Proprietario</label>
             <select name="owner" class="ui dropdown" id="owner">
               <option value="public">Pubblico</option>
               <option value="private">Privato</option>
             </select>

           </div>
           <div class="required field">
             <label for="type">Tipo di Luppolo</label>
             <select name="type" class="ui dropdown" id="type">
               <option value="pellet">Pellet</option>
               <option value="cones">Coni</option>
               <option value="lupulin">Luppolina</option>
               <option value="hopsExtracts">Estratto di luppolo</option>
             </select>
           </div>
         </div>
         <div class="three fields">
           <div class="required field">
             <label for="aac">Alfa Acidi</label>
             <div class="ui right labeled input">
             <input type="number" min="0" max="100" step="0.1" placeholder="Alfa acidi" name="aac" id="aac" class="add_inventory_item" required/>
             <div class="ui basic label">AA%</div>
             </div>
           </div>
           <div class="field">
             <label for="bac">Beta Acidi indicativi</label>
             <div class="ui right labeled input">
             <input type="number" min="0" max="100" step="0.1" placeholder="Beta acidi indicativi" name="bac" id="bac" class="add_inventory_item" />
             <div class="ui basic label">BA%</div>
             </div>
           </div>
           <div class="field">
             <label for="oil">Oli totali indicativi</label>
             <div class="ui right labeled input">
             <input type="number" step="0.1" placeholder="Oli totali indicativi" name="oil" id="oil" class="add_inventory_item" />
             <div class="ui basic label">mL/100g</div>
             </div>
           </div>
         </div>
         <div class="two fields">
           <div class="required field">
             <label for="weight">Peso</label>
             <div class="ui right labeled input">
                 <input type="number" step="0.1" placeholder="Peso medio della confezione del luppolo" name="weight" id="weight" class="add_inventory_item" required/>
                 <div class="ui basic label">g</div>
             </div>
           </div>
           <div class="required field">
             <label for="price">Prezzo</label>
             <div class="ui right labeled input">
                 <input type="number" step="0.01" placeholder="Prezzo medio del luppolo" name="price" id="price" class="add_inventory_item" required/>
                 <label for="price" class="ui label">€</label>
             </div>
           </div>
         </div>
         <div class="field">
           <label>Descrizione</label>
           <div v-if="more_content==null"><textarea placeholder="Inserisci qui la descrizione..." name="description" id="description" class="add_inventory_item" rows="3"></textarea></div>
           <div v-else><textarea placeholder="Inserisci qui la descrizione..." name="description" id="description" class="add_inventory_item" rows="3">{{more_content['description']}}</textarea></div>
         </div>
         <div class="ui error message"></div>
       </form>
     </div> <!-- End scrolling content -->
     <div class="actions">
       <div class="ui icon button" data-tooltip="Modifica i campi con i valore del tuo luppolo che stai aggiungendo nell'inventario.">
         <i class="question icon"></i>
       </div>
       <div class="ui deny button black">Annulla</div>
       <div id="add_inventory_item_submit_button" class="ui positive submit button" @click="add_inventory_item">Aggiungi</div>
     </div>
   </div>

  <!-- modal per modificare luppolo -->
  <div class="ui modal edit" id="idEditHops">
    <i class="close icon"></i>
    <div id="modal_edit_title" class="header">
        Modifica luppolo
    </div>
    <div class="scrolling content">
      <form @submit.prevent="validate_form('edit_item_form')" class="ui form" id="edit_item_form" name="edit_item_form" data-vv-scope="edit_item_form">
        <!-- Hidden Input -->
        <input type="hidden" name="inventoryType" value="hop" required/>
        <!-- Input Form -->
        <div class="two fields">
          <div class="required field">
            <label class="label" for="name">Nome</label>
            <p :class="{ 'control': true }">
              <input v-validate="'required|alpha_spaces'" :class="{ 'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Nome nuovo elemento" name="name" id="name" class="edit_item" required/>
              <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
            </p>
          </div>
          <div class="required field">
            <label for="origin">Origine</label>
            <input type="text" placeholder="Origine nuovo elemento" name="origin" id="origin" class="edit_item" required/>
          </div>
        </div>
        <div class="two fields">
          <div class="required field">
            <label for="owner">Proprietario</label>
            <select name="owner" class="ui dropdown" id="owner">
              <option value="public">Pubblico</option>
              <option value="private">Privato</option>
            </select>

          </div>
          <div class="required field">
            <label for="type">Tipo di Luppolo</label>
            <select name="type" class="ui dropdown" id="type">
              <option value="pellet">Pellet</option>
              <option value="cones">Coni</option>
              <option value="lupulin">Luppolina</option>
              <option value="hopsExtracts">Estratto di luppolo</option>
            </select>
          </div>
        </div>
        <div class="three fields">
          <div class="required field">
            <label for="aac">Alfa Acidi</label>
            <div class="ui right labeled input">
            <input type="number" min="0" max="100" step="0.1" placeholder="Alfa acidi" name="aac" id="aac" class="edit_item" required/>
            <div class="ui basic label">AA%</div>
            </div>
          </div>
          <div class="field">
            <label for="bac">Beta Acidi indicativi</label>
            <div class="ui right labeled input">
            <input type="number" min="0" max="100" step="0.1" placeholder="Beta acidi indicativi" name="bac" id="bac" class="edit_item" />
            <div class="ui basic label">BA%</div>
            </div>
          </div>
          <div class="field">
            <label for="oil">Oli totali indicativi</label>
            <div class="ui right labeled input">
            <input type="number" step="0.1" placeholder="Oli totali indicativi" name="oil" id="oil" class="edit_item" />
            <div class="ui basic label">mL/100g</div>
            </div>
          </div>
        </div>
        <div class="two fields">
          <div class="required field">
            <label for="weight">Peso</label>
            <div class="ui right labeled input">
                <input type="number" step="0.1" placeholder="Peso medio della confezione del luppolo" name="weight" id="weight" class="edit_item" required/>
                <div class="ui basic label">g</div>
            </div>
          </div>
          <div class="required field">
            <label for="price">Prezzo</label>
            <div class="ui right labeled input">
                <input type="number" step="0.01" placeholder="Prezzo medio del luppolo" name="price" id="price" class="edit_item" required/>
                <label for="price" class="ui label">€</label>
            </div>
          </div>
        </div>
        <div class="field">
          <label>Descrizione</label>
          <div v-if="more_content==null"><textarea placeholder="Inserisci qui la descrizione..." name="description" id="description" class="edit_item" rows="3"></textarea></div>
          <div v-else><textarea placeholder="Inserisci qui la descrizione..." name="description" id="description" class="edit_item" rows="3">{{more_content['description']}}</textarea></div>
        </div>
        <div class="ui error message"></div>
      </form>
    </div> <!-- End scrolling content -->
    <div class="actions">
      <div class="ui icon button" data-tooltip="Per eliminare un campo, lascialo vuoto.">
        <i class="question icon"></i>
      </div>
      <div class="ui deny button black">Annulla</div>
      <div id="edit_item_submit_button" class="ui positive submit button" @click="edit_item">Aggiungi</div>
    </div>
  </div>

  <!-- modal per eliminare luppolo -->
  <div class="ui mini modal delete" id="idDeleteHops">
    <i class="close icon"></i>
    <div class="header">
      Elimina luppolo
    </div>
    <div class="content">
      <p>Sicuro di voler eliminare il luppolo "{{(more_content==null? ' ' : more_content['name'])}}"?</p>
    </div>
    <div class="actions">
      <div class="ui cancel black button">Annulla</div>
      <div class="ui negative button" v-on:click="remove_item">Elimina</div>
    </div>
  </div>

 </div>

</template>

<script type="text/javascript">

"use strict";

export default {
  name: 'Mod_Hops',

  props:['more_content','url','token',],

  mounted: function () {
    $('.ui.form').form();
    $('#owner').dropdown();
    $('#type').dropdown();
    $('.activating.element').popup();
    $('.ui.modal').modal({});
    $('.ui.modal').modal({blurring: true});
  },

  methods: {
    validate_form: function(form_to_validate) {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if(form_to_validate === 'add_item_form') {
            add_item();
          }
          if(form_to_validate === 'edit_item_form'){
            edit_item();
          }
          if(form_to_validate === 'add_inventory_item_form'){
            add_inventory_item();
          }
        } else {
          alert("error in form " + form_to_validate);
        }
      });
    },

    add_item: function() {
      let form = $('#add_item_form')
      , viewArr = form.serializeArray()
      , object = {};
      for (let i in viewArr) {
        object[viewArr[i].name] = viewArr[i].value;
      }
      $.ajax({
        url: this.url,
        method: "POST",
        headers: {
          "Authorization": "Bearer " + this.token,
          "accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: object,
        success: function(server_reply) {
          swal("Tutto OK!", "luppolo salvato correttamente", "success");
          if(process.env.NODE_ENV === 'development') {
            console.info(server_reply);
          }
          $('.ui.modal.add#idAddHops').modal('show');
          this.$emit('update');
        },
        error: function(error) {
          swal("Errore " + error.status, "Impossibile creare il nuovo luppolo", "error");
          if(process.env.NODE_ENV === 'development') {
            console.info(error);
          }
        }
      });
    },

    add_inventory_item: function(){
      let form = $('#add_inventory_item_form')
      , viewArr = form.serializeArray()
      , object = {};
      for (let i in viewArr) {
        object[viewArr[i].name] = viewArr[i].value;
      }
      $.ajax({
        url: "https://homebrewlab.it/inventory",
        method: "POST",
        headers: {
          "Authorization": "Bearer " + this.token,
          "accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: object,
        success: function(server_reply) {
          swal("Tutto OK!", "luppolo salvato correttamente nell'inventario", "success");
          if(process.env.NODE_ENV === 'development') {
            console.info(server_reply);
          }
          $('.ui.modal.add#idAddInventoryHops').modal('show');
          this.$emit('update');
        },
        error: function(error) {
          swal("Errore " + error.status, "Impossibile creare il nuovo luppolo nell'inventario", "error");
          if(process.env.NODE_ENV === 'development') {
            console.info(error);
          }
        },
      });
    },

    edit_item: function(event) {
      let form = $('#edit_item_form')
      , viewArr = form.serializeArray()
      , object = {};
      for (let i in viewArr) {
        object[viewArr[i].name] = viewArr[i].value;
      }
      $.ajax({
        url: this.url + "/" + this.more_content._id,
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + this.token,
          "accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: object,
        success: function(server_reply) {
          swal("Tutto OK!", "luppolo salvato correttamente", "success");
          if(process.env.NODE_ENV === 'development') {
            console.info(server_reply);
          }
          $('.ui.modal.edit#idEditHops').modal('show');
          this.$emit('update');
        },
        error: function(error) {
          if(process.env.NODE_ENV === 'development') {
            console.info(error);
          }
          swal("Error " + error.status, "Impossibile modificare il luppolo selezionato", "error");
        }
      });
    },

    remove_item: function() {
      $.ajax({
        url: this.url + "/" + this.more_content._id,
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + this.token,
          "accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(server_reply) {
          if(process.env.NODE_ENV === 'development') {
            console.info(server_reply);
          }
          swal("Luppolo eliminato!", "Il luppolo selezionato è stato eliminato", "error").then(
            function () {
              $('.ui.modal.show_more').modal('show');
            });
          this.$emit('update');
        },
        error: function(error) {
          if(process.env.NODE_ENV === 'development') {
            console.error(error);
          }
          swal("Error " + error.status, "Impossibile eliminare il luppolo selezionato", "error");
        }
      });
    },

  },
}

</script>
