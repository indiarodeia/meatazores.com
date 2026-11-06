// Gera index.html (PT-PT), en.html (EN) e fr.html (FR) a partir de content.mjs.
// O HTML final é estático (sem build na Vercel): o texto principal fica no HTML inicial.
// Uso, na raiz do repositório: node tools/landing/build.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { content, ROUTES, SITE, LANGS } from './content.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const IMG = '/assets/landing/';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Símbolo modular (extraído de 01.logo/exported/logo-meatazores-light.svg).
const symbol = (cls = '') => `<svg class="lp-symbol ${cls}" viewBox="-0.3 -0.3 17.6 17.6" aria-hidden="true" focusable="false">
  <path class="lp-symbol__leaf" d="M15.9037 7.13491C16.677 2.46059 13.8402 -0.586641 9.06836 0.0984503C8.11327 4.7478 11.2921 7.70939 15.9001 7.13491H15.9037Z"/>
  <path class="lp-symbol__leaf" d="M0.135423 7.13637C0.456163 7.17205 0.769774 7.18989 1.07269 7.19346C5.25656 7.28267 7.90801 4.53516 7.05983 0.0927728C6.62505 0.0321137 6.20809 0 5.80538 0C5.80182 0 5.79825 0 5.79469 0H0.958654C0.427652 0 0 0.428182 0 0.956274V5.77332C0 5.77332 0 5.79473 0 5.80544C0.0106913 6.23362 0.0498928 6.67607 0.13186 7.13637H0.135423Z"/>
  <path class="lp-symbol__leaf" d="M9.06414 16.1663C13.5937 16.9263 16.9757 13.7114 15.732 9.19762C11.1668 8.50182 8.18389 11.6846 9.06414 16.1663Z"/>
  <path class="lp-symbol__leaf" d="M0.259977 9.19795C-0.983779 13.7117 2.39824 16.9266 6.92779 16.1666C7.81161 11.685 4.82517 8.49858 0.259977 9.19795Z"/>
  <path class="lp-symbol__dot" d="M8.02988 10.2075C9.17144 10.2075 10.0969 9.28089 10.0969 8.13791C10.0969 6.99493 9.17144 6.06836 8.02988 6.06836C6.88831 6.06836 5.96289 6.99493 5.96289 8.13791C5.96289 9.28089 6.88831 10.2075 8.02988 10.2075Z"/>
</svg>`;

// <picture> responsivo com WebP + JPEG.
function picture(name, alt, { sizes = '100vw', widths = [1200, 2400], cls = '', eager = false, attrs = '' } = {}) {
  const set = (ext) => widths.map((w) => `${IMG}${name}-${w}.${ext} ${w}w`).join(', ');
  return `<picture class="${cls}"${attrs ? ' ' + attrs : ''}>
      <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
      <img src="${IMG}${name}-${widths[0]}.jpg" srcset="${set('jpg')}" sizes="${sizes}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>
    </picture>`;
}

// Divide uma frase em palavras para a animação de "acender" com o scroll.
const words = (text) =>
  text.split(' ').map((w, i) => `<span class="lp-word" style="--i:${i}">${esc(w)}</span>`).join(' ');

// A aplicação (peças, produtores, raças) só existe em PT e EN: o FR segue para o EN.
const withLang = (href, L) => (L === 'pt' ? href : href + (href.includes('?') ? '&' : '?') + 'lang=en');

const HREFLANG = { pt: 'pt-PT', en: 'en', fr: 'fr' };
const LABEL = { pt: 'Português', en: 'English', fr: 'Français' };
const urlOf = (L) => SITE + content[L].path;

