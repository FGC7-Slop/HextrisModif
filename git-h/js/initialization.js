window.ysdk = null;
window.player = null;

window.langDict = {
    ru: {
        'HIGH SCORE': 'РЕКОРД',
        'GAME OVER': 'ИГРА ОКОНЧЕНА',
        'HIGH SCORES': 'РЕКОРДЫ',
        'REVIVE<br>(WATCH AD)': 'ВОЗРОДИТЬСЯ<br>(РЕКЛАМА)',
        'Game Paused': 'ПАУЗА',
        'Play!': 'ИГРАТЬ!',
        'MENU': 'МЕНЮ',
        'SCORE': 'СЧЁТ',
        'BEST': 'ЛУЧШИЙ',
        'REPLAY': 'ЗАНОВО',
        'STANDARD': 'СТАНДАРТ',
        'DOUBLE': 'ДУБЛЬ',
        'LICENSE': 'ЛИЦЕНЗИЯ',
        'LICENSE_TEXT_1': 'Эта игра основана на open-source проекте Hextris (авторы: Logan Engstrom, Garrett Finucane, Noah Moroze, Michael Yang).',
        'LICENSE_TEXT_2': 'Распространяется на условиях лицензии GNU GPL v3.0.',
        'LICENSE_TEXT_3': 'Исходный код нашей модифицированной версии доступен по ссылке:',
        'THEMES': 'ВЫБОР ТЕМЫ',
        'LEADERBOARD': 'ТАБЛИЦА РЕКОРДОВ',
        'MUSIC_1': 'Пол Юдин',
        'MUSIC_2': 'Алекс Грол - Прыжок',
        'MUSIC_3': 'АудиоКофе - Рок',
        'MUSIC_4': 'Настроение'
    },
    en: {
        'HIGH SCORE': 'HIGH SCORE',
        'GAME OVER': 'GAME OVER',
        'HIGH SCORES': 'HIGH SCORES',
        'REVIVE<br>(WATCH AD)': 'REVIVE<br>(WATCH AD)',
        'Game Paused': 'PAUSED',
        'Play!': 'Play!',
        'MENU': 'MENU',
        'SCORE': 'SCORE',
        'BEST': 'BEST',
        'REPLAY': 'REPLAY',
        'STANDARD': 'STANDARD',
        'DOUBLE': 'DOUBLE',
        'LICENSE': 'LICENSE',
        'LICENSE_TEXT_1': 'This game is based on the open-source project Hextris (authors: Logan Engstrom, Garrett Finucane, Noah Moroze, Michael Yang).',
        'LICENSE_TEXT_2': 'Distributed under the GNU GPL v3.0 license.',
        'LICENSE_TEXT_3': 'The source code of our modified version is available at:',
        'THEMES': 'THEMES',
        'LEADERBOARD': 'LEADERBOARD',
        'MUSIC_1': 'Paul Yudin',
        'MUSIC_2': 'Alex Grohl - Bounce',
        'MUSIC_3': 'AudioCoffee - Rock',
        'MUSIC_4': 'Moodmode'
    }
};

window.i18n = function(key) {
    var lang = 'ru';
    try { if (window.ysdk && window.ysdk.environment.i18n.lang !== 'ru') lang = 'en'; } catch(e) {}
    return window.langDict[lang][key] || key;
};

function localizeUI() {
    $('#highScoreInGameTextHeader').html(window.i18n('BEST'));
    $('#gameOverBox').html(window.i18n('GAME OVER'));
    $('#highScoresTitle').html(window.i18n('HIGH SCORES'));
    $('#reviveBtnText').html(window.i18n('REVIVE<br>(WATCH AD)'));
    $('#menuBtnText').html(window.i18n('MENU'));
    $('#restartBtnText').html(window.i18n('REPLAY'));
    $('#modeStandardText').html(window.i18n('STANDARD'));
    $('#modeDoubleText').html(window.i18n('DOUBLE'));
    $('#licenseTitle').html(window.i18n('LICENSE'));
    $('#licenseText1').html(window.i18n('LICENSE_TEXT_1'));
    $('#licenseText2').html(window.i18n('LICENSE_TEXT_2'));
    $('#licenseText3').html(window.i18n('LICENSE_TEXT_3'));
    $('#themesTitle').html(window.i18n('THEMES'));
    $('#leaderboardTitle').html(window.i18n('LEADERBOARD'));
    $('#leadTabStandardText').html(window.i18n('STANDARD'));
    $('#leadTabDoubleText').html(window.i18n('DOUBLE'));
    $('#music_track_1').html(window.i18n('MUSIC_1'));
    $('#music_track_2').html(window.i18n('MUSIC_2'));
    $('#music_track_3').html(window.i18n('MUSIC_3'));
    $('#music_track_4').html(window.i18n('MUSIC_4'));
    
    // Update currently selected track name based on what's active
    var activeTrackText = $('.music-option.active').text();
    $('#musicTrackName').text(activeTrackText);
}

