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

const getCountryCovidStats = async (countryCode) => {
  const response = await fetch(
    `https://api.codetabs.com/v1/proxy?quest=http://corona-api.com/countries/${countryCode}`
  );
  const countryCovidData = await response.json();
  //   console.log(countryCovidData.data);
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

getCountriesByRegion("europe").then((countries) => {
  Object.keys(countries).forEach((c) => {
    const countryObj = {
      countryCode: countries[c].cca2,
    };
    // console.log(countryObj.countryCode);
    localObj[countries[c].name.common] = countryObj;
    const covidStatsObj = getCountryCovidStats(countryObj.countryCode).then(
      (covidStats) => {
        countryObj["latestData"] = covidStats;
      }
    );
    // console.log(covidStatsObj);
    countryObj["latestData"] = covidStatsObj;
  });
});

// getCountryCovidStats("SE")

var ctx = document.querySelector("#myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
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
myChart.data.labels = ["A", "b", "C", "d"];
