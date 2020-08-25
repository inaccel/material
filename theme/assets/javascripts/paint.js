if (localStorage.getItem('data-md-color-scheme') === 'slate') {
  $('body').attr('data-md-color-scheme', 'slate');

  $('#paint').prop('checked', true);
} else {
  $('body').attr('data-md-color-scheme', 'default');

  $('#paint').prop('checked', false);
}

$('#paint').on('click', function() {
  if ($('#paint').prop('checked')) {
    $('body').attr('data-md-color-scheme', 'slate');

    localStorage.setItem('data-md-color-scheme', 'slate');
  } else {
    $('body').attr('data-md-color-scheme', 'default');

    localStorage.setItem('data-md-color-scheme', 'default');
  }
});
