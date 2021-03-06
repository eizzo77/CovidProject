const covidEndPoint = `https://corona-api.com/countries`;
const countryEndPoint = `https://restcountries.herokuapp.com/api/v1`;
const countriesObj = {};

const fetchCountry = async () => {
  const response = await fetch(
    `https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1/region/asia`
  );
  const countryData = await response.json();
  return countryData;
};

// fetchCountry().then((data) => (obj = data));

const getCountriesByRegion = async (region) => {
  const response = await fetch(
    `https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1/region/${region}`
  );
  const regionCountriesData = await response.json();
  return regionCountriesData;
};

const getWorld = async () => {
  //   const asiaArr = await getCountriesByRegion("asia");
  //   const europeArr = await getCountriesByRegion("europe");
  //   const americasArr = await getCountriesByRegion("americas");
  //   const africaArr = await getCountriesByRegion("africa");
  //   return asiaArr.concat(europeArr, americasArr, africaArr);
  const response = await fetch(
    `https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1/`
  );
  const regionCountriesData = await response.json();
  return regionCountriesData;
};

const getCountryCovidStats = async (countryCode) => {
  const response = await fetch(
    `https://api.codetabs.com/v1/proxy?quest=http://corona-api.com/countries/${countryCode}`
  );
  //   console.log(`${countryCode}`);
  //   console.log(response);

  const countryCovidData = await response.json();
  const countryStatsObj = {
    population: countryCovidData.data.population,
    confirmed: countryCovidData.data.latest_data.confirmed,
    critical: countryCovidData.data.latest_data.critical,
    deaths: countryCovidData.data.latest_data.deaths,
    recovered: countryCovidData.data.latest_data.recovered,
  };

  return countryStatsObj;
};
let localObj = {};

const start = async () => {
  const countries = await getWorld();
  console.log(countries);
  countries.splice(
    countries.findIndex((c) => c.cca2 === "XK"),
    1
  );
  //   console.log(countries);
  const promises = countries.map((c) => getCountryCovidStats(c.cca2));
  const promiseAll = await Promise.all(promises);
  countries.forEach((c, i) => {
    const countryObj = {
      countryCode: c.cca2,
      covidData: promiseAll[i],
    };
    localObj[countries[i].name.common] = countryObj;
  });
  console.log(localObj);
  // console.log(countryObj);
  // console.log(covidStatsObj);
  //   countryObj["covidData"] = covidStatsObj;
  //   }
};

//! START HERE

start().then(() => {
  updateChart();
  myChart.update();
});

const updateChart = () => {
  //   console.log(localObj["Sweden"].covidData.confirmed);
  const countryKeys = Object.keys(localObj);
  myChart.data.labels = countryKeys;
  const countryConfirmedArr = countryKeys.map((c) => {
    return localObj[c].covidData.confirmed;
  });
  //   countryConfirmedArr.forEach((c, i) =>
  //     myChart.data.datasets.data.push(countryConfirmedArr[i])
  //   );
  myChart.data.datasets[0].data = countryConfirmedArr;
  //   console.log(localObj["Albania"]["covidData"]);
};

// getCountryCovidStats("SE")

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
