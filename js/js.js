// Аудиоплеер
const audioToggle = document.getElementById('audioToggle');
const audioPanel = document.getElementById('audioPanel');
const closePanel = document.getElementById('closePanel');
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const rewindBtn = document.getElementById('rewindBtn');
const forwardBtn = document.getElementById('forwardBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const playlist = document.getElementById('playlist');
const playlistItems = playlist.querySelectorAll('.playlist-item');
const trackName = document.getElementById('trackName');
const trackArtist = document.getElementById('trackArtist');

let isPlaying = false;
let currentTrack = 0;

// Плейлист
const tracks = [
    { name: "Outside", artist: "Oneheart", src: "../music/outside.mp3" },
    { name: "Leaving", artist: "Oneheart", src: "../music/leaving.mp3" },
    { name: "Snowfall", artist: "Oneheart", src: "../music/snegpadaet.mp3" },
    { name: "HeartBrake", artist: "Oneheart", src: "../music/hertbrak.mp3" }
];

// Инициализация плеера
function initPlayer() {
    // Загружаем сохраненное состояние
    const savedState = JSON.parse(localStorage.getItem('audioPlayerState'));
    
    if (savedState) {
        currentTrack = savedState.currentTrack || 0;
        isPlaying = savedState.isPlaying || false;
        audio.volume = savedState.volume || 0.5;
        volumeSlider.value = audio.volume * 100;
        
        loadTrack(currentTrack);
        
        if (isPlaying) {
            // Восстанавливаем позицию воспроизведения после загрузки метаданных
            audio.addEventListener('loadedmetadata', function() {
                audio.currentTime = savedState.currentTime || 0;
                audio.play().catch(e => console.log("Autoplay prevented:", e));
            }, { once: true });
        }
    } else {
        loadTrack(currentTrack);
        audio.volume = 0.5;
        volumeSlider.value = 50;
    }
    
    // Обновляем иконку звука
    updateVolumeIcon();
}

// Загрузка трека
function loadTrack(index) {
    const track = tracks[index];
    audio.src = track.src;
    trackName.textContent = track.name;
    trackArtist.textContent = track.artist;
    
    // Обновляем активный элемент плейлиста
    playlistItems.forEach(item => item.classList.remove('active'));
    playlistItems[index].classList.add('active');
    
    // Сохраняем состояние
    savePlayerState();
}

// Воспроизведение трека
function playTrack() {
    audio.play()
        .then(() => {
            isPlaying = true;
            updatePlayButton();
            savePlayerState();
        })
        .catch(e => console.log("Play failed:", e));
}

// Пауза
function pauseTrack() {
    audio.pause();
    isPlaying = false;
    updatePlayButton();
    savePlayerState();
}

// Обновление кнопки play/pause
function updatePlayButton() {
    const icon = playBtn.querySelector('i');
    icon.classList.remove('fa-play', 'fa-pause');
    icon.classList.add(isPlaying ? 'fa-pause' : 'fa-play');
}

// Следующий трек
function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) playTrack();
}

// Предыдущий трек
function prevTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) playTrack();
}

// Перемотка на 10 секунд назад
function rewind() {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
    savePlayerState();
}

// Перемотка на 10 секунд вперед
function forward() {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    savePlayerState();
}

// Обновление прогресс-бара
function updateProgress() {
    const { currentTime, duration } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Форматирование времени
    currentTimeEl.textContent = formatTime(currentTime);
    
    if (!isNaN(duration)) {
        durationEl.textContent = formatTime(duration);
    }
    
    // Сохраняем текущую позицию каждые 5 секунд
    if (currentTime % 5 < 0.1) {
        savePlayerState();
    }
}

// Установка прогресса при клике
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
    savePlayerState();
}

// Форматирование времени
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Управление громкостью
function setVolume() {
    audio.volume = volumeSlider.value;
    updateVolumeIcon();
    savePlayerState();
}

// Обновление иконки громкости
function updateVolumeIcon() {
    const icon = muteBtn.querySelector('i');
    icon.classList.remove('fa-volume-up', 'fa-volume-down', 'fa-volume-mute');
    
    if (audio.volume === 0 || audio.muted) {
        icon.classList.add('fa-volume-mute');
    } else if (audio.volume < 0.5) {
        icon.classList.add('fa-volume-down');
    } else {
        icon.classList.add('fa-volume-up');
    }
}

// Отключение звука
function toggleMute() {
    audio.muted = !audio.muted;
    updateVolumeIcon();
    savePlayerState();
}

// Выбор трека из плейлиста
function selectTrack(e) {
    const item = e.target.closest('.playlist-item');
    if (!item) return;
    
    const index = Array.from(playlistItems).indexOf(item);
    currentTrack = index;
    loadTrack(currentTrack);
    if (isPlaying) playTrack();
}

// Открытие/закрытие панели
function togglePanel() {
    audioPanel.classList.toggle('active');
}

// Сохранение состояния плеера
function savePlayerState() {
    localStorage.setItem('audioPlayerState', JSON.stringify({
        currentTrack: currentTrack,
        isPlaying: isPlaying,
        volume: audio.volume,
        currentTime: audio.currentTime,
        muted: audio.muted
    }));
}

// События
audioToggle.addEventListener('click', togglePanel);
closePanel.addEventListener('click', togglePanel);

playBtn.addEventListener('click', () => {
    isPlaying ? pauseTrack() : playTrack();
});

prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
rewindBtn.addEventListener('click', rewind);
forwardBtn.addEventListener('click', forward);
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);
muteBtn.addEventListener('click', toggleMute);
playlist.addEventListener('click', selectTrack);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextTrack);
audio.addEventListener('loadedmetadata', updateProgress);

// Сохраняем состояние при закрытии страницы
window.addEventListener('beforeunload', savePlayerState);

// Инициализация плеера при загрузке страницы
document.addEventListener('DOMContentLoaded', initPlayer);

// При возврате на страницу (например, через кнопку "Назад")
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        const savedState = JSON.parse(localStorage.getItem('audioPlayerState'));
        if (savedState && savedState.isPlaying) {
            audio.play().catch(e => console.log("Autoplay prevented"));
        }
    }
});
