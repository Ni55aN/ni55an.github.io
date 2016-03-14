var Logo = {};

Logo.DURATION = 4000;
Logo.canvas = null;
Logo.ctx = null;
Logo.startTime = null;

var SVGlogo = null;
var Background = null;
var mask = null;


Logo.init = function(){
	
	Logo.canvas = document.getElementById('animLogo');	
	Logo.ctx = Logo.canvas.getContext('2d');
	
	Logo.canvas.addEventListener('mousedown',function(e){
		
	
		if(!mask.isEditMode)return;
		
		
			var svgCoordinatesX = (e.offsetX - SVGlogo.getOffsetX())/SVGlogo.getSize()*512;
			var svgCoordinatesY = (e.offsetY - SVGlogo.getOffsetY())/SVGlogo.getSize()*512;
			
			
		
			if(mask.pickPoint(svgCoordinatesX,svgCoordinatesY))return;
			
		
			if(svgCoordinatesX > 0 && svgCoordinatesY > 0 && svgCoordinatesX < 512 && svgCoordinatesY < 512)
				mask.addPoint(svgCoordinatesX,svgCoordinatesY);	
		
	
		
	},false);
	
	
	Logo.canvas.addEventListener('mousemove',function(e){
		
		if(mask.pickedPoint == null)return;
		
		var svgCoordinatesX = (e.offsetX - SVGlogo.getOffsetX())/SVGlogo.getSize()*512;
		var svgCoordinatesY = (e.offsetY - SVGlogo.getOffsetY())/SVGlogo.getSize()*512;
			
		mask.setPoint(mask.pickedPoint,svgCoordinatesX,svgCoordinatesY);
		
		
	},false);
	
	Logo.canvas.addEventListener('mouseup',function(e){
		
		mask.unpick();
		
	},false);
	
	window.addEventListener('keydown',function(e){

		if(e.keyCode == 16){
			
			if(mask.isEditMode)
				mask.points=[];
	
		}else if(e.keyCode == 17){
			
			mask.isEditMode = !mask.isEditMode;	
			console.log('editor mode: '+mask.isEditMode);
			
		}else if(e.keyCode == 18){
			
			if(mask.isEditMode)
			{
				var out = '';
				for(var i=0;i<mask.points.length;i++)
					out += '['+mask.points[i][0]+','+mask.points[i][1]+'],';
				
				console.log( '['+out+']');
			}
			
		}
		
	},false);
	
	window.addEventListener('resize',Logo.resize,false);
	
	
	
	setTimeout(function(){
	SVGlogo = new SVG('logo.svg',function(){
		
		mask = new MaskPainter();	
		Logo.resize();
		
		Background = new BinaryBackground(Logo.canvas.width,Logo.canvas.height);
		
		
		Logo.startTime = new Date().getTime();
		Logo.render();
	
	});	
	},300);
}

Logo.resize = function(){
		
		
		Logo.canvas.width=window.innerWidth;
		Logo.canvas.height=window.innerHeight;
		
		var size = Logo.canvas.width*0.1+200;
		SVGlogo.setSize(size);
		
};

Logo.duration = function(){
	
	return new Date().getTime() - Logo.startTime;
}

Logo.clear = function(){
	
	Logo.ctx.clearRect(0, 0, Logo.canvas.width, Logo.canvas.height);
}


Logo.render = function(){
	
	requestAnimationFrame(Logo.render);
	
	Logo.clear();
	Background.render();
	SVGlogo.render();	
}
	
