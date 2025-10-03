/*get all elements that are important from html*/
const display = document.querySelector(".display");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const customInput = document.getElementById("customSeconds");
const setCustomTimerBtn = document.getElementById("setCustomTimerBtn");
const lapContainer = document.getElementById("lapContainer");
const lapList = document.getElementById("lapList");
const themeToggle = document.getElementById("themeToggle");

/*initialize variables; elapsedTime and countdown Time is in centiseconds*/
let timer = null;
let elapsedTime = 0;  
let countdownTime = 0; 
let countdownMode = false;
let isRunning = false;
let lapTimes = [];
let lapCounter = 1;

/*function to update the display*/
function updateDisplay(centiseconds) {
  let totalSeconds = Math.floor(centiseconds / 100);
  let hrs = Math.floor(totalSeconds / 3600);
  let mins = Math.floor((totalSeconds % 3600) / 60);
  let secs = totalSeconds % 60;
  let cs = centiseconds % 100;

  //adding leading zeros to the time components
  let formatted =
    String(hrs).padStart(2, "0") +
    ":" +
    String(mins).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0") +
    "." +
    String(cs).padStart(2, "0");
  display.textContent = formatted;
}

// Format time in HH:MM:SS.CS
function formatTime(centiseconds) {
  let totalSeconds = Math.floor(centiseconds / 100);
  let hrs = Math.floor(totalSeconds / 3600);
  let mins = Math.floor((totalSeconds % 3600) / 60);
  let secs = totalSeconds % 60;
  let cs = centiseconds % 100;

  return (
    String(hrs).padStart(2, "0") +
    ":" +
    String(mins).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0") +
    "." +
    String(cs).padStart(2, "0")
  );
}


//function to start the timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timer = setInterval(() => {
    if (countdownMode) {
      if (countdownTime > 0) {
        countdownTime--;
        updateDisplay(countdownTime);
      } else {
        clearInterval(timer);
        isRunning = false;
        alert("Time's up!");
      }
    } else {
      elapsedTime++;
      updateDisplay(elapsedTime);
    }
  }, 10); // Update every 10ms for centisecond precision
  
}

/*function to stop the timer*/
function stopTimer() {
  clearInterval(timer);
  isRunning = false;
}

/*function to reset the timer*/
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  elapsedTime = 0;
  countdownTime = 0;
  countdownMode = false;
  lapTimes = [];
  lapCounter = 1;
  updateDisplay(0);
  startStopBtn.textContent = "Start";
  clearLapDisplay();
}

//function to set a custom countdown 
function setCustomTimer() {
  let input = Number(customInput.value);
  if (input > 0) {
    countdownTime = input * 100; // Convert seconds to centiseconds
    countdownMode = true;
    elapsedTime = 0;
    updateDisplay(countdownTime);
  } else {
    alert("Please enter a valid number.");
  }
}

//function to record lap times
function recordLap() {
  if (!isRunning || countdownMode) {
    return; // Only allow laps during stopwatch mode (not countdown)
  }

  const currentTime = elapsedTime;
  const previousLapTime =
    lapTimes.length > 0 ? lapTimes[lapTimes.length - 1].totalTime : 0;
  const lapTime = currentTime - previousLapTime;

  const lapData = {
    lapNumber: lapCounter,
    lapTime: lapTime,
    totalTime: currentTime,
  };

  lapTimes.push(lapData);
  lapCounter++;

  displayLap(lapData);
}

// Function to display lap information
function displayLap(lapData) {
  // Show the lap container if it's hidden
  lapContainer.style.display = "block";

  // Create lap entry
  const lapEntry = document.createElement("div");
  lapEntry.className = "lap-entry";
  lapEntry.innerHTML = `
    <strong>Lap ${lapData.lapNumber}:</strong> 
    ${formatTime(lapData.lapTime)} 
    <span class="total-time">(Total: ${formatTime(lapData.totalTime)})</span>
  `;

  // Add to the top of the lap list
  lapList.insertBefore(lapEntry, lapList.firstChild);
}

//fu nction to clear lap display
function clearLapDisplay() {
  lapList.innerHTML = "";
  lapContainer.style.display = "none";
}

// Toggle start/stop functionality
function toggleStartStop() {
  if (isRunning) {
    stopTimer();
    startStopBtn.textContent = "Start";
  } else {
    startTimer();
    startStopBtn.textContent = "Stop";
  }
}

// Theme toggle functionality
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌓";

  // Save the theme preference to localStorage
  localStorage.setItem("theme", newTheme);
}

// Initialize theme on page load
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌓";
}

// Initialize theme when page loads
initTheme();

startStopBtn.addEventListener("click", toggleStartStop);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);
setCustomTimerBtn.addEventListener("click", setCustomTimer);
themeToggle.addEventListener("click", toggleTheme);
