const html = document.documentElement;
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

let pagination = 1;
let apiUrl = `https://jobs.github.com/positions.json?page=${pagination}`;

loadMoreBtn.addEventListener('click', () => {
  pagination += 1;
  getJobsData(apiUrl);
  console.log(pagination);
  console.log(apiUrl);
});

async function getJobsData(url) {
  const res = await fetch(url);
  const data = await res.json();
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

    function convertStringToMonthNumber(str) {
      switch (str) {
        case 'Jan':
          return (str = 0);
          break;
        case 'Feb':
          return (str = 1);
          break;
        case 'Mar':
          return (str = 2);
          break;
        case 'Apr':
          return (str = 3);
          break;
        case 'May':
          return (str = 4);
          break;
        case 'Jun':
          return (str = 5);
          break;
        case 'Jul':
          return (str = 6);
          break;
        case 'Aug':
          return (str = 7);
          break;
        case 'Sep':
          return (str = 8);
          break;
        case 'Oct':
          return (str = 9);
          break;
        case 'Nov':
          return (str = 10);
          break;
        case 'Dec':
          return (str = 11);
          break;
      }
    }

    function getTimePosted() {
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();
      const currentHours = new Date().getHours();
      let jobMonth = convertStringToMonthNumber(date.split(' ')[1]);
      const jobDate = +date.split(' ')[2];
      const jobHour = +date.split(' ')[3].split(':')[0];

      if (currentMonth !== jobMonth) {
        return `More than 1M ago`;
      }

      if (currentDate == jobDate) {
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

  const termByTitle = searchByTitle.value.trim();
  const termByLocation = searchByLocation.value.trim();

  function checkField(field) {
    return !field ? '' : field;
  }

  function checkFullTime(checkbox) {
    return checkbox.checked ? true : false;
  }

  apiUrl = `https://jobs.github.com/positions.json?page=${pagination}&description=${checkField(
    termByTitle
  )}&location=${checkField(termByLocation)}&full_time=true}`;

  getJobsData(apiUrl);

  console.log(apiUrl);
}

formContainer.addEventListener('submit', searchJobs);
