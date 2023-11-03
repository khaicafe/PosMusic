/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const { ipcRenderer } = require('electron');
let filePath = `${process.cwd()}/config.ini`;

// Gửi dữ liệu từ render process sang main process Get path root config.ini
ipcRenderer.send('send-path');
ipcRenderer.on('path-reply', (event, appPath) => {
  filePath = `${appPath}\\config.ini`;
  // console.log('Đường dẫn thư mục appData:', filePath);
});

const app_main = null
// const filePath = `${process.cwd()}/config.ini`;
const select = selector => document.querySelector(selector)
// let container = select('#messages')
// let progressBar = select('#progressBar')
// let version = select('#version')
let progres = select('.java')

/////////////// listen event main.js ////////////////////
ipcRenderer.on('Update_available', (event, text) => {
  console.log('update')
  let Update_available = document.querySelector('.progress-bar-container')
  Update_available.style.display = 'block'
 
})

ipcRenderer.on('update_downloaded', (event, text) => {
  let Update_available = document.querySelector('.progress-bar-container')
  Update_available.style.display = 'none'
})

ipcRenderer.on('download-progress', (event, text) => {
  progres.style.width = `${text}%`
  console.log('down', text)
})
// nhận biến app từ main.js
ipcRenderer.on('app-data', (event, app) => {
  app_main = app
  console.log(app_main);
});

//////////////////////////////////////////////// music /////////////////////////////////////////////////
window.addEventListener('load', () => {
var _next = 0, files, len
const axios = require('axios')
  files = [
// {name: 'Us Uk 1', url: 'https://nhacchuong123.com/nhac-chuong/nhac-doc/tayduky.mp3'},
// {name: 'Us Uk 2', url: 'https://nhacchuong123.com/nhac-chuong/abcdefgh/hoa-co-lau-remix-tiktok-phong-max.mp3'},
// {name: '8x 9x Hits 3', url: 'https://nhacchuong123.com/nhac-chuong/abcdefg/Nhac-Chuong-Trach-Duyen-Trach-Phan-Remix-Do-Thanh-Duy.mp3'}
]
// let track_list = files

const instance = axios.create({
    baseURL: "https://cdn.neocafe.tech/media/music/playlist/metadata.json",
})

const fs = require("fs");
const path = require('path')

// Select all the elements in the HTML page
// and assign them to a variable
  let now_playing = document.querySelector(".now-playing");
  let track_art = document.querySelector(".track-art");
  let track_name = document.querySelector(".track-name");
  let track_artist = document.querySelector(".track-artist");
  
  let playpause_btn = document.querySelector(".playpause-track");
  let next_btn = document.querySelector(".next-track");
  let prev_btn = document.querySelector(".prev-track");
  
  let seek_slider = document.querySelector(".seek_slider");
  let volume_slider = document.querySelector(".volume_slider");
  let curr_time = document.querySelector(".current-time");
  let total_duration = document.querySelector(".total-duration");

  const soundButton = document.getElementById("sound");
  let soundStatus = true;
  let settings
  
  // Specify globally used values
  let track_index = 0;
  let isPlaying = false;
  let updateTimer;
  
  // Create the audio element for the player
  let curr_track = document.createElement('audio');


  // get variable set ui
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('File does not exist', filePath);
      const configData = {
        mute: '',
        sound: ''
      };
      const jsonData = JSON.stringify(configData, null, 2);
      fs.writeFileSync(filePath, jsonData, 'utf-8');
    } else {
      console.log('File exists', filePath);
      const getdata = fs.readFileSync(filePath, 'utf-8');
      settings = JSON.parse(getdata);
      console.log(`settings JSON: ${getdata}`, settings)
      if (settings) {
        settings.mute? soundButton.innerHTML = "<i class='fa fa-volume-mute'></i>":soundButton.innerHTML = "<i class='fa fa-volume-up'></i>"
        try {
          soundStatus = settings.mute
          curr_track.muted = settings.mute
        } catch (error) {
          console.log(error)
        }
        // get device đã save
        // const storeTemp = ['music']
        // storeTemp.map((item) => {
        //   var soundName = settings
        //   if (soundName){
        //     // Request user permission to access the audio device
        //     const constraints = { audio: { deviceId: soundName.sound },};
        //     navigator.mediaDevices.getUserMedia(constraints)
        //     attachSinkId(item, soundName)
        //   } else {
        //     curr_track.setSinkId('default')
        //   }
        // });
        
      } 
    }
    
  });
  // test list sound
  let track_list = [
    {
      name: "Music Local",
      artist: "Broke For Free",
      image: "Image URL",
      url: "./saveMusic/musicDefault.mp3"
    }
    // {
    //   name: "Enthusiast",
    //   artist: "Tours",
    //   image: "Image URL",
    //   url: "https://nhacchuong123.com/nhac-chuong/abcdefgh/hoa-co-lau-remix-tiktok-phong-max.mp3"
    // },
    // {
    //   name: "Shipping Lanes",
    //   artist: "Chad Crouch",
    //   image: "Image URL",
    //   url: "https://nhacchuong123.com/nhac-chuong/abcdefg/Nhac-Chuong-Trach-Duyen-Trach-Phan-Remix-Do-Thanh-Duy.mp3",
    // },
  ];

  BeginPlay()

