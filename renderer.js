/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const { ipcRenderer } = require('electron');

const select = selector => document.querySelector(selector)
let container = select('#messages')
let progressBar = select('#progressBar')
let version = select('#version')

ipcRenderer.on('message', (event, text) => {
  let message = document.createElement('div')
  message.innerHTML = text
  container.appendChild(message)

})

ipcRenderer.on('version', (event, text) => {
  version.innerText = text
})

ipcRenderer.on('download-progress', (event, text) => {
  progressBar.style.width = `${text}%`
  console.log('down', text)
})
//////////////////////////////////////////////// music /////////////////////////////////////////////////
var _next = 0,
      files,
      len,
   timerInterval;
   const axios = require('axios')
  const myAudio = document.querySelector('audio#music');
  const instance = axios.create({
      baseURL: "https://cdn.neocafe.tech/media/music/playlist/metadata.json",
  })
var checkbox = document.querySelector("input[name=music]");
const fs = require("fs");
const path = require('path')
const filePath = path.resolve(__dirname, 'config.ini');
console.log(filePath);
// const filePath = './config.ini';
if (!fs.existsSync(filePath)) {
  const configData = {
    mute: '',
    sound: ''
  };
  const jsonData = JSON.stringify(configData, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf-8');
} else {
  const getdata = fs.readFileSync(filePath, 'utf-8');
  settings = JSON.parse(getdata);
  console.log(`settings JSON: ${getdata}`, settings)
  if (settings) {
    // console.log('checkpoup', settings)
    checkbox.checked = settings.mute
    try {
      myAudio.muted = !settings.mute
    } catch (error) {
      console.log(error)
    }

    // get device đã save
    const storeTemp = ['music']
    storeTemp.map((item) => {
      // localStorage.getItem(item);
    //  const getdata = fs.readFileSync(filePath, 'utf-8');
    //  settings = JSON.parse(getdata);
     var soundName = settings
    //  console.log(item, soundName)
     if (soundName){
       // Request user permission to access the audio device
       const constraints = { audio: { deviceId: soundName.sound },};
       navigator.mediaDevices.getUserMedia(constraints)
      //  console.log('oki device')
       attachSinkId(item, soundName)
     } else {
       myAudio.setSinkId('default')
     }
    });
    
  } 
}
 // Play music
 getListMusic();
 // get device
 gotDevices()

checkbox.addEventListener('change', function() {
  if (this.checked) {
    myAudio.muted = false;
    console.log("Checkbox is checked..");
  } else {
    // muteAudio(myAudio
    myAudio.muted = true;
    console.log("sound off");
  }
  
  const Vtemp = { sound: settings ? settings.sound : null, mute: checkbox.checked }
  const jsonData = JSON.stringify(Vtemp, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf-8');
});


  
    async function next(n) {
      if(typeof files[n] !== 'undefined'){
        console.log('file', files[n].url)
        myAudio.setAttribute("src", files[n].url);
        document.getElementById('nameMusic').innerHTML = files[n].name;
        play()
        // window.addEventListener('click', () => {
        //  play()
        // }, { once: true })
      } else {
        console.log('lỗi file', files.length)
        for (var i = _next; i < files.length; i++) {
          if(typeof files[i] !== 'undefined'){
            _next = i
            console.log('chekc file', files[i])
            myAudio.setAttribute("src", files[_next].url);
            document.getElementById('nameMusic').innerHTML = files[_next].name;
            play()
            break;
          }
        }

      }
    }

    async function nextMusic() {
      len = files.length;
        // Tiếp tục chạy bài khác ở đây
        if (len-1 == _next) {
        _next = 0;
      } else {
        _next += 1;
        console.log(len, _next);
      }
      myAudio.setAttribute("src", files[_next].url);
      document.getElementById('nameMusic').innerHTML = files[_next].name;
      myAudio.load();
      myAudio.play();
      console.log(_next);
    }
    async function preMusic() {
      len = files.length;
        // Tiếp tục chạy bài khác ở đây
        if (_next == 0) {
         _next = len-1;
       } else {
         _next -= 1;
         console.log(len, _next);
       }
       myAudio.setAttribute("src", files[_next].url);
       document.getElementById('nameMusic').innerHTML = files[_next].name;
       myAudio.load();
       myAudio.play();
       console.log(_next);
     }

  
     // btn play pause
     var btn_pause = document.getElementById('playpause');
    btn_pause.addEventListener("click", function (el) {
      play()
    })
    // btn next
    var btn_pause = document.getElementById('nextMusic');
    btn_pause.addEventListener("click", function (el) {
      nextMusic()
    })
    // btn preMusic
    var btn_pause = document.getElementById('preMusic');
    btn_pause.addEventListener("click", function (el) {
         preMusic()
       })
    
   
    
    
    myAudio.addEventListener('error', function() {
        console.log('Lỗi: Không tìm thấy file audio');
        // Tiếp tục chạy bài khác ở đây
        if((len)==_next){
            _next = 0;
        } else {
            _next += 1;
            console.log(len, _next);
        }
        next(_next);
        console.log(_next)
        });
    myAudio.addEventListener("ended", function(){
        _next += 1;
        next(_next);
        console.log(len, _next);
        if((len-1)==_next){
            _next = -1;
        }
        console.log(_next)
    });
    async function shuffleArrayByKeyword(array, temp) {
      const keyword = temp.toString();
      console.log('random', keyword)
     
       // Tạo một mảng con chứa các phần tử có từ khóa
        const keywordElements = array.filter(item => item.name.includes(keyword));

        // Xáo trộn mảng con
        // const shuffledElements = keywordElements.sort(() => Math.random() - 0.5);

        // Tạo một mảng mới chứa các phần tử đã xáo trộn và các phần tử còn lại
        const shuffledArray = array.map(item => {
          if (item.name.includes(keyword)) {
            return keywordElements.pop();
          }
          return item;
        });

        return shuffledArray;
      }

      
    // Begin
    // navigator.permissions.query({ name: 'microphone' })
    // .then(function(permissionStatus) {
    //   console.log('Permission state:', permissionStatus.state);
    //   if (permissionStatus.state === 'granted') {
    //     // Quyền truy cập đã được cấp
    //     // Tiếp tục xử lý tại đây
    //   } else if (permissionStatus.state === 'prompt') {
    //     // Trình duyệt đang hiển thị cửa sổ xác nhận
    //     // Người dùng chưa đưa ra quyết định
    //     navigator.mediaDevices.getUserMedia({ audio: true })
    //   } else {
    //     // Quyền truy cập chưa được cấp
    //     // Hiển thị thông báo hoặc xử lý tùy ý
    //     navigator.mediaDevices.getUserMedia({ audio: true })
    //   }
    // })
    // .catch(function(error) {
    //   console.error('Error checking permission:', error);
    // });

    async function getListMusic () {
      
         // get list music
        const res = await instance.get();
        console.log('get list music', res.data)
        files = res.data.items
        len = files.length;
        const currentDate = new Date();
        const keyword = currentDate.getDate();
        // console.log('key', keyword, currentDate)
        const shuffledMusic = await shuffleArrayByKeyword(files, keyword);
        files = shuffledMusic
        console.log(shuffledMusic);
        next(_next);
        
    }
    
     //------------------------------------------
    function stopAnimation() {
        var scrollText = document.querySelector('.now-playing-details');
        scrollText.style.animationPlayState = 'paused';
      }
    function playAnimation() {
      var scrollText = document.querySelector('.now-playing-details');
      scrollText.style.animationPlayState = 'running';
    }
    function play() {
      // clearInterval(timerInterval)
      var nowPlayingBoardId = document.getElementById("now-playing-board-id"); 
      var nowPlayingBoardBottomBarId = document.getElementById("now-playing-board-bottom-bar-id");  
      var vynlId = document.getElementById("vynl-id"); 
      const myAudio = document.querySelector('audio#music');

      if(document.getElementById("playpause").classList.contains("play-circle")){  
        vynlId.classList.add("vynl-animation");
        myAudio.load();
        myAudio.play();
        nowPlayingBoardId.style.transform="translatey(40px)";
        // nowPlayingBoardBottomBarId.style.transform="translatey(20%)";
        timerInterval = setTimeout(function () {
          playAnimation()
        }, 3000);
        document.getElementById("playpause").classList.remove("play-circle");
        document.getElementById("playpause").classList.add("pause-circle");
      }
      else if(document.getElementById("playpause").classList.contains("pause-circle")){    
        vynlId.classList.remove("vynl-animation");
        
        myAudio.pause();
        stopAnimation()
        timerInterval = setTimeout(function () {
          nowPlayingBoardId.style.transform="translatey(10%)";
          // nowPlayingBoardBottomBarId.style.transform="translatey(0%)";
        }, 1000);
        
        
        document.getElementById("playpause").classList.remove("pause-circle");
        document.getElementById("playpause").classList.add("play-circle");
      }

    }

///////////////////////////////////////////

async function gotDevices() {
  const deviceInfos = await navigator.mediaDevices.enumerateDevices({ audio: true })
  // console.log('device', deviceInfos)
  const masterOutputSelector = document.querySelectorAll('.container select');
  for (let index = 0; index < masterOutputSelector.length; index++) {
    const element = masterOutputSelector[index];
     // set event change select
    element.addEventListener('change', changeAudioDestination);
      // create option select
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      // option.data-icon = "glyphicon-music";
      if (deviceInfo.kind === 'audiooutput') {
      // console.info('Found audio output device: ', deviceInfo.label);
      option.text = deviceInfo.label || `speaker ${element.length + 1}`;
        element.appendChild(option);
      } else {
        // console.log('Found non audio output device: ', deviceInfo.label);
      }
    }
    // get device đã save
    // var soundName = JSON.parse(localStorage.getItem(element.id));
    const getdata = fs.readFileSync(filePath, 'utf-8');
    var soundName = JSON.parse(getdata);
    if (soundName){
      // console.log('getName-sound', element, element.id, soundName.sound, soundName)
      // Request user permission to access the audio device
      const constraints = { audio: { deviceId: soundName.sound },};
      navigator.mediaDevices.getUserMedia(constraints)
      element.value = soundName.sound
      // console.log('element', element)
      attachSinkId(element.id, soundName.sound, element)
    }
  }
 
}
function attachSinkId(elementId, sinkId, outputSelector) {
  var element;
  if (elementId == 'music'){
    element = document.querySelector(`audio#${elementId}`)
  } else {
    element = audioElement
  }
  // console.log('attachSinkId', elementId)
  if (element && typeof element.sinkId !== 'undefined') {
    // audioContext.setSinkId(sinkId)
    element.setSinkId(sinkId)
        .then(() => {
          // console.log(`Success, audio output device attached: ${sinkId} to element with ${element.title} as source.`);
        })
        .catch(error => {
          let errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.log(errorMessage);
          // Jump back to first output device in the list as it's the default.
          if(outputSelector) outputSelector.selectedIndex = 0;
        });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}
function changeAudioDestination(event) {
  const deviceId = event.target.value;
  const outputSelector = event.target;
  const nameAudio = event.target.id
  var checkbox = document.querySelector(`input[name=${nameAudio}]`);
  const Vtemp = { sound: deviceId, mute: checkbox.checked }
  console.log(nameAudio, Vtemp)
  // FIXME: Make the media element lookup dynamic.
  attachSinkId(nameAudio, deviceId, outputSelector);
  // localStorage.setItem(nameAudio, deviceId);
  // localStorage.setItem(nameAudio, JSON.stringify(Vtemp));
  // const Vtemp = { sound: settings ? settings.sound : null, mute: checkbox.checked }
  const jsonData = JSON.stringify(Vtemp, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf-8');
}
///////////////////////////////////////////
