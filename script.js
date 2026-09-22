/* ============================================================
   LIMAR AVTO - скрипт страницы.
   Перевод RU/KZ (+ ?lang= в URL) · шапка · меню · появление ·
   бегущие ленты · форма запроса -> WhatsApp
   ============================================================ */
(function(){
"use strict";
var WA = "77055608735";
var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";

/* ---------------- КАЗАХСКИЙ СЛОВАРЬ ----------------
   Разметка русская. Нет ключа - строка остаётся русской.
   Сам словарь лежит в assets/lang/kk.js и подтягивается только по выбору KZ:
   проверка Google Ads должна видеть русский сайт (плейбук, «Этап Google Ads»).
   До загрузки KZ пуст - ни одной казахской строки в общих файлах нет. */
var KZ = {};

/* служебные строки формы */
var UI = {
 ru:{head:"Заявка с сайта LIMAR AVTO",car:"Авто",part:"Деталь",tel:"Телефон",
     err:"Напишите, какая деталь нужна, и номер телефона."},
};

/* бегущая строка */
var TICK = {
 ru:["Запчасти для ТО","Запчасти для ремонта двигателей","Ходовая часть",
     "Трансмиссия","Электрооборудование","Кузовные детали"],
};

/* Модель -> WhatsApp. Ссылку собираем заранее (на старте и при смене языка),
   а не в момент клика: обработчик на клике перетирает код обращения трекера. */
var ASK = {
 ru: "Здравствуйте! Нужны запчасти на %s. Подскажите наличие и цену."
};
function setModelLinks(kk){
  document.querySelectorAll(".mchip").forEach(function(a){
    var t = (ASK[kk ? "kk" : "ru"] || ASK.ru).replace("%s", a.dataset.model || "");
    a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
  });
}

/* ---------------- ЗАГРУЗКА КАЗАХСКОГО ----------------
   Файл словаря подключаем динамически и только когда казахский реально нужен.
   Версию берём из ?v= самого script.js - тогда словарь бампается вместе
   с остальными ассетами и не залипает в кэше у клиента.
   Страница со своими строками (каталог) называет свой файл в window.SITE_KK_EXTRA. */
var kzReady = 0, kzQueue = [];
function assetV(){
  var me = document.currentScript || document.querySelector('script[src*="script.js"]');
  var m = me && me.getAttribute("src").match(/[?&]v=([^&"]+)/);
  return m ? "?v=" + m[1] : "";
}
var KZV = assetV();
function loadJS(src){
  return new Promise(function(ok, no){
    var s = document.createElement("script");
    s.src = src; s.async = false;
    s.onload = ok; s.onerror = function(){ no(new Error(src)); };
    document.head.appendChild(s);
  });
}
function withKZ(cb){
  if (kzReady === 2) return cb();
  kzQueue.push(cb);
  if (kzReady === 1) return;
  kzReady = 1;
  var files = ["assets/lang/kk.js" + KZV];
  if (window.SITE_KK_EXTRA) files.push("assets/lang/" + window.SITE_KK_EXTRA + ".js" + KZV);
  Promise.all(files.map(loadJS)).then(function(){
    var d = window.SITE_KK || {};
    for (var k in (d.dict || {})) KZ[k] = d.dict[k];
    var ex = window.SITE_KK_PAGE;                       /* словарь страницы поверх общего */
    if (ex) for (var k2 in (ex.dict || {})) KZ[k2] = ex.dict[k2];
    if (d.ui) UI.kk = d.ui;
    if (d.tick) TICK.kk = d.tick;
    if (d.ask) ASK.kk = d.ask;
  }).catch(function(e){
    /* словарь не приехал - сайт остаётся русским, это рабочее состояние */
    if (window.console) console.warn("казахский словарь:", e && e.message);
  }).then(function(){
    kzReady = 2;
    var q = kzQueue; kzQueue = [];
    q.forEach(function(f){ f(); });
  });
}

/* ---------------- ПЕРЕВОД ---------------- */
var RU = {};
function snapshot(){
  document.querySelectorAll("[data-i]").forEach(function(el){ RU[el.dataset.i] = el.innerHTML; });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){ RU[el.dataset.iPh] = el.placeholder; });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){ RU[el.dataset.iAlt] = el.alt; });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ RU[el.dataset.iAria] = el.getAttribute("aria-label"); });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ RU[el.dataset.iC] = el.getAttribute("content"); });
}
function pick(k, kk){ return (kk && KZ[k] !== undefined) ? KZ[k] : RU[k]; }

