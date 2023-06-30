"use strict";

// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,

//   movementsDates: [
//     '2019-11-18T21:31:17.178Z',
//     '2019-12-23T07:42:02.383Z',
//     '2020-01-28T09:15:04.904Z',
//     '2020-04-01T10:17:24.185Z',
//     '2020-05-08T14:11:59.604Z',
//     '2020-07-26T17:01:17.194Z',
//     '2020-07-28T23:36:17.929Z',
//     '2020-08-01T10:51:36.790Z',
//   ],
//   currency: 'EUR',
//   locale: 'pt-PT', // de-DE
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,

//   movementsDates: [
//     '2019-11-01T13:15:33.035Z',
//     '2019-11-30T09:48:16.867Z',
//     '2019-12-25T06:04:23.907Z',
//     '2020-01-25T14:18:46.235Z',
//     '2020-02-05T16:33:06.386Z',
//     '2020-04-10T14:43:26.374Z',
//     '2020-06-25T18:49:59.371Z',
//     '2020-07-26T12:01:20.894Z',
//   ],
//   currency: 'USD',
//   locale: 'en-US',
// };

// const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const inputLogOut = document.querySelector(".logout__btn");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
//--
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePass = document.querySelector(".form__input--pass");

if (currentUser) {
  let timer;

  //Logout tài khoản
  inputLogOut.addEventListener("click", () => {
    const isLogOut = confirm("Bạn chắc chắn muốn thoát không?");
    // nếu có thì thực thi lệnh
    if (isLogOut) {
      localStorage.removeItem("userAction");
      window.location.href = "../../Web_Bank/page/login.html";
    }
  });

  function showHome() {
    if (currentUser) {
      labelWelcome.textContent = `Welcome back, ${
        currentUser.owner.split(" ")[0]
      }`;
      containerApp.style.opacity = 100;
      updateUI(currentUser);

      //current date and time
      const currentDate = new Date();
      const options = {
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        weekday: "long",
      };

      labelDate.textContent = new Intl.DateTimeFormat(
        currentUser.locale,
        options
      ).format(currentDate);

      //Timer
      if (timer) clearInterval(timer);
      timer = startLogOutTimer();
    }
  }

  //format lại currency
  const formatCur = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  //format date
  const formatMovementDate = (date, locale) => {
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);
    if (daysPassed === 0) return "Today";
    if (daysPassed === 1) return "Yesterday";
    if (daysPassed <= 7) return `${daysPassed} days ago`;

    return new Intl.DateTimeFormat(locale).format(date);
  };

  // create time log out
  const startLogOutTimer = () => {
    //reverse time
    const reverseTime = () => {
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);
      labelTimer.textContent = `${min}:${sec}`;
      //if time = 0 return opacity =0 and change labelwelcome
      if (time === 0) {
        clearInterval();
        window.location.href = "../../Web_Bank/page/login.html";
        alert("Bạn đã hết thời gian đăng nhập vui lòng đăng nhập lại !");
      }
      time--;
    };
    //set time
    let time = 120;
    const timer = setInterval(reverseTime, 1000);
    return timer;
  };

  // Show information movements
  const displayMovements = (acc, sort = false) => {
    containerMovements.innerHTML = "";

    const movs = sort
      ? acc.movements.slice().sort((a, b) => a - b)
      : acc.movements;

    movs.forEach((mov, i) => {
      const type = mov > 0 ? "deposit" : "withdrawal";

      const date = new Date(acc.movementsDates[i]);
      const displayDate = formatMovementDate(date, acc.locale);

      const formattedMov = formatCur(mov, acc.locale, acc.currency);

      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

      containerMovements.insertAdjacentHTML("afterbegin", html);
    });
  };

  // calc banlance
  const calcDisplayBalance = acc => {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
  };

  // calc summary
  const calcDisplaySummary = acc => {
    const incomes = acc.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

    const out = acc.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = formatCur(
      Math.abs(out),
      acc.locale,
      acc.currency
    );

    const interest = acc.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * acc.interestRate) / 100)
      .filter(int => {
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = formatCur(
      interest,
      acc.locale,
      acc.currency
    );
  };

  const updateUI = acc => {
    // Display movements
    displayMovements(acc);

    // Display balance
    calcDisplayBalance(acc);

    // Display summary
    calcDisplaySummary(acc);
  };

  showHome();

  // click vào request loan
  btnLoan.addEventListener("click", e => {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);
    console.log(currentUser.movements.some(mov => mov >= amount * 0.1));
    if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
      setTimeout(function () {
        // Add movement
        currentUser.movements.push(amount);

        // Add loan date
        currentUser.movementsDates.push(new Date().toISOString());

        // Update UI
        updateUI(currentUser);

        // Reset timer
        clearInterval(timer);
        timer = startLogOutTimer();

        saveToStorage("userAction", currentUser);
        const index = userArr.findIndex(
          userItem => userItem.username === currentUser.username
        );
        userArr[index] = currentUser;
        saveToStorage(KEY, userArr);
      }, 100);
      alert("Request Loan thành công");
      inputLoanAmount.value = "";
    }
    console.log("a");
  });

  // click vào transfer
  btnTransfer.addEventListener("click", e => {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = userArr.find(
      acc => acc.username === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = "";

    if (
      amount > 0 &&
      receiverAcc &&
      currentUser.balance >= amount &&
      receiverAcc?.username !== currentUser.username
    ) {
      // Doing the transfer
      currentUser.movements.push(-amount);
      receiverAcc.movements.push(amount);

      //add date of transfer
      currentUser.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();

      // Update UI
      updateUI(currentUser);

      saveToStorage("userAction", currentUser);
      const index = userArr.findIndex(
        userItem => userItem.username === currentUser.username
      );
      userArr[index] = currentUser;
      saveToStorage(KEY, userArr);
    }
  });

  // khóa tài khoản
  btnClose.addEventListener("click", e => {
    e.preventDefault();
    const isConfirm = confirm("Bạn chắc chắn có muốn khóa tài khoản?");
    if (isConfirm) {
      if (
        inputCloseUsername.value === currentUser.username &&
        inputClosePass.value === currentUser.password
      ) {
        const index = userArr.findIndex(
          acc => acc.username === currentUser.username
        );
        // Delete account
        userArr.splice(index, 1);

        // lưu vào storage
        saveToStorage(KEY, userArr);

        // xóa userAction hiện tại
        localStorage.removeItem("userAction");

        // Hide UI
        window.location.href = "../../Web_Bank/page/login.html";
      }
    }
  });

  // sắp xếp
  let sorted = false;
  btnSort.addEventListener("click", function (e) {
    e.preventDefault();
    displayMovements(currentUser, !sorted);
    sorted = !sorted;
  });
} else {
  alert("Bạn cần đăng nhập hoặc đăng kí tài khoản");
  window.location.href = "../../Web_Bank/page/login.html";
}
