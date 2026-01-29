document.addEventListener('DOMContentLoaded', function () {
  let lazyVideos = [].slice.call(
    document.querySelectorAll('.js-video.is-lazy')
  );
  if (lazyVideos.length > 0) {
    if ('IntersectionObserver' in window) {
      let lazyVideoObserver = new IntersectionObserver(function (
        entries,
        observer
      ) {
        entries.forEach(function (video) {
          if (video.isIntersecting) {
            
            let hasMobileVideo = false;
            for (let source in video.target.children) {
              let videoSource = video.target.children[source];
              if (
                typeof videoSource.tagName === 'string' &&
                videoSource.tagName === 'SOURCE'
              ) {
                if (videoSource.hasAttribute('data-src_mobile')) {
                  hasMobileVideo = true;
                }
                if (
                  window.matchMedia('(max-width: 767px)').matches &&
                  hasMobileVideo
                ) {
                  if (videoSource.hasAttribute('data-src_mobile')) {
                    videoSource.src = videoSource.dataset.src_mobile;
                  }
                } else {
                  if (videoSource.hasAttribute('data-src')) {
                    videoSource.src = videoSource.dataset.src;
                  }
                }
              }
            }

            video.target.load();
            video.target.classList.remove('is-lazy');
            lazyVideoObserver.unobserve(video.target);
          }
        });
      });

      lazyVideos.forEach(function (lazyVideo) {
        lazyVideoObserver.observe(lazyVideo);
      });
    }
  }
});

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
        
        // Try to get YouTube player instance if YT API is ready
        if (typeof YT !== 'undefined' && typeof YT.get === 'function' && id) {
          player = YT.get(id); // Access player via YouTube ID (requires ID on DOM element)
        }

        if (player && typeof player.playVideo === 'function') {
          player.playVideo();
          setTimeout(() => {
            wrapper.classList.toggle('is-playing');
          }, 200);
        } else {
            console.warn('YouTube Player not found or API not ready for ID:', id);
        }
      }
  });
});


// Hover video
const hoverVideos = document.querySelectorAll('.project .content');
hoverVideos.forEach(hoverVideo => {
  hoverVideo.addEventListener('mouseenter', () => {
    let media = hoverVideo.nextElementSibling;
    let video = media.querySelector('.js-video');
    if (video) {
        media.classList.add('media--hover');
        video.play();
      }
  });
  hoverVideo.addEventListener('mouseleave', () => {
    let video = hoverVideo.nextElementSibling.querySelector('.js-video');
    if (video) {
        video.pause();
      }
  });
});