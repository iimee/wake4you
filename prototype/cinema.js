import { setUpDancefloor } from './assets/dancefloor.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const saveData = Boolean(navigator.connection?.saveData);
const dialogs = [...document.querySelectorAll('dialog')];
const bookingDialog = document.querySelector('.booking-dialog');
const galleryDialog = document.querySelector('.photo-dialog');
const filmDialog = document.querySelector('.film-dialog');
const menuDialog = document.querySelector('.menu-dialog');
const bookingForm = document.querySelector('#booking-form');
const bookingChoices = document.querySelector('.booking-choices');
const bookingResult = document.querySelector('.booking-result');
const openers = new WeakMap();
const galleryButtons = [...document.querySelectorAll('[data-photo]')];
let galleryIndex = 0;
let motionPaused = reducedMotion.matches || saveData;

const legacyPaths = {
  '/': '#top', '/place': '#place', '/events': '#events', '/kitchen': '#kitchen',
  '/water': '#water', '/visit': '#visit'
};
const legacyHashes = {
  '#dance-motion': '#events', '#wake-motion': '#water', '#place-stories': '#place',
  '#food-stories': '#kitchen', '#visit-info': '#visit'
};

function canonicalizeLegacyLocation() {
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const previousPage = pathname !== '/' && legacyPaths[pathname];
  const hash = legacyHashes[location.hash] || (previousPage && (location.hash || previousPage));
  if (hash) {
    history.replaceState(history.state, '', `/${location.search}${hash}`);
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }
}

function motionAllowed() {
  return !motionPaused && !document.hidden && !dialogs.some(dialog => dialog.open);
}

// Move the camera only while a scene is on screen. Native scroll remains in control.
const scenes = [...document.querySelectorAll('[data-scene]')];
const activeScenes = new Set();
let cameraFrame = 0;
let previousScroll = window.scrollY;
let inkSlip = 0;

function queueCamera() {
  if (!cameraFrame && motionAllowed()) cameraFrame = requestAnimationFrame(drawCamera);
}

function drawCamera() {
  cameraFrame = 0;
  if (!motionAllowed()) return;
  const height = window.innerHeight;
  const delta = window.scrollY - previousScroll;
  previousScroll = window.scrollY;
  inkSlip = delta ? Math.max(-1, Math.min(1, inkSlip * .42 + delta / 62)) : inkSlip * .82;
  if (Math.abs(inkSlip) < .015) inkSlip = 0;
  for (const scene of activeScenes) {
    const box = scene.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, (height - box.height - 2 * box.top) / (height + box.height)));
    scene.style.setProperty('--scene-progress', progress.toFixed(4));
    if (mobileMotionQuery.matches && scene.hasAttribute('data-comic-drift')) {
      const viewportCenter = height / 2;
      const sceneCenter = box.top + box.height / 2;
      const comicDrift = Math.max(-1, Math.min(1, (viewportCenter - sceneCenter) / (height * .8)));
      scene.style.setProperty('--comic-drift', comicDrift.toFixed(4));
    }
    scene.style.setProperty('--scene-exit', Math.max(0, Math.min(1, -box.top / box.height)).toFixed(4));
    scene.style.setProperty('--scene-arc', (1 - Math.min(1, Math.abs(progress) * 1.75)).toFixed(4));
    scene.style.setProperty('--ink-slip', inkSlip.toFixed(3));
  }
  if (inkSlip) queueCamera();
}

const sceneObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) activeScenes.add(entry.target);
    else activeScenes.delete(entry.target);
  }
  queueCamera();
}, {rootMargin:'100px 0px'});
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
for (const scene of scenes) {
  sceneObserver.observe(scene);
  scene.addEventListener('pointermove', event => {
    if (!finePointer.matches || !motionAllowed()) return;
    const box = scene.getBoundingClientRect();
    scene.style.setProperty('--aim-x', (2 * (event.clientX - box.left) / box.width - 1).toFixed(3));
    scene.style.setProperty('--aim-y', (2 * (event.clientY - box.top) / box.height - 1).toFixed(3));
  }, {passive:true});
  scene.addEventListener('pointerleave', () => {
    scene.style.removeProperty('--aim-x');
    scene.style.removeProperty('--aim-y');
  });
}
addEventListener('scroll', queueCamera, {passive:true});
addEventListener('resize', queueCamera, {passive:true});

