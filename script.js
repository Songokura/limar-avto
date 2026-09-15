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
   Разметка русская. Нет ключа - строка остаётся русской. */
var KZ = {
"m.title":"LIMAR AVTO - Орал қаласындағы Chevrolet, Renault, Lada бөлшектері",
"m.desc":"Орал қаласындағы автобөлшектер дүкені: Chevrolet, Renault, Lada үшін түпнұсқалар мен сенімді аналогтар. Бағасы мен бар-жоғы 5-15 минутта, тапсырыспен 1-2 күнде әкелеміз. Ашық Жол базары, 60-бутик.",

"nav.1":"Ассортимент","nav.2":"Маркалар","nav.3":"Неге біз","nav.4":"Жұмыс тәртібі",
"nav.5":"Пікірлер","nav.6":"Мекенжай","nav.wa":"WhatsApp",
"a.home":"LIMAR AVTO, басты бетке","a.nav":"Негізгі навигация","a.lang":"Сайт тілі",
"a.menu":"Мәзір","a.smap":"Сайт бөлімдері","a.map":"2ГИС картасы: LIMAR AVTO, Ашық Жол базары",
"mn.wa":"WhatsApp-қа жазу","mn.note":"Күн сайын 09:30 - 17:00 · Ашық Жол базары, 60-бутик",

"h.kick":"Орал · Сырым Датов көшесі, 49 · 2016 жылдан бері",
"h.t1":"Автобөлшектер",
"h.lead":"Ресми дилерлердің түпнұсқа бөлшектері және сапалы аналогтар",
"h.pill":"Бөлшектердің үлкен ассортименті: қоймада және тапсырыспен",
"h.note":"Форманы толтырыңыз - бөлшек іріктеу бойынша кеңес аласыз",

"f.h":"Өтінім қалдыру",
"f.car":"Көліктің маркасы мен моделі - немесе VIN / фрейм-код",
"f.car.ph":"Lada Vesta 1.8, 2019 - немесе VIN",
"f.part":"Қандай бөлшек керек",
"f.part.ph":"Веста 1.8-ге LUK ілінісу жинағы",
"f.tel":"Телефон нөмірі",
"f.send":"Жіберу",
"f.note":"Өтінім WhatsApp арқылы менеджерге кетеді. Жұмыс уақытында 5-15 минутта жауап береміз.",
"f.ok.h":"Рақмет! Өтінім қалыптасты.",
"f.ok.p":"WhatsApp ашылмаса - қоңырау шалыңыз: +7 705 560-87-35",

"s1.m":"ассортимент",
"s1.h1":"Каталог жоқ - іріктеу бар.","s1.h2":"Сегіз бағыт, кез келген торап.",
"s1.l":"Не керегін жазыңыз - түпнұсқа немесе аналог іріктеп, бағасын айтамыз. Орал қаласында болмаса - 1-2 күнде әкелеміз.",
"c1.h":"Регламенттік ТО бөлшектері",
"c1.p":"Сүзгілер, оталдыру білтелері, колодкалар, белдіктер, мотор және трансмиссия майлары - ТО аралығыңызға сай.",
"c2.h":"Қозғалтқыш жөндеуге арналған бөлшектер",
"c2.p":"Поршеньдер, сақиналар, жапсырмалар, ГБЦ, тығыздағыштар, ГРМ жинақтары, помпалар.",
"c3.h":"Әртүрлі модель мен жинақтағы қозғалтқыштар",
"c3.p":"ВАЗ 1.6 / 1.8, Renault K4M / K7M / H4M, Chevrolet жиналған қозғалтқыштары - қоймада және тапсырыспен.",
"c4.h":"Трансмиссия",
"c4.p":"LUK және Valeo ілінісу жинақтары, сығымдау подшипниктері, КПП тісті дөңгелектері мен біліктері.",
"c5.h":"Жүріс бөлігі",
"c5.p":"Қарапайым және күшейтілген тіреуіштер, рычагтар, шарлы тіректер, ступица подшипниктері, ШРУС-тар.",
"c6.h":"Басқару жүйелері",
"c6.p":"Рөл рейкалары мен тартқыштары, тежегіш дискілері, колодкалар, суппорттар, шлангілер.",
"c7.h":"Электр жабдығы",
"c7.p":"Генераторлар, стартерлер, аккумуляторлар, датчиктер, от алдыру катушкалары, сым жүйесі.",
"c8.h":"Шанақ бөлшектері",
"c8.p":"Бамперлер, қанаттар, есіктер, капоттар, жүксалғыш қақпақтары, фаралар мен шамдар.",
"c.cta":"Бағаны білу",
"logo.sub":"Орал қ., Сырым Датов көшесі, 49<br>2016 жылдан бері жұмыс істейміз",
"logo.top":"Орал · 2016 жылдан бері",

"s2.m":"сөрелерден",
"s2.t":"60-бутиктен тірі фото - дәл қазір сөрелерде жатқан тауар",

"s3.m":"маркалар мен модельдер",
"s3.h1":"Сіздің көлігіңіз - біздің сала.","s3.h2":"Үш марка, он жеті модель.",
"s3.note":"Өз моделіңізді таппадыңыз ба? Жазыңыз - оған да бөлшек табамыз.",

"s4.m":"неге бізден",
"s4.h1":"Бізден тапсырыс беру","s4.h2":"неге тиімді.",
"s4.cap":"Біздің дүкен · 60-бутик, Ашық Жол базары",
"w1.h":"Дәл іріктеу","w1.p":"Үйлесімділікті түпнұсқа бағдарламалар арқылы тексереміз - бөлшек өз орнына дәл түседі.",
"w2.h":"Артық үстеме жоқ","w2.p":"Қоймалармен және өндірушілермен тікелей жұмыс істейміз. Тек сенімді брендтер.",
"w3.h":"Әрқашан таңдау береміз","w3.p":"Түпнұсқа немесе сенімді дубликат - бағадағы адал айырмасымен.",
"w4.h":"1-2 күнде әкелеміз","w4.p":"Орал қаласында болмаса - тапсырыспен жеткіземіз.",
"w5.h":"5-15 минутта жауап","w5.p":"Бар-жоғы мен бағасы бойынша - жұмыс уақытында, күн сайын 09:30 - 17:00.",
"w6.a":"2ГИС рейтингі","w6.b":"Instagram жазылушысы",

"s5.m":"сөрелердегі брендтер",

"s6.m":"қалай жұмыс істейміз",
"s6.h1":"Өтінімнен қолыңыздағы бөлшекке дейін -","s6.h2":"төрт қадам.",
"st1.h":"Өтінім","st1.p":"Сайттағы форма немесе бірден WhatsApp.",
"st2.h":"5-15 минутта іріктеу","st2.p":"Бар-жоғын тексереміз, түпнұсқа не дубликат пен бағаны ұсынамыз.",
"st3.h":"Келісу","st3.p":"Төлем ыңғайлы түрде: қолма-қол, QR / Kaspi.",
"st4.h":"Бөлшек қолыңызда","st4.p":"60-бутиктен өзіңіз аласыз немесе Яндекс курьерімен жібереміз.",

"s7.m":"пікірлер",
"s7.h1":"Бізді 2ГИС-те ұсынады.","s7.h2":"Рейтинг 5,0.",
"s7.all":"2ГИС-тегі барлық пікірлер",

"s8.m":"біз қайдамыз",
"s8.h1":"Ашық Жол базары,","s8.h2":"жабық павильон, 60-бутик.",
"s8.l":"Базар аумағына кіріп, тура соңына дейін жүріңіз - жабық павильон. Ішінде LADA · RENAULT · CHEVROLET маңдайшасын іздеңіз.",
"fs1":"Жабық базардағы маңдайшамыз","fs2":"Жабық павильонға кіреберіс","fs3":"Павильон іші · 60-бутик",
"fi.addr":"Орал қ., Сырым Датов көшесі, 49",
"fi.addr2":"Ашық Жол авто базары, жабық базар, 60-бутик",
"fi.time":"Күн сайын 09:30 - 17:00","fi.pay":"Төлем: қолма-қол, QR / Kaspi","fi.route":"2ГИС-тегі бағыт",

"ft.about":"Орал қаласындағы Chevrolet, Renault, Lada автобөлшектер дүкені. Түпнұсқалар мен сенімді аналогтар - қоймада және тапсырыспен.",
"ft.cont":"Байланыс","ft.2gis":"Біз 2ГИС-те · рейтинг 5,0",
"ft.addr.h":"Мекенжай және кесте",
"ft.addr":"Орал қ., Сырым Датов көшесі, 49, Ашық Жол авто базары, жабық базар, 60-бутик",
"ft.time":"Күн сайын 09:30 - 17:00","ft.pay":"Қолма-қол · QR / Kaspi",
"ft.copy":"© 2026 LIMAR AVTO · ЖК, Орал қ.","ft.city":"Орал · Ашық Жол базары · 60-бутик",
"dk.call":"Қоңырау шалу",

"alt.to":"Май ауыстыру: регламенттік ТО-ға арналған шығын материалдары",
"alt.remont":"Цилиндрлер блогының басы жақыннан: қозғалтқыш жөндеуге арналған бөлшектер",
"alt.dvig":"Chevrolet S-TEC II 16V жиналған қозғалтқышы, қаптамадағы жаңа",
"alt.trans":"Ілінісу жинағы және кесіндідегі беріліс қорабы: трансмиссия",
"alt.hod":"Тежегіш дискісі, амортизаторлар, ШРУС-тар мен сүзгілер: жүріс бөлігі",
"alt.upr":"Суппортпен тежегіш дискісі: көлікті басқару жүйелері",
"alt.el":"Моторлық бөліктегі белдікті генератор: электр жабдығы",
"alt.kuzov":"Шанақтың бөлшектелген сұлбасы: бамперлер, капот, есіктер, қанаттар, жүксалғыш қақпағы",
"alt.shop":"60-бутиктегі LIMAR AVTO дүкені: бөлшектер мен майлар сөрелері",
"alt.sign":"Маңдайша: Lada, Renault, Chevrolet түпнұсқа бөлшектері, 60-бутик",
"alt.out":"Ашық Жол базарының жабық павильонына кіреберіс",
"alt.in":"Жабық базар іші: LADA маңдайшасы астындағы 60-бутик",
"alt.p1":"LIMAR AVTO сөресі: майлар мен шығын материалдары",
"alt.p2":"Сөредегі Gates PowerGrip ГРМ жинақтары",
"alt.p3":"Түпнұсқа LADA КПП тісті дөңгелектері",
"alt.p4":"Орамдағы амортизация тіреуіштері",
"alt.p5":"Valeo ілінісу жинақтары",
"alt.p6":"Chevrolet Cobalt үшін UzChasys фаралары",
"alt.p7":"Қоймадағы SUFIX бөлшектері"
};

