/* ============================================================
   LIMAR AVTO - каталог запчастей.
   Данные лежат в Google-таблице (три листа по маркам + «Настройки»),
   клиент правит её сам. Читаем через gviz-запрос: фильтрует Google
   у себя, в браузер приезжает только найденное - 37 тысяч строк
   целиком не качаем.
   ============================================================ */
(function(){
"use strict";

/* ID Google-таблицы «LIMAR AVTO - каталог запчастей (сайт)».
   Доступ у таблицы: «Все, у кого есть ссылка - Читатель». */
var SHEET = "1L0bkWWsTGxzy5oB5_ZGCb9og0mEWHs3Q-Jm45pG5XXA";

var SHEETS = ["LADA", "LargusRenault", "Chevrolet"];
var PAGE = 40;                 /* позиций за один запрос к листу */
var WA = "77055608735";

/* ---------------- казахские строки страницы ----------------
   Кладём в общий словарь до старта script.js - он их подхватит. */
window.SITE_EXTRA_KZ = {
"nav.7":"Каталог",
"k.title":"Орал қаласындағы Lada, Renault, Chevrolet қосалқы бөлшектерінің каталогы - LIMAR AVTO",
"k.desc":"LIMAR AVTO автобөлшектер каталогы: атауы мен артикулы бойынша іздеу, бағасы және бар-жоғы. Lada, Largus, Renault, Chevrolet. Орал, Ашық Жол базары, 60-бутик.",
"k.crumb":"Басты бет","k.crumb2":"Каталог",
"k.m":"каталог",
"k.h1":"Қосалқы бөлшектер каталогы.",
"k.lead":"Бөлшектің атауын немесе артикулын жазыңыз.",
"k.ph":"Гранта майлы сүзгісі, Ларгус тежегіш қалыптары, 21214-1012005",
"k.aria":"Каталогтан іздеу","k.clear":"Тазалау","k.go":"Табу",
"k.brand":"Көлік маркасы","k.all":"Барлық маркалар","k.only":"Тек қоймада барлары",
"k.secs":"Каталог бөлімдері","k.secs.t":"Бөлімдер:",
"k.s1":"Ілініс жинақтары",
"k.s2":"Иінді және бөлу біліктері",
"k.s3":"Поршеньдер, клапандар, вкладыштар",
"k.s4":"Генераторлар мен стартерлер",
"k.s5":"Май сорғылары",
"k.s6":"Салқындату және кондиционер радиаторлары",
"k.s7":"Электр желдеткіштер",
"k.s8":"ГРМ жинақтары мен помпалар",
"k.s9":"Вакуумдық күшейткіштер",
"k.more":"Тағы көрсету",
"k.help":"Бөлшекті таппадыңыз ба немесе артикулын білмейсіз бе? Жылдам іріктеу үшін маркасын, жылын және бөлшектің атауын жазыңыз",
"k.wa":"WhatsApp-қа жазу"
};

/* строки, которые рисует скрипт (вне data-i) */
var T = {
 ru:{find:"Начните с поиска: напишите деталь или артикул.",
     found:"Показано позиций: ", more:" · есть ещё",
     none:"Ничего не нашли. Проверьте написание или напишите нам - подберём вручную.",
     relax:"По фразе целиком ничего нет - показываем по словам: ",
     sec:"Раздел: ", secNone:"В этом разделе по вашему запросу ничего нет - уберите лишние слова или откройте раздел целиком.",
     err:"Каталог сейчас не отвечает. Напишите в WhatsApp - подскажем цену и наличие.",
     load:"Ищем…", stockY:"В наличии", stockN:"Под заказ", stockQ:"Уточнить",
     art:"Арт. ", byreq:"Цена по запросу",
     ask:"Здравствуйте! Нужна запчасть: %t%%a%. Подскажите наличие и цену.",
     order:"Заказать"},
 kk:{find:"Іздеуден бастаңыз: бөлшектің атауын немесе артикулын жазыңыз.",
     found:"Көрсетілген позициялар: ", more:" · тағы бар",
     none:"Ештеңе табылмады. Жазылуын тексеріңіз немесе бізге жазыңыз - қолмен іріктейміз.",
     relax:"Тіркес толық түрінде табылмады - мына сөздер бойынша көрсетіп тұрмыз: ",
     sec:"Бөлім: ", secNone:"Бұл бөлімде сұрауыңыз бойынша ештеңе жоқ - артық сөздерді алып тастаңыз немесе бөлімді толық ашыңыз.",
     err:"Каталог қазір жауап бермей тұр. WhatsApp-қа жазыңыз - бағасы мен бар-жоғын айтамыз.",
     load:"Іздеп жатырмыз…", stockY:"Қоймада бар", stockN:"Тапсырыспен", stockQ:"Нақтылау",
     art:"Арт. ", byreq:"Бағасы сұраныс бойынша",
     ask:"Сәлеметсіз бе! Қажет бөлшек: %t%%a%. Бар-жоғы мен бағасын айтыңызшы.",
     order:"Тапсырыс беру"}
};
function t(k){ return T[document.documentElement.lang === "kk" ? "kk" : "ru"][k]; }

var CFG = {markup: 10, cur: "₸", show: true};

/* ---------------- разделы каталога ----------------
   Раздел = товарная группа, которую называет клиент. Слова взяты из самого
   прайса, а не из головы: «Набор сцепления», «Вал коленчатый», «Насос масляный».
   «^» - название позиции НАЧИНАЕТСЯ с этих слов. Без якоря в раздел лезут болты
   и кронштейны: по слову «генератор» в прайсе 887 строк, а сами генераторы - 250,
   и на первой странице (сортировка по алфавиту) были бы одни «Болт генератора».
   Строки внутри раздела соединяются через ИЛИ, раздел с поиском - через И. */
var SECS = {
clutch:    ["^набор сцеплен", "^комплект сцеплен"],
valy:      ["^вал коленчат", "^вал распределит", "^коленвал", "^распредвал"],
porshni:   ["^поршн", "^поршень", "^кольца ", "^вкладыш", "^палец поршнев",
            "^клапан впускн", "^клапан выпускн"],
genstart:  ["^генератор", "^стартер"],
maslonasos:["^насос масл", "^маслонасос"],          /* в прайсе встречается и «маслянный» - ловится */
radiatory: ["^радиатор охлажд", "^радиатор кондиц"],
elvent:    ["^электровентилятор"],                   /* просто «вентилятор» - это салонные на присоске */
grm:       ["^комплект грм", "^набор грм", "^помпа"],
vakuum:    ["^вакуумный усилитель", "^усилитель вакуум"]
};

var q = document.getElementById("kq"), list = document.getElementById("klist"),
    cnt = document.getElementById("kcount"), note = document.getElementById("knote"),
    more = document.getElementById("kmore"), form = document.getElementById("ksearch"),
    clear = document.getElementById("kclear"), onlyBox = document.getElementById("konly"),
    segs = document.getElementById("kbrand"), secs = document.getElementById("ksecs");
if (!q || !list) return;

var state = {q:"", sheet:"", sec:"", only:false, off:{}, items:[], busy:false, seq:0, step:0,
             more:false, used:[]};
var seen = {};

/* ---------------- gviz ---------------- */
function esc(s){ return String(s).replace(/'/g, "''"); }
function gviz(sheet, tq){
  var u = "https://docs.google.com/spreadsheets/d/" + SHEET + "/gviz/tq?tqx=out:json&headers=1" +
          "&sheet=" + encodeURIComponent(sheet) + "&tq=" + encodeURIComponent(tq);
  return fetch(u, {credentials:"omit"}).then(function(r){
    if (!r.ok) throw new Error("http " + r.status);
    return r.text();
  }).then(function(txt){
    var a = txt.indexOf("{"), b = txt.lastIndexOf("}");
    if (a < 0) throw new Error("bad gviz");
    var j = JSON.parse(txt.slice(a, b + 1));
    if (j.status === "error") throw new Error((j.errors && j.errors[0] && j.errors[0].detailed_message) || "gviz error");
    return (j.table && j.table.rows) || [];
  });
}
function cell(row, i){
  var c = row.c && row.c[i];
  if (!c) return "";
  var v = (c.f !== undefined && c.f !== null) ? c.f : c.v;
  return (v === undefined || v === null) ? "" : String(v).trim();
}

/* В прайсе модели написаны латиницей («Granta», «Cobalt»), а ищут их кириллицей -
   поэтому каждое слово разворачиваем в пару вариантов. Работает в обе стороны:
   «Ларгус» в прайсе чаще кириллицей, а набирают «largus». */
var SYN = {
"гранта":"granta","granta":"гранта","веста":"vesta","vesta":"веста","ларгус":"largus","largus":"ларгус",
"нива":"niva","niva":"нива","калина":"kalina","kalina":"калина","приора":"priora","priora":"приора",
"логан":"logan","logan":"логан","дастер":"duster","duster":"дастер","сандеро":"sandero","sandero":"сандеро",
"каптур":"kaptur","kaptur":"каптур","кобальт":"cobalt","cobalt":"кобальт","круз":"cruze","cruze":"круз",
"авео":"aveo","aveo":"авео","нексия":"nexia","nexia":"нексия","лачетти":"lacetti","ласетти":"lacetti",
"lacetti":"лачетти","матиз":"matiz","matiz":"матиз","спарк":"spark","spark":"спарк","каптива":"captiva",
"captiva":"каптива","орландо":"orlando","orlando":"орландо","трекер":"tracker","tracker":"трекер",
"джентра":"gentra","gentra":"джентра","шевроле":"chevrolet","chevrolet":"шевроле","рено":"renault",
"renault":"рено","лада":"lada","lada":"лада","меган":"megane","megane":"меган","оникс":"onix","onix":"оникс",
"дамас":"damas","damas":"дамас","дэу":"daewoo","daewoo":"дэу","равон":"ravon","ravon":"равон",
"клио":"clio","clio":"клио","степвей":"stepway","stepway":"степвей","флюенс":"fluence","fluence":"флюенс",
"трейлблейзер":"trailblazer","эпика":"epica","лабо":"labo","икс-рей":"x-ray","иксрей":"x-ray"
};
/* Грубый стеммер: «колодки» -> «колодк», «тормозные» -> «тормозн».
   Без него поиск по обычной фразе почти всегда даёт пусто - в прайсе единственное число. */
var VOW = "аеёийоуыьюя";
function stem(w){
  var s = w;
  if (s.length < 5) return s;
  for (var i = 0; i < 2; i++){
    if (s.length > 4 && VOW.indexOf(s.charAt(s.length - 1)) >= 0) s = s.slice(0, -1); else break;
  }
  return s;
}
function variants(w){
  var out = [stem(w)];
  [SYN[w], SYN[stem(w)]].forEach(function(v){ if (v && out.indexOf(v) < 0) out.push(v); });
  return out;
}

/* Колонки листа: A № · B Код · C Артикул · D Арт. поставщика · E Товар
   F Бренд · G ЕИ · H Остаток · I Цена */
function secWhere(key){
  var terms = SECS[key];
  if (!terms) return "";
  return "(" + terms.map(function(tm){
    var pre = tm.charAt(0) === "^";
    return "lower(E) like '" + (pre ? "" : "%") + esc(pre ? tm.slice(1) : tm) + "%'";
  }).join(" or ") + ")";
}
function query(words, only, off){
  var w = [];
  if (state.sec) { var sw = secWhere(state.sec); if (sw) w.push(sw); }
  words.forEach(function(x){
    var or = [];
    variants(x.toLowerCase()).forEach(function(v){
      var s = esc(v);
      or.push("lower(E) like '%" + s + "%'", "lower(C) like '%" + s + "%'", "lower(D) like '%" + s + "%'");
    });
    w.push("(" + or.join(" or ") + ")");
  });
  if (only) w.push("H = '+'");
  return "select C,D,E,F,G,H,I" + (w.length ? " where " + w.join(" and ") : "") +
         " order by E limit " + PAGE + " offset " + off;
}

/* ---------------- настройки из таблицы ---------------- */
function loadCfg(){
  var saved = null;
  try { saved = JSON.parse(sessionStorage.getItem("limar-kat-cfg") || "null"); } catch(e){}
  if (saved && saved.ts && Date.now() - saved.ts < 6e5) { CFG = saved.cfg; return Promise.resolve(); }
  return gviz("Настройки", "select A,B").then(function(rows){
    rows.forEach(function(r){
      var k = cell(r, 0).toLowerCase(), v = cell(r, 1);
      if (k.indexOf("наценк") === 0) { var n = parseFloat(v.replace(",", ".")); if (isFinite(n)) CFG.markup = n; }
      if (k.indexOf("валют") === 0 && v) CFG.cur = v;
      if (k.indexOf("показывать") === 0) CFG.show = /да|yes|1/i.test(v);
    });
    try { sessionStorage.setItem("limar-kat-cfg", JSON.stringify({ts:Date.now(), cfg:CFG})); } catch(e){}
  }).catch(function(){ /* настройки не критичны - остаётся 10% */ });
}

/* ---------------- отрисовка ---------------- */
function h(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function money(raw){
  var n = parseFloat(String(raw).replace(/[^\d.,]/g, "").replace(/,/g, "."));
  if (!isFinite(n) || n <= 0) return null;
  return Math.round(n * (1 + CFG.markup / 100) / 10) * 10;
}
function fmt(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

function card(it){
  var p = CFG.show ? money(it.price) : null;
  var stock = it.stock === "+" ? ["yes", t("stockY")] : (it.stock ? ["no", t("stockN")] : ["q", t("stockQ")]);
  var art = it.art || it.art2;
  var ask = t("ask").replace("%t%", it.name).replace("%a%", art ? " (арт. " + art + ")" : "");
  var wa = "https://wa.me/" + WA + "?text=" + encodeURIComponent(ask);
  return '<article class="kitem">' +
    '<div class="kitem-b">' +
      '<h3 class="kitem-h">' + h(it.name) + '</h3>' +
      '<div class="kitem-meta">' +
        (art ? '<span class="kart">' + h(t("art") + art) + '</span>' : "") +
        (it.brand ? '<span class="kbrand">' + h(it.brand) + '</span>' : "") +
      '</div>' +
    '</div>' +
    '<div class="kitem-s">' +
      '<div class="kprice">' + (p ? h(fmt(p) + " " + CFG.cur) : '<span class="kprice-q">' + h(t("byreq")) + '</span>') + '</div>' +
      '<div class="kstock kstock-' + stock[0] + '">' + h(stock[1]) + '</div>' +
      '<a class="btn btn-wa btn-sm" href="' + h(wa) + '" target="_blank" rel="noopener">' +
        '<svg class="i"><use href="#ic-wa"/></svg>' + h(t("order")) + '</a>' +
    '</div>' +
  '</article>';
}

function render(){
  list.innerHTML = state.items.map(card).join("");
  cnt.textContent = state.items.length ? t("found") + state.items.length : "";
}

function setNote(s, cls){ note.textContent = s || ""; note.className = "knote" + (cls ? " " + cls : ""); }

/* Подпись под счётчиком собирается из состояния, а не пишется по месту:
   её же перерисовываем при смене языка. */
function secLabel(){
  var b = secs && secs.querySelector("button.is-active");
  return b ? b.textContent.trim() : "";
}
function noteNow(){
  var parts = [];
  if (state.sec) parts.push(t("sec") + secLabel());
  if (!state.items.length) {
    setNote(parts.concat([state.sec ? t("secNone") : t("none")]).join(" · "), "is-empty");
    return;
  }
  if (state.step > 0 && state.used.length) parts.push(t("relax") + state.used.join(" "));
  if (state.more) parts.push(t("more").replace(/^ · /, ""));
  setNote(parts.join(" · "));
}

/* ---------------- поиск ---------------- */
function sheetsNow(){ return state.sheet ? [state.sheet] : SHEETS; }

/* В прайсе названия короткие («Колодка задняя Granta»), а человек пишет фразой
   («колодки тормозные задние гранта»). Слова соединяются через and, и одно лишнее
   слово обнуляет выдачу. Поэтому если по фразе пусто - пробуем ступеньками:
   деталь + модель (первое и последнее слово), потом одну деталь. Первое слово
   обычно и есть деталь, последнее - модель, поэтому середину отбрасываем первой.
   Чем в итоге искали, пишем под счётчиком. */
function ladder(all){
  var out = [all];
  if (all.length > 2) out.push([all[0], all[all.length - 1]]);
  if (all.length > 1) out.push([all[0]]);
  return out;
}
function run(reset, step){
  var all = state.q.split(/\s+/).filter(Boolean);
  var steps = ladder(all);
  step = step || 0;
  var words = steps[step] || all;
  state.step = step;
  if (!all.length && !state.sec) {            /* ни слова, ни раздела - показывать нечего */
    state.items = []; list.innerHTML = ""; cnt.textContent = "";
    more.hidden = true; setNote(t("find"));
    return;
  }
  if (reset) { state.off = {}; state.items = []; seen = {}; list.innerHTML = ""; }
  var my = ++state.seq;
  state.busy = true; more.disabled = true;
  setNote(t("load"));
  var sh = sheetsNow();
  Promise.all(sh.map(function(name){
    var off = state.off[name] || 0;
    return gviz(name, query(words, state.only, off)).then(function(rows){
      return {name:name, rows:rows};
    });
  })).then(function(res){
    if (my !== state.seq) return;                     /* пришёл ответ на старый запрос */
    var got = 0, hasMore = false;
    res.forEach(function(r){
      state.off[r.name] = (state.off[r.name] || 0) + r.rows.length;
      if (r.rows.length === PAGE) hasMore = true;
      got += r.rows.length;
      r.rows.forEach(function(row){
        var it = {art:cell(row,0), art2:cell(row,1), name:cell(row,2),
                  brand:cell(row,3), unit:cell(row,4), stock:cell(row,5), price:cell(row,6)};
        /* одна и та же деталь лежит и в LADA, и в LargusRenault - показываем один раз */
        var key = (it.art || it.art2) + "|" + it.name + "|" + it.brand;
        if (seen[key]) return;
        seen[key] = 1;
        state.items.push(it);
      });
    });
    /* Сначала то, где слово стоит в начале названия: по запросу «колодка» человек ждёт
       тормозные колодки, а не «Клеммы (колодка гнездовая…)». */
    var key0 = words.length ? variants(words[0].toLowerCase())[0] : "";
    state.items.sort(function(a, b){
      if (key0) {
        var ia = a.name.toLowerCase().indexOf(key0), ib = b.name.toLowerCase().indexOf(key0);
        if (ia < 0) ia = 999; if (ib < 0) ib = 999;
        if (ia !== ib) return ia - ib;
      }
      return a.name.localeCompare(b.name, "ru");
    });
    if (!state.items.length && step + 1 < steps.length) {   /* фраза не нашлась - следующая ступенька */
      state.busy = false;
      run(true, step + 1);
      return;
    }
    render();
    more.hidden = !hasMore; more.disabled = false;
    state.more = hasMore; state.used = words;
    noteNow();
    state.busy = false;
  }).catch(function(e){
    if (my !== state.seq) return;
    state.busy = false; more.disabled = false; more.hidden = true;
    setNote(t("err"), "is-err");
    if (window.console) console.warn("каталог:", e && e.message);
  });
}

var timer;
function schedule(reset){ clearTimeout(timer); timer = setTimeout(function(){ run(reset); }, 420); }

q.addEventListener("input", function(){
  state.q = q.value.trim();
  clear.hidden = !q.value;
  schedule(true);
});
form.addEventListener("submit", function(e){ e.preventDefault(); clearTimeout(timer); state.q = q.value.trim(); run(true); q.blur(); });
clear.addEventListener("click", function(){ q.value = ""; clear.hidden = true; state.q = ""; run(true); q.focus(); });
more.addEventListener("click", function(){ if (!state.busy) run(false, state.step); });
onlyBox.addEventListener("change", function(){ state.only = onlyBox.checked; run(true); });
segs.querySelectorAll("button").forEach(function(b){
  b.addEventListener("click", function(){
    segs.querySelectorAll("button").forEach(function(x){
      var on = x === b;
      x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", on ? "true" : "false");
    });
    state.sheet = b.dataset.sheet || "";
    run(true);
  });
});
/* Разделы. Кнопка не пишет ничего в строку поиска: раздел - это фильтр,
   он складывается с набранным текстом, маркой и галочкой наличия.
   Повторный клик по активной кнопке выключает раздел. */
function markSecs(key){
  secs.querySelectorAll("button").forEach(function(x){
    var on = !!key && x.dataset.sec === key;
    x.classList.toggle("is-active", on);
    x.setAttribute("aria-pressed", on ? "true" : "false");
  });
}
function toResults(){
  /* переход считает script.js - тот же расчёт, что у пунктов меню */
  if (window.limarGoAnchor) window.limarGoAnchor("rezultaty", false);
  else document.getElementById("rezultaty").scrollIntoView({behavior:"smooth", block:"start"});
}
secs.querySelectorAll("button").forEach(function(b){
  b.addEventListener("click", function(){
    var on = state.sec !== b.dataset.sec;
    state.sec = on ? b.dataset.sec : "";
    markSecs(state.sec);
    run(true);
    if (on) toResults();
  });
});

/* язык мог смениться - перерисовываем подписи */
addEventListener("limar:lang", function(){
  if (state.items.length) { render(); noteNow(); }
  else if (state.q || state.sec) noteNow();
  else setNote(t("find"));
});

/* ---------------- старт ---------------- */
/* ?q= - готовый запрос, ?sec= - открытый раздел (пригодится для ссылок из рекламы) */
var par = new URLSearchParams(location.search);
var start = par.get("q") || "", startSec = par.get("sec") || "";
if (startSec && SECS[startSec]) { state.sec = startSec; markSecs(startSec); }
loadCfg().then(function(){
  if (start) { q.value = start; clear.hidden = false; state.q = start.trim(); }
  if (start || state.sec) run(true);
  else setNote(t("find"));
});
})();
