/******************************************************************************
 * Tails Adventure Password Generator                                         *
 *                                                                            *
 * Copyright (C) 2019 J.C. Fields (jcfields@jcfields.dev).                    *
 *                                                                            *
 * Permission is hereby granted, free of charge, to any person obtaining a    *
 * copy of this software and associated documentation files (the "Software"), *
 * to deal in the Software without restriction, including without limitation  *
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,   *
 * and/or sell copies of the Software, and to permit persons to whom the      *
 * Software is furnished to do so, subject to the following conditions:       *
 *                                                                            *
 * The above copyright notice and this permission notice shall be included in *
 * all copies or substantial portions of the Software.                        *
 *                                                                            *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,   *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL    *
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING    *
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER        *
 * DEALINGS IN THE SOFTWARE.                                                  *
 ******************************************************************************/

"use strict";

/*
 * constants
 */

const STORAGE_NAME = "tailsadv";

/*
 * initialization
 */

window.addEventListener("load", function() {
	const passgen = new Generator();
	const view = new View(passgen);
	const store = new Storage(STORAGE_NAME);

	const mem = store.load();

	if (mem != null) { // restores from local storage if set
		passgen.load(mem);
	}

	view.update();

	window.addEventListener("beforeunload", function() {
		store.save(passgen.save());
	});
	window.addEventListener("keyup", function(event) {
		if (event.keyCode == 27) { // Esc
			$("#overlay").classList.remove("open");
		}
	});

	document.addEventListener("click", function(event) {
		const element = event.target;

		if (element.matches("#warnings")) {
			$("#overlay").classList.toggle("open");
		}

		if (element.matches("#close")) {
			$("#overlay").classList.remove("open");
		}

		if (element.matches("#reset")) {
			passgen.reset();
			view.update();
		}

		if (element.closest("#items button")) {
			passgen.toggle("items", element.closest("button").value);
			view.update();
		}

		if (element.matches("#stages input")) {
			passgen.toggle("stages", element.value);
			view.update();
		}

		if (element.matches(".stage")) {
			passgen.stages.add(element.value);
			view.update();
		}

		if (element.matches(".item")) {
			passgen.items.add(element.value);
			view.update();
		}
	});
	document.addEventListener("mousedown", function(event) {
		const element = event.target;

		if (element.closest("section#items button")) {
			const button = element.closest("section#items button");

			view.drag = button.value;
			view.state = !button.classList.contains("active");
		}
	});
	document.addEventListener("mouseup", function(event) {
		const element = event.target;

		if (element.closest("main")) {
			view.drag = "";
		}
	});
	document.addEventListener("mousemove", function(event) {
		const element = event.target;

		if (element.closest("section#items button")) {
			const button = element.closest("section#items button");

			if (view.drag != "" && view.drag != button.value) {
				passgen.set("items", button.value, view.state);
				passgen.set("items", view.drag, view.state);
				view.update();
			}
		}
	});

	for (const element of $$("#items img")) {
		element.setAttribute("draggable", "false");
	}
});

function $(selector) {
	return document.querySelector(selector);
}

function $$(selector) {
	return Array.from(document.querySelectorAll(selector));
}

/*
 * Generator prototype
 */

function Generator() {
	this.items = new Set();
	this.stages = new Set();
}

Generator.prototype.toggle = function(type, value) {
	if (!this[type].has(value)) {
		this.add(type, value);
	} else {
		this.remove(type, value);
	}
};

Generator.prototype.set = function(type, value, state) {
	if (state && !this[type].has(value)) {
		this.add(type, value);
	} else if (!state && this[type].has(value)) {
		this.remove(type, value);
	}
};

Generator.prototype.add = function(type, value) {
	this[type].add(value);
};

Generator.prototype.remove = function(type, value) {
	this[type].delete(value);
};

Generator.prototype.update = function() {
	const password = data.password.slice();
	processSelections.call(this, "items");
	processSelections.call(this, "stages");

	return password;

	function processSelections(type) {
		for (const [key, item] of data[type]) {
			if (!this[type].has(key)) {
				continue;
			}

			if (Array.isArray(item.index) && Array.isArray(item.increment)) {
				for (const [i, index] of item.index.entries()) {
					password[index] += item.increment[i];
				}
			} else {
				password[item.index] += item.increment;
			}

			let check = password[password.length - 1] || 0;

			switch (item.check) {
				case CHECK1:
					if (check % 2 != 0 && (check % 4 == 2 || check % 4 == 3)) {
						check += 9;
					} else {
						check += 1;
					}

					break;
				case CHECK2:
					if (check % 4 == 2 || check % 4 == 3) {
						check += 10;
					} else {
						check += 2;
					}

					break;
				default:
					check += item.check;
			}

			password[password.length - 1] = check;
		}
	}
};

