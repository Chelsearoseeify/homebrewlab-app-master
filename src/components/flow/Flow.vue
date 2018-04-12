<template>
  <div>
    <h1>The grid-column Property</h1>

    <div id="grid-container">
      <div class="grid-item-row1" id="itemS1" v-on:mouseover="appear()" v-on:mouseleave="disappear()">
        <img src="../../../static/images/simbols/arrow.png" id="imgS1">
      </div>
    </div>

  </div>
</template>

<style scoped>
  #grid-container {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto;
    grid-gap: 10px;
    background-color: #2196F3;
    padding: 10px;
    overflow-x: auto;
  }
  #grid-container > div {
    text-align: center;
    padding: 5px;
    font-size: 30px;
    background: none;
    display: inline-block;
  }
  #itemS1{
    grid-column: 1/1;
    grid-row: 1/1;
  }
  #itemA1{
    grid-column: 2/2;
    grid-row: 1/1;
  }
  #imgS1{
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 5px;
  }
  #button-space{
    grid-column: 1/1;
    grid-row: 2/2;
    display: inline-block;
    margin-bottom: 20px;
  }

  .grid-item-activity{
    display: inline-block;
  }
  .grid-item-state{
    display: inline-block;
  }
  .grid-item-row1{
    display: inline-block;
    grid-row: 1/1;
  }
  .grid-item-row2{
    display: inline-block;
    grid-row: 2/2;
  }
  .grid-item-row3{
    display: inline-block;
    grid-row: 3/3;
  }
  .grid-item-row4{
    display: inline-block;
    grid-row: 4/4;
  }
  .grid-item-row5{
    display: inline-block;
    grid-row: 5/5;
  }
  .button{
    display: block;
  }
  ul{
    margin: 0px 0px 0px 0px;
    padding: 0px 0px 0px 0px;
  }
  li {
    display: inline;
  }
  .icon{
    height: 22px;
    width: 22px;
  }

  .button{
    padding: 0px 0px 0px 0px;
  }

  .ui_input_small_fluid_right_labeled{
    padding-left: 0.5em;
    padding-right: 0em;
    text-align: right;
    display: block;
  }

  #mashing{
    display: block;
  }
</style>