var BinaryBackground = function(w,h){
	
	var FONT_SIZE = 20;
	var FONT_FAMILY = ' "Baskerville Old Face"';
	var FONT_COLOR = "#c7c7c7";
	var CHAR_WIDTH = [13,9];
	var START_OFFSET = 5;
	
	var isDone = false;
	
	var charsCount = Math.ceil(h/FONT_SIZE*w/Math.min(CHAR_WIDTH[0],CHAR_WIDTH[1])/8);
	var text = new Uint8Array(charsCount);
	var offsetW = new Uint16Array(charsCount*8);
	var offsetH = new Uint16Array(charsCount*8);
	var hidedText = [];
	var stringMask = 'Vitaliy Stolyarov ';

	var binCanvas = document.createElement('canvas');
	binCanvas.width = Logo.canvas.width;
	binCanvas.height = Logo.canvas.height;
	
	var binctx = binCanvas.getContext('2d');
	binctx.fillStyle = FONT_COLOR;
	binctx.font = FONT_SIZE+"px "+FONT_FAMILY;
		
	var getTextBit = function(index){
		
		return text[Math.floor(index/8)] >> index%8 & 1;
	}

	for(var i=0,w=START_OFFSET,h=FONT_SIZE;		i<text.length;	i++)
	{
		text[i] = stringMask.charCodeAt(i%stringMask.length);
		
		for(var j=7;j>=0;j--){
			
			var bitIndex = i*8+j;
			
			hidedText.push(bitIndex);
			
			var bit = getTextBit(bitIndex);
			
			if(w + CHAR_WIDTH[bit] > Logo.canvas.width){
				
				h+=FONT_SIZE;
				w=START_OFFSET;
			}
			
			offsetW[bitIndex] = w;
			offsetH[bitIndex] = h;
				
			w+=CHAR_WIDTH[bit];
				
		}
	}
	
	var drawBits = function(list){
		
		var bitIndex = null;
		
		for(var i = 0;i<list.length;i++)
		{
			bitIndex = list[i];
			binctx.fillText(getTextBit(bitIndex),offsetW[bitIndex],offsetH[bitIndex]);
		}
		
		Logo.ctx.drawImage(binCanvas,0,0);
	}
	


	var getDrawnContenders = function(){
	
		var list = [];
		var bitsCount = text.length*8;
		var hidedCount = hidedText.length;
		
		var f = Logo.duration()/Logo.DURATION;
		
		var prev_show = bitsCount-hidedCount;
		var curr_show = f*bitsCount;
		
		
		
		
		if(hidedText.length > 0)
			for(var i=0;	i<curr_show-prev_show;	i++)
			{
				var hidedIndex = Math.floor(Math.random()*hidedText.length);
				var bitIndex = hidedText[hidedIndex];
				
				hidedText.splice(hidedIndex,1);
				list.push(bitIndex);
				
			}
		else
			isDone = true;
		
		return list;
	}
	
	var lightness = function(k){	return 'rgba(255,255,255,'+k+')';	}
	
	var overlayGradient = function(){
		
		var ctx = Logo.ctx;
		
		var gradient=ctx.createLinearGradient(0,0,Logo.canvas.width,Logo.canvas.height);
		gradient.addColorStop(0,lightness(0));
		gradient.addColorStop(0.5,lightness(0.7));
		gradient.addColorStop(1,lightness(0));

		ctx.fillStyle=gradient;
		ctx.fillRect(0,0,Logo.canvas.width,Logo.canvas.height);
	}
	
	this.render = function(){
		
		if(isDone)true;
		
		var drawlist = getDrawnContenders();
		drawBits(drawlist);
		overlayGradient();
	}
}




