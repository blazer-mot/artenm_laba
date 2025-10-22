/* =========================
   ОСНОВНОЙ ПЛЕЕР
   ========================= */
   const player = {
    tracks: [
      { title:"Где твоя любовь", artist:"Макс Корж", src:"assets/gde_tvoya_lyubov.mp3", cover:"obl/gde_tvoya_lyubov.jpg", lyricsFile:"gde_tvoya_lyubov" },
      { title:"Время", artist:"Макс Корж", src:"assets/vremya.mp3", cover:"obl/vremya.jpg", lyricsFile:"vremya" },
      { title:"Малиновый закат", artist:"Макс Корж", src:"assets/malinovyy_zakat.mp3", cover:"obl/malinovyy_zakat.jpg", lyricsFile:"malinovyy_zakat" },
      { title:"Небо поможет нам", artist:"Макс Корж", src:"assets/nebo_pomozhet_nam.mp3", cover:"obl/nebo_pomozhet_nam.jpg", lyricsFile:"nebo_pomozhet_nam" },
      { title:"Улицы без фонарей", artist:"Макс Корж", src:"assets/ulitsy_bez_fonarey.mp3", cover:"obl/ulitsy_bez_fonarey.jpg", lyricsFile:"ulitsy_bez_fonarey" }
    ],
    currentTrack:0, audio:null, progressBar:null, currentTime:null, duration:null,
  
    init(){
      this.audio=document.getElementById("audioPlayer");
      this.progressBar=document.getElementById("progressBar");
      this.currentTime=document.getElementById("currentTime");
      this.duration=document.getElementById("duration");
  
      this.audio.addEventListener("timeupdate",()=>{
        const c=this.audio.currentTime, t=this.audio.duration||0;
        this.progressBar.value=t?(c/t)*100:0;
        this.currentTime.textContent=this.formatTime(c);
        this.duration.textContent="-"+this.formatTime(Math.max(t-c,0));
      });
  
      this.progressBar.addEventListener("input",()=>{
        const t=this.audio.duration||0;
        this.audio.currentTime=(this.progressBar.value/100)*t;
      });
  
      this.audio.addEventListener("ended",()=>this.nextTrack());
    },
  
    loadTrack(i){
      this.currentTrack=i; const tr=this.tracks[i];
      document.getElementById("trackTitle").textContent=tr.title;
      document.getElementById("trackArtist").textContent=tr.artist;
      document.getElementById("trackCover").src=tr.cover;
      this.audio.src=tr.src;
      document.getElementById("downloadBtn").href=tr.src;
      document.getElementById("trackList").classList.remove("active");
      document.getElementById("playerBlock").classList.add("active");
      document.getElementById("lyrics").style.display="none";
      this.audio.play();
    },
  
    togglePlay(){this.audio.paused?this.audio.play():this.audio.pause();},
    prevTrack(){this.currentTrack=(this.currentTrack-1+this.tracks.length)%this.tracks.length; this.loadTrack(this.currentTrack);},
    nextTrack(){this.currentTrack=(this.currentTrack+1)%this.tracks.length; this.loadTrack(this.currentTrack);},
    setVolume(v){this.audio.volume=v;},
    shuffleTrack(){let r; do{r=Math.floor(Math.random()*this.tracks.length);}while(r===this.currentTrack&&this.tracks.length>1); this.loadTrack(r);},
    backToList(){this.audio.pause(); document.getElementById("playerBlock").classList.remove("active"); document.getElementById("trackList").classList.add("active");},
    showLyrics(){
      const tr=this.tracks[this.currentTrack]; const box=document.getElementById("lyrics");
      if(box.style.display==="block"){box.style.display="none";return;}
      fetch(`ttt/${tr.lyricsFile}.txt`)
        .then(r=>r.ok?r.text():Promise.reject())
        .then(t=>{box.textContent=t; box.style.display="block";})
        .catch(()=>{box.textContent="Текст песни не найден."; box.style.display="block";});
    },
    formatTime(sec){const m=Math.floor(sec/60)||0; const s=Math.floor(sec%60)||0; return `${m}:${s<10?"0"+s:s}`;}
  };
  
  // Глобальные функции для HTML
  function loadTrack(i){player.loadTrack(i);} function togglePlay(){player.togglePlay();}
  function prevTrack(){player.prevTrack();} function nextTrack(){player.nextTrack();}
  function setVolume(v){player.setVolume(v);} function shuffleTrack(){player.shuffleTrack();}
  function backToList(){player.backToList();} function showLyrics(){player.showLyrics();}
  window.addEventListener("DOMContentLoaded",()=>player.init());
