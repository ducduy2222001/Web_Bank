"use strict";

const KEY = "USER_ARRAY";

function getFromStorage(KEY) {
  return JSON.parse(localStorage.getItem(KEY));
}

function saveToStorage(KEY, value) {
  localStorage.setItem(KEY, JSON.stringify(value));
}

const users = getFromStorage(KEY) ?? [];

const currentUser = getFromStorage("userAction")
  ? parseUser(getFromStorage("userAction"))
  : null;

// viết tắt tên user
const createUsernames = accs => {
  accs.forEach(function (acc) {
    acc.owner = `${acc.firstname} ${acc.lastname}`;
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(name => name[0])
      .join("");
  });
};

const userArr = users.map(user => parseUser(user));

const createCurrentUser = acc => {
  acc.owner = `${acc.firstname} ${acc.lastname}`;
  acc.username = acc.owner
    .toLowerCase()
    .split(" ")
    .map(name => name[0])
    .join("");
};

createUsernames(userArr);

if (currentUser) {
  createCurrentUser(currentUser);
}
function parseUser(userData) {
  const user = new User(
    userData.firstname,
    userData.lastname,
    userData.password,
    userData.phone,
    userData.movements,
    userData.movementsDates
  );

  return user;
}
