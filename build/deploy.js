"use strict";

/**
 * NPM-script to copy the output files of the command 'npm run build' into the source folder of a webserver.
 * Usage:
 * Run the script using
 * npm run deploy
 * Remember to build the application ***BEFORE*** deploying using npm run build
 *
 * Please ensure 'ncp' is installed either locally or globally via NPM: npm install ncp or npm install ncp -g
 * 'ncp' is the only additional package needed by this script.
 *
 * If EPERM error is thrown, the user executing this script doesn't have sufficient permission on the system to copy/create the files in the 
 * path of the destination folder. Run with sudo/administrative privileges if available to solve the EPERM error.
 *
 * The path in the global variables can be either absolute or relative.
 */

require('./check-versions')();

/**
 * The source folder containing the static files built from npm
 * If the folder doesn't exist a error will be thrown.
 * @type {String}
 */
const STATIC_FILES_BUILT_FOLDER = "dist"

/**
 * The destination folder for the copy operation
 * Should point to the public folder of a server that will serve the files.
 * For example: /public, /var/www, htdocs...
 * If the folder doesn't exist, will be created in the specified path.
 * @type {String}
 */
const SERVER_ROOT_FOLDER = "/opt/homebrewlab/public"

const ncp = require('ncp').ncp;

/**
 * Asynchronous copy of the files and folder from the source to the destination
 * clobber:   true -> overwrite the files
 * stopOnErr: true -> stop the execution of the script on the first error
 */
ncp(STATIC_FILES_BUILT_FOLDER, SERVER_ROOT_FOLDER, {clobber: true, stopOnErr: true}, function (err) {
  if (err) {
    throw new Error(err);
  }
  console.log(' Operation completed.\n');
});
