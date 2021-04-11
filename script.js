const html = document.documentElement;
const homePageBtn = document.getElementById('homepage-logo-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const lightAndDarkModeCheckbox = document.querySelector('.light-dark-checkbox');
const mainContainer = document.getElementById('main-container');
const formContainer = document.getElementById('form-container');
const searchByTitle = document.getElementById('search-by-title');
const searchByLocation = document.getElementById('search-by-location');
const fullTimeCheckBox = document.getElementById('fulltime-checkbox');
const loadMoreBtn = document.getElementById('load-more');

(function () {
  const currentTheme = localStorage.getItem('color-mode');

  if (currentTheme) html.setAttribute('data-theme', currentTheme);
})();

modeBtns.forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('light')) {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('color-mode', 'light');
    }
    if (button.classList.contains('dark')) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('color-mode', 'dark');
    }
  });
});

let searchInfoArray;
let pagination = 1;
let apiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions.json?page=${pagination}`;

function checkFullTime(checkbox) {
  return checkbox.checked ? true : false;
}

homePageBtn.addEventListener('click', () => {
  mainContainer.innerHTML = ``;
});

loadMoreBtn.addEventListener('click', () => {
  if (loadMoreBtn.classList.contains('search-active')) {
    apiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions.json?page=${(pagination += 1)}&description=${
      searchInfoArray[0]
    }&location=${searchInfoArray[1]}&full_time=${checkFullTime(
      fullTimeCheckBox
    )}`;
    getJobsData(apiUrl);
  } else {
    apiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions.json?page=${(pagination += 1)}`;
    getJobsData(apiUrl);
  }
});

async function getJobsData(url) {
  const res = await fetch(url);
  const data = await res.json();

  initialUpdateDOM(data);
}

function initialUpdateDOM(data) {
  const jobData = [...data];

  jobData.map(data => {
    const {
      company: companyName,
      company_logo: companyLogo,
      created_at: date,
      type: positionType,
      title: jobTitle,
      location: jobLocation,
    } = data;

    const monthsArray = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    function convertStringToMonthNumber(arr, str) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == str) {
          return i;
        }
      }
    }

    function getTimePosted() {
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();
      const currentHours = new Date().getHours();
      let jobMonth = convertStringToMonthNumber(
        monthsArray,
        date.split(' ')[1]
      );
      const jobDate = +date.split(' ')[2];
      const jobHour = +date.split(' ')[3].split(':')[0];

      if (currentMonth !== jobMonth) {
        return `More than 1M ago`;
      }

      if (currentDate == jobDate) {
        // Fix this
        return currentHours - jobHour + 'H';
      }

      if (currentDate - jobDate > 0) {
        return currentDate - jobDate + 'D';
      }
    }

    const sectionElement = document.createElement('section');
    sectionElement.innerHTML = `
      <div class="img-container">
          <img src="${
            companyLogo == null ? 'assets/desktop/no-logo-min.jpg' : companyLogo
          }" alt="company logo">
        </div>
        <p class="job-details">${getTimePosted()} ago &#183 ${positionType}</p>
        <p class="job-title">${jobTitle}</p>
        <p class="company-name">${companyName}</p>
        <p class="company-location">${jobLocation}</p>
    `;

    mainContainer.appendChild(sectionElement);
  });
}

getJobsData(apiUrl);

function searchJobs(e) {
  e.preventDefault();

  mainContainer.innerHTML = '';
  loadMoreBtn.classList.add('search-active');

  const termByTitle = searchByTitle.value.trim();
  const termByLocation = searchByLocation.value.trim();

  searchInfoArray = [termByTitle, termByLocation];

  function checkFullTime(checkbox) {
    return checkbox.checked ? true : false;
  }

  apiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions.json?page=${(pagination = 1)}&description=${
    searchInfoArray[0]
  }&location=${searchInfoArray[1]}&full_time=${checkFullTime(
    fullTimeCheckBox
  )}}`;

  getJobsData(apiUrl);
}

formContainer.addEventListener('submit', searchJobs);
