// fix arrow end issues:
// https://github.com/DmitryBaranovskiy/raphael/issues/471

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
			HTMLclass: "big-company"
		}
	},

	nodeStructure: {
		text: { name: "main" },
		children: [
			{
			text: { name: "work" },
			children: [
				{ text: { name: "hard" } },
				{ text: { name: "simple" } }
			]
			},
			{ text: { name: "education" } }
		]
	}
};

var chart_config2 = {
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
			HTMLclass: "big-company"
		}
	},

	nodeStructure: {
		text: { name: "secondary" },
		children: [
			{
			text: { name: "additional" },
			children: [
				{ text: { name: "overview" } },
				{ text: { name: "optimization" } }
			]
			},
			{ text: { name: "distractions" } }
		]
	}
};