//////////////////
async function loadTrack(track_index) {
  // Clear the previous seek timer
  clearInterval(updateTimer);
  resetValues();
  // Load a new track
  curr_track.src = track_list[track_index].url;
  curr_track.load();
 
  // Update details of the track
  // track_art.style.backgroundImage =
  //    "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist || 'NEOCAFE';
  // now_playing.textContent =
  //    "PLAYING " + (track_index + 1) + " OF " + track_list.length;
 
  // Set an interval of 1000 milliseconds
  // for updating the seek slider
  updateTimer = setInterval(seekUpdate, 1000);
 
  // Move to the next track if the current finishes playing
  // using the 'ended' event
  curr_track.addEventListener("ended", nextTrack);
 
  // Apply a random background color
  random_bg_color();
  // save music
  ipcRenderer.send('downloadFile', {
    url: track_list[track_index].url,
    // filePath: filePath
  })
}

function random_bg_color() {
  // Get a random number between 64 to 256
  // (for getting lighter colors)
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;
 
  // Construct a color with the given values
  let bgColor = "rgb(" + red + ", " + green + ", " + blue + ")";
 
  // Set the background to the new color
  document.body.style.background = bgColor;
}
 
// Function to reset all values to their default
function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  // Switch between playing and pausing
  // depending on the current state
  if (!isPlaying) playTrack();
  else pauseTrack();
}
 
