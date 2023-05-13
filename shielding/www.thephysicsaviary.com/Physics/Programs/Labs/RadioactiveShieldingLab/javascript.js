XPOS = new Array();
YPOS = new Array();
ZPOS = new Array();
XSPEED = new Array();
YSPEED = new Array();
ZSPEED = new Array();
TRIGGERTIME = new Array();
MOVING = new Array();
ESCAPESTATUS = new Array();

SampleName = new Array("Radium 226", "Carbon 14", "Barium 137");
SampleSymbol = new Array("Ra-226", "C-14", "Ba-137");
SampleDecayParticle = new Array("α", "β", "ɣ");
SampleParticleSpeed = new Array(100, 200, 400);
SampleParticleSize = new Array(4, 2, 1);
SampleParticleColor = new Array("#37ff3c", "#7200ff", "#ff0000");

MaterialForShield = new Array("Lead", "Concrete", "Aluminum", "Steel", "Air");
MaterialColor = new Array(
  "#6a6a6a",
  "#f1d3c6",
  "#c0c0c0",
  "#d0d3cc",
  "#FFFFFF"
);
MaterialLineColor = new Array(
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#FFFFFF"
);
MaterialThickness = new Array();
//To be used for Gamma radiation with thickness in mm
GammaShieldConstant = new Array(0.0693, 0.0114, 0.0135, 0.0277, 0);
BetaShieldConstant = new Array(0.648, 0.0866, 0.154, 0.3466, 0);
AlphaShieldConstant = new Array(10, 10, 10, 10, 0);

/* called by onLoad */

function initialize() {
  theCanvas = document.getElementById("CanvasOne");
  ctx = theCanvas.getContext("2d");

  SampleDecayRate = Math.floor(Math.random() * 100 + 150) * 10;

  SampleWidth = 100;
  AbsorbedCount = 0;

  DistanceToDetector = Math.floor(Math.random() * 20 + 100);

  MaterialThickness[0] = Math.floor(Math.random() * 3 + 5) / 10;
  MaterialThickness[1] = Math.floor(Math.random() * 8 + 10) / 10;
  MaterialThickness[2] = Math.floor(Math.random() * 15 + 20) / 10;
  MaterialThickness[3] = Math.floor(Math.random() * 20 + 40) / 10;
  MaterialThickness[4] = Math.floor(Math.random() * 25 + 70) / 10;
  MaterialThickness[5] = Math.floor(Math.random() * 40 + 100) / 10;
  MaterialThickness[6] = Math.floor(Math.random() * 40 + 150) / 10;
  MaterialThickness[7] = Math.floor(Math.random() * 40 + 200) / 10;
  MaterialThickness[8] = Math.floor(Math.random() * 40 + 250) / 10;
  MaterialThickness[9] = Math.floor(Math.random() * 40 + 300) / 10;

  samplenumber = 2;
  materialnumber = 2;
  thicknessnumber = 6;
  detectorheight = 300;
  detectorsize = 50;
  elapsedtime = 0;
  timertime = 0;
  deltatime = 0.02;
  ParticleSize = SampleParticleSize[samplenumber];
  SPEED = SampleParticleSpeed[samplenumber];
  Counts = 0;
  hold = "no";
  CalculateParticles();
}

function CalculateParticles() {
  for (i = 0; i <= SampleDecayRate; i++) {
    XPOS[i] = 550;
    YPOS[i] = 550;
    ZPOS[i] = 1000;
    ANGZ = Math.random() * 1 * Math.PI - Math.PI / 2;
    ANG = Math.random() * 2 * Math.PI;
    XYPLANESPEED = SPEED * Math.cos(ANGZ);
    ZSPEED[i] = SPEED * Math.sin(ANGZ);
    XSPEED[i] = XYPLANESPEED * Math.cos(ANG);
    YSPEED[i] = XYPLANESPEED * Math.sin(ANG);
    TRIGGERTIME[i] = Math.random() * 10;
    MOVING[i] = "no";
    ESCAPESTATUS[i] = "untested";
  }
}

/* Called by the Begin Button */

