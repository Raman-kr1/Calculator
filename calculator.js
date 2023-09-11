// var expresion = "0";

var display = document.getElementById("display");
// display.innerText = expresion;
var op1 = 0;
var op2 = null;
var ops = null;

var keypad = document.getElementsByClassName("btn");

for (var i = 0; i < keypad.length; i++) {
  keypad[i].addEventListener("click", function () {
    var value = this.getAttribute("data-value");
    // console.log(value);
    // switch (value) {
    //   case "+":
    //     ops = "+";
    //     op1 = parse.float(display.textContent);
    //     // console.log(op1);
    //     display.innerText = null;
    //     break;
    //   case "-":
    //     ops = "-";
    //     op1 = parse.float(display.textContent);
    //     // console.log(op1);
    //     display.innerText = null;
    //     break;
    //   case "x":
    //     ops = "*";
    //     op1 = display.innerText;
    //     // console.log(op1);
    //     display.innerText = null;
    //     break;
    //   case "/":
    //     ops = "/";
    //     op1 = parse.float(display.textContent);
    //     // console.log(op1);
    //     display.innerText = null;
    //     break;
    //   //   case "%":
    //   //         ops = "+";
    //   //         op1 = Parse.float(display.textContent);
    //   //         // console.log(op1);
    //   //         display.innerText=null;
    //   //         break;
    // }
    if (
      value == "+" ||
      value == "-" ||
      value == "*" ||
      value == "/" ||
      value == "%"
    ) {
      op1 = parseFloat(display.innerText);
      display.innerText = null;
      ops = value;

      display.innerText = null;
    } else if (value == "DEL") {
    } else if (value == "AC") {
      display.innerText = null;
    } else if (value == "=") {
      op2 = parseFloat(display.innerText);
      if (ops == "%") {
        display.innerText = (op1 / 100) * op2;
      } else {
        display.innerText = eval(op1 + " " + ops + " " + op2);
      }
    } else {
      display.innerText = display.innerText + value;
    }
  });
}
