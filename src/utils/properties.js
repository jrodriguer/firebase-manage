"use strict";

var BASE_URI_DES = "https://backend-des.wenea.site/api",
  BASE_URI_PRE = "https://backend-pre.wenea.site/api",
  BASE_URI_PRO = "https://backend-pro.wenea.site/api",
  BASE_URI_DEHESA = "https://backend-dehesa.wenea.site/api";

var WENEA_VERSION = "3.0.2";

// Endpoint configuration
var BASE_URI = BASE_URI_DES,
  USER_ENDPOINT = BASE_URI + "/" + WENEA_API_VERSION + "/user";

// User-related endpoints
var WENEA_USER_LOGIN = USER_ENDPOINT + "/login/";

module.exports = {
  BASE_URI_DES: BASE_URI_DES,
  BASE_URI_PRE: BASE_URI_PRE,
  BASE_URI_PRO: BASE_URI_PRO,
  BASE_URI_DEHESA: BASE_URI_DEHESA,
  WENEA_VERSION: WENEA_VERSION,
  BASE_URI: BASE_URI,
  USER_ENDPOINT: USER_ENDPOINT,
  WENEA_USER_LOGIN: WENEA_USER_LOGIN,
};
