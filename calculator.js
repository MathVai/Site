"use strict";

document.addEventListener('windowOpened', function (event) {
  if (event.windowId === "calculator") {
    var calculatorWindow = document.querySelector(`.window[data-id="${event.windowId}"]`);
    initializeCalculator(calculatorWindow);
  }
});

function initializeCalculator(windowElement) {
  var input = windowElement.querySelector('#input'),
    number = windowElement.querySelectorAll('.numbers div'),
    operator = windowElement.querySelectorAll('.operators div'),
    result = windowElement.querySelector('#result'),
    clear = windowElement.querySelector('#clear'),
    resultDisplayed = false;

  for (var i = 0; i < number.length; i++) {
    number[i].addEventListener("click", function (e) {
      var currentString = input.innerHTML;
      var lastChar = currentString[currentString.length - 1];
      if (e.target.innerHTML === '.' && lastChar === '.') return;
      if (e.target.innerHTML === '.' && currentString.split(/[\+\-\×\÷]/).pop().includes('.')) return;
      if (currentString.length >= 15) return;
      input.innerHTML += e.target.innerHTML;
    });
  }

  for (var i = 0; i < operator.length; i++) {
    operator[i].addEventListener("click", function (e) {
      var currentString = input.innerHTML;
      var lastChar = currentString[currentString.length - 1];
      if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
        input.innerHTML = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
      } 
      else if (currentString.length !== 0 && !currentString.match(/[+\-×÷]/)) {
        input.innerHTML += e.target.innerHTML;
      }
    });
  }

  result.addEventListener("click", function () {
    var inputString = input.innerHTML;
    var lastChar = inputString[inputString.length - 1];
    if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
      input.innerHTML = 'ERR';
      return;
    }
    var numbers = inputString.split(/\+|\-|\×|\÷/g);
    var operators = inputString.replace(/[0-9]|\./g, "").split("");
    ['÷', '×', '-', '+'].forEach(function(op, index) {
      var operatorIndex = operators.indexOf(op);
      while (operatorIndex != -1) {
        numbers.splice(operatorIndex, 2, eval(numbers[operatorIndex] + ['/', '*', '-', '+'][index] + numbers[operatorIndex + 1]));
        operators.splice(operatorIndex, 1);
        operatorIndex = operators.indexOf(op);
      }
    });
    var output = parseFloat(numbers[0]);
    input.innerHTML = (output % 1 === 0) ? output : parseFloat(output.toFixed(4)).toString();
    resultDisplayed = true;
  });

  clear.addEventListener("click", function () {
    input.innerHTML = "";
  });
}
