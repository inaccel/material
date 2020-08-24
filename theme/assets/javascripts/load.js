document.addEventListener('DOMContentLoaded', function () {
  $('#load').fadeOut('fast', 'linear');
});

document.addEventListener('DOMContentSwitch', function () {
  $('#load').fadeOut('fast', 'linear');
});

window.onload = function() {
  document.addEventListener("DOMSubtreeModified", function(event) {
    if (Object.is(event.target, document.querySelector('title'))) {
      $('#load').show();
    }
  });
};
