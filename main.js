"use strict";
import * as Utils from "./includes/utils.js";

class DepartureTable {
  constructor() {
    //update params
    this.updateInterval = 60;
    this.updateIntervalObject = null;
    this.liveUpdate = true;
    //live clock
    this.clockObject = null;
    //station params
    this.stationID = null;
    this.stationName = null;
  }

  startClock() {
    this.stopClock();
    this.clockObject = Utils.showClock(dateContainer, {
      weekday: "long",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    return this.clockObject;
  }

  stopClock() {
    Utils.stopClock(this.clockObject);
    return true;
  }

  async getSuggestionsbyName(name) {
    // console.log("Entered name:", name);
    //clear suggestions list
    suggestionsList.innerHTML = "";
    let stations = await this.getStationsByName(name);
    // console.log("Stations found:", stations);
    if (!stations) return false;
    stations.forEach((station) => {
      let suggestion = document.createElement("option");
      suggestion.value = station.name;
      suggestion.id = station.id;
      suggestionsList.appendChild(suggestion);
      //When clicked on a suggestion -> automatically update the list
      suggestion.addEventListener("click", () => {
        this.setStation(station.id, station.name);
        this.update();
      });
    });
  }

  async takeFirstResultByName(name) {
    // console.log("Entered name:", name);
    let stations = await this.getStationsByName(name);
    if (!stations) {
      Utils.alertUser(
        "Keine Ergebnisse",
        `Keine Ergebnisse für "${name}" gefunden`
      );
      return "No results";
    }
    let fistResult = stations[0];
    this.setStation(fistResult.id, fistResult.name);
  }

  async takeFirstResultByGeolocation() {
    return new Promise(async (resolve, reject) => {
      let geoLocation = await Utils.getCurrentPosition();
      if (!geoLocation) resolve("No geolocation found");
      let stations = await this.getStationsByLocation(
        geoLocation.coords.latitude,
        geoLocation.coords.longitude
      );
      if (!stations) {
        console.log("Keine Stationen für den Standort gefunden.");
        return "No results";
      }
      let fistResult = stations[0];
      this.setStation(fistResult.id, fistResult.name);
      resolve(fistResult);
    });
  }

  async getStationData(id, name) {
    let stationData = await Utils.fetchData(DB_API_URL + `/stations/${id}`);
    if (stationData) return stationData;
    if (!name) return false;

    stationData = await this.getStationsByName(name);
    if (!stationData) return false;

    return stationData[0];
  }

  async setStation(id, name) {
    //Set new stationID and stationName
    this.stationID = id;
    this.stationName = name;
    //save id and name to local strorage
    window.localStorage.setItem("stationID", id);
    window.localStorage.setItem("stationName", name);
    //Set input and stationName
    stationInput.value = name;
    stationName.innerHTML = name;
    //request stationData by id
    this.stationData = await this.getStationData(id, name);
    console.log(`Station data for ${name}:`, this.stationData);
  }

  async getStationsByName(name) {
    let results = await Utils.fetchData(
      DB_API_URL +
        "/locations?query=" +
        encodeURI(name) +
        "&fuzzy=true&language=" +
        LANG
    );
    return results;
  }

  clearUpdateInterval() {
    window.clearInterval(this.updateIntervalObject);
  }

  async setUpdateInterval(seconds = null) {
    this.updateInterval =
      seconds ?? parseInt(updateIntervalInput.value) ?? UPDATE_INTERVAL;
    if (this.updateInterval < 10) {
      console.error("Update interval is too small");
      return "The update interval is too small: " + this.updateInterval;
    }
    this.updateIntervalObject = window.setInterval(() => {
      if (!liveUpdate.checked) {
        this.clearUpdateInterval();
      }
      this.update();
    }, this.updateInterval * 1000);
  }

  async getNextDepartures(id, limit = false) {
    return await Utils.fetchData(
      DB_API_URL +
        `/stops/${id}/departures?when=${new Date().toISOString()}&language=${LANG}&nationalExpress=${
          nationalExpress.checked
        }&national=${national.checked}&regionalExp=${
          regionalExp.checked
        }&regional=${regional.checked}&suburban=${suburban.checked}&bus=${
          bus.checked
        }&ferry=${ferry.checked}&subway=${subway.checked}&tram=${
          tram.checked
        }&taxi=${taxi.checked}&results=${limit}&duration=${duration.value}`
    );
  }

  departureRowContainsText(htmlRow, text) {
    return htmlRow.innerHTML.toLowerCase().includes(text.toLowerCase());
  }

  updateDeparturesDebounce = (timeout) =>
    Utils.debounce(() => departureTable.update(), timeout);

  async update() {
    if (autoGeoLocation.checked) {
      await this.takeFirstResultByGeolocation();
    }

    if (!liveClockCheckbox.checked) {
      //Update dateContainer
      dateContainer.innerHTML = `${new Date().toLocaleString(undefined, {
        weekday: "long",
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })}`;
    }

    this.lastRefresh = new Date();
    lastUpdateContainer.innerHTML = `${new Date().toLocaleString(undefined, {
      weekday: "short",
      month: "numeric",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })}`;

    let nextDepartures = await this.getNextDepartures(
      this.stationID,
      maxResults.value
    );
    departuresList.innerHTML = "";
    const setNoDeparturesFeedback = (feedback) => {
      departuresList.innerHTML = feedback;
    };
    console.log(
      `Next departures for station ${stationName} (${this.stationID})`,
      { nextDepartures }
    );
    if (!nextDepartures || !nextDepartures.length) {
      setNoDeparturesFeedback(
        `<tr><td colspan='3'><h3 class='d-block text-centered mt-4'>Keine nächsten Abfahrten"</h3></td></tr>`
      );
      return false;
    }

    for (const leavingVehicle of nextDepartures) {
      let item = document.createElement("tr");

      //Show with delay
      if (showDelay.checked) {
        if (leavingVehicle.delay) {
          let Planned_departure = new Date(leavingVehicle.plannedWhen);
          let delay = leavingVehicle.delay;

          let departure_with_Delay = new Date(
            leavingVehicle.when
          ); //Add delay in milliseconds to new departure

          console.log({leavingVehicle, delay, Planned_departure, departure_with_Delay });

          //Show on list
          let remainingTime = Utils.secondsToArrayOrString(
            (departure_with_Delay - new Date().getTime()) / 1000,
            "Array"
          );
          if (departure_with_Delay.getTime() - new Date().getTime() < 0) {
            console.log(leavingVehicle, `already departing`);
            //vehicle is already departed
            continue;
          }

          let departureString = "";
          if (remainingTime.minutes == 0 && remainingTime.hours < 1) {
            departureString = "<strong>Sofort</strong>";
          } else if (remainingTime.minutes > 0 && remainingTime.hours < 1) {
            departureString = `in <strong>${remainingTime.minutes}</strong> Min`;
          } else if (remainingTime.hours > 0 && remainingTime.days < 1) {
            departureString = `in <strong>${remainingTime.hours}h ${remainingTime.minutes}Min</strong>`;
          } else {
            departureString = `in <strong>${remainingTime.days}d ${remainingTime.hours}h ${remainingTime.minutes}Min</strong>`;
          }
          item.classList.add("delayed");
          item.innerHTML = `
            <td class="line">${leavingVehicle?.line?.name}</td>
            <td class="destination">${
              leavingVehicle.destination?.name ?? leavingVehicle.direction
            }</td>
            <td class="departure">
                <div>${departureString}</div>
                <div>Ursprünglich: ${Planned_departure.toLocaleString(
                  undefined,
                  {
                    minute: "2-digit",
                    hour: "2-digit",
                  }
                )}</div>
                <div class="delayed">Verspätung: ${Utils.secondsToArrayOrString(
                  delay
                )}</div>
                <div class="delayed">${departure_with_Delay.toLocaleString(
                  undefined,
                  {
                    minute: "2-digit",
                    hour: "2-digit",
                  }
                )}</div>
            </td>
            `;
          if (leavingVehicle.plannedPlatform) {
            let plattform = document.createElement("div");
            plattform.innerHTML = `<div>Bahnsteig ${leavingVehicle.plannedPlatform}</div>`;
            item.querySelector(".departure").appendChild(plattform);
          }
          if (!this.departureRowContainsText(item, filterText.value)) {
            console.debug("Departure doesn't contain the searched information", {
              filterText,
              item,
            });
            continue;
          }
          departuresList.appendChild(item);

          continue;
        }
      }

      let remainingTime = Utils.secondsToArrayOrString(
        (new Date(leavingVehicle.when).getTime() - new Date().getTime()) / 1000,
        "Array"
      );
      if (new Date(leavingVehicle.when).getTime() - new Date().getTime() < 0) {
        //vehicle is already departed
        continue;
      }

      let departureString = "";
      if (remainingTime.minutes == 0 && remainingTime.hours < 1) {
        departureString = "<strong>Sofort</strong>";
      } else if (remainingTime.minutes > 0 && remainingTime.hours < 1) {
        departureString = `in <strong>${remainingTime.minutes}</strong> Min`;
      } else if (remainingTime.hours > 0 && remainingTime.days < 1) {
        departureString = `in <strong>${remainingTime.hours}h ${remainingTime.minutes}Min</strong>`;
      } else {
        departureString = `in <strong>${remainingTime.days}d ${remainingTime.hours}h ${remainingTime.minutes}Min</strong>`;
      }

      item.innerHTML = `
        <td class="line">${leavingVehicle?.line?.name}</td>
        <td class="destination">${
          leavingVehicle.destination?.name ?? leavingVehicle.direction
        }</td>
        <td class="departure">
            <div>${departureString}</div>
            <div>${new Date(leavingVehicle.when).toLocaleString(undefined, {
              minute: "2-digit",
              hour: "2-digit",
            })}</div>
        </td>
        `;
      if (leavingVehicle.plannedPlatform) {
        let plattform = document.createElement("div");
        plattform.innerHTML = `<div>Bahnsteig ${leavingVehicle.plannedPlatform}</div>`;
        item.querySelector(".departure").appendChild(plattform);
      }

      if (!this.departureRowContainsText(item, filterText.value)) {
        console.debug("Departure doesn't contain the searched information", {
          filterText,
          item,
        });
        continue;
      }

      departuresList.appendChild(item);
    }

    if (departuresList.querySelectorAll("tr").length === 0) {
      setNoDeparturesFeedback(
        `<tr><td colspan='3'>Die Suche nach '${filterText.value}' lieferte keine Ergebnisse.</td></tr>`
      );
    }
  }

  async getStationsByLocation(lat, long) {
    return new Promise(async (resolve, reject) => {
      let results = await Utils.fetchData(
        DB_API_URL +
          `/stops/nearby?&latitude=${lat}&longitude=${long}&language=${LANG}`
      );
      resolve(results);
    });
  }

  async getSuggestionsForNearestStations(lat, long) {
    geoLocationSuggestionsList.innerHTML = "";
    let stations = await this.getStationsByLocation(lat, long);
    console.log("Nearest found stations:", stations);
    if (!stations || !stations.length) {
      geoLocationSuggestionsList.innerHTML = `<h3>Keine Orte gefunden</h3>`;
      return false;
    }
    stationInput.value = "";
    stations.forEach((station) => {
      let suggestion = document.createElement("li");
      suggestion.innerHTML = `<a>${station.name}</a>`;
      suggestion.setAttribute("id", station.id);
      geoLocationSuggestionsList.appendChild(suggestion);

      suggestion.addEventListener("click", () => {
        this.setStation(station.id, station.name);
        this.update();
        geoLocationSuggestionsList.innerHTML = "";
      });
    });
  }
}

function setParamCheckboxAndURL(checkbox, checked, param) {
  if (param == null) param = checkbox.getAttribute("data-toggleParam");
  checkbox.checked = checked;
  Utils.insertUrlParam(param, checkbox.checked);
}

function addtoggleParam(checkbox, param = null) {
  if (param == null) param = checkbox.getAttribute("data-toggleParam");
  checkbox.addEventListener("click", () => {
    //Add to url
    Utils.insertUrlParam(param, checkbox.checked);
  });
  //Set it to the state of the queryURL
  if (queryParams.has(param)) {
    checkbox.checked = Utils.makeJSON(queryParams.get(param));
  }
}

function setParamTextAndURL(input, value, param) {
  if (param == null) param = input.getAttribute("data-toggleParam");
  input.value = value;
  Utils.insertUrlParam(param, encodeURI(input.value));
}

function addChangeParam(element, param = null) {
  if (param == null) param = element.getAttribute("data-changeParam");
  element.addEventListener("input", () => {
    //Add to url
    Utils.insertUrlParam(param, encodeURI(element.value));
  });
  //Set it to the state of the queryURL
  if (queryParams.has(param)) {
    element.value = decodeURI(queryParams.get(param));
  }
}

let startSearch = async (stationName) => {
  await departureTable.takeFirstResultByName(stationName);
  departureTable.update();
};

//Constants
const DB_API_URL = "https://v5.db.transport.rest";
const LANG = "de";
const UPDATE_INTERVAL = 30;
const stationName = document.querySelector("#stationName");
const departuresList = document.querySelector("#departuresTable");
const departureTable = new DepartureTable();
const stationInput = document.querySelector("#stationInput");
const suggestionsList = document.querySelector("#suggestions");
const geoLocationSuggestionsList = document.querySelector(
  "#geoLocationSuggestionsList"
);
const searchBtn = document.querySelector("#searchBtn");
const maxResults = document.querySelector("#maxResults");
const duration = document.querySelector("#duration");
const liveUpdate = document.querySelector("#liveUpdate");
const dateContainer = document.querySelector("#date");
const liveClockCheckbox = document.querySelector("#liveClockCheckbox");
const lastUpdateContainer = document.querySelector("#lastUpdate");

let queryParams = Utils.getUrlParams(window.location.search);

//show Delay
const showDelay = document.querySelector("#showDelay");
addtoggleParam(showDelay);

//Means of transport - enable or disable
//Initialize Means of transport checkboxes
const bus = document.querySelector("#bus");
addtoggleParam(bus);
const ferry = document.querySelector("#ferry");
addtoggleParam(ferry);
const national = document.querySelector("#national");
addtoggleParam(national);
const nationalExpress = document.querySelector("#nationalExpress");
addtoggleParam(nationalExpress);
const regional = document.querySelector("#regional");
addtoggleParam(regional);
const regionalExp = document.querySelector("#regionalExp");
addtoggleParam(regionalExp);
const suburban = document.querySelector("#suburban");
addtoggleParam(suburban);
const subway = document.querySelector("#subway");
addtoggleParam(subway);
const taxi = document.querySelector("#taxi");
addtoggleParam(taxi);
const tram = document.querySelector("#tram");
addtoggleParam(tram);

//Update interval
const updateIntervalInput = document.querySelector("#updateInterval");
addChangeParam(updateIntervalInput);

//Filter Text
const filterText = document.querySelector("#filterText");
addChangeParam(filterText);
filterText.addEventListener(
  "input",
  departureTable.updateDeparturesDebounce(500)
);

//Geo location btn
const pickGeoLocationBtn = document.querySelector("#pickGeoLocation");
pickGeoLocationBtn.addEventListener("click", async () => {
  //Take location
  let geolocation = await Utils.getCurrentPosition();
  await departureTable.getSuggestionsForNearestStations(
    geolocation.coords.latitude,
    geolocation.coords.longitude
  );
  setParamCheckboxAndURL(autoGeoLocation, false);
});
//Auto geoLocation
const autoGeoLocation = document.querySelector("#autoGeoLocation");
addtoggleParam(autoGeoLocation);
autoGeoLocation.addEventListener("click", () => {
  if (autoGeoLocation.checked) departureTable.update();
});
if (
  queryParams.has("autoGeolocation") &&
  Utils.makeJSON(queryParams.get("autoGeoLocation"))
) {
  departureTable.update();
}

//Load last station
if (
  window.localStorage.getItem("stationID") ||
  window.localStorage.getItem("stationName")
) {
  stationInput.value = window.localStorage.getItem("stationName");
  departureTable.setStation(
    window.localStorage.getItem("stationID"),
    window.localStorage.getItem("stationName")
  );
  departureTable.update();
}
if (queryParams.has("query")) {
  startSearch(queryParams.get("query"));
}

//station name input
stationInput.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    //Select the first result
    startSearch(stationInput.value);
    departureTable.update();
  }
  setParamCheckboxAndURL(autoGeoLocation, false);
  departureTable.getSuggestionsbyName(stationInput.value);
});
//searchBtn
searchBtn.addEventListener("click", () => startSearch(stationInput.value));

//live update
liveUpdate.addEventListener("click", () => {
  departureTable.liveUpdate = liveUpdate.checked;
  Utils.insertUrlParam(
    liveUpdate.getAttribute("data-toggleParam"),
    liveUpdate.checked
  );
  departureTable.setUpdateInterval(UPDATE_INTERVAL);
  departureTable.update();
});
if (liveUpdate.checked) {
  departureTable.setUpdateInterval();
}
if (queryParams.has(liveUpdate.getAttribute("data-toggleParam"))) {
  liveUpdate.checked = Utils.makeJSON(
    queryParams.get(liveUpdate.getAttribute("data-toggleParam"))
  );
  departureTable.setUpdateInterval();
}

//update params in url
addChangeParam(duration);
addChangeParam(maxResults);

//live clock
addtoggleParam(liveClockCheckbox);
if (liveClockCheckbox.checked) {
  departureTable.startClock();
}
liveClockCheckbox.addEventListener("click", () => {
  if (liveClockCheckbox.checked) {
    departureTable.startClock();
  } else {
    departureTable.stopClock();
  }
});