function page(L) {
  const c = content[L];
  const canonical = urlOf(L);
  const ui = c.ui;

  // data-lang: o landing.js guarda a escolha num cookie, para a deteção automática a respeitar.
  const langSwitch = (extra = '') => `<div class="lp-lang ${extra}" role="group" aria-label="${esc(ui.langLabel)}">
        ${LANGS.map(
          (l) => `<a href="${content[l].path}" hreflang="${HREFLANG[l]}" lang="${HREFLANG[l]}" data-lang="${l}" title="${LABEL[l]}"${l === L ? ' aria-current="true"' : ''}>${l.toUpperCase()}</a>`
        ).join('\n        <span aria-hidden="true">|</span>\n        ')}
      </div>`;

  const navLinks = ui.nav.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join('\n          ');

  const steps = c.como.steps
    .map(
      ([t, d], i) => `<li class="lp-flow__step" data-reveal data-step="${i}">
            <span class="lp-flow__node" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
            <h3>${esc(t)}</h3>
            <p>${esc(d)}</p>
          </li>`
    )
    .join('\n          ');

  const rows = c.valor.rows
    .map(([t, d]) => `<li class="lp-rows__item" data-reveal><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)
    .join('\n          ');

  // Versões otimizadas de assets/produtor/emiliano-meneses/ (originais intactos).
  const parallaxGen = ['0.06', '-0.05', '0.1'];
  const geracoes = ['geracao-1', 'geracao-2', 'geracao-3']
    .map(
      (name, i) => `<figure class="lp-gen__fig lp-gen__fig--${i + 1}" data-reveal>
              <div class="lp-gen__frame" data-parallax="${parallaxGen[i]}">
              ${picture(name, c.valor.altGeracoes[i], { widths: [500, 900], sizes: '(min-width: 960px) 30vw, 100vw' })}
              </div>
              <figcaption>${esc(c.valor.captions[i])}</figcaption>
            </figure>`
    )
    .join('\n            ');

  const facts = c.exemplo.facts
    .map(([k, v], i) => `<div data-reveal style="--i:${i}"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join('\n            ');

  const motivos = c.contacto.form.motivos.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('\n                ');

  const f = c.contacto.form;
  const formMsgs = {
    sending: f.sending, ok: f.ok, fail: f.fail, mailto: f.mailto,
    errRequired: f.errRequired, errEmail: f.errEmail, errMotivo: f.errMotivo,
    subject: f.subject, email: ROUTES.email,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Meat Azores',
    url: SITE + '/',
    logo: SITE + '/assets/ui/logo-meatzores.svg',
    email: ROUTES.email,
    sameAs: [ROUTES.instagram],
    description: c.meta.description,
    areaServed: { '@type': 'Place', name: c.place },
    inLanguage: LANGS.map((l) => HREFLANG[l]),
  };

  return `<!doctype html>
<!-- GERADO por tools/landing/build.mjs a partir de tools/landing/content.mjs. Não editar à mão. -->
<html lang="${c.lang}">

<head>
  <script>
    // QR já distribuídos: /q/... e links antigos chegam à raiz com ?peca=.
    // Encaminha para o ecrã de entrada da aplicação (entrada.html), mantendo os parâmetros.
    (function () {
      var p = new URLSearchParams(window.location.search);
      if (p.has('peca')) window.location.replace('/entrada' + window.location.search);
    })();
  </script>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-06H9C9G9KV"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-06H9C9G9KV');
  </script>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(c.meta.title)}</title>
  <meta name="description" content="${esc(c.meta.description)}" />
  <meta name="theme-color" content="#014838" />

  <link rel="canonical" href="${canonical}" />
  ${LANGS.map((l) => `<link rel="alternate" hreflang="${HREFLANG[l].toLowerCase()}" href="${urlOf(l)}" />`).join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${urlOf('pt')}" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Meat Azores" />
  <meta property="og:title" content="${esc(c.hero.h1)}" />
  <meta property="og:description" content="${esc(c.meta.description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${SITE}${IMG}og-meatazores.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="${c.ogLocale}" />
  ${LANGS.filter((l) => l !== L).map((l) => `<meta property="og:locale:alternate" content="${content[l].ogLocale}" />`).join('\n  ')}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(c.hero.h1)}" />
  <meta name="twitter:description" content="${esc(c.meta.description)}" />
  <meta name="twitter:image" content="${SITE}${IMG}og-meatazores.jpg" />

  <link rel="icon" type="image/png" href="/assets/favicon/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/assets/favicon/favicon.svg" />
  <link rel="shortcut icon" href="/assets/favicon/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="Meat Azores" />
  <link rel="manifest" href="/assets/favicon/site.webmanifest" />

  <link rel="preload" href="/font/Sofia%20Pro%20Bold%20Az.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" as="image" type="image/webp" imagesrcset="${IMG}territorio-1200.webp 1200w, ${IMG}territorio-2400.webp 2400w" imagesizes="100vw" />
  <link rel="stylesheet" href="/css/styleguide.css" />
  <link rel="stylesheet" href="/css/landing.css" />

  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>

<body class="lp">
  <a class="lp-skip" href="#conteudo">${esc(ui.skip)}</a>

  <header class="lp-header" data-lp-header>
    <div class="lp-header__inner">
      <a class="lp-header__logo" href="#inicio" aria-label="${esc(ui.logoHome)}">
        <img class="lp-logo lp-logo--light" src="${IMG}logo-meatazores-light.svg" alt="" width="156" height="17">
        <img class="lp-logo lp-logo--dark" src="${IMG}logo-meatazores-dark.svg" alt="" width="156" height="17">
      </a>
      <nav class="lp-header__nav" aria-label="${esc(ui.navLabel)}">
        <ul>
          ${navLinks}
        </ul>
      </nav>
      <div class="lp-header__actions">
        ${langSwitch()}
        <a class="lp-btn lp-btn--outline lp-btn--sm lp-header__app" href="${c.appHref}">${esc(ui.app)}</a>
        <button class="lp-header__menu" type="button" aria-expanded="false" aria-controls="lp-menu" data-lp-menu-open>
          <span class="lp-burger" aria-hidden="true"></span><span class="lp-sr">${esc(ui.menu)}</span>
        </button>
      </div>
    </div>
    <div class="lp-progress" aria-hidden="true"><span data-lp-progress></span></div>
  </header>

  <div class="lp-menu" id="lp-menu" role="dialog" aria-modal="true" aria-label="${esc(ui.menu)}" hidden data-lp-menu>
    <div class="lp-menu__top">
      <img src="${IMG}logo-meatazores-light.svg" alt="" width="156" height="17">
      <button class="lp-menu__close" type="button" data-lp-menu-close><span aria-hidden="true">×</span><span class="lp-sr">${esc(ui.closeMenu)}</span></button>
    </div>
    <nav aria-label="${esc(ui.navLabel)}">
      <ul class="lp-menu__links">
        ${navLinks}
      </ul>
    </nav>
    <div class="lp-menu__bottom">
      <a class="lp-btn lp-btn--outline" href="${c.appHref}">${esc(ui.app)}</a>
      <a class="lp-menu__mail" href="mailto:${ROUTES.email}">${ROUTES.email}</a>
      ${langSwitch('lp-lang--lg')}
    </div>
  </div>

  <main id="conteudo">

    <!-- 1 · HERO -->
    <section class="lp-hero" id="inicio" aria-labelledby="h-inicio" data-lp-hero>
      ${picture('territorio', c.hero.imgAlt, { cls: 'lp-hero__bg', eager: true, attrs: 'data-parallax="0.3"' })}
      <div class="lp-hero__shade" aria-hidden="true"></div>
      <p class="lp-hero__coords" aria-hidden="true">${esc(c.hero.coords)}</p>
      <div class="lp-wrap lp-hero__content" data-lp-hero-content>
        <p class="lp-pill">${esc(c.hero.pill)}</p>
        <h1 id="h-inicio" class="lp-hero__title">${esc(c.hero.h1)}</h1>
        <p class="lp-hero__sub">${esc(c.hero.sub)}</p>
        <div class="lp-hero__ctas">
          <a class="lp-btn lp-btn--lime" href="#como-funciona">${esc(c.hero.cta1)}</a>
          <a class="lp-btn lp-btn--outline" href="#contacto" data-motivo="">${esc(c.hero.cta2)}</a>
        </div>
      </div>
      ${picture('qr-cartao', c.hero.qrAlt, { widths: [200, 400], sizes: '200px', cls: 'lp-hero__peca' })}
    </section>

    <!-- 2 · PROBLEMA -->
    <section class="lp-section lp-section--forest" id="problema" aria-labelledby="h-problema">
      <div class="lp-wrap lp-split">
        <div class="lp-split__text" data-reveal>
          <p class="lp-eyebrow">${esc(c.problema.eyebrow)}</p>
          <h2 id="h-problema" class="lp-h2">${esc(c.problema.h2[0])}<span class="lp-accent">${esc(c.problema.h2[1])}</span>${esc(c.problema.h2[2])}</h2>
          ${c.problema.p.map((p) => `<p class="lp-body">${esc(p)}</p>`).join('\n          ')}
        </div>
        <div class="lp-split__media lp-stack" data-reveal>
          <div class="lp-clip" data-progress>
          ${picture('pastagem-muros', c.problema.imgAlt, { widths: [700, 1200], sizes: '(min-width: 960px) 45vw, 100vw', cls: 'lp-rounded' })}
          </div>
          <span class="lp-stack__badge" aria-hidden="true">${symbol()}</span>
        </div>
      </div>
      <p class="lp-wrap lp-closing lp-words" data-progress style="--n:${c.problema.closing.split(' ').length}">${words(c.problema.closing)}</p>
    </section>

    <!-- 3 · SOLUÇÃO -->
    <section class="lp-section lp-section--light" id="solucao" aria-labelledby="h-solucao">
      <div class="lp-wrap lp-split lp-split--reverse">
        <div class="lp-split__text" data-reveal>
          <p class="lp-eyebrow">${esc(c.solucao.eyebrow)}</p>
          <h2 id="h-solucao" class="lp-h2">${esc(c.solucao.h2)}</h2>
          <p class="lp-body">${esc(c.solucao.p)}</p>
          <p class="lp-quote lp-words" data-progress style="--n:${c.solucao.quote.split(' ').length}">${words(c.solucao.quote)}</p>
        </div>
        <div class="lp-split__media" data-reveal>
          <div class="lp-clip lp-clip--zoom" data-progress>
          ${picture('qr-mesa', c.solucao.imgAlt, { sizes: '(min-width: 960px) 50vw, 100vw', cls: 'lp-rounded lp-tall' })}
          </div>
        </div>
      </div>
    </section>

    <!-- 4 · COMO FUNCIONA -->
    <section class="lp-section lp-section--forest" id="como-funciona" aria-labelledby="h-como">
      <div class="lp-wrap">
        <div class="lp-head" data-reveal>
          <p class="lp-eyebrow">${esc(c.como.eyebrow)}</p>
          <h2 id="h-como" class="lp-h2">${esc(c.como.h2)}</h2>
          <p class="lp-body lp-body--lead">${esc(c.como.intro)}</p>
        </div>
        <div class="lp-flow" data-lp-flow>
          <div class="lp-flow__ends" aria-hidden="true"><span>${esc(c.como.farm)}</span><span>${esc(c.como.fork)}</span></div>
          <ol class="lp-flow__list">
          ${steps}
          </ol>
        </div>
        <aside class="lp-tech" data-reveal>
          <p class="lp-eyebrow">${esc(c.como.techEyebrow)}</p>
          <p>${esc(c.como.tech)}</p>
        </aside>
      </div>
    </section>

    <!-- 5 · VALOR NA CADEIA -->
    <section class="lp-section lp-section--light" id="valor" aria-labelledby="h-valor">
      <div class="lp-wrap">
        <div class="lp-head" data-reveal>
          <p class="lp-eyebrow">${esc(c.valor.eyebrow)}</p>
          <h2 id="h-valor" class="lp-h2">${esc(c.valor.h2)}</h2>
        </div>
        <div class="lp-gen">
          <div class="lp-gen__text" data-reveal>
            <h3 class="lp-h3">${esc(c.valor.produtorTitle)}</h3>
            <p class="lp-body">${esc(c.valor.produtorText)}</p>
            <p class="lp-tag">${esc(c.valor.geracoes)}</p>
            <a class="lp-link" href="${withLang(ROUTES.produtorTresGeracoes, L)}">${esc(c.valor.perfil)} <span aria-hidden="true">→</span></a>
          </div>
          <div class="lp-gen__photos">
            ${geracoes}
          </div>
        </div>
        <ul class="lp-rows">
          ${rows}
        </ul>
      </div>
    </section>

    <!-- 6 · EXEMPLO REAL -->
    <section class="lp-section lp-section--mist" id="exemplo" aria-labelledby="h-exemplo">
      <div class="lp-wrap lp-example">
        <div class="lp-example__photos" data-reveal>
          ${picture('catrina', c.exemplo.altCatrina, { widths: [500, 900], sizes: '(min-width: 960px) 36vw, 100vw', cls: 'lp-example__a lp-rounded', attrs: 'data-parallax="-0.04"' })}
          ${picture('manuel-territorio', c.exemplo.altTerritorio, { widths: [500, 900], sizes: '(min-width: 960px) 36vw, 100vw', cls: 'lp-example__b lp-rounded', attrs: 'data-parallax="0.06"' })}
          <a class="lp-example__c lp-producer" href="${withLang(ROUTES.exemploProdutor, L)}">
            <picture><source type="image/webp" srcset="${IMG}manuel-lucas-138.webp"><img src="${IMG}manuel-lucas-138.jpg" alt="" width="64" height="64" loading="lazy" decoding="async"></picture>
            <span class="lp-producer__name">Manuel Lucas</span>
            <span class="lp-producer__type">${esc(c.exemplo.produtor.tipo)}</span>
            <span class="lp-producer__meta">${esc(c.exemplo.produtor.desde)}</span>
            <span class="lp-producer__link">${esc(c.exemplo.produtor.perfil)} <span aria-hidden="true">→</span></span>
          </a>
        </div>
        <div class="lp-example__text" data-reveal>
          <p class="lp-eyebrow">${esc(c.exemplo.eyebrow)}</p>
          <h2 id="h-exemplo" class="lp-h2">${esc(c.exemplo.h2)}</h2>
          ${c.exemplo.p.map((p) => `<p class="lp-body">${esc(p)}</p>`).join('\n          ')}
        </div>
        <dl class="lp-facts" data-reveal>
            ${facts}
        </dl>
        <div class="lp-example__cta" data-reveal>
          <a class="lp-btn lp-btn--lime" href="${withLang(ROUTES.exemploPeca, L)}" target="_blank" rel="noopener">${esc(c.exemplo.cta)}<span class="lp-sr"> ${esc(c.exemplo.newTab)}</span> <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>

    <!-- 7 · VISÃO -->
    <section class="lp-vision" id="visao" aria-labelledby="h-visao">
      ${picture('paisagem-hortenses', c.visao.imgAlt, { cls: 'lp-vision__bg', attrs: 'data-parallax="0.18"' })}
      <div class="lp-wrap lp-vision__inner">
        <div class="lp-vision__panel" data-reveal>
          <p class="lp-eyebrow">${esc(c.visao.eyebrow)}</p>
          <h2 id="h-visao" class="lp-h2">${esc(c.visao.h2[0])}<span class="lp-accent">${esc(c.visao.h2[1])}</span>${esc(c.visao.h2[2])}</h2>
          ${c.visao.p.map((p) => `<p class="lp-body">${esc(p)}</p>`).join('\n          ')}
        </div>
      </div>
    </section>

    <!-- 8 · EXPANSÃO -->
    <section class="lp-section lp-section--light" id="expansao" aria-labelledby="h-expansao">
      <div class="lp-wrap lp-split">
        <div class="lp-split__text" data-reveal>
          <p class="lp-eyebrow">${esc(c.expansao.eyebrow)}</p>
          <h2 id="h-expansao" class="lp-h2">${esc(c.expansao.h2)}</h2>
          <p class="lp-body">${esc(c.expansao.p)}</p>
          ${c.expansao.note ? `<p class="lp-note">${esc(c.expansao.note)}</p>` : ''}
          <p class="lp-question">${esc(c.expansao.question)}</p>
          <a class="lp-btn lp-btn--forest" href="#contacto" data-motivo="parceria">${esc(c.expansao.cta)}</a>
        </div>
        <figure class="lp-split__media lp-map" data-reveal data-progress>
          <svg viewBox="0 0 600 420" role="img" aria-label="${esc(c.expansao.mapLabel)}">
            <defs><pattern id="lp-grid" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" class="lp-map__dot"/></pattern></defs>
            <rect width="600" height="420" fill="url(#lp-grid)"/>
            <mask id="lp-routes-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="420">
              <g class="lp-map__draw">
                <path pathLength="1" d="M150 250 C 260 120, 400 90, 520 110"/>
                <path pathLength="1" d="M150 250 C 280 220, 420 230, 540 250"/>
                <path pathLength="1" d="M150 250 C 250 330, 400 360, 500 370"/>
                <path pathLength="1" d="M150 250 C 100 140, 60 90, 40 60"/>
              </g>
            </mask>
            <g class="lp-map__routes" mask="url(#lp-routes-mask)">
              <path d="M150 250 C 260 120, 400 90, 520 110"/>
              <path d="M150 250 C 280 220, 420 230, 540 250"/>
              <path d="M150 250 C 250 330, 400 360, 500 370"/>
              <path d="M150 250 C 100 140, 60 90, 40 60"/>
            </g>
            <g class="lp-map__ends"><circle cx="520" cy="110" r="6" style="--i:0"/><circle cx="540" cy="250" r="6" style="--i:1"/><circle cx="500" cy="370" r="6" style="--i:2"/><circle cx="40" cy="60" r="6" style="--i:3"/></g>
            <g class="lp-map__origin"><circle class="lp-map__pulse" cx="150" cy="250" r="22"/><circle cx="150" cy="250" r="22"/><circle cx="150" cy="250" r="8"/></g>
            <text x="150" y="300" text-anchor="middle" class="lp-map__label">${esc(c.expansao.origin)}</text>
          </svg>
        </figure>
      </div>
    </section>

    <!-- 9 · SOBRE -->
    <section class="lp-section lp-section--light lp-section--tight" id="sobre" aria-labelledby="h-sobre">
      <div class="lp-wrap lp-split lp-split--reverse lp-about">
        <div class="lp-split__text" data-reveal>
          <p class="lp-eyebrow">${esc(c.sobre.eyebrow)}</p>
          <h2 id="h-sobre" class="lp-h2">${esc(c.sobre.h2)}</h2>
          <p class="lp-body">${esc(c.sobre.p)}</p>
          <p class="lp-body">${esc(c.sobre.talho[0])}<a href="${ROUTES.talhoRocha}" target="_blank" rel="noopener">${esc(c.sobre.talho[1])}<span class="lp-sr"> ${esc(c.exemplo.newTab)}</span></a>${esc(c.sobre.talho[2])}</p>
        </div>
        <div class="lp-split__media" data-reveal>
          <div class="lp-about__photos">
            ${['fundadora', 'sim-2026']
              .map(
                (name, i) => `<figure class="lp-about__fig lp-about__fig--${i + 1}">
              ${picture(name, c.sobre.fotos[i][0], { widths: [500, 900], sizes: '(min-width: 960px) 240px, 45vw', cls: 'lp-rounded' })}
              <figcaption>${esc(c.sobre.fotos[i][1])}</figcaption>
            </figure>`
              )
              .join('\n            ')}
          </div>
        </div>
      </div>
    </section>

    <!-- 10 · CONTACTO -->
    <section class="lp-section lp-section--forest" id="contacto" aria-labelledby="h-contacto">
      <div class="lp-wrap lp-contact">
        <div class="lp-contact__intro" data-reveal>
          <p class="lp-eyebrow">${esc(c.contacto.eyebrow)}</p>
          <h2 id="h-contacto" class="lp-h2 lp-h2--xl">${esc(c.contacto.h2)}</h2>
          <p class="lp-body">${esc(c.contacto.p)}</p>
          <p class="lp-contact__email" data-reveal><span>${esc(c.contacto.emailLabel)}</span><a href="mailto:${ROUTES.email}">${ROUTES.email}</a></p>
        </div>
        <!-- Destino do formulário A VALIDAR (validação 4): preencher data-endpoint com o URL do serviço.
             Sem endpoint, o envio abre o email com a mensagem preenchida para ${ROUTES.email}. -->
        <form class="lp-form" novalidate data-lp-form data-endpoint="" data-msgs="${esc(JSON.stringify(formMsgs))}">
          <div class="lp-field">
            <label for="f-nome">${esc(f.nome)}</label>
            <input id="f-nome" name="nome" type="text" autocomplete="name" required aria-describedby="f-nome-err">
            <p class="lp-field__err" id="f-nome-err" aria-live="polite"></p>
          </div>
          <div class="lp-field">
            <label for="f-email">${esc(f.email)}</label>
            <input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="f-email-err">
            <p class="lp-field__err" id="f-email-err" aria-live="polite"></p>
          </div>
          <div class="lp-field">
            <label for="f-motivo">${esc(f.motivo)}</label>
            <select id="f-motivo" name="motivo" required aria-describedby="f-motivo-err">
              <option value="">${esc(f.motivoPlaceholder)}</option>
                ${motivos}
            </select>
            <p class="lp-field__err" id="f-motivo-err" aria-live="polite"></p>
          </div>
          <div class="lp-field">
            <label for="f-mensagem">${esc(f.mensagem)} <span class="lp-field__opt">${esc(f.opcional)}</span></label>
            <textarea id="f-mensagem" name="mensagem" rows="4"></textarea>
          </div>
          <input class="lp-hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="lp-btn lp-btn--lime lp-form__submit" type="submit">${esc(f.submit)}</button>
          <p class="lp-form__status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
  </main>

  <footer class="lp-footer">
    <div class="lp-wrap lp-footer__inner">
      <div class="lp-footer__brand">
        <img src="${IMG}logo-meatazores-assinatura.svg" alt="Meat Azores, ${esc(c.footer.tagline)}" width="215" height="37">
      </div>
      <ul class="lp-footer__links">
        <li><a href="mailto:${ROUTES.email}">${ROUTES.email}</a></li>
        <li><a href="${ROUTES.instagram}" rel="noopener" target="_blank">${esc(c.footer.instagram)} @meatazores</a></li>
        <li><a class="lp-btn lp-btn--outline lp-btn--sm" href="${c.appHref}">${esc(ui.app)}</a></li>
      </ul>
      ${langSwitch()}
      <p class="lp-footer__legal">© <span data-lp-year>2026</span> ${esc(c.footer.rights)}</p>
    </div>
  </footer>

  <script src="/js/landing.js" defer></script>
</body>

</html>
`;
}

for (const L of LANGS) {
  const file = L === 'pt' ? 'index.html' : L + '.html';
  writeFileSync(resolve(ROOT, file), page(L));
  console.log('OK: ' + file + ' (' + content[L].lang + ')');
}