/* служебные строки формы */
var UI = {
 ru:{head:"Заявка с сайта LIMAR AVTO",car:"Авто",part:"Деталь",tel:"Телефон",
     err:"Напишите, какая деталь нужна, и номер телефона."},
 kk:{head:"LIMAR AVTO сайтынан өтінім",car:"Көлік",part:"Бөлшек",tel:"Телефон",
     err:"Қандай бөлшек керегін және телефон нөмірін жазыңыз."}
};

/* бегущая строка */
var TICK = {
 ru:["Запчасти для ТО","Запчасти для ремонта двигателей","Ходовая часть",
     "Трансмиссия","Электрооборудование","Кузовные детали"],
 kk:["ТО-ға арналған бөлшектер","Қозғалтқыш жөндеуге арналған бөлшектер","Жүріс бөлігі",
     "Трансмиссия","Электр жабдығы","Шанақ бөлшектері"]
};

var BRANDS = ["LADA","Gates PowerGrip","Valeo","LUK","SUFIX","UzChasys","ACDelco","Sintec"];

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
  fillTicker();
}
/* язык: ?lang= в URL (для рекламы) важнее сохранённого выбора */
function startLang(){
  var q = new URLSearchParams(location.search).get("lang");
  if (q === "kz") q = "kk";
  if (q === "kk" || q === "ru") return q;
  try { var v = localStorage.getItem("limar-lang"); if (v === "kk" || v === "ru") return v; } catch(e){}
  return "ru";
}
function T(k){ return UI[document.documentElement.lang === "kk" ? "kk" : "ru"][k] || k; }

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
  var list = TICK[document.documentElement.lang === "kk" ? "kk" : "ru"];
  loopTrack(el, list.map(function(t){ return "<b>" + t + "</b>"; }).join(""));
}
function fillBrands(){
  var el = document.getElementById("brandsTrack"); if (!el) return;
  loopTrack(el, BRANDS.map(function(b){ return '<span class="brand-plate">' + b + "</span>"; }).join(""));
}
fillBrands();
/* при смене ширины окна дорожки пересобираются - иначе провал вернётся */
var trackTimer;
addEventListener("resize", function(){
  clearTimeout(trackTimer);
  trackTimer = setTimeout(function(){ fillTicker(); fillBrands(); }, 200);
});
/* пока не подгрузился Fira Sans, ширина копии меряется по запасному шрифту
   и копий выходит меньше нужного - пересобираем по готовности шрифтов */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function(){ fillTicker(); fillBrands(); });
}
/* дублируем ленту фото для бесшовного прогона */
(function loopStrip(){
  var el = document.getElementById("pstrip"); if (!el) return;
  el.innerHTML += el.innerHTML;
  el.querySelectorAll("img").forEach(function(i){ i.setAttribute("aria-hidden", "true"); });
})();

