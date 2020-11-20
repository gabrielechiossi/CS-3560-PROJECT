const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');

// disable stop button while not recording

stop.disabled = true;


// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext("2d");

function pageRedirect() {
  window.location.replace("notoldenough.html");
}
var age = window.prompt("Enter your age: ");
var name = window.prompt("Enter your name: ");
 
function myFunction(age) {

  if(age <= 4){
    pageRedirect();

    return false;

  }else{
    return true;
  }  

}


function userInfo(name, age) {
  if(typeof name === 'string' && typeof age === 'string'){
      return name + " " + age;
  }else if(name === null && age === null){
      return false;
  }
}

myFunction(age);

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    
    visualize(stream);
    

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }
    

    
    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');
      const editLabel = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';
      editLabel.textContent = 'Edit';
      editLabel.className = 'edit';

      if(clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      clipContainer.appendChild(editLabel);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");
        
     var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'black',
        progressColor: '#FF5126', 
      });
      
    
    /* Here upload your audio */
    
    wavesurfer.load(audioURL);
    
    /* Here Play audio */
    
    audio.onplaying = function() {
      console.log("it's playing");
        wavesurfer.play();
    }  
      
    audio.onpause = function() {
      console.log("it's pause");
      wavesurfer.pause();
    }

      deleteButton.onclick = function(e) {
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
        wavesurfer.destroy();
      }

      editLabel.onclick = function(e) {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);
    
    if(stop.disabled !== true){
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(255, 255, 255)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  
      canvasCtx.lineWidth = 4;
      canvasCtx.strokeStyle = 'rgb(255, 81, 38)';
  
      canvasCtx.beginPath();
  
      let sliceWidth = WIDTH * 1.0 / bufferLength;
      let x = 0;
  
  
      for(let i = 0; i < bufferLength; i++) {
  
        let v = dataArray[i] / 128.0;
        let y = v * HEIGHT/2;
  
        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
  
        x += sliceWidth;
      }
  
      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
  
    }else{
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(255, 255, 255)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  
      canvasCtx.lineWidth = 4;
      canvasCtx.strokeStyle = 'rgb(255, 81, 38)';
  
      canvasCtx.beginPath();
      
      let sliceWidth = WIDTH * 1.0 / bufferLength;
      let x = 0;
      let y = HEIGHT/2;

      for(let i = 0; i < bufferLength; i++) {
        canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    }   
  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();
