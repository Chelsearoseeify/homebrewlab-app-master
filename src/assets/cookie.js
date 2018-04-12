/* ******************************************************************* */
/*      cookie.js: utility functions to set or retrieve cookies        */
/* ******************************************************************* */


/*
 * Set a cookie on the current path with a "cname" as name, "cvalue" as value and "exdays" as expiration days, counted from today
 * params:
 * cname: string, required
 * cvalue: string, required
 * exdays: integer, required (float should work too, for example to set half a day as the cookie duration)
 */
export function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/*
 * Check if the cookie with name "cname" exists and has a value different from null/empty/undefined.
 * Returns true if such cookie exists, false otherwise
 * params:
 * cname: string, required
 */
export function isSet(cname) {
  let cookie = getCookie(cname);
  if(cookie != "") {
    return true;
  } else {
    return false;
  }
}

/**
 * Returns the value of the cookie with name "cname" or "" if such cookies doesn't exist
 * param:
 * cname: string, required (name of the cookie to retrieve)
 */
export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Deletes a cookie by setting it's expiration date in the past
 * param:
 * cname: string, required (name of the cookie to delete)
 */
export function deleteCookie(cname) {
  if(getCookie(cname)) {
    document.cookie = name + "=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}