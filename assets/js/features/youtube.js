const players = document.querySelectorAll('.js-youtube-player');
const instances = new Map(); // element id → ready YT.Player
const playRequested = new Set(); // element ids clicked before their player was ready

/**
 * Load YouTube Iframe API (once)
 */
const loadYouTubeAPI = () =>
  new Promise(resolve => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';

    window.onYouTubeIframeAPIReady = resolve;
    document.head.appendChild(script);
  });

/**
 * Player ready handler
 */
const onPlayerReady = (event, id, autoplay) => {
  event.target.getIframe()?.classList.add('is-ready');
  instances.set(id, event.target);

  if (playRequested.has(id)) {
    event.target.playVideo();
    return;
  }
  if (!autoplay) return;

  event.target.mute(); // required for autoplay
  event.target.playVideo();
};

/**
 * Player state change handler
 */
const onPlayerStateChange = ({ data, target }) => {
  if (data !== YT.PlayerState.PLAYING) return;

  const iframe = target.getIframe();
  iframe?.parentElement?.classList.add('is-playing');
};

const getYouTubeId = (url) => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i
  );
  return match && match[1] ? match[1] : url;
};

/**
 * Init players
 */
const initYouTube = () => {
  loadYouTubeAPI().then(() => {
    players.forEach(playerEl => {
      const {
        videoId,
        videoAutoplay = '1',
        videoControls = '0'
      } = playerEl.dataset;

      const id = playerEl.id;
      const autoplay = Number(videoAutoplay);
      const controls = Number(videoControls);
      const youTubeId = getYouTubeId(videoId);

      new YT.Player(playerEl, {
          videoId: youTubeId,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            autoplay,
            controls,
            modestbranding: 1,
            loop: 1,
            fs: 0,
            cc_load_policy: 0,
            iv_load_policy: 3,
            playsinline: 1,
            playlist: youTubeId
          },
          events: {
            onReady: e => onPlayerReady(e, id, autoplay),
            onStateChange: onPlayerStateChange
          }
      });
    });
  });
};

/**
 * Poster: play the video on click, or as soon as its player is ready
 */
document.querySelectorAll('.js-video-play-pause').forEach(poster => {
  const id = poster.nextElementSibling?.id;
  if (!id) return;

  poster.addEventListener('click', () => {
    const player = instances.get(id);
    if (player) {
      player.playVideo();
    } else {
      playRequested.add(id);
    }
  });
});

/**
 * Load the API on the first user interaction only:
 * keeps its weight and console errors out of the initial page load (PageSpeed)
 */
if (players.length) {
  const events = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'wheel', 'touchstart'];
  const start = () => {
    events.forEach(type => window.removeEventListener(type, start));
    initYouTube();
  };
  events.forEach(type => window.addEventListener(type, start, { passive: true }));
}
