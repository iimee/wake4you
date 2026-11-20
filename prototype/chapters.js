const photo = (file, caption, className = '') => `<button class="ch-photo ${className}" data-photo="/assets/${file}" data-caption="${caption}"><img src="/assets/${file}" alt="${caption}" loading="lazy"><span>${caption}</span></button>`;
const next = (title, href, image) => `<a class="ch-next" href="${href}" data-route><img src="/assets/${image}" alt="" loading="lazy"><strong>${title}</strong><span>Дальше ↗</span></a>`;
const book = (occasion, label) => `<button class="ink-button" data-book="${occasion}">${label} <span aria-hidden="true">↗</span></button>`;
const banner = (kicker, title, image, alt, className = '') => `<section class="ch-banner ${className}"><img src="/assets/${image}" alt="${alt}" fetchpriority="high"><div><p class="eyeline">${kicker}</p><h1>${title}</h1><button class="paper-button ch-film" data-film>Смотреть фильм о парке <span aria-hidden="true">▶</span></button></div></section>`;
const intro = (eyeline, title, copy) => `<section class="ch-intro wrap"><p class="eyeline">${eyeline}</p><h2>${title}</h2>${copy ? `<p>${copy}</p>` : ''}</section>`;
const experience = (id, label, tabs, panelId, image, title, copy, tags, buttonLabel, occasion) => `<section class="ch-experience wrap" data-selector="${id}"><div class="ch-tabs" role="tablist" aria-label="${label}">${tabs.map(([key, text], i) => `<button id="${id}-${key}" role="tab" aria-selected="${i === 0}" aria-controls="${panelId}" tabindex="${i === 0 ? 0 : -1}" data-tab="${key}">${text}</button>`).join('')}</div><div class="ch-panel" id="${panelId}" role="tabpanel" aria-labelledby="${id}-${tabs[0][0]}"><img data-panel-image src="/assets/${image}" alt="" loading="lazy"><div><p class="eyeline" data-panel-label>${tabs[0][1]}</p><h2 data-panel-title>${title}</h2><p data-panel-copy>${copy}</p><div class="ch-tags" data-panel-tags>${tags.map(tag => `<span>${tag}</span>`).join('')}</div><button class="ink-button" data-panel-book data-book="${occasion}">${buttonLabel}</button></div></div></section>`;

const place = () => `${banner('Лыткарино · Волкушинский карьер', 'Хорошо<br>быть <em>здесь.</em>', 'place-poster.jpg', 'Терраса, берег и парк Wake4You')} ${intro('Лес. Вода. Свои люди.', 'Выйти из города.<br>Остаться у воды.', 'Террасы в окружении леса и берег, где можно провести весь день. Посмотри, как выглядит Wake4You.')}
  <section class="ch-gallery wrap"><h2>У каждого свой любимый угол.</h2><div class="ch-photo-grid">${photo('deck-sun.jpg','Долгий обед на террасе','ch-photo-wide')}${photo('lake.jpg','Берег и вода')}${photo('hall.jpg','Пространство для компании')}${photo('lounge.jpg','Время выдохнуть')}${photo('deck-night.jpg','Вечерний свет','ch-photo-wide')}</div></section>
  <section class="ch-quote wrap"><p>Днём — вода и долгие обеды.<br>Вечером — музыка.</p>${book('День у воды','Запланировать день')}</section>${next('Собрать своих','/events','party-wide.jpg')}`;

const events = () => `<section class="ch-banner ch-banner-night ch-event-hero" data-stage><img class="ch-event-photo" src="/assets/party-wide.jpg" alt="Гости на вечеринке в Wake4You" fetchpriority="high"><div class="ch-event-copy"><p class="eyeline">Собрать своих · Лыткарино</p><h1>Вечеринка<br><em>у воды.</em></h1><button class="paper-button ch-film" data-film>Смотреть фильм о парке <span aria-hidden="true">▶</span></button></div><button type="button" class="ch-perform" data-perform aria-label="Повторить анимацию диджея">↻</button><img class="ch-performer ch-dj" data-cast="dj" src="/assets/cast/dj-still.webp" alt="DJ у пульта в комиксном стиле"></section> ${intro('Твой повод · Наше место', 'Потанцевать.<br>Отметить своё.', 'Вечеринка, день рождения или корпоратив у воды. Выбери повод — обсудим пространство, кухню и программу.')}
  ${experience('events','Повод для встречи',[['party','Вечеринка'],['corporate','Корпоратив'],['birthday','День рождения']],'event-panel','party-wide.jpg','Свои люди.<br>Любимая музыка.','Собраться на берегу, поужинать и остаться танцевать.',['Терраса','Музыка','Кухня'],'Обсудить событие','Вечеринка')}
  <section class="ch-details wrap"><h2>Соберём по вашим правилам.</h2><div><details><summary>Пространство</summary><p>Подберём террасу или зал после обсуждения даты, числа гостей и формата.</p></details><details><summary>Еда</summary><p>Обсудим гриль, фуршет или общий стол для вашей компании.</p></details><details><summary>Программа</summary><p>Музыка, отдых у воды, вейк или SUP. Уточним, что доступно в выбранную дату.</p></details></div></section>
  <section class="ch-gallery wrap"><h2>Моменты вместе.</h2><div class="ch-photo-grid ch-three">${photo('source/5345959885578904933.jpg','Танцы после заката')}${photo('sup-group.jpg','Своей компанией на воду')}${photo('table.jpg','За одним столом')}</div></section>${next('С хорошего стола.','/kitchen','food-detail.jpg')}`;

