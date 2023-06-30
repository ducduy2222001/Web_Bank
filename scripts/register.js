"use strict";

const registerBtn = document.getElementById("btn__register");
const inputFirstName = document.getElementById("firstname");
const inputLastName = document.getElementById("lastname");
const inputPassword = document.getElementById("password");
const inputPhone = document.getElementById("phone");
const inputConfirmPassword = document.getElementById("confirmPass");

console.log(registerBtn);
//handler register
registerBtn.addEventListener("click", e => {
  e.preventDefault();
  const user = new User(
    inputFirstName.value,
    inputLastName.value,
    inputPassword.value,
    inputPhone.value
  );

  const isValidate = validateDate(user, inputConfirmPassword);
  if (isValidate) {
    //Mới tạo tài khoản sẽ được 50$
    user.movements.push(50);
    user.movementsDates.push(new Date().toISOString());
    userArr.push(user);
    createUsernames(userArr);
    saveToStorage(KEY, userArr);
    alert("Đăng kí thành công!");
    window.location.pathname = "page/login.html";
  }
});

const validateDate = (user, inputConfirmPassword) => {
  if (!user.firstname || !user.lastname || !user.password) {
    alert("Không có trường nào được bỏ trống!");
    return false;
  }

  if (user.password !== inputConfirmPassword.value) {
    alert("Password và Confirm Password phải giống nhau !");
    return false;
  }

  if (user.password <= 8 || inputConfirmPassword.value <= 8) {
    alert("Password phải có nhiều hơn 8 ký tự !");
    return false;
  }

  if (!validatePhoneNumber(user.phone)) {
    alert("Số điện thoại không đúng định dạng");
    return false;
  }

  if (!duplicateCheck(user.phone)) {
    alert("Phone không được trùng với Phone của các người dùng trước đó !");
    return false;
  }
  return true;
};

function duplicateCheck(usn) {
  return userArr.every(item => item.phone !== usn);
}

const validatePhoneNumber = phoneNumber => {
  // Loại bỏ tất cả các ký tự không phải là số
  var cleaned = phoneNumber.replace(/\D/g, "");

  // Kiểm tra định dạng số điện thoại
  var regex = /^(\+|0)?[1-9]\d{8,14}$/;
  return regex.test(cleaned);
};
