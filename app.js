let url = "https://icecast.radiofrance.fr/fipjazz-midfi.mp3";
let audio;

function setupStations(stations) {
    // Sort stations alphabetically
    stations.sort((a, b) => {
        return ("" + a.name).localeCompare(b.name);
    });

    const container = document.getElementById("container");

    stations.forEach((station) => {
        let station_icon = document.createElement("img");
        station_icon.classList.add("icon");
        station_icon.src = station.icon;

        let station_name = document.createElement("span");
        station_name.classList.add("name");
        station_name.appendChild(document.createTextNode(station.name));

        let station_entry = document.createElement("div");
        station_entry.classList.add("item");
        station_entry.appendChild(station_icon);
        station_entry.appendChild(station_name);

        station_entry.addEventListener("click", (event) => {
            playStation(station.url);
        });

        container.appendChild(station_entry);
    });
}

function playStation(url) {
    if (audio !== undefined) {
        audio.pause();
    }

    audio = new Audio(url);
    audio.play();
}

function playerClicked() {
    console.log("player clicked");
    if (audio === undefined) {
        return;
    }

    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

(() => {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register (
            "/radio/sw.js",
            { scope: "/radio/" }
        );
    }

    fetch("stations.json")
        .then((response) => response.json())
        .then((json) => setupStations(json));

    const player = document.getElementById("player");
    player.addEventListener("click", (event) => {
        event.preventDefault();
        playerClicked();
    });
})();
