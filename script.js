const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const stopBtn = document.getElementById("stopBtn");

const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const albumArt = document.getElementById("albumArt");
const albumWrapper = document.querySelector(".album-wrapper");

const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");
const muteBtn = document.getElementById("muteBtn");
const volumeIcon = document.getElementById("volumeIcon");

const playlistContainer = document.getElementById("playlistContainer");
const songCount = document.getElementById("songCount");
const equalizer = document.getElementById("equalizer");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const themeToggle = document.getElementById("themeToggle");

/* ==========================================
   SONG PLAYLIST
   Add your own MP3 files inside songs folder
========================================== */

const songs = [
    {
        title: "Midnight Dreams",
        artist: "SoundWave Collection",
        src: "songs/song1.mp3",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "Ocean Vibes",
        artist: "SoundWave Collection",
        src: "songs/song2.mp3",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "City Lights",
        artist: "SoundWave Collection",
        src: "songs/song3.mp3",
        image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80"
    },
  
  {
    title: "Track 01",
    artist: "CodeAlpha Playlist",
    src: "songs/song1.mp3"
  },
  {
    title: "Track 02",
    artist: "CodeAlpha Playlist",
    src: "songs/song2.mp3"
  },
  {
    title: "Track 03",
    artist: "CodeAlpha Playlist",
    src: "songs/song3.mp3"
  },
  {
    title: "Track 04",
    artist: "CodeAlpha Playlist",
    src: "songs/song4.mp3"
  },
  {
    title: "Track 05",
    artist: "CodeAlpha Playlist",
    src: "songs/song5.mp3"
  },
  {
    title: "Track 06",
    artist: "CodeAlpha Playlist",
    src: "songs/song6.mp3"
  },
  {
    title: "Track 07",
    artist: "CodeAlpha Playlist",
    src: "songs/song7.mp3"
  }


];

/* ==========================================
   VARIABLES
========================================== */

let currentSongIndex = 0;
let isShuffle = false;
let repeatMode = "off"; // off | all | one


/* ==========================================
   LOAD SONG
========================================== */

function loadSong(index) {
    const song = songs[index];

    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumArt.src = song.image;
    audioPlayer.src = song.src;

    progressBar.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    updateActiveSong();
}


/* ==========================================
   PLAY SONG
========================================== */

function playSong() {
    audioPlayer.play()
        .then(() => {
            playIcon.classList.remove("fa-play");
            playIcon.classList.add("fa-pause");

            albumWrapper.classList.add("playing");
            if (equalizer) equalizer.classList.add("active");
        })
        .catch((error) => {
            console.log("Audio could not play:", error);
        });
}


/* ==========================================
   PAUSE SONG
========================================== */

function pauseSong() {
    audioPlayer.pause();

    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");

    albumWrapper.classList.remove("playing");
    if (equalizer) equalizer.classList.remove("active");
}

/* ==========================================
   STOP SONG
========================================== */

function stopSong() {
    pauseSong();
    audioPlayer.currentTime = 0;
    
    // Reset album rotation by forcing reflow
    albumWrapper.classList.remove("playing");
    if (equalizer) equalizer.classList.remove("active");
    
    const img = albumWrapper.querySelector("img");
    if (img) {
        img.style.animation = 'none';
        img.offsetHeight; /* trigger reflow */
        img.style.animation = null; 
    }
}


/* ==========================================
   PLAY / PAUSE / STOP BUTTONS
========================================== */

playBtn.addEventListener("click", () => {

    if (audioPlayer.paused) {
        playSong();
    } else {
        pauseSong();
    }

});

stopBtn.addEventListener("click", stopSong);


/* ==========================================
   NEXT SONG
========================================== */

function nextSong() {

    if (isShuffle) {

        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (songs.length > 1 && randomIndex === currentSongIndex);

        currentSongIndex = randomIndex;

    } else {

        currentSongIndex = (currentSongIndex + 1) % songs.length;

    }

    loadSong(currentSongIndex);
    playSong();
}


/* ==========================================
   PREVIOUS SONG
========================================== */

function previousSong() {

    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
        return;
    }

    currentSongIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;

    loadSong(currentSongIndex);
    playSong();
}


nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);


/* ==========================================
   UPDATE PROGRESS BAR
========================================== */

audioPlayer.addEventListener("timeupdate", () => {

    if (!audioPlayer.duration) return;

    const progress =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;

    progressBar.value = progress;

    currentTime.textContent =
        formatTime(audioPlayer.currentTime);

});


/* ==========================================
   AUDIO LOADED
========================================== */

audioPlayer.addEventListener("loadedmetadata", () => {

    duration.textContent =
        formatTime(audioPlayer.duration);

});


/* ==========================================
   CHANGE SONG POSITION
========================================== */

progressBar.addEventListener("input", () => {

    if (!audioPlayer.duration) return;

    audioPlayer.currentTime =
        (progressBar.value / 100) * audioPlayer.duration;

});


/* ==========================================
   FORMAT TIME
========================================== */

