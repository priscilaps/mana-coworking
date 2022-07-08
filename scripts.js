window.addEventListener('scroll', onScroll);

function onScroll() {
  showNavOnScroll();
  backToTopOnScroll();
  activateMenuAtCurrentSection(home);
  activateMenuAtCurrentSection(services);
  activateMenuAtCurrentSection(about);
  activateMenuAtCurrentSection(contact);
}

function activateMenuAtCurrentSection(section) {
  const targetLine = scrollY + innerHeight / 2;
  const sectionTop = section.offsetTop;
  const sectionHeight = section.offsetHeight;

  const sectionStartReachOrPassedTargeLine = targetLine >= sectionTop;
  const sectionEndPassedTargetLine = sectionTop + sectionHeight <= targetLine;

  const sectionId = section.getAttribute('id');
  const currentMenu = document.querySelector(`nav a[href*=${sectionId}]`);

  currentMenu.classList.remove('active');
  if (sectionStartReachOrPassedTargeLine && !sectionEndPassedTargetLine) {
    currentMenu.classList.add('active');
  }
}

function showNavOnScroll() {
  if (scrollY > 0) {
    navigation.classList.add('scroll');
  } else {
    navigation.classList.remove('scroll');
  }
}

function backToTopOnScroll() {
  if (scrollY > 550) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
}

function openMenu() {
  document.querySelector('body').classList.add('menu-expanded');
}

function closeMenu() {
  document.querySelector('body').classList.remove('menu-expanded');
}

ScrollReveal({
  origin: 'top',
  distance: '50px',
}).reveal(`
  #home,
  #home img,
  #home .stats,
  #services,
  #services .card,
  #about,
  #about img,
  #contact,
  #contact col-A,
  #contact iframe,
  #contact img
`);
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}
//-------------SLIDER-BEGIN----------------//
let index = 0;
function setSlider() {
  let slidesContainer,
    posX1 = 0,
    posX2 = 0,
    posInitial,
    posFinal,
    threshold = 100,
    slideSize,
    slidesLength,
    direction,
    allowShift = true,
    root,
    bullets = document.querySelectorAll('.bullets ul li a');

  const slider = document.querySelector('.slider');
  // Touch events
  slider.addEventListener('touchstart', dragStart);
  slider.addEventListener('mousedown', dragStart);
  slider.addEventListener('touchend', dragEnd);
  slider.addEventListener('touchmove', dragAction);

  // Mouse events
  slider.onmousedown = dragStart;
  // Transition events
  slider.addEventListener('transitionend', checkIndex);
  // Click events
  slider.querySelector('.prev').addEventListener('click', function () {
    shiftSlide(-1);
  });
  slider.querySelector('.next').addEventListener('click', function () {
    shiftSlide(1);
  });

  root = document.documentElement;
  root.style.setProperty('--scrollbar-width', getScrollbarWidth() + 'px');

  slidesContainer = slider.getElementsByClassName('slides');
  let slides = slider.getElementsByClassName('slide');
  slidesLength = slides.length;
  let firstSlide = slides[0],
    lastSlide = slides[slidesLength - 1],
    cloneFirst = firstSlide.cloneNode(true),
    cloneLast = lastSlide.cloneNode(true);

  // Clone first and last slide
  if (!slider.classList.contains('loaded')) {
    slideSize = slider.getElementsByClassName('slide')[0].offsetWidth;
    slidesContainer[0].appendChild(cloneFirst);
    slidesContainer[0].insertBefore(cloneLast, firstSlide);
    slider.classList.add('loaded');
    slidesLength = slides.length;
    slidesContainer[0].style.setProperty(
      'width',
      slideSize * slidesLength + 'px',
    );
    slidesContainer[0].style.left = -(1 * slideSize) + 'px';
    index = 1; // posiciona o primeiro slider de volta no começo (ele ia pro clone do ultimo apos clonar)
  }
  function dragStart(e) {
    e = e || window.event;
    e.preventDefault();
    posInitial = slidesContainer[0].offsetLeft;
    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }
  function dragEnd(e) {
    posFinal = slidesContainer[0].offsetLeft;
    if (posFinal - posInitial < -threshold) {
      shiftSlide(1, 'drag');
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(-1, 'drag');
    } else {
      slidesContainer[0].style.left = posInitial + 'px';
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }
  function dragAction(e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    slidesContainer[0].style.left =
      slidesContainer[0].offsetLeft - posX2 + 'px';
  }

  function shiftSlide(dir, action) {
    slidesContainer[0].classList.add('shifting');
    bullets[index - 1].classList.remove('active');

    if (allowShift) {
      if (!action) {
        posInitial = slidesContainer[0].offsetLeft;
      }

      if (dir == 1) {
        direction = 1;
        slidesContainer[0].style.left = posInitial - slideSize + 'px';
        index++;
      } else if (dir == -1) {
        direction = -1;
        slidesContainer[0].style.left = posInitial + slideSize + 'px';
        index--;
      }
    }

    allowShift = false;
  }
  function checkIndex() {
    slidesContainer[0].classList.remove('shifting');

    if (index == 0) {
      slidesContainer[0].style.left = -((slidesLength - 2) * slideSize) + 'px'; // - 2 clones na qtd de slides
      index = slidesLength - 1;
    } else if (index == slidesLength - 1) {
      if (direction != -1) {
        slidesContainer[0].style.left = -(1 * slideSize) + 'px';
        index = 1;
      } else {
        slidesContainer[0].style.left =
          -((slidesLength - 2) * slideSize) + 'px';
        index = slidesLength - 2;
      }
    }
    allowShift = true;
    if (bullets[index - 1]) bullets[index - 1].classList.add('active');
  }
  return { slidesContainer, slideSize, bullets };
}
let sliderInfo = setSlider();
function goToSlide(slide) {
  sliderInfo.slidesContainer[0].classList.add('shifting');
  sliderInfo.bullets.forEach((bullet) => {
    if (bullet.classList.contains('active')) bullet.classList.remove('active');
  });

  index = slide + 1;
  sliderInfo.slidesContainer[0].style.left =
    -(index * sliderInfo.slideSize) + 'px';
}

//-------------SLIDER-END----------------//