<script>


  export default {
    data () {
      return {
        data_store: {},
        lastCreatedActivityId:1,
        lastCreatedStateId:1,
        recipes:[
          {
            id: 0,
            flow: {},
            stack:[]
          },
          {
            id: 1,
            flow: {},
            stack:[]
          }
        ],
        objSelected:{
          id:"id", column: 1, row:1},
        currentState:{
          column:2,row:1},
        activity: Object.freeze({
          "MASHING":"MASHING",
          "BOILING":"BOILING",
          "FERMENTATION":"FERMENTATION",
          "BOTTLING":"BOTTLING"
        }),
        state: Object.freeze({
          "MASH_WATER":"Mash water",
          "POST_MASH_WORT":"Post-mash wort",
          "POST_BOIL_WORT":"Post-boil wort",
          "FERMENTED_WORT":"Fermented wort",
          "BEER":"Beer"}),
        selected_equipment: "",
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
        ]
      }
    },

    created() {
      this.initialize_recipe(1, this.recipes);
    },

    updated () {
    },

    mounted () {
    },

    methods:{

      add_element_to_stack: function (recipe, action){
        recipe.stack.push(action);
      },
      remove_last_element_from_stack: function (recipe){
        recipe.stack.pop();
      },

      initialize_recipe: function (id, recipes){
        recipes[id].flow = homebrewlib.newRecipe();
        recipes[id].stack.push(this.state.MASH_WATER);
      },
/*
      create_recipe: function (id, recipe, first_action){
        this.id = id; //id corresponds to the row in which the recipe is setted
        this.flow = recipe;
        this.stack = [first_action];

        this.addElementToStack = function(action){
          this.stack.push(action);
        }

        this.removeLastElementFromStack = function(){
          this.stack.pop();
        }

        return this;
      },
*/
      init_recipe: function (recipe, id) {
        this.recipe = methods.create_recipe(1, homebrewlib.newRecipe(), state.MASH_WATER);
        //this.recipe.flow.reset();
        this.recipes[1] = recipe;
      },

      appear: function (){
        this.objSelected.id = event.currentTarget.id;
        let style;
        let row;
        let column;
        let obj = document.getElementById(this.objSelected.id);
        style = window.getComputedStyle(obj);
        column = style.getPropertyValue('grid-column-start');
        row = style.getPropertyValue('grid-row-start');
        if(this.objSelected.id.indexOf("itemS")!== -1 && document.getElementById("state-button") == null){
          obj.appendChild(this.showStateButton(this.objSelected.id, parseInt(row), parseInt(column)));
          obj.appendChild(this.showActivityButton(parseInt(row), parseInt(column),
            this.recipes[row].stack[this.recipes[row].stack.length -1]));
        }
        else if (this.objSelected.id.indexOf("itemA") !== -1 && document.getElementById("delete-button") == null){
          obj.appendChild(this.showDeleteButton(this.objSelected.id, parseInt(row), parseInt(column)));
        }
      },

      disappear: function () {
        let id = event.currentTarget.id;
        let obj;
        obj = document.getElementById(id);
        this.objSelected.id = id;
        obj.style.background = "none";
        if(this.objSelected.id.indexOf("itemS")!== -1){
          obj.removeChild(document.getElementById("state-button"));
          obj.removeChild(document.getElementById("activity-button"));
        }
        else if(this.objSelected.id.indexOf("itemA")!== -1) {
          obj.removeChild(document.getElementById("delete-button"));
        }
      },

      showStateButton: function(stateId, row, column){
        let item = document.createElement("div");
        item.setAttribute("id", "state-button");
        item.style.gridColumn = (column+1) +"/ "+(column+1);
        item.style.gridRow = row +"/ "+row;
        item.style.display = "inline-block";
        let buttonSplit = document.createElement("button");
        let buttonMerge = document.createElement("button");
        let splitImg = document.createElement("img");
        let mergeImg = document.createElement("img");
        splitImg.setAttribute("src", "../../../static/images/simbols/icon/split.png");
        splitImg.setAttribute("class", "icon");
        splitImg.style.height = "22px";
        splitImg.style.width = "22px";
        mergeImg.setAttribute("src", "../../../static/images/simbols/icon/merge.png");
        mergeImg.setAttribute("class", "icon");
        mergeImg.style.height = "22px";
        mergeImg.style.width = "22px";
        buttonSplit.appendChild(splitImg);
        buttonMerge.appendChild(mergeImg);
        buttonSplit.setAttribute("class", "button");
        buttonSplit.onclick = function () { this.splitActivities(stateId, row, column); };
        buttonSplit.style.display = "block";
        buttonMerge.setAttribute("class", "button");
        buttonMerge.onclick = function () { this.mergeActvities(); }
        buttonMerge.style.display ="block";

        item.appendChild(buttonSplit);
        item.appendChild(buttonMerge);
        return item;
      },

      showActivityButton: function(row, column, type){
        let item = document.createElement("div");
        item.setAttribute("id", "activity-button");
        item.style.gridColumn = (column+1) +"/ "+(column+1);
        item.style.gridRow = row +"/ "+row;
        item.style.display = "inline-block";
        /*
        if(column === 2 && row === 1)
            type= "MASHING";
            */
        switch(type){ // a seconda dell'attività si avranno più o meno scelte
          case this.state.MASH_WATER:
          case this.state.POST_MASH_WORT: {
            item.appendChild(this.createActivityButton(row, column, this.activity.MASHING));
            item.appendChild(this.createActivityButton(row, column, this.activity.BOILING));
            item.appendChild(this.createActivityButton(row, column, this.activity.FERMENTATION));
            item.appendChild(this.createActivityButton(row, column, this.activity.BOTTLING));
            break;
          }
          case this.state.POST_BOIL_WORT: {
            item.appendChild(this.createActivityButton(row, column, this.activity.BOILING));
            item.appendChild(this.createActivityButton(row, column, this.activity.FERMENTATION));
            item.appendChild(this.createActivityButton(row, column, this.activity.BOTTLING));
            break;
          }
          case this.state.FERMENTED_WORT: {
            item.appendChild(this.createActivityButton(row, column, this.activity.FERMENTATION));
            item.appendChild(this.createActivityButton(row, column, this.activity.BOTTLING));
            break;
          }
          case this.state.BEER:{
            item.appendChild(this.createActivityButton(row, column, this.activity.BOTTLING));
            break;
          }
        }
        return item;
      },

      createActivityButton: function (row, column, text){
        let button = document.createElement("button");
        button.innerText = text;
        button.onclick = function (){this.addActivity(row, column, text);};
        button.style.display = "block";
        button.setAttribute("class", "button");

        return button;
      },

      showDeleteButton: function (id, row, column){
        let item = document.createElement("div");
        item.setAttribute("id", "delete-button");
        item.style.gridColumn = (column-1) + "/ " + (column -1);
        item.style.gridRow = row +"/ "+row;
        item.style.display = "inline-block";
        let buttonDelete = document.createElement("button");
        buttonDelete.innerText = "X";
        buttonDelete.onclick = function (){this.deleteActivity(id, row);};
        buttonDelete.setAttribute("class", "button");
        item.appendChild(buttonDelete);
        return item;
      },

      addActivity: function (row, column, type){
        let container = document.getElementById("grid-container");
        let recipe = this.recipes[row].flow;
        switch(type){
          case this.activity.MASHING: {
            recipe.mash();
            break;
          }
          case this.activity.BOILING: {
            this.recipes[row].flow.boil();
            break;
          }
          case this.activity.FERMENTATION: {
            this.recipes[row].flow.ferment();
            break;
          }
          case this.activity.BOTTLING:{
            this.recipes[row].flow.bottle();
            break;
          }
        }


        //this.recipes[row].addElementToStack(recipe.state[recipe.state.length-1].name);
        this.add_element_to_stack(this.recipes[row],recipe.state[recipe.state.length-1].name)

        //crea una nuova attività con id incrementato
        this.lastCreatedActivityId += 1;

        let newActivity = this.createActivity(this.lastCreatedActivityId, row, column + 1, type);
        //crea un nuovo stato con id incrementato
        this.lastCreatedStateId += 1;
        let newState = this.createState(this.lastCreatedStateId, row, column + 2, "../../../static/images/simbols/arrow.png");

        container.appendChild(newActivity);
        container.appendChild(newState);

        this.currentState.column += 2;
        //stackRecipe.push("simple"); //aggiorna lo stackRecipe1
      },

      mergeActivities: function (){
        if(this.stackRecipe[this.stackRecipe.length-1] === "divide") {
          let container = document.getElementById("grid-container");
          //crea il nuovo stato di merge
          this.lastCreatedActivityId += 1;
          let newActivity = this.createActivity(this.lastCreatedActivityId, this.currentState.row, this.currentState.column + 1);
          //modifica img stato merged riga secondaria

          document.getElementById("imgS" + this.lastCreatedStateId).src = "../../../static/images/simbols/arrow5.png";
          //modifica img stato merged riga principale

          document.getElementById("imgS" + (this.lastCreatedStateId-1)).src = "../../../static/images/simbols/arrow2.png";
          //crea il nuovo stato di merge
          this.lastCreatedStateId += 1;
          let newState = this.createState(this.lastCreatedStateId, this.currentState.row, this.currentState.column + 2, "simbols/arrow.png");

          container.appendChild(newState);
          container.appendChild(newActivity);

          this.currentState.column += 2;
          //stackRecipe.addElementToStack("merge");
          //stackRecipe.push("merge"); //aggiorna lo stackRecipe1
        }
      },

      deleteActivity: function (objToDeleteId, row){
        let container = document.getElementById("grid-container");
        let elementsInARow = document.getElementsByClassName("grid-item-row"+row);
        let objToDelete = document.getElementById(objToDeleteId);
        let objToDeleteStyle = window.getComputedStyle(objToDelete);
        let columnObjToDelete = objToDeleteStyle.getPropertyValue('grid-column-start');
        for(let i = elementsInARow.length-1; i>=0; i--) {
          let otherObjStyle = window.getComputedStyle(elementsInARow[i]);
          let columnOtherObject = otherObjStyle.getPropertyValue('grid-column-start');
          if ((columnObjToDelete - 1) < columnOtherObject && columnOtherObject != 1) {
            container.removeChild(document.getElementById(elementsInARow[i].getAttribute("id")));
            this.lastCreatedActivityId--;
            if(i%2 == 0){
              this.recipes[row].flow.undo();
              //this.recipes[row].removeLastElementFromStack();
              this.remove_last_element_from_stack(this.recipes[row]);
            }
          }
          this.currentState.column --;

        }
      },

      splitActivities: function (stateId, row, column){
        let container = document.getElementById("grid-container");
        //crea due nuove attività
        let newRow = row+1;

        let newRecipe = this.recipes[row].flow.split(5);
        if(this.recipes.length === row+1) // se l'array contiene come ultimo elemento la ricetta corrente
          this.recipes[newRow] = new Recipe(parseInt(recipes[row].id) + 1, newRecipe);

        else{ //altrimenti shifta in basso le altre ricette per lasciar spazio a quella nuova
          for(let i=newRow; i<this.recipes.length; i++){
            let shifter = document.getElementsByClassName("grid-item-row"+i);
            for(let j=0; j<shifter.length; j){
              shifter[j].classList.add("grid-item-row"+(i+1));
              shifter[j].classList.remove("grid-item-row"+i);
            }
          }
          //recipes[newRow]= new Recipe(parseInt(recipes[row].id)+1, newRecipe);
          for(let i=newRow; i<this.recipes.length; i++){
            this.recipes[i].id +=1;
          }
          this.recipes.splice(newRow, 0, this.create_recipe(parseInt(this.recipes[row].id)+1, newRecipe));
        }


        let name = this.recipes[row].flow.state[(column-1)/2].name;
        //this.recipes[newRow].addElementToStack(name);
        this.add_element_to_stack(this.recipes[newRow], name);

        document.getElementById("imgS" + stateId.slice(5,6)).src = "../../../static/images/simbols/arrow2.png";

        this.lastCreatedStateId += 1;
        let splitState = this.createState(this.lastCreatedStateId, newRow, column, "../../../static/images/simbols/arrow3.png");
        container.appendChild(splitState);
      },

      createActivity:function(id, row, column, type){
        let item;
        item = document.createElement("div");
        item.setAttribute("class", "grid-item-row"+row);
        item.setAttribute("id", "itemA"+id);
        item.setAttribute("onmouseover", "appear(id)");
        item.setAttribute("onmouseleave", "disappear(id)");
        item.innerText = type;
        item.style.gridColumn = column +"/ "+column;
        //item.style.gridRow = row +"/ "+row;
        return item;
      },

      createState:function(id, row, column, path){
        let item;
        let img;
        item = document.createElement("div");
        item.setAttribute("class", "grid-item-row"+row);
        item.setAttribute("id", "itemS"+id);
        item.setAttribute("onmouseover", "appear(id)");
        item.setAttribute("onmouseleave", "disappear(id)");
        item.style.gridColumn = column +"/ "+column;
        item.style.paddingRight = "5px";
        item.style.paddingLeft = "5px";
        img = document.createElement("img");
        img.setAttribute("src", path);
        img.setAttribute("id", "imgS" +id);
        img.style.paddingTop ="5px";

        item.appendChild(img);

        return item;
      }

    }



  }


</script>


