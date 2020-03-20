const f = (() => {

  const urlParams = new URLSearchParams(window.location.search);
  const goalID = urlParams.get('goal').split(',');
  const redID = urlParams.get('red');
  const blueID = urlParams.get('blue');
  const greenID = urlParams.get('green');
  const yellowID = urlParams.get('yellow');
  const silverID = urlParams.get('silver');
  var board = urlParams.get('b').split(',');
  var moves = urlParams.getAll('m');
  
  if (board.length != 256) {
    board = Array.from(atob(decodeURIComponent(urlParams.get('b'))), (char) => char.charCodeAt());
  }

  if (board.length != 256 ) {
    console.error("Error: missing or malformed board data.");
    return -1;
  }

  function makeRobot(posID, colorString) {
    const returnRobot = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    returnRobot.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + colorString + '-robot');
    returnRobot.setAttribute("x", 100 * (posID % 16));
    returnRobot.setAttribute("y", 100 * Math.floor(posID / 16));
    return returnRobot;
  }
  
  function getArrowheads(color="red", string="r") {
    var defMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    defMarker.setAttribute("id", (string+"-arrowhead"));
    defMarker.setAttribute("orient", "auto");
    defMarker.setAttribute("markerWidth", "100");
    defMarker.setAttribute("markerHeight", "200");
    defMarker.setAttribute("refX", "0");
    defMarker.setAttribute("refY", "1");
    var defMarkerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    defMarkerPath.setAttribute("d", "M0,0 V2 L1,1 Z");
    defMarkerPath.setAttribute("fill", color);
    defMarker.appendChild(defMarkerPath);
    return defMarker;
  }
    
  function getPath(color="r", d="M150, 250 L150,1065") {
    const returnPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    switch (color) {
      case "r":
        hexColor = "#e14a47";
        break;
      case "b":
        hexColor = "#4C7DD1";
        break;
      case "g":
        hexColor = "#6bd14c";
        break;
      case "y":
        hexColor = "#c1a530";
        break;
      default:
        hexColor = "#888888";
        break;
    }
    returnPath.setAttribute("marker-end", "url(#"+color+"-arrowhead)");
    returnPath.setAttribute("d", d);
    returnPath.setAttribute("fill", "none");
    returnPath.setAttribute("stroke", hexColor);
    returnPath.setAttribute("stroke-width", "45");
    returnPath.setAttribute("stroke-linecap", "round");
    returnPath.setAttribute("stroke-linejoin", "round");
    returnPath.setAttribute("opacity", ".35");
    return returnPath;
  }

  function getRect(x="0", y="0", width="100", height="100", fill = "red", stroke = "#blue", strokewidth="5", opacity="1") {
    returnRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    returnRect.setAttribute("x", x);
    returnRect.setAttribute("y", y);
    returnRect.setAttribute("width", width);
    returnRect.setAttribute("height", height);
    returnRect.setAttribute("fill", fill);
    returnRect.setAttribute("stroke", stroke);
    returnRect.setAttribute("stroke-width", strokewidth);
    returnRect.setAttribute("opacity", opacity);
    return returnRect;
  }
  
  function getPolyline(points, fill="none", stroke="#1C1C1C", strokewidth=".2") {
    returnPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    returnPolyline.setAttribute("points", points);
    returnPolyline.setAttribute("fill", fill);
    returnPolyline.setAttribute("stroke", stroke);
    returnPolyline.setAttribute("stroke-width", strokewidth);
    returnPolyline.setAttribute("stroke-linecap", "round");
    returnPolyline.setAttribute("stroke-linejoin", "round");
    return returnPolyline;
  }

  function getRobot(a) {
    const returnRobot = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    returnRobot.setAttribute("id", a + "-robot");
    returnRobot.setAttribute("width", "100");
    returnRobot.setAttribute("height", "100");
    returnRobot.setAttribute("x", "0");
    returnRobot.setAttribute("y", "0");
    returnRobot.setAttribute("viewBox", "0 0 306 306");
    returnRobot.innerHTML = `<path class="st0" d="M83.7,147.5c0,0-5.6,4-8.6,15s6,25,6,25L95.7,171c0,0-4.5-8.5,6.5-19.5s-9-4-9-4H83.7z"/>
      <path class="st0" d="M222.3,147.5c0,0,5.6,4,8.6,15s-6,25-6,25L210.3,171c0,0,4.5-8.5-6.5-19.5s9-4,9-4H222.3z"/>
      <path class="st1`+a+`" d="M224.5,145c-1,4-29,31-29,31h-84.9c0,0-28-27-29-31s7-10,18.6-16h14.4l-8-10l46.5,4l46.5-4l-5,10h11.4 C217.5,135,225.5,141,224.5,145z"/>
      <path class="st4`+a+`" d="M221.6,139.6c-12.9,10.4-19.3,16.7-19.6,16.6c-0.3-0.2,4,7.6,4,7.6l6.9-5.6l11.8-13.3L221.6,139.6z"/>
      <path class="st1`+a+`" d="M153.2,264c-2.9,0.3-65.6,0.6-77-26c-2.3-5.2-3.3-13.2,9-43c8-19.5,22.4-42.9,39-68h57.6 c16.6,25.1,31,48.5,39,68c12.3,29.8,11.3,37.8,9,43c-11.4,26.6-74.1,26.3-77,26"/>
      <path class="st4`+a+`" d="M229.8,238c-11.2,26.1-72.1,26.3-76.8,26c0.1,0,0.2,0,0.2,0h-0.4c0,0,0.1,0,0.2,0c-4.7,0.3-65.6,0.1-76.8-26 c-1.6-3.7-2.6-8.8,1.4-22.2c14,23.3,70.8,23.5,75.4,23.2c4.6,0.3,61.4,0.1,75.4-23.2C232.4,229.2,231.4,234.3,229.8,238z"/>
      <path class="st3`+a+`" d="M83,203.8c46,25.2,96.9,26.2,140-0.8"/>
      <path d="M164,265l-15.9-1c-14.1,0-11.1,2-25.6-4v-24.9c0-14.1,11.5-25.6,25.6-25.6h9.9c14.1,0,25.6,11.5,25.6,25.6L184,262 C176,264,178.1,265,164,265z"/>
      <path class="st4`+a+`" d="M164.6,142h-23.3c-27.7,0-53.4-6.4-53.4-38.7v0c0-32.3,25.7-58.7,53.4-58.7h23.3c27.7,0,53.4,26.4,53.4,58.7v0 C218,135.6,192.3,142,164.6,142z"/>
      <path class="st0" d="M154.2,59c0,0,1.8,0-2.3,0c-9.2,0-13.8-6-13.8-6s6.3-5.1,8.5-10c3.1-7,3.8-10,4.6-22h3.8c0.8,12,1.5,15,4.6,22 c2.2,4.9,8.5,10,8.5,10S163.4,59,154.2,59c-4.2,0-2.3,0-2.3,0"/>
      <circle class="st4`+a+`" cx="153" cy="19" r="8"/>
      <path class="st5" d="M162.2,278.8h-18.4c-9.5,0-17.3-7.8-17.3-17.3v-15.7c0-9.5,7.8-17.3,17.3-17.3h18.4c9.5,0,17.3,7.8,17.3,17.3 v15.7C179.5,271,171.7,278.8,162.2,278.8z"/>
      <path class="st6" d="M153.3,293h-0.5c-8.7,0-15.7-7.1-15.7-15.7V230c0-8.7,7.1-15.7,15.7-15.7h0.5c8.7,0,15.7,7.1,15.7,15.7v47.3 C169,285.9,161.9,293,153.3,293z"/>
      <path class="st0" d="M228,188c0,12.7-10.3,23-23,23c-0.1,0-0.3,0-0.4,0l3.4-13.5c4.1-1.3,7-5.1,7-9.5c0-5.5-4.5-10-10-10 c-5.5,0-8.9,3.6-9,9l-1.5,0.5l-12.3,3.4c-0.1-0.9-0.2-1.9-0.2-2.9c0-12.7,10.3-23,23-23S228,175.3,228,188z"/>
      <path class="st0" d="M78,188c0,12.7,10.3,23,23,23c0.1,0,0.3,0,0.4,0L98,197.5c-4.1-1.3-7-5.1-7-9.5c0-5.5,4.5-10,10-10 c5.5,0,8.9,3.6,9,9l4.5,0.5l7.3,1.4c0.1-0.9,0.2-1.9,0.2-2.9c0-12.7-8.3-21-21-21S78,175.3,78,188z"/>
      <path class="st7" d="M194,123c-8,6-41,6-41,6s-35,0-43-7c-6.9-6.1-6-33-2-41c3.2-6.4,9-5.6,19-6c11.5-0.5,14.5-0.5,25.5-0.5 c11.1,0,16,0,26.1,0.5c10,0.5,14.7-0.5,18.4,6C201,88,201.4,117.5,194,123z"/>
      <path d="M166,119h-26c-1.6,0-3-1.3-3-3l0,0c0-1.7,1.4-3,3-3h26c1.6,0,3,1.3,3,3l0,0C169,117.7,167.6,119,166,119z"/>
      <ellipse transform="matrix(0.9883 -0.1523 0.1523 0.9883 -12.4244 21.7847)" cx="136" cy="92" rx="6" ry="7.5"/>
      <ellipse transform="matrix(0.1523 -0.9883 0.9883 0.1523 53.1837 246.0063)" cx="170" cy="92" rx="7.5" ry="6"/>
      <path class="st4`+a+`" d="M84.1,139.6c12.9,10.4,19.3,16.7,19.6,16.6c0.3-0.2-4,7.6-4,7.6l-6.9-5.6L81,145L84.1,139.6z"/>`;
      return returnRobot;
  }

  function makeMoveNumber(x, y) {
    const move = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    move.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#move-num');
    move.setAttribute("x", x*100);
    move.setAttribute("y", y*100);
    return move;
  }

  function makeMoveText(x, y, num) {
    const moveText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    moveText.setAttribute("x", x*100+50);
    moveText.setAttribute("y", y*100+50);
    moveText.setAttribute("text-anchor", "middle");
    moveText.setAttribute("dominant-baseline", "central");
    moveText.setAttribute("style", "font-size: 150%; font-family: 'Segoe UI';");
    moveText.textContent = num;
    return moveText;
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", "solution-svg");
  svg.setAttribute("width", "1600");
  svg.setAttribute("height", "1600");
  svg.setAttribute("viewBox", "0 0 1600 1600");
  svg.innerHTML = `<style>
    .st0{fill:#CCCCCC;stroke:#000000;stroke-width:2.2457;stroke-miterlimit:10;}
    .st1r{fill:#ebc8c8;stroke:#000000;stroke-width:2.5;stroke-miterlimit:10;}
    .st1b{fill:#C8D5EB;stroke:#000000;stroke-width:2.5;stroke-miterlimit:10;}
    .st1g{fill:#d0ebc8;stroke:#000000;stroke-width:2.5;stroke-miterlimit:10;}
    .st1y{fill:#ebe6c8;stroke:#000000;stroke-width:2.5;stroke-miterlimit:10;}
    .st1s{fill:#ebebeb;stroke:#000000;stroke-width:2.5;stroke-miterlimit:10;}
    .st3r{fill:none;stroke:#d14c4c;stroke-width:7.2153;stroke-miterlimit:10;}
    .st4r{fill:#d14c4c;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
    .st3b{fill:none;stroke:#4C7DD1;stroke-width:7.2153;stroke-miterlimit:10;}
    .st4b{fill:#4C7DD1;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
    .st3g{fill:none;stroke:#6bd14c;stroke-width:7.2153;stroke-miterlimit:10;}
    .st4g{fill:#6bd14c;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
    .st3y{fill:none;stroke:#d1bd4c;stroke-width:7.2153;stroke-miterlimit:10;}
    .st4y{fill:#d1bd4c;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
    .st3s{fill:none;stroke:#d1d1d1;stroke-width:7.2153;stroke-miterlimit:10;}
    .st4s{fill:#d1d1d1;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
    .st5{fill:#BABABA;stroke:#000000;stroke-width:2.5;stroke-miterlimit:10;}
    .st6{fill:#5E5E5E;stroke:#000000;stroke-width:2.5;stroke-miterlimit:10;}
    .st7{fill:#FFFFFF;fill-opacity:0.7;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
  </style>`;



  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.appendChild(getArrowheads("#e14a47", "r"));
  defs.appendChild(getArrowheads("#4C7DD1", "b"));
  defs.appendChild(getArrowheads("#6bd14c", "g"));
  defs.appendChild(getArrowheads("#c1a530", "y"));
  defs.appendChild(getArrowheads("#888888", "s"));


  var symbolSqI = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolSqI.setAttribute("id", "sqI");
  symbolSqI.setAttribute("width", "100");
  symbolSqI.setAttribute("height", "100");
  symbolSqI.setAttribute("viewBox", "0 0 100 100");
  symbolSqI.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  symbolSqI.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));
  symbolSqI.appendChild( getPolyline("0,0 0,110", "none", "#1C1C1C", "20") );

  var symbolSqII = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolSqII.setAttribute("id", "sqII");
  symbolSqII.setAttribute("width", "100");
  symbolSqII.setAttribute("height", "100");
  symbolSqII.setAttribute("viewBox", "0 0 100 100");
  symbolSqII.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  symbolSqII.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));
  symbolSqII.appendChild( getPolyline("0,0 0,150 100,150 100,-50", "none", "#1C1C1C", "20") );

  var symbolSqL = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolSqL.setAttribute("id", "sqL");
  symbolSqL.setAttribute("width", "100");
  symbolSqL.setAttribute("height", "100");
  symbolSqL.setAttribute("viewBox", "0 0 100 100");
  symbolSqL.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  symbolSqL.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));
  symbolSqL.appendChild( getPolyline("0,0 0,100 110,100", "none", "#1C1C1C", "20") );

  var symbolSqLD = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolSqLD.setAttribute("id", "sqLD");
  symbolSqLD.setAttribute("width", "100");
  symbolSqLD.setAttribute("height", "100");
  symbolSqLD.setAttribute("viewBox", "0 0 100 100");
  symbolSqLD.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  symbolSqLD.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));
  symbolSqLD.appendChild( getPolyline("100,0 100,0", "none", "#1C1C1C", "20") );
  symbolSqLD.appendChild( getPolyline("0,0 0,100 110,100", "none", "#1C1C1C", "20") );
  
  var symbolSqU = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolSqU.setAttribute("id", "sqU");
  symbolSqU.setAttribute("width", "100");
  symbolSqU.setAttribute("height", "100");
  symbolSqU.setAttribute("viewBox", "0 0 100 100");
  symbolSqU.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  symbolSqU.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));
  symbolSqU.appendChild( getPolyline("0,0 0,100 100,100 100,0", "none", "#1C1C1C", "20") );
  
  var symbolSqD = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolSqD.setAttribute("id", "sqD");
  symbolSqD.setAttribute("width", "100");
  symbolSqD.setAttribute("height", "100");
  symbolSqD.setAttribute("viewBox", "0 0 100 100");
  symbolSqD.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  symbolSqD.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));
  symbolSqD.appendChild( getPolyline("0,0 0,0", "none", "#1C1C1C", "20") );
  
  var symbolSqDD = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolSqDD.setAttribute("id", "sqDD");
  symbolSqDD.setAttribute("width", "100");
  symbolSqDD.setAttribute("height", "100");
  symbolSqDD.setAttribute("viewBox", "0 0 100 100");
  symbolSqDD.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  symbolSqDD.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));
  symbolSqDD.appendChild( getPolyline("100,0 100,0", "none", "#1C1C1C", "20") );
  symbolSqDD.appendChild( getPolyline("100,100 100,100", "none", "#1C1C1C", "20") );
  
  var symbolSqDDd = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolSqDDd.setAttribute("id", "sqDDd");
  symbolSqDDd.setAttribute("width", "100");
  symbolSqDDd.setAttribute("height", "100");
  symbolSqDDd.setAttribute("viewBox", "0 0 100 100");
  symbolSqDDd.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  symbolSqDDd.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));
  symbolSqDDd.appendChild( getPolyline("0,0 0,0", "none", "#1C1C1C", "20") );
  symbolSqDDd.appendChild( getPolyline("100,100 100,100", "none", "#1C1C1C", "20") );
  
  var symbolSqIDr = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolSqIDr.setAttribute("id", "sqIDr");
  symbolSqIDr.setAttribute("width", "100");
  symbolSqIDr.setAttribute("height", "100");
  symbolSqIDr.setAttribute("viewBox", "0 0 100 100");
  symbolSqIDr.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  symbolSqIDr.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));
  symbolSqIDr.appendChild( getPolyline("0,0 0,0", "none", "#1C1C1C", "20") );
  symbolSqIDr.appendChild( getPolyline("100,0 100,100", "none", "#1C1C1C", "20") );
  
  var symbolSqIDl = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolSqIDl.setAttribute("id", "sqIDl");
  symbolSqIDl.setAttribute("width", "100");
  symbolSqIDl.setAttribute("height", "100");
  symbolSqIDl.setAttribute("viewBox", "0 0 100 100");
  symbolSqIDl.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  symbolSqIDl.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));
  symbolSqIDl.appendChild( getPolyline("0,0 0,0", "none", "#1C1C1C", "20") );
  symbolSqIDl.appendChild( getPolyline("100,0 100,100", "none", "#1C1C1C", "20") );
  
  var sq = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  sq.setAttribute("id", "sq");
  sq.setAttribute("width", "100");
  sq.setAttribute("height", "100");
  sq.setAttribute("viewBox", "0 0 100 100");
  sq.appendChild(getRect("0", "0", "100", "100", "#e7d7ce", "#c5b8b0", "5", "1"));
  sq.appendChild(getRect("15", "15", "70", "70", "#f1e8e2", "#c8c9ca", "5", "0.6"));

  const moveNumCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  moveNumCircle.setAttribute("cx", "50");
  moveNumCircle.setAttribute("cy", "50");
  moveNumCircle.setAttribute("r", "18");
  moveNumCircle.setAttribute("fill", "#fafafa");
  moveNumCircle.setAttribute("stroke", "#303030");
  moveNumCircle.setAttribute("stroke-width", "2");
  moveNumCircle.setAttribute("opacity", ".8");
  const symbolMoveNum = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolMoveNum.setAttribute("id", "move-num");
  symbolMoveNum.appendChild(moveNumCircle);

  const blkRect = getRect("0", "0", "100", "100", "#7a776d", "none", "5", "1");
  const blkPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  blkPolyline.setAttribute("points", "0,0 0,110 -10,100 110,100");
  blkPolyline.setAttribute("fill", "none");
  blkPolyline.setAttribute("stroke", "#1C1C1C");
  blkPolyline.setAttribute("stroke-width", "20");
  const symbolBlk = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
  symbolBlk.setAttribute("id", "sq-blk");
  symbolBlk.setAttribute("viewBox", "0 0 100 100");
  symbolBlk.setAttribute("height", "100");
  symbolBlk.setAttribute("width", "100");
  symbolBlk.appendChild(blkRect);
  symbolBlk.appendChild(blkPolyline);


  // attach symbols to the container
  svg.appendChild(defs);
  svg.appendChild(symbolSqI);
  svg.appendChild(symbolSqII);
  svg.appendChild(symbolSqL);
  svg.appendChild(symbolSqLD);
  svg.appendChild(symbolSqU);
  svg.appendChild(symbolSqD);
  svg.appendChild(symbolSqDD);
  svg.appendChild(symbolSqDDd);
  svg.appendChild(symbolSqIDr);
  svg.appendChild(symbolSqIDl);
  svg.appendChild(sq);
  svg.appendChild(symbolBlk);
  svg.appendChild(symbolMoveNum);

  for (y = 0; y < 16; y++) {
    for (x = 0; x < 16; x++) {
      cellID = parseInt(board.shift());
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      if (x == 7 && y == 7) {
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sq-blk');
        use.setAttribute("transform", "rotate(90, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if (x == 7 && y == 8) {
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sq-blk');
      } else if (x == 8 && y == 7) {
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sq-blk');
        use.setAttribute("transform", "rotate(180, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if (x == 8 && y == 8) {
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sq-blk');
        use.setAttribute("transform", "rotate(270, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([1, 17, 93, 129, 145].includes(cellID)) { // s1
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqI');
        use.setAttribute("transform", "rotate(90, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([2, 18, 34, 50].includes(cellID)) { // s2
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqI');
        use.setAttribute("transform", "rotate(180, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([4, 36, 68, 100, 145].includes(cellID)) { // s4
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqI');
        use.setAttribute("transform", "rotate(270, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([8, 72, 136, 200].includes(cellID)) { // s8
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqI');
      }else if ([3, 19, 51, 147, 179].includes(cellID)) { // s3
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqL');
        use.setAttribute("transform", "rotate(180, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([6, 38, 54, 102, 118].includes(cellID)) { // s6
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqL');
        use.setAttribute("transform", "rotate(270, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([12, 76, 108, 204, 236].includes(cellID)) { // s12
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqL');
      } else if ([9, 137, 153, 201, 217].includes(cellID)) { // s9
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqL');
        use.setAttribute("transform", "rotate(90, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([5, 117, 133, 149, 165, 181, 149, 197, 213, 229, 245].includes(cellID)) { // s5
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqII');
        use.setAttribute("transform", "rotate(90, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([10, 122, 126, 186, 218, 234, 238].includes(cellID)) { // s10 
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqII');
      } else if ( cellID == 16 ) { // s16
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqD');
        use.setAttribute("transform", "rotate(90, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ( cellID == 32 ) { // s32
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqD');
        use.setAttribute("transform", "rotate(180, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ( cellID == 64 ) { // s64
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqD');
        use.setAttribute("transform", "rotate(270, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ( cellID == 128 ) { // s128
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqD');
      } else if ([20, 52, 84, 116].includes(cellID)) { // s20
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqIDr');
        use.setAttribute("transform", "rotate(90, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([40, 104, 168, 232].includes(cellID)) { // s40
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqIDr');
        use.setAttribute("transform", "rotate(180, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([65, 81, 193, 209].includes(cellID)) { // s65
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqIDr');
        use.setAttribute("transform", "rotate(270, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([130, 146, 162, 178].includes(cellID)) { // s130
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqIDr');
      } else if ([24, 88, 152, 216, 220].includes(cellID)) { // s24
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqIDl');
        use.setAttribute("transform", "rotate(90, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([33, 49, 161, 177, 185].includes(cellID)) { // s33
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqIDl');
        use.setAttribute("transform", "rotate(180, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([66, 82, 98, 114].includes(cellID)) { // s66
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqIDl');
        use.setAttribute("transform", "rotate(270, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([132, 164, 196, 228].includes(cellID)) { // s132
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqIDl');
      } else if ([28, 92, 252].includes(cellID)) { // s28
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqLD');
      } else if ([41, 169, 249].includes(cellID)) { // s41
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqLD');
        use.setAttribute("transform", "rotate(90, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ([67, 83, 243].includes(cellID)) { // s67
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqLD');
        use.setAttribute("transform", "rotate(180, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ( cellID == 134 ) { // s134
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqLD');
        use.setAttribute("transform", "rotate(270, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ( cellID == 48 ) { // s48
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqDD');
      } else if ( cellID == 96 ) { // s96
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqDD');
        use.setAttribute("transform", "rotate(90, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ( cellID == 144 ) { // s144
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqDD');
        use.setAttribute("transform", "rotate(270, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ( cellID == 172 ) { // s172
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqDD');
        use.setAttribute("transform", "rotate(180, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ( cellID == 80 ) { // s80
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqDDd');
        use.setAttribute("transform", "rotate(90, " + (100*x+50) + ", " + (100*y+50) + ")");
      } else if ( cellID == 160 ) { // s160
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sqDDd');
      } else {
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#sq');
      }
      
      use.setAttribute("x", (100*x));
      use.setAttribute("y", (100*y));
      svg.appendChild(use);
    }
  }

  if (["r", "g", "b", "y", "s"].includes(goalID[0]) && goalID[1] >= 0) {
    const goalToken = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    
      
    const goalHexagonPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    goalHexagonPath.setAttribute("height", "1");
    goalHexagonPath.setAttribute("width", "1");
    goalHexagonPath.setAttribute("d", "M0,0.5 L0.25,0.07 0.75,.07 1,.5 0.75,.93 0.25,.93 0,0.5");
    goalHexagonPath.setAttribute("stroke-width", ".05");
    const symbolGoal = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
    symbolGoal.setAttribute("id", "goal");
    symbolGoal.setAttribute("viewBox", "-.04 -0.04 16 16");
    symbolGoal.setAttribute("transform", "scale(0.8, .8) translate(10, 10)");
    symbolGoal.appendChild(goalHexagonPath);

    
    switch (goalID[0]) {
      case 'r':
        goalHexagonPath.setAttribute("fill", "#e19a97");
        goalHexagonPath.setAttribute("stroke", "#ac8582");
        break;
      case 'g':
        goalHexagonPath.setAttribute("fill", "#6bd14c");
        goalHexagonPath.setAttribute("stroke", "#8bab81");
        break;
      case 'b':
        goalHexagonPath.setAttribute("fill", "#4C7DD1");
        goalHexagonPath.setAttribute("stroke", "#8291ac");
        break;
      case 'y':
        goalHexagonPath.setAttribute("fill", "#c1a530");
        goalHexagonPath.setAttribute("stroke", "#aca482");
        break;
      case 's':
        goalHexagonPath.setAttribute("fill", "#888888");
        goalHexagonPath.setAttribute("stroke", "#777777");
        break;
    }
    
    goalToken.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#goal');
    goalToken.setAttribute("x", 100 * (goalID[1] % 16));
    goalToken.setAttribute("y", 100 * Math.floor(goalID[1] / 16));
    svg.appendChild(symbolGoal);
    svg.appendChild(goalToken);

  }

  
  // add robots
  if (redID != null) {
    svg.appendChild( getRobot('r') );
    svg.appendChild( makeRobot(redID, 'r') );
  }
  if (blueID != null) {
    svg.appendChild( getRobot('b') );
    svg.appendChild( makeRobot(blueID, 'b') );
  }
  if (greenID != null) {
    svg.appendChild( getRobot('g') );
    svg.appendChild( makeRobot(greenID, 'g') );
  }
  if (yellowID != null) {
    svg.appendChild( getRobot('y') );
    svg.appendChild( makeRobot(yellowID, 'y') );
  }
  if (silverID != null) {
    svg.appendChild( getRobot('s') );
    svg.appendChild( makeRobot(silverID, 's') );
  }

  for (cnt = 0; cnt < moves.length; cnt++) {
      m = moves[cnt].split(",");
      m[1] = parseInt(m[1]);
      m[2] = parseInt(m[2]);
      m[3] = parseInt(m[3]);
      m[4] = parseInt(m[4]);
      console.log(m);
      if (m[3] > m[1]) { // going right
        svg.appendChild(getPath(m[0], "M"+(100*m[1]+50)+", "+(100*m[2]+50)+" "+(100*m[3]-15)+","+(100*m[4]+50)+"")); 
      } else if (m[1] > m[3]) { // going left
        svg.appendChild(getPath(m[0], "M"+(100*m[1]+50)+", "+(100*m[2]+50)+" "+(100*m[3]+115)+","+(100*m[4]+50)+"")); 
      } else if (m[2] > m[4]) { // going up
        svg.appendChild(getPath(m[0], "M"+(100*m[1]+50)+", "+(100*m[2]+50)+" "+(100*m[3]+50)+","+(100*m[4]+115)+"")); 
      } else if (m[4] > m[2]) {// going down
        svg.appendChild(getPath(m[0], "M"+(100*m[1]+50)+", "+(100*m[2]+50)+" "+(100*m[3]+50)+","+(100*m[4]-15)+"")); 
      } else {
        svg.appendChild(getPath(m[0], "M"+(100*m[1]+50)+", "+(100*m[2]+50)+" "+(100*m[3]+50)+","+(100*m[4]+50)+"")); 
      }
      
      svg.appendChild( makeMoveNumber(m[1], m[2]) );
      svg.appendChild( makeMoveText(m[1], m[2], cnt+1) );
  }
  

  // attach container to document
  document.getElementById("robots-svg").appendChild(svg);
  document.title = "NO ERRORS";

});



  
function copyStylesInline(destinationNode, sourceNode) {
  var containerElements = ["svg","g"];
  for (var cd = 0; cd < destinationNode.childNodes.length; cd++) {
      var child = destinationNode.childNodes[cd];
      if (containerElements.indexOf(child.tagName) != -1) {
            copyStylesInline(child, sourceNode.childNodes[cd]);
            continue;
      }
    //   var style = sourceNode.childNodes[cd].currentStyle || window.getComputedStyle(sourceNode.childNodes[cd]);
      var style = sourceNode.childNodes[cd].currentStyle;
      if (style == "undefined" || style == null) continue;
      for (var st = 0; st < style.length; st++) {
            child.style.setProperty(style[st], style.getPropertyValue(style[st]));
      }
    }
  }

function triggerDownload(imgURI, fileName) {
  var evt = new MouseEvent("click", {view: window, bubbles: false, cancelable: true});
  var a = document.createElement("a");
  a.setAttribute("download", fileName);
  a.setAttribute("href", imgURI);
  a.setAttribute("target", '_blank');
  a.dispatchEvent(evt);
}

function downloadSvg(svg, fileName) {
  var copy = svg.cloneNode(true);
  copyStylesInline(copy, svg);
  var canvas = document.createElement("canvas");
  var bbox = svg.getBBox();
  canvas.width = bbox.width;
  canvas.height = bbox.height;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, bbox.width, bbox.height);
  var data = (new XMLSerializer()).serializeToString(copy);
  var DOMURL = window.URL || window.webkitURL || window;
  var img = new Image();
  var svgBlob = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
  var url = DOMURL.createObjectURL(svgBlob);
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        var blob = canvas.msToBlob();         
        navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        var imgURI = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        triggerDownload(imgURI, fileName);
    }
    document.removeChild(canvas);
  };
  img.src = url;
}


f();
const vvv = document.getElementById('solution-svg');
downloadSvg(vvv, "soln.png");