Generator.prototype.validate = function() {
	const warnings = [];
	checkRequires.call(this, "items");
	checkRequires.call(this, "stages");
	checkItemLost.call(this, "stages");

	return warnings;

	function checkRequires(type) {
		for (const [key, value] of data[type]) {
			if (value.requires == undefined) {
				continue;
			}

			for (const stage of value.requires) {
				if (this[type].has(key) && !this.stages.has(stage)) {
					warnings.push({key, type, stage});
				}
			}
		}
	}

	function checkItemLost(type) {
		for (const [key, value] of data[type]) {
			if (value.itemLost == undefined) {
				continue;
			}

			for (const item of value.itemLost) {
				if (this[type].has(key) && !this.items.has(item)) {
					warnings.push({key, item});
				}
			}
		}
	}
};

Generator.prototype.load = function(obj) {
	for (const key of Object.keys(obj)) {
		if (this[key] == undefined) {
			continue;
		}

		for (const item of obj[key]) {
			this[key].add(item);
		}
	}
};

Generator.prototype.save = function() {
	return {
		items:  Array.from(this.items),
		stages: Array.from(this.stages)
	};
};

Generator.prototype.reset = function() {
	this.items.clear();
	this.stages.clear();
};

/*
 * View prototype
 */

function View(passgen) {
	this.passgen = passgen;
	this.drag = "";
	this.state = false;
}

View.prototype.update = function() {
	updateWidgets.call(this);
	updatePassword.call(this);
	updateWarnings.call(this);

	function updateWidgets() {
		for (const element of $$("#items button")) {
			if (element.disabled) {
				continue;
			}

			const state = this.passgen.items.has(element.value);
			element.classList.toggle("active", state);
		}

		for (const element of $$("#stages input")) {
			if (element.disabled) {
				continue;
			}

			const state = this.passgen.stages.has(element.value);
			element.checked = state;
			element.parentNode.classList.toggle("checked", state);
		}
	}

	function updatePassword() {
		const password = this.passgen.update().reduce(function(text, num, i) {
			num %= 16;
			return text + num.toString(16);
		}, "");

		$("#password textarea").value = password.toUpperCase();
	}

	function updateWarnings() {
		const warnings = this.passgen.validate().map(function(warning) {
			let message = "";

			if ("item" in warning) {
				const item = data.items.get(warning.item).name;
				const stage = data.stages.get(warning.key).name;

				message = `The item *${item}* will not be attainable if the `
					    + `stage *${stage}* has been completed.`;
			} else if ("stage" in warning) {
				const type = warning.type.slice(0, -1);
				const item = data[warning.type].get(warning.key).name;
				const stage = data.stages.get(warning.stage).name;

				message = `The ${type} *${item}* cannot be selected until the `
					    + `stage *${stage}* has been completed.`;
			}

			warning.message = message;
			return warning;
		});

		const table = document.createElement("table");

		for (const warning of warnings) {
			const tr = document.createElement("tr");

			const buttonCell = document.createElement("td");
			const button = document.createElement("button");
			button.setAttribute("type", "button");

			if ("stage" in warning) {
				button.className = "stage";
				button.value = warning.stage;
			} else if ("item" in warning) {
				button.className = "item";
				button.value = warning.item;
			}

			button.appendChild(document.createTextNode("Fix"));
			buttonCell.appendChild(button);
			tr.appendChild(buttonCell);

			const warningCell = document.createElement("td");
			warningCell.appendChild(document.createTextNode(warning.message));
			warningCell.innerHTML = warningCell.innerHTML.replace(
				/\*([^*]+)\*/g,
				'<span class="highlight">$1</span>'
			);
			tr.appendChild(warningCell);
			table.appendChild(tr);
		}

		$("#overlay table").replaceWith(table);
		$("#warnings").textContent = `Warnings (${warnings.length})`;

		// closes warnings overlay if no warnings left
		if (warnings.length == 0) {
			$("#overlay").classList.remove("open");
			$("#warnings").disabled = true;
		} else {
			$("#warnings").disabled = false;
		}
	}
};

/*
 * Storage prototype
 */

function Storage(name) {
	this.name = name;
}

Storage.prototype.load = function() {
	try {
		const contents = localStorage.getItem(this.name);

		if (contents != null) {
			return JSON.parse(contents);
		}
	} catch (err) {
		console.error(err);
		this.reset();
		return null;
	}
};

Storage.prototype.save = function(obj) {
	try {
		const length = Object.values(obj).reduce(function(len, arr) {
			return len + arr.length;
		}, 0);

		if (length > 0) {
			localStorage.setItem(this.name, JSON.stringify(obj));
		} else {
			this.reset();
		}
	} catch (err) {
		console.error(err);
	}
};

Storage.prototype.reset = function() {
	try {
		localStorage.removeItem(this.name);
	} catch (err) {
		console.error(err);
	}
};