// const lightModeBtn = document.querySelector(".light-mode");
// const darkModeBtn = document.querySelector(".dark-mode");
const modeBtns = document.querySelectorAll(".mode-btn");
const lightAndDarkModeCheckbox = document.querySelector(".light-dark-checkbox");
const mainContainer = document.getElementById("main-container");

// modeBtns.forEach((button) => {
//   if (button.classList.contains("light")) {
//   }

//   if (button.classList.contains("dark")) {
//   }
// });

const proxy = `https://cors-anywhere.herokuapp.com/`;
const apiUrl = `https://jobs.github.com/positions.json?`;

async function getJobsData(url) {
  const res = await fetch(url);
  const data = await res.json();

  console.log(data);
}

getJobsData(apiUrl);
