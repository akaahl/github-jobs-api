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
const aside = document.getElementById('aside-element');
const asideElement = document.createElement('aside');

let searchInfoArray, apiUrl, asideBackBtn;
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
        // aside.classList.toggle('show');
        break;
      case button.classList.contains('dark'):
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('color-mode', 'dark');
        // aside.classList.toggle('show');
        break;
    }
  });
});

apiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions.json?page=${pagination}`;

function checkFullTime(checkbox) {
  return checkbox.checked ? true : false;
}

homePageBtn.addEventListener('click', () => window.location.reload());

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

function getTimePosted(dateData) {
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

  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  const currentHours = new Date().getHours();
  let jobMonth = convertStringToMonthNumber(
    monthsArray,
    dateData.split(' ')[1]
  );
  const jobDate = +dateData.split(' ')[2];
  const jobHour = +dateData.split(' ')[3].split(':')[0];

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

    const sectionElement = document.createElement('section');
    sectionElement.setAttribute('data-id', id);
    sectionElement.addEventListener('click', showJobPosting);
    sectionElement.innerHTML = `
      <div class="img-container">
          <img src="${
            companyLogo == null ? 'assets/desktop/no-logo-min.jpg' : companyLogo
          }" alt="company logo">
        </div>
        <p class="job-details">${getTimePosted(
          date
        )} ago &#183 ${positionType}</p>
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
  header.scrollIntoView();
  const jobId = this.dataset.id;
  singleApiUrl = `https://pacific-taiga-98536.herokuapp.com/https://jobs.github.com/positions/${jobId}.json`;
  formContainer.classList.toggle('hide');
  mainContainer.classList.toggle('hide');
  footer.classList.toggle('hide');
  asideElement.style.display = 'block';
  setTimeout(() => {
    mainContainer.style.display = 'none';
    formContainer.style.display = 'none';
    footer.style.display = 'none';
    asideElement.classList.toggle('show');
  }, 500);

  async function getSingleJobData(apiUrl) {
    const res = await fetch(apiUrl);
    const data = await res.json();

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

    asideElement.innerHTML = `
      <header>
        <div class="img-container">
          <img src="${
            !companyLogo ? 'assets/desktop/no-logo-min.jpg' : companyLogo
          }" alt="logo-img">
        </div>
        <div class="company-details">
          <h3>${companyName}</h3>
          <p>${!companyUrl ? '' : companyUrl}</p>
        </div>
        <a href="${!companyUrl ? '#' : companyUrl}">Company Site</a>
        <button id="aside-back-btn" class="aside-back-btn">
          <img src="assets/desktop/arrow-left-svgrepo-com.svg" alt="back button" >
        </button>
      </header>

      <section class="job-posting-content">
        <div class="job-posting-details">
          <p class="time-posted">${getTimePosted(
            date
          )} ago &#183 ${positionType}</p>
          <h2>${jobTitle}</h2>
          <p class="job-location">${location}</p>
          <a href="#">Apply Now</a>
        </div>

        <div class="job-description">
          ${description}
        </div>
      </section>

      <div class="apply-section">
        <h4>How to Apply</h4>
        ${instruction}
      </div>

      <footer>
        <div>
          <h3>${jobTitle}</h3>
          <p>${companyName}</p>
        </div>

        <a href="${!companyUrl ? '' : companyUrl}">Apply Now</a>
      </footer>
    `;

    asideBackBtn = document.getElementById('aside-back-btn');
    asideBackBtn.addEventListener('click', () => {
      asideElement.classList.toggle('show');

      setTimeout(() => {
        mainContainer.style.display = 'grid';
        formContainer.style.display = 'flex';
        footer.style.display = 'block';
      }, 500);

      setTimeout(() => {
        formContainer.classList.toggle('hide');
        mainContainer.classList.toggle('hide');
        footer.classList.toggle('hide');
        asideElement.style.display = `none`;
        document.querySelector(`[data-id='${jobId}']`).scrollIntoView();
      }, 600);
    });
  }

  body.appendChild(asideElement);

  getSingleJobData(singleApiUrl);
}