/* =========================
   МОДАЛКА: СОЗДАНИЕ ПЛЕЙЛИСТА
   ========================= */
   const createBtn = document.getElementById("createPlayerBtn");
   const modal = document.getElementById("modal");
   const closeModalBtn = document.getElementById("closeModalBtn");
   const addSongBtn = document.getElementById("addSongBtn");
   const savePlaylistBtn = document.getElementById("savePlaylistBtn");
   const songsPreview = document.getElementById("songsPreview");
   const playersContainer = document.getElementById("playersContainer");
   
   let tempSongs = [];
   
   // Открыть модалку
   createBtn.addEventListener("click", () => {
     tempSongs = [];
     songsPreview.innerHTML = "";
     document.getElementById("playlistNameInput").value = "";
     document.getElementById("songTitleInput").value = "";
     document.getElementById("songArtistInput").value = "";
     document.getElementById("songFileInput").value = "";
     document.getElementById("songCoverFileInput").value = "";
     document.getElementById("songLyricsInput").value = "";
     modal.style.display = "flex";
   });
   
   // Закрыть модалку
   closeModalBtn.addEventListener("click", () => {
     modal.style.display = "none";
   });
   
   // Добавить песню (через файлы)
   addSongBtn.addEventListener("click", () => {
     const title = document.getElementById("songTitleInput").value.trim();
     const artist = document.getElementById("songArtistInput").value.trim();
     const fileInput = document.getElementById("songFileInput");
     const coverInput = document.getElementById("songCoverFileInput");
     const lyrics = document.getElementById("songLyricsInput").value;
   
     if (!title || fileInput.files.length === 0) {
       alert("Введите название и выберите mp3 файл");
       return;
     }
   
     // создаём временные ссылки на файлы
     const src = URL.createObjectURL(fileInput.files[0]);
     const cover = coverInput.files.length > 0 ? URL.createObjectURL(coverInput.files[0]) : "";
   
     tempSongs.push({ title, artist, src, cover, lyrics });
   
     // добавляем в превью список
     const li = document.createElement("li");
     li.textContent = `${title}${artist ? " — " + artist : ""}`;
     songsPreview.appendChild(li);
   
     // очистка полей
     document.getElementById("songTitleInput").value = "";
     document.getElementById("songArtistInput").value = "";
     fileInput.value = "";
     coverInput.value = "";
     document.getElementById("songLyricsInput").value = "";
   });
