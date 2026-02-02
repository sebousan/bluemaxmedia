const players = document.querySelectorAll('.js-youtube-player');
if (!players.length) return;

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
        script.defer = true;

        window.onYouTubeIframeAPIReady = resolve;
        document.head.appendChild(script);
    });

/**
 * Player ready handler
 */
const onPlayerReady = (event, autoplay) => {
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

/**
 * Init players
 */
loadYouTubeAPI().then(() => {
    players.forEach(playerEl => {
        const {
            videoId,
            videoAutoplay = '1',
            videoControls = '0'
        } = playerEl.dataset;

        const autoplay = Number(videoAutoplay);
        const controls = Number(videoControls);

        new YT.Player(playerEl, {
            videoId,
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
                playlist: videoId
            },
            events: {
                onReady: e => onPlayerReady(e, autoplay),
                onStateChange: onPlayerStateChange
            }
        });
    });
});
