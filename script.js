const covidEndPoint = `https://corona-api.com/countries`;
const countryEndPoint = `https://restcountries.herokuapp.com/api/v1`;
const continentsButtons = document
  .querySelector(".continent-buttons-container ")
  .querySelectorAll("input[type='button']");
const databuttons = document
  .querySelector(".data-buttons-container ")
  .querySelectorAll("input[type='button']");
const countriesContainer = document.querySelector(".countries-container");

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
      console.log(countries);
      countries.forEach((c) => {
        const countryEl = document.createElement("button");
        countryEl.textContent = c.name;
        countriesContainer.append(countryEl);
      });
    });
  });
};

const removeAllCountries = () => {
  while (countriesContainer.hasChildNodes()) {
    countriesContainer.removeChild(countriesContainer.lastChild);
  }
};

const countriesFixedObj = {};
fetchCovidData().then((covidCountriesStats) => {
  covidCountriesStats.forEach((_, i, arr) => {
    countriesFixedObj[arr[i].code] = arr[i];
  });
  console.log(countriesFixedObj);
  fetchCountry()
    .then((countries) => {
      console.log(countries);
      countries.forEach((c) => {
        if (countriesFixedObj.hasOwnProperty(c.cca2)) {
          countriesFixedObj[c["cca2"]].region = c.region;
        }
      });
      console.log(countriesFixedObj);
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
  myChart.type = "line";
  const countries = getCountriesByContinent(continent);
  console.log(countries);
  myChart.data.labels = getDataByCountries(countries, "name");
  const latestCovidData = getDataByCountries(countries, "latest_data");
  myChart.data.datasets[0].data = getDataByCountries(latestCovidData, data);
  myChart.data.datasets[0].label = `covid 19 ${data} cases`;
  myChart.update();
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

// to refactor with filter and map on object.keys(countriesFixedObj)
//   asiaCountries = {};
//   for (const countryCode of Object.keys(countriesFixedObj)) {
//     if (countriesFixedObj[countryCode].region === "Asia") {
//       asiaCountries[countriesFixedObj[countryCode].name] =
//         countriesFixedObj[countryCode];
//     }
//   }
//   console.log(asiaCountries);
//   myChart.data.labels = Object.keys(asiaCountries);
//   myChart.data.datasets[0].data = Object.keys(asiaCountries).map(
//     (c) => asiaCountries[c].latest_data.confirmed
//   );
//   myChart.update();