window.initialized = false;
function safeInitialize() {
	if (!window.initialized) {
		window.initialized = true;
		initialize();
	}
}

$(document).ready(function() {
	var initTimeout = setTimeout(function() {
		if (!window.ysdk) {
			console.log("YaGames init timeout, initializing locally");
			localizeUI();
			safeInitialize();
		}
	}, 1500);

	if (typeof YaGames !== 'undefined') {
		YaGames.init().then(ysdk => {
			clearTimeout(initTimeout);
			window.ysdk = ysdk;
			localizeUI();
			ysdk.features.LoadingAPI?.ready();
			ysdk.getPlayer({ scopes: false }).then(_player => {
				window.player = _player;
				return _player.getData(['highscores', 'highscores_double']);
			}).then(data => {
				if (data) {
					if (data.highscores) {
						var localHighs = [];
						try { localHighs = JSON.parse(localStorage.getItem('highscores')) || []; } catch(e){}
						var merged = localHighs.concat(data.highscores).map(Number).sort((a,b)=>b-a);
						var top3 = [...new Set(merged)].slice(0,3);
						localStorage.setItem('highscores', JSON.stringify(top3));
					}
					if (data.highscores_double) {
						var localHighsDouble = [];
						try { localHighsDouble = JSON.parse(localStorage.getItem('highscores_double')) || []; } catch(e){}
						var mergedDouble = localHighsDouble.concat(data.highscores_double).map(Number).sort((a,b)=>b-a);
						var top3Double = [...new Set(mergedDouble)].slice(0,3);
						localStorage.setItem('highscores_double', JSON.stringify(top3Double));
					}
				}
				safeInitialize();
			}).catch(err => {
				safeInitialize();
			});
		}).catch(err => {
			localizeUI();
			safeInitialize();
		});
	} else {
		localizeUI();
		safeInitialize();
	}
});
function initialize(a) {
	window.rush = 1;
	window.lastTime = Date.now();
	window.iframHasLoaded = false;
	window.colors = ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"];
	window.hexColorsToTintedColors = {
		"#e74c3c": "rgb(241,163,155)",
		"#f1c40f": "rgb(246,223,133)",
		"#3498db": "rgb(151,201,235)",
		"#2ecc71": "rgb(150,227,183)"
	};

	window.rgbToHex = {
		"rgb(231,76,60)": "#e74c3c",
		"rgb(241,196,15)": "#f1c40f",
		"rgb(52,152,219)": "#3498db",
		"rgb(46,204,113)": "#2ecc71"
	};

	window.rgbColorsToTintedColors = {
		"rgb(231,76,60)": "rgb(241,163,155)",
		"rgb(241,196,15)": "rgb(246,223,133)",
		"rgb(52,152,219)": "rgb(151,201,235)",
		"rgb(46,204,113)": "rgb(150,227,183)"
	};

	window.hexagonBackgroundColor = 'rgb(236, 240, 241)';
	window.hexagonBackgroundColorClear = 'rgba(236, 240, 241, 0.5)';
	window.centerBlue = 'rgb(44,62,80)';
	window.angularVelocityConst = 4;
	window.scoreOpacity = 0;
	window.textOpacity = 0;
	window.prevGameState = undefined;
	window.op = 0;
	window.saveState = localStorage.getItem("saveState") || "{}";
	if (saveState !== "{}") {
		op = 1;
	}

	window.textShown = false;
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
			window.setTimeout(callback, 1000 / framerate);
		};
	})();
	$('#clickToExit').bind('click', toggleDevTools);
	window.settings;
	if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('.rrssb-email').remove();
		settings = {
			os: "other",
			platform: "mobile",
			startDist: 227,
			creationDt: 60,
			baseScale: 1.4,
			scale: 1,
			prevScale: 1,
			baseHexWidth: 87,
			hexWidth: 87,
			baseBlockHeight: 20,
			blockHeight: 20,
			rows: 7,
			speedModifier: 0.73,
			speedUpKeyHeld: false,
			creationSpeedModifier: 0.73,
			comboTime: 310
		};
	} else {
		settings = {
			os: "other",
			platform: "nonmobile",
			baseScale: 1,
			startDist: 340,
			creationDt: 9,
			scale: 1,
			prevScale: 1,
			hexWidth: 65,
			baseHexWidth: 87,
			baseBlockHeight: 20,
			blockHeight: 15,
			rows: 8,
			speedModifier: 0.65,
			speedUpKeyHeld: false,
			creationSpeedModifier: 0.65,
			comboTime: 310
		};

	}
	if(/Android/i.test(navigator.userAgent)) {
		settings.os = "android";
	}

	if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)){
		settings.os="ios";
	}

	window.canvas = document.getElementById('canvas');
	window.ctx = canvas.getContext('2d');
	window.trueCanvas = {
		width: canvas.width,
		height: canvas.height
	};
	scaleCanvas();

	window.framerate = 60;
	window.history = {};
	window.score = 0;
	window.scoreAdditionCoeff = 1;
	window.prevScore = 0;
	window.numHighScores = 3;

	window.gameMode = localStorage.getItem('hextris_mode') || 'standard';
	window.loadHighScores = function() {
		var key = window.gameMode === 'double' ? 'highscores_double' : 'highscores';
		highscores = [];
		if (localStorage.getItem(key)) {
			try {
				highscores = JSON.parse(localStorage.getItem(key));
			} catch (e) {
				highscores = [];
			}
		}
		while (highscores.length < 3) {
			highscores.push(0);
		}
	};
	window.loadHighScores();
	window.blocks = [];
	window.MainHex;
	window.gdx = 0;
	window.gdy = 0;
	window.devMode = 0;
	window.lastGen = undefined;
	window.prevTimeScored = undefined;
	window.nextGen = undefined;
	window.spawnLane = 0;
	window.importing = 0;
	window.importedHistory = undefined;
	window.startTime = undefined;
	window.setGameMode = function(mode) {
		if (window.gameMode !== mode) {
			clearSaveState();
			window.importing = 1;
			window.gameMode = mode;
			try {
				if (typeof scaleCanvas !== 'undefined') scaleCanvas();
				if (typeof setStartScreen !== 'undefined') {
					setStartScreen();
				}
			} catch (e) {}
		}
		localStorage.setItem('hextris_mode', mode);
		$('.mode-btn').removeClass('active');
		if (mode === 'standard') {
			$('#modeStandard').addClass('active');
		} else {
			$('#modeDouble').addClass('active');
		}
		window.loadHighScores();
		if (window.highscores && window.highscores.length > 0) {
			$("#currentHighScore").text(window.highscores[0]);
		} else {
			$("#currentHighScore").text(0);
		}
	};

	$('#modeStandard').on('mousedown touchstart', function(e) {
		e.preventDefault();
		e.stopPropagation();
		window.setGameMode('standard');
	});
	$('#modeDouble').on('mousedown touchstart', function(e) {
		e.preventDefault();
		e.stopPropagation();
		window.setGameMode('double');
	});

	if (window.gameMode === 'double') {
		$('#modeDouble').addClass('active');
		$('#modeStandard').removeClass('active');
	} else {
		$('#modeStandard').addClass('active');
		$('#modeDouble').removeClass('active');
	}

	window.gameState;
	setStartScreen();
	if (a != 1) {
		window.canRestart = 1;
		window.onblur = function(e) {
			if (gameState == 1) {
				pause();
			}
		};
		$('#startBtn').off();
		if (settings.platform == 'mobile') {
			$('#startBtn').on('touchstart', startBtnHandler);
		} else {
			$('#startBtn').on('mousedown', startBtnHandler);
		}

		document.addEventListener('touchmove', function(e) {
			e.preventDefault();
		}, false);
		$(window).resize(scaleCanvas);
		$(window).unload(function() {

			if (gameState == 1 || gameState == -1 || gameState === 0) localStorage.setItem("saveState", exportSaveState());
			else localStorage.setItem("saveState", "{}");
		});

		addKeyListeners();

		document.addEventListener("pause", handlePause, false);
		document.addEventListener("backbutton", handlePause, false);
		document.addEventListener("menubutton", handlePause, false); //menu button on android

		setTimeout(function() {
			if (settings.platform == "mobile") {
				try {
					document.body.removeEventListener('touchstart', handleTapBefore, false);
				} catch (e) {

				}

				try {
					document.body.removeEventListener('touchstart', handleTap, false);
				} catch (e) {

				}

				document.body.addEventListener('touchstart', handleTapBefore, false);
			} else {
				try {
					document.body.removeEventListener('mousedown', handleClickBefore, false);
				} catch (e) {

				}

				try {
					document.body.removeEventListener('mousedown', handleClick, false);
				} catch (e) {

				}

				document.body.addEventListener('mousedown', handleClickBefore, false);
			}
		}, 1);
		window.applyTheme(window.currentTheme);
	}
	// Re-apply theme unconditionally after initialize resets hardcoded defaults
	window.applyTheme(window.currentTheme);
}

