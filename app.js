let appState = {
    audio: undefined,
    pausePlayBtn: undefined,
    volumeSlider: undefined,
    currentUrl: undefined,
};

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

        station_entry.addEventListener("click", () => {
            playAudio(station.url);
        });

        container.appendChild(station_entry);
    });
}

function pausePlay() {
    if (appState.audio === undefined) {
        return;
    }

    if (!appState.audio.paused) {
        pauseAudio();
    } else {
        playAudio(appState.url);
    }
}

function playAudio(url) {
    if (appState.audio === undefined) {
        appState.audio = new Audio(url);
    } else if (appState.url !== url) {
        appState.audio.pause();
        appState.audio = new Audio(url);
    }

    appState.audio.volume = appState.volumeSlider.value / 100;
    appState.audio.play();
    appState.url = url;
    appState.pausePlayBtn.innerText = "Pause";
}

function pauseAudio() {
    if (appState.audio === undefined) {
        return;
    }

    appState.audio.pause();
    appState.pausePlayBtn.innerText = "Play";
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

    appState.pausePlayBtn = document.getElementById("pausePlayBtn");
    appState.pausePlayBtn.addEventListener("click", (event) => {
        pausePlay();
    });

    appState.volumeSlider = document.getElementById("volumeSlider");
    appState.volumeSlider.addEventListener("change", (event) => {
        let vol = event.target.value / 100;
        audio.volume = vol;
    });
})();