function applyLang(lang){
  var kk = lang === "kk";
  document.documentElement.setAttribute("lang", kk ? "kk" : "ru");
  document.querySelectorAll("[data-i]").forEach(function(el){
    var v = pick(el.dataset.i, kk); if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){
    var v = pick(el.dataset.iPh, kk); if (v !== undefined) el.placeholder = v;
  });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){
    var v = pick(el.dataset.iAlt, kk); if (v !== undefined) el.alt = v;
  });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){
    var v = pick(el.dataset.iAria, kk); if (v !== undefined) el.setAttribute("aria-label", v);
  });
  document.querySelectorAll("[data-i-c]").forEach(function(el){
    var v = pick(el.dataset.iC, kk); if (v !== undefined) el.setAttribute("content", v);
  });
  var t = pick("m.title", kk); if (t) document.title = t.replace(/<[^>]*>/g, "");
  var og = document.querySelector('meta[property="og:locale"]');
  if (og) og.setAttribute("content", kk ? "kk_KZ" : "ru_RU");
  document.querySelectorAll(".lang button").forEach(function(b){
    var on = b.getAttribute("data-lang") === lang;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  try { localStorage.setItem("limar-lang", lang); } catch(e){}
  setModelLinks(kk);
  fillTicker();
  try { dispatchEvent(new CustomEvent("limar:lang", {detail:lang})); } catch(e){}
}
/* язык: ?lang= в URL (для рекламы) важнее сохранённого выбора */
function startLang(){
  var q = new URLSearchParams(location.search).get("lang");
  if (q === "kz") q = "kk";
  if (q === "kk" || q === "ru") return q;
  try { var v = localStorage.getItem("limar-lang"); if (v === "kk" || v === "ru") return v; } catch(e){}
  return "ru";
}
function T(k){ var d = UI[document.documentElement.lang === "kk" ? "kk" : "ru"] || UI.ru; return d[k] || UI.ru[k] || k; }

/* ---------------- ЛЕНТЫ ---------------- */
/* Лента крутится через translateX(-50%), поэтому половина дорожки обязана быть
   НЕ УЖЕ экрана - иначе на широком мониторе в цикле появляется пустой провал.
   Считаем ширину одной копии списка и повторяем её столько раз, сколько нужно. */
function loopTrack(el, html){
  el.innerHTML = html;
  var perCopy = el.children.length;                    /* элементов в одной копии */
  var one = el.scrollWidth || 1;
  var need = Math.ceil(window.innerWidth / one) + 1;   /* экран + одна копия про запас */
  var block = "";
  for (var i = 0; i < need; i++) block += html;
  el.innerHTML = block;
  /* Шаг цикла меряем по факту - от первого элемента копии до первого элемента
     следующей. Считать его равным scrollWidth одной копии нельзя: у ленты брендов
     есть gap, и между копиями добавляется ещё один зазор. */
  var first = el.children[0], next = el.children[perCopy];
  var step = next ? (next.offsetLeft - first.offsetLeft) : one;
  el.style.setProperty("--marq", step + "px");
  el.style.animationDuration = (step / 85).toFixed(2) + "s"; /* 85 px/с на любой ширине */
}
function fillTicker(){
  var el = document.getElementById("ticker"); if (!el) return;
  var list = TICK[document.documentElement.lang === "kk" ? "kk" : "ru"] || TICK.ru;
  loopTrack(el, list.map(function(t){ return "<b>" + t + "</b>"; }).join(""));
}
/* при смене ширины окна дорожки пересобираются - иначе провал вернётся */
var trackTimer;
addEventListener("resize", function(){
  clearTimeout(trackTimer);
  trackTimer = setTimeout(fillTicker, 200);
});
/* пока не подгрузился Fira Sans, ширина копии меряется по запасному шрифту
   и копий выходит меньше нужного - пересобираем по готовности шрифтов */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fillTicker);
}
/* ---------------- ПЛИТЫ ----------------
   Стандарт студии от 01.09.2026. Один слушатель scroll через rAF,
   на каждую обёртку .pw пишем три числа; всё остальное делает CSS
   через calc. */
