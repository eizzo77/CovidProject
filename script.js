// setting up some consts like buttons and countries global Obj.
const continentsButtons = document
  .querySelector(".continent-buttons-container ")
  .querySelectorAll("input[type='button']");
const databuttons = document
  .querySelector(".data-buttons-container ")
  .querySelectorAll("input[type='button']");
const countriesContainer = document.querySelector(".countries-container");
const countriesFixedObj = {};
// duplicate of fetch methods because somewhat it didn't work when a string was passed as an argument.
const fetchCountry = async () => {
  const response = await fetch(
    `https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1`
  );
  const countryData = await response.json();
  return countryData;
};

const fetchCovidData = async () => {
  const response = await fetch(
    `https://api.codetabs.com/v1/proxy?quest=https://corona-api.com/countries`
  );
  const countryData = await response.json();
  return countryData.data;
};
// setting up click event handlers for buttons
const addClickHandlers = (buttonsGroup) => {
  buttonsGroup.forEach((button) =>
    button.addEventListener("click", (e) => {
      buttonsGroup.forEach((b) => b.classList.remove("selected"));
      e.target.classList.add("selected");
    })
  );
};

const addClickListenersContinents = () => {
  continentsButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      selectedDataButton = document
        .querySelector(".data-buttons-container")
        .querySelector(".selected");
      updateChart(e.target.value, selectedDataButton.value);
    });
  });
};

const addClickListenersDatas = () => {
  databuttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      selectedContinentButton = document
        .querySelector(".continent-buttons-container")
        .querySelector(".selected");
      updateChart(selectedContinentButton.value, e.target.value);
    });
  });
};

const addClickListenersDisplayCountries = () => {
  continentsButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      removeAllCountries();
      const countries = getCountriesByContinent(e.target.value);
      countries.forEach((c) => {
        const countryEl = document.createElement("button");
        countryEl.textContent = c.name;
        countriesContainer.append(countryEl);
        countryEl.addEventListener("click", (e) => {
          displayCountryChart(c);
        });
      });
    });
  });
};

const removeAllCountries = () => {
  while (countriesContainer.hasChildNodes()) {
    countriesContainer.removeChild(countriesContainer.lastChild);
  }
};

// excecuting the fetching and setting ups.
fetchCovidData().then((covidCountriesStats) => {
  covidCountriesStats.forEach((_, i, arr) => {
    countriesFixedObj[arr[i].code] = arr[i];
  });
  fetchCountry()
    .then((countries) => {
      countries.forEach((c) => {
        if (countriesFixedObj.hasOwnProperty(c.cca2)) {
          countriesFixedObj[c["cca2"]].region = c.region;
        }
      });
    })
    .then(() => {
      addClickHandlers(continentsButtons);
      addClickHandlers(databuttons);
      addClickListenersContinents();
      addClickListenersDatas();
      addClickListenersDisplayCountries();
      updateChart("Asia", "confirmed");
    });
});

const getCountriesByContinent = (continent) => {
  return continent === "World"
    ? Object.values(countriesFixedObj)
    : Object.values(countriesFixedObj).filter((c) => c.region === continent);
};

const getDataByCountries = (countries, dataRequired) => {
  return countries.map((c) => c[dataRequired]);
};

const updateChart = (continent, data) => {
  if (myChart.config.type === "pie") {
    changeChartStyle("line");
  }
  const countries = getCountriesByContinent(continent);
  myChart.data.labels = getDataByCountries(countries, "name");
  const latestCovidData = getDataByCountries(countries, "latest_data");
  myChart.data.datasets[0].data = getDataByCountries(latestCovidData, data);
  myChart.data.datasets[0].label = `covid 19 ${data} cases`;
  myChart.update();
};

const displayCountryChart = (country) => {
  if (myChart.config.type === "line") {
    changeChartStyle("pie");
  }
  myChart.data.labels = [
    "confirmed",
    "deaths",
    "critical",
    "recovered",
    "new confirmed",
    "new deaths",
  ];
  myChart.data.datasets[0].data = getCountryStats(country);
  myChart.data.datasets[0].label = `${country.name} Covid Stats`;
  myChart.update();
};

const getCountryStats = (country) => {
  const statsArr = [];
  statsArr.push(country.latest_data.confirmed);
  statsArr.push(country.latest_data.deaths);
  statsArr.push(country.latest_data.critical);
  statsArr.push(country.latest_data.recovered);
  statsArr.push(country.today.confirmed);
  statsArr.push(country.today.deaths);
  return statsArr;
};
// if we want to change the chart type we have to destroy the other one and create a new one with the desired type.
const changeChartStyle = (chartType) => {
  myChart.destroy();
  myChart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: [],
      datasets: [
        {
          label: "",
          data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
  });
};

// CHART
var ctx = document.querySelector("#myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Covid 19 Confirmed cases",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});
