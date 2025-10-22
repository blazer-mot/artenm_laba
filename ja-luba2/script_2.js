class AudioPlayer {
    constructor(tracks) {
      this.tracks = tracks;
      this.currentTrack = 0;
      this.audio = document.getElementById("audioPlayer");
      this.progressBar = document.getElementById("progressBar");
      this.currentTime = document.getElementById("currentTime");
      this.duration = document.getElementById("duration");
  
      this.initEvents();
    }
  
    initEvents() {
      this.audio.addEventListener("timeupdate", () => {
        const current = this.audio.currentTime;
        const total = this.audio.duration || 0;
        this.progressBar.value = (current / total) * 100;
        this.currentTime.textContent = this.formatTime(current);
        this.duration.textContent = "-" + this.formatTime(total - current);
      });
  
      this.progressBar.addEventListener("input", () => {
        const total = this.audio.duration || 0;
        const percent = this.progressBar.value / 100;
        this.audio.currentTime = percent * total;
      });
    }
  
    loadTrack(index) {
      this.currentTrack = index;
      const track = this.tracks[index];
      document.getElementById("trackTitle").textContent = track.title;
      document.getElementById("trackArtist").textContent = track.artist;
      document.getElementById("trackCover").src = track.cover;
      this.audio.src = track.src;
      document.getElementById("downloadBtn").href = track.src;
  
      document.getElementById("trackList").classList.remove("active");
      document.getElementById("playerBlock").classList.add("active");
  
      const lyricsBox = document.getElementById("lyrics");
      lyricsBox.style.display = "none";
      lyricsBox.textContent = "";
  
      this.audio.play();
    }
  
    togglePlay() {
      this.audio.paused ? this.audio.play() : this.audio.pause();
    }
  
    prevTrack() {
      this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
      this.loadTrack(this.currentTrack);
    }
  
    nextTrack() {
      this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
      this.loadTrack(this.currentTrack);
    }
  
    setVolume(value) {
      this.audio.volume = value;
    }
  
    shuffleTrack() {
      const randomIndex = Math.floor(Math.random() * this.tracks.length);
      this.loadTrack(randomIndex);
    }
  
    backToList() {
      this.audio.pause();
      document.getElementById("playerBlock").classList.remove("active");
      document.getElementById("trackList").classList.add("active");
    }
  
    showLyrics() {
      const track = this.tracks[this.currentTrack];
      const lyricsBox = document.getElementById("lyrics");
  
      if (lyricsBox.style.display === "block") {
        lyricsBox.style.display = "none";
        return;
      }
  
      fetch(`ttt/${track.lyricsFile}.txt`)
        .then(response => {
          if (!response.ok) throw new Error("Файл не найден");
          return response.text();
        })
        .then(text => {
          lyricsBox.textContent = text;
          lyricsBox.style.display = "block";
        })
        .catch(() => {
          lyricsBox.textContent = "Текст песни не найден.";
          lyricsBox.style.display = "block";
        });
    }
  
    formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? "0" + s : s}`;
    }
  }
  
  // 🎵 Треки
  const trackList = [
    {
      title: "Где твоя любовь",
      artist: "Макс Корж",
      src: "assets/gde_tvoya_lyubov.mp3",
      cover: "obl/gde_tvoya_lyubov.jpg",
      lyricsFile: "gde_tvoya_lyubov"
    },
    {
      title: "Время",
      artist: "Макс Корж",
      src: "assets/vremya.mp3",
      cover: "obl/vremya.jpg",
      lyricsFile: "vremya"
    },
    {
      title: "Малиновый закат",
      artist: "Макс Корж",
      src: "assets/malinovyy_zakat.mp3",
      cover: "obl/malinovyy_zakat.jpg",
      lyricsFile: "malinovyy_zakat"
    },
    {
      title: "Небо поможет нам",
      artist: "Макс Корж",
      src: "assets/nebo_pomozhet_nam.mp3",
      cover: "obl/nebo_pomozhet_nam.jpg",
      lyricsFile: "nebo_pomozhet_nam"
    },
    {
      title: "Улицы без фонарей",
      artist: "Макс Корж",
      src: "assets/ulitsy_bez_fonarey.mp3",
      cover: "obl/ulitsy_bez_fonarey.jpg",
      lyricsFile: "ulitsy_bez_fonarey"
    }
  ];
  
  // 🎬 Инициализация
  const player = new AudioPlayer(trackList);
  
  // 🔗 Глобальные функции для HTML
  function loadTrack(index) {
    player.loadTrack(index);
  }
  function togglePlay() {
    player.togglePlay();
  }
  function prevTrack() {
    player.prevTrack();
  }
  function nextTrack() {
    player.nextTrack();
  }
  function setVolume(value) {
    player.setVolume(value);
  }
  function shuffleTrack() {
    player.shuffleTrack();
  }
  function backToList() {
    player.backToList();
  }
  function showLyrics() {
    player.showLyrics();
  }
  