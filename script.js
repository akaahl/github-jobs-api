const html = document.documentElement;
const modeBtns = document.querySelectorAll('.mode-btn');
const lightAndDarkModeCheckbox = document.querySelector('.light-dark-checkbox');
const mainContainer = document.getElementById('main-container');

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

const apiUrl = `https://jobs.github.com/positions.json?`;

// function updateDOM(data) {}

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

    function getTimePosted() {
      const currentDate = new Date().getDate();
      const currentHours = new Date().getHours();
      const jobDate = +date.split(' ')[2];
      const jobHour = +date.split(' ')[3].split(':')[0];

      if (currentDate == jobDate) {
        return currentHours - jobHour + 'H';
      } else {
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
