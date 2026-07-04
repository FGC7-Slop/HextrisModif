function render() {
	var grey = window.currentThemePolygonColor || '#bdc3c7';
	if (gameState === 0) {
		grey = window.currentThemePolygonColorStart || "rgb(220, 223, 225)";
	}
	
	ctx.clearRect(0, 0, trueCanvas.width, trueCanvas.height);
	clearGameBoard();
	if (gameState === 1 || gameState === 2 || gameState === -1 || gameState === 0) {
		if (op < 1) {
			op += 0.01;
		}
		ctx.globalAlpha = op;
		if (window.gameMode === 'double') {
			drawPolygon(window.LeftHex.x, window.LeftHex.y, 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, grey, false, 6);
			drawPolygon(window.RightHex.x, window.RightHex.y, 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, grey, false, 6);
			if (typeof drawTimerForHex !== 'undefined') {
				drawTimerForHex(window.LeftHex);
				drawTimerForHex(window.RightHex);
			}
		} else {
			drawPolygon(trueCanvas.width / 2 , trueCanvas.height / 2 , 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, grey, false,6);
			if (typeof drawTimerForHex !== 'undefined') {
				drawTimerForHex(window.MainHex);
			} else {
				drawTimer();
			}
		}
		ctx.globalAlpha = 1;
	}

	var i;
	if (window.gameMode === 'double') {
		for (i = 0; i < window.LeftHex.blocks.length; i++) {
			for (var j = 0; j < window.LeftHex.blocks[i].length; j++) {
				var block = window.LeftHex.blocks[i][j];
				block.draw(true, j);
			}
		}
		for (i = 0; i < window.RightHex.blocks.length; i++) {
			for (var j = 0; j < window.RightHex.blocks[i].length; j++) {
				var block = window.RightHex.blocks[i][j];
				block.draw(true, j);
			}
		}
	} else {
		for (i = 0; i < MainHex.blocks.length; i++) {
			for (var j = 0; j < MainHex.blocks[i].length; j++) {
				var block = MainHex.blocks[i][j];
				block.draw(true, j);
			}
		}
	}
	
	for (i = 0; i < blocks.length; i++) {
		blocks[i].draw();
	}

	if (window.gameMode === 'double') {
		window.LeftHex.draw();
		window.RightHex.draw();
	} else {
		MainHex.draw();
	}
	
	if (gameState ==1 || gameState ==-1 || gameState === 0) {
		drawScoreboard();
	}

	if (window.gameMode === 'double') {
		drawTexts(window.LeftHex);
		drawTexts(window.RightHex);
	} else {
		drawTexts(MainHex);
	}

	if ((MainHex.ct < 650 && (gameState !== 0) && !MainHex.playThrough)) {
		if (MainHex.ct > (650 - 50)) {
			ctx.globalAlpha = (50 - (MainHex.ct - (650 - 50)))/50;
		}

		if (MainHex.ct < 50) {
			ctx.globalAlpha = (MainHex.ct)/50;
		}

		renderBeginningText();
		ctx.globalAlpha = 1;
	}

	if (gameState == -1) {
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = 'rgb(236,240,241)';
		ctx.fillRect(0, 0, trueCanvas.width, trueCanvas.height);
		ctx.globalAlpha = 1;
	}

	settings.prevScale = settings.scale;
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	settings.blockHeight = settings.baseBlockHeight * settings.scale;
}

function drawTexts(hex) {
	for (var i = 0; i < hex.texts.length; i++) {
		var alive = hex.texts[i].draw();
		if(!alive){
			hex.texts.splice(i,1);
			i--;
		}
	}
}

function renderBeginningText() {
	var upperheight = (trueCanvas.height/2) - ((settings.rows * settings.blockHeight) * (2/Math.sqrt(3))) * (5/6);
	var lowerheight = (trueCanvas.height/2) + ((settings.rows * settings.blockHeight) * (2/Math.sqrt(3))) * (11/16);
    var text = '';
    var mob, fontSize;
	
	var isRu = true;
	try { if (window.ysdk && window.ysdk.environment.i18n.lang !== 'ru') isRu = false; } catch(e) {}

    if(/mobile|Mobile|iOS|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        mob = true;
        input_text = isRu ? 'Касайтесь экрана слева и справа' : "Tap the screen's left and right";
        action_text = isRu ? 'для вращения шестиугольника' : 'sides to rotate the hexagon';
        score_text = isRu ? 'Соединяйте от 3 блоков' : 'Match 3+ blocks to score';
        fontSize = 35;
    } else {
        mob = false;
        input_text = isRu ? 'Используйте стрелки влево и вправо' : 'Use the right and left arrow keys';
        action_text = isRu ? 'для вращения шестиугольника' : 'to rotate the hexagon';
        score_text = isRu ? 'Соединяйте от 3 блоков!' : 'Match 3+ blocks to score!';
        fontSize = 27;
    }
	renderText((trueCanvas.width)/2 + 2 * settings.scale,upperheight-0*settings.scale, fontSize, '#2c3e50', input_text);
	renderText((trueCanvas.width)/2 + 2 * settings.scale,upperheight+33*settings.scale, fontSize, '#2c3e50', action_text);
    if (!mob) {
	    drawKey("",(trueCanvas.width)/2 + 2 * settings.scale-2.5,upperheight+38*settings.scale);
    }

	renderText((trueCanvas.width)/2 + 2 * settings.scale,lowerheight,fontSize, '#2c3e50', score_text);
}

function drawKey(key, x, y) {
	ctx.save();
	switch (key) {
		case "left":
			ctx.translate(x, y + settings.scale * 13);
			ctx.rotate(3.14159);
			ctx.font = "20px Fontawesome";
			ctx.scale(settings.scale, settings.scale);
			ctx.fillText(String.fromCharCode("0xf04b"), 0, 0);
			break;
		case "right":
			ctx.font = "20px Fontawesome";
			ctx.translate(x , y + settings.scale * 27.5);
			ctx.scale(settings.scale, settings.scale);
			ctx.fillText(String.fromCharCode("0xf04b"), 0, 0);
			break;
		
		default:
			drawKey("left", x - 5, y);
			drawKey("right", x + 5, y);
	}
	ctx.restore();
}
