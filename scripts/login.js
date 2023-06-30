"use strict";

const inputUser = document.getElementById("input--user");
const inputPass = document.getElementById("input--pass");
const btnLogin = document.getElementById("btn--login");
const btnRegister = document.getElementById("btn--register");
const btnLogo = document.querySelector(".logo");
btnLogin.addEventListener("click", function (e) {
  const userCurrent = userArr.find(user => user.username === inputUser.value);
  e.preventDefault();
  const isValidate = validateDate();
  if (isValidate) {
    if (userCurrent) {
      alert("Đăng nhập thành công !");
      saveToStorage("userAction", userCurrent);
      window.location.pathname = "/page/login.html";
    }
  }
  function validateDate() {
    const checkUser = userArr.find(user => inputUser.value === user.username);
    if (inputUser.value === "" || inputPass.value === "") {
      alert("Vui lòng nhập username và password đầy đủ !");
      return false;
    }

    if (
      !checkUser ||
      inputUser.value !== userCurrent.username ||
      inputPass.value !== userCurrent.password
    ) {
      alert("Tài khoản hoặc mật khẩu không đúng vui lòng kiểm tra lại");
      return false;
    }

    return true;
  }
});

btnLogo.addEventListener("click", () => {
  window.location.pathname = "/index.html";
});

btnRegister.addEventListener("click", () => {
  window.location.pathname = "/index.html";
});