async function playTrack() {
  // Play the loaded track
  curr_track.play();
  isPlaying = true;
 
  // Replace icon with the pause icon
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
 
function pauseTrack() {
  // Pause the loaded track
  curr_track.pause();
  isPlaying = false;
 
  // Replace icon with the play icon
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
 
function nextTrack() {
  // Go back to the first track if the
  // current one is the last in the track list
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
 
  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}
 
function prevTrack() {
  // Go back to the last track if the
  // current one is the first in the track list
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length - 1;
   
  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  // Calculate the seek position by the
  // percentage of the seek slider
  // and get the relative duration to the track
  seekto = curr_track.duration * (seek_slider.value / 100);
 
  // Set the current track position to the calculated seek position
  curr_track.currentTime = seekto;
}
 
function setVolume() {
  // Set the volume according to the
  // percentage of the volume slider set
  curr_track.volume = volume_slider.value / 100;
}
 
function seekUpdate() {
  let seekPosition = 0;
 
  // Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;
 
    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);
 
    // Add a zero to the single digit time values
    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
 
    // Display the updated duration
    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}
/////////////////////////// ////////////////////////////////////
// xử lý load file music default khi connect file url error
curr_track.addEventListener("error", function(e) {
  console.log("Playback error: " + e.currentTarget.error.code);
  // load default musicDefault.mp3
  curr_track.src = 'saveMusic/musicDefault.mp3'
  curr_track.load();
  curr_track.play();
});         

playpause_btn.addEventListener("click", function (el) {
  // play()
  playpauseTrack()
})
next_btn.addEventListener("click", function (el) {
  nextTrack()
})
prev_btn.addEventListener("click", function (el) {
  prevTrack()
})
seek_slider.addEventListener("click", function (el) {
  seekTo()
})
volume_slider.addEventListener("click", function (el) {
  setVolume()
})

soundButton.addEventListener("click", () => {
  // Thay đổi trạng thái của âm thanh
  soundStatus = !soundStatus;
  // Thay đổi icon của button
  if (soundStatus) {
    soundButton.innerHTML = "<i class='fa fa-volume-up'></i>";
    curr_track.muted = false;
  } else {
    soundButton.innerHTML = "<i class='fa fa-volume-mute'></i>";
    curr_track.muted = true;
  }
  const Vtemp = { sound: settings ? settings.sound : null, mute: curr_track.muted }
  const jsonData = JSON.stringify(Vtemp, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf-8');
});

// myAudio.addEventListener('error', function() {
//     console.log('Lỗi: Không tìm thấy file audio');
//     // Tiếp tục chạy bài khác ở đây
//     if((len)==_next){
//         _next = 0;
//     } else {
//         _next += 1;
//         console.log(len, _next);
//     }
//     next(_next);
//     console.log(_next)
//     });
// myAudio.addEventListener("ended", async function(){
//     _next += 1;
//     console.log(len, _next);
//     // console.log('file', files[_next].url)
//     if(_next >= (len)){
//         _next = 0;
//     }
//     await next(_next);
//     console.log(_next)
// });
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

async function BeginPlay () {
  // get list music
  try {
    const res = await instance.get();
    files = res.data.items
    len = files.length;
    const currentDate = new Date();
    const keyword = currentDate.getDate();
    const shuffledMusic = await shuffleArrayByKeyword(files, keyword);
    track_list = shuffledMusic
    console.log(shuffledMusic);
    // Load the first track in the tracklist
    // await loadTrack(track_index);
    // await playTrack()
    
  } catch (error) {
    console.log('load list array music error')
    checkConnection()
    // swal("Mất kết nối đến server. Vui lòng khởi động lại app", {
    //   icon: "error",
    // });
    // return
    
  }
  // Load the first track in the tracklist
  await loadTrack(track_index);
  await playTrack()
  // load device
  gotDevices()
  // check online riêng
  statusOnline()
// check connection server
function checkConnection() {
   // Tạo một vòng lặp để kiểm tra kết nối với server
 const serverCheckInterval = setInterval(() => {
  // Thực hiện một HTTP request đến server
  // Ở đây, sử dụng module `http` để gửi một GET request
  const http = require('http');
  const options = {
    hostname: 'cdn.neocafe.tech', // Thay bằng địa chỉ server thực tế
    port: 80, // Port của server
    path: '/media/music/playlist/metadata.json', // Đường dẫn trang bạn muốn kiểm tra
    method: 'GET',
  };
    const request = http.request(options, async (response) => {
      if (response.statusCode === 200) {
        console.log('Server connection successful', response.body)
        clearInterval(serverCheckInterval); // Dừng vòng lặp khi kết nối thành công
        // mainWindow.loadURL('https://t.pos.imenu.tech/staff/'); // Tải trang web khi kết nối thành công
      }
      // Khởi tạo một biến để lưu dữ liệu phản hồi
      let responseData = ''; 
      // Xử lý dữ liệu khi nhận được
      response.on('data', (chunk) => {
        responseData += chunk;
      });
      // Xử lý khi kết thúc phản hồi
      response.on('end', async () => {
        // Dữ liệu phản hồi đã kết thúc
        console.log('Dữ liệu phản hồi:', JSON.parse(responseData));
        files = (JSON.parse(responseData)).items
        len = files.length;
        const currentDate = new Date();
        const keyword = currentDate.getDate();
        const shuffledMusic = await shuffleArrayByKeyword(files, keyword);
        track_list = shuffledMusic
        console.log(shuffledMusic);
      });
    });

    request.on('error', (error) => {
      // Xử lý lỗi nếu không thể kết nối với server
      console.log('Không thể kết nối với server:', error.message);
    });

    request.end();
  }, 5000); // Kiểm tra mỗi 5 giây (có thể điều chỉnh thời gian kiểm tra)
}
// status check online 
function statusOnline() {
  // Tạo một vòng lặp để kiểm tra kết nối với server
  const serverCheckInterval = setInterval(() => {
    // Thực hiện một HTTP request đến server
    // Ở đây, sử dụng module `http` để gửi một GET request
    const http = require('http');
    const options = {
      hostname: 'cdn.neocafe.tech', // Thay bằng địa chỉ server thực tế
      port: 80, // Port của server
      path: '/media/music/playlist/metadata.json', // Đường dẫn trang bạn muốn kiểm tra
      method: 'GET',
    };
      const request = http.request(options, async (response) => {
        if (response.statusCode === 200) {
          console.log('Server connection successful', response.body)
          // clearInterval(serverCheckInterval); // Dừng vòng lặp khi kết nối thành công
          // mainWindow.loadURL('https://t.pos.imenu.tech/staff/'); // Tải trang web khi kết nối thành công
          document.querySelector('.online').style.display = 'block';
          document.querySelector('.offline').style.display = 'none';
        }
        else {
          console.log('Không thể kết nối với server:', response.statusCode);
          document.querySelector('.online').style.display = 'none';
          document.querySelector('.offline').style.display = 'block';
        }
      });
  
      request.on('error', (error) => {
        document.querySelector('.online').style.display = 'none';
        document.querySelector('.offline').style.display = 'block';
        // Xử lý lỗi nếu không thể kết nối với server
        console.log('Không thể kết nối với server:', error.message);
      });
  
      request.end();
    }, 5000); // Kiểm tra mỗi 5 giây (có thể điều chỉnh thời gian kiểm tra)m tra mỗi 5 giây (có thể điều chỉnh thời gian kiểm tra)
}
//////////////////// Set Device ///////////////////////

async function gotDevices() {
  const deviceInfos = await navigator.mediaDevices.enumerateDevices({ audio: true })
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
    const getdata = fs.readFileSync(filePath, 'utf-8');
    var soundName = JSON.parse(getdata);
    if (soundName && soundName.sound){
      // Request user permission to access the audio device
      // const constraints = { audio: { deviceId: soundName.sound },};
      // navigator.mediaDevices.getUserMedia(constraints)
      console.log('soundName', soundName)
      element.value = soundName.sound
      attachSinkId(element.id, soundName.sound, element)
    } else {
      console.log('soundName not', soundName)
      element.options[0].defaultSelected = true;
    }
  }
 
}
function attachSinkId(elementId, sinkId, outputSelector) {
  var element;
  if (elementId == 'music'){
    element = curr_track //document.querySelector(`audio#${elementId}`)
  } else {
    // phần của notify đơn hàng ne
    // element = audioElement
    element = curr_track
  }
  console.log('attachSinkId', element)
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
  // var checkbox = document.querySelector(`input[name=${nameAudio}]`);
  const Vtemp = { sound: deviceId, mute: curr_track.muted }
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

});