(function plates(){
  var pws = [].slice.call(document.querySelectorAll(".pw"));
  if (!pws.length) return;
  if (RED) { document.documentElement.classList.add("no-plate"); return; }
  function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function update(){
    var H = window.innerHeight || document.documentElement.clientHeight;
    pws.forEach(function(pw){
      var r = pw.getBoundingClientRect();
      var enter = clamp(1 - r.top / H);
      var exit  = clamp(1 - r.bottom / H);
      var stay  = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : enter;
      pw.style.setProperty("--enter", enter.toFixed(3));
      pw.style.setProperty("--exit",  exit.toFixed(3));
      pw.style.setProperty("--stay",  stay.toFixed(3));
      pw.classList.toggle("gone", exit >= 1);
      pw.classList.toggle("on", enter > 0.72);
    });
  }
  var tick = false;
  function onScroll(){
    if (tick) return;
    tick = true;
    requestAnimationFrame(function(){ tick = false; update(); });
  }
  addEventListener("scroll", onScroll, {passive:true});
  addEventListener("resize", update);
  addEventListener("load", update);
  update();
  /* синхронный пересчёт - нужен проверочным скриптам:
     под --virtual-time-budget в headless не тикает requestAnimationFrame */
  window.plateSync = update;
})();

/* ---------------- ПОЯВЛЕНИЕ ---------------- */
if (HAS_IO) {
  if (!RED) document.documentElement.classList.add("js");
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:"0px 0px -6% 0px"});
  document.querySelectorAll(".rv, .make").forEach(function(el){ io.observe(el); });

  var steps = document.getElementById("steps");
  if (steps) {
    var sio = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("lit"); sio.unobserve(e.target); } });
    }, {threshold:.3});
    sio.observe(steps);
  }
  /* страховка: если наблюдатель молчит, контент всё равно виден */
  setTimeout(function(){
    document.querySelectorAll(".rv, .make").forEach(function(el){
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add("in");
    });
  }, 2500);
}

/* ---------------- ШАПКА, ДОК ---------------- */
var hdr = document.getElementById("hdr"), dock = document.getElementById("dock");
var prev = 0, ticking = false, lockHdr = false;
function onScroll(){
  if (ticking) return; ticking = true;
  requestAnimationFrame(function(){
    ticking = false;
    var y = scrollY || document.documentElement.scrollTop;
    hdr.classList.toggle("solid", y > 12);
    if (!document.body.classList.contains("menu-open") && !lockHdr) {
      hdr.classList.toggle("hide", y > 300 && y > prev);
    }
    if (dock) dock.classList.toggle("show", y > innerHeight * .55);
    prev = y;
  });
}
addEventListener("scroll", onScroll, {passive:true});
onScroll();

