const songs = [
    { title: "Послала", url: "songs/song1.mp3" },
    { title: "Плакал Голливуд", url: "songs/song2.mp3" },
    { title: "Поезда", url: "songs/song3.mp3" }
];

let currentSongIndex = 0;
let isRepeating = false;

const audioPlayer = document.getElementById('audioPlayer');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const repeatButton = document.getElementById('repeatButton');
const songTitle = document.getElementById('songTitle');
const progressBar = document.getElementById('progressBar');
const currentTimeElem = document.getElementById('currentTime');
const durationTimeElem = document.getElementById('durationTime');
const settingsIcon = document.getElementById('settingsIcon');
const settingsMenu = document.getElementById('settingsMenu');
const themeSelect = document.getElementById('themeSelect');
const backgroundUpload = document.getElementById('backgroundUpload');
const downloadIcon = document.getElementById('downloadIcon');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function playSong() {
    audioPlayer.src = songs[currentSongIndex].url;
    songTitle.textContent = songs[currentSongIndex].title;
    audioPlayer.play();
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
}

function pauseSong() {
    audioPlayer.pause();
    playButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
}

function stopSong() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    songTitle.textContent = "Воспроизведение остановлено";
    progressBar.style.width = '0%';
    currentTimeElem.textContent = "00:00";
    durationTimeElem.textContent = "00:00";
    playButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong();
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong();
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatButton.classList.toggle('active', isRepeating);
}

function updateProgress() {
    const { currentTime, duration } = audioPlayer;
    const percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentTimeElem.textContent = formatTime(currentTime);
    durationTimeElem.textContent = formatTime(duration);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

function toggleSettingsMenu() {
    settingsMenu.style.display = settingsMenu.style.display === 'flex' ? 'none' : 'flex';
}

function changeTheme(e) {
    document.body.className = e.target.value;
}

function changeBackground(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        document.body.style.backgroundImage = `url(${event.target.result})`;
        document.body.style.backgroundSize = 'cover';
    }
    reader.readAsDataURL(e.target.files[0]);
}

function downloadSong() {
    const link = document.createElement('a');
    link.href = audioPlayer.src;
    link.download = songs[currentSongIndex].title;
    link.click();
}

function searchSongs() {
    const query = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';
    if (query) {
        const results = songs.filter(song => song.title.toLowerCase().includes(query));
        if (results.length > 0) {
            results.forEach(song => {
                const li = document.createElement('li');
                li.textContent = song.title;
                li.addEventListener('click', () => {
                    currentSongIndex = songs.indexOf(song);
                    playSong();
                    searchResults.style.display = 'none';
                });
                searchResults.appendChild(li);
            });
            searchResults.style.display = 'block';
        } else {
            searchResults.style.display = 'none';
        }
    } else {
        searchResults.style.display = 'none';
    }
}

audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', () => {
    if (isRepeating) {
        playSong();
    } else {
        nextSong();
    }
});
progressBar.parentElement.addEventListener('click', setProgress);
playButton.addEventListener('click', playSong);
pauseButton.addEventListener('click', pauseSong);
stopButton.addEventListener('click', stopSong);
prevButton.addEventListener('click', prevSong);
nextButton.addEventListener('click', nextSong);
repeatButton.addEventListener('click', toggleRepeat);
settingsIcon.addEventListener('click', toggleSettingsMenu);
themeSelect.addEventListener('change', changeTheme);
backgroundUpload.addEventListener('change', changeBackground);
downloadIcon.addEventListener('click', downloadSong);
searchInput.addEventListener('input', searchSongs);
