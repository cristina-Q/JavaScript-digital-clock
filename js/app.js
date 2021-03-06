let currentColor = localStorage.getItem('setColor');
if (currentColor) {
  document.querySelector(':root').style.setProperty('--main-color', currentColor);
}

const alarmsound = new Audio('./media/crows.mp3');

const date = document.querySelector('.date');
const time = document.querySelector('#time');
const weekday = document.getElementById('dayname');
const month = document.getElementById('month');
const daynumber = document.getElementById('daynumber');
const year = document.getElementById('year');

let startDisplayTime;

function displayTime() {
  let date = new Date();

  let dayname = date.getDay();
  let monthnow = date.getMonth();
  let daynow = formatDigits(date.getDate());
  let yearnow = date.getFullYear();

  let hours = formatDigits(date.getHours());
  let minutes = formatDigits(date.getMinutes());
  let seconds = formatDigits(date.getSeconds());

  let daytime = 'am';
  if (hours > 12) {
    daytime = 'pm';
    hours = hours - 12;
  }

  if (hours === 0) {
    hours = 12;
  }

  let timenow = `${hours}:${minutes}:${seconds} ${daytime}`;
  time.textContent = timenow;

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const months = [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May.',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.',
  ];
  dayname = weekdays[dayname];
  weekday.textContent = `${dayname} -`;

  monthnow = months[monthnow];
  month.textContent = `${monthnow}`;

  daynumber.textContent = `${daynow}`;
  year.textContent = `${yearnow}`;
}
displayTime();
startDisplayTime = setInterval(displayTime, 1000);

//--------------  change page accent color  ----------
const colorchange = document.querySelector('.change-color');
const colororiginal = document.querySelector('.logo');

colorchange.addEventListener('click', () => {
  let setcurrentColor = getRandomColor();
  document.querySelector(':root').style.setProperty('--main-color', setcurrentColor);
  localStorage.setItem(`setColor`, `${setcurrentColor}`);
});

colororiginal.addEventListener('click', (e) => {
  document.querySelector(':root').style.setProperty('--main-color', 'cyan');
  e.preventDefault();
});

// --------------------------------------------------
//                 reuse functions
//---------------------------------------------------
function formatDigits(digit) {
  if (digit < 10) {
    digit = '0' + digit;
  }
  return digit;
}

function getRandomColor() {
  let chars = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += chars[Math.floor(Math.random() * 16)];
  }
  return color;
}

//--------------  freez time   ----------------------

const btnLeft = document.querySelector('.btn-left');
const btnRight = document.querySelector('.btn-right');

btnLeft.addEventListener('click', getFreez);

function getFreez(e) {
  clearInterval(startDisplayTime);
  let startfreez = Date.now();
  time.textContent = 'FREEZ';
  document.querySelector('.freez-time').textContent = 'FREEZ ON';
  document.querySelector('.freez-time').style.color = 'var(--main-color)';
  document.querySelector('.alarm-time').textContent = 'DEFREEZ';

  //now the second button start to listen inside first event propagation
  btnRight.addEventListener('click', (e) => {
    document.querySelector('.wrapper-picktime').classList.add('d-none');
    let stopfreez = Date.now();
    let difference = Math.abs(startfreez - stopfreez);
    time.textContent = getTimeDifference(difference);
    date.textContent = 'FREEZING TIME FOR:';

    document.querySelector('.alarm-time').style.color = 'var(--main-color)';
    document.querySelector('.alarm-time').textContent = 'STILL COUNT';
    document.querySelector('.freez-time').textContent = 'to CLOCK';
    document.querySelector('.freez-time').style.color = 'var(--main-color)';

    btnLeft.removeEventListener('click', getFreez);

    e.preventDefault();
  });

  e.preventDefault();
}

function getTimeDifference(diff) {
  let diffInHrs = diff / 3600000;
  let hours = Math.floor(diffInHrs);

  let diffInMin = (diffInHrs - hours) * 60;
  let minutes = Math.floor(diffInMin);

  let diffInSec = (diffInMin - minutes) * 60;
  let seconds = Math.floor(diffInSec);

  let formattedhours = hours.toString().padStart(2, '0');
  let formattedminutes = minutes.toString().padStart(2, '0');
  let formattedseconds = seconds.toString().padStart(2, '0');

  return `${formattedhours} : ${formattedminutes} : ${formattedseconds}`;
}

//--------------  set alarm   ----------------------

const usersetalarm = document.querySelector('#usersetalarm');
const inputmin = document.querySelector('.pick-minutes');
const inputhour = document.querySelector('.pick-hour');
const datalistminute = document.querySelector('.listminute');
const datalisthour = document.querySelector('.listhour');
const turnoffalarm = document.querySelector('.turnoff');
const alarmcontrols = document.querySelector('.wrapper-alarm');

let userinputhour;
let userinputmin;
let checkAlarmID;

//var defined for percentage fill color svg (effect on alarm mode) -> next feature to implement
let timecheckalarm;
let timesetalarm;
let fillalartime;

btnRight.addEventListener('click', setAlarm);

function checkAlarm() {
  let datenow = new Date();
  let h = datenow.getHours();
  let m = datenow.getMinutes();
  timecheckalarm = datenow.getTime();

  //'01' == 1 -> true
  if (userinputhour == h && userinputmin == m) {
    alarmsound.play();
    clearInterval(checkAlarmID);
    fillalarmtime = datenow.getTime();
  }
}

function setAlarm(e) {
  clearInterval(startDisplayTime);
  btnLeft.removeEventListener('click', getFreez);
  time.textContent = '';
  date.textContent = '';
  date.textContent = 'please, set alarm';

  document.querySelector('.wrapper-picktime').classList.remove('d-none');
  document.querySelector('.alarm-time').style.color = 'var(--main-color)';
  document.querySelector('.alarm-time').textContent = 'ALARM MOD';
  document.querySelector('.freez-time').textContent = 'clear alarm';
  document.querySelector('.freez-time').style.color = 'red';

  //---------user input minute
  inputmin.addEventListener('click', (e) => {
    datalistminute.style.display = 'block';
    for (let option of datalistminute.options) {
      option.onclick = function () {
        inputmin.value = this.value;
        datalistminute.style.display = 'none';
      };
    }
    e.preventDefault;
  });

  //---------user input hour
  inputhour.addEventListener('click', (e) => {
    datalisthour.style.display = 'block';
    for (let option of datalisthour.options) {
      option.onclick = function () {
        inputhour.value = this.value;
        datalisthour.style.display = 'none';
      };
    }
    e.preventDefault;
  });

  usersetalarm.addEventListener('click', function (e) {
    clearInterval(startDisplayTime);
    userinputhour = inputhour.value; // -> string
    userinputmin = inputmin.value; // -> string

    // empty string -> false
    if (userinputhour && userinputmin) {
      timesetalarm = Date.now();
      document.querySelector('.wrapper-picktime').classList.add('d-none');
      date.textContent = `Current active alarm | ${userinputhour} : ${userinputmin}`;
      displayTime();
      setInterval(displayTime, 1000);
      time.style.fontSize = '55px';
      time.style.color = 'var(--neutral-color)';
      checkAlarmID = setInterval(checkAlarm, 1000 * 5);
    }

    e.preventDefault();
  });

  e.preventDefault();
}
