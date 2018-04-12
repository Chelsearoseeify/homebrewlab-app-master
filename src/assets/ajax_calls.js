/* ******************************************************************* */
/*      ajax_calls.js: utility functions to make ajax calls            */
/* ******************************************************************* */

import axios from 'axios';
import { getCookie } from './cookie';

/**
 * Istantiates the query_executor object with basic properties. 
 * See @https://github.com/axios/axios for other default options.
 * This is the general purpose scheme to send request to the server:
 * - baseURL that contains the server URL that hosts the API
 * The baseURL is concatenated to the specific endpoint name to form the complete URL to the API
 * - timeout
 * Cancel the request if it's taking forever (expressed in ms)
 * - authentication header
 * To properly authenticate the users, contains the token
 * For every request add the specific endpoint (not the full URL)
 * For POST & PUT request, add to the headers
 * - "content-type": "application/x-www-form-urlencoded
 * For DELETE, PUT, GET(single) add the ID of the element after the specific endpoint
 *
 * Adjust the timeout time as needed per request. For example, PUT could take a mean longer time while a single GET should take
 * lesser time.
 */
const id_token = localStorage.getItem("id_token") || getCookie("id_token");
const query_executor = axios.create({
	baseURL: 'https://homebrewlab.it/',
	timeout: 1500,
	headers: {
		"accept": "application/json",
		"authorization": "Bearer " + id_token,
	},
});

/**
 * getData executes a GET request to the remote server specified by the endpoint parameter.
 * params:
 * endpoint: string, required. The name of the remote endpoint
 * resource_id: string, optional. Additional parameters to be sent to the server, forexample the ID of a specific item to get.
 *
 * Each error is logged in the console. The generic failure error (error code out of range 2xx) is also displayed to the user
 */
export function getData(endpoint, resource_id) {
	// Use resource_id if provided to build the endpoint URL
	if(resource_id !== undefined) {
		endpoint = endpoint + "/" + resource_id;
	}
	return query_executor.get(endpoint, {timeout: 1000})
	.then(response => response.data)
	.catch(error => {
		if (error.response) {
	    // The request was made and the server responded with a status code
	    // that falls out of the range of 2xx
	    if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
		    console.log(error.response.data);
		    console.log(error.response.status);
		    console.log(error.response.headers);
		  }
  	} else if (error.request) {
	    // The request was made but no response was received
	    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
	    // http.ClientRequest in node.js
	    if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
	    	console.log(error.request);
	    }
  	} else {
    	// Something happened in setting up the request that triggered an Error
    	if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
     		console.log('Error', error.message);
     	}
   	}
   	if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
   		console.log(error.config);
   	}
	});
}

/**
 * postData executes a POST request to the remote server specified by the endpoint parameter.
 * params:
 * endpoint: string, required. The name of the remote endpoint
 * data: object, required. The data to be sent to the server
 *
 * Each error is logged in the console. The generic failure error (error code out of range 2xx) is also displayed to the user
 */
export function postData(endpoint, element_name, data_to_send) {
	return query_executor.post(endpoint, data_to_send, {timeout: 2000, "content-type": "application/x-www-form-urlencoded"})
	.then(response => {
		swal("Tutto OK!", element_name + " salvato correttamente", "success");
		return response.data;
	})
	.catch(error => {
		if (error.response) {
	    // The request was made and the server responded with a status code
	    // that falls out of the range of 2xx
	    if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
		    console.log(error.response.data);
		    console.log(error.response.status);
		    console.log(error.response.headers);
		  }
	    swal("Errore!", "Errore: " + error.response.status, "error");
  	} else if (error.request) {
	    // The request was made but no response was received
	    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
	    // http.ClientRequest in node.js
	    if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
	    	console.log(error.request);
	    }
	 	} else {
	  	// Something happened in setting up the request that triggered an Error
	  	if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
	   		console.log('Error', error.message);
	   	}
	 	}
	 	if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
	 		console.log(error.config);
	 	}
	});
}

/**
 * putData executes a PUT request to the remote server specified by the endpoint parameter.
 * params:
 * endpoint: string, required. The name of the remote endpoint
 * resource_id: string, required. The id of the element on the remote server to operate with
 * * enpoint will be concatenated with the resource_id and baseURL property before executing the request
 * data: object, required. The data to be sent to the server
 *
 * Each error is logged in the console. The generic failure error (error code out of range 2xx) is also displayed to the user
 */
 export function putData(endpoint, element_name, resource_id, data_to_send) {
 	return query_executor.put(endpoint + "/" + resource_id, data_to_send, {timeout: 2000, "content-type": "application/x-www-form-urlencoded"})
 	.then(response => {
 		swal("Tutto OK!", element_name + " salvato correttamente", "success");
 		return response.data;
 	})
 	.catch(error => {
		if (error.response) {
	    // The request was made and the server responded with a status code
	    // that falls out of the range of 2xx
	    if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
		    console.log(error.response.data);
		    console.log(error.response.status);
		    console.log(error.response.headers);
		  }
	    swal("Errore!", "Errore: " + error.response.status, "error");
  	} else if (error.request) {
	    // The request was made but no response was received
	    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
	    // http.ClientRequest in node.js
	    if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
	    	console.log(error.request);
	  	}
	 	} else {
	  	// Something happened in setting up the request that triggered an Error
	  	if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
	   		console.log('Error', error.message);
	   	}
	 	}
	 	if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
	 		console.log(error.config);
	 	}
 	})
}

/**
 * deleteData executes a DELETE request to the remote server specified by the endpoint parameter.
 * params:
 * endpoint: string, required. The name of the remote endpoint
 * resource_id: string, required. The id of the element on the remote server to operate with
 * * enpoint will be concatenated with the resource_id before executing the request
 *
 * Each error is logged in the console. The generic failure error (error code out of range 2xx) is also displayed to the user
 */
export function deleteData(endpoint, element_name, resource_id) {
	return query_executor.delete(endpoint + "/" + resource_id, {timeout: 2000})
	.then(response => {
		swal("Tutto OK!", element_name + " eliminato correttamente", "success");
	})
	.catch(error => {
		if (error.response) {
	    // The request was made and the server responded with a status code
	    // that falls out of the range of 2xx
	    if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
		    console.log(error.response.data);
		    console.log(error.response.status);
		    console.log(error.response.headers);
		  }
	    swal("Errore!", "Errore: " + error.response.status, "error");
  	} else if (error.request) {
	    // The request was made but no response was received
	    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
	    // http.ClientRequest in node.js
	    if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
	    	console.log(error.request);
	  	}
	 	} else {
	  	// Something happened in setting up the request that triggered an Error
	  	if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
	   		console.log('Error', error.message);
	   	}
	 	}
	 	if(process.env.NODE_ENV === 'development' || window.location.href.search(LOCAL_DEV_SERVER) > 0) {
	 		console.log(error.config);
	 	}
	})
}