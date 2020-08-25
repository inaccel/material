function youtube() {
  function transform(src) {
    return 'https://youtube.com/embed/' + src
  }

  $('img[alt="youtube/embed"]').each(function() {
    const html = '<div style="padding-bottom: 50%; position: relative;"><iframe style="height: 100%; position: absolute; width: 100%;" src="' + transform($(this).attr('src')) + '" frameborder="0" allowfullscreen></iframe></div>';

    $(this).replaceWith(html);
  });
}

document.addEventListener('DOMContentLoaded', youtube);
document.addEventListener('DOMContentSwitch', youtube);
