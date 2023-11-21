export function isBuffer( value ) {
  return value instanceof Buffer;
}

export function isArray( value ) {
  return Array.isArray( value );
}

export function isNonEmptyArray( value ) {
  return isArray( value ) && value.length !== 0;
}

export function isBoolean( value ) {
  return typeof value === "boolean";
}

export function isNumber( value ) {
  return typeof value === "number" && !isNaN( value );
}

export function isString( value ) {
  return typeof value === "string";
}

export function isBase64String( value ) {
  if ( !isString( value )) {
    return false;
  }
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test( value );
}

export function isNonEmptyString( value ) {
  return isString( value ) && value !== "";
}

export function isObject( value ) {
  return typeof value === "object" && !isArray( value );
}

export function isNonNullObject( value ) {
  return isObject( value ) && value !== null;
}

export function isUid( uid ) {
  return typeof uid === "string" && uid.length > 0 && uid.length <= 128;
}

export function isPassword( password ) {
  return typeof password === "string" && password.length >= 6;
}

export function isEmail( email ) {
  if ( typeof email !== "string" ) {
    return false;
  }
  // There must at least one character before the @ symbol and another after.
  const re = /^[^@]+@[^@]+$/;
  return re.test( email );
}

export function isPhoneNumber( phoneNumber ) {
  if ( typeof phoneNumber !== "string" ) {
    return false;
  }
  // Phone number validation is very lax here. Backend will enforce E.164
  // spec compliance and will normalize accordingly.
  // The phone number string must be non-empty and starts with a plus sign.
  const re1 = /^\+/;
  // The phone number string must contain at least one alphanumeric character.
  const re2 = /[\da-zA-Z]+/;
  return re1.test( phoneNumber ) && re2.test( phoneNumber );
}
