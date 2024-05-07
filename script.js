
let audio = new Audio()
const play = document.getElementById("play")
const musicName = document.getElementById("musicName")
const musicDuration = document.getElementById("musicDuration")
const currentTime = document.getElementById("currentTime")


async function getAudio() {
    let a = await fetch('http://127.0.0.1:5500/audio/')
    let respone = await a.text()
    const div = document.createElement('div')
    div.innerHTML = respone
    let anchorTag = div.getElementsByTagName('a')
    let audio = []
    for (let index = 0; index < anchorTag.length; index++) {
        const element = anchorTag[index];
        if (element.href.endsWith('.mpeg')) {
            audio.push(element.href.split("/audio/")[1])
        }
    }
    return audio
}


function playMusic(track) {
    // const audio = new Audio("/audio/" + track)
    audio.src = "/audio/" + track
    audio.play()
    play.src = "/icons/pause.svg"
}

async function main() {
    const songs = await getAudio()

    const createPlaylist = document.querySelector(".create-playlist").getElementsByTagName("ul")[0]
    for (const song of songs) {

        createPlaylist.innerHTML = createPlaylist.innerHTML + `
        <li>
        <div class="flex gap-2">
            <img class="invert" src="/icons/music.svg" alt="">
            <div class="info">
                <p class="song-name"> ${song.replace(/%20/g, " ")}</p>
                <p class="artist-name">Rafay</p>
            </div>
        </div>
        <div class="flex items-center justify-center">
            <span class="playNow">Play Now</span>
            <div class="play-icon flex justify-center items-center bg-grey rounded-full">
                <img class="invert" src="/icons/play.svg" alt="">
            </div>
        </div>
    </li>`
    }

    Array.from(document.querySelector(".create-playlist").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener('click', element => {
            playMusic(e.getElementsByTagName("div")[1].firstElementChild.innerHTML.trim())
            musicName.innerHTML = e.getElementsByTagName("div")[1].firstElementChild.innerHTML.trim().replace(".mpeg", "")
        })
    })
    
    play.addEventListener("click", (e) => {
        if (audio.paused) {
            audio.play()
            play.src = "/icons/pause.svg"
        } else {
            audio.pause()
            play.src = "/icons/play.svg"
        }
    }
    )


    audio.addEventListener("timeupdate", () => {
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(remainingSeconds).padStart(2, '0');
            return `${formattedMinutes}:${formattedSeconds}`;
        }

        musicDuration.innerHTML = formatTime(audio.duration);
        currentTime.innerHTML = formatTime(audio.currentTime);
        if ((audio.currentTime / audio.duration) * 100 == 100) {
            document.querySelector(".play-circle").style.left = "0%"
            audio.play()
        } else {
            document.querySelector(".play-circle").style.left = (audio.currentTime / audio.duration) * 100 + "%"
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".play-circle").style.left = percent + "%";
        audio.currentTime = ((audio.duration) * percent) / 100
    })
    // document.querySelector(".seekbar").addEventListener("click", e => {
    //     const seekbarWidth = e.target.getBoundingClientRect().width;
    //     const offsetX = e.offsetX;
        
    //     if (seekbarWidth > 0 && offsetX >= 0) {
    //         const percent = (offsetX / seekbarWidth) * 100;
    //         document.querySelector(".play-circle").style.left = percent + "%";
            
    //         if (!isNaN(audio.duration) && isFinite(audio.duration)) {
    //             audio.currentTime = (audio.duration * percent) / 100;
    //         }
    //     }
    // });

   document.querySelector(".humburger").addEventListener("click" , ()=>{
    document.querySelector(".left-side").style.left = "3%"
   }) 
   document.querySelector(".close").addEventListener("click" , ()=>{
    document.querySelector(".left-side").style.left = "-100%"
   }) 
    

}

main() 