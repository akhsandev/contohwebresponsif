//Code by pat adams
function setup() {
  createCanvas(1000, 400);

  source_tt = new Turntable("s");
  blocker_tt = new Turntable("b");

  geiger = new Geiger();

  current_counts = 0;
}

function draw() {
  background(248, 248, 248);
  source_tt.display();
  blocker_tt.display();
  geiger.display();

  if (geiger.recording) {
    if (frameCount % 10 == 0) {
      current_counts = getCounts();
    }
  }

  textAlign(RIGHT);
  text(current_counts + " Counts/time", (15 * width) / 16, height / 8);
}

function mouseClicked() {
  geiger.move();

  let source_click_area =
    pow(mouseX - source_tt.cx, 2) / pow(source_tt.rx, 2) +
    pow(mouseY - source_tt.cy, 2) / pow(source_tt.ry, 2);

  let blocker_click_area =
    pow(mouseX - blocker_tt.cx, 2) / pow(blocker_tt.rx, 2) +
    pow(mouseY - blocker_tt.cy, 2) / pow(blocker_tt.ry, 2);

  if (blocker_click_area <= 1) {
    blocker_tt.rotate();
  } else if (source_click_area <= 1 && blocker_click_area >= 1) {
    source_tt.rotate();
  }
  // TUrn recording on and off

  //else {
  //  geiger.recording = !(geiger.recording);
  //}

  //geiger.move()
}

function getCounts() {
  // Blockers are: None(0), Plastic(1), Aluminium(2), Lead(3)
  // Sources are: Gamma(0), Beta(1), Alpha(2), Unknown(3)

  upper = 1000; // sampling time
  if (source_tt.times_rotated % 4 == 3) {
    ss = 2; // unknown source - pick identity from 0, 1, 2 (y,b,a)
  } else {
    ss = source_tt.times_rotated % 4;
  }
  //Attenuation coeff (cm^2/g)
  //
  // 0.6MeV -https://www.nist.gov/pml/x-ray-mass-attenuation-coefficients
  // gamma(Pb) = 1.4E-01
  // gamma(Al) = 7.802E-02
  // gamma(plastic) = 9.198E-02
  // gamma(air) = 9.549E-03
  //
  // 0.167 MeV S
  // beta(Pb) = 377
  // beta(Al) = 272
  // beta(plastic) = 1 //(est)
  // beta(air) = 0.1 //(est)
  //
  // All estimates
  // alpha(Pb) = 1E09
  // alpha(Al) = 1
  // alpha(plastic) = 7.5
  // alpha(air) = 2
  //
  // Coeffecients are rough estimates (no physics)
  // tunable parameters for coeff
  k = 6; // source factor
  m = 1.2; // blocker factor

  blocker_thickness = 0.1; // cm
  dist_thickness =
    0.1 *
    map(
      geiger.current_x,
      geiger.ruler_x,
      geiger.ruler_x + geiger.ruler_width,
      0,
      10
    );

  bb = blocker_tt.times_rotated % 4;
  //Blocker attenuation
  if (ss == 0) {
    air_coeff = 0.009;
    if (bb == 0) {
      abs_coeff = air_coeff;
    } else if (bb == 1) {
      abs_coeff = 1.92;
    } else if (bb == 2) {
      abs_coeff = 7.8;
    } else {
      abs_coeff = 20;
    }
  } else if (ss == 1) {
    air_coeff = 0.1;
    if (bb == 0) {
      abs_coeff = air_coeff;
    } else if (bb == 1) {
      abs_coeff = 10;
    } else if (bb == 2) {
      abs_coeff = 20;
    } else {
      abs_coeff = 200;
    }
  } else {
    air_coeff = 0.5;
    if (bb == 0) {
      abs_coeff = air_coeff;
    } else if (bb == 1) {
      abs_coeff = 10;
    } else if (bb == 2) {
      abs_coeff = 100;
    } else {
      abs_coeff = 10000;
    }
  }

  //abs_coeff = ((k**ss)+2)**(((blocker_tt.times_rotated%4) +m*0.1)/m)
  blocker_decay = exp(-abs_coeff * blocker_thickness);

  //Air attenuation

  dist_decay = exp(-air_coeff * (1 + dist_thickness));

  //Point source spreading
  inv_sq = (1 + dist_thickness) ** -2;

  //Poisson dist
  counts = 0;
  upper = round(upper * (blocker_decay * dist_decay) * inv_sq);
  for (i = 0; i < upper; i++) {
    if (random(0, 1) > 0.5) {
      counts = counts + 1;
    }
  }

  //counts = round(counts*inv_sq)
  //console.log(counts +','+ dist_thickness)

  return counts;
}

