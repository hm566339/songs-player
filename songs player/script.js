let currentAudio = null;
let isPlaying = false;
let currentSongIndex = 0;
let songs = [];

// Select UI elements
const playButton = document.querySelector('.player-control-icon:nth-child(3)');
const progressBar = document.querySelector('.progress-bar');
const currTime = document.querySelector('.curr-time');
const totTime = document.querySelector('.tot-time');
const volumeControl = document.querySelector('.voice');

// Fetch songs from the server
async function getsongs() {
    let response = await fetch("http://172.17.2.163:3000/songs/");
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let as = div.getElementsByTagName("a");
    let songList = [];
    for (let a of as) {
        if (a.href.endsWith(".mp3")) {
            songList.push(a.href.split("/songs/")[1]);
        }
    }
    return songList;
}

// Play or pause music
function playMusic(songName) {
    const songUrl = `http://172.17.2.163:3000/songs/${songName}`;
    if (currentAudio) {
        currentAudio.pause();
    }
    currentAudio = new Audio(songUrl);
    currentAudio.play();
    isPlaying = true;

    currentAudio.addEventListener('timeupdate', () => {
        progressBar.value = (currentAudio.currentTime / currentAudio.duration) * 100;
        currTime.textContent = formatTime(currentAudio.currentTime);
    });

    currentAudio.addEventListener('loadedmetadata', () => {
        totTime.textContent = formatTime(currentAudio.duration);
    });

    currentAudio.addEventListener('ended', () => {
        playNextSong();
    });

    // Update displayed song name
    const nameSongsDiv = document.querySelector('.namesongs');
    nameSongsDiv.innerHTML = `<h3>${songName.replaceAll("%20", " ")}</h3>
                              <p>Mohit Kumar</p>`;

    // Highlight currently playing song
    document.querySelectorAll('.musici').forEach(item => item.classList.remove('playing'));
    const currentSongElement = document.querySelector(`.musici[data-index='${currentSongIndex}']`);
    if (currentSongElement) {
        currentSongElement.classList.add('playing');
    }

    // Show current song in the music player section
    const musicPlayerName = document.querySelector('.music-player .namesongs');
    musicPlayerName.innerHTML = `<h6 class="h6">${songName.replaceAll("%20", " ").replaceAll(128, "").replaceAll("Kbps.mp3", "")}</h6>
                                 <h6 class="h61">Now Playing</h6>`;
}

// Format time helper
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Handle playback bar interaction
progressBar.addEventListener('input', () => {
    if (currentAudio) {
        currentAudio.currentTime = (progressBar.value / 100) * currentAudio.duration;
    }
});

// Handle volume control
volumeControl.addEventListener('input', () => {
    if (currentAudio) {
        currentAudio.volume = volumeControl.value / 100;
    }
});

// Toggle play/pause
playButton.addEventListener('click', () => {
    if (currentAudio) {
        if (isPlaying) {
            currentAudio.pause();
            isPlaying = false;
            playButton.src = './ass/player_icon3.png';
        } else {
            currentAudio.play();
            isPlaying = true;
            playButton.src = './ass/puse.png';
        }
    }
});

// Play next song
function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playMusic(songs[currentSongIndex]);
}

// Play previous song
function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playMusic(songs[currentSongIndex]);
}

// Initialize app
async function main() {
    songs = await getsongs();
    let songsul = document.querySelector(".songsList ol");
    const songNames = ["Song One", "Song Two", "Song Three", "Song Four", "Song Five"];
    songs.forEach((song, index) => {
        let cleanSong = song.replaceAll("%20", " ").replace(/^128-/, "");
        songsul.innerHTML += `<li class="musici" data-index="${index}">
                                <img src="musixcicon.svg" alt="">
                                <div class="info">
                                    <div>${cleanSong}</div>
                                    <div>Mohit Kumar</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img src="play.svg" alt="">
                                </div>
                             </li>`;
    });

    document.querySelectorAll(".musici").forEach(item => {
        item.addEventListener("click", () => {
            currentSongIndex = parseInt(item.getAttribute("data-index"));
            playMusic(songs[currentSongIndex]);
        });
    });

    // Add event listener for next button
    const nextButton = document.querySelector('.player-control-icon:nth-child(4)');
    nextButton.addEventListener('click', playNextSong);

    // Add event listener for previous button
    const prevButton = document.querySelector('.player-control-icon:nth-child(2)');
    prevButton.addEventListener('click', playPreviousSong);
}

main();
