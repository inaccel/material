function youtube() {
  $('img[alt="youtube/embed"]').each(function() {
    const src = $(this).attr('src');

    const video = '<div class="md-youtube"><iframe class="md-youtube__video" src="https://youtube.com/embed/' + src + '" frameborder="0" allowfullscreen></iframe></div>';

    $(this).replaceWith(video);
  });
}

document.addEventListener('DOMContentLoaded', youtube);
document.addEventListener('DOMContentSwitch', youtube);
