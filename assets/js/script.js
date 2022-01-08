const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#previous"),
  nextBtn = wrapper.querySelector("#next"),
  progressBar = wrapper.querySelector(".progress-bar"),
  progressArea = wrapper.querySelector(".progress-area"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = musicList.querySelector("#close");


let musicIndex = 1;

window.addEventListener('load', () => {
  loadMusic(musicIndex);
  playTrack();
})

// load music function
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `assets/artist/images/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `assets/artist/tracks/${allMusic[indexNumb - 1].src}.mp3`;

}

// play music function
function playMusic() {
  wrapper.classList.add('paused');
  playPauseBtn.querySelector('i').innerText = 'pause';
  mainAudio.play();
}

// pause music function
function pauseMusic() {
  wrapper.classList.remove('paused');
  playPauseBtn.querySelector('i').innerText = 'play_arrow';
  mainAudio.pause();
}

//previous track function
function prevTrack() {
  musicIndex--;
  // if musicIndex is less than 1 then musicIndex will be the array length so the last track will play
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playTrack();
}

//next track function
function nextTrack() {
  musicIndex++;
  //if musicIndex is greater than the array length then musicIndex will be 1 again
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playTrack();
}


// paly or music button event
playPauseBtn.addEventListener('click', () => {
  const isMusicPlay = wrapper.classList.contains('paused');
  // if isMusicPlay is  true then call pauseMusic else playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playTrack();
});

// next track button event
nextBtn.addEventListener('click', () => {
  nextTrack();
})

// previous track button event
prevBtn.addEventListener('click', () => {
  prevTrack();
})

//updating the progress bar width according to track time.
mainAudio.addEventListener('timeupdate', (e) => {
  // console.log(e)
  const currentTime = e.target.currentTime;// getting current time of the track
  const duration = e.target.duration; // getting total duration time of the track
  let progressBarWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressBarWidth}%`;

  let trackCurrentTime = wrapper.querySelector(".current-time");
  let trackDurationTime = wrapper.querySelector(".max-duration");
  
  mainAudio.addEventListener('loadeddata', () => {
    // update track time duration
    let trackDuration = mainAudio.duration;
    let totalMin = Math.floor(trackDuration / 60);
    let totalSec = Math.floor(trackDuration % 60);
    //adding additional 0 to seconds if seconds is less than 10
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    trackDurationTime.innerText = `${totalMin}:${totalSec}`;
  });

  // update track current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  //adding additional 0 to seconds if seconds is less than 10
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  trackCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//updating track current time according to progress bar width
progressArea.addEventListener('click', (e) => {
  let progressWidthVal = progressArea.clientWidth; // getting width of progress bar
  let clickOffSetX = e.offsetX; // getting offsetX value
  console.log(clickOffSetX)
  let trackDuration = mainAudio.duration;// getting track total duration

  mainAudio.currentTime = (clickOffSetX / progressWidthVal) * trackDuration;
  playMusic(); //if music paused and the user click on the progress bar, the music will play
  playTrack();
});

//getting the repeat and shuffle according to the icon
const repeatBtn = wrapper.querySelector('#repeat-plist');
repeatBtn.addEventListener('click', () => {
  // first we get the inner text of the icon then we will change accordingly 
  let getText = repeatBtn.innerText; // getting innerText of icon
  //do different changes on different icon clicks using switch
  switch (getText) {
    case 'repeat': //if the icon is repeat, change it to repeat_one
      repeatBtn.innerText = 'repeat_one';
      repeatBtn.setAttribute('title', 'Track Looped')
      break;
    case 'repeat_one': //if icon is repeat_one, change it to shuffle
      repeatBtn.innerText = 'shuffle';
      repeatBtn.setAttribute('title', 'Playback Shuffle')
      break;
    case 'shuffle'://if icon is shuffle, change it to repeat
      repeatBtn.innerText = 'repeat';
      repeatBtn.setAttribute('title', 'Playlist Looped')
      break;
  }
});

//what to do after the track has ended
mainAudio.addEventListener('ended', () => {
  //we'll do according to the icon, means if the user has set icon to loop song then we'll repeat the current track etc...


  let getText = repeatBtn.innerText;// getting innerText of the icon
  // adding different changes on different icon click using switch
  switch (getText) {
    case 'repeat': //if this icon is repeat then simply we call the nextMusic function so the next track will play.
      nextTrack();
      break;
    case 'repeat_one':// if icon is repeat_one then we'll change the current playing track shuffle
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex);//calling loadMusic function with argument, in the argument there is a index of current song
      playMusic();//calling playMusic() function
      break;
    case 'shuffle': //if icon is shuffle then change it to repeat
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //getting random index/numb with max range of array length
      do {
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      } while (musicIndex == randIndex); //this loop run until the next random number wont be the same of current musicIndex
      musicIndex = randIndex;//passing random Index to music Index
      loadMusic(musicIndex);
      playMusic();
      playTrack();
      break;
  }
});

showMoreBtn.addEventListener('click', () => {
  musicList.classList.toggle('show');
});

hideMusicBtn.addEventListener('click', () => {
  showMoreBtn.click()
});

const ulTag = wrapper.querySelector("ul");
//create an li tags according to array length of the list
for (let i = 0; i < allMusic.length; i++) {
  // injecting the li into js and adding track details
  let liTag = `<li li-index='${i+1}'>
						    <div class="row">
							    <span>${allMusic[i].name}</span>
							    <p>${allMusic[i].artist}</p>
						    </div>
						    <span id='${allMusic[i].src}' 
                class="audio-duration">3:40</span>
                <audio class='${allMusic[i].src}' src='assets/artist/tracks/${allMusic[i].src}.mp3'></audio>
					    </li>`;
  // console.log(allMusic[i].src)
  ulTag.insertAdjacentHTML('beforeend', liTag);//inserting the li inside the ul tag

  //liAudioDuration select span tag which show audio total duration and liAudioTag select audio tag which have audio source
  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  // loadeddata event used to get audio total duration without playing it
  liAudioTag.addEventListener('loadeddata', () => {
    let trackDuration = liAudioTag.duration;
    let totalMin = Math.floor(trackDuration / 60);
    let totalSec = Math.floor(trackDuration % 60);
    //adding additional 0 to seconds if seconds is less than 10
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`; //passing total duration of the track
    liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}

//playing a particular track from the list onclick of li tag
function playTrack() {
  const allLiTag = ulTag.querySelectorAll('li');

  for (let j = 0; j < allLiTag.length; j++){
    let audioTag = allLiTag[j].querySelector('.audio-duration');
    // console.log(audioTag)
    if (allLiTag[j].classList.contains('playing')) {
      allLiTag[j].classList.remove('playing');
      let adDuration = audioTag.getAttribute('t-duration');
      audioTag.innerText = adDuration;
    }

    //if li tag index is equal to the musicIndex then add playing class in it
    if (allLiTag[j].getAttribute('li-index') == musicIndex) {
      allLiTag[j].classList.add('playing');
      audioTag.innerText = 'Playing';
    }

    allLiTag[j].setAttribute('onclick', 'clicked(this)');
  }
}

//particular li clicked function
function clicked(element) {
  let getLiIndex = element.getAttribute('li-index');
  musicIndex = getLiIndex;//updating current song index with clicked li index
  loadMusic(musicIndex);
  playMusic();
  playTrack();
}