function startBtnHandler() {
	setTimeout(function() {
		if (settings.platform == "mobile") {
			try {
				document.body.removeEventListener('touchstart', handleTapBefore, false);
			} catch (e) {

			}

			try {
				document.body.removeEventListener('touchstart', handleTap, false);
			} catch (e) {

			}

			document.body.addEventListener('touchstart', handleTap, false);
		} else {
			try {
				document.body.removeEventListener('mousedown', handleClickBefore, false);
			} catch (e) {

			}

			try {
				document.body.removeEventListener('mousedown', handleClick, false);
			} catch (e) {

			}

			document.body.addEventListener('mousedown', handleClick, false);
		}
	}, 5);

	if (!canRestart) return false;

	if ($('#openSideBar').is(':visible')) {
		$('#openSideBar').fadeOut(150, "linear");
	}
	if ($('#modeSelector').is(':visible')) {
		$('#modeSelector').fadeOut(150, "linear");
	}
	if ($('#startMenuButtons').is(':visible')) {
		$('#startMenuButtons').fadeOut(150, "linear");
		$('#licenseBtn').fadeOut(150, "linear");
	}

	if (importing == 1) {
		init(1);
		checkVisualElements(0);
	} else {
		resumeGame();
	}
}

function handlePause() {
	if (gameState == 1 || gameState == 2) {
		pause();
	}
}

