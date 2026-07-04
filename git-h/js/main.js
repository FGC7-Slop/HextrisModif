function reconstructBlock(savedBlock, targetHex) {
	var block = new Block(
		savedBlock.fallingLane,
		savedBlock.color,
		savedBlock.iter,
		savedBlock.distFromHex,
		savedBlock.settled,
		targetHex
	);
	block.height = savedBlock.height;
	block.angle = savedBlock.angle;
	block.angularVelocity = savedBlock.angularVelocity;
	block.targetAngle = savedBlock.targetAngle;
	block.deleted = savedBlock.deleted;
	block.removed = savedBlock.removed;
	block.tint = savedBlock.tint;
	block.opacity = savedBlock.opacity;
	block.initializing = savedBlock.initializing;
	block.ict = savedBlock.ict;
	block.initLen = savedBlock.initLen;
	block.attachedLane = savedBlock.attachedLane;
	block.checked = savedBlock.checked;
	if (savedBlock.direction !== undefined) {
		block.direction = savedBlock.direction;
	}
	return block;
}

function scaleCanvas() {
	canvas.width = $(window).width();
	canvas.height = $(window).height();

	if (canvas.height > canvas.width) {
		settings.scale = (canvas.width / 800) * settings.baseScale;
	} else {
		settings.scale = (canvas.height / 800) * settings.baseScale;
	}

	trueCanvas = {
		width: canvas.width,
		height: canvas.height
	};

	if (window.devicePixelRatio) {
		var cw = $("#canvas").attr('width');
		var ch = $("#canvas").attr('height');

		$("#canvas").attr('width', cw * window.devicePixelRatio);
		$("#canvas").attr('height', ch * window.devicePixelRatio);
		$("#canvas").css('width', cw);
		$("#canvas").css('height', ch);

		trueCanvas = {
			width: cw,
			height: ch
		};

		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}
    setBottomContainer();
    set_score_pos();
}

function setBottomContainer() {
    var bc = $("#buttonCont");
    if (!bc.length || !bc.offset()) return;
    var buttonOffset = bc.offset().top;
    var playOffset = trueCanvas.height / 2 + 100 * settings.scale;
    var delta = buttonOffset - playOffset - 29;
    if (delta < 0) {
        $("#buttonCont").css("margin-bottom", "-" + Math.abs(delta) + "px");
    }
}

function set_score_pos() {
    $("#container").css('margin-top', '0');
    var middle_of_container = ($("#container").height()/2 + $("#container").offset().top);
    var top_of_bottom_container = $("#buttonCont").offset().top
    var igt = $("#highScoreInGameText")
    var igt_bottom = igt.offset().top + igt[0].offsetHeight
    var target_midpoint = (top_of_bottom_container + igt_bottom)/2
    var diff = (target_midpoint-middle_of_container)
    $("#container").css("margin-top",diff + "px");
}

function toggleDevTools() {
	$('#devtools').toggle();
}

function resumeGame() {
	gameState = 1;
	hideUIElements();
	$('#pauseBtn').show();
	$('#restartBtn').hide();
	importing = 0;
	startTime = Date.now();
	setTimeout(function() {
		if ((gameState == 1 || gameState == 2) && !$('#helpScreen').is(':visible')) {
			$('#openSideBar').fadeOut(150, "linear");
		}
	}, 7000);

	checkVisualElements(0);
}

function checkVisualElements(arg) {
	if (arg && $('#openSideBar').is(":visible")) $('#openSideBar').fadeOut(150, "linear");
	if (!$('#pauseBtn').is(':visible')) $('#pauseBtn').fadeIn(150, "linear");
	$('#fork-ribbon').fadeOut(150);
	if (!$('#restartBtn').is(':visible')) $('#restartBtn').fadeOut(150, "linear");
	if ($('#buttonCont').is(':visible')) $('#buttonCont').fadeOut(150, "linear");
}

function hideUIElements() {
	$('#pauseBtn').hide();
	$('#restartBtn').hide();
	$('#startBtn').hide();
	$('#startMenuButtons').hide();
	$('#modeSelector').hide();
}

