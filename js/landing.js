/* Landing institucional Meat Azores: cabeçalho, menu mobile, animações subtis e formulário. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var body = document.body;
  body.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabeçalho: transparente sobre o hero, sólido depois; esconde ao descer (mobile) ---------- */
  var header = document.querySelector('[data-lp-header]');
  var hero = document.querySelector('[data-lp-hero]');
  if (header && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-solid', !entries[0].isIntersecting);
    }, { rootMargin: '-72px 0px 0px 0px' }).observe(hero);
  } else if (header) {
    header.classList.add('is-solid');
  }

  var lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    var mobile = window.innerWidth < 1024;
    if (header) header.classList.toggle('is-hidden', mobile && y > lastY && y > 240);
    lastY = y;
  }, { passive: true });

  /* ---------- Menu mobile em ecrã inteiro ---------- */
  var menu = document.querySelector('[data-lp-menu]');
  var openBtn = document.querySelector('[data-lp-menu-open]');
  var closeBtn = document.querySelector('[data-lp-menu-close]');

  function focusables() {
    return menu.querySelectorAll('a[href], button:not([disabled])');
  }
  function openMenu() {
    menu.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    doc.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeMenu(returnFocus) {
    menu.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    doc.style.overflow = '';
    if (returnFocus) openBtn.focus();
  }
  if (menu && openBtn && closeBtn) {
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', function () { closeMenu(true); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (menu.hidden) return;
      if (e.key === 'Escape') closeMenu(true);
      if (e.key === 'Tab') {
        var f = focusables();
        var first = f[0];
        var last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && !menu.hidden) closeMenu(false);
    });
  }

  /* ---------- Entrada suave das imagens e blocos ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Animações ligadas ao scroll ----------
     Um único listener passivo + requestAnimationFrame. Só se calculam os elementos
     visíveis (IntersectionObserver) e só se mexe em transform, opacity e variáveis CSS,
     para não forçar layout. Com prefers-reduced-motion nada disto corre. */
  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var bar = document.querySelector('[data-lp-progress]');
  var heroContent = document.querySelector('[data-lp-hero-content]');
  var flow = document.querySelector('[data-lp-flow]');
  var flowList = flow && flow.querySelector('.lp-flow__list');
  var flowSteps = flow ? flow.querySelectorAll('[data-step]') : [];
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var progressEls = Array.prototype.slice.call(document.querySelectorAll('[data-progress]'));
  var visible = new Set();

  if (!reduceMotion) {
    body.classList.add('lp-motion');

    if ('IntersectionObserver' in window) {
      var watch = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
        });
        requestTick();
      }, { rootMargin: '20% 0px 20% 0px' });
      parallaxEls.concat(progressEls).forEach(function (el) { watch.observe(el); });
      if (flow) watch.observe(flow);
    } else {
      parallaxEls.concat(progressEls).forEach(function (el) { visible.add(el); });
      if (flow) visible.add(flow);
    }

    var ticking = false;
    var frame = function () {
      ticking = false;
      var vh = window.innerHeight;
      var y = window.scrollY;
      var small = window.innerWidth < 600 ? 0.5 : 1;

      // Barra fina de progresso de leitura, por baixo do cabeçalho.
      if (bar) {
        var max = doc.scrollHeight - vh;
        bar.style.transform = 'scaleX(' + (max > 0 ? clamp01(y / max) : 0).toFixed(4) + ')';
      }

      // Hero: o texto afasta-se suavemente ao descer.
      if (heroContent && y < vh * 1.2) {
        var h = clamp01(y / (vh * 0.75));
        heroContent.style.opacity = (1 - h * 0.9).toFixed(3);
        heroContent.style.transform = 'translate3d(0,' + (-h * 48).toFixed(1) + 'px,0)';
      }

      visible.forEach(function (el) {
        var r = el.getBoundingClientRect();

        if (el.hasAttribute('data-parallax')) {
          var f = parseFloat(el.getAttribute('data-parallax')) * small;
          var offset = -((r.top + r.height / 2) - vh / 2) * f;
          el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
        }

        if (el.hasAttribute('data-progress')) {
          // 0 quando o topo entra pelo fundo do ecrã, 1 quando chega a 25% do topo.
          el.style.setProperty('--p', clamp01((vh - r.top) / (vh * 0.75)).toFixed(3));
        }

        if (el === flow) {
          var p = clamp01((vh * 0.85 - r.top) / (r.height + vh * 0.35));
          flowList.style.setProperty('--lp-progress', p.toFixed(3));
          var n = flowSteps.length;
          flowSteps.forEach(function (step, i) {
            step.classList.toggle('is-on', p >= (n > 1 ? i / (n - 1) : 0) * 0.92 + 0.02);
          });
        }
      });
    };
    var requestTick = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(frame); }
    };
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    requestTick();
  }

  /* ---------- CTAs que pré-selecionam o motivo do contacto ---------- */
  var form = document.querySelector('[data-lp-form]');
  var motivo = form && form.querySelector('[name="motivo"]');
  document.querySelectorAll('a[data-motivo]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('data-motivo');
      if (motivo && v) motivo.value = v;
    });
  });

  /* ---------- Formulário de contacto ---------- */
  if (form) {
    var msgs = {};
    try { msgs = JSON.parse(form.getAttribute('data-msgs') || '{}'); } catch (e) { msgs = {}; }
    var status = form.querySelector('.lp-form__status');
    var submit = form.querySelector('[type="submit"]');
    var fields = {
      nome: form.querySelector('[name="nome"]'),
      email: form.querySelector('[name="email"]'),
      motivo: motivo,
      mensagem: form.querySelector('[name="mensagem"]'),
    };

    var setError = function (el, text) {
      var err = document.getElementById(el.id + '-err');
      el.setAttribute('aria-invalid', text ? 'true' : 'false');
      if (err) err.textContent = text || '';
    };

    var validate = function () {
      var firstInvalid = null;
      var check = function (el, text) {
        setError(el, text);
        if (text && !firstInvalid) firstInvalid = el;
      };
      check(fields.nome, fields.nome.value.trim() ? '' : msgs.errRequired);
      var email = fields.email.value.trim();
      check(fields.email, !email ? msgs.errRequired : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : msgs.errEmail));
      check(fields.motivo, fields.motivo.value ? '' : msgs.errMotivo);
      return firstInvalid;
    };

    ['nome', 'email', 'motivo'].forEach(function (k) {
      fields[k].addEventListener('change', function () {
        if (fields[k].getAttribute('aria-invalid') === 'true') validate();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.className = 'lp-form__status';
      if (form.querySelector('[name="website"]').value) return; // armadilha anti-spam

      var invalid = validate();
      if (invalid) { invalid.focus(); return; }

      var motivoLabel = fields.motivo.options[fields.motivo.selectedIndex].text;
      var payload = {
        nome: fields.nome.value.trim(),
        email: fields.email.value.trim(),
        motivo: fields.motivo.value,
        mensagem: fields.mensagem.value.trim(),
        idioma: doc.lang,
      };
      var endpoint = form.getAttribute('data-endpoint');

      if (!endpoint) {
        // Sem serviço configurado: abre o email do visitante com a mensagem preenchida.
        var bodyText = payload.nome + '\n' + payload.email + '\n' + motivoLabel + (payload.mensagem ? '\n\n' + payload.mensagem : '');
        status.textContent = msgs.mailto;
        window.location.href = 'mailto:' + msgs.email +
          '?subject=' + encodeURIComponent(msgs.subject + ' · ' + motivoLabel) +
          '&body=' + encodeURIComponent(bodyText);
        return;
      }

      submit.disabled = true;
      var label = submit.textContent;
      submit.textContent = msgs.sending;
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          form.reset();
          status.textContent = msgs.ok;
          status.classList.add('is-ok');
        })
        .catch(function () {
          status.textContent = msgs.fail;
        })
        .then(function () {
          submit.disabled = false;
          submit.textContent = label;
        });
    });
  }

  /* ---------- Seletor de idioma: guarda a escolha (o middleware deixa de adivinhar pelo browser) ---------- */
  document.querySelectorAll('a[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () {
      document.cookie = 'ma_lang=' + a.getAttribute('data-lang') + '; path=/; max-age=31536000; samesite=lax';
    });
  });

  var year = document.querySelector('[data-lp-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
