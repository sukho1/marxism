(function () {
  var data = null, loading = false;
  var box = document.getElementById('q');
  var hits = document.getElementById('hits');
  var btn = document.getElementById('menuBtn');
  var sidebar = document.getElementById('sidebar');
  var prefix = window.SITE_PREFIX || '';
  var themeBtn = document.getElementById('themeBtn');
  var rootEl = document.documentElement;
  function effTheme() {
    if (rootEl.classList.contains('dark')) return 'dark';
    return 'light'; // 默认亮色：暗色仅手动切换后记忆
  }
  function giscusTheme(t) {
    var f = document.querySelector('iframe.giscus-frame');
    if (!f) return;
    var url = (window.GISCUS_THEMES || {})[t] || t;
    try { f.contentWindow.postMessage({ giscus: { setConfig: { theme: url } } }, 'https://giscus.app'); } catch (e) {}
  }
  function setTheme(t, save) {
    rootEl.classList.toggle('dark', t === 'dark');
    rootEl.classList.toggle('light', t === 'light');
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
    giscusTheme(t);
  }
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  if (savedTheme === 'dark' || savedTheme === 'light') {
    setTheme(savedTheme, false);
  }
  var initialTheme = (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : effTheme();
  giscusTheme(initialTheme);
  setTimeout(function () { giscusTheme(initialTheme); }, 1800);
  // giscus iframe 懒加载：挂载/加载完成时补推当前主题，否则暗色下评论区停在亮色
  new MutationObserver(function () {
    var f = document.querySelector('iframe.giscus-frame');
    if (f && !f.dataset.themeBound) {
      f.dataset.themeBound = '1';
      f.addEventListener('load', function () {
        giscusTheme(effTheme());
        setTimeout(function () { giscusTheme(effTheme()); }, 600);
        setTimeout(function () { giscusTheme(effTheme()); }, 1600);
      });
    }
  }).observe(document.body, { childList: true, subtree: true });
  if (themeBtn) themeBtn.addEventListener('click', function () {
    setTheme(effTheme() === 'dark' ? 'light' : 'dark', true);
  });
  if (btn && sidebar) {
    btn.addEventListener('click', function () { sidebar.classList.toggle('open'); });
  }
  if (!box || !hits) return;

  function ensureData(cb) {
    if (data) return cb();
    if (loading) return setTimeout(function () { ensureData(cb); }, 120);
    loading = true;
    var s = document.createElement('script');
    s.src = prefix + 'search-data.js';
    s.onload = function () { data = window.SEARCH_DATA || []; cb(); };
    s.onerror = function () { loading = false; };
    document.body.appendChild(s);
  }

  box.addEventListener('focus', function () { ensureData(function () {}); });
  box.addEventListener('input', function () {
    ensureData(function () {
      var q = box.value.trim().toLowerCase();
      hits.innerHTML = '';
      if (!q) { hits.classList.remove('show'); return; }
      var n = 0;
      for (var i = 0; i < data.length && n < 30; i++) {
        var d = data[i];
        if (d.t.toLowerCase().indexOf(q) < 0 && d.x.toLowerCase().indexOf(q) < 0) continue;
        var a = document.createElement('a');
        a.href = prefix + d.u;
        var sm = document.createElement('small');
        sm.textContent = d.s;
        a.appendChild(sm);
        a.appendChild(document.createTextNode(d.t));
        hits.appendChild(a);
        n++;
      }
      if (n === 0) {
        var e = document.createElement('a');
        e.textContent = '没有匹配的文章';
        hits.appendChild(e);
      }
      hits.classList.add('show');
    });
  });
  document.addEventListener('click', function (ev) {
    if (ev.target !== box && !hits.contains(ev.target)) hits.classList.remove('show');
  });
})();
