
function update(dt) {
	if (window.gameMode === 'double') {
		window.LeftHex.dt = dt;
		window.RightHex.dt = dt;
		window.LeftHex.ct = MainHex.ct;
		window.RightHex.ct = MainHex.ct;
	} else {
		MainHex.dt = dt;
	}

	if (gameState == 1) {
		if (window.gameMode === 'double') {
			window.waveone_left.update();
			window.waveone_right.update();
			if (window.LeftHex.ct - window.waveone_left.prevTimeScored > 1000) {
				window.waveone_left.prevTimeScored = window.LeftHex.ct;
			}
			if (window.RightHex.ct - window.waveone_right.prevTimeScored > 1000) {
				window.waveone_right.prevTimeScored = window.RightHex.ct;
			}
		} else {
			waveone.update();
			if (MainHex.ct - waveone.prevTimeScored > 1000) {
				waveone.prevTimeScored = MainHex.ct;
			}
		}
	}

	var i;
	// 1. Collision check for all falling blocks
	for (i = 0; i < blocks.length; i++) {
		var targetHex = blocks[i].targetHex || MainHex;
		targetHex.doesBlockCollide(blocks[i]);
		if (!blocks[i].settled) {
			if (!blocks[i].initializing) blocks[i].distFromHex -= blocks[i].iter * dt * settings.scale;
		} else if (!blocks[i].removed) {
			blocks[i].removed = 1;
		}
	}

	// 2. Update blocks on hexagons
	if (window.gameMode === 'double') {
		updateHexagon(window.LeftHex, dt);
		updateHexagon(window.RightHex, dt);
	} else {
		updateHexagon(MainHex, dt);
	}

	// 3. Clean up removed blocks
	for (i = 0; i < blocks.length; i++) {
		if (blocks[i].removed == 1) {
			blocks.splice(i, 1);
			i--;
		}
	}

	MainHex.ct += dt;
}

function updateHexagon(hex, dt) {
	var lowestDeletedIndex = 99;
	var i, j, block;

	// Consolidate checked blocks
	for (i = 0; i < hex.blocks.length; i++) {
		for (j = 0; j < hex.blocks[i].length; j++) {
			if (hex.blocks[i][j].checked == 1) {
				consolidateBlocks(hex, hex.blocks[i][j].attachedLane, hex.blocks[i][j].getIndex());
				hex.blocks[i][j].checked = 0;
			}
		}
	}

	// Remove deleted blocks
	for (i = 0; i < hex.blocks.length; i++) {
		lowestDeletedIndex = 99;
		for (j = 0; j < hex.blocks[i].length; j++) {
			block = hex.blocks[i][j];
			if (block.deleted == 2) {
				hex.blocks[i].splice(j, 1);
				blockDestroyedForHex(hex);
				if (j < lowestDeletedIndex) lowestDeletedIndex = j;
				j--;
			}
		}

		if (lowestDeletedIndex < hex.blocks[i].length) {
			for (j = lowestDeletedIndex; j < hex.blocks[i].length; j++) {
				hex.blocks[i][j].settled = 0;
			}
		}
	}

	// Move falling settled blocks
	for (i = 0; i < hex.blocks.length; i++) {
		for (j = 0; j < hex.blocks[i].length; j++) {
			block = hex.blocks[i][j];
			hex.doesBlockCollide(block, j, hex.blocks[i]);

			if (!hex.blocks[i][j].settled) {
				hex.blocks[i][j].distFromHex -= block.iter * dt * settings.scale;
			}
		}
	}
}
