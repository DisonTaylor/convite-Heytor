(function () {
  "use strict";
  var NUM = "5584987251474";
  var ALVO = new Date("2026-11-29T17:00:00-03:00").getTime();
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- contagem regressiva ---------- */
  function tick() {
    var s = Math.floor(Math.max(0, ALVO - Date.now()) / 1000);
    $("d").firstChild.nodeValue = Math.floor(s / 86400);
    $("h").firstChild.nodeValue = Math.floor(s % 86400 / 3600);
    $("m").firstChild.nodeValue = Math.floor(s % 3600 / 60);
    $("s").firstChild.nodeValue = s % 60;
  }
  tick(); setInterval(tick, 1000);

  /* ---------- linhas de velocidade ---------- */
  var speed = $("speed");
  for (var i = 0; i < 18; i++) {
    var l = document.createElement("i");
    l.style.top = Math.random() * 100 + "%";
    l.style.width = (80 + Math.random() * 220) + "px";
    l.style.opacity = (0.25 + Math.random() * 0.6).toFixed(2);
    l.style.animationDuration = (0.7 + Math.random() * 1.3) + "s";
    l.style.animationDelay = (-Math.random() * 2) + "s";
    speed.appendChild(l);
  }

  /* ---------- fogo: bolinhas vermelhas ---------- */
  var cv = $("fogo"), ctx = cv.getContext("2d"), W = 0, H = 0, parts = [];
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize(); window.addEventListener("resize", resize);

  function nova(x, y, vx, vy, r, vida) {
    if (parts.length > 450) return;
    parts.push({ x: x, y: y, vx: vx, vy: vy, r: r, vida: vida, max: vida });
  }

  var carros = document.querySelectorAll(".car");

  function frame() {
    ctx.clearRect(0, 0, W, H);

    /* brasas subindo do rodapé */
    for (var k = 0; k < 2; k++) {
      nova(Math.random() * W, H + 6, (Math.random() - 0.5) * 0.8,
           -(1 + Math.random() * 2.2), 2 + Math.random() * 4, 70 + Math.random() * 60);
    }
    /* chamas atrás de cada carro */
    for (var c = 0; c < carros.length; c++) {
      var b = carros[c].getBoundingClientRect();
      if (b.right < 0 || b.left > W) continue;
      for (var n = 0; n < 3; n++) {
        nova(b.left + 8, b.top + b.height * 0.7 + (Math.random() - 0.5) * 12,
             -(2 + Math.random() * 3), -(Math.random() * 1.2),
             3 + Math.random() * 5, 22 + Math.random() * 20);
      }
    }

    ctx.globalCompositeOperation = "lighter";
    for (var p = parts.length - 1; p >= 0; p--) {
      var q = parts[p];
      q.x += q.vx; q.y += q.vy; q.vy -= 0.01; q.vida--;
      if (q.vida <= 0) { parts.splice(p, 1); continue; }
      var t = q.vida / q.max, rr = q.r * (0.4 + t);
      var g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, rr * 2.2);
      g.addColorStop(0, "rgba(255," + Math.floor(180 * t) + ",40," + (0.95 * t) + ")");
      g.addColorStop(0.45, "rgba(235,30,30," + (0.8 * t) + ")");
      g.addColorStop(1, "rgba(200,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(q.x, q.y, rr * 2.2, 0, 6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(frame);
  }
  if (!reduz) requestAnimationFrame(frame);

  /* ---------- confete ao confirmar ---------- */
  function confete() {
    var em = ["⭐", "🏁", "🔥", "🏎️", "✨"];
    for (var j = 0; j < 36; j++) {
      var e = document.createElement("span");
      e.className = "conf"; e.textContent = em[j % em.length];
      e.style.left = Math.random() * 100 + "vw";
      e.style.animationDuration = (2 + Math.random() * 2.5) + "s";
      e.style.animationDelay = Math.random() * 0.6 + "s";
      document.body.appendChild(e);
      setTimeout(function (x) { x.remove(); }, 5500, e);
    }
  }

  /* ---------- confirmação por WhatsApp ---------- */
  function atualizaZap() {
    var n = $("nome").value.trim(), q = $("qtd").value;
    var msg = "Olá! Confirmo presença na festa Hot Wheels de 7 anos do Heytor Taylor (29/11/2026, 17h)." +
      (n ? " Nome: " + n + "." : "") + " Total de pessoas: " + q + ".";
    $("zap").href = "https://wa.me/" + NUM + "?text=" + encodeURIComponent(msg);
  }
  atualizaZap();
  $("nome").addEventListener("input", atualizaZap);
  $("qtd").addEventListener("change", atualizaZap);
  $("zap").addEventListener("click", function (e) {
    if (!$("nome").value.trim()) {
      e.preventDefault();
      $("aviso").textContent = "Digite seu nome antes de confirmar 😉";
      $("nome").focus();
    } else { $("aviso").textContent = ""; confete(); }
  });
})();
