// P_3_1_3_04
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * analysing and sorting the letters of a text
 * connecting subsequent letters with lines
 *
 * MOUSE
 * position x          : interpolate between normal text and sorted position
 *
 * KEYS
 * 1                   : toggle grey lines on/off
 * 2                   : toggle colored lines on/off
 * 3                   : toggle text on/off
 * 4                   : switch all letters off
 * 5                   : switch all letters on
 * a-z                 : switch letter on/off
 * ctrl                : save png
 */
'use strict';

var joinedText;
var charSet;
var counters = [];
var drawLetters = [];

var posX;
var posY;

var drawGreyLines = false;
var drawColoredLines = true;
var drawText = true;

function preload() {
  joinedText = loadStrings('data/digital-culture-sp24.txt');
}

function setup() {
  createCanvas(1400, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  textFont('monospace', 18);
  fill(0);

  joinedText = joinedText.join(' ');
  charSet = getUniqCharacters();
  for (var i = 0; i < charSet.length; i++) {
    counters[i] = 0;
    drawLetters[i] = true;
  }

  countCharacters();
}

function draw() {
  background(360);

  translate(50, 0);

  noStroke();

  posX = 0;
  posY = 200;
  var oldX = 0;
  var oldY = 0;
  var sortPositionsX = [];
  var oldPositionsX = [];
  var oldPositionsY = [];
  for (var i = 0; i < joinedText.length; i++) {
    sortPositionsX[i] = 0;
    oldPositionsX[i] = 0;
    oldPositionsY[i] = 0;
  }

  // draw counters
  if (mouseX >= width - 50) {
    textSize(10);
    for (var i = 0; i < charSet.length; i++) {
      textAlign(LEFT);
      text(charSet.charAt(i), -15, i * 20 + 40);
      textAlign(RIGHT);
      text(counters[i], -20, i * 20 + 40);
    }
    textAlign(LEFT);
    textSize(18);
  }

  // go through all characters in the text to draw them
  for (var i = 0; i < joinedText.length; i++) {
    // again, find the index of the current letter in the character set
    var upperCaseChar = joinedText.charAt(i).toUpperCase();
    var index = charSet.indexOf(upperCaseChar);
    if (index < 0) continue;

    var m = map(mouseX, 50, width - 50, 0, 1);
    m = constrain(m, 0, 1);

    var sortX = sortPositionsX[index];
    var interX = lerp(posX, sortX, m);

    var sortY = index * 20 + 40;
    var interY = lerp(posY, sortY, m);

    if (drawLetters[index]) {
      if (drawGreyLines) {
        if (oldX != 0 && oldY != 0) {
          stroke(0, 10);
          line(oldX, oldY, interX, interY);
        }
        oldX = interX;
        oldY = interY;
      }

      if (drawColoredLines) {
        if (oldPositionsX[index] != 0 && oldPositionsY[index] != 0) {
          stroke(index * 10, 80, 60, 50);
          line(oldPositionsX[index], oldPositionsY[index], interX, interY);
        }
        oldPositionsX[index] = interX;
        oldPositionsY[index] = interY;
      }

      if (drawText) {
        text(joinedText.charAt(i), interX, interY);
      }
    } else {
      oldX = 0;
      oldY = 0;
    }

    sortPositionsX[index] += textWidth(joinedText.charAt(i));
    posX += textWidth(joinedText.charAt(i));
    if (posX >= width - 200 && upperCaseChar == ' ') {
      posY += 40;
      posX = 0;
    }
  }
}

function getUniqCharacters() {
  var charsArray = joinedText.toUpperCase().split('');
  var uniqCharsArray = charsArray.filter(function(char, index) {
    return charsArray.indexOf(char) == index;
  }).sort();
  return uniqCharsArray.join('');
}

function countCharacters() {
  for (var i = 0; i < joinedText.length; i++) {
    // get one character from the text and turn it to uppercase
    var index = charSet.indexOf(joinedText.charAt(i).toUpperCase());
    // increacre the respective counter
    if (index >= 0) counters[index]++;
  }
}

function keyReleased() {
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');

  if (key == '1') drawGreyLines = !drawGreyLines;
  if (key == '2') drawColoredLines = !drawColoredLines;
  if (key == '3') drawText = !drawText;
  if (key == '4') {
    for (var i = 0; i < charSet.length; i++) {
      drawLetters[i] = false;
    }
  }
  if (key == '5') {
    for (var i = 0; i < charSet.length; i++) {
      drawLetters[i] = true;
    }
  }

  var index = charSet.indexOf(key.toUpperCase());
  if (index >= 0) {
    drawLetters[index] = !drawLetters[index];
  }
}
