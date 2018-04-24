/**** Slider ****/
;(function() {
  'use strict';

  slider('sliderMain');
  slider('sliderQuote');

  function slider(id) {
    var sliderMain = document.getElementById(id);

    if (!sliderMain) {
      return;
    }

    var items = sliderMain.querySelectorAll('.slider__item');
    var sliderControls = sliderMain.querySelector('.slider__controls');
    var controls = sliderControls.getElementsByClassName('slider__control');

    activateControl();

    sliderControls.addEventListener('click', changeSlider);

    /**********************/

    function activateControl() {
      var fragment = document.createDocumentFragment();
      var control = document.createElement('a');
      control.classList.add('slider__control');
      control.setAttribute('href', '#');

      for (var i = 0; i < items.length; i++) {
        var newControl = control.cloneNode(true);
        newControl.setAttribute('data-num', i);
        if (i === 0) {
          newControl.classList.add('slider__control--active');
        }
        fragment.appendChild(newControl);
      }

      sliderControls.innerHTML = '';
      sliderControls.appendChild(fragment);
    }

    function changeSlider(e) {
      e.preventDefault();
      var target = e.target; // где был клик?
      for (var i = 0; i < controls.length; i++) {
        controls[i].classList.remove('slider__control--active');
      }
      target.classList.add('slider__control--active');
      var newSlideNum = +target.getAttribute('data-num');
      changeSlide(newSlideNum);
    }

    function changeSlide(num) {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('slider__item--active');
        if (i === num) {
          items[i].classList.add('slider__item--active');
        }
      }
    }
  }

})();
