import { chapters } from './chapters.js';
export { selections } from './chapters.js';

const moods = {
  party: { heading: 'Все свои<br><em>на берегу.</em>', copy: 'Днём — гриль и терраса у воды. После заката — музыка, танцы и свои люди.', image: 'lake.jpg', alt: 'Волкушинский карьер и причал среди деревьев', cast: 'trio', character: 'Танцующая компания', link: '/events', action: 'Собрать своих' },
  food: { heading: 'Встречаемся<br><em>за столом.</em>', copy: 'Гриль на открытом огне, закуски и обед с видом на воду.', image: 'bbq-close.jpg', alt: 'Мясо на открытом гриле', link: '/kitchen', action: 'Посмотреть кухню' },
  water: { heading: 'Поймали<br><em>волну.</em>', copy: 'Первые метры на вейке, любимый трюк или тихая прогулка на SUP.', image: 'wake-water.jpg', alt: 'Вода и лес на Волкушинском карьере', cast: 'carve', character: 'Вейкбордист скользит по воде', link: '/water', action: 'Выйти на воду' }
};
const replay = '<button type="button" class="replay" data-perform aria-label="Повторить анимацию" title="Повторить анимацию"><span aria-hidden="true">↻</span></button>';

function poster() {
  const mood = moods.party;
  return `<section id="dance-motion" class="summer-poster" data-stage data-mood="party" aria-label="Летний клуб Wake4You">
    <div class="poster-halftone" aria-hidden="true"></div>
    <div class="wrap poster-grid">
      <div class="poster-copy">
        <p class="eyeline location-line"><i aria-hidden="true"></i> Лыткарино · Московская область</p>
        <h1 data-headline>${mood.heading}</h1>
        <p class="poster-deck" data-deck>${mood.copy}</p>
        <div class="poster-actions"><a class="ink-button" href="${mood.link}" data-route data-mood-link>${mood.action}</a><button class="film-link" data-film><i aria-hidden="true">▶</i> Фильм о парке</button></div>
      </div>
      <div class="poster-art">
        <div class="sun-cut" aria-hidden="true"></div>
        <div class="postcard"><img src="/assets/${mood.image}" data-postcard alt="${mood.alt}" fetchpriority="high"></div>
        <div class="art-shadow" aria-hidden="true"></div>
        <img class="headliner" data-headliner data-cast="${mood.cast}" src="/assets/cast/trio-still.webp" alt="${mood.character}" fetchpriority="high">
        <i class="ink-marks" aria-hidden="true"></i>
        ${replay}
      </div>
    </div>
    <div class="poster-edge wrap"><div class="mood-picker" role="group" aria-label="Выбрать настроение"><button data-hero-choice="party" aria-pressed="true">Танцпол</button><button data-hero-choice="food" aria-pressed="false">Кухня</button><button data-hero-choice="water" aria-pressed="false">На воду</button></div><a href="/visit" data-route class="where">Волкушинский карьер <span aria-hidden="true">⌖</span></a></div>
  </section>`;
}
const photoStory = (url,src,alt,label,title) => `<a data-route href="${url}" class="photo-story"><div class="story-image"><img src="/assets/${src}" alt="${alt}" loading="lazy"></div><div class="story-caption"><span>${label}</span><h3>${title}</h3></div></a>`;

function home() {
  return poster() + `<section id="place-stories" class="shore-stories wrap">
    <div class="spread-heading"><div><p class="eyeline"><b aria-hidden="true">✳</b> Из жизни парка</p><h2>Берег в кадре<span>.</span></h2></div><a href="/place" data-route class="under-link">Весь парк</a></div>
    <div class="story-spread">
      ${photoStory('/place','deck-sun.jpg','Открытая деревянная терраса у панорамного зала','Место','На террасе')}
      ${photoStory('/kitchen','bbq-close.jpg','Мясо на решётке, над открытым огнём','Кухня','С открытого огня')}
      ${photoStory('/events','party-wide.jpg','Люди на вечеринке под тентами','События','После заката')}
    </div>
  </section>
  <section class="gather" data-stage><div class="wrap gather-grid"><div class="gather-copy"><p class="eyeline">Вечеринки и корпоративы</p><h2>Встречаемся<br>у воды<span>!</span></h2><p>Терраса или зал, музыка и большой стол. Выберите повод, а детали обсудим под вашу компанию.</p><button class="ink-button" data-book="">Запланировать событие</button></div><div class="gather-art"><img src="/assets/party-wide.jpg" class="gather-photo" loading="lazy" alt="Вечер на площадке парка"><img data-cast="duo" src="/assets/cast/duo-still.webp" class="gather-cast" loading="lazy" alt="Танцующая пара">${replay}</div></div></section>
  <section class="water-invite wrap" id="wake-motion"><img src="/assets/sup-group.jpg" loading="lazy" alt="Компания с SUP-досками у берега"><div><p class="eyeline">Вейк и SUP</p><h2>Пока светло.</h2><p>Прокатиться до ужина или провести день на воде.</p><a class="under-link" href="/water" data-route>Выбрать катание</a></div></section>`;
}

export const pages = { '/': { title: 'Wake4You — все свои на берегу', description: 'Вечеринки, корпоративы, кухня, вейк и SUP на Волкушинском карьере.', render: home }, ...chapters };

export function bindHome(main) {
  const stage = main.querySelector('.summer-poster');
  if (!stage) return;
  for (const button of stage.querySelectorAll('[data-hero-choice]')) {
    button.addEventListener('click', () => {
      const key = button.dataset.heroChoice;
      if (stage.dataset.mood === key) return;
      const mood = moods[key];
      stage.dataset.mood = key;
      stage.querySelector('[data-headline]').innerHTML = mood.heading;
      stage.querySelector('[data-deck]').textContent = mood.copy;
      const link = stage.querySelector('[data-mood-link]');
      link.href = mood.link;
      link.textContent = mood.action;
      const shot = stage.querySelector('[data-postcard]');
      shot.src = '/assets/' + mood.image;
      shot.alt = mood.alt;
      const cast = stage.querySelector('[data-headliner]');
      cast.hidden = !mood.cast;
      stage.querySelector('[data-perform]').hidden = !mood.cast;
      if (mood.cast) {
        cast.dataset.cast = mood.cast;
        cast.src = '/assets/cast/' + mood.cast + '-still.webp';
        cast.alt = mood.character;
      } else {
        delete cast.dataset.cast;
      }
      for (const choice of stage.querySelectorAll('[data-hero-choice]')) {
        choice.setAttribute('aria-pressed', String(choice === button));
      }
      cast.dispatchEvent(new CustomEvent('castchange', { bubbles: true }));
    });
  }
}


