function cssTra(el,attr,val) {
	if(!el.transform){
		el.transform = {};
	}
	if(arguments.length>2) {
		el.transform[attr] = val;
		var sVal = "";
		for(var s in el.transform){
			switch(s) {
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					sVal +=s+"("+el.transform[s]+"deg) ";
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
					sVal +=s+"("+el.transform[s]+"px) ";
					break;
				case "scaleX":
				case "scaleY":
				case "scaleZ":
				case "scale":
					sVal +=s+"("+el.transform[s]+") ";
					break;	
			}
			el.style.WebkitTransform = el.style.transform = sVal;
		}
	} else {
		val = el.transform[attr];
		if(typeof val == "undefined" ) {
			if(attr == "scale" || attr == "scaleX" || attr == "scaleY"  ) {
				val = 1;
			} else {
				val = 0;
			}
		}
		return val;
	}
}

function mscroll(wrap,callBack) {
	var child = wrap.children[0]; 
	var startPoint = 0;
	var startY = 0;
	var minY = wrap.clientHeight - child.offsetHeight;
	var step = 1;
	var lastY = 0; 
	var lastTime = 0;
	var lastDis = 0;
	var lastTimeDis = 1;
	var isMove = true;
	var isFirst = true;
	var Tween = {
		easeOut: function(t, b, c, d){    /* t:当前次数； b:起始值；  c:起始值和目标点间的差值；  d:总次数  */
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		backOut: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 1.70158;               //  s: 回弹距离
			}
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		} 
	};
	cssTra(child,"translateZ",0.01);
	wrap.addEventListener(
		'touchstart', 
		function(e) {
			clearInterval(child.scroll);
			if(callBack&&callBack.start){
				callBack.start();
			}
			startPoint = {pageY:e.changedTouches[0].pageY,pageX:e.changedTouches[0].pageX};
			startY = cssTra(child,"translateY");
			step = 1;
			lastY = startPoint.pageY;
			lastTime = new Date().getTime();
			lastDis = 0;
			lastTimeDis = 1;
			isMove = true;
			isFirst = true;
		}
	);
	wrap.addEventListener(
		'touchmove', 
		function(e) {
			if(!isMove) {
				return ;
			}
			var nowPoint = e.changedTouches[0];
			var disX = nowPoint.pageX - startPoint.pageX;
			var disY = nowPoint.pageY - startPoint.pageY;
			if(isFirst) {
				isFirst = false;
				if(Math.abs(disY) < Math.abs(disX)) {
					isMove = false;
					return ;
				}
			}
			var t = startY + disY;
			var nowTime = new Date().getTime();
			if(t > 0) {
				step = 1-t / wrap.clientHeight; 
				t = parseInt(t*step);
			}
			if(t < minY) {
				var over = minY - t; 
				step = 1-over / wrap.clientHeight;
				over = parseInt(over*step);
				t = minY - over;
			}
			lastDis = nowPoint.pageY - lastY; 
			lastTimeDis = nowTime - lastTime; 
			lastY = nowPoint.pageY;
			lastTime = nowTime;
			t = t>0?0:t;
			cssTra(child,"translateY",t);
			if(callBack&&callBack.in){
				callBack.in();
			}
		}
	);
	wrap.addEventListener(
		'touchend', 
		function (){
			var speed = (lastDis/lastTimeDis)*120; 
			speed = isNaN(speed)?0:speed;
			var t = cssTra(child,"translateY");
			var target = t + speed; 
			var type = "easeOut";
			var time = Math.abs(speed*.9);
			time = time<300?300:time;
			if(target > 0) {
				target = 0;
			}
			if(target < minY) {
				target = minY;
				type ="backOut";
			}
			move(target,time,type);
		}
	);
	function move(target,time,type) {
		var t = 0;
		var b = cssTra(child,"translateY");
		var c = target - b;
		var d = Math.ceil(time/20);
		clearInterval(child.scroll);
		child.scroll = setInterval(
			function() {
				t++;
				if(t > d) {
					clearInterval(child.scroll);
					if(callBack&&callBack.over){
						callBack.over();
					}
				} else {
					var top = Tween[type](t,b,c,d);
					cssTra(child,"translateY",top);
					if(callBack&&callBack.in){
						callBack.in();
					}
				}
			},20
		);
	}
}





function getStyle(obj, attr)
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	else
	{
		return getComputedStyle(obj,false)[attr];
	}
}


function css(obj,attr,value)
{
	if(arguments.length==2)
	{
		return getStyle(obj,attr);
	}
	else if(arguments.length==3)
	{
		obj.style[attr]=value;
	}
}





window.addEventListener("orientationchange", setRem);
window.addEventListener("resize", setRem);
function setRem() {
	var html = document.querySelector("html");
	var width = html.getBoundingClientRect().width;
	html.style.fontSize = width / 16 + "px";
}
setRem();