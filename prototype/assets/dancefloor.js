// The eight illustrated DJ frames last 180 ms each.
const frameCount = 8;
const frameDuration = 180;

export function setUpDancefloor(scene, motionAllowed) {
  const performer = scene.querySelector('[data-cue-performer]');
  const canvas = scene.querySelector('canvas[data-atlas]');
  const context = canvas.getContext('2d');
  const atlas = new Image();
  const still = performer.getAttribute('src');

  let djVisible = false;
  let atlasReady = false;
  let nativeFallback = !context;
  let frame = 0;
  let timer;

  function advance() {
    if (atlasReady) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(atlas, frame * canvas.width, 0, canvas.width, canvas.height,
        0, 0, canvas.width, canvas.height);
      canvas.hidden = false;
      performer.style.opacity = '0';
    }
    frame = (frame + 1) % frameCount;
    timer = setTimeout(advance, frameDuration);
  }

  function sync() {
    if (!motionAllowed() || !djVisible) {
      clearTimeout(timer);
      timer = undefined;
      frame = 0;
      canvas.hidden = true;
      performer.style.opacity = '';
      if (nativeFallback && performer.getAttribute('src') !== still) performer.src = still;
      return;
    }
    if (!atlasReady && !nativeFallback) {
      if (!atlas.hasAttribute('src')) atlas.src = canvas.dataset.atlas;
      return;
    }
    if (nativeFallback && performer.getAttribute('src') === still) performer.src = '/assets/cast/dj.webp';
    if (timer === undefined) advance();
  }

  atlas.onload = () => { atlasReady = true; sync(); };
  atlas.onerror = () => { nativeFallback = true; sync(); };

  const observer = new IntersectionObserver(([entry]) => {
    djVisible = entry.isIntersecting && entry.intersectionRatio >= .01;
    sync();
  }, {threshold:.01});
  observer.observe(performer);
  return sync;
}
