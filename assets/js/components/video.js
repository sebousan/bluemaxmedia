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

// Hover video
const hoverVideos = document.querySelectorAll('.project .content');
hoverVideos.forEach(hoverVideo => {
  hoverVideo.addEventListener('mouseenter', () => {
    let media = hoverVideo.nextElementSibling;
    if (!media) {
      return;
    }
    let video = media.querySelector('.js-video');
    if (video && typeof video.play === 'function') {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Ignore NotAllowedError as it's a browser policy/user permission issue
          // also ignore AbortError if playback was interrupted by mouseleave (pause)
          if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
              console.log('Video play failed:', error);
          }
          });
      }
    }
  });
  hoverVideo.addEventListener('mouseleave', () => {
    let media = hoverVideo.nextElementSibling;
    if (!media) {
      return;
    }
    let video = media.querySelector('.js-video');
    if (video && typeof video.pause === 'function') {
      video.pause();
    }
  });
});