/* ---------------- МЕНЮ ---------------- */
var burger = document.getElementById("burger");
if (burger) {
  burger.addEventListener("click", function(){
    var open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) hdr.classList.remove("hide");
  });
  document.querySelectorAll("#mnav a").forEach(function(a){
    a.addEventListener("click", function(){
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------- ПЕРЕХОД ПО ЯКОРЯМ ----------------
   Нативный переход ставит под шапку ВЕРХ секции вместе с её верхним отступом:
   человек видит пустую полосу и только под ней заголовок. Считаем цель сами -
   отступ секции съедаем, оставляя немного воздуха. Абсолютную высоту берём
   цепочкой offsetTop: на неё, в отличие от getBoundingClientRect, не влияет
   reveal-сдвиг translateY у ещё не проявленных блоков. */
var AIR = 20;
function absTop(el){ var y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }
function anchorY(el){
  var h = hdr ? hdr.offsetHeight : 0, y = absTop(el);
  if (el.classList.contains("sec")) y += parseFloat(getComputedStyle(el).paddingTop) || 0;
  y = y - h - AIR;
  var max = document.documentElement.scrollHeight - innerHeight;
  return Math.max(0, Math.min(y, max));
}
/* человек крутит колесо/палец - значит перехват отменяем и в его скролл не лезем */
var lastUser = 0;
function touched(){
  lastUser = Date.now();
  if (lockHdr) { lockHdr = false; prev = scrollY || 0; }   /* человек крутит сам - не мешаем */
}
addEventListener("wheel", touched, {passive:true});
addEventListener("touchmove", touched, {passive:true});

function goAnchor(id, push){
  var el = id && document.getElementById(id);
  if (!el) return false;
  if (hdr) hdr.classList.remove("hide");
  lockHdr = true;                       /* пока летим, шапку не прячем - иначе цель уедет */
  lastUser = 0;
  scrollTo({top: anchorY(el), behavior: RED ? "auto" : "smooth"});
  /* Ждём, пока страница реально остановится НА ЦЕЛИ: до дальней секции плавный
     скролл летит больше секунды, и если отпустить шапку раньше, она спрячется
     прямо в полёте - над заголовком останется пустая полоса. Заодно добираем
     разницу, если выше догрузилась картинка и сдвинула раскладку. */
  var last = -1, tries = 0;
  (function settle(){
    var now = Math.round(scrollY || 0), y = anchorY(el);
    /* позиция перестала меняться - полёт кончился (или встал от сдвига раскладки);
       tries > 3, потому что плавный скролл стартует не сразу */
    var done = RED || (now === last && tries > 3);
    if (done || tries > 40 || Date.now() - lastUser < 400) {
      if (!lastUser && Math.abs(now - y) > 2) scrollTo({top:y, behavior:"auto"});
      /* держим шапку ещё секунду: сразу после посадки догружается картинка,
         браузер сам подправляет прокрутку (scroll anchoring) - и шапка
         принимает этот сдвиг за «человек листает вниз» и прячется */
      setTimeout(function(){ lockHdr = false; prev = scrollY || 0; }, 900);
      /* контрольная сверка: на свежезагруженной странице картинка выше может
         догрузиться уже после посадки и утащить цель на сотню пикселей */
      setTimeout(function(){
        if (Date.now() - lastUser < 600) return;
        var y2 = anchorY(el);
        if (Math.abs((scrollY || 0) - y2) > 4) {
          if (hdr) hdr.classList.remove("hide");
          scrollTo({top:y2, behavior:"auto"});
          prev = scrollY || 0;
        }
      }, 550);
      return;
    }
    last = now; tries++;
    setTimeout(settle, 70);
  })();
  if (push && history.replaceState) history.replaceState(null, "", "#" + id);
  return true;
}
window.limarGoAnchor = goAnchor;
document.addEventListener("click", function(ev){
  var a = ev.target.closest && ev.target.closest('a[href^="#"]');
  if (!a) return;
  var href = a.getAttribute("href");
  if (!href || href.length < 2) return;
  if (goAnchor(href.slice(1), true)) ev.preventDefault();
});
addEventListener("load", function(){
  if (location.hash.length > 1) setTimeout(function(){ goAnchor(location.hash.slice(1), false); }, 80);
});

/* ---------------- ПЛИТКИ АССОРТИМЕНТА ----------------
   Кликается вся карточка, не только кнопка: со смартфона это очевиднее. */
var partField = document.getElementById("partField");
function goToForm(part){
  if (partField && !partField.value) partField.value = part + ": ";
  var f = document.getElementById("qform");
  if (f) f.scrollIntoView({behavior: RED ? "auto" : "smooth", block:"center"});
  setTimeout(function(){ if (partField) partField.focus({preventScroll:true}); }, RED ? 0 : 600);
}
document.querySelectorAll("[data-part]").forEach(function(b){
  b.addEventListener("click", function(){ goToForm(b.dataset.part); });
});
document.querySelectorAll(".cat").forEach(function(card){
  card.addEventListener("click", function(ev){
    if (ev.target.closest("a,button")) return;
    var b = card.querySelector("[data-part]");
    if (b) goToForm(b.dataset.part);
  });
});

/* ---------------- ФОРМА -> WHATSAPP ---------------- */
var form = document.getElementById("qform"), note = document.getElementById("formNote");
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var f = new FormData(form);
  if (f.get("company")) return; /* honeypot */
  var car = (f.get("car") || "").trim(),
      part = (f.get("part") || "").trim(),
      tel = (f.get("phone") || "").trim();
  if (!part || !tel) {
    if (note) { note.textContent = T("err"); note.style.color = "#C8412F"; }
    return;
  }
  var lines = [T("head")];
  if (car) lines.push(T("car") + ": " + car);
  lines.push(T("part") + ": " + part);
  lines.push(T("tel") + ": " + tel);
  open("https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n")), "_blank");
  var body = document.getElementById("qformBody"), done = document.getElementById("qformDone");
  if (body && done) { body.hidden = true; done.hidden = false; }
  form.reset();
});

