document.addEventListener("touchstart", function (e){
	e.preventDefault();
});	
var dataUrl = [];
for(var i = 0; i < 36; i++){
	dataUrl.push("../img/"+ (i%16+1) +".jpg");
};

var wrap = document.querySelector(".wrap");
var child = wrap.children[0];
var pics = document.querySelector(".pics");
var li = pics.getElementsByTagName('li');
var bar = document.querySelector(".bar");
var footer = document.querySelector("footer");
var length = 10;
var start = 0;
var minTop = wrap.getBoundingClientRect().top;
var maxTop = minTop + wrap.getBoundingClientRect().height;
var maxScroll = wrap.clientHeight - child.offsetHeight;
var isLoad = false;
var footerH = footer.offsetHeight;
var isOver = false;
var scaleBar = wrap.clientHeight/child.offsetHeight;
var canvas = document.querySelector(".canvas");
var canvasXT = canvas.getContext("2d");
var clos = document.querySelector(".close"); 
var bigImg = document.querySelector(".bigImg");
cssTransform(footer,"translateZ",0.01);
cssTransform(child,"translateZ",0.01);
cssTransform(bar,"translateZ",0.01);

function gesCanvas(){
	cssTransform(canvas,"translateZ",0.01);
	var startS = 0;
	var startR = 0;
	var callBack = {
		start: function (e){
			startS = cssTransform(this,"scale");
			startR = cssTransform(this,"rotate");
		},
		change: function (e){
			var disS = e.scale;
			var disR = e.rotation;
			cssTransform(this,"scale",startS*disS);
			cssTransform(this,"rotate",startR*disR);
		}
	}
	gesture(canvas,callBack);
};
gesCanvas();

clos.addEventListener("touchend", function (){
	bigImg.style.opacity = 0;
	cssTransform(bigImg,"scale",0);
})


callBack = {
	start: function (){
		child.style.transiton = "none";
		var scrollTop = cssTransform(child,"translateY");
		maxScroll = wrap.clientHeight - child.offsetHeight;
		scaleBar = wrap.clientHeight/child.offsetHeight;
		var barTop = -(scrollTop*scaleBar);
		cssTransform(bar,"translateY",barTop);
		bar.style.height = wrap.clientHeight*scaleBar + "px";
		bar.style.opacity = 1;
		if(!isOver&&scrollTop <= maxScroll){
			isLoad = true;
		}
	},
	in: function (){
		createImg();
		var scrollTop = cssTransform(child,"translateY");
		var barTop = -(scrollTop*scaleBar);
		cssTransform(bar,"translateY",barTop);
		if(!isOver&&isLoad){
			var over = maxScroll - scrollTop;
			var scale = over/footerH;
			scale = scale > 1?1:scale;
			scale = scale < 0?0:scale;
			cssTransform(footer,"scale",scale);
		}
	},
	end: function (){
		var scrollTop = cssTransform(child,"translateY");
		if(!isOver&&isLoad&&maxScroll - scrollTop >= footerH){
			clearInterval(child.scroll);
			start += length;
			create();
			bar.style.opacity = 0;
		}
		isLoad = false;
	},
	over: function (){
		bar.style.opacity = 0;
	}
};

mscroll(wrap,callBack);

function create(){
	if(!isOver && start >= dataUrl.length){
		footer.innerHTML = "<strong>没有更多图片了</strong>";
		setTimeout(function (){
			child.style.transiton = ".5s";
			cssTransform(child,"translateY",maxScroll);
			isOver = true;
			footer.style.opacity = 0;
		},1500);
		return;
	}
	var end = start + length;
	end = end>dataUrl.length?dataUrl.length:end;
	for(var i = start; i < end; i++){
		var newLi = document.createElement("li");
		newLi.src = dataUrl[i];
		newLi.isLoad = false;
		newLi.isMove = false;
		newLi.addEventListener("touchstart", function (){
			this.isMove = false;
		});
		newLi.addEventListener("touchmove", function (){
			this.isMove = true;
		});
		newLi.addEventListener("touchend", function (){
			if(this.isMove){
				return ;
			};
			var left = this.getBoundingClientRect().left + this.getBoundingClientRect().width/2;
			var top = this.getBoundingClientRect().top + this.getBoundingClientRect().height/2;
			var img = new Image();
			img.src = this.src;
			img.onload = function (){
				canvas.width = img.width;
				canvas.height = img.height;
				cssTransform(canvas,"scale",1);
				cssTransform(canvas,"rotate",0);
				canvasXT.drawImage(img,0,0,canvas.width,canvas.height);
				bigImg.style.WebkitTransformOrigin = bigImg.style.transformOrigin = left + "px " + top +"px";
				bigImg.style.opacity = 1;
				cssTransform(bigImg,"scale",1);
			}
		})
		pics.appendChild(newLi);
	}
	createImg();
	cssTransform(footer,"scale",0);
};
create();

function createImg(){
	for(var i = 0; i < li.length; i++){
		var top = li[i].getBoundingClientRect().top;
		if(!li[i].isLoad&&top >= minTop&&top < maxTop){
			li[i].isLoad = true;
			showImg(li[i]);
		}
	}
}

function showImg(li){
	var img = new Image();
	img.src = li.src;
	img.onload = function (){
		var c = document.createElement("canvas");
		var ctx = c.getContext("2d");
		c.width = img.width;
		c.height = img.height;
		ctx.drawImage(img,0,0,c.width,c.height);
		li.appendChild(c);
		setTimeout(function (){
			c.style.opacity = 1;
		},100)
	}
}