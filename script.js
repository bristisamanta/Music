class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffleOn = false;
        this.isRepeatOn = false;
        this.isAutoplayOn = true;
        this.playedSongs = [];
        
        this.playlist = [
            {
                title: "Finding her",
                artist: "Kushagra",
                src: "https://raw.githubusercontent.com/bristisamanta/Music/refs/heads/main/music/find.mp3",
                image: "./images/find.jpg",
                duration: " 3:33"
            },
            {
                title: "Battein yeah kabhi na",
                artist: "Arijit Singh",
                src: "https://raw.githubusercontent.com/bristisamanta/Music/refs/heads/main/music/battein%20.mp3",
                image: "./images/battein.jpg",
                duration: "4:15"
            },
            {
                title: "Lag ja gale",
                artist: "Lata Mangeshkar",
                src: "https://raw.githubusercontent.com/bristisamanta/Music/refs/heads/main/music/lag%20ja.mp3 ",
                image: "./images/lagja.jpg",
                duration: "4:19"
            },
            {
                title: "Main hoon saath tere",
                artist: "Arijit Singh",
                src: "https://raw.githubusercontent.com/bristisamanta/Music/refs/heads/main/music/main%20hoon%20saath.mp3",
                image: "./images/mainhoon.jpg",
                duration: " 2:51"
            },
            {
                title: "Tera zikr",
                artist: "Darshan Raval",
                src: "https://raw.githubusercontent.com/bristisamanta/Music/refs/heads/main/music/tera%20zikr.mp3",
                image: "./images/terazikr.jpg",
                duration: "3:45"
            }
        ];
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadSong(this.currentSongIndex);
        this.renderPlaylist();
    }
    
    initializeElements() {
        // Player elements
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.playIcon = document.getElementById('playIcon');
        
        // Song info elements
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.albumImage = document.getElementById('albumImage');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        
        // Progress elements
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.progressThumb = document.getElementById('progressThumb');
        
        // Volume elements
        this.volumeIcon = document.getElementById('volumeIcon');
        this.volumeBar = document.getElementById('volumeBar');
        this.volumeFill = document.getElementById('volumeFill');
        this.volumeThumb = document.getElementById('volumeThumb');
        
        // Control buttons
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.autoplayBtn = document.getElementById('autoplayBtn');
        this.playlistBtn = document.getElementById('playlistBtn');
        
        // Playlist elements
        this.playlistContainer = document.getElementById('playlistContainer');
        this.playlistElement = document.getElementById('playlist');
    }
    
    setupEventListeners() {
        // Play/Pause button
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        
        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        this.progressBar.addEventListener('mousedown', (e) => this.startDrag(e, 'progress'));
        
        // Volume bar
        this.volumeBar.addEventListener('click', (e) => this.setVolume(e));
        this.volumeBar.addEventListener('mousedown', (e) => this.startDrag(e, 'volume'));
        this.volumeIcon.addEventListener('click', () => this.toggleMute());
        
        // Control buttons
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
        this.playlistBtn.addEventListener('click', () => this.togglePlaylist());
        
        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Mouse events for dragging
        document.addEventListener('mousemove', (e) => this.handleDrag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
    }
    
    loadSong(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        const song = this.playlist[index];
        this.currentSongIndex = index;
        
        // Update audio source
        this.audio.src = song.src;
        
        // Update UI
        this.songTitle.textContent = song.title;
        this.artistName.textContent = song.artist;
        this.albumImage.src = song.image;
        
        // Update playlist active state
        this.updatePlaylistActiveState();
        
        // Reset progress
        this.progressFill.style.width = '0%';
        this.currentTime.textContent = '0:00';
        
        // Load metadata
        this.audio.load();
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play();
        this.isPlaying = true;
        this.playIcon.classList.add('pause');
        document.querySelector('.album-art').classList.add('playing');
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playIcon.classList.remove('pause');
        document.querySelector('.album-art').classList.remove('playing');
    }
    
    previousSong() {
        let prevIndex;
        
        if (this.isShuffleOn) {
            prevIndex = this.getRandomSongIndex();
        } else {
            prevIndex = this.currentSongIndex - 1;
            if (prevIndex < 0) {
                prevIndex = this.playlist.length - 1;
            }
        }
        
        this.loadSong(prevIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    nextSong() {
        let nextIndex;
        
        if (this.isShuffleOn) {
            nextIndex = this.getRandomSongIndex();
        } else {
            nextIndex = this.currentSongIndex + 1;
            if (nextIndex >= this.playlist.length) {
                nextIndex = 0;
            }
        }
        
        this.loadSong(nextIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    getRandomSongIndex() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.playlist.length);
        } while (randomIndex === this.currentSongIndex && this.playlist.length > 1);
        
        return randomIndex;
    }
    
    seek(e) {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.audio.duration;
        
        this.audio.currentTime = newTime;
        this.updateProgress();
    }
    
    setVolume(e) {
        const volumeBar = e.currentTarget;
        const rect = volumeBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        
        this.audio.volume = Math.max(0, Math.min(1, percentage));
        this.updateVolumeDisplay();
    }
    
    toggleMute() {
        if (this.audio.volume > 0) {
            this.audio.dataset.prevVolume = this.audio.volume;
            this.audio.volume = 0;
        } else {
            this.audio.volume = this.audio.dataset.prevVolume || 0.5;
        }
        this.updateVolumeDisplay();
    }
    
    updateProgress() {
        if (this.audio.duration) {
            const percentage = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = percentage + '%';
            
            this.currentTime.textContent = this.formatTime(this.audio.currentTime);
        }
    }
    
    updateDuration() {
        if (this.audio.duration) {
            this.totalTime.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    updateVolumeDisplay() {
        const percentage = this.audio.volume * 100;
        this.volumeFill.style.width = percentage + '%';
        
        // Update volume icon based on volume level
        if (this.audio.volume === 0) {
            this.volumeIcon.style.opacity = '0.5';
        } else {
            this.volumeIcon.style.opacity = '1';
        }
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    handleSongEnd() {
        if (this.isRepeatOn) {
            this.audio.currentTime = 0;
            this.play();
        } else if (this.isAutoplayOn) {
            this.nextSong();
        } else {
            this.pause();
        }
    }
    
    toggleShuffle() {
        this.isShuffleOn = !this.isShuffleOn;
        this.shuffleBtn.classList.toggle('active', this.isShuffleOn);
    }
    
    toggleRepeat() {
        this.isRepeatOn = !this.isRepeatOn;
        this.repeatBtn.classList.toggle('active', this.isRepeatOn);
    }
    
    toggleAutoplay() {
        this.isAutoplayOn = !this.isAutoplayOn;
        this.autoplayBtn.classList.toggle('active', this.isAutoplayOn);
    }
    
    togglePlaylist() {
        this.playlistContainer.classList.toggle('active');
    }
    
    renderPlaylist() {
        this.playlistElement.innerHTML = '';
        
        this.playlist.forEach((song, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
                <div class="playlist-item-duration">${song.duration}</div>
            `;
            
            playlistItem.addEventListener('click', () => {
                this.loadSong(index);
                if (this.isPlaying) {
                    this.play();
                }
            });
            
            this.playlistElement.appendChild(playlistItem);
        });
        
        this.updatePlaylistActiveState();
    }
    
    updatePlaylistActiveState() {
        const playlistItems = this.playlistElement.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }
    
    handleKeyPress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSong();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSong();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.audio.volume = Math.min(1, this.audio.volume + 0.1);
                this.updateVolumeDisplay();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.audio.volume = Math.max(0, this.audio.volume - 0.1);
                this.updateVolumeDisplay();
                break;
        }
    }
    
    startDrag(e, type) {
        e.preventDefault();
        this.isDragging = true;
        this.dragType = type;
        this.handleDrag(e);
    }
    
    handleDrag(e) {
        if (!this.isDragging) return;
        
        if (this.dragType === 'progress') {
            const rect = this.progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, clickX / rect.width));
            
            if (this.audio.duration) {
                this.audio.currentTime = percentage * this.audio.duration;
                this.updateProgress();
            }
        } else if (this.dragType === 'volume') {
            const rect = this.volumeBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, clickX / rect.width));
            
            this.audio.volume = percentage;
            this.updateVolumeDisplay();
        }
    }
    
    stopDrag() {
        this.isDragging = false;
        this.dragType = null;
    }
}

// Initialize the music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});