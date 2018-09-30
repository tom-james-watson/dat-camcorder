// This example uses MediaRecorder to record from an audio and video stream, and uses the
// resulting blob as a source for a video element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get the video & audio stream from user
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we use as video src

let recordButton, stopButton, saveButton, discardButton
let liveContainer, recordingContainer
let recorder, liveStream, videoBlob

async function onRecordingReady(e) {
  const video = document.getElementById('recording-video')

  videoBlob = e.data

  video.src = URL.createObjectURL(videoBlob)

  video.play()
}

function startRecording() {
  recorder = new MediaRecorder(liveStream)

  recorder.addEventListener('dataavailable', onRecordingReady)

  recordButton.style.display = 'none'
  stopButton.style.display = 'initial'

  recorder.start()
}

function stopRecording() {
  recordButton.style.display = 'initial'
  stopButton.style.display = 'none'
  liveContainer.style.display = 'none'
  recordingContainer.style.display = 'initial'

  // Stopping the recorder will eventually trigger the 'dataavailable' event
  // and we can complete the recording process
  recorder.stop()
}

async function saveRecording() {
  const videoBuffer = await new Response(videoBlob).arrayBuffer()

  const videoArchive = await DatArchive.create({title: 'Dat Camcorder Recording'})
  await videoArchive.writeFile('recording.webm', videoBuffer)

  const recordingUrl = videoArchive.url + '/recording.webm'

  const datUrlSpan = document.getElementById('dat-url')
  datUrlSpan.innerHTML = recordingUrl
  datUrlSpan.href = recordingUrl

  saveButton.style.display = 'none'
  discardButton.style.display = 'none'
}

function discardRecording() {
  liveContainer.style.display = 'initial'
  recordingContainer.style.display = 'none'
}

window.onload = async function () {
  recordButton = document.getElementById('record')
  stopButton = document.getElementById('stop')
  saveButton = document.getElementById('save')
  discardButton = document.getElementById('discard')

  liveContainer = document.getElementById('live-container')
  recordingContainer = document.getElementById('recording-container')

  liveStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  })

  const liveVideo = document.getElementById('live-video')
  liveVideo.src = URL.createObjectURL(liveStream)
  liveVideo.play()

  recordButton.addEventListener('click', startRecording)
  stopButton.addEventListener('click', stopRecording)
  saveButton.addEventListener('click', saveRecording)
  discardButton.addEventListener('click', discardRecording)

}
