/**** Adaptive Menu ****/
;(function() {
  'use strict';

  var navToggler = document.getElementById('navToggler');
  var mainNav = document.getElementById('mainNav');

  if (!navToggler || !mainNav) { return };

  navToggler.addEventListener('click', function() {
    mainNav.classList.toggle('main-nav--opened');
    navToggler.querySelector('span').innerHTML = (mainNav.classList.contains('main-nav--opened')) ? 'Закрыть меню' : 'Открыть меню';
  });
})();
