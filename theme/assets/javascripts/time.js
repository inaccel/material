function time() {
  var element = document.getElementById('time');

  if (!Object.is(element, null)) {
    const content = document.getElementsByClassName('md-content')[0].textContent;

    const words = content.match(/\w+/g).length;

    const X = Math.floor(words / 150);

    switch (X) {
    case 0:
      element.textContent = 'Estimated reading time: less than a minute';
      break;
    case 1:
      element.textContent = 'Estimated reading time: 1 minute';
      break;
    default:
      element.textContent = ['Estimated reading time:', X, 'minutes'].join(' ');
    }
  }
}

document.addEventListener('DOMContentLoaded', time);
document.addEventListener('DOMContentSwitch', time);
