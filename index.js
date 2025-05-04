let time = 100;
let timerId;
let loadingCount = 5;
let data = [];
let selectedIndex = 0;

function startTimer() {
  timerId = setTimeout(updateTimer, 5);
}

function stopTimer() {
  time = 100;
  document.querySelector(".progress").style.width = time + "%";
  clearTimeout(timerId);
}

function updateTimer() {
  time -= 0.1;
  if (time <= 0) {
    selectImage(selectedIndex + 1);
    time = 100;
  }
  document.querySelector(".progress").style.width = time + "%";
  startTimer();
}

function toggleTimer(event) {
  if (event.target.textContent === "STOP") {
    event.target.textContent = "PLAY";
    stopTimer();
  } else {
    event.target.textContent = "STOP";
    startTimer();
  }
}

function selectImage(index) {
  selectedIndex = Number(index);
  if (selectedIndex === data.length) {
    reload();
  }

  document.querySelectorAll(".container1 div").forEach((item, i) => {
    if (i === selectedIndex) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });

  document.querySelector(".preview img").src = data[selectedIndex].download_url;
  document.querySelector(".preview img").classList.add("loading");
  document.querySelector(".preview .author").textContent =
    data[selectedIndex].author;
}

function showPreview() {
  const images = document.querySelectorAll(".container1 img");
  data.forEach((item, i) => {
    images[i].src = item.download_url;
    images[i].classList.add("loading");
  });
  selectImage(0);
}

function reload() {
  loadingCount = 5;
  stopTimer();
  const page = Math.floor(Math.random() * 200);
  fetch("https://picsum.photos/v2/list?page=" + page + "&limit=4")
    .then((response) => response.json())
    .then((json) => {
      data = json;
      showPreview();
    });
}

function togglePreview(event) {
  if (event.target.tagName !== "IMG") return;
  stopTimer();
  document.querySelector(".play").textContent = "PLAY";
  selectImage(event.target.dataset.index);
}

function handleLoad(event) {
  loadingCount -= 1;
  if (
    loadingCount === 0 &&
    document.querySelector(".play").textContent === "STOP"
  ) {
    startTimer();
  }
  event.target.classList.remove("loading");
}

function init() {
  reload();
  document
    .querySelector(".container1")
    .addEventListener("click", togglePreview);
  document.querySelector(".new").addEventListener("click", reload);
  document.querySelectorAll("img").forEach((item) => {
    item.onload = handleLoad;
  });
  document.querySelector(".play").addEventListener("click", toggleTimer);
}

window.addEventListener("DOMContentLoaded", init);