const kitchen = () => `${banner('Открытый огонь · Открытый воздух', 'Вкусно.<br><em>Без спешки.</em>', 'bbq-close.jpg', 'Еда готовится на открытом огне')} ${intro('Кухня Wake4You', 'Сначала на огне.<br>Потом на стол.', 'Гриль, закуски и большой стол для вашей компании. Меню и стоимость обсудим при планировании визита.')}
  ${experience('kitchen','Формат меню',[['fire','На огне'],['buffet','Фуршет'],['table','За столом']],'food-panel','food.jpg','Дым. Жар.<br>Общий стол.','BBQ и блюда с огня для долгого обеда на открытом воздухе.',['Гриль','BBQ'],'Обсудить меню','Кухня')}
  <section class="ch-gallery wrap"><h2>Подача к вашему поводу.</h2><div class="ch-photo-grid ch-four">${photo('food-detail.jpg','Закуски для компании')}${photo('canapes.jpg','Фуршет')}${photo('bbq-close.jpg','С огня на стол')}${photo('source/5463221920212917025.jpg','Свежие блюда')}</div></section>${next('А после — на воду.','/water','sup-water.jpg')}`;

const water = () => `<section class="ch-water water-cover" data-stage>
  <div class="wrap water-cover-grid"><div class="ch-water-copy">
    <p class="eyeline">Вейк и SUP · Волкушинский карьер</p><h1>Пора <br><em>на воду.</em></h1>
    <p>Первый старт или ещё один любимый трюк. Выбери движение райдера.</p>
    <div class="ch-rider-picker" role="group" aria-label="Выбрать анимацию райдера">
      <button type="button" aria-pressed="true" data-rider="carve">Скользить</button>
      <button type="button" aria-pressed="false" data-rider="backflip">Сальто</button>
      <button type="button" aria-pressed="false" data-rider="trick">Трюк</button>
    </div><button class="ink-button" data-book="Вейк">Хочу на вейк</button>
  </div><div class="water-frame"><img class="water-background" src="/assets/wake-water.jpg" alt="Вид на лес и воду с площадки парка">
    <img class="water-rider" data-cast="carve" src="/assets/cast/carve-still.webp" alt="Вейкбордист скользит по воде">
    <button type="button" class="replay" data-perform aria-label="Повторить анимацию райдера">↻</button>
  </div></div></section>
  <section class="ch-sup wrap"><img src="/assets/sup-water.jpg" alt="Компания на SUP-досках у причала" loading="lazy"><div><p class="eyeline">SUP</p><h2>Просто плыть.</h2><p>Спокойная прогулка по карьеру в своём темпе.</p>${book('SUP','Записаться на SUP')}</div></section>
  <section class="ch-details wrap"><h2>Перед поездкой</h2><div><details><summary>Можно приехать впервые?</summary><p>При записи скажите, что это ваш первый раз. Команда парка уточнит условия вводного занятия.</p></details><details><summary>Нужно своё оборудование?</summary><p>Перед поездкой уточните доступные размеры, состав комплекта и стоимость аренды.</p></details><details><summary>Как узнать цену и время?</summary><p>Выберите вейк или SUP при записи. Тариф и свободное время нужно подтвердить у команды парка.</p></details></div></section>
  ${next('До встречи на берегу.','/visit','lake.jpg')}`;
