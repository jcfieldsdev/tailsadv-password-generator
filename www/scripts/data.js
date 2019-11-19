"use strict";

const CHECK1 = -1;
const CHECK2 = -2;

const data = {};

data.password = [ // default
	0xd, 0x2, 0x1, 0x9,
	0x5, 0x4, 0xd, 0x4,
	0xa, 0xe, 0x5, 0x9,
	0xd, 0x2, 0xe, 0x0
];

data.items = new Map([
	["regularBomb", {
		name:      "Regular Bomb",
		index:     0,
		increment: 0,
		check:     0
	}],
	["largeBomb", {
		name:      "Large Bomb",
		index:     0,
		increment: 12,
		check:     12
	}],
	["remoteBomb", {
		name:      "Remote Bomb",
		index:     [0, 9],
		increment: [2, 14],
		check:     12
	}],
	["napalmBomb", {
		name:      "Napalm Bomb",
		index:     0,
		increment: 15,
		check:     1
	}],
	["tripleBomb", {
		name:      "Triple Bomb",
		index:     [2, 9],
		increment: [8, 8],
		check:     0
	}],
	["wrench", {
		name:      "Wrench",
		index:     2,
		increment: 4,
		check:     12
	}],
	["helmet", {
		name:      "Helmet",
		index:     2,
		increment: 2,
		check:     2
	}],
	["remoteRobot", {
		name:      "Remote Robot",
		index:     2,
		increment: 15,
		check:     CHECK1,
		requires:  ["poloyForest"]
	}],
	["hammer", {
		name:      "Hammer",
		index:     4,
		increment: 8,
		check:     8
	}],
	["teleportDevice", {
		name:      "Teleport Device",
		index:     [4, 9],
		increment: [12, 12],
		check:     8
	}],
	["nightVision", {
		name:      "Night Vision",
		index:     4,
		increment: 2,
		check:     CHECK2
	}],
	["speedBoots", {
		name:      "Speed Boots",
		index:     4,
		increment: 15,
		check:     CHECK1
	}],
	["superGlove", {
		name:      "Super Glove",
		index:     6,
		increment: 8,
		check:     8
	}],
	["fang", {
		name:      "Fang",
		index:     6,
		increment: 12,
		check:     12
	}],
	["knuckles", {
		name:      "Knuckles",
		index:     6,
		increment: 2,
		check:     CHECK2
	}],
	["sonic", {
		name:      "Sonic",
		index:     [9, 6],
		increment: [1, 15],
		check:     CHECK2
	}],
	["itemRadar", {
		name:      "Item Radar",
		index:     [8, 13],
		increment: [8, 8],
		check:     0
	}],
	["radio", {
		name:      "Radio",
		index:     8,
		increment: 4,
		check:     12
	}],
	["blueEmerald", {
		name:      "Blue Emerald",
		index:     8,
		increment: 14,
		check:     CHECK2
	}],
	["greenEmerald", {
		name:      "Green Emerald",
		index:     8,
		increment: 1,
		check:     CHECK1
	}],
	["purpleEmerald", {
		name:      "Purple Emerald",
		index:     10,
		increment: 8,
		check:     8
	}],
	["redEmerald", {
		name:      "Red Emerald",
		index:     [10, 13],
		increment: [12, 4],
		check:     8
	}],
	["whiteEmerald", {
		name:      "White Emerald",
		index:     10,
		increment: 2,
		check:     CHECK2
	}],
	["yellowEmerald", {
		name:      "Yellow Emerald",
		index:     10,
		increment: 15,
		check:     CHECK1
	}],
	["protonTorpedo", {
		name:      "Proton Torpedo",
		index:     12,
		increment: 8,
		check:     8
	}],
	["vulcanGun", {
		name:      "Vulcan Gun",
		index:     0,
		increment: 0,
		check:     0
	}],
	["extraSpeed", {
		name:      "Extra Speed",
		index:     [12, 13],
		increment: [2, 14],
		check:     12
	}],
	["extraArmor", {
		name:      "Extra Armor",
		index:     12,
		increment: 15,
		check:     CHECK1
	}],
	["antiAirMissile", {
		name:      "Anti-air Missile",
		index:     14,
		increment: 8,
		check:     8
	}],
	["spark", {
		name:      "Spark",
		index:     14,
		increment: 12,
		check:     12
	}],
	["mine", {
		name:      "Mine",
		index:     14,
		increment: 14,
		check:     CHECK2
	}],
	["rocketBooster", {
		name:      "Rocket Booster",
		index:     [13, 14],
		increment: [1, 1],
		check:     CHECK2
	}]
]);

data.stages = new Map([
	["poloyForest", {
		name:      "Poloy Forest",
		index:     [3, 11],
		increment: [8, 8],
		check:     0
	}],
	["volcanicTunnel", {
		name:      "Volcanic Tunnel",
		index:     1,
		increment: 8,
		check:     8
	}],
	["caronForest", {
		name:      "Caron Forest",
		index:     5,
		increment: 8,
		check:     8
	}],
	["pollyMt1", {
		name:      "Polly Mountain 1",
		index:     5,
		increment: 2,
		check:     CHECK2
	}],
	["pollyMt1Boss", {
		name:      "Polly Mountain 1 Boss",
		index:     1,
		increment: 4,
		check:     12,
		itemLost:  ["purpleEmerald"]
	}],
	["lakeRocky", {
		name:      "Lake Rocky",
		index:     7,
		increment: 12,
		check:     12
	}],
	["cavernIsland", {
		name:      "Cavern Island",
		index:     [5, 11],
		increment: [12, 4],
		check:     8,
		itemLost:  ["antiAirMissile"]
	}],
	["greenIsland", {
		name:      "Green Island",
		index:     3,
		increment: 4,
		check:     12
	}],
	["lakeCrystal", {
		name:      "Lake Crystal",
		index:     [7, 11],
		increment: [2, 2],
		check:     12
	}],
	["lakeRockyPipe", {
		name:      "Lake Rocky Pipe",
		index:     1,
		increment: 14,
		check:     CHECK2
	}],
	["cocoIsland", {
		name:      "Coco Island",
		index:     [1, 11],
		increment: [1, 15],
		check:     CHECK2
	}],
	["cocoIslandBoss", {
		name:      "Coco Island Boss",
		index:     7,
		increment: 8,
		check:     8,
		itemLost: ["teleportDevice", "yellowEmerald"]
	}],
	["pollyMt2", {
		name:      "Polly Mountain 2",
		index:     [1, 3],
		increment: [2, 2],
		check:     0,
		requires:  ["lakeRockyPipe"]
	}],
	["battleFortress1", {
		name:      "Battle Fortress 1",
		index:     1,
		increment: 14,
		check:     CHECK2,
		requires:  ["lakeRockyPipe", "pollyMt2"]
	}],
	["battleFortress2Boss", {
		name:      "Battle Fortress 2 Mini-Boss",
		index:     3,
		increment: 15,
		check:     CHECK1
	}]
]);