/* ---------------- ЛЕНТА ОТЗЫВОВ ----------------
   Стрелки обязательны: на десктопе обрезанная справа карточка читается как битая вёрстка,
   а свайп - подсказка для пальца, не для курсора. Шаг - ровно одна карточка. */
(function(){
  var strip = document.getElementById("revStrip"), nav = document.getElementById("revNav");
  if (!strip || !nav) return;
  var btns = nav.querySelectorAll(".rnav");
  function step(){
    var c = strip.firstElementChild; if (!c) return strip.clientWidth;
    var gap = parseFloat(getComputedStyle(strip).columnGap || getComputedStyle(strip).gap) || 0;
    return c.getBoundingClientRect().width + gap;
  }
  function upd(){
    var max = strip.scrollWidth - strip.clientWidth;
    nav.hidden = max < 8;                       /* всё влезло - кнопки не нужны */
    btns[0].disabled = strip.scrollLeft <= 4;
    btns[1].disabled = strip.scrollLeft >= max - 4;
  }
  btns.forEach(function(b){
    b.addEventListener("click", function(){
      strip.scrollBy({left: step() * (+b.dataset.dir), behavior: RED ? "auto" : "smooth"});
    });
  });
  strip.addEventListener("scroll", upd, {passive:true});
  addEventListener("resize", upd);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(upd);
  upd();
})();

/* ---------------- ДЕЛЕГИРОВАННЫЕ КЛИКИ tel/WhatsApp ----------------
   (сюда позже вешаются конверсии gtag) */
document.addEventListener("click", function(ev){
  var a = ev.target && ev.target.closest ? ev.target.closest("a[href^='tel:'],a[href*='wa.me']") : null;
  if (!a) return;
  /* window.gtag && gtag('event', ...) - добавляется на этапе рекламы */
});

/* ---------------- СТАРТ ---------------- */
/* Переключение языка: на казахский переходим только со словарём на руках,
   иначе страница на миг оказалась бы «казахской» с русским текстом. */
function setLang(l){
  if (l !== "kk") { swap(function(){ applyLang("ru"); }); return; }
  withKZ(function(){ swap(function(){ applyLang("kk"); }); });
}
function swap(fn){
  if (RED) { fn(); return; }
  document.body.classList.add("lang-swap");
  setTimeout(function(){ fn(); document.body.classList.remove("lang-swap"); }, 190);
}
snapshot();
(function(){
  var l = startLang();
  if (l === "kk") withKZ(function(){ applyLang("kk"); });
  else applyLang("ru");
})();

/* каскад строк H1 */
requestAnimationFrame(function(){
  requestAnimationFrame(function(){
    document.querySelectorAll(".hw").forEach(function(w){ w.classList.add("up"); });
  });
});

document.querySelectorAll(".lang button").forEach(function(b){
  b.addEventListener("click", function(){
    var l = b.getAttribute("data-lang");
    if (document.documentElement.lang === l) return;
    setLang(l);
  });
});
})();
