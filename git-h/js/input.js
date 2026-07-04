function addKeyListeners() {
	keypress.register_combo({
		keys: "left",
		on_keydown: function() {
			if (MainHex && gameState !== 0) {
				MainHex.rotate(1);
			}
		}
	});

	keypress.register_combo({
		keys: "right",
		on_keydown: function() {
			if (MainHex && gameState !== 0){
				MainHex.rotate(-1);
			}
		}
	});
		keypress.register_combo({
		keys: "down",
		on_keydown: function() {
			var tempSpeed = settings.speedModifier;
			if (MainHex && gameState !== 0){
				//speed up block temporarily
				if(settings.speedUpKeyHeld == false){
					settings.speedUpKeyHeld = true;
					window.rush *=4;
				}
			}
			//settings.speedModifier = tempSpeed;
		},
		on_keyup:function(){
			if (MainHex && gameState !== 0){
				//speed up block temporarily
				
				window.rush /=4;
				settings.speedUpKeyHeld = false;
			}
		}	
	});
	
	keypress.register_combo({
		keys: "a",
		on_keydown: function() {
			if (MainHex && gameState !== 0) {
				MainHex.rotate(1);
			}
		}
	});

	keypress.register_combo({
		keys: "d",
		on_keydown: function() {
			if (MainHex && gameState !== 0){
				MainHex.rotate(-1);
			}
		}
	});
	
	keypress.register_combo({
		keys: "s",
		on_keydown: function() {
			var tempSpeed = settings.speedModifier;
			if (MainHex && gameState !== 0){
				//speed up block temporarily
				if(settings.speedUpKeyHeld == false){
					settings.speedUpKeyHeld = true;
					window.rush *=4;
				}
			}
			//settings.speedModifier = tempSpeed;
		},
		on_keyup:function(){
			if (MainHex && gameState !== 0){
				//speed up block temporarily
				
				window.rush /=4;
				settings.speedUpKeyHeld = false;
			}
		}	
	});
	keypress.register_combo({
		keys: "p",
		on_keydown: function(){pause();}
	});

	keypress.register_combo({
		keys: "space",
		on_keydown: function(){pause();}
	});

	keypress.register_combo({
		keys: "q",
		on_keydown: function() {
			if (devMode) toggleDevTools();
		}
	});

	keypress.register_combo({
		keys: "enter",
		on_keydown: function() {
			if (gameState==1 || importing == 1) {
				init(1);
			}
			if (gameState == 2) {
				init();
				$("#gameoverscreen").fadeOut();
			}
			if (gameState===0) {
				resumeGame();
			}
		}
	});

	$("#pauseBtn").on('touchstart mousedown', function() {
		if (gameState != 1 && gameState != -1) {
			return;
		}

		if ($('#helpScreen').is(":visible")) {
			$('#helpScreen').fadeOut(150, "linear");
		}
		pause();
		return false;
	});

	$("#colorBlindBtn").on('touchstart mousedown', function() {
	window.colors = ["#8e44ad", "#f1c40f", "#3498db", "#d35400"];

	window.hexColorsToTintedColors = {
		"#8e44ad": "rgb(229,152,102)",
		"#f1c40f": "rgb(246,223,133)",
		"#3498db": "rgb(151,201,235)",
		"#d35400": "rgb(210,180,222)"
	};

	window.rgbToHex = {
		"rgb(142,68,173)": "#8e44ad",
		"rgb(241,196,15)": "#f1c40f",
		"rgb(52,152,219)": "#3498db",
		"rgb(211,84,0)": "#d35400"
	};

	window.rgbColorsToTintedColors = {
		"rgb(142,68,173)": "rgb(229,152,102)",
		"rgb(241,196,15)": "rgb(246,223,133)",
		"rgb(52,152,219)": "rgb(151,201,235)",
		"rgb(46,204,113)": "rgb(210,180,222)"
	};
	});


	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$("#restart").on('touchstart', function() {
			init();
			canRestart = false;
			$("#gameoverscreen").fadeOut();
		});
		$("#socialShare").on('touchstart', handleRevive);
	}
	else {
		$("#restart").on('mousedown', function() {
			init();
			canRestart = false;
			$("#gameoverscreen").fadeOut();
		});
		$("#socialShare").on('mousedown', handleRevive);
	}

	function handleRevive() {
		if ($("#socialShare").hasClass("disabled")) return;
		if (window.ysdk) {
			window.ysdk.adv.showRewardedVideo({
				callbacks: {
					onOpen: function() {},
					onRewarded: function() {
						if (window.gameMode === 'double') {
							if (window.LeftHex && window.LeftHex.blocks) {
								window.LeftHex.blocks.forEach(function(side) {
									if (side.length > 0) side.splice(Math.max(0, side.length - 4), 4);
								});
							}
							if (window.RightHex && window.RightHex.blocks) {
								window.RightHex.blocks.forEach(function(side) {
									if (side.length > 0) side.splice(Math.max(0, side.length - 4), 4);
								});
							}
						} else {
							if (MainHex && MainHex.blocks) {
								MainHex.blocks.forEach(function(side) {
									if (side.length > 0) side.splice(Math.max(0, side.length - 4), 4);
								});
							}
						}
						gameState = 1;
						$("#gameoverscreen").fadeOut();
						document.getElementById("canvas").className = "";
						$("#socialShare").addClass("disabled");
					},
					onClose: function() {},
					onError: function(e) { console.log('Ad error', e); }
				}
			});
		}
	}
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			$("#restartBtn").on('touchstart', function() {
			init(1);
			canRestart = false;
			$("#gameoverscreen").fadeOut();
		});

	}
	else {
		$("#restartBtn").on('mousedown', function() {
			init(1);
			canRestart = false;
			$("#gameoverscreen").fadeOut();
		});


	}

	// Menu button — return to start screen
	$("#menuBtn, #menuBtnPause").on('mousedown touchstart', function(e) {
		e.preventDefault();
		$("#gameoverscreen").fadeOut();
		$("#socialShare").css("display", "none");
		document.getElementById("canvas").className = "";
		if (gameState == -1) {
			pause(); // Unpause cleanly to hide pause UI
			setTimeout(function() {
				initialize(1);
				setStartScreen();
			}, 100);
		} else {
			initialize(1);
			setStartScreen();
		}
	});

}
function inside (point, vs) {
	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	
	var x = point[0], y = point[1];
	
	var inside = false;
	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = vs[i][0], yi = vs[i][1];
		var xj = vs[j][0], yj = vs[j][1];
		
		var intersect = ((yi > y) != (yj > y))
			&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}
	
	return inside;
};

function handleClickTap(x,y) {
	if (x < 120 && y < 83 && $('.helpText').is(':visible')) {
		showHelp();
		return;
	}
	var radius = settings.hexWidth ;
	var halfRadius = radius/2;
	var triHeight = radius *(Math.sqrt(3)/2);
	var Vertexes =[
		[radius,0],
		[halfRadius,-triHeight],
		[-halfRadius,-triHeight],
		[-radius,0],
		[-halfRadius,triHeight],
		[halfRadius,triHeight]];
	Vertexes = Vertexes.map(function(coord){ 
		return [coord[0] + trueCanvas.width/2, coord[1] + trueCanvas.height/2]});

	if (!MainHex || gameState === 0 || gameState==-1) {
		return;
	}

	if (x < window.innerWidth/2) {
		MainHex.rotate(1);
	}
	if (x > window.innerWidth/2) {
		MainHex.rotate(-1);
	}
}

