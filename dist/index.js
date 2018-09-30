/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// This example uses MediaRecorder to record from an audio and video stream, and uses the\n// resulting blob as a source for a video element.\n//\n// The relevant functions in use are:\n//\n// navigator.mediaDevices.getUserMedia -> to get the video & audio stream from user\n// MediaRecorder (constructor) -> create MediaRecorder instance for a stream\n// MediaRecorder.ondataavailable -> event to listen to when the recording is ready\n// MediaRecorder.start -> start recording\n// MediaRecorder.stop -> stop recording (this will generate a blob of data)\n// URL.createObjectURL -> to create a URL from a blob, which we use as video src\n\nlet recordButton, stopButton, saveButton, discardButton\nlet liveContainer, recordingContainer\nlet recorder, liveStream, videoBlob\n\nasync function onRecordingReady(e) {\n  const video = document.getElementById('recording-video')\n\n  videoBlob = e.data\n\n  video.src = URL.createObjectURL(videoBlob)\n\n  video.play()\n}\n\nfunction startRecording() {\n  recorder = new MediaRecorder(liveStream)\n\n  recorder.addEventListener('dataavailable', onRecordingReady)\n\n  recordButton.style.display = 'none'\n  stopButton.style.display = 'initial'\n\n  recorder.start()\n}\n\nfunction stopRecording() {\n  recordButton.style.display = 'initial'\n  stopButton.style.display = 'none'\n  liveContainer.style.display = 'none'\n  recordingContainer.style.display = 'initial'\n\n  // Stopping the recorder will eventually trigger the 'dataavailable' event\n  // and we can complete the recording process\n  recorder.stop()\n}\n\nasync function saveRecording() {\n  const videoBuffer = await new Response(videoBlob).arrayBuffer()\n\n  const videoArchive = await DatArchive.create({title: 'Dat Camcorder Recording'})\n  await videoArchive.writeFile('recording.webm', videoBuffer)\n\n  const recordingUrl = videoArchive.url + '/recording.webm'\n\n  const datUrlSpan = document.getElementById('dat-url')\n  datUrlSpan.innerHTML = recordingUrl\n  datUrlSpan.href = recordingUrl\n\n  saveButton.style.display = 'none'\n  discardButton.style.display = 'none'\n}\n\nfunction discardRecording() {\n  liveContainer.style.display = 'initial'\n  recordingContainer.style.display = 'none'\n}\n\nwindow.onload = async function () {\n  recordButton = document.getElementById('record')\n  stopButton = document.getElementById('stop')\n  saveButton = document.getElementById('save')\n  discardButton = document.getElementById('discard')\n\n  liveContainer = document.getElementById('live-container')\n  recordingContainer = document.getElementById('recording-container')\n\n  liveStream = await navigator.mediaDevices.getUserMedia({\n    audio: true,\n    video: true\n  })\n\n  const liveVideo = document.getElementById('live-video')\n  liveVideo.src = URL.createObjectURL(liveStream)\n  liveVideo.play()\n\n  recordButton.addEventListener('click', startRecording)\n  stopButton.addEventListener('click', stopRecording)\n  saveButton.addEventListener('click', saveRecording)\n  discardButton.addEventListener('click', discardRecording)\n\n}\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });