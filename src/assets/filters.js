/* ******************************************************************* */
/*      filters.js: utility functions to filter string in table        */
/* ******************************************************************* */


//Funzioni per settare tabella e elementi di descrizione Luppoli
export function table_columns_inventory(){ return ["inventoryType","name","origin","type","price",]; }
export function table_columns_hops(){ return ["name","origin","type","aac","price",]; }

export function more_properties_hops(){ return ["name","origin","owner","type","aac","bac","oil","weight","price","description",]; }

//Variabile per mapping dei valori
var map={
  'inventoryType' : 'Ingrediente',
  'name'   :  'Nome',
  'origin' :  'Origine',
  'owner'  :  'Proprietario',
  'type'   :  'Tipo',
  'aac'    :  'Alfa Acidi',
  'bac'    :  'Beta Acidi indicativi',
  'oil'    :  'Oli totali indicativi',
  'weight' :  'Peso',
  'price'  :  'Prezzo',
  'description' : 'Descrizione'
}

//Funzioni di supporto per conversione dinamica ing->ita stringhe
export function map (string) {
    return map[string]
}

var clean_up={
  'private' : 'Privato',
  'public'   :  'Pubblico',
  'malt'    : 'Malto',
  'hop'     : 'Luppolo',
  'yeast'   : 'Lievito',
  'misc'    : 'Varie',
  'pellets' :  'Pellet',
  'cones'  :  'Coni',
  'lupulin' : 'Luppolina',
  'hopsExtracts' : 'Estratto di luppolo',
}

export function  clean_up (string) {
    if (string == undefined){
        return 'Non inserito';
    }
    else {
      if(clean_up[string] !== undefined)
        return clean_up[string];
      else {
        return string;
      }
    }
  }