const castImages = [...document.querySelectorAll('img[data-cast]:not([data-cue-performer])')];
const visibleCast = new Set();
const mobileMotionQuery = matchMedia('(max-width: 760px)');
const heroBackflip = document.querySelector('.hero-backflip');
const dancefloorSection = document.querySelector('.night-party');
const dancefloorCue = dancefloorSection?.querySelector('.night-duo');
const shoreSequence = document.querySelector('.shore-sequence');
const daySection = shoreSequence.querySelector('#place');
const dayHeading = daySection.querySelector('#place-title');
if ('ResizeObserver' in window) {
  const updateShoreOverlap = () => {
    if (!mobileMotionQuery.matches) return;
    const bottom = dayHeading.getBoundingClientRect().bottom;
    const sceneTop = daySection.getBoundingClientRect().top;
    shoreSequence.style.setProperty('--shore-heading-end', `${Math.ceil(bottom - sceneTop)}px`);
  };
  const overlapObserver = new ResizeObserver(updateShoreOverlap);
  overlapObserver.observe(dayHeading);
  updateShoreOverlap();
}
let mobileDancefloorActive = false;

function updateMobileMotionCue() {
  const active = !mobileMotionQuery.matches || (
    dancefloorCue && dancefloorCue.getBoundingClientRect().top + dancefloorCue.offsetHeight * .25 <= window.innerHeight * .52
  );
  if (active === mobileDancefloorActive) return;
  mobileDancefloorActive = active;

  if (heroBackflip && visibleCast.has(heroBackflip)) {
    setCastSource(heroBackflip, motionAllowed());
  }
}

function handleScroll() {
  queueCamera();
  updateMobileMotionCue();
}

addEventListener('scroll', handleScroll, {passive:true});
const syncDancefloor = setUpDancefloor(dancefloorSection, motionAllowed);
const castObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const image = entry.target;
    if (entry.isIntersecting) visibleCast.add(image);
    else visibleCast.delete(image);
    setCastSource(image, entry.isIntersecting && motionAllowed());
  }
}, {rootMargin: '80px 0px', threshold: 0.01});

function castStill(image) {
  return image.dataset.still || `/assets/cast/${image.dataset.cast}-still.webp`;
}

function setCastSource(image, animate) {
  if (mobileMotionQuery.matches && image === heroBackflip) {
    animate = animate && !mobileDancefloorActive;
  }
  const source = animate ? (image.dataset.motionSrc || `/assets/cast/${image.dataset.cast}.webp`) : castStill(image);
  if (image.getAttribute('src') !== source) image.src = source;
}

for (const image of castImages) {
  image.dataset.still ||= castStill(image);
  if (!image.getAttribute('src')) image.src = castStill(image);
  castObserver.observe(image);
}

const partyGallery = document.querySelector('[data-party-gallery]');
if (partyGallery) {
  const track = partyGallery.querySelector('[data-party-track]');
  function movePartySlide(direction) {
    const count = track.children.length;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    const next = (index + direction + count) % count;
    const wraps = Math.abs(next - index) > 1;
    track.scrollTo({
      left:next * track.clientWidth,
      behavior:reducedMotion.matches || wraps ? 'instant' : 'smooth'
    });
  }
  for (const button of partyGallery.querySelectorAll('[data-party-step]')) {
    button.addEventListener('click', () => movePartySlide(Number(button.dataset.partyStep)));
  }
  track.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    movePartySlide(event.key === 'ArrowLeft' ? -1 : 1);
  });
}

