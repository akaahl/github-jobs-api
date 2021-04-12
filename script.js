const html = document.documentElement;
const body = document.getElementsByTagName('body')[0];
const homePageBtn = document.getElementById('homepage-logo-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const header = document.getElementById('header');
const lightAndDarkModeCheckbox = document.querySelector('.light-dark-checkbox');
const mainContainer = document.getElementById('main-container');
const formContainer = document.getElementById('form-container');
const searchByTitle = document.getElementById('search-by-title');
const searchByLocation = document.getElementById('search-by-location');
const fullTimeCheckBox = document.getElementById('fulltime-checkbox');
const footer = document.getElementById('footer');
const loadMoreBtn = document.getElementById('load-more');
let searchInfoArray, apiUrl;
let pagination = 1;

(function () {
  const currentTheme = localStorage.getItem('color-mode');

  if (currentTheme) html.setAttribute('data-theme', currentTheme);
})();

modeBtns.forEach(button => {
  button.addEventListener('click', () => {
    switch (true) {
      case button.classList.contains('light'):
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('color-mode', 'light');
        break;
      case button.classList.contains('dark'):
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('color-mode', 'dark');
        break;
    }
  });
});

apiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions.json?page=${pagination}`;

function checkFullTime(checkbox) {
  return checkbox.checked ? true : false;
}

homePageBtn.addEventListener('click', () => {
  mainContainer.innerHTML = ``;
  apiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions.json?page=${pagination}`;
  getJobsData(apiUrl);
});

loadMoreBtn.addEventListener('click', () => {
  if (loadMoreBtn.classList.contains('search-active')) {
    apiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions.json?page=${(pagination += 1)}&description=${
      searchInfoArray[0]
    }&location=${searchInfoArray[1]}&full_time=${checkFullTime(
      fullTimeCheckBox
    )}`;
    getJobsData(apiUrl);
  }

  if (!loadMoreBtn.classList.contains('search-active')) {
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
      id: id,
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
    sectionElement.setAttribute('data-id', id);
    sectionElement.addEventListener('click', showJobPosting);
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

  apiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions.json?page=${(pagination = 1)}&description=${
    searchInfoArray[0]
  }&location=${searchInfoArray[1]}&full_time=${checkFullTime(
    fullTimeCheckBox
  )}}`;

  getJobsData(apiUrl);
}

formContainer.addEventListener('submit', searchJobs);

function showJobPosting() {
  const jobId = this.dataset.id;
  singleApiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions/${jobId}.json`;
  formContainer.classList.toggle('hide');
  mainContainer.classList.toggle('hide');
  footer.classList.toggle('hide');

  const asideElement = document.createElement('aside');

  setTimeout(() => {
    mainContainer.style.display = 'none';
    formContainer.style.display = 'none';
    footer.style.display = 'none';
  }, 500);

  async function getSingleJobData(apiUrl) {
    const res = await fetch(apiUrl);
    const data = await res.json();

    console.log(data);

    const {
      company: companyName,
      company_logo: companyLogo,
      company_url: companyUrl,
      created_at: date,
      description: description,
      how_to_apply: instruction,
      location: location,
      title: jobTitle,
      type: positionType,
      url: gitHubUrl,
    } = data;
  }
  body.appendChild(asideElement);
  getSingleJobData(singleApiUrl);
}