function init(b) {
	if(settings.ending_block && b == 1){return;}
	if (b) {
		$("#pauseBtn").attr('src',"./images/btn_pause.svg");
		if ($('#helpScreen').is(":visible")) {
			$('#helpScreen').fadeOut(150, "linear");
		}

		setTimeout(function() {
            if (gameState == 1) {
			    $('#openSideBar').fadeOut(150, "linear");
            }
			infobuttonfading = false;
		}, 7000);
		clearSaveState();
		checkVisualElements(1);
	}
	if (highscores.length === 0 ){
		$("#currentHighScore").text(0);
	}
	else {
		$("#currentHighScore").text(highscores[0])
	}
	infobuttonfading = true;
	$("#pauseBtn").attr('src',"./images/btn_pause.svg");
	hideUIElements();
	var saveState = localStorage.getItem("saveState") || "{}";
	try {
		saveState = JSON.parse(saveState);
	} catch (e) {
		console.log("saveState parse error, clearing");
		saveState = {};
		localStorage.setItem("saveState", "{}");
	}
	document.getElementById("canvas").className = "";
	history = {};
	importedHistory = undefined;
	importing = 0;
	score = saveState.score || 0;
	prevScore = 0;
	spawnLane = 0;
	op = 0;
	tweetblock=false;
	scoreOpacity = 0;
	gameState = 1;
	$("#restartBtn").hide();
	$("#pauseBtn").show();
	if (saveState.hex !== undefined) gameState = 1;

	settings.blockHeight = settings.baseBlockHeight * settings.scale;
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	if (saveState.hex) {
		MainHex = new Hex(settings.hexWidth);
		MainHex.sideLength = saveState.hex.sideLength;
		MainHex.x = saveState.hex.x;
		MainHex.y = saveState.hex.y;
		MainHex.sides = saveState.hex.sides;
		MainHex.position = saveState.hex.position;
		MainHex.playThrough = saveState.hex.playThrough + 1;
		MainHex.ct = saveState.hex.ct;
		MainHex.lastCombo = saveState.hex.lastCombo;
		MainHex.comboMultiplier = saveState.hex.comboMultiplier;
		MainHex.blocks = saveState.hex.blocks.map(function(lane) {
			return lane.map(function(savedBlock) {
				return reconstructBlock(savedBlock, MainHex);
			});
		});
	} else {
		MainHex = new Hex(settings.hexWidth);
	}
	MainHex.sideLength = settings.hexWidth;

	if (window.gameMode === 'double') {
		window.LeftHex = new Hex(settings.hexWidth);
		window.RightHex = new Hex(settings.hexWidth);
		window.LeftHex.sideLength = settings.hexWidth;
		window.RightHex.sideLength = settings.hexWidth;
		window.LeftHex.x = trueCanvas.width * 0.28;
		window.RightHex.x = trueCanvas.width * 0.72;
	}

	var i;
	var block;
	if (saveState.blocks) {
		saveState.blocks.map(function(o) {
			if (rgbToHex[o.color]) {
				o.color = rgbToHex[o.color];
			}
		});

		for (i = 0; i < saveState.blocks.length; i++) {
			block = reconstructBlock(saveState.blocks[i], MainHex);
			blocks.push(block);
		}
	} else {
		blocks = [];
	}

	gdx = saveState.gdx || 0;
	gdy = saveState.gdy || 0;
	comboTime = saveState.comboTime || 0;

	if (window.gameMode === 'double') {
		for (i = 0; i < window.LeftHex.blocks.length; i++) {
			for (var j = 0; j < window.LeftHex.blocks[i].length; j++) {
				window.LeftHex.blocks[i][j].height = settings.blockHeight;
				window.LeftHex.blocks[i][j].settled = 0;
			}
		}
		for (i = 0; i < window.RightHex.blocks.length; i++) {
			for (var j = 0; j < window.RightHex.blocks[i].length; j++) {
				window.RightHex.blocks[i][j].height = settings.blockHeight;
				window.RightHex.blocks[i][j].settled = 0;
			}
		}
	}

	if (window.gameMode !== 'double') {
		MainHex.blocks.map(function(i) {
			i.map(function(o) {
				if (rgbToHex[o.color]) {
					o.color = rgbToHex[o.color];
				}
			});
		});
	}

	MainHex.y = -100;

	startTime = Date.now();
	if (window.gameMode === 'double') {
		window.waveone_left = new waveGen(window.LeftHex);
		window.waveone_right = new waveGen(window.RightHex);
		window.waveone_left.lastGen = 0;
		window.waveone_right.lastGen = 1200; // Shift phase to desynchronize spawns
	} else {
		if (saveState.wavegen) {
			waveone = new waveGen(MainHex);
			waveone.lastGen = saveState.wavegen.lastGen;
			waveone.last = saveState.wavegen.last;
			waveone.nextGen = saveState.wavegen.nextGen;
			waveone.start = saveState.wavegen.start;
			waveone.colors = saveState.wavegen.colors;
			waveone.ct = saveState.wavegen.ct;
			waveone.difficulty = saveState.wavegen.difficulty;
			waveone.dt = saveState.wavegen.dt;
		} else {
			waveone = new waveGen(MainHex);
		}
	}

	MainHex.texts = []; //clear texts
	MainHex.delay = 15;
	if (window.gameMode === 'double') {
		window.LeftHex.texts = [];
		window.RightHex.texts = [];
		window.LeftHex.delay = 15;
		window.RightHex.delay = 15;
	}
	hideText();
}