function handleTap(e) {
	handleClickTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
}

function handleClick(e) {
	handleClickTap(e.clientX, e.clientY);
}

function handleTapBefore(e) {
	var x = e.changedTouches[0].clientX;
	var y = e.changedTouches[0].clientY;

	if (x < 120 && y < 83 && $('.helpText').is(':visible')) {
		showHelp();
		return;
	}
}

function handleClickBefore(e) {
	var x = e.clientX;
	var y = e.clientY;

	if (x < 120 && y < 83 && $('.helpText').is(':visible')) {
		showHelp();
		return;
	}
}

// === THEMES & LEADERBOARD SYSTEM ===
window.themes = [
	{
		id: 'classic',
		name: 'Классика',
		background: '#ecf0f1',
		hexFill: [44, 62, 80],
		colors: ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"],
		hexColorsToTintedColors: {
			"#e74c3c":"rgb(241,163,155)",
			"#f1c40f":"rgb(246,223,133)",
			"#3498db":"rgb(151,201,235)",
			"#2ecc71":"rgb(150,227,183)"
		},
		rgbToHex: {
			"rgb(231,76,60)":"#e74c3c",
			"rgb(241,196,15)":"#f1c40f",
			"rgb(52,152,219)":"#3498db",
			"rgb(46,204,113)":"#2ecc71"
		},
		textColor: '#2c3e50',
		polygonColor: '#bdc3c7',
		polygonColorStart: 'rgb(220, 223, 225)'
	},
	{
		id: 'dark',
		name: 'Темная Ночь',
		background: '#1e1e24',
		hexFill: [52, 73, 94],
		colors: ["#ff4757", "#ffa502", "#1e90ff", "#2ed573"],
		hexColorsToTintedColors: {
			"#ff4757":"rgb(255,150,160)",
			"#ffa502":"rgb(255,200,100)",
			"#1e90ff":"rgb(130,200,255)",
			"#2ed573":"rgb(150,235,180)"
		},
		rgbToHex: {
			"rgb(255,71,87)":"#ff4757",
			"rgb(255,165,2)":"#ffa502",
			"rgb(30,144,255)":"#1e90ff",
			"rgb(46,213,115)":"#2ed573"
		},
		textColor: '#f1f2f6',
		polygonColor: '#0f0f12',
		polygonColorStart: '#15151b',
		unlockType: 'standard',
		unlockScore: 100
	},
	{
		id: 'ocean',
		name: 'Океан',
		background: '#f0f8ff',
		hexFill: [13, 71, 161],
		colors: ["#00b894", "#0984e3", "#6c5ce7", "#00cec9"],
		hexColorsToTintedColors: {
			"#00b894":"rgb(120,230,200)",
			"#0984e3":"rgb(130,190,240)",
			"#6c5ce7":"rgb(180,170,245)",
			"#00cec9":"rgb(120,235,230)"
		},
		rgbToHex: {
			"rgb(0,184,148)":"#00b894",
			"rgb(9,132,227)":"#0984e3",
			"rgb(108,92,231)":"#6c5ce7",
			"rgb(0,206,201)":"#00cec9"
		},
		textColor: '#0d47a1',
		polygonColor: '#bbdefb',
		polygonColorStart: '#e1f5fe',
		unlockType: 'double',
		unlockScore: 50
	},
	{
		id: 'cyberpunk',
		name: 'Киберпанк',
		background: '#0f0f1b',
		hexFill: [45, 45, 60],
		colors: ["#f9ca24", "#f0932b", "#eb4d4b", "#6ab04c"],
		hexColorsToTintedColors: {
			"#f9ca24":"rgb(250,220,120)",
			"#f0932b":"rgb(245,180,120)",
			"#eb4d4b":"rgb(240,140,130)",
			"#6ab04c":"rgb(160,210,130)"
		},
		rgbToHex: {
			"rgb(249,202,36)":"#f9ca24",
			"rgb(240,147,43)":"#f0932b",
			"rgb(235,77,75)":"#eb4d4b",
			"rgb(106,176,76)":"#6ab04c"
		},
		textColor: '#ffffff',
		polygonColor: '#1c1c2b',
		polygonColorStart: '#131322',
		unlockType: 'standard',
		unlockScore: 500
	},
	{
		id: 'coffee',
		name: 'Кофе',
		background: '#efebe9',
		hexFill: [62, 39, 35],
		colors: ["#8d6e63", "#d4e157", "#ffca28", "#ff7043"],
		hexColorsToTintedColors: {
			"#8d6e63":"rgb(190,170,160)",
			"#d4e157":"rgb(225,235,160)",
			"#ffca28":"rgb(255,225,130)",
			"#ff7043":"rgb(255,160,130)"
		},
		rgbToHex: {
			"rgb(141,110,99)":"#8d6e63",
			"rgb(212,225,87)":"#d4e157",
			"rgb(255,202,40)":"#ffca28",
			"rgb(255,112,67)":"#ff7043"
		},
		textColor: '#3e2723',
		polygonColor: '#d7ccc8',
		polygonColorStart: '#ede5e0',
		unlockType: 'double',
		unlockScore: 200
	}
];