const visit = () => `${banner('Лыткарино · Волкушинский карьер', 'До встречи<br><em>у воды.</em>', 'source/5345959885578904946.jpg', 'Дорожка к парку')} ${intro('Как нас найти', 'Wake4You.<br>Волкушинский карьер.', 'Построй маршрут до парка в Яндекс.Картах. Точную точку въезда и парковки уточни перед поездкой.')}
  <section class="ch-map wrap"><div><p class="eyeline">Лыткарино · Московская область</p><h2>Открыть маршрут.</h2><a class="ink-button" href="https://yandex.ru/maps/?text=Wake4You%20%D0%9B%D1%8B%D1%82%D0%BA%D0%B0%D1%80%D0%B8%D0%BD%D0%BE" target="_blank" rel="noopener noreferrer">Яндекс.Карты ↗</a><p>Свяжись с парком перед выездом, чтобы уточнить въезд и парковку.</p></div><button class="ch-photo ch-map-photo" data-photo="/assets/lake.jpg" data-caption="Волкушинский карьер"><img src="/assets/lake.jpg" alt="Причал на Волкушинском карьере" loading="lazy"></button></section>
  <section class="ch-quote wrap"><p>День начинается<br>с приглашения.</p>${book('','Запланировать день')}</section>`;

export const chapters = {
 '/place': {title:'Место — Wake4You',description:'Берег, террасы и фотографии Wake4You в Лыткарино.',render:place},
 '/events': {title:'Вечеринки — Wake4You',description:'Вечеринки, дни рождения и корпоративы у воды.',render:events},
 '/kitchen': {title:'Кухня — Wake4You',description:'Гриль и общий стол для вашей компании в Wake4You.',render:kitchen},
 '/water': {title:'Вейк и SUP — Wake4You',description:'Выбери вейк или SUP на Волкушинском карьере.',render:water},
 '/visit': {title:'Как добраться — Wake4You',description:'Адрес парка Wake4You и маршрут в Яндекс.Картах.',render:visit}
};

export const selections = {
 events:{
  party:{label:'Вечеринка',title:'Свои люди.<br>Любимая музыка.',copy:'Собраться на берегу, поужинать и остаться танцевать.',tags:['Терраса','Музыка','Кухня'],image:'party-wide.jpg',alt:'Вечеринка на открытой площадке',book:'Вечеринка'},
  corporate:{label:'Корпоратив',title:'Одна команда.<br>Целый день вместе.',copy:'Встретиться вне рабочих чатов. Вода, большой стол и вечер для команды.',tags:['Зал и терраса','Общий стол','Активности'],image:'hall.jpg',alt:'Зал с видом на воду',book:'Корпоратив'},
  birthday:{label:'День рождения',title:'Твой день.<br>Твои правила.',copy:'Позови тех, с кем хочется разделить этот день.',tags:['Своя компания','Праздничный стол','Вид на воду'],image:'table.jpg',alt:'Стол у окна',book:'День рождения'}
 },
 kitchen:{
  fire:{label:'На огне',title:'Дым. Жар.<br>Правильный момент.',copy:'Гриль и BBQ для долгого обеда на открытом воздухе.',tags:['Гриль','BBQ'],image:'food.jpg',alt:'Мясо на открытом гриле',book:'Кухня'},
  buffet:{label:'Фуршет',title:'Маленькие закуски.<br>Большой повод.',copy:'Соберём пожелания по меню и формату подачи.',tags:['Закуски','Фуршет'],image:'food-detail.jpg',alt:'Закуски для фуршета',book:'Кухня'},
  table:{label:'За столом',title:'Есть о чём<br>поговорить.',copy:'Собраться за общим столом с видом на воду.',tags:['Общий стол','Событие'],image:'table.jpg',alt:'Стол с видом на воду',book:'Кухня'}
 }
};

export function bindChapters(main) {
 const section=main.querySelector('.ch-water');
 if(!section)return;
 const image=section.querySelector('[data-cast]'),buttons=[...section.querySelectorAll('[data-rider]')];
 const names={carve:'Вейкбордист скользит по волне в граффити-стиле',backflip:'Вейкбордист выполняет сальто над водой в граффити-стиле',trick:'Вейкбордист делает трюк на доске в граффити-стиле'};
 buttons.forEach(button=>button.addEventListener('click',()=>{
  const cast=button.dataset.rider;
  image.src=`/assets/cast/${cast}-still.webp`;image.dataset.cast=cast;image.alt=names[cast];
  buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  image.dispatchEvent(new CustomEvent('castchange',{bubbles:true,detail:{cast}}));
 }));
}