// Сохранить плейлист
savePlaylistBtn.addEventListener("click", () => {
    const playlistName = document.getElementById("playlistNameInput").value.trim() || "Новый плейлист";
    if (tempSongs.length === 0) {
      alert("Добавьте хотя бы одну песню");
      return;
    }
  
    const playlistDiv = document.createElement("div");
    playlistDiv.classList.add("player-block");
    playlistDiv.innerHTML = `
      <h2>${playlistName}</h2>
      <ul class="dyn-track-ul"></ul>
      <div class="player" style="display:none;">
        <img class="cover" src="">
        <div class="info"><h2 class="trackTitle"></h2><p class="trackArtist"></p></div>
        <div class="progress">
          <span class="currentTime">0:00</span>
          <input type="range" class="progressBar" value="0" min="0" max="100">
          <span class="duration">-0:00</span>
        </div>
        <div class="controls">
          <button class="prevBtn">⏮</button>
          <button class="playBtn"><span class="playIcon">▶</span></button>
          <button class="nextBtn">⏭</button>
          <div class="volume-control">🔊
            <input type="range" min="0" max="1" step="0.01" value="1" class="volumeSlider">
          </div>
        </div>
        <div class="extra-buttons">
          <button class="lyricsBtn">Текст</button>
          <button class="deleteBtn">Удалить</button>
        </div>
        <div class="lyricsBox" style="display:none;white-space:pre-wrap;"></div>
        <audio class="audio"></audio>
      </div>
    `;
  
    playersContainer.appendChild(playlistDiv);
  
    // Элементы нового плеера
    const ul = playlistDiv.querySelector(".dyn-track-ul");
    const playerBlock = playlistDiv.querySelector(".player");
    const audio = playlistDiv.querySelector(".audio");
    const coverEl = playlistDiv.querySelector(".cover");
    const titleEl = playlistDiv.querySelector(".trackTitle");
    const artistEl = playlistDiv.querySelector(".trackArtist");
    const progressBar = playlistDiv.querySelector(".progressBar");
    const currentTimeEl = playlistDiv.querySelector(".currentTime");
    const durationEl = playlistDiv.querySelector(".duration");
    const playBtn = playlistDiv.querySelector(".playBtn");
    const playIcon = playlistDiv.querySelector(".playIcon");
    const prevBtn = playlistDiv.querySelector(".prevBtn");
    const nextBtn = playlistDiv.querySelector(".nextBtn");
    const volumeSlider = playlistDiv.querySelector(".volumeSlider");
    const lyricsBtn = playlistDiv.querySelector(".lyricsBtn");
    const lyricsBox = playlistDiv.querySelector(".lyricsBox");
    const deleteBtn = playlistDiv.querySelector(".deleteBtn");
  
    let currentIndex = -1;
  
    const fmt = (sec) => {
      const m = Math.floor(sec / 60) || 0;
      const s = Math.floor(sec % 60) || 0;
      return `${m}:${s < 10 ? "0" + s : s}`;
    };
  
    const updatePlayIcon = () => {
      playIcon.textContent = audio.paused ? "▶" : "⏸";
    };
  
    // Заполняем список песен
    tempSongs.forEach((song, i) => {
      const li = document.createElement("li");
      li.textContent = song.title;
      ul.appendChild(li);
      li.addEventListener("click", () => {
        currentIndex = i;
        loadTrack();
      });
    });
  // Загрузка трека
  function loadTrack() {
    const track = tempSongs[currentIndex];
    if (!track) return;
    titleEl.textContent = track.title;
    artistEl.textContent = track.artist || "";
    coverEl.src = track.cover || "";
    audio.src = track.src;
    lyricsBox.textContent = track.lyrics || "Текст песни не указан.";
    lyricsBox.style.display = "none";
    playerBlock.style.display = "block";
    audio.play();
    updatePlayIcon();
  }

  // Обновление прогресса
  audio.addEventListener("timeupdate", () => {
    const c = audio.currentTime;
    const t = audio.duration || 0;
    progressBar.value = t ? (c / t) * 100 : 0;
    currentTimeEl.textContent = fmt(c);
    durationEl.textContent = "-" + fmt(Math.max(t - c, 0));
  });

  audio.addEventListener("play", updatePlayIcon);
  audio.addEventListener("pause", updatePlayIcon);
  audio.addEventListener("ended", () => {
    if (tempSongs.length > 0) {
      currentIndex = (currentIndex + 1) % tempSongs.length;
      loadTrack();
    }
  });

  // Управление
  playBtn.addEventListener("click", () => {
    if (!audio.src) {
      currentIndex = 0;
      loadTrack();
      return;
    }
    if (audio.paused) audio.play(); else audio.pause();
    updatePlayIcon();
  });

  prevBtn.addEventListener("click", () => {
    if (!tempSongs.length) return;
    currentIndex = currentIndex <= 0 ? tempSongs.length - 1 : currentIndex - 1;
    loadTrack();
  });

  nextBtn.addEventListener("click", () => {
    if (!tempSongs.length) return;
    currentIndex = (currentIndex + 1) % tempSongs.length;
    loadTrack();
  });

  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
  });

  progressBar.addEventListener("input", () => {
    const t = audio.duration || 0;
    audio.currentTime = (progressBar.value / 100) * t;
  });

  lyricsBtn.addEventListener("click", () => {
    lyricsBox.style.display = lyricsBox.style.display === "block" ? "none" : "block";
  });

  deleteBtn.addEventListener("click", () => {
    audio.pause();
    playlistDiv.remove();
  });

  // Закрываем модалку и очищаем временные данные
  modal.style.display = "none";
  tempSongs = [];
  songsPreview.innerHTML = "";
});
       