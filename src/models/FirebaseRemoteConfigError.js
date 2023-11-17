// var RemoteConfigErrorCode =
//   "aborted"
//   | "already-exist"s
//   | "failed-preconditio"n
//   | "internal-erro"r
//   | "invalid-argumen"t
//   | "not-foun"d
//   | "out-of-rang"e
//   | "permission-denie"d
//   | "resource-exhauste"d
//   | "unauthenticate"d
//   | "unknown-error";

/**
 * FirebaseRemoteConfigError class.
 *
 * @constructor
 * @param {String} code - The error code.
 * @param {String} message - The error message. 
 */
function FirebaseRemoteConfigError( code, message ){
  this.code = code;
  this.message = message;
}
