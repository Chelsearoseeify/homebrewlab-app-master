import decode from 'jwt-decode';
import axios from 'axios';
import auth0 from 'auth0-js';
import Router from 'vue-router';
import Auth0Lock from 'auth0-lock';
import { setCookie, getCookie, deleteCookie } from './cookie';

const CLIENT_ID = 'Pko16SPKQLexDx70v2l1rAWnOdNEsGwT';
const CLIENT_DOMAIN = 'floriandaniel.eu.auth0.com';
const REDIRECT = window.location.href + 'callback';
const SCOPE = 'profile openid email';
const RESPONSE_TYPE = 'token';
const AUDIENCE = 'https://api.homebrewlab.it';

var router = new Router({
   mode: 'history',
});

const lock = new Auth0Lock(CLIENT_ID, CLIENT_DOMAIN, {
  auth: {
    redirectUrl: REDIRECT,
    responseType: RESPONSE_TYPE,
    params: {
      scope: SCOPE
    },
  },
  theme: {
    logo: "../../static/images/logo_title.png",
    primaryColor: '#ffa724'
  },
  language: "it",
  languageDictionary: {
    title: ""
  }
});

export function login() {
  lock.show();
}

export function logout() {
  clearAccessToken();
  router.go('/');
}

export function requireAuth(to, from, next) {
  if (!isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

/**
 * getParameterByName returns the string matching the "name" argument inside the URL
 */
function getParameterByName(name) {
  var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/**
 * Extracts and returns the token from Autho's callback URL
 */
function getAccessTokenFromURL() {
  return getParameterByName('access_token');
}

/**
 * Extracts and returns the token from Autho's callback URL
 */
function getIdTokenFromURL() {
  return getParameterByName('id_token');
}

/**
 * Extracts and returns the token from the localStorage
 * Fallback: uses cookies
 * Note: returns NULL if none found
 */
function getAccessToken() {
  return localStorage.getItem('access_token') || getCookie('access_token') || null;
}

/**
 * Extracts and returns the token from the localStorage
 * Fallback: uses cookies
 * Note: returns NULL if none found
 */
function getIdToken() {
  return localStorage.getItem('id_token') || getCookie('id_token') || null;
}

/**
 * Put the access_token in the localStorage
 * Fallback: uses cookies instead of browser storage (old browser or custom settings by the users)
 */
export function setAccessToken() {
  const urlToken = getAccessTokenFromURL();
  if(checkStorageAvailability()) {
    localStorage.setItem('access_token', urlToken);
  } else {
    setCookie("access_token", urlToken, 1);
  }
}

/**
 * Put the id_token in the localStorage & instantiate the query_executor with the id_token
 * Fallback: uses cookies instead of browser storage (old browser or custom settings by the users)
 */
export function setIdToken() {
  const urlToken = getIdTokenFromURL();
  if(checkStorageAvailability()) {
    localStorage.setItem('id_token', urlToken);
  } else {
    setCookie("id_token", urlToken, 1);
  }
}

/**
 * Deletes the id_token and access_token from localStorage upon logout()
 * Deletes the cookies by setting their values to "" and expiration to 0 days
 */
function clearAccessToken() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  deleteCookie("access_token");
  deleteCookie("id_token");
}

/**
 * Checks if the sessionStorage is available in the user's browser. If not, the authentication procedure stores its result in cookie only
 * The purpose is to prevent invalid DOM operation if the user has turned off the storage of the browser or if the browser is old and doesn't
 * support the storage capability.
 * The keyword "var" is used deliberately instead of "let" or "const" to maximise compatibility.
 * This is the same approach user by modernizr library.
 */
function checkStorageAvailability() {
  var test = 'test';
  try {
    sessionStorage.setItem(test, test);
    localStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    if(process.env.NODE_ENV === 'development') {
      console.error("storage object not available.");
    }
    return false;
  }
}

/**
 * Performs the necessary task to ensure the token validity
 * First executes a AJAX call, with method set to GET, inserting the token in the Authorization header.
 * Then reads the reply of the server and grants/denies access to the lab.
 * If the access is granted, then it saves the data of the user received from Auth0's server
 * Else, alerts the user and redirects it to the webapp's homepage
 * Sample payload below:
    {
      "email": "fedema94@gmail.com",
      "name": "Federico Macchi",
      "given_name": "Federico",
      "family_name": "Macchi",
      "picture": "https://lh5.googleusercontent.com/-fRTkF0TGaH8/AAAAAAAAAAI/AAAAAAAAAY0/XAR5JKig7Dg/photo.jpg",
      "gender": "male",
      "locale": "it",
      "nickname": "fedema94",
      "app_metadata": {
          "authorization": {
              "groups": []
          },
          "roles": [
              "admin"
          ]
      },
      "authorization": {
          "groups": []
      },
      "roles": [
          "admin"
      ],
      "permissions": [],
      "email_verified": true,
      "clientID": "Pko16SPKQLexDx70v2l1rAWnOdNEsGwT",
      "updated_at": "2017-12-02T10:36:37.111Z",
      "user_id": "google-oauth2|104644667463268264020",
      "identities": [
          {
              "provider": "google-oauth2",
              "user_id": "104644667463268264020",
              "connection": "google-oauth2",
              "isSocial": true
          }
      ],
      "created_at": "2017-04-10T09:30:56.621Z",
      "global_client_id": "oOQJz8Q1sds5DmepFrABLD50KKC2UaSH"
    }
 */
export function isLoggedIn() {
  const idToken = getIdToken();
  if(!!idToken && !isTokenExpired(idToken)) {
    getLoggedInUser(idToken);
    return true;
  } else {
    return false;
  }
}

/**
 * Contact the endpoint /tokeninfo to get the information about the current logged in users
 * Logs errors in dev mode only
 */
function getLoggedInUser(token) {
  axios({
    url: 'https://' + CLIENT_DOMAIN + '/tokeninfo',
    method: "POST",
    data: {
      "id_token" : token
    },
  }).then(response => {
    setUserData(response.data, token);
  }).catch(error => {
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

function setUserData(userData, token) {
  if(checkStorageAvailability()) {
    localStorage.setItem("id_token",     token);
    localStorage.setItem("user.email",   userData.email);
    localStorage.setItem("user.name",    userData.name);
    localStorage.setItem("user.picture", userData.picture);
    localStorage.setItem("user.locale",  userData.locale);
  } else {
    setCookie("user.email",   userData.email,   1);
    setCookie("user.name",    userData.name,    1);
    setCookie("user.picture", userData.picture, 1);
    setCookie("user.locale",  userData.locale,  1);
  }
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
