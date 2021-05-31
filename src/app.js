import { DateCounter, JSONDate, Logger } from './lib.js';

function renderLogs(logs, $el) {
  let html = '';
  logs.forEach(jsonDate => {
    const dateTime = `${JSONDate.getDate(jsonDate)}, ${JSONDate.getTime(jsonDate)}`;
    html += `<li>${dateTime}</li>`;
  });
  $el.innerHTML = html;
}

function renderDailyStats(stats, $el) {
  let html = '';
  for (let date in stats) {
      html += `<tr><td>${date}</td><td>${stats[date]}</td></tr>`;
  }
  $el.innerHTML = html;
}

function render() {
  const logs = logger.getLogs();
  const stats = DateCounter.count(logs);
  renderLogs(logs, $logs);
  renderDailyStats(stats, $stats)
}

function log() {
  logger.log(JSONDate.now(), () => {
    render();
  });
}

function copyText() {
  $copyText.select();
  $copyText.setSelectionRange(0, 99999); // For mobile devices
  // Copy the text inside the text field 
  document.execCommand("copy");
} 

document.addEventListener('DOMContentLoaded', () => {
  if(typeof(Storage) !== 'undefined') {
    logger = new Logger(localStorage);
    $logs = document.getElementById('logs');
    $stats = document.getElementById('stats');
    $logBtn = document.getElementById("logBtn");
    $copyBtn = document.getElementById("copyBtn");
    $copyText = document.getElementById("copyText");
    
    $logBtn.addEventListener('click', log);
    $copyBtn.addEventListener('click', copyText);
    $copyText.value = JSON.stringify(localStorage);
    
    render();
  } else {
    alert('Sorry, your browser does not support web storage...');
  }
}, false);

let logger, $logs, $stats, $logBtn, $copyBtn, $copyText;