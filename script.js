const coin = document.getElementById("coin");
const btn = document.getElementById("coinBtn");
const result = document.getElementById("result");
const stage = coin.closest(".stage");

const optA = document.getElementById("optA");
const optB = document.getElementById("optB");
const prevA = document.getElementById("prevA");
const prevB = document.getElementById("prevB");
const resetBtn = document.getElementById("resetBtn");

let isFlipping = false;
let currentFace = "heads";

function setVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function getFlipDurationMs() {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--flipDuration")
    .trim();

  if (v.endsWith("ms")) return parseFloat(v);
  if (v.endsWith("s")) return parseFloat(v) * 1000;
  return 1450;
}

function sanitizeLabel(s, fallback){
  const t = (s || "").trim();
  return t.length ? t : fallback;
}

function updatePreviews(){
  const a = sanitizeLabel(optA.value, "Heads");
  const b = sanitizeLabel(optB.value, "Tails");
  prevA.textContent = a;
  prevB.textContent = b;
  localStorage.setItem("coin_optA", a);
  localStorage.setItem("coin_optB", b);
}

function loadSaved(){
  const a = localStorage.getItem("coin_optA");
  const b = localStorage.getItem("coin_optB");
  optA.value = a ?? "Heads";
  optB.value = b ?? "Tails";
  updatePreviews();
}

// Initialize
coin.classList.add("idle");
setVar("--endRot", "0deg");
setVar("--endYaw", "0deg");

loadSaved();
optA.addEventListener("input", updatePreviews);
optB.addEventListener("input", updatePreviews);

resetBtn.addEventListener("click", () => {
  optA.value = "Heads";
  optB.value = "Tails";
  updatePreviews();
  result.textContent = "—";
});

function flipCoin() {
  if (isFlipping) return;
  isFlipping = true;

  const outcome = Math.random() < 0.5 ? "heads" : "tails";

  const startRot = currentFace === "heads" ? "0deg" : "180deg";
  const endRot = outcome === "heads" ? "0deg" : "180deg";

  // Realistic spin: 3 to 6 full turns
  const fullTurns = 3 + Math.floor(Math.random() * 4); // 3,4,5,6
  const spinDeg = `${fullTurns * 360}deg`;

  const endYaw = `${(Math.random() * 18 - 9).toFixed(1)}deg`;
  const tiltStart = `${(10 + Math.random() * 10).toFixed(1)}deg`;

  setVar("--startRot", startRot);
  setVar("--endRot", endRot);
  setVar("--spinDeg", spinDeg);
  setVar("--endYaw", endYaw);
  setVar("--tiltStart", tiltStart);
  setVar("--tiltEnd", "0deg");

  result.textContent = "Flipping…";

  // Restart animations cleanly
  coin.classList.remove("idle", "flipping");
  stage.classList.remove("shadow-fly");
  void coin.offsetWidth;

  stage.classList.add("shadow-fly");
  coin.classList.add("flipping");

  window.setTimeout(() => {
    coin.classList.remove("flipping");
    coin.classList.add("idle");
    stage.classList.remove("shadow-fly");

    currentFace = outcome;

    const labelA = sanitizeLabel(optA.value, "Heads");
    const labelB = sanitizeLabel(optB.value, "Tails");

    result.textContent = outcome === "heads" ? labelA : labelB;
    isFlipping = false;
  }, getFlipDurationMs());
}

btn.addEventListener("click", flipCoin);
