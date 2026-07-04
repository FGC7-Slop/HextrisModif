function drawTimer() {
	if(gameState==1){
		var leftVertexes = [];
		var rightVertexes = [];
	if(MainHex.ct - MainHex.lastCombo < settings.comboTime){
		for(var i=0;i<6;i++){
			var done = (MainHex.ct -MainHex.lastCombo);
			if(done<(settings.comboTime)*(5-i)*(1/6)){
				leftVertexes.push(calcSide(i,i+1,1,1));
								rightVertexes.push(calcSide(12-i,11-i,1,1));
			}
			else{
				leftVertexes.push(calcSide(i,i+1,1-((done*6)/settings.comboTime)%(1),1));
				rightVertexes.push(calcSide(12-i,11-i,1-((done*6)/settings.comboTime)%(1),1));
				break;
			}
		}
	}
		if(rightVertexes.length !== 0) drawSide(rightVertexes);
		if(leftVertexes.length !== 0) drawSide(leftVertexes);
	}
}

function calcSide(startVertex,endVertex,fraction,offset){
	startVertex = (startVertex+offset)%12;
	endVertex = (endVertex+offset)%12;
	ctx.globalAlpha=1;
	ctx.beginPath();
	ctx.lineCap = "round";

	var radius = (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth ;
	var halfRadius = radius/2;
	var triHeight = radius *(Math.sqrt(3)/2);
	var Vertexes =[
		[(halfRadius*3)/2,triHeight/2],
		[radius,0],
		[(halfRadius*3)/2,-triHeight/2],
		[halfRadius,-triHeight],
		[0,-triHeight],
		[-halfRadius,-triHeight],
		[-(halfRadius*3)/2,-triHeight/2],
		[-radius,0],
		[-(halfRadius*3)/2,triHeight/2],
		[-halfRadius,triHeight],
		[0,triHeight],
		[halfRadius,triHeight]
	].reverse();
	var startX =trueCanvas.width/2 + Vertexes[startVertex][0];
	var startY =trueCanvas.height/2 + Vertexes[startVertex][1];
	var endX = trueCanvas.width/2 + Vertexes[endVertex][0];
	var endY = trueCanvas.height/2 + Vertexes[endVertex][1];
		return [[startX,startY],[((endX-startX)*fraction)+startX,((endY-startY)*fraction)+startY]];
}
function drawSide(vertexes){
	if (gameState === 0) {
		ctx.strokeStyle = hexColorsToTintedColors[MainHex.lastColorScored];
	} else {
		ctx.strokeStyle = MainHex.lastColorScored;
	}
	ctx.lineWidth =4*settings.scale;
		ctx.moveTo(vertexes[0][0][0],vertexes[0][0][1]);
	ctx.lineTo(vertexes[0][1][0],vertexes[0][1][1]);
		for(var i=1;i<vertexes.length;i++){
			ctx.lineTo(vertexes[i][1][0],vertexes[i][1][1]);
			ctx.moveTo(vertexes[i][1][0],vertexes[i][1][1]);
		}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

}

function drawTimerForHex(hex) {
	if(gameState==1){
		var leftVertexes = [];
		var rightVertexes = [];
		if(hex.ct - hex.lastCombo < settings.comboTime){
			for(var i=0;i<6;i++){
				var done = (hex.ct - hex.lastCombo);
				if(done<(settings.comboTime)*(5-i)*(1/6)){
					leftVertexes.push(calcSideForHex(i,i+1,1,1,hex));
					rightVertexes.push(calcSideForHex(12-i,11-i,1,1,hex));
				}
				else{
					leftVertexes.push(calcSideForHex(i,i+1,1-((done*6)/settings.comboTime)%(1),1,hex));
					rightVertexes.push(calcSideForHex(12-i,11-i,1-((done*6)/settings.comboTime)%(1),1,hex));
					break;
				}
			}
		}
		if(rightVertexes.length !== 0) drawSideForHex(rightVertexes, hex);
		if(leftVertexes.length !== 0) drawSideForHex(leftVertexes, hex);
	}
}

function calcSideForHex(startVertex,endVertex,fraction,offset,hex){
	startVertex = (startVertex+offset)%12;
	endVertex = (endVertex+offset)%12;
	ctx.globalAlpha=1;
	ctx.beginPath();
	ctx.lineCap = "round";

	var radius = (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth ;
	var halfRadius = radius/2;
	var triHeight = radius *(Math.sqrt(3)/2);
	var Vertexes =[
		[(halfRadius*3)/2,triHeight/2],
		[radius,0],
		[(halfRadius*3)/2,-triHeight/2],
		[halfRadius,-triHeight],
		[0,-triHeight],
		[-halfRadius,-triHeight],
		[-(halfRadius*3)/2,-triHeight/2],
		[-radius,0],
		[-(halfRadius*3)/2,triHeight/2],
		[-halfRadius,triHeight],
		[0,triHeight],
		[halfRadius,triHeight]
	].reverse();
	var startX = hex.x + Vertexes[startVertex][0];
	var startY = hex.y + Vertexes[startVertex][1];
	var endX = hex.x + Vertexes[endVertex][0];
	var endY = hex.y + Vertexes[endVertex][1];
	return [[startX,startY],[((endX-startX)*fraction)+startX,((endY-startY)*fraction)+startY]];
}

function drawSideForHex(vertexes, hex){
	if (gameState === 0) {
		ctx.strokeStyle = hexColorsToTintedColors[hex.lastColorScored];
	} else {
		ctx.strokeStyle = hex.lastColorScored;
	}
	ctx.lineWidth =4*settings.scale;
	ctx.moveTo(vertexes[0][0][0],vertexes[0][0][1]);
	ctx.lineTo(vertexes[0][1][0],vertexes[0][1][1]);
	for(var i=1;i<vertexes.length;i++){
		ctx.lineTo(vertexes[i][1][0],vertexes[i][1][1]);
		ctx.moveTo(vertexes[i][1][0],vertexes[i][1][1]);
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}