function addNewBlockForHex(blocklane, color, iter, hex, distFromHex, settled) { //last two are optional parameters
	iter *= settings.speedModifier;
	var block = new Block(blocklane, color, iter, distFromHex, settled, hex);
	blocks.push(block);
}

function addNewBlock(blocklane, color, iter, distFromHex, settled) { //last two are optional parameters
	iter *= settings.speedModifier;
	if (!history[MainHex.ct]) {
		history[MainHex.ct] = {};
	}

	history[MainHex.ct].block = {
		blocklane: blocklane,
		color: color,
		iter: iter
	};

	if (distFromHex) {
		history[MainHex.ct].distFromHex = distFromHex;
	}
	if (settled) {
		blockHist[MainHex.ct].settled = settled;
	}

	if (window.gameMode === 'double') {
		// Spawn on LeftHex
		var blockLeft = new Block(blocklane, color, iter, distFromHex, settled, window.LeftHex);
		blocks.push(blockLeft);

		// Spawn on RightHex
		var laneRight = randInt(0, 6);
		var colorRight = colors[randInt(0, colors.length)];
		var blockRight = new Block(laneRight, colorRight, iter, distFromHex, settled, window.RightHex);
		blocks.push(blockRight);
	} else {
		var block = new Block(blocklane, color, iter, distFromHex, settled, MainHex);
		blocks.push(block);
	}
}

function exportHistory() {
	$('#devtoolsText').html(JSON.stringify(history));
	toggleDevTools();
}

function setStartScreen() {
	$('#startBtn').show();
	$('#modeSelector').fadeIn(150);
	$('#startMenuButtons').show();
	init();
	if (isStateSaved()) {
		importing = 0;
	} else {
		importing = 1;
	}

	$('#pauseBtn').hide();
	$('#restartBtn').hide();
	$('#startBtn').show();
	$('#modeSelector').show();
	$('#startMenuButtons').show();

	gameState = 0;
	requestAnimFrame(animLoop);
}

var spd = 1;

function animLoop() {
	switch (gameState) {
	case 1:
		requestAnimFrame(animLoop);
		render();
		var now = Date.now();
		var dt = (now - lastTime)/16.666 * rush;
		if (spd > 1) {
			dt *= spd;
		}

		if(gameState == 1 ){
			if(!MainHex.delay) {
				update(dt);
			}
			else{
				MainHex.delay--;
			}
		}

		lastTime = now;

		if (checkGameOver() && !importing) {
			var saveState = localStorage.getItem("saveState") || "{}";
			saveState = JSON.parse(saveState);
			gameState = 2;

			setTimeout(function() {
				enableRestart();
			}, 150);

			if ($('#helpScreen').is(':visible')) {
				$('#helpScreen').fadeOut(150, "linear");
			}

			if ($('#pauseBtn').is(':visible')) $('#pauseBtn').fadeOut(150, "linear");
			if ($('#restartBtn').is(':visible')) $('#restartBtn').fadeOut(150, "linear");
			if ($('#openSideBar').is(':visible')) $('.openSideBar').fadeOut(150, "linear");

			canRestart = 0;
			clearSaveState();
		}
		break;

	case 0:
		requestAnimFrame(animLoop);
		render();
		break;

	case -1:
		requestAnimFrame(animLoop);
		render();
		break;

	case 2:
		var now = Date.now();
		var dt = (now - lastTime)/16.666 * rush;
		requestAnimFrame(animLoop);
		update(dt);
		render();
		lastTime = now;
		break;

	case 3:
		requestAnimFrame(animLoop);
		fadeOutObjectsOnScreen();
		render();
		break;

	case 4:
		setTimeout(function() {
			initialize(1);
		}, 1);
		render();
		return;

	default:
		initialize();
		setStartScreen();
		break;
	}

	if (!(gameState == 1 || gameState == 2)) {
		lastTime = Date.now();
	}
}

