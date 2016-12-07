var chart_config = {
	chart: {
		container: "#OrganiseChart-big-company",
		levelSeparation: 20,
		rootOrientation: "WEST",
		connectors: {
			type: "curve",
			style: {
				"stroke-width": 2,
				stroke: "#50688D"
			}
		},
		node: {
			HTMLclass: "cell"
		}
	},
	nodeStructure: {
		text: { name: "" },
		pseudo: "true",
		children: JSON.parse(decodeURIComponent(location.search.split('tree=')[1]))
	}
};

function genImage(name, image, visibility, action) {
	return "<img id=\"" + name + action + "\" style=\"display:" + (visibility ? "block" : "none") + "\" src=\"" + image + "\" onclick=" + action + "(\"" + name + "\")>";
}

function genPrioritySelect(node) {
	var priorityHtml = "";
	if (node.text.priority != null) {
		priorityHtml = "<select name=\"" + node.text.name + "\" onchange=changePriority(this)>";
		for(var i = 1; i <= 6; i++) {
			if (i != node.text.priority)
				priorityHtml += "<option>" + i + "</option>";
			else
				priorityHtml += "<option selected>" + i + "</option>";
		}
		priorityHtml += "</select>";
	}
	return priorityHtml;
}

function innerHTML(node, child) {
	var haveCreate = node.children[node.children.length - 1].text ? 0 : 1;
	var lastIndex = node.children.length - 1 - haveCreate;
	return "<input type=input value=" + child.text.value + " name=\"" + child.text.name + "\"size=10 style=\"text-align:center;border:0\" onchange=changeText(this)></input><p>"
		+ genImage(child.text.name, "remove2.png", !node.text.name && !(!node.children[0].children && !node.children[1].children && !node.children[2].text), "removeNode")
		+ genImage(child.text.name, "down.png", node.children.indexOf(child) < lastIndex, "down")
		+ genImage(child.text.name, "up.png", node.children.indexOf(child) > 0, "up")
		+ genImage(child.text.name, "union.png", !node.text.name && node.children.length > 2 + haveCreate && node.children.indexOf(child) < lastIndex, "union")
		+ genPrioritySelect(child)
		+ "</p>"
}

var leavesCount = 0;
var itemCounter = 0;
function init(node) {
	if (node.children) {
		for(var i = 0; i < node.children.length; i++) {
			var child = node.children[i];
			if (!child.text)
				continue;
			if (!child.text.value)
				child.text.value = child.text.name;
			child.innerHTML = innerHTML(node, child);
			child.parent = node;
			init(child);
		}
	}
	else {
		leavesCount++;
	}
}
init(chart_config.nodeStructure);
if (leavesCount < 6) {
	addCreate(chart_config.nodeStructure);
}

function clear(node) {
	if (node.children) {
		for(var i = 0; i < node.children.length; i++) {
			var child = node.children[i];
			delete child['innerHTML'];
			delete child['parent'];
			clear(child);
		}
	}
}

function addCreate(node) {
	var createNode = {
		innerHTML: "<img src=\"create.png\" onclick=create()>",
		HTMLclass: "insert"
	};
	node.children.splice(node.children.length, 0, createNode);
}

function create() {
	var node = chart_config.nodeStructure;
	var newNode = {
		text: { name: "work" + itemCounter++ }
	};
	node.children.splice(node.children.length - 1, 1, newNode);
	x.destroy();
	leavesCount = 0;
	init(node);
	if (leavesCount < 6)
		addCreate(node);
	x = new Treant(chart_config);
}

function byName(node, name) {
	if (node.text.name == name)
		return node;
	if (node.children) {
		for(var i = 0; i < node.children.length; i++) {
			childNode = byName(node.children[i], name);
			if (childNode)
				return childNode;
		}
	}
	return undefined;
}

function changeText(input) {
	var node = byName(chart_config.nodeStructure, input.name);
	input.name = input.value;
	node.text.value = input.value;
}

function changePriority(input) {
	var node = byName(chart_config.nodeStructure, input.name);
	node.text.priority = parseInt(input.value);
}

function removeNode(name) {
	var node = byName(chart_config.nodeStructure, name);
	var index = node.parent.children.indexOf(node);
	if (node.children) {
		node.children[0].parent = node.parent;
		node.children[1].parent = node.parent;
		node.parent.children.splice(index, 1, node.children[0], node.children[1]);
	}
	else {
		if (leavesCount == 6)
			addCreate(node.parent);
		node.parent.children.splice(index, 1);
	}
	x.destroy();
	leavesCount = 0;
	init(chart_config.nodeStructure);
	x = new Treant(chart_config);
}

function union(name) {
	var node1 = byName(chart_config.nodeStructure, name);
	var children = node1.parent.children;
	var index = children.indexOf(node1);
	var node2 = children[index + 1];

	var node = {
		text: { name: node1.text.name + node2.text.name, value: node1.text.value + node2.text.value },
		children: [node1, node2],
	};
	node1.parent.children.splice(index, 2, node);
	x.destroy();
	leavesCount = 0;
	init(chart_config.nodeStructure);
	x = new Treant(chart_config);
}

function up(name) {
	return move(name, false);
}

function down(name) {
	return move(name, true);
}

function move(name, down) {
	var node = byName(chart_config.nodeStructure, name);
	var children = node.parent.children;
	var index = children.indexOf(node);
	var inc = down ? 1 : -1;
	children[index] = children[index + inc];
	children[index + inc] = node;
	x.destroy();
	leavesCount = 0;
	init(chart_config.nodeStructure);
	x = new Treant(chart_config);
}