/* ---------------- ПЛИТЫ ----------------
   Стандарт студии от 01.09.2026. Один слушатель scroll через rAF,
   на каждую обёртку .pw пишем три числа; всё остальное делает CSS
   через calc. Раскрытие «от середины» осталось только у ленты фото:
   шов в герое клиент снял 02.09.2026. */
(function plates(){
  var pws = [].slice.call(document.querySelectorAll(".pw"));
  if (!pws.length) return;
  if (RED) { document.documentElement.classList.add("no-plate"); return; }
  var strip = document.querySelector(".pstrip");
  function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function easeOut(t){ return 1 - Math.pow(1 - t, 2.2); }
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
      /* лента фото раскрывается швом от середины */
      if (strip && pw.contains(strip)) {
        strip.style.setProperty("--open", easeOut(clamp((enter - 0.28) / 0.5)).toFixed(3));
      }
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
var prev = 0, ticking = false;
function onScroll(){
  if (ticking) return; ticking = true;
  requestAnimationFrame(function(){
    ticking = false;
    var y = scrollY || document.documentElement.scrollTop;
    hdr.classList.toggle("solid", y > 12);
    if (!document.body.classList.contains("menu-open")) {
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

/* ---------------- ДЕЛЕГИРОВАННЫЕ КЛИКИ tel/WhatsApp ----------------
   (сюда позже вешаются конверсии gtag) */
document.addEventListener("click", function(ev){
  var a = ev.target && ev.target.closest ? ev.target.closest("a[href^='tel:'],a[href*='wa.me']") : null;
  if (!a) return;
  /* window.gtag && gtag('event', ...) - добавляется на этапе рекламы */
});

/* ---------------- СТАРТ ---------------- */
snapshot();
applyLang(startLang());

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
    if (RED) { applyLang(l); return; }
    document.body.classList.add("lang-swap");
    setTimeout(function(){
      applyLang(l);
      document.body.classList.remove("lang-swap");
    }, 190);
  });
});
})();