function enableRestart() {
	canRestart = 1;
}

function isInfringing(hex) {
	for (var i = 0; i < hex.sides; i++) {
		var subTotal = 0;
		for (var j = 0; j < hex.blocks[i].length; j++) {
			subTotal += hex.blocks[i][j].deleted;
		}

		if (hex.blocks[i].length - subTotal > settings.rows) {
			return true;
		}
	}
	return false;
}

function checkGameOver() {
	var gameOver = false;
	if (window.gameMode === 'double') {
		gameOver = isInfringing(window.LeftHex) || isInfringing(window.RightHex);
	} else {
		gameOver = isInfringing(window.MainHex);
	}

	if (gameOver) {
		if (highscores.indexOf(score) == -1) {
			highscores.push(score);
		}
		writeHighScores();
		gameOverDisplay();
		return true;
	}
	return false;
}

function showHelp() {
	console.log("showHelp triggered. Current gameState:", gameState);
	if ($('#openSideBar').attr('src') == './images/btn_back.svg') {
		$('#openSideBar').attr('src', './images/btn_help.svg');
		if (gameState != 0 && gameState != -1 && gameState != 2) {
			$('#fork-ribbon').fadeOut(150, 'linear');
		}
	} else {
		$('#openSideBar').attr('src', './images/btn_back.svg');
		if (gameState == 0 && gameState == -1 && gameState == 2) {
			$('#fork-ribbon').fadeIn(150, 'linear');
		}
	}

	var isRu = true;
	try { 
		console.log("ysdk state:", window.ysdk);
		if (window.ysdk) {
			console.log("ysdk environment lang:", window.ysdk.environment.i18n.lang);
		}
		if (window.ysdk && window.ysdk.environment.i18n.lang !== 'ru') {
			isRu = false;
		}
	} catch(e) {
		console.warn("Error checking YSDK lang, defaulting to RU:", e);
	}
	console.log("isRu evaluated to:", isRu);
	var helpText = isRu
		? "<div id='instructions_head'>КАК ИГРАТЬ</div><p>Цель игры — не дать блокам выйти за пределы серого шестиугольника.</p><p>" + (settings.platform != 'mobile' ? 'Используйте стрелки влево и вправо' : 'Касайтесь левой и правой стороны экрана') + " для вращения шестиугольника." + (settings.platform != 'mobile' ? ' Нажмите стрелку вниз для ускорения' : '') + "</p><p>Соединяйте 3 и более блоков одного цвета, чтобы получать очки.</p><p>Время до сброса комбо показано <span style='color:#00FFFF;'>цветными</span> <span style='color:#FF00FF'>линиями</span> на внешнем шестиугольнике</p>"
		: "<div id='instructions_head'>HOW TO PLAY</div><p>The goal of the game is to stop blocks from leaving the inside of the outer gray hexagon.</p><p>" + (settings.platform != 'mobile' ? 'Press the right and left arrow keys' : 'Tap the left and right sides of the screen') + " to rotate the Hexagon." + (settings.platform != 'mobile' ? ' Press the down arrow to speed up the block falling': '') + " </p><p>Clear blocks and get points by making 3 or more blocks of the same color touch.</p><p>Time left before your combo streak disappears is indicated by <span style='color:#00FFFF;'>the</span> <span style='color:#FF00FF'>colored</span> <span style='color:#39FF14'>lines</span> <span style='color:#FFFF00'>on</span> the outer hexagon</p>";
	$("#inst_main_body").html(helpText);
	if (gameState == 1) {
		pause();
	}

	if($("#pauseBtn").attr('src') == "./images/btn_pause.svg" && gameState != 0 && !infobuttonfading) {
		return;
	}

	$("#openSideBar").fadeIn(150,"linear");
	$('#helpScreen').fadeToggle(150, "linear");
}

