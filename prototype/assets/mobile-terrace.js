const gallery = document.querySelector('[data-terrace-gallery]');

if (gallery) {
  const slides = [
    {
      src: '/assets/table.jpg',
      alt: 'Стол у панорамного окна с видом на воду'
    },
    {
      src: '/assets/venue.jpg',
      alt: 'Терраса парка с деревянным настилом и залом у воды'
    },
    {
      src: '/assets/deck-sun.jpg',
      alt: 'Дневная открытая терраса Wake4You'
    },
    {
      src: '/assets/hall.jpg',
      alt: 'Светлый зал с панорамными окнами у воды'
    }
  ];

  const image = gallery.querySelector('[data-terrace-image]');
  const count = gallery.querySelector('[data-terrace-count]');
  const frame = gallery.querySelector('.mobile-terrace-frame');
  let activeIndex = 0;
  let changeId = 0;

  function preload(index) {
    const nextImage = new Image();
    nextImage.src = slides[index].src;
  }

  async function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    const slide = slides[activeIndex];
    const thisChange = ++changeId;
    frame.classList.add('is-changing');
    count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;

    const nextImage = new Image();
    nextImage.src = slide.src;
    try {
      await nextImage.decode();
    } catch {
      // A failed image remains visible through its useful alt text.
    }
    if (thisChange !== changeId) return;

    image.src = slide.src;
    image.alt = slide.alt;
    frame.classList.remove('is-changing');
    preload((activeIndex + 1) % slides.length);
    preload((activeIndex + slides.length - 1) % slides.length);
  }

  gallery.querySelector('[data-terrace-prev]')?.addEventListener('click', () => showSlide(activeIndex - 1));
  gallery.querySelector('[data-terrace-next]')?.addEventListener('click', () => showSlide(activeIndex + 1));

  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(activeIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(activeIndex + 1);
    }
  });

  let touchStartX = null;
  gallery.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && !event.target.closest('button')) touchStartX = event.clientX;
  }, {passive:true});
  gallery.addEventListener('pointerup', event => {
    if (touchStartX === null) return;
    const distance = event.clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) < 48) return;
    showSlide(activeIndex + (distance < 0 ? 1 : -1));
  }, {passive:true});
  gallery.addEventListener('pointercancel', () => { touchStartX = null; }, {passive:true});

  if (matchMedia('(max-width:760px)').matches) preload(1);
}
