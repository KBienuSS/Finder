import { select } from './settings.js';
import Finder from './components/finder.js';

const app = {

  initAOS() {
    AOS.init({ // eslint-disable-line no-undef
      // Global settings:
      disable: false,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99,
      offset: 120,
      delay: 0,
      duration: 400,
      easing: 'ease',
      once: false,
      mirror: false,
      anchorPlacement: 'top-bottom',
    });
  },

  initPages(){
    const thisApp = app;

    thisApp.aboutContainer = document.querySelector('.about-us-link');
    thisApp.finderContainer = document.querySelector('.finder-link');
    thisApp.aboutMainContainer = document.querySelector('.about-us');
    thisApp.finderMainContainer = document.querySelector('.finder-wrapper');

    thisApp.aboutContainer.classList.add('active');
    thisApp.aboutMainContainer.classList.add('active');

    thisApp.aboutContainer.addEventListener('click', function(){
      event.preventDefault();
      if(thisApp.finderContainer.classList.contains('active')){
        thisApp.finderContainer.classList.remove('active');
        thisApp.finderMainContainer.classList.remove('active');
      }
      thisApp.aboutContainer.classList.add('active');
      thisApp.aboutMainContainer.classList.add('active');
    });

    thisApp.finderContainer.addEventListener('click', function(){
      event.preventDefault();
      if(thisApp.aboutContainer.classList.contains('active')){
        thisApp.aboutContainer.classList.remove('active');
        thisApp.aboutMainContainer.classList.remove('active');
      }
      thisApp.finderContainer.classList.add('active');
      thisApp.finderMainContainer.classList.add('active');
    });
  },

  initFinder(){
    const finderWrapper = document.querySelector(select.containerOf.finder);

    new Finder(finderWrapper);
  },

  init(){
    const thisApp = app;
    thisApp.initPages();
    thisApp.initAOS();
    thisApp.initFinder(); 
  },
};

app.init();