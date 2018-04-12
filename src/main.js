// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue 			from 'vue';
import App 			from './App';
import router 	from './router';

// @see https://sweetalert.js.org/ for docs and usage
import swal 		from 'sweetalert';

/* ****************************************** */
/*  Form validator with localization support  */
/* ****************************************** */

import VeeValidate 	from 'vee-validate';
import messagesIt 	from 'vee-validate/dist/locale/it.js';
import attributesIt from 'vee-validate/dist/locale/it.js';
import messagesEn 	from 'vee-validate/dist/locale/en.js';
import attributesEn from 'vee-validate/dist/locale/en.js';

const config = {
  errorBagName: 'errors', 	// change if property conflicts
  fieldsBagName: 'fields',
  delay: 0,
  locale: 'it', 			// locale, è già inclusa una traduzione in italiano (./lab/node_modules/vee-validate/dist/locale)
  dictionary: {
    it: { messages: messagesIt, attributes: attributesIt },
    en: { messages: messagesEn, attributes: attributesEn }
  },
  strict: true,
  classes: false,
  classNames: {
    touched: 'touched', 	// the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', 		// model is valid
    invalid: 'invalid', 	// model is invalid
    pristine: 'pristine', 	// control has not been interacted with
    dirty: 'dirty' 			// control has been interacted with
  },
  events: 'input|blur',
  inject: true,
  validity: false,
  aria: true
};

Vue.use(VeeValidate, config);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
