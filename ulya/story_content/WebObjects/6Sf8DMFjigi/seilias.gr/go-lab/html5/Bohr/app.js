/*!
 * © by Sitsanlis Ilias
 * This notice shall be included in all copies or substantial portions of the Software.
 * Creative Commons 4.0/CC BY - NC - SA 4.0.
 */

helpText.text =
  "Στο  πρότυπο του Bohr για το άτομο του υδρογόνου το ηλεκτρόνιο εκτελεί ομαλή κυκλική κίνηση σε καλά καθορισμένες τροχιές που ονομάζονται στοιβάδες. Η 1η στοιβάδα αντιστοιχεί για n=1 η δεύτερη για n=2 κ.ο.κ. Όταν το ηλεκτρόνιο απορροφήσει κατάλληλη ενέργεια μεταβαίνει σε στοιβάδα με μεγαλύτερο n. Σε αυτήν την διεγερμένη κατάσταση μένει για πολύ μικρό χρονικό διάστημα και πέφτει σε στοιβάδα μικρότερης ενέργειας εκπέμποντας ένα φωτόνιο. Η ενέργεια του εκπεμπόμενου φωτονίου εξαρτάται από την αρχική και τελική στοιβάδα. Όταν το ηλεκτρόνιο πέφτει στην στοιβάδα n=2 τα φωτόνια που εκπέμπονται βρίσκονται στην ορατή περιοχή.\nΓια την λειτουργία της προσομοίωσεις μπορείτε να  σύρετε το ηλετρόνιο σε μια στοιβάδα ή να κάνετε κλικ σε κάποια στιβάδα και το ηλεκτρόνιο θα μεταβεί σε αυτήν. Αν η τελική στοιβάδα είναι χαμηλότερης ενέργειας τότε εκπέμπεται ένα φωτόνιο. Αν τελική στοιβάδα είναι μεγαλύτερης ενέργειας τότε η μετάβαση αντιστοιχεί σε διέγερση. Οταν η εφαρμογή εκτελείται τότε για να διεγερθεί - αποδιεγερθεί αρκεί να κάνουμε κλικ σε κάποια στοιβάδα και μετά από κάποιο χρονικό διάστημα το ηλεκτρόνιο αποδιεγείρεται και με διαδοχικά βήματα καταλείγει στην βασική του κατάσταση.";

var canvas,
  stage,
  self,
  controlBoxContainer,
  marginVarNumber = 91,
  marginVar = marginVarNumber,
  PI = Math.PI,
  toDeg = 180 / PI,
  toRad = PI / 180,
  X0 = 0,
  Y0 = 200,
  Xa = 210,
  Ya = 370,
  t = 0,
  dt = 1 / 120,
  dtInitial = dt,
  dtSlow = dt,
  factor = 0.5,
  playMovie = !1,
  framePlay = !1,
  xScale = 35e10,
  yScale = -xScale,
  FScale = 10,
  vectorScale = 1,
  valuesText = new createjs.Text("", "12px Trebuchet MS");
valuesText.set({ x: 360, y: 50, textAlign: "center" });
var ω,
  r,
  x,
  y,
  f,
  c = 3e8,
  h = 66261e-38,
  hb = (0.5 * h) / Math.PI,
  ε0 = 88542e-16,
  kc = 1 / (4 * Math.PI * ε0),
  m = 91094e-35,
  e = 16022e-23,
  r1 = 52918e-15,
  E1 = -13.6,
  eV = 16e-20,
  n = 1,
  ni = n,
  nf = n,
  dr = 0,
  drFinal = 0,
  colorBox = new createjs.Container();
(colorBox.x = Xa), (colorBox.y = Ya);
var path = new createjs.Container();
(path.x = X0), (path.y = Y0);
var RVector = createVector("#0000FF", !1, !1, !1);
RVector.setScaleX(0), (RVector.y = Y0);
var electron = makeDragPoint("electron", "#FFFF99");
electron.addEventListener("mousedown", mouseDownGen),
  electron.addEventListener("pressup", pressUpGen),
  (electron.mouseChildren = !1);
var proton = pTextShape(),
  shapeMask = new createjs.Shape();