var savedTheme = 'classic';
try { savedTheme = localStorage.getItem('selected_theme') || 'classic'; } catch(e){}
window.currentTheme = savedTheme;

window.isThemeUnlocked = function(theme) {
	if (!theme.unlockType) return true;
	
	if (theme.unlockType === 'standard') {
		var localHighs = [];
		try { localHighs = JSON.parse(localStorage.getItem('highscores')) || []; } catch(e){}
		var maxScore = localHighs[0] || 0;
		return maxScore >= theme.unlockScore;
	} else if (theme.unlockType === 'double') {
		var localHighsDouble = [];
		try { localHighsDouble = JSON.parse(localStorage.getItem('highscores_double')) || []; } catch(e){}
		var maxScoreDouble = localHighsDouble[0] || 0;
		return maxScoreDouble >= theme.unlockScore;
	}
	return false;
};

window.applyTheme = function(themeId) {
	var theme = window.themes.find(function(t) { return t.id === themeId; });
	if (!theme || !window.isThemeUnlocked(theme)) return;
	
	window.currentTheme = themeId;
	try { localStorage.setItem('selected_theme', themeId); } catch(e){}
	
	window.currentThemePolygonColor = theme.polygonColor;
	window.currentThemePolygonColorStart = theme.polygonColorStart;
	
	// Apply styles
	document.body.style.backgroundColor = theme.background;
	var canvasEl = document.getElementById('canvas');
	if (canvasEl) {
		canvasEl.style.backgroundColor = theme.background;
	}
	window.colors = theme.colors;
	window.hexColorsToTintedColors = theme.hexColorsToTintedColors;
	window.rgbToHex = theme.rgbToHex;
	
	if (window.MainHex) {
		window.MainHex.fillColor = theme.hexFill;
		window.MainHex.tempColor = theme.hexFill;
	}
	if (window.LeftHex) {
		window.LeftHex.fillColor = theme.hexFill;
		window.LeftHex.tempColor = theme.hexFill;
	}
	if (window.RightHex) {
		window.RightHex.fillColor = theme.hexFill;
		window.RightHex.tempColor = theme.hexFill;
	}
	
	window.themeTextColor = theme.textColor;
	
	function hexToRgba(hex, alpha) {
		var r = parseInt(hex.slice(1, 3), 16),
			g = parseInt(hex.slice(3, 5), 16),
			b = parseInt(hex.slice(5, 7), 16);
		return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
	}
	
	window.hexagonBackgroundColor = theme.background;
	window.hexagonBackgroundColorClear = hexToRgba(theme.background, 0.5);
	
	// Inject dynamic styles
	var styleId = 'dynamic-theme-styles';
	$('#' + styleId).remove();
	
	var rgbaBg = hexToRgba(theme.background, 0.96);
	$('#gameoverscreen, .overlay, #themesModal, .modal').css('background-color', rgbaBg);
	
	var css = `
		body, #canvas, .modal-content { background-color: ${theme.background} !important; }
		.material-icons, .menu-icon-btn, .menu-icon-btn .material-icons, #highScoreInGameTextHeader, #currentHighScore, 
		#openSideBar, #pauseBtn, #restartBtn, #menuBtnPause, 
		#container, .modal-content, .theme-name, .rank, .score-val, 
		.val, #highScoresTitle, #gameOverBox, #cScore, 
		.modal-header h2, .close-modal, .action-row .btn-flat, .btn-revive,
		#musicWidget, #musicDropdown, .music-option, .vis-dot {
			color: ${theme.textColor} !important;
		}
		.modal-content, .theme-card, .modal-header, .btn-flat, #musicWidget, #musicDropdown { border-color: ${theme.textColor} !important; }
		.theme-card { background-color: transparent !important; color: ${theme.textColor} !important; }
		.theme-card.active { background-color: ${theme.textColor} !important; color: ${theme.background} !important; }
		.theme-card.active .theme-name { color: ${theme.background} !important; }
		#modeSelector .mode-btn { color: ${theme.textColor} !important; border-color: ${theme.textColor} !important; background-color: transparent !important; }
		#modeSelector .mode-btn.active { background-color: ${theme.textColor} !important; color: ${theme.background} !important; }
		#musicPlayBtn { background-color: ${hexToRgba(theme.textColor, 0.15)} !important; }
		.music-option.active { background-color: ${hexToRgba(theme.textColor, 0.2)} !important; }
	`;
	
	$('<style id="' + styleId + '">')
		.prop('type', 'text/css')
		.html(css)
		.appendTo('head');

	// Apply inline style with !important as a failsafe for all platforms and icon inheritance issues
	function forceColor(selector, color) {
		$(selector).each(function() {
			this.style.setProperty('color', color, 'important');
			$(this).find('*').each(function() {
				this.style.setProperty('color', color, 'important');
			});
		});
	}
	forceColor('#themeBtn, #leaderboardBtn, #licenseBtn, #openSideBar, #pauseBtn, #restartBtn, #menuBtnPause, #musicWidget, #musicDropdown, .music-option, .vis-dot', theme.textColor);
	forceColor('#highScoreInGameTextHeader, #currentHighScore', theme.textColor);
};

