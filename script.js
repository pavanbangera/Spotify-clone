let songs;
let currentTrack;
let folder = "/hindi"
const domainUrl = `/songs`

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
    let libraryList = document.querySelector(".libraryList ul");
    // let a = await fetch("http://127.0.0.1:5500/songs/");
    libraryList.innerHTML = "";
    let a = await fetch(domainUrl + folder);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (const element of as) {
        if (element.href.includes(`/songs${folder}/`) && element.href.endsWith(".mp3")) {
            // songs.push(element.href.split("http://127.0.0.1:5500/songs/"))

            songs.push(element.title);
        }
        currentTrack.src = `${domainUrl + folder}/${songs[0]}`
        playSong(songs[0], true)
    }


    // fetch song


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
let getAlbum = async () => {
    let cardContainer = document.querySelector(".cardContainer")
    let response = await fetch(domainUrl);
    // console.log(await response.text());
    let div = document.createElement("div");
    div.innerHTML = await response.text();
    Array.from(div.getElementsByTagName("a")).forEach(async (e) => {
        if (e.href.includes(`/songs/`)) {
            let response = await fetch(`${domainUrl}/${e.title}/info.json`);
            response = await response.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `
                <div data-folder=${e.href.split("songs/")[1]}
                class="group flex flex-col justify-evenly card md:w-[200px] w-[70vw] md:h-[240px]  h-[80vw] bg-[#1E1E1E] p-2 rounded-sm transition duration-500 ease-linear hover:bg-[#333] cursor-pointer relative">
                <img class="absolute transition duration-500 ease-linear right-[6%] top-[60%] md:top-[50%] bg-pink-600 w-10 h-10 rounded-full invert scale-0  group-hover:scale-100  "
                    src="./img/play.svg" alt="">
                <img class="w-[100%] h-[60%] object-cover object-top" src="${domainUrl}/${e.title}/cover.jpeg" alt="">
                <h4 class="self-start text-lg md:text-base font-medium">${response.title}</h4>
                <p class="self-start text-base md:text-xs ">${response.description}</p>

            </div>`


        }

    })





}
let playSong = async (url, pause = false) => {
    if (!pause) {
        currentTrack.src = `${domainUrl + folder}/${url}`;
        currentTrack.play();
        playBtn.src = `./img/pause.svg`

    }
    document.querySelector("#songTitle").innerHTML = currentTrack.src.split(`/songs${folder}/`)[1]
    document.querySelector("#duration").innerHTML = "00:00 / 00:00"
}

(async () => {
    // let playBtn = document.querySelector("#playBtn")

    currentTrack = new Audio();
    await getAlbum();

    await getsong();
    playSong(songs[0], true)



    // event for playBtn
    playBtn.addEventListener("click", () => {
        if (currentTrack.paused) {
            currentTrack.play();
            playBtn.src = `./img/pause.svg`
        } else {
            currentTrack.pause();
            playBtn.src = `./img/play.svg`
        }
    })
    // event for previousBtn
    previousBtn.addEventListener("click", () => {
        if (songs.indexOf(currentTrack.src.split(`/songs${folder}/`)[1]) > 0) {
            currentTrack.pause();
            playSong(songs[songs.indexOf(currentTrack.src.split(`/songs${folder}/`)[1]) - 1])
        } else {
            if (currentTrack.paused) {
                currentTrack.play();
                playBtn.src = `./img/pause.svg`
            } else {
                currentTrack.pause();
                playBtn.src = `./img/play.svg`
            }
        }


    })
    // event for nextBtn
    nextBtn.addEventListener("click", () => {

        if (songs.indexOf(currentTrack.src.split(`/songs${folder}/`)[1]) < songs.length - 1) {
            currentTrack.pause();
            playSong(songs[songs.indexOf(currentTrack.src.split(`/songs${folder}/`)[1]) + 1])
        } else {
            if (currentTrack.paused) {
                currentTrack.play();
                playBtn.src = `./img/pause.svg`
            } else {
                currentTrack.pause();
                playBtn.src = `./img/play.svg`
            }
        }


    })

    //event for volume
    volume.addEventListener("change", (e) => {
        if (e.target.value == 0) {
            volumeLogo.src = `./img/mute.svg`

        } else if (e.target.value <= 50) {
            volumeLogo.src = `./img/volume01.svg`
        }
        else {
            volumeLogo.src = `./img/volume.svg`
        }
        currentTrack.volume = e.target.value / 100;

    })

    volumeLogo.addEventListener("click", () => {
        if (currentTrack.volume > 0) {
            volumeLogo.src = `./img/mute.svg`
            currentTrack.volume = 0
            volume.value = 0

        }
        else {
            volumeLogo.src = `./img/volume.svg`
            currentTrack.volume = 0.5;
            volume.value = 50
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

    //    card click event
    Array.from(document.querySelectorAll(".card")).forEach((card) => {
        card.addEventListener("click", async () => {
            folder = `/${card.dataset.folder}`;
            await getsong();
        })
    })

})();
