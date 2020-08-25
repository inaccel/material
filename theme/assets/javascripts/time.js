function time() {
  function transform(src) {
    const content = document.querySelector('.md-content').textContent;

    const words = content.match(/\w+/g).length;

    const X = Math.floor(words / 150);

    switch (X) {
    case 0:
      return src.replace('{X}', 'less than a minute');
    case 1:
      return src.replace('{X}', '1 minute');
    default:
      return src.replace('{X}', [X, 'minutes'].join(' '));
    }
  }

  $('img[alt="time/embed"]').each(function() {
    const html = '<small>' + transform($(this).attr('src')) + '</small>';

    $(this).replaceWith(html);
  });
}

document.addEventListener('DOMContentLoaded', time);
document.addEventListener('DOMContentSwitch', time);
