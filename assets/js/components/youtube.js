// Get the HTML element
var playerElement = document.getElementById('youtube-player');

if (!playerElement) {
  return;
}

// 1. Load the YouTube IFrame Player API code asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

// 2. This function creates an <iframe> (and YouTube player) after the API code downloads
window.onYouTubeIframeAPIReady = function() {
      
    // Extract the video ID from the "data-video-id" attribute
    var videoId = playerElement.dataset.videoId;
    var videoControls = playerElement.dataset.videoControls || 0;

    player = new YT.Player('youtube-player', {
        videoId: videoId, // Insert the extracted ID here
        playerVars: {
            'autoplay': 1,       // Auto-play the video
            'controls': videoControls,       // Hide player controls
            'showinfo': 0,       // Hide video title and info
            'modestbranding': 1, // Minimize YouTube logo
            'loop': 1,           // Loop the video
            'fs': 0,             // Hide fullscreen button
            'cc_load_policy': 0, // Hide closed captions
            'iv_load_policy': 3, // Hide annotations
            'autohide': 0,       // Auto-hide controls
            'playlist': videoId  // REQUIRED: The video ID is needed here again to loop a single video
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

// 3. The API will call this function when the video player is ready
function onPlayerReady(event) {
    // CRITICAL: Mute the video to allow autoplay on modern browsers (Chrome, Safari, etc.)
    event.target.mute();
    event.target.playVideo();
}