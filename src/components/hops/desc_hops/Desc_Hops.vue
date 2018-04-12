<!--
  Desc_Hops template to describe hops
  by Mathyas Giudici
-->
<template>
<div class="deschops">
  <div class="ui raised container ">
    <div v-for="value in more_properties">
      <h3 v-if=" value == 'name' " class="ui header">
        <p v-if=" more_content[value] == '' ">Nome</p>
        <p v-else>{{ more_content[value] | clean_up }}</p>
      </h3>
      <p v-else>{{ value | map }} : {{ more_content[value] | clean_up }}</p>
    </div>
  </div>

</div>

</template>

<style scoped type="text/css">
  p{
    display: block; /* or inline-block, at least its a block element */
    width: 500px;; /* or width is certain by parent element */
    height: auto; /* height cannot be defined */
    word-break: break-all; /*  */
    word-wrap: break-word; /* if you want to cut the complete word */
    white-space: normal; /* be sure its not 'nowrap'! ! ! :/ */
  }
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
  .is-danger {
    color: #FF0000;
  }
  .ui.raised.container{
    vertical-align: text-top;
    text-indent:0px;
    max-width: inherit;
  }
</style>

<script type="text/javascript">

"use strict";

import * as toFilter from '../../../assets/filters';

export default {
  name: 'Desc_Hops',

  props:['more_content'],

  data: function() { return{
    more_properties: toFilter.more_properties_hops(), } },

  filters: {
    map: function(string){
      return toFilter.map(string);
    },
    clean_up: function(string){
      return toFilter.clean_up(string);
    }
  }

}

</script>
