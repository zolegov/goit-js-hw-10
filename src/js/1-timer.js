// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const button = document.querySelector('.btn');
button.setAttribute('disabled', '');
const datetimePicker = document.querySelector('#datetime-picker'); // input
const valueDays = document.querySelector('.valueDays');
const valueHours = document.querySelector('.valueHours');
const valueMinute = document.querySelector('.valueMinute');
const valueSec = document.querySelector('.valueSec');
let intervalId;
let userSelectedDate = 0;

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const timeNow = Date.parse(new Date());

    if (timeNow > Date.parse(selectedDates[0])) {
      iziToast.error({
        backgroundColor: 'rgb(239, 64, 64)',
        messageColor: 'white',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      button.setAttribute('disabled', '');
    } else {
      userSelectedDate = Date.parse(selectedDates[0]);
      button.removeAttribute('disabled', '');
      button.style.backgroundColor = '#4e75ff';
    }
  },
};

flatpickr('#datetime-picker', options);

// button.addEventListener('click', () => {
//   function timeGo() {
//     const currentTime = Date.now(); // Отримуємо поточний час
//     const timeDifference = userSelectedDate - currentTime; // Обчислюємо різницю в часі
//     console.log('timeDifference: ', timeDifference);

//     if (timeDifference <= 0) {
//       clearInterval(intervalId);
//       datetimePicker.removeAttribute('disabled');
//       button.setAttribute('disabled', '');
//       return;
//     }

//     const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//     const hours = Math.floor(
//       (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//     );
//     const minutes = Math.floor(
//       (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
//     );
//     const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

//     valueDays.innerHTML = days;
//     valueHours.innerHTML = hours;
//     valueMinute.innerHTML = minutes;
//     valueSec.innerHTML = seconds;
//   }

//   datetimePicker.setAttribute('disabled', ''); // Деактивуємо input, щоб користувач не міг змінити дату
//   button.setAttribute('disabled', ''); // Деактивуємо кнопку, щоб користувач не міг клікнути на неї ще раз

//   // Викликаємо функцію timeGo() один раз, щоб одразу відобразити час
//   timeGo();

//   // Запускаємо інтервал, який викликає функцію timeGo() кожну секунду
//   intervalId = setInterval(timeGo, 1000);
// });
function addLeadingZero(value) {
  return value.toString().padStart(2, 0);
}

button.addEventListener('click', () => {
  function timeGo() {
    button.style.backgroundColor = 'rgb(207, 207, 207)';
    button.style.cursor = 'default';
    datetimePicker.style.cursor = 'default';
    const currentTime = Date.now(); // Отримуємо поточний час
    const timeDifference = userSelectedDate - currentTime; // Обчислюємо різницю в часі
    const { days, hours, minutes, seconds } = convertMs(timeDifference);

    button.setAttribute('disabled', '');
    if (timeDifference <= 0) {
      clearInterval(intervalId);
      datetimePicker.removeAttribute('disabled');

      return;
    }

    valueDays.innerHTML = addLeadingZero(days);
    valueHours.innerHTML = addLeadingZero(hours);
    valueMinute.innerHTML = addLeadingZero(minutes);
    valueSec.innerHTML = addLeadingZero(seconds);
  }

  datetimePicker.setAttribute('disabled', '');
  button.setAttribute('disabled', '');
  timeGo();

  intervalId = setInterval(timeGo, 1000);
});