function LoadIt() {
  document.getElementById("LabSection").style.visibility = "visible";
  document.getElementById("OverviewSection").style.visibility = "hidden";
  StartItMoving = setInterval(drawingpart, 20);
}

function drawingpart() {
  /* 	background drawing */

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 900, 600);
  elapsedtime = elapsedtime + deltatime;
  timertime = timertime + deltatime;

  DrawParticles();

  DrawLabTable(-10, 580, 800, 20);

  DrawRadiationVial(550, 550, 50);

  DrawDetector();
  DrawTimer(675, 5, 220, 100);

  DrawIsotopeInfo(5, 5, 350, 150);

  DrawShieldInfo(675, 210, 220, 300);

  DrawReadOutMachine(5, 330, 400, 250);

  DrawParticles1();

  WriteText(
    200,
    250,
    "Jarak benda ke detektor:  " + DistanceToDetector.toFixed(0) + " mm",
    20,
    "#990000",
    0.5
  );
}

function DrawReadOutMachine(x, y, w, h) {
  DCScale = w / 400;
  DrawRectangle(x, y, w, h, 3, "#000000", "#c0c0c0", 1);

  //  top lines
  ctx.lineWidth = 1 * DCScale;
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(x + 0.0 * w, y + 0.03 * h);
  ctx.lineTo(x + 1.0 * w, y + 0.03 * h);

  ctx.moveTo(x + 0.0 * w, y + 0.2 * h);
  ctx.lineTo(x + 1.0 * w, y + 0.2 * h);

  ctx.stroke();

  // Thornton Logo
  ctx.lineWidth = 3 * DCScale;
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(x + 0.02 * w, y + 0.07 * h);
  ctx.lineTo(x + 0.19 * w, y + 0.07 * h);

  ctx.moveTo(x + 0.01 * w, y + 0.14 * h);
  ctx.lineTo(x + 0.18 * w, y + 0.14 * h);
  ctx.stroke();

  WriteText(
    x + 0.02 * w,
    y + 0.12 * h,
    "FISMOD UNM",
    "italic " + 0.04 * h,
    "#000000",
    0
  );
  WriteText(
    x + 0.01 * w,
    y + 0.18 * h,
    "FUTRI PRODUCTION",
    "italic " + 0.027 * h,
    "#000000",
    0
  );

  WriteText(
    x + 0.5 * w,
    y + 0.11 * h,
    "Pencacah Bilangan",
    0.05 * h,
    "#000000",
    0.5
  );

  // Display

  DrawRectangle(
    x + 0.1 * w,
    y + 0.3 * h,
    0.5 * w,
    0.3 * h,
    3,
    "#000000",
    "#210d0a",
    1
  );

  // Reset

  WriteText(x + 0.2 * w, y + 0.92 * h, "Reset", 0.06 * h, "#000000", 0.5);
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#990000";
  ctx.beginPath();
  ctx.arc(x + 0.1 * w, y + 0.9 * h, 0.05 * h, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  // Hold

  WriteText(x + 0.8 * w, y + 0.92 * h, "Hold", 0.06 * h, "#000000", 0.5);
  ctx.strokeStyle = "#000000";
  if (hold == "no") {
    ctx.fillStyle = "#990000";
  } else {
    ctx.fillStyle = "#FF0000";
  }

  ctx.beginPath();
  ctx.arc(x + 0.7 * w, y + 0.9 * h, 0.05 * h, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  if (hold == "no") {
    WriteText(
      x + 0.55 * w,
      y + 0.53 * h,
      Counts.toFixed(0),
      0.2 * h,
      "#990000",
      1.0
    );
  } else {
    WriteText(
      x + 0.55 * w,
      y + 0.53 * h,
      StoredCounts.toFixed(0),
      0.2 * h,
      "#990000",
      1.0
    );
  }

  // Ports

  ctx.strokeStyle = "#990000";
  ctx.fillStyle = "#000000";
  ctx.lineWidth = 0.03 * h;
  ctx.beginPath();
  ctx.arc(x + 0.05 * w, y + 0.4 * h, 0.03 * h, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + 0.05 * w, y + 0.6 * h, 0.03 * h, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + 0.85 * w, y + 0.5 * h, 0.03 * h, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  //  Wire
  ctx.fillStyle = "#aea4ab";
  ctx.beginPath();
  ctx.arc(x + 0.85 * w, y + 0.5 * h, 0.03 * h, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = "#aea4ab";
  ctx.lineWidth = 0.06 * h;
  ctx.beginPath();
  ctx.moveTo(x + 0.85 * w, y + 0.5 * h);
  ctx.lineTo(x + 0.95 * w, y + 0.5 * h);
  ctx.arc(x + 0.95 * w, y + 0.5 * h - 0.1 * h, 0.1 * h, 0.5 * Math.PI, 0, true);
  ctx.lineTo(x + 0.95 * w + 0.1 * h, y - 0.5 * h);
  ctx.stroke();
}

function DrawDetector() {
  xr = 650;
  xl = 450;
  yb = 580;
  yt = yb - DistanceToDetector - detectorheight;

  width = xr - xl;
  ctx.fillStyle = "#333333";
  ctx.beginPath();
  ctx.moveTo(
    xl + 0.5 * width - 0.5 * detectorsize,
    yb - 40 - DistanceToDetector
  );
  ctx.lineTo(
    xl + 0.5 * width - 0.5 * detectorsize,
    yb - 40 - DistanceToDetector - detectorheight
  );
  ctx.lineTo(
    xl + 0.5 * width + 0.5 * detectorsize,
    yb - 40 - DistanceToDetector - detectorheight
  );
  ctx.lineTo(
    xl + 0.5 * width + 0.5 * detectorsize,
    yb - 40 - DistanceToDetector
  );
  ctx.lineTo(
    xl + 0.5 * width - 0.5 * detectorsize,
    yb - 40 - DistanceToDetector
  );
  ctx.fill();

  ctx.fillStyle = "#888888";
  ctx.beginPath();
  ctx.moveTo(
    xl + 0.5 * width - 0.5 * detectorsize,
    yb - 40 - DistanceToDetector - detectorheight + 10
  );
  ctx.lineTo(
    xl + 0.5 * width - 0.5 * detectorsize,
    yb - 40 - DistanceToDetector - detectorheight
  );
  ctx.lineTo(
    xl + 0.5 * width + 0.5 * detectorsize,
    yb - 40 - DistanceToDetector - detectorheight
  );
  ctx.lineTo(
    xl + 0.5 * width + 0.5 * detectorsize,
    yb - 40 - DistanceToDetector - detectorheight + 10
  );
  ctx.lineTo(
    xl + 0.5 * width - 0.5 * detectorsize,
    yb - 40 - DistanceToDetector - detectorheight + 10
  );
  ctx.fill();

  ctx.fillStyle = "#FF0000";
  ctx.beginPath();
  ctx.moveTo(
    xl + 0.5 * width - 0.5 * detectorsize,
    yb - 40 - DistanceToDetector
  );
  ctx.lineTo(
    xl + 0.5 * width - 0.5 * detectorsize,
    yb - 20 - DistanceToDetector
  );
  ctx.lineTo(
    xl + 0.5 * width + 0.5 * detectorsize,
    yb - 20 - DistanceToDetector
  );
  ctx.lineTo(
    xl + 0.5 * width + 0.5 * detectorsize,
    yb - 40 - DistanceToDetector
  );
  ctx.lineTo(
    xl + 0.5 * width - 0.5 * detectorsize,
    yb - 40 - DistanceToDetector
  );
  ctx.fill();

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(xl - 20, yb);
  ctx.lineTo(xl, yb);
  ctx.lineTo(xl, yt);

  ctx.moveTo(xr + 20, yb);
  ctx.lineTo(xr, yb);
  ctx.lineTo(xr, yt);

  ctx.moveTo(xl, yb - 40 - DistanceToDetector);
  ctx.lineTo(xr, yb - 40 - DistanceToDetector);

  ctx.moveTo(xl, yt + 30);
  ctx.lineTo(xr, yt + 30);

  ctx.moveTo(xl, yb - 70);
  ctx.lineTo(xl + 30, yb - 70);

  ctx.moveTo(xr, yb - 70);
  ctx.lineTo(xr - 30, yb - 70);

  ctx.stroke();

  //Draw Shield

  ctx.strokeStyle = MaterialLineColor[materialnumber];
  ctx.fillStyle = MaterialColor[materialnumber];
  ctx.lineWidth = 1;
  ctx.fillRect(
    xl + 2,
    yb - 70 - MaterialThickness[thicknessnumber],
    width - 4,
    MaterialThickness[thicknessnumber] - 1
  );
  ctx.strokeRect(
    xl + 2,
    yb - 70 - MaterialThickness[thicknessnumber],
    width - 4,
    MaterialThickness[thicknessnumber] - 1
  );

  ctx.strokeStyle = "#aea4ab";
  ctx.lineWidth = 15.5;
  ctx.beginPath();
  ctx.moveTo(xl + 0.5 * width, yb - 40 - DistanceToDetector - detectorheight);
  ctx.lineTo(xl + 0.5 * width, -10);
  ctx.lineTo(xl - 0.2 * width, -10);
  ctx.lineTo(xl - 0.2 * width, yb - 200);
  ctx.stroke();
}

function DrawTimer(x, y, w, h) {
  DrawRectangle(x, y, w, h, 5, "#990000", "#CCCCCC", 2);
  WriteText(x + 0.5 * w, y + 0.35 * h, "Waktu", 32, "#990000", 0.5);
  if (hold == "no") {
    WriteText(
      x + 0.5 * w,
      y + 0.75 * h,
      timertime.toFixed(1) + " s",
      32,
      "#990000",
      0.5
    );
  } else {
    WriteText(
      x + 0.5 * w,
      y + 0.75 * h,
      StoredTime.toFixed(1) + " s",
      32,
      "#990000",
      0.5
    );
  }
}

function DrawShieldInfo(x, y, w, h) {
  DrawRectangle(x, y, w, h, 5, "#990000", "#CCCCCC", 2);
  WriteText(x + 0.5 * w, y + 0.15 * h, "Jenis Penghalang", 24, "#990000", 0.5);
  WriteText(
    x + 0.5 * w,
    y + 0.35 * h,
    MaterialForShield[materialnumber],
    32,
    "#990000",
    0.5
  );
  WriteText(x + 0.5 * w, y + 0.65 * h, "Ketebalan benda", 24, "#990000", 0.5);
  WriteText(
    x + 0.5 * w,
    y + 0.85 * h,
    MaterialThickness[thicknessnumber].toFixed(1) + " mm",
    32,
    "#990000",
    0.5
  );
}

function DrawIsotopeInfo(x, y, w, h) {
  DrawRectangle(x, y, w, h, 5, "#990000", "#CCCCCC", 2);
  WriteText(
    x + 0.5 * w,
    y + 0.25 * h,
    SampleName[samplenumber] +
      " " +
      SampleDecayParticle[samplenumber] +
      " Decay",
    32,
    "#990000",
    0.5
  );
  WriteText(x + 0.5 * w, y + 0.55 * h, "Activity", 32, "#990000", 0.5);
  Activity = SampleDecayRate / 10;
  WriteText(
    x + 0.5 * w,
    y + 0.85 * h,
    Activity.toFixed(1) + " decays/s",
    24,
    "#990000",
    0.5
  );
}

function DrawParticles() {
  ctx.fillStyle = SampleParticleColor[samplenumber];
  for (i = 0; i <= SampleDecayRate; i++) {
    if (ZSPEED[i] < 0) {
      if (MOVING[i] == "no" && TRIGGERTIME[i] <= elapsedtime) {
        MOVING[i] = "yes";
      }
      if (MOVING[i] == "yes") {
        XPOS[i] = XPOS[i] + XSPEED[i] * deltatime;
        YPOS[i] = YPOS[i] + YSPEED[i] * deltatime;
        ZPOS[i] = ZPOS[i] + ZSPEED[i] * deltatime;
        SizeBall = (1000 * ParticleSize) / (ZPOS[i] + 1000);
        ctx.beginPath();
        ctx.arc(XPOS[i], YPOS[i], SizeBall, 0, 2 * Math.PI);
        ctx.fill();
      }
      if (
        XPOS[i] < 0 ||
        XPOS[i] > 920 ||
        YPOS[i] < 0 ||
        YPOS[i] > 610 ||
        ZPOS[i] < 50 ||
        ZPOS[i] > 2000
      ) {
        XPOS[i] = 550;
        YPOS[i] = 550;
        ZPOS[i] = 1000;
        ANGZ = Math.random() * 1 * Math.PI - Math.PI / 2;
        ANG = Math.random() * 2 * Math.PI;
        XYPLANESPEED = SPEED * Math.cos(ANGZ);
        ZSPEED[i] = SPEED * Math.sin(ANGZ);
        XSPEED[i] = XYPLANESPEED * Math.cos(ANG);
        YSPEED[i] = XYPLANESPEED * Math.sin(ANG);
        TRIGGERTIME[i] = TRIGGERTIME[i] + 10;
        MOVING[i] = "no";
        ESCAPESTATUS[i] = "untested";
      }

      ZMotion = Math.abs(ZPOS[i] - 1000);
      XMotion = Math.abs(XPOS[i] - 550);
      YMotion = Math.abs(YPOS[i] - 550);

      if (
        YMotion >= DistanceToDetector &&
        XMotion <= detectorsize &&
        ZMotion <= detectorsize
      ) {
        Counts++;
        XPOS[i] = 550;
        YPOS[i] = 550;
        ZPOS[i] = 1000;
        ANGZ = Math.random() * 1 * Math.PI - Math.PI / 2;
        ANG = Math.random() * 2 * Math.PI;
        XYPLANESPEED = SPEED * Math.cos(ANGZ);
        ZSPEED[i] = SPEED * Math.sin(ANGZ);
        XSPEED[i] = XYPLANESPEED * Math.cos(ANG);
        YSPEED[i] = XYPLANESPEED * Math.sin(ANG);
        TRIGGERTIME[i] = TRIGGERTIME[i] + 10;
        MOVING[i] = "no";
        ESCAPESTATUS[i] = "untested";
      }

      if (
        YMotion >= 0.5 * DistanceToDetector &&
        XMotion <= SampleWidth &&
        ZMotion <= 3 * SampleWidth &&
        ESCAPESTATUS[i] == "untested"
      ) {
        if (samplenumber == 0) {
          ChanceOfTransmission = Math.exp(
            -1.0 *
              AlphaShieldConstant[materialnumber] *
              MaterialThickness[thicknessnumber]
          );
        }
        if (samplenumber == 1) {
          ChanceOfTransmission = Math.exp(
            -1.0 *
              BetaShieldConstant[materialnumber] *
              MaterialThickness[thicknessnumber]
          );
        }
        if (samplenumber == 2) {
          ChanceOfTransmission = Math.exp(
            -1.0 *
              GammaShieldConstant[materialnumber] *
              MaterialThickness[thicknessnumber]
          );
        }
        FlipThatCoin = Math.random() * 1.0;
        if (FlipThatCoin <= ChanceOfTransmission) {
          ESCAPESTATUS[i] = "yes";
        } else {
          AbsorbedCount++;
          XPOS[i] = 550;
          YPOS[i] = 550;
          ZPOS[i] = 1000;
          ANGZ = Math.random() * 1 * Math.PI - Math.PI / 2;
          ANG = Math.random() * 2 * Math.PI;
          XYPLANESPEED = SPEED * Math.cos(ANGZ);
          ZSPEED[i] = SPEED * Math.sin(ANGZ);
          XSPEED[i] = XYPLANESPEED * Math.cos(ANG);
          YSPEED[i] = XYPLANESPEED * Math.sin(ANG);
          TRIGGERTIME[i] = TRIGGERTIME[i] + 10;
          MOVING[i] = "no";
          ESCAPESTATUS[i] = "untested";
        }
      }
    }
  }
}

function DrawParticles1() {
  ctx.fillStyle = SampleParticleColor[samplenumber];
  for (i = 0; i <= SampleDecayRate; i++) {
    if (ZSPEED[i] >= 0) {
      if (MOVING[i] == "no" && TRIGGERTIME[i] <= elapsedtime) {
        MOVING[i] = "yes";
      }
      if (MOVING[i] == "yes") {
        XPOS[i] = XPOS[i] + XSPEED[i] * deltatime;
        YPOS[i] = YPOS[i] + YSPEED[i] * deltatime;
        ZPOS[i] = ZPOS[i] + ZSPEED[i] * deltatime;
        SizeBall = (1000 * ParticleSize) / (ZPOS[i] + 1000);
        ctx.beginPath();
        ctx.arc(XPOS[i], YPOS[i], SizeBall, 0, 2 * Math.PI);
        ctx.fill();
      }
      if (
        XPOS[i] < 0 ||
        XPOS[i] > 920 ||
        YPOS[i] < 0 ||
        YPOS[i] > 610 ||
        ZPOS[i] < 50 ||
        ZPOS[i] > 2000
      ) {
        XPOS[i] = 550;
        YPOS[i] = 550;
        ZPOS[i] = 1000;
        ANGZ = Math.random() * 1 * Math.PI - Math.PI / 2;
        ANG = Math.random() * 2 * Math.PI;
        XYPLANESPEED = SPEED * Math.cos(ANGZ);
        ZSPEED[i] = SPEED * Math.sin(ANGZ);
        XSPEED[i] = XYPLANESPEED * Math.cos(ANG);
        YSPEED[i] = XYPLANESPEED * Math.sin(ANG);
        TRIGGERTIME[i] = TRIGGERTIME[i] + 10;
        MOVING[i] = "no";
        ESCAPESTATUS[i] = "untested";
      }

      ZMotion = Math.abs(ZPOS[i] - 1000);
      XMotion = Math.abs(XPOS[i] - 550);
      YMotion = Math.abs(YPOS[i] - 550);

      if (
        YMotion >= DistanceToDetector &&
        XMotion <= detectorsize &&
        ZMotion <= detectorsize
      ) {
        Counts++;
        XPOS[i] = 550;
        YPOS[i] = 550;
        ZPOS[i] = 1000;
        ANGZ = Math.random() * 1 * Math.PI - Math.PI / 2;
        ANG = Math.random() * 2 * Math.PI;
        XYPLANESPEED = SPEED * Math.cos(ANGZ);
        ZSPEED[i] = SPEED * Math.sin(ANGZ);
        XSPEED[i] = XYPLANESPEED * Math.cos(ANG);
        YSPEED[i] = XYPLANESPEED * Math.sin(ANG);
        TRIGGERTIME[i] = TRIGGERTIME[i] + 10;
        MOVING[i] = "no";
        ESCAPESTATUS[i] = "untested";
      }

      if (
        YMotion >= 0.5 * DistanceToDetector &&
        XMotion <= SampleWidth &&
        ZMotion <= 3 * SampleWidth &&
        ESCAPESTATUS[i] == "untested"
      ) {
        if (samplenumber == 0) {
          ChanceOfTransmission = Math.exp(
            -1.0 *
              AlphaShieldConstant[materialnumber] *
              MaterialThickness[thicknessnumber]
          );
        }
        if (samplenumber == 1) {
          ChanceOfTransmission = Math.exp(
            -1.0 *
              BetaShieldConstant[materialnumber] *
              MaterialThickness[thicknessnumber]
          );
        }
        if (samplenumber == 2) {
          ChanceOfTransmission = Math.exp(
            -1.0 *
              GammaShieldConstant[materialnumber] *
              MaterialThickness[thicknessnumber]
          );
        }
        FlipThatCoin = Math.random() * 1.0;
        if (FlipThatCoin <= ChanceOfTransmission) {
          ESCAPESTATUS[i] = "yes";
        } else {
          AbsorbedCount++;
          XPOS[i] = 550;
          YPOS[i] = 550;
          ZPOS[i] = 1000;
          ANGZ = Math.random() * 1 * Math.PI - Math.PI / 2;
          ANG = Math.random() * 2 * Math.PI;
          XYPLANESPEED = SPEED * Math.cos(ANGZ);
          ZSPEED[i] = SPEED * Math.sin(ANGZ);
          XSPEED[i] = XYPLANESPEED * Math.cos(ANG);
          YSPEED[i] = XYPLANESPEED * Math.sin(ANG);
          TRIGGERTIME[i] = TRIGGERTIME[i] + 10;
          MOVING[i] = "no";
          ESCAPESTATUS[i] = "untested";
        }
      }
    }
  }
}

function DrawRadiationVial(x, y, w) {
  ContainerScale = w / 50;
  h = 1.3 * w;
  ctx.fillStyle = "#0000ff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = ContainerScale;
  ctx.beginPath();
  ctx.moveTo(x - 0.5 * w, y - 0.5 * h);
  ctx.bezierCurveTo(
    x - 0.5 * w,
    y - 0.45 * h,
    x + 0.5 * w,
    y - 0.45 * h,
    x + 0.5 * w,
    y - 0.5 * h
  );
  ctx.lineTo(x + 0.5 * w, y + 0.5 * h);
  ctx.bezierCurveTo(
    x + 0.5 * w,
    y + 0.55 * h,
    x - 0.5 * w,
    y + 0.55 * h,
    x - 0.5 * w,
    y + 0.5 * h
  );
  ctx.lineTo(x - 0.5 * w, y - 0.5 * h);
  ctx.stroke();
  ctx.fill();

  ctx.fillStyle = "#000099";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = ContainerScale;
  ctx.beginPath();
  ctx.moveTo(x - 0.5 * w, y - 0.5 * h);
  ctx.bezierCurveTo(
    x - 0.5 * w,
    y - 0.55 * h,
    x + 0.5 * w,
    y - 0.55 * h,
    x + 0.5 * w,
    y - 0.5 * h
  );
  ctx.bezierCurveTo(
    x + 0.5 * w,
    y - 0.45 * h,
    x - 0.5 * w,
    y - 0.45 * h,
    x - 0.5 * w,
    y - 0.5 * h
  );
  ctx.stroke();
  ctx.fill();

  DrawRadiationSymbol(x, y, 0.5 * w, SampleSymbol[samplenumber]);
}

function DrawRadiationSymbol(xs, ys, ws, txt) {
  ctx.fillStyle = "#ffff0b";
  ctx.fillRect(xs - 0.5 * ws, ys - 0.5 * ws, ws, ws);

  ctx.fillStyle = "#000000";

  ctx.beginPath();
  ctx.moveTo(xs, ys);
  ctx.arc(xs, ys, 0.45 * ws, (5 * Math.PI) / 3, 0, false);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(xs, ys);
  ctx.arc(xs, ys, 0.45 * ws, (3 * Math.PI) / 3, (4 * Math.PI) / 3, false);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(xs, ys);
  ctx.arc(xs, ys, 0.45 * ws, (1 * Math.PI) / 3, (2 * Math.PI) / 3, false);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffff0b";
  ctx.beginPath();
  ctx.arc(xs, ys, 0.14 * ws, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(xs, ys, 0.09 * ws, 0, 2 * Math.PI);
  ctx.fill();

  WriteText(xs, ys - 0.6 * ws, txt, 0.4 * ws, "#FFFFFF", 0.5);
}

function ResetSystem() {
  Counts = 0;
  timertime = 0;
  hold = "no";
}

function HoldReading() {
  if (hold == "no") {
    hold = "yes";
  } else {
    hold = "no";
  }
  StoredTime = timertime;
  StoredCounts = Counts;
}

function MoveDetector(x) {
  distancenumber = distancenumber + x;
  if (distancenumber > 9) {
    distancenumber = 9;
  }
  if (distancenumber < 0) {
    distancenumber = 0;
  }
}

function ChangeSample() {
  samplenumber++;
  if (samplenumber > 2) {
    samplenumber = 0;
  }
  ParticleSize = SampleParticleSize[samplenumber];
  SPEED = SampleParticleSpeed[samplenumber];
  elapsedtime = 0;
  hold = "no";
  for (i = 0; i < SampleDecayRate; i++) {
    XPOS[i] = 550;
    YPOS[i] = 550;
    ZPOS[i] = 1000;
    ANGZ = Math.random() * 1 * Math.PI - Math.PI / 2;
    ANG = Math.random() * 2 * Math.PI;
    XYPLANESPEED = SPEED * Math.cos(ANGZ);
    ZSPEED[i] = SPEED * Math.sin(ANGZ);
    XSPEED[i] = XYPLANESPEED * Math.cos(ANG);
    YSPEED[i] = XYPLANESPEED * Math.sin(ANG);
    TRIGGERTIME[i] = Math.random() * 10;
    MOVING[i] = "no";
    ESCAPESTATUS[i] = "untested";
  }
  ResetSystem();
}

function ChangeShield() {
  materialnumber++;
  if (materialnumber > 4) {
    materialnumber = 0;
  }
  ResetSystem();
}

function ChangeActivity() {
  SampleDecayRate = 2500;
  ResetSystem();
}

function ChangeThickness() {
  thicknessnumber++;
  if (thicknessnumber > 9) {
    thicknessnumber = 0;
  }
  ResetSystem();
}

function WriteText(x, y, t, s, c, m) {
  ctx.fillStyle = c;
  ctx.font = s + "px Arial ";
  temptext = t;
  metrics = ctx.measureText(temptext);
  textWidth = metrics.width;
  xposition = x - m * textWidth;
  ctx.fillText(temptext, xposition, y);
}

function DrawArrow(x, y, h, w, c, r) {
  ctx.save();
  ctx.translate(x, y + 0.5 * h);
  ctx.rotate(r);
  ctx.fillStyle = c;
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -0.5 * h);
  ctx.lineTo(0 + w, -0.5 * h + w);
  ctx.lineTo(0 + 0.5 * w, -0.5 * h + w);
  ctx.lineTo(0 + 0.5 * w, -0.5 * h + h);
  ctx.lineTo(0 - 0.5 * w, -0.5 * h + h);
  ctx.lineTo(0 - 0.5 * w, -0.5 * h + w);
  ctx.lineTo(0 - w, -0.5 * h + w);
  ctx.lineTo(0, -0.5 * h);
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function DrawRectangle(
  xrect,
  yrect,
  wrect,
  hrect,
  curverectangle,
  lcolor,
  fcolor,
  lwid
) {
  ctx.fillStyle = fcolor;
  ctx.strokeStyle = lcolor;
  ctx.lineWidth = lwid;
  ctx.beginPath();
  ctx.moveTo(xrect + curverectangle, yrect);
  ctx.lineTo(xrect + wrect - curverectangle, yrect);
  ctx.arc(
    xrect + wrect - curverectangle,
    yrect + curverectangle,
    curverectangle,
    1.5 * Math.PI,
    0 * Math.PI,
    false
  );
  ctx.lineTo(xrect + wrect, yrect + hrect - curverectangle);
  ctx.arc(
    xrect + wrect - curverectangle,
    yrect + hrect - curverectangle,
    curverectangle,
    0.0 * Math.PI,
    0.5 * Math.PI,
    false
  );
  ctx.lineTo(xrect + curverectangle, yrect + hrect);
  ctx.arc(
    xrect + curverectangle,
    yrect + hrect - curverectangle,
    curverectangle,
    0.5 * Math.PI,
    1.0 * Math.PI,
    false
  );
  ctx.lineTo(xrect, yrect + curverectangle);
  ctx.arc(
    xrect + curverectangle,
    yrect + curverectangle,
    curverectangle,
    1.0 * Math.PI,
    1.5 * Math.PI,
    false
  );
  ctx.stroke();
  ctx.fill();
}
