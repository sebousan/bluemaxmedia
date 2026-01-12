// Play/Pause button 
const btnsPlayPause = document.querySelectorAll('.js-video-play-pause');
btnsPlayPause.forEach(playPause => {
  playPause.addEventListener('click', () => {
    let video = playPause.previousElementSibling;
    if (video == null) {
      video = playPause.nextElementSibling;
    }
    if (video == null) {
      video = playPause.nextElementSibling.querySelector('.js-video');
    }
    if (video) {
        let wrapper = playPause.parentNode;
        let id = video.dataset.videoId;
        let player = null;
        
        console.log(YT);

        // Try to get YouTube player instance if YT API is ready
        if (typeof YT !== 'undefined' && typeof YT.get === 'function' && id) {
          player = YT.get(id); // Access player via YouTube ID (requires ID on DOM element)
        }

        if (player && typeof player.playVideo === 'function') {
          player.playVideo();
          wrapper.classList.toggle('is-playing');
        } else {
            console.warn('YouTube Player not found or API not ready for ID:', id);
        }
      }
  });
});