const body = document.querySelector("body");
const calculator = document.querySelector("#calculator");
const darkModeSwitch = document.querySelector(".switch");
const darkModeText = document.querySelector("#dark-mode-text");

const activeNum = document.querySelector("#active-num");
const expression = document.querySelector("#expression");
const clearBtn = document.querySelector("#clear");
const darkMode = document.querySelector(".switch");

let darkModeOn = false;

const operators = ["÷", "×", "–", "+"]

darkModeSwitch.addEventListener("mouseup", toggleDarkMode)

function toggleDarkMode() 
{
	const root = document.documentElement;
	const newTheme = root.className === 'light' ? 'dark' : 'light';
	root.className = newTheme;
	darkModeText.textContent = newTheme;

}

const buttons = document.querySelectorAll(".button");
buttons.forEach(button => 
{
	button.addEventListener("click", () => 	calculate(button.textContent));
});

window.addEventListener("keydown", (e) => 
	{
	if (e.key === "Backspace") 
	{
		backspaceActiveNum();
	} else if (e.key === "Enter") 
	{
		calculate("=");
	} else if (e.key.length > 1) 
	{
		return;	
	}
	else if (parseInt(e.key)) 
	{
		calculate(e.key); 
	} else 
	{
		const buttonFromKey = convertKeyToButtonText(e.key)
		if (buttonFromKey) 
		{ 
			calculate(buttonFromKey);
		}
	}
});

function backspaceActiveNum() 
{
	activeNum.textContent = activeNum.textContent.slice(0, -1);
	if (activeNum.textContent === "") 
	{
		halfClear();
	}
}

function convertKeyToButtonText(eventKey) 
{
	switch (eventKey) 
	{
		case "x":
		case "*":
			return "×";

		case "/":
			return "÷";

		case "-":
			return "–";

		case "a":
			return "+";

		case "p":
			return "%";

		case "c":
			return "C";

		case "i":
			return "+/-";

		case "f":
			return "!"
			break;

		case "!":

		case ".":

		case "%":

		case "–":

		case "÷":

		case "+":

		case "=":

		case "0":
			return eventKey;

		default:
			return;
	}
}

function calculate(buttonText) 
{
	switch (buttonText) 
	{
		case "C":
		case "AC":
			checkHalfClear() ? halfClear() : allClear();
			break;

		case "+/-":
			updateActiveNum(+(activeNum.textContent * -1), "set")
			break;

		case "%":
			updateActiveNum(+(activeNum.textContent / 100), "set")
			break;

		case ".":
			clearBtn.textContent = "C";
			if (!activeNum.textContent.includes("."))
			{
				updateActiveNum(buttonText, "add");
			}
			break;

		case "!":
			displayFactorial(activeNum.textContent);
			break;

		case "=":
			checkRepeatEquals();
			break;

		case "÷":

		case "×":

		case "–":

		case "+":
			fireOperator(buttonText);
			break;

		default:
			if (activeNum.textContent === "0") activeNum.textContent = "";
			clearBtn.textContent = "C";
			updateActiveNum(buttonText, "add");
			break;
	};
}

function checkRepeatEquals() 
{
	if (+activeNum.textContent === 0) return;
	const operatorPres = operators.some(operator => 
	{
		return expression.textContent.includes(operator)
	});
	const bIsEmpty = expression.textContent.split(" ").includes("");
	if (!operatorPres) return;
	else if (bIsEmpty && operatorPres) 
	{
		runEquals(true);
	} else 
	{
		let expArray = expression.textContent.split(" ");
		expArray.splice(0, 1, activeNum.textContent);
		expression.textContent = expArray.join(" ");
		runEquals(false);
	}
}

function runEquals(addToEnd) 
{
	if (addToEnd) expression.textContent += activeNum.textContent;
	updateActiveNum(operate(expression.textContent), "set");
}

function updateActiveNum(value, setAdd) 
{
	if (value.toString().length > 13 && value < 9999999999) 
	{
		value = value.toFixed(10);
	} 
	else if (value.toString().length > 13 && value > 9999999999) 
	{
		value = value.toExponential(7);

	}
	if (setAdd ===  "set") 
	{
		activeNum.textContent = +value
	}
	if (setAdd ===  "add") 
	{
		activeNum.textContent += value

	}
}

function updateExpression(value) 
{
	if (value.toString().length > 14) 
	{
		expression.style.fontSize = "10px";
	}
	expression.textContent = "";
	expression.textContent += `${activeNum.textContent} ${value} `;
	activeNum.textContent = "0";
}

function checkHalfClear() 
{
	return clearBtn.textContent === "C";
}

function allClear() 
{
	activeNum.textContent = "0";
	expression.textContent = "";
	clearBtn.textContent = "AC";
}

function halfClear() 
{
	activeNum.textContent = "0";
	clearBtn.textContent = "AC";
}

function operate(str) 
{
	const split = str.split(' '),
		a = +split[0],
		opr = split[1],
		b = +split[2];

	const methods = 
	{
		"+": (a, b) => a + b,
		"–": (a, b) => a - b,
		"×": (a, b) => a * b,
		"÷": (a, b) => a / b,
	};

	if (!methods[opr] || isNaN(a) || isNaN(b)) 
	{
		return;
	}
	const answer = methods[opr](a, b);
	return +(answer + Number.EPSILON);
}

function fireOperator(buttonText) 
{
	const operatorPres = operators.some(operator => 
	{
		return expression.textContent.includes(operator)
	});
	const bIsEmpty = expression.textContent.split(" ").includes("");
	if (bIsEmpty && operatorPres) 
	{
		runEquals(true);
		updateExpression(buttonText);
		activeNum.textContent = "";
	} else 
	{
		updateExpression(buttonText);
	}
}

function displayFactorial(value) 
{
	expression.textContent = `${value}!`
	updateActiveNum(factorial(value), "set");
}

function factorial(num) 
{
	num = Math.floor(Math.abs(num));
	return num === 0 ? 1 : num * factorial(num -1);
};