const ambientVideos = [...document.querySelectorAll('video[data-hero-video], video[data-party-video]')];
function ambientSource(video) {
  return mobileMotionQuery.matches
    ? (video.dataset.mobile || video.dataset.desktop)
    : (video.dataset.desktop || video.dataset.mobile);
}
function updateAmbientVideo(video, visible) {
  const source = ambientSource(video);
  if (!motionAllowed() || !visible || !source) {
    video.pause();
    if (!video.hasAttribute('data-loaded')) {
      video.preload = 'none';
      video.removeAttribute('src');
      video.querySelectorAll('source[data-responsive-src]').forEach(node => node.removeAttribute('src'));
    }
    return;
  }
  if (video.dataset.activeSource !== source) {
    video.dataset.activeSource = source;
    video.src = source;
    video.dataset.loaded = 'true';
    video.preload = 'metadata';
    video.load();
  }
  video.play().catch(() => {});
}
const ambientVisibility = new Map();
function updateAmbientVisibility(entries) {
  for (const entry of entries) ambientVisibility.set(entry.target, entry.isIntersecting);
  syncAmbientMotion();
}
const ambientObserver = new IntersectionObserver(updateAmbientVisibility, {threshold:.01});
const partyObserver = new IntersectionObserver(updateAmbientVisibility, {rootMargin:'160px 0px'});
for (const video of ambientVideos) {
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = 'none';
  if (video.hasAttribute('data-party-video')) {
    video.addEventListener('playing', () => video.classList.add('has-played'));
    for (const event of ['error', 'emptied']) {
      video.addEventListener(event, () => video.classList.remove('has-played'));
    }
    partyObserver.observe(video);
  } else {
    ambientObserver.observe(video);
  }
}

function syncAmbientMotion() {
  document.body.classList.toggle('motion-paused', motionPaused);
  updateMobileMotionCue();
  syncDancefloor();
  if (motionAllowed()) queueCamera();
  else {
    previousScroll = window.scrollY;
    inkSlip = 0;
    for (const scene of activeScenes) {
      scene.style.setProperty('--ink-slip', '0');
      if (scene.hasAttribute('data-comic-drift')) scene.style.setProperty('--comic-drift', '0');
    }
  }
  for (const control of document.querySelectorAll('[data-motion-toggle]')) {
    control.setAttribute('aria-pressed', String(motionPaused));
    control.setAttribute('aria-label', motionPaused ? 'Включить движение' : 'Приостановить движение');
    const icon = control.querySelector('[data-motion-icon]');
    if (icon) icon.textContent = motionPaused ? '▶' : 'Ⅱ';
    const label = control.querySelector('[data-motion-label]');
    if (label) label.textContent = motionPaused ? 'Включить движение' : 'Приостановить движение';
  }
  for (const image of castImages) setCastSource(image, motionAllowed() && visibleCast.has(image));
  for (const video of ambientVideos) updateAmbientVideo(video, ambientVisibility.get(video) === true);
}

document.querySelectorAll('[data-motion-toggle]').forEach(control => control.addEventListener('click', () => {
  motionPaused = !motionPaused;
  syncAmbientMotion();
}));
reducedMotion.addEventListener('change', event => {
  motionPaused = event.matches || saveData;
  syncAmbientMotion();
});
document.addEventListener('visibilitychange', syncAmbientMotion);
window.addEventListener('resize', syncAmbientMotion, {passive: true});

function openDialog(dialog, trigger) {
  if (!dialog || dialog.open) return;
  openers.set(dialog, trigger);
  dialog.showModal();
  document.body.classList.add('modal-open');
  syncAmbientMotion();
}

for (const dialog of dialogs) {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    if (dialog === filmDialog) filmDialog.querySelector('video')?.pause();
    if (dialog === menuDialog) document.querySelector('.menu-button')?.setAttribute('aria-expanded', 'false');
    document.body.classList.toggle('modal-open', dialogs.some(item => item.open));
    const opener = openers.get(dialog);
    if (opener?.isConnected) opener.focus({preventScroll: true});
    syncAmbientMotion();
  });
}

document.querySelector('.menu-button')?.addEventListener('click', event => {
  openDialog(menuDialog, event.currentTarget);
  event.currentTarget.setAttribute('aria-expanded', 'true');
});
menuDialog?.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  menuDialog.close();
  const section = document.getElementById(link.hash.slice(1));
  if (section) {
    section.tabIndex = -1;
    requestAnimationFrame(() => section.focus({preventScroll: true}));
  }
});

