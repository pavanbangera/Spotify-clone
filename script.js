let songs;
let currentTrack;
const domainUrl = `https://github.com/pavanbangera/Spotify-clone/tree/master/songs`

function secondsToMinutesSeconds (seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


let getsong = async () => {
    // let a = await fetch("http://127.0.0.1:5500/songs/");
    let a = await fetch(domainUrl);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (const element of as) {
        if (element.href.includes("/songs/")) {
            // songs.push(element.href.split("http://127.0.0.1:5500/songs/"))
            songs.push(element.title);
        }
        currentTrack.src = `${domainUrl}/${songs[0]}`
    }


    // fetch song

    let libraryList = document.querySelector(".libraryList ul");
    for (const song of songs) {
        libraryList.innerHTML =
            libraryList.innerHTML +
            ` <li
                class="flex items-center justify-start p-2 border-[1px] border-white rounded-xl cursor-pointer relative">
                <img src="./img/music.svg" alt="">
                <div class="songInfo self-start ml-2 max-w-[80%]">
                    <p class="text-xs opacity-50 font-light" >${song}</p>
                    <p class="text-xs" >- bangera</p>
                </div>
                <img class="absolute right-2" src="./img/play.svg" alt="">
            </li>`;
    }

    //attach addEventLisner to song

    Array.from(libraryList.getElementsByTagName("li")).forEach((li) => {
        li.addEventListener("click", (element) => {
            playSong(li.querySelector(".songInfo p").innerHTML.trim())
        })
    })

}

let playSong = async (url, pause = false) => {
    if (!pause) {
        currentTrack.src = `${domainUrl}/${url}`;
        currentTrack.play();
        playBtn.src = `./img/pause.svg`

    }
    document.querySelector("#songTitle").innerHTML = currentTrack.src.split("/songs/")[1]
    document.querySelector("#duration").innerHTML = "00:00 / 00:00"
}

(async () => {
    let playBtn = document.querySelector("#playBtn")

    currentTrack = new Audio();

    await getsong();
    playSong(songs[0], true)

    playBtn.addEventListener("click", () => {
        if (currentTrack.paused) {
            currentTrack.play();
            playBtn.src = `./img/pause.svg`
            // playSong(currentTrack, true)
        } else {
            currentTrack.pause();
            playBtn.src = `./img/play.svg`
        }
    })


    currentTrack.addEventListener("timeupdate", () => {
        document.querySelector("#duration").innerHTML = `${secondsToMinutesSeconds(currentTrack.currentTime)}/ ${secondsToMinutesSeconds(currentTrack.duration)}`;
        document.querySelector(".circle").style.left = (currentTrack.currentTime / currentTrack.duration) * 100 + "%";
    })

    document.querySelector(".seekBar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentTrack.currentTime = ((currentTrack.duration) * percent) / 100
    })


    //hamburger btn
    document.querySelector("#menu").addEventListener("click", () => {
        document.querySelector(".left-part").style.left = "0"
    })
    //hamburger close btn
    document.querySelector("#close").addEventListener("click", () => {
        document.querySelector(".left-part").style.left = "-150%"
    })
})();