// UI handlers for Themes and Leaderboard Modals
$(document).ready(function() {
	// Apply initial theme
	window.applyTheme(window.currentTheme);
	
	// Themes Button Clicked
	$('#themeBtn').on('mousedown touchstart', function(e) {
		e.preventDefault();
		e.stopPropagation();
		renderThemesGrid();
		$('#themesModal').addClass('show');
	});

	// License Button Clicked
	$('#licenseBtn').on('mousedown touchstart', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#licenseModal').addClass('show');
	});

	// Close License Modal
	$('#closeLicense').on('mousedown touchstart', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#licenseModal').removeClass('show');
	});

	
	$('#closeThemes, #themesModal').on('mousedown touchstart', function(e) {
		if (e.target === this) {
			e.preventDefault();
			e.stopPropagation();
			$('#themesModal').removeClass('show');
		}
	});
	
	// Leaderboard Button Clicked
	$('#leaderboardBtn').on('mousedown touchstart', function(e) {
		e.preventDefault();
		e.stopPropagation();
		renderLeaderboard('standard');
		$('#leaderboardModal').addClass('show');
	});
	
	$('#closeLeaderboard, #leaderboardModal').on('mousedown touchstart', function(e) {
		if (e.target === this) {
			e.preventDefault();
			e.stopPropagation();
			$('#leaderboardModal').removeClass('show');
		}
	});
	
	// Tabs for Leaderboard
	$('#leadTabStandard').on('mousedown touchstart', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('.lead-tab').removeClass('active');
		$(this).addClass('active');
		renderLeaderboard('standard');
	});
	
	$('#leadTabDouble').on('mousedown touchstart', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('.lead-tab').removeClass('active');
		$(this).addClass('active');
		renderLeaderboard('double');
	});
	
	function renderThemesGrid() {
		var grid = $('#themesGrid');
		grid.empty();
		
		window.themes.forEach(function(theme) {
			var unlocked = window.isThemeUnlocked(theme);
			var isActive = theme.id === window.currentTheme;
			
			var card = $('<div class="theme-card"></div>');
			if (isActive) card.addClass('active');
			if (!unlocked) card.addClass('locked');
			
			card.append('<div class="theme-name">' + theme.name + '</div>');
			
			if (unlocked) {
				var preview = $('<div class="theme-preview"></div>');
				theme.colors.forEach(function(color) {
					preview.append('<div class="color-dot" style="background-color: ' + color + '"></div>');
				});
				card.append(preview);
				
				card.on('mousedown touchstart', function(e) {
					e.preventDefault();
					e.stopPropagation();
					window.applyTheme(theme.id);
					renderThemesGrid();
					$('#themesModal').removeClass('show');
				});
			} else {
				card.append('<div class="lock-icon"><i class="fa fa-lock"></i></div>');
				var reqText = theme.unlockType === 'standard' ? 'Стандарт' : 'Дубль';
				card.append('<div class="unlock-req">Нужен рекорд ' + theme.unlockScore + ' в ' + reqText + '</div>');
			}
			
			grid.append(card);
		});
	}
	
	function renderLeaderboard(type) {
		var list = $('#leadList');
		list.empty();
		
		var scores = [];
		var key = type === 'double' ? 'highscores_double' : 'highscores';
		try {
			scores = JSON.parse(localStorage.getItem(key)) || [];
		} catch(e) {}
		
		while (scores.length < 3) {
			scores.push(0);
		}
		
		scores.forEach(function(score, idx) {
			var row = $('<div class="lead-row"></div>');
			row.append('<span class="rank">' + (idx + 1) + '.</span>');
			row.append('<span class="score-val">' + score + '</span>');
			list.append(row);
		});
	}

	// === MUSIC SYSTEM ===
	var musicAudio = new Audio();
	musicAudio.loop = true;
	var isMusicPlaying = false;
	var audioCtx = null;
	var analyser = null;
	var dataArray = null;
	var source = null;
	
	// Load default track
	var defaultTrack = "paulyudin-no-copyright-music-482400.mp3";
	musicAudio.src = 'music/' + defaultTrack;

	function initMusic() {
		if (audioCtx) return;
		try {
			audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			analyser = audioCtx.createAnalyser();
			analyser.fftSize = 32;
			source = audioCtx.createMediaElementSource(musicAudio);
			source.connect(analyser);
			analyser.connect(audioCtx.destination);
			
			var bufferLength = analyser.frequencyBinCount;
			dataArray = new Uint8Array(bufferLength);
		} catch (e) {
			console.log("Web Audio API not supported", e);
		}
	}

	function updateVisualizer() {
		if (!analyser || !isMusicPlaying) {
			$('.vis-dot').css({
				'transform': 'scaleY(1)',
				'opacity': '0.4'
			});
			return;
		}
		
		analyser.getByteFrequencyData(dataArray);
		
		var dots = $('.vis-dot');
		for (var i = 0; i < dots.length; i++) {
			var val = dataArray[i * 2] || 0;
			var scale = 1 + (val / 255) * 3;
			var opacity = 0.4 + (val / 255) * 0.6;
			$(dots[i]).css({
				'transform': 'scaleY(' + scale + ')',
				'opacity': opacity
			});
		}
		
		if (isMusicPlaying) {
			requestAnimationFrame(updateVisualizer);
		}
	}

	function toggleMusic() {
		initMusic();
		if (audioCtx && audioCtx.state === 'suspended') {
			audioCtx.resume();
		}
		
		if (isMusicPlaying) {
			musicAudio.pause();
			isMusicPlaying = false;
			localStorage.setItem('hextris_music_disabled', 'true');
			$('#musicPlayIcon').text('music_off');
			$('.vis-dot').css({
				'transform': 'scaleY(1)',
				'opacity': '0.4'
			});
		} else {
			localStorage.setItem('hextris_music_disabled', 'false');
			musicAudio.play().then(function() {
				isMusicPlaying = true;
				$('#musicPlayIcon').text('music_note');
				requestAnimationFrame(updateVisualizer);
			}).catch(function(err) {
				console.log("Playback failed", err);
			});
		}
	}

	function selectTrack(trackPath, trackName) {
		initMusic();
		if (audioCtx && audioCtx.state === 'suspended') {
			audioCtx.resume();
		}
		
		var wasPlaying = isMusicPlaying;
		musicAudio.src = 'music/' + trackPath;
		$('#musicTrackName').text(trackName);
		
		if (wasPlaying || !window.firstPlayAttempted) {
			window.firstPlayAttempted = true;
			musicAudio.play().then(function() {
				isMusicPlaying = true;
				$('#musicPlayIcon').text('music_note');
				requestAnimationFrame(updateVisualizer);
			}).catch(function(err) {
				console.log("Playback failed", err);
			});
		}
	}

	// UI Bindings
	$('#musicPlayBtn').on('mousedown touchstart', function(e) {
		e.preventDefault();
		e.stopPropagation();
		toggleMusic();
	});

	$('#musicWidget').on('mousedown touchstart', function(e) {
		// Only toggle dropdown if not clicking the play button directly
		if ($(e.target).closest('#musicPlayBtn').length === 0) {
			e.preventDefault();
			e.stopPropagation();
			$('#musicDropdown').toggleClass('show');
		}
	});

	$('.music-option').on('mousedown touchstart', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		var trackPath = $(this).attr('data-track');
		var trackName = $(this).text();
		
		$('.music-option').removeClass('active');
		$(this).addClass('active');
		
		selectTrack(trackPath, trackName);
		$('#musicDropdown').removeClass('show');
	});

	$(document).on('mousedown touchstart', function(e) {
		if ($(e.target).closest('#musicContainer').length === 0) {
			$('#musicDropdown').removeClass('show');
		}
	});

	// Hide music panel on opening modals
	$(document).on('mousedown touchstart', '#themeBtn, #leaderboardBtn, #licenseBtn', function() {
		$('#musicContainer').fadeOut(150);
	});
	$(document).on('mousedown touchstart', '#closeThemes, #themesModal, #closeLeaderboard, #leaderboardModal, #closeLicense, #licenseModal', function(e) {
		if (e.target === this || $(e.target).hasClass('close-modal')) {
			$('#musicContainer').fadeIn(150);
		}
	});

	// Autoplay music on first interaction if not disabled
	var firstInteraction = false;
	$(document).on('mousedown touchstart keydown', function(e) {
		if (firstInteraction) return;
		firstInteraction = true;
		if (localStorage.getItem('hextris_music_disabled') !== 'true' && !isMusicPlaying) {
			if ($(e.target).closest('#musicPlayBtn').length === 0) {
				toggleMusic();
			}
		}
	});
});