shapeMask.graphics.drawRect(0, 80, 720, 240), (path.mask = shapeMask);
var photon = new createjs.Shape();
photon.rotation = -45;
var scale = new createjs.Container();
(scale.x = Xa), (scale.y = Ya);
var stageUpdateFlag = !1,
  numbers = new createjs.Container(),
  tR = 0,
  energySCALE = 14,
  Xe = 510,
  Ye = 80,
  energyContainer = new createjs.Container(),
  energyVectors = new createjs.Container(),
  currentLevel = new createjs.Shape(),
  energyText = new createjs.Text("", "10px Trebuchet MS"),
  energyLevelText = new createjs.Text("", "10px Trebuchet MS"),
  count = 0,
  Ep = 12.09,
  particles = new createjs.Container(),
  tM = 2;
function init() {
  (stage = new createjs.Stage(document.getElementById("demoCanvas"))),
    createjs.Touch.enable(stage),
    stage.enableMouseOver(),
    stage.enableDOMEvents(!0),
    (canvas = document.getElementById("demoCanvas")),
    (self = stage),
    (controlBoxContainer = new createjs.Container()),
    self.addChild(controlBoxContainer);
  var e = new createjs.DOMElement("foo");
  controlBoxContainer.addChild(e),
    (controlBoxContainer.x = 2.5),
    (controlBoxContainer.y = 2.5),
    stage.addChild(proton),
    stage.addChild(colorBox),
    stage.addChild(path),
    stage.addChild(RVector),
    stage.addChild(electron),
    stage.addChild(shapeMask),
    stage.addChild(photon),
    stage.addChild(scale),
    stage.addChild(numbers),
    stage.addChild(particles),
    stage.addChild(valuesText),
    stage.addChild(energyContainer),
    createRegister(),
    stage.addChild(Ψ),
    addFunction(),
    showHideVariables(),
    handleComplete(),
    initialize(),
    (createjs.Ticker.timingMode = createjs.Ticker.RAF),
    createjs.Ticker.addEventListener("tick", tick),
    (canvas.style.visibility = "visible"),
    (document.getElementById("variables").style.visibility = "visible");
}
function initialize() {
  drawColorBox(),
    drawBasicEnergyContainer(),
    drawPath(),
    drawScale(scale, "#FFFFFF"),
    (proton.x = X0),
    (proton.y = Y0),
    restart();
}
function restart() {
  isOk || stage.removeAllChildren(),
    -10 == electron.x && (valuesText.text = ""),
    (nf = ni = n),
    isNaN(n) && (nf = ni = n = 1),
    (tR = t = 0),
    (tM = 1),
    (ω = (hb / m / r1 / r1 / n / n / n) * 1e-15),
    (x = (r = n * n * r1) * Math.cos(ω * t)),
    (y = r * Math.sin(ω * t)),
    positions();
}
function tick(e) {
  stageUpdateFlag && stage.update(),
    playMovie &&
      ((framePlay = framePlay && (playMovie = !1)),
      (tR += dt),
      (tM += dt),
      1 < n &&
        1 < tR &&
        ((stageUpdateFlag = !0),
        (tR = 0),
        (nf = rnd(1, ni - 1)),
        returnTo(ni, nf)),
      0 <= t + dt &&
        t <= 100 &&
        ((t += dt),
        (x = r * Math.cos(ω * t)),
        (y = r * Math.sin(ω * t)),
        positions()));
}
function positions() {
  (electron.x = X0 + x * xScale),
    (electron.y = Y0 + y * yScale),
    stage.update();
}
function drawColorBox() {
  colorBox.removeAllChildren();
  var e = new createjs.Shape();
  e.graphics
    .beginStroke("#000000")
    .beginFill("#000000")
    .setStrokeStyle(0)
    .dr(0, 0, 300, 20),
    colorBox.addChild(e);
}
function drawBasicEnergyContainer() {
  energyContainer.set({ x: 477.5, y: 80 });
  var e = new createjs.Shape();
  e.set({ x: 70, y: 30 });
  var t = new createjs.Shape();
  t.graphics.s("#666").ss(1).f("#FFDAB9").r(0, 0, 160, 240),
    energyContainer.addChild(t),
    t.addEventListener("mousedown", mouseDownBack),
    t.addEventListener("pressup", pressUpBack);
  var a = new createjs.Shape(),
    r = a.graphics;
  for (
    r.f("#FFDAB9"),
      r.r(-19, -9, 28, 28),
      r.setStrokeStyle(3).beginStroke("#ff0000"),
      r.mt(-4, -4).lt(4, 4),
      r.mt(-4, 4).lt(4, -4),
      a.x = 150,
      a.y = 10,
      a.on("click", function (e) {
        $("#energyCh").click();
      }),
      energyContainer.addChild(a),
      (n = new createjs.Text("Energy Chart", "10px Trebuchet MS")).set({
        x: 70,
        y: 6,
        textAlign: "center",
      }),
      energyContainer.addChild(n),
      i = 1;
    i <= 18;
    i++
  ) {
    var n,
      s = -13.6 / (i * i);
    if (
      (e.graphics
        .ss(1)
        .s("#999")
        .mt(-35, -s * energySCALE)
        .lt(35, -s * energySCALE),
      i <= 3)
    )
      (n = new createjs.Text("n = " + i, "10px Trebuchet MS", "#999")).set({
        x: 8,
        y: 30 - s * energySCALE - 5,
        textAlign: "left",
      }),
        energyContainer.addChild(n),
        (n = new createjs.Text(
          s.toFixed(2) + " eV",
          "10px Trebuchet MS",
          "#999"
        )).set({ x: 110, y: 30 - s * energySCALE - 5, textAlign: "left" }),
        energyContainer.addChild(n);
  }
  energyContainer.addChild(e),
    currentLevel.graphics.s("#000").ss(2).mt(-35, 0).lt(35, 0),
    (energyLevelText.regY = energyText.regY = currentLevel.regY = -30),
    (currentLevel.x = 70),
    (energyText.x = 110),
    (energyLevelText.x = 8),
    updateEnergyLevel(1),
    energyContainer.addChild(currentLevel),
    energyContainer.addChild(energyText),
    energyContainer.addChild(energyLevelText),
    energyContainer.addChild(energyVectors),
    (energyContainer.visible = !1);
}
function fireParticle() {
  var t = new createjs.Shape(),
    a = (Ep * e) / h,
    r = RGB((c / a) * 1e9),
    n = r.S,
    i = ((c / a) * xScale) / 2e4;
  30 < i && (i = 30), i < 5 && (i = 5);
  t.graphics.clear().ss(1.5).s(n).mt(0, 0);
  for (var s = Math.round(60 / i), o = 0, l = 0; l <= s; l++) {
    o += 0.5 / (s + 1);
    var d = "rgba(" + r.R + "," + r.G + "," + r.B + "," + o + ")";
    t.graphics.ss(1.5).s(d),
      t.graphics.mt(l * i, 0).qt(i / 4 + l * i, -6, i / 2 + l * i, 0),
      (o += 0.5 / (s + 1));
    d = "rgba(" + r.R + "," + r.G + "," + r.B + "," + o + ")";
    t.graphics.ss(1.5).s(d),
      t.graphics.mt(i / 2 + l * i, 0).qt((3 * i) / 4 + l * i, 6, i + l * i, 0);
  }
  (t.rotation = 180),
    (t.x = 720),
    (t.y = 200),
    t.addEventListener("tick", particleTick),
    (stageUpdateFlag = !0),
    particles.addChild(t);
}
function particleTick(e) {
  var t = e.target;
  if (0 < t.x) {
    t.x += (-9 * dtSlow) / dtInitial;
    var a = electron.x - t.x,
      r = electron.y - t.y;
    if (Math.sqrt(a * a + r * r) < 10 && 1 <= tM) {
      var i = -13.6 / ni / ni;
      if (0 <= Ep + i)
        (n = ni = s = NaN),
          destrotePartivle(t),
          (electron.x = -10),
          (valuesText.text =
            "The atom will ionize and the electron will gain kinetic energy : " +
            Number((Ep + i).toFixed(2)) +
            " eV"),
          playMovie && $("#play").trigger("click");
      else {
        var s = 1 / Math.sqrt(1 / (ni * ni) - Ep / 13.6);
        (s = Math.round(s)),
          round(-13.6 / s / s + 13.6 / ni / ni, 2) == Ep &&
            (returnTo(ni, s), destrotePartivle(t), (tM = playMovie ? 0 : 1));
      }
    }
  } else destrotePartivle(t);
}
function destrotePartivle(e) {
  e.removeEventListener("tick", particleTick),
    particles.removeChild(e),
    0 == particles.numChildren && (stageUpdateFlag = !1);
}
