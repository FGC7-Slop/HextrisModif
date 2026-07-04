function exportSaveState() {
	// Double mode has circular refs (Block.targetHex → Hex → blocks → Block),
	// skip save state entirely for double mode
	if (window.gameMode === 'double') {
		localStorage.setItem('highscores_double', JSON.stringify(highscores));
		return "{}";
	}

	var state = {};

	if(gameState == 1 || gameState == -1 || (gameState === 0 && localStorage.getItem('saveState') !== undefined)) {
		var hexCopy = {
			sideLength: MainHex.sideLength,
			x: MainHex.x,
			y: MainHex.y,
			sides: MainHex.sides,
			position: MainHex.position,
			playThrough: MainHex.playThrough,
			ct: MainHex.ct,
			lastCombo: MainHex.lastCombo,
			comboMultiplier: MainHex.comboMultiplier,
			blocks: MainHex.blocks.map(function(lane) {
				return lane.map(function(block) {
					return {
						fallingLane: block.fallingLane,
						color: block.color,
						iter: block.iter,
						distFromHex: block.distFromHex / settings.scale,
						settled: block.settled,
						height: block.height,
						angle: block.angle,
						angularVelocity: block.angularVelocity,
						targetAngle: block.targetAngle,
						deleted: block.deleted,
						removed: block.removed,
						tint: block.tint,
						opacity: block.opacity,
						initializing: block.initializing,
						ict: block.ict,
						initLen: block.initLen,
						attachedLane: block.attachedLane,
						checked: block.checked,
						direction: block.direction
					};
				});
			})
		};

		var blocksCopy = blocks.map(function(block) {
			return {
				fallingLane: block.fallingLane,
				color: block.color,
				iter: block.iter,
				distFromHex: block.distFromHex / settings.scale,
				settled: block.settled,
				height: block.height,
				angle: block.angle,
				angularVelocity: block.angularVelocity,
				targetAngle: block.targetAngle,
				deleted: block.deleted,
				removed: block.removed,
				tint: block.tint,
				opacity: block.opacity,
				initializing: block.initializing,
				ict: block.ict,
				initLen: block.initLen,
				attachedLane: block.attachedLane,
				checked: block.checked,
				direction: block.direction
			};
		});

		var waveCopy = {
			lastGen: waveone.lastGen,
			last: waveone.last,
			nextGen: waveone.nextGen,
			start: waveone.start,
			colors: waveone.colors,
			ct: waveone.ct,
			difficulty: waveone.difficulty,
			dt: waveone.dt
		};

		state = {
			hex: hexCopy,
			blocks: blocksCopy,
			score: score,
			wavegen: waveCopy,
			gdx: gdx,
			gdy: gdy,
			comboTime: settings.comboTime,
			gameMode: window.gameMode
		};
	}

	localStorage.setItem('highscores', JSON.stringify(highscores));

	return JSON.stringify(state);
}

function descaleBlock(b) {
	b.distFromHex /= settings.scale;
}

function writeHighScores() {
		highscores.sort(
		function(a,b){
			a = parseInt(a, 10);
			b = parseInt(b, 10);
			if (a < b) {
				return 1;
			} else if (a > b) {
				return -1;
			}else {
				return 0;
			}
		}
	);
	highscores = highscores.slice(0,3);
	var key = window.gameMode === 'double' ? 'highscores_double' : 'highscores';
	localStorage.setItem(key, JSON.stringify(highscores));

	var maxScore = parseInt(highscores[0], 10);
	if (window.player) {
		var data = {};
		data[key] = highscores;
		window.player.setData(data).catch(function(){});
	}
	if (window.ysdk) {
		window.ysdk.getLeaderboards()
			.then(function(lb) {
				var leaderboardName = window.gameMode === 'double' ? 'score_double' : 'score';
				lb.setLeaderboardScore(leaderboardName, maxScore);
			})
			.catch(function(err) {});
	}
}

function clearSaveState() {
	localStorage.setItem("saveState", "{}");
}

function isStateSaved() {
	var stateStr = localStorage.getItem("saveState");
	if (stateStr === "{}" || !stateStr) return false;
	try {
		var state = JSON.parse(stateStr);
		var savedMode = state.gameMode || 'standard';
		return savedMode === window.gameMode;
	} catch(e) {
		return false;
	}
}