document.addEventListener('click', event => {
  const book = event.target.closest('[data-book]');
  if (book) openBooking(book.dataset.book, book);

  const photo = event.target.closest('[data-photo]');
  if (photo && galleryDialog) {
    galleryIndex = galleryButtons.indexOf(photo);
    showPhoto(galleryIndex);
    openDialog(galleryDialog, photo);
  }

  const film = event.target.closest('[data-film]');
  if (film && filmDialog) {
    openDialog(filmDialog, film);
    const video = filmDialog.querySelector('video');
    const source = video?.querySelector('source[data-src]');
    if (source && !source.src) {
      source.src = source.dataset.src;
      video.load();
    }
    video?.play().catch(() => {});
  }
});

addEventListener('hashchange', canonicalizeLegacyLocation);
canonicalizeLegacyLocation();

function bookingStep(occasion = '') {
  if (!bookingDialog) return;
  bookingResult.hidden = true;
  bookingForm.hidden = !occasion;
  bookingChoices.hidden = Boolean(occasion);
  bookingDialog.querySelector('[data-booking-step]').textContent = occasion ? '02 / Несколько деталей' : '01 / Твой день';
  bookingDialog.querySelector('#booking-title').innerHTML = occasion ? 'Собираемся<br>в Wake4You' : 'Как проведём<br>этот день?';
  if (occasion) {
    bookingForm.elements.occasion.value = occasion;
    bookingDialog.querySelector('[data-change-occasion]').textContent = `← ${occasion} · изменить`;
  }
}
function openBooking(occasion, button) {
  if (!bookingForm) return;
  bookingStep(occasion);
  openDialog(bookingDialog, button);
}
document.querySelectorAll('[data-choose]').forEach(button => button.addEventListener('click', () => {
  bookingStep(button.dataset.choose);
  bookingForm?.elements.name.focus();
}));
document.querySelector('[data-change-occasion]')?.addEventListener('click', () => {
  bookingStep();
  bookingChoices?.querySelector('button')?.focus();
});
bookingForm?.addEventListener('submit', event => {
  event.preventDefault();
  const name = bookingForm.elements.name.value.trim();
  const contact = bookingForm.elements.contact.value.trim();
  bookingForm.elements.name.setCustomValidity(name ? '' : 'Напиши своё имя.');
  bookingForm.elements.contact.setCustomValidity(contact.length >= 5 ? '' : 'Оставь телефон или мессенджер.');
  if (!bookingForm.reportValidity()) return;
  bookingForm.hidden = true;
  bookingChoices.hidden = true;
  bookingResult.hidden = false;
  bookingDialog.querySelector('#booking-title').textContent = 'Начало положено.';
  bookingDialog.querySelector('[data-booking-step]').textContent = 'Твой план';
  bookingDialog.querySelector('[data-result]').textContent = `${name}, выбран формат «${bookingForm.elements.occasion.value}». В рабочем сайте команда получит эти пожелания и обсудит с тобой детали.`;
  bookingResult.querySelector('button')?.focus();
});
bookingForm?.addEventListener('input', event => event.target.setCustomValidity?.(''));
if (bookingForm?.elements.date) {
  const today = new Date();
  bookingForm.elements.date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function showPhoto(index) {
  if (!galleryButtons.length || !galleryDialog) return;
  galleryIndex = (index + galleryButtons.length) % galleryButtons.length;
  const item = galleryButtons[galleryIndex];
  const image = galleryDialog.querySelector('img');
  image.src = item.dataset.photo || item.querySelector('img')?.currentSrc || '';
  image.alt = item.querySelector('img')?.alt || item.dataset.caption || '';
  galleryDialog.querySelector('.photo-caption>p').textContent = item.dataset.caption || image.alt;
  galleryDialog.querySelector('[data-photo-count]').textContent = `${galleryIndex + 1} / ${galleryButtons.length}`;
}
galleryDialog?.querySelector('[data-photo-prev]')?.addEventListener('click', () => showPhoto(galleryIndex - 1));
galleryDialog?.querySelector('[data-photo-next]')?.addEventListener('click', () => showPhoto(galleryIndex + 1));
galleryDialog?.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(galleryIndex + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(galleryIndex - 1); }
});

syncAmbientMotion();