var MaskPainter = function(){
	
	var PICK_RADIUS = 5;
	var PEN_WIDTH = 35;

	
	var _this = this;
	
	var maskCanvas = document.createElement('canvas');
		maskCanvas.width = 512;
		maskCanvas.height = 512;	
	var ctx = maskCanvas.getContext('2d');

	
	
	
	this.points = [[31.21951219512195,201.3658536585366],[32.78048780487805,260.6829268292683],[31.21951219512195,313.7560975609756],[20.29268292682927,195.1219512195122],[65.5609756097561,254.4390243902439],[113.95121951219512,316.8780487804878],[99.90243902439025,202.9268292682927],[99.90243902439025,254.4390243902439],[101.46341463414635,307.5121951219512],[140.4878048780488,232.58536585365854],[138.9268292682927,271.609756097561],[140.4878048780488,310.6341463414634],[156.09756097560975,198.2439024390244],[143.609756097561,213.85365853658536],[124.8780487804878,234.14634146341464],[167.02439024390245,209.9512195121951],[165.46341463414635,239.609756097561],[167.02439024390245,261.4634146341463],[156.09756097560975,249.7560975609756],[287.219512195122,280.9756097560976],[149.85365853658536,301.2682926829268],[167.02439024390245,223.21951219512195],[193.5609756097561,227.90243902439025],[227.90243902439025,229.46341463414635],[243.5121951219512,206.82926829268294],[240.390243902439,236.4878048780488],[243.5121951219512,259.9024390243902],[232.58536585365854,251.3170731707317],[352.780487804878,274.7317073170732],[221.65853658536585,305.9512195121951],[241.9512195121951,226.34146341463415],[268.4878048780488,229.46341463414635],[298.1463414634146,229.46341463414635],[360.5853658536585,248.1951219512195],[318.4390243902439,231.02439024390245],[320,277.8536585365854],[316.8780487804878,268.4878048780488],[330.9268292682927,315.3170731707317],[368.390243902439,285.6585365853659],[374.6341463414634,232.58536585365854],[371.5121951219512,285.6585365853659],[373.0731707317073,309.0731707317073],[412.0975609756098,204.4878048780488],[413.6585365853659,257.5609756097561],[412.0975609756098,310.6341463414634],[399.609756097561,196.6829268292683],[441.7560975609756,248.1951219512195],[488.5853658536585,310.6341463414634],[482.3414634146341,193.5609756097561],[479.219512195122,257.5609756097561],[485.4634146341463,316.8780487804878],[54.63414634146341,246.6341463414634],[92.09756097560975,443.3170731707317],[271.609756097561,449.5609756097561],[245.0731707317073,448],[427.7073170731707,440.1951219512195],[448,263.8048780487805],[448,266.9268292682927],[443.3170731707317,60.8780487804878],[227.90243902439025,62.4390243902439],[266.9268292682927,59.31707317073171],[76.48780487804878,84.29268292682927],[67.1219512195122,248.1951219512195]];
	this.isEditMode = false;
	this.pickedPoint = null;
	
	var last_duration = 0;
	
	this.addPoint = function(x,y){
		
		_this.points.push([x,y]);
		
		mask.pickedPoint = _this.points.length-1;
	}
	
	
	this.pickPoint = function(x,y){
		
		
		for(var i=0;i<_this.points.length;i++)
			if(	Math.sqrt(Math.pow(this.points[i][0]-x,2)+Math.pow(this.points[i][1]-y,2)) < PICK_RADIUS)
			{
				_this.pickedPoint = i;
				return true;
			}

				
		return null;
	}
	
	this.setPoint = function(i,x,y){
		
		_this.points[i]=[x,y];
	}
	
	this.unpick = function(){
		
		_this.pickedPoint = null;
	}
	
	
	
	var drawBezier = function(start,end,x1,y1,x2,y2,x3,y3){
		
		
		ctx.beginPath();
		
		for(var t=start;t<end;t+=0.001)
			ctx.lineTo(
				(1-t)*(1-t)*x1 + 2*t*(1-t)*x2 + t*t*x3,
				(1-t)*(1-t)*y1 + 2*t*(1-t)*y2 + t*t*y3
			);
		
		
		ctx.stroke();
	}
	
	this.get = function(){
		
		return maskCanvas;
	}
	
	this.draw = function(){

		if(_this.isEditMode)
		{
			ctx.clearRect(0,0,maskCanvas.width,maskCanvas.height);
			
			ctx.fillStyle = 'black';
			ctx.lineWidth = PEN_WIDTH;
			
			for(var i=0;	i<=_this.points.length-3;	i+=3)
			{
				var p1 = _this.points[i+0];
				var p2 = _this.points[i+1];
				var p3 = _this.points[i+2];
				
				drawBezier(	0,1, p1[0],p1[1],p2[0],p2[1],p3[0],p3[1]);		
			}
			
			ctx.lineWidth = 1;
			ctx.fillStyle = '#f00';
			for(var i=0;	i<_this.points.length;	i++)
			{
				ctx.beginPath();
				ctx.arc(_this.points[i][0],	_this.points[i][1],	PICK_RADIUS,	0,	2*Math.PI);
				ctx.fill();
			}
		
		} else {
	
			ctx.fillStyle = 'black';
			ctx.lineWidth = PEN_WIDTH;
	
			if(Logo.duration()>Logo.DURATION){ctx.fillRect(0,0,maskCanvas.width,maskCanvas.height);return;}
		
		
			
			var pointsIndex = 3*Math.floor(_this.points.length/3*Logo.duration()/Logo.DURATION);	
			var durationOnCurve = Logo.DURATION/Math.floor(_this.points.length/3);
			
			var end = Logo.duration()%durationOnCurve/durationOnCurve;

			if(pointsIndex+2 < _this.points.length)
			{
				var p1 = _this.points[pointsIndex+0];
				var p2 = _this.points[pointsIndex+1];
				var p3 = _this.points[pointsIndex+2];
				
				drawBezier(0,Math.min(1,end+0.2), p1[0],p1[1],p2[0],p2[1],p3[0],p3[1]);
			}
		
		
		}
	
		last_duration = Logo.duration();
		
	}
	
}

var SVG = function(url,callback){
	
	
	var pattern = null;
	var center = {x:null,y:null};
	var size = null;

	
	var SVGcanvas = document.createElement('canvas');
	var ctx = SVGcanvas.getContext('2d');
	
	
	var img = new Image();
	img.onload = function(){
	
		pattern = ctx.createPattern(img,'no-repeat');	
		callback();
	}
	
	img.src=url;
	
	this.getOffsetX = function(){
		
		return center.x;
	}
	
	this.getOffsetY = function(){
		
		return center.y;
	}
	
	this.getSize = function(){
		
		return size;
	}
	
	this.setSize = function(val){
		
		size = val;
		SVGcanvas.width = size;
		SVGcanvas.height = size;
	
		
		center.x = Logo.canvas.width/2-size/2;
		center.y = Logo.canvas.height/2-size/2;	
	}
	
	
	this.render = function(){
		
	
		var scale = size/img.width;	

		ctx.clearRect(0,0,SVGcanvas.width,SVGcanvas.height);
		ctx.scale(scale,scale);
		
		mask.draw(ctx);	
		
		ctx.globalCompositeOperation="source-over";
		ctx.drawImage(mask.get(),0,0);
		
		ctx.globalCompositeOperation=mask.isEditMode?"destination-over":"source-in";
		ctx.fillStyle=pattern;
		ctx.fillRect(0,0,img.width,img.height);
		
		
		ctx.resetTransform();
		
		//Logo.ctx.save();
		//Logo.ctx.transform(	scale,	0,			0,
		//				scale,	center.x,	center.y);	
		
	//	
		Logo.ctx.drawImage(SVGcanvas,center.x,center.y);
		//Logo.ctx.restore();
	}
	
}