class Turntable {
  constructor(s_or_b) {
    this.s_or_b = s_or_b;

    if (this.s_or_b == "s") {
      this.cx = (3 * width) / 28;
      this.cy = (15 * height) / 16;
    } else {
      this.cx = (3 * width) / 28;
      this.cy = (4 * height) / 64;
    }

    this.rx = (3 * width) / 32;
    this.ry = (5 * height) / 12;
    this.current_angle = 0;
    this.target_angle = 0;
    this.sources = ["Gamma", "Beta", "Alpha", "Tak Diketahui"];
    this.blockers = ["Kosong", "Plastik", "Aluminium", "Timbal"];
    this.times_rotated = 0;
  }

  rotate() {
    this.target_angle += PI / 2;
    this.times_rotated += 1;
  }

  display() {
    //Draw Turntable
    fill((150, 150, 150));
    for (let i = -7; i < 0; i++) {
      ellipse(this.cx + i, this.cy, 2 * this.rx, 2 * this.ry);
    }

    //Draw circles if source table
    if (this.s_or_b == "s") {
      for (let i = 0; i < 4; i++) {
        fill(25, 100, 255);
        ellipse(
          this.cx + this.rx * cos(this.current_angle + (i * PI) / 2),
          this.cy + this.ry * sin(this.current_angle + (i * PI) / 2),
          20,
          20
        );
      }

      textSize(28);
      fill(0);
      textAlign(CENTER);

      text(
        this.sources[this.times_rotated % 4],
        this.cx,
        this.cy - this.ry / 4
      );
    }

    //Draw rectangles if blocker table
    if (this.s_or_b == "b") {
      for (let i = 0; i < 4; i++) {
        let blocker_w = this.rx;
        //fill(100,200,50, 100)
        fill(255, 255, 255, 200);
        rectMode(CENTER);
        rect(
          this.cx + this.rx * cos(this.current_angle + (i * PI) / 2),
          this.cy + this.ry * sin(this.current_angle + (i * PI) / 2),
          blocker_w,
          blocker_w
        );
      }

      textSize(28);
      fill(0);
      textAlign(CENTER);

      text(
        this.blockers[this.times_rotated % 4],
        this.cx,
        this.cy + (3 * this.ry) / 8
      );
    }

    if (this.current_angle < this.target_angle) {
      this.current_angle += 0.07 * (this.target_angle - this.current_angle);
    }
  }
}

class Geiger {
  constructor() {
    this.current_x = width / 2;
    this.target_x = width / 2;
    this.rx = 25;
    this.ry = 75;
    this.length = 100;
    this.recording = true;

    this.ruler_x = (14 * width) / 64;
    this.ruler_y = (3 * height) / 4;
    this.ruler_width = (75 * width) / 100;
    this.ruler_height = height / 15;
  }

  display() {
    fill(255, 100, 50);
    rectMode(CORNER);
    strokeWeight(1);
    rect(this.ruler_x, this.ruler_y, this.ruler_width, this.ruler_height);

    for (let i = 0; i < 41; i++) {
      let tick_width = 2;

      fill(0);
      strokeWeight(1);
      rectMode(CENTER);

      if (i % 4 == 0) {
        line(
          this.ruler_x + (i * this.ruler_width) / 40,
          this.ruler_y,
          this.ruler_x + (i * this.ruler_width) / 40,
          this.ruler_y + this.ruler_height
        );
      } else if (i % 4 == 1 || i % 4 == 3) {
        line(
          this.ruler_x + (i * this.ruler_width) / 40,
          this.ruler_y,
          this.ruler_x + (i * this.ruler_width) / 40,
          this.ruler_y + this.ruler_height / 4
        );
      } else if (i % 4 == 2) {
        line(
          this.ruler_x + (i * this.ruler_width) / 40,
          this.ruler_y,
          this.ruler_x + (i * this.ruler_width) / 40,
          this.ruler_y + this.ruler_height / 2
        );
      }
    }

    fill(200);
    for (let i = 0; i < this.length; i++) {
      ellipse(this.current_x + i, height / 2, this.rx, this.ry);
    }

    if (this.current_x !== this.target_x) {
      this.current_x += 0.15 * (this.target_x - this.current_x);
    }

    fill(0);
    textSize(32);
    let ruler_pos = map(
      this.current_x,
      this.ruler_x,
      this.ruler_x + this.ruler_width,
      0,
      10
    );
    textAlign(RIGHT);
    text(
      "Posisi Alat Ukur: " + str(ruler_pos).slice(0, 4) + " cm",
      (15 * width) / 16,
      (15 * height) / 16
    );
  }

  move() {
    if (
      mouseX > geiger.ruler_x &&
      mouseX < geiger.ruler_x + geiger.ruler_width &&
      mouseY > geiger.ruler_y &&
      mouseY < geiger.ruler_y + geiger.ruler_height
    ) {
      this.target_x = mouseX;
    }
  }
}
