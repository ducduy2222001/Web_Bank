"use strict";
//class user
class User {
  constructor(
    firstname,
    lastname,
    password,
    phone,
    movements = [],
    movementsDates = [],
    locale = "en-US",
    currency = "USD"
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    this.phone = phone;
    this.movements = movements;
    this.movementsDates = movementsDates;
    this.locale = locale;
    this.currency = currency;
  }
}
