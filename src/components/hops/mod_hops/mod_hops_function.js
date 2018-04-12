/* ******************************************************************* */
/*      mod_hops_function.js: utility functions to Mod_Hops.vue        */
/* ******************************************************************* */

export function toMount(){
  $('.ui.form').form();
  $('#owner').dropdown();
  $('#type').dropdown();
  $('.activating.element').popup();
  $('.ui.modal').modal({});
  $('.ui.modal').modal({blurring: true});
}

// FUNZIONI PER SHOW DEL MODAL

//Funzione modal add
export function show_add_modal(event){
  $('.ui.form#add_item_form').form('clear');
  event.preventDefault();
  $('.ui.modal.add#idAddHops').modal('show',{
    onApprove : function() {
        return false;
    }
  });
}

//Funzione modal add inventory
export function show_add_modal_inventory(event,more_content) {
  event.preventDefault();
  const element = more_content;
  console.warn(more_content);
  //$('.ui.modal.show_more').modal('show');
  $('.ui.modal.add#idAddInventoryHops').modal('show',{
    onApprove : function() {
        return false;
    }
  });
  $('.add_inventory_item#inventoryType').val(element.inventoryType);
  $('.add_inventory_item#name').val(element.name);
  $('.add_inventory_item#origin').val(element.origin);
  $('.dropdown#owner').dropdown('set selected', element.owner);
  $('.dropdown#type').dropdown('set selected', element.type);
  $('.add_inventory_item#aac').val(element.aac);
  $('.add_inventory_item#bac').val(element.bac);
  $('.add_inventory_item#oil').val(element.oil);
  $('.add_inventory_item#weight').val(element.weight);
  $('.add_inventory_item#price').val(element.price);
}

//Funzione modal edit
export function show_edit_modal(event,more_content){
  event.preventDefault();
  const element = more_content;
  console.warn(more_content);
  //$('.ui.modal.show_more').modal('show');
  $('.ui.modal.edit#idEditHops').modal('show',{
    onApprove : function() {
        return false;
    }
  });
  $('.edit_item#inventoryType').val(element.inventoryType);
  $('.edit_item#name').val(element.name);
  $('.edit_item#origin').val(element.origin);
  $('.dropdown#owner').dropdown('set selected', element.owner);
  $('.dropdown#type').dropdown('set selected', element.type);
  $('.edit_item#aac').val(element.aac);
  $('.edit_item#bac').val(element.bac);
  $('.edit_item#oil').val(element.oil);
  $('.edit_item#weight').val(element.weight);
  $('.edit_item#price').val(element.price);
}

//Funzione modal delete
export function show_delete_modal() {
  $('.ui.modal.delete#idDeleteHops').modal('show');
}