function formatTime(time) {

    if (isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

}


/* ==========================================
   VOLUME CONTROL
========================================== */

audioPlayer.volume = volumeSlider.value;

volumeSlider.addEventListener("input", () => {

    audioPlayer.volume = volumeSlider.value;

    const volumePercent =
        Math.round(volumeSlider.value * 100);

    volumeValue.textContent = `${volumePercent}%`;

    updateVolumeIcon();

});


/* ==========================================
   UPDATE VOLUME ICON
========================================== */

function updateVolumeIcon() {

    volumeIcon.className = "fa-solid";

    if (audioPlayer.muted || audioPlayer.volume === 0) {

        volumeIcon.classList.add("fa-volume-xmark");

    } else if (audioPlayer.volume < 0.5) {

        volumeIcon.classList.add("fa-volume-low");

    } else {

        volumeIcon.classList.add("fa-volume-high");

    }

}


/* ==========================================
   MUTE / UNMUTE
========================================== */

muteBtn.addEventListener("click", () => {

    audioPlayer.muted = !audioPlayer.muted;

    updateVolumeIcon();

});


/* ==========================================
   SHUFFLE
========================================== */

shuffleBtn.addEventListener("click", () => {

    isShuffle = !isShuffle;

    shuffleBtn.classList.toggle(
        "active-control",
        isShuffle
    );

});


/* ==========================================
   REPEAT MODES
   OFF -> ALL -> ONE -> OFF
========================================== */

repeatBtn.addEventListener("click", () => {

    if (repeatMode === "off") {

        repeatMode = "all";
        repeatBtn.classList.add("active-control");
        repeatBtn.title = "Repeat All";

    } else if (repeatMode === "all") {

        repeatMode = "one";
        repeatBtn.title = "Repeat One";

        repeatBtn.innerHTML =
            '<i class="fa-solid fa-repeat"></i><sup>1</sup>';

    } else {

        repeatMode = "off";
        repeatBtn.classList.remove("active-control");
        repeatBtn.title = "Repeat Off";

        repeatBtn.innerHTML =
            '<i class="fa-solid fa-repeat"></i>';

    }

});


/* ==========================================
   SONG ENDED - AUTOPLAY
========================================== */

audioPlayer.addEventListener("ended", () => {

    if (repeatMode === "one") {

        audioPlayer.currentTime = 0;
        playSong();

    } else if (
        repeatMode === "all" ||
        currentSongIndex < songs.length - 1 ||
        isShuffle
    ) {

        nextSong();

    } else {

        pauseSong();

    }

});


/* ==========================================
   CREATE PLAYLIST
========================================== */

function createPlaylist() {

    playlistContainer.innerHTML = "";

    songs.forEach((song, index) => {

        const songElement =
            document.createElement("div");

        songElement.classList.add("playlist-item");

        songElement.dataset.index = index;

        songElement.innerHTML = `

            <span class="playlist-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <img
                src="${song.image}"
                alt="${song.title}"
                class="playlist-image"
            >

            <div class="playlist-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>

            <div class="playlist-play">
                <i class="fa-solid fa-play"></i>
            </div>
        `;

        songElement.addEventListener("click", () => {

            currentSongIndex = index;

            loadSong(currentSongIndex);

            playSong();

        });

        playlistContainer.appendChild(songElement);

    });

    songCount.textContent =
        `${songs.length} Songs`;

}


/* ==========================================
   UPDATE ACTIVE PLAYLIST SONG
========================================== */

function updateActiveSong() {

    const playlistItems =
        document.querySelectorAll(".playlist-item");

    playlistItems.forEach((item) => {

        item.classList.remove("active-song");

    });

    const activeItem =
        document.querySelector(
            `.playlist-item[data-index="${currentSongIndex}"]`
        );

    if (activeItem) {

        activeItem.classList.add("active-song");

    }

}


/* ==========================================
   DARK / LIGHT THEME
========================================== */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");

    const themeIcon =
        themeToggle.querySelector("i");

    if (isDark) {

        themeIcon.className =
            "fa-solid fa-sun";

        localStorage.setItem(
            "musicTheme",
            "dark"
        );

    } else {

        themeIcon.className =
            "fa-solid fa-moon";

        localStorage.setItem(
            "musicTheme",
            "light"
        );

    }

});


/* ==========================================
   LOAD SAVED THEME
========================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem("musicTheme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.querySelector("i").className =
            "fa-solid fa-sun";

    }

}


/* ==========================================
   KEYBOARD CONTROLS
========================================== */

document.addEventListener("keydown", (event) => {

    /* Don't trigger when typing */
    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) {
        return;
    }

    if (event.code === "Space") {

        event.preventDefault();

        if (audioPlayer.paused) {
            playSong();
        } else {
            pauseSong();
        }

    }

    if (event.key.toLowerCase() === "s") {
        stopSong();
    }

    if (event.key === "ArrowRight") {
        nextSong();
    }

    if (event.key === "ArrowLeft") {
        previousSong();
    }

    if (event.key.toLowerCase() === "m") {

        audioPlayer.muted =
            !audioPlayer.muted;

        updateVolumeIcon();

    }

});


/* ==========================================
   INITIALIZE APP
========================================== */

createPlaylist();
loadSong(currentSongIndex);
loadTheme();
updateVolumeIcon();