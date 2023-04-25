function tabbed() {
  var labels = document.documentElement.getElementsByTagName('label');
  for (var i = 0; i < labels.length; i++) {
    var text = labels.item(i).textContent;
    if (text == ' ') {
      labels.item(i).style.display = 'none';
    }
  }

  var cache = {};
  var groups = {};
  Array.prototype.forEach.call(document.querySelectorAll('div.tabbed-set > input'), function(tab) {
    var id = tab.getAttribute('id');

    for (var i = 0; i < labels.length; i++) {
      if (labels.item(i).getAttribute('for') == id) {
        var label = labels.item(i).textContent;
      }
    }

    if (!cache.hasOwnProperty(label)) {
      cache[label] = [];
    }
    cache[label].push(tab);

    var name = tab.getAttribute('name');
    if (!groups.hasOwnProperty(name)) {
      groups[name] = [];
    }
    groups[name].push(label);
  });

  document.addEventListener('click', function(e) {
    var target = e ? e.target : window.event.target;

    var newId = target.getAttribute('id');

    for (var i = 0; i < labels.length; i++) {
      if (labels.item(i).getAttribute('for') == newId) {
        var newLabel = labels.item(i).textContent;
      }
    }

    if (typeof cache[newLabel] != 'undefined') {
      Array.prototype.forEach.call(Object.keys(cache), function(label) {
        if (newLabel === label) {
          Array.prototype.forEach.call(cache[label], function(tab) {
            if (!tab.checked) {
              tab.checked = true;
            }
          });
        } else {
          Array.prototype.forEach.call(cache[label], function(tab) {
            var name = tab.getAttribute('name');
            if (!groups[name].includes(label)) {
              if (tab.checked) {
                tab.checked = false;
              }
            }
          });
        }
      });
    }
  }, false);
}

document$.subscribe(tabbed);
