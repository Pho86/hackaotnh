class BackgroundMusicService {
    constructor() {
        this.playlist = [
            {
                id: 1,
                title: "Ambient Ocean 1",
                url: "/audio/ocean-1.mp3",
            },
            {
                id: 2,
                title: "Ambient Ocean 2",
                url: "/audio/ocean-2.mp3",
            },
            {
                id: 3,
                title: "Ambient Ocean 3",
                url: "/audio/ocean-3.mp3",
            },
            {
                id: 4,
                title: "Apple Seed",
                url: "/audio/hiroyuki_sawano_apple_seed.mp3",
            },
            {
                id: 5,
                title: "Soft Spot",
                url: "/audio/keshi_soft_spot.mp3",
            },
            {
                id: 6,
                title: "Blue",
                url: "/audio/yung_kai_blue.mp3",
            },
        ];
        
        this.currentTrackIndex = 0;
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.3;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized || typeof window === 'undefined') return;
        
        this.audio = new Audio();
        this.audio.volume = this.volume;
        this.audio.preload = 'auto';
        
        this.audio.addEventListener('ended', () => {
            this.playNext();
        });
        
        this.audio.addEventListener('error', (e) => {
            console.warn('Audio error:', e);
            this.playNext(); 
        });
        
        this.isInitialized = true;
    }

    play() {
        if (!this.isInitialized) {
            this.init();
        }
        
        if (this.audio && !this.isPlaying) {
            this.loadCurrentTrack();
            this.audio.play()
                .then(() => {
                    this.isPlaying = true;
                })
                .catch((error) => {
                    console.warn('Autoplay blocked or audio error:', error);
                    document.addEventListener('click', this.startOnUserInteraction.bind(this), { once: true });
                });
        }
    }

    startOnUserInteraction() {
        if (!this.isPlaying) {
            this.play();
        }
    }

    pause() {
        if (this.audio && this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        }
    }

    loadCurrentTrack() {
        if (this.audio && this.playlist[this.currentTrackIndex]) {
            this.audio.src = this.playlist[this.currentTrackIndex].url;
        }
    }

    playNext() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadCurrentTrack();
        
        if (this.isPlaying) {
            this.audio.play()
                .catch((error) => {
                    console.warn('Error playing next track:', error);
                });
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }

    isCurrentlyPlaying() {
        return this.isPlaying;
    }

    getCurrentTrack() {
        return this.playlist[this.currentTrackIndex];
    }
}

const backgroundMusic = new BackgroundMusicService();
export default backgroundMusic;
