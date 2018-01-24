// 阻止默认事件及链接

document.addEventListener("touchstart",function (e){
	e.preventDefault();
})

function stopLi(){
	var a = document.querySelectorAll("a");
	for(var i = 0;i < a.length; i++){
		a[i].addEventListener("touchmove",function(){
			this.isMove = true;
		});
		a[i].addEventListener("touchend",function(){
			if(!this.isMove){
				window.location.href = this.href;
			}
			this.isMove = false;
		})
	}
};
stopLi();


// 设置滚动条	

function scroll(){
	var wrap = document.querySelector(".wrap");
	var scroll = wrap.children[0];
	var bar = document.querySelector("#scrollBar");
	var search = document.querySelector("#search");
	var searchBtn = document.querySelector(".headerSea");
	var callBack = {};
	var scale = wrap.clientHeight/scroll.offsetHeight;
	var seaHei = search.offsetHeight;
	var startTop = 0;
	css(bar,"height",wrap.clientHeight*scale +"px");

	searchBtn.addEventListener("touchend",function (){
		var top = -cssTra(scroll,"translateY");
		if(search.className == "search clearfix hide"){
			search.className = "search clearfix";
		}else{
			if(top > seaHei){
				search.className = "search clearfix hide";
			}
		}
	})

	callBack.start = function (){
		startTop = -cssTra(scroll,"translateY")*scale;
	};
	callBack.in = function (){
		var top = -cssTra(scroll,"translateY")*scale;
		cssTra(bar,"translateY",top);
		if((top - startTop) > 5)css(bar,"opacity",1);
		if(top > seaHei*scale){
			search.className = "search clearfix hide";
		}else{
			search.className = "search clearfix";
		}

	}
	callBack.over = function (){
		css(bar,"opacity",0);
		var top = -cssTra(scroll,"translateY")*scale;
		top = top<0?0:top;
		cssTra(bar,"translateY",top);
		if(top == 0){
			search.className = "search clearfix";
		}
	}
	mscroll(wrap,callBack);
};
scroll();



// 菜单栏

function menuShow(){
	var menu = document.querySelector("#headerMenu");
	var menuNav = document.querySelector("#menuNav");

	menu.addEventListener("touchstart",function (e){
		if(menu.className =="headerMenu headerMenuShow"){
			menu.className = "headerMenu headerMenuClo";
			menuNav.className = "show";
		} else{
			menu.className = "headerMenu headerMenuShow";
			menuNav.className = "hide";
		}
		e.stopPropagation();
	})

	menuNav.addEventListener("touchstart",function (e){
		menu.className = "headerMenu headerMenuClo";
		menuNav.className = "show";
		e.stopPropagation();
	})

	document.addEventListener("touchstart",function (){
		if(menu.className =="headerMenu headerMenuClo"){
			menu.className = "headerMenu headerMenuShow";
			menuNav.className = "hide";
		}
	})
};
menuShow();


// 导航栏

function navMove(){
	var navScroll = document.querySelector("#navScroll");
	var nav = document.querySelector("#nav");
	var startPoint = 0;
	var startX = 0;
	var minX = navScroll.clientWidth-nav.offsetWidth;
	var coe = 1;
	var lastX = 0;
	var lastTime = 0;
	var lastDis = 0;
	var lastTimeDis = 0;
	cssTra(nav,"translateZ",0.01);
	navScroll.addEventListener("touchstart",function (e){
		nav.style.transition = "none";
		startPoint = e.changedTouches[0].pageX;
		startX = cssTra(nav,"translateX");
		coe = 1;
		lastX = startPoint;
		lastTime = new Date().getTime();
		lastDis = 0;
		lastTimeDis = 0;
	});

	navScroll.addEventListener("touchmove",function (e){
		var nowPoint = e.changedTouches[0].pageX;
		var dis = nowPoint - startPoint;
		var left = startX + dis;
		var nowTime = new Date().getTime();
		if(left>=0){
			coe = 1 - left/navScroll.clientWidth;
			left = parseInt(left*coe); 
		}
		if(left<minX){
			var over = minX - left;
			coe = 1 - over/navScroll.offsetWidth;
			over = parseInt(over*coe);
			left = minX - over;
		}
		lastDis = nowPoint - startPoint;
		lastTimeDis = nowTime-lastTime;
		cssTra(nav,"translateX",left);
	});

	navScroll.addEventListener("touchend",function (){
		var speed = (lastDis/lastTimeDis)*200;
		speed = (Math.abs(speed)<200||isNaN(speed))?0:speed;
		var left = cssTra(nav,"translateX");
		var target = left + speed;
		var type = "cubic-bezier(.34,.92,.58,.9)";
		var time = Math.abs(speed*2);
		speed = Math.abs(speed)<100?0:speed;
		time = time>300?300:time;
		if(target > 0) {
			target = 0;
			type ="cubic-bezier(0, 1.38, 0.38, 1.3)";
		}
		if(target < minX) {
			target = minX;
			type ="cubic-bezier(0, 1.38, 0.38, 1.3)";
		}
		nav.style.transition = time + "ms " + type;
		cssTra(nav,"translateX",target);
	})

}
navMove();


// 导航点击变色

function navCha(){
	var navA = document.querySelectorAll("#nav span");
	var startPoint = 0;
	for(var i = 0; i < navA.length; i++){
		navA[i].addEventListener("touchstart",function (e){
			startPoint = {pageX: e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY};
		})
		navA[i].addEventListener("touchend",function (e){
			var nowPoint = {pageX: e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY};
			var disX = nowPoint.pageX - startPoint.pageX;
			var disY = nowPoint.pageY - startPoint.pageY; 
			if(Math.abs(disX) < 3 && Math.abs(disY) < 3){
				for(var j = 0; j < navA.length; j++){
					navA[j].className = "";
				}
				this.className = "active";
			}else{
				return ;
			}
		})
	}
};
navCha();


// 轮播图

function picSlider(){
	var wrap = document.querySelector("#picsWrap");
	var list = document.querySelector("#list");
	list.innerHTML += list.innerHTML; 
	var li = list.children;
	var nav = document.querySelectorAll("#dots span");
	var timer = null;
	var startPoint = 0;
	var startX = 0;
	var now=0;
	var isMove = true;
	var isFirst = true;
	cssTra(list,"translateZ",0.01);
	cssTra(list,"translateX",0);

	css(list,'width',li.length*wrap.offsetWidth+'px');
	for(var i=0;i<li.length;i++){
		css(li[i],'width',wrap.offsetWidth+'px');
	}
	css(wrap,'height',li[0].offsetHeight+'px');

	wrap.addEventListener(
		"touchstart",
		function(e) {
			clearInterval(timer);
			startPoint = {pageX: e.changedTouches[0].pageX,pageY: e.changedTouches[0].pageY};
			var translateX = cssTra(list,"translateX");
			now = Math.round(-translateX / wrap.offsetWidth);
			if(now == 0) {
				now = nav.length;
			}
			if(now == li.length-1) {
				now = nav.length-1;
			}
			list.style.transition = "none";
			cssTra(list,"translateX",-now * wrap.offsetWidth);	
			startX = cssTra(list,"translateX");
			isMove = true;
			isFirst = true;
		}
	);
	wrap.addEventListener(
		"touchmove",
		function(e) {
			var nowPoint = {pageX: e.changedTouches[0].pageX,pageY: e.changedTouches[0].pageY};
			var disX = nowPoint.pageX - startPoint.pageX;
			var disY = nowPoint.pageY - startPoint.pageY;

			if(isFirst){
				isFirst = false;
				if(Math.abs(disY) > Math.abs(disX)) {
					isMove = false;
				}
			}

			if(isMove){
				cssTra(list,"translateX",startX + disX);
			}else{
				return;
			}

		}
	);
	wrap.addEventListener(
		"touchend",
		function(e) {
			var translateX = cssTra(list,"translateX");
			now = Math.round(-translateX / wrap.offsetWidth);
			tab();
			auto();
		}
	);

	function auto() {
		clearInterval(timer);
		timer = setInterval(
			function() {
				if(now == li.length-1) {
					now = nav.length-1;
				}
				list.style.transition = "none";
				cssTra(list,"translateX",-now * wrap.offsetWidth);
				setTimeout(
					function () {
						now++;
						tab();	
					},100
				);
			},2000
		);
	}
	auto();
	function tab() {
		list.style.transition = ".5s";
		cssTra(list,"translateX",-now * wrap.offsetWidth);
		for(var i = 0 ; i < nav.length; i++) {
			nav[i].className = "";
		}
		nav[now%nav.length].className = "dotActive";
	}

	// 监听是否在页面

	document.hidden?clearInterval(timer):auto();
	document.mozHidden?clearInterval(timer):auto();
	document.msHidden?clearInterval(timer):auto();
	document.webkitHidden?clearInterval(timer):auto();

}
picSlider();





// tab转换

function tab(){
	var tabWrap = document.querySelectorAll(".tabWrap");
	var tabList = document.querySelectorAll(".tabList");
	var tabNav = document.querySelectorAll(".tabNav");
	var width = tabNav[0].offsetWidth;
	var tabNext = document.querySelectorAll(".tabNext");
	for(var i = 0;i < tabNext.length;i++){
		var span = tabNext[i].querySelectorAll("span");
		for(var j = 0;j < span.length;j++){
			span[j].style.WebkitAnimation = span[j].style.animation = "move .3s "+(j*80)+"ms linear infinite alternate";
		}
	}

	for(var i = 0;i < tabNav.length;i++){
		css(tabList[i],"width",tabWrap[0].offsetWidth*tabNav[0].querySelectorAll("a").length + "px");
		for(var j = 0;j < tabList[i].children.length;j++){
			css(tabList[i].children[j],"width",tabWrap[0].offsetWidth + "px");
		}
	}

	for(var i = 0;i < tabNav.length;i++){
		swipe(tabNav[i],tabList[i]);
	}




	function swipe(nav,list){
		cssTra(list,"translateZ",0.01);
		cssTra(list,"translateX",-width);
		var startPoint = 0;
		var startX = 0;
		var isFirst = true;
		var isMove = true;
		var next = document.querySelectorAll(".tabNext");
		var isLoad = false;
		var navA = nav.getElementsByTagName('a');
		var navActive = nav.querySelector("span");
		var now = 0;



		for(var j = 0; j < navA.length; j++){
			var startPoint = 0;
			navA[j].addEventListener("touchstart",function (e){
				startPoint = {pageX: e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY};
			})
			navA[j].addEventListener("touchend",function (e){
				var nowPoint = {pageX: e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY};
				var disX = nowPoint.pageX - startPoint.pageX;
				var disY = nowPoint.pageY - startPoint.pageY;
				if(Math.abs(disX) < 3 && Math.abs(disY) < 3){
					list.style.transition = "none";
					for(var i = 0; i < next.length; i++){
						next[i].style.opacity = 1;
					}
					cssTra(navActive,"translateX",this.offsetLeft);
					cssTra(list,"translateX",0);
					now = Math.ceil(this.offsetLeft/navActive.offsetWidth);
					setTimeout(function (){
						cssTra(list,"translateX",-width);
						for(var i = 0; i < next.length; i++){
							next[i].style.opacity = 0;
						}
					},1500)
				}
			})
		}






		list.addEventListener("touchstart",function (e){
			if(isLoad){
				return;
			}
			list.style.transition = "none";
			startPoint = {pageX: e.changedTouches[0].pageX,pageY: e.changedTouches[0].pageY};
			startX = cssTra(list,"translateX");
			isMove = true;
			isFirst = true;
		});

		list.addEventListener("touchmove",function(e){
			if(isLoad){
				return;
			}
			if(!isMove){
				return;
			}
			var nowPoint = e.changedTouches[0];
			var disX = nowPoint.pageX - startPoint.pageX;
			var disY = nowPoint.pageY - startPoint.pageY;

			if(isFirst){
				isFirst = false;
				if(Math.abs(disY) > Math.abs(disX)){
					isMove = false;
				}
			}

			if(isMove){
				cssTra(list,"translateX",startX + disX);
			}

			if(Math.abs(disX) > width/2){
				end(disX);
			}
		});

		list.addEventListener("touchend",function (){
			if(isLoad){
				return;
			}
			list.style.transition = ".5s";
			cssTra(list,"translateX",-width);
		});

		function end(disX){
			isLoad = true;
			var dir = disX/Math.abs(disX);
			var target = dir > 0? 0: -2*width;
			now -= dir;
			if(now >= navA.length){
				now = 0;
			}
			if(now < 0){
				now = navA.length-1;
			}

			list.style.transition = ".3s";
			cssTra(list,"translateX",target);

			list.addEventListener("transitionend",tranEnd);
			list.addEventListener("WebkitTransitionEnd",tranEnd);
		};

		function tranEnd(){
			var left = navA[now].offsetLeft;
			cssTra(navActive,"translateX",left);

			list.removeEventListener("transitionend",tranEnd);
			list.removeEventListener("WebkitTransitionEnd",tranEnd);

			for(var i = 0;i < next.length;i++){
				next[i].style.opacity = 1;
			}

			setTimeout(function (){
				list.style.transition = "none";
				cssTra(list,"translateX",-width);
				isLoad = false;
				for(var i = 0;i < next.length;i++){
					next[i].style.opacity = 0;
				}
			},1500)
		}
	}
};
tab();



// 登录注册


function loRe(){
	var login = document.querySelector(".login");
	var regin = document.querySelector(".regin");
	var loginBtn = document.querySelector(".headerLogin");
	var reginBtn = document.querySelector(".headerReg");
	var loginS = login.querySelector("span");
	var reginS = regin.querySelector("span");
	var loginP = login.querySelector("P");
	var loginN = login.querySelector(".name");
	var loginB = login.querySelector(".submit");

	loginBtn.addEventListener("touchstart",function (){
		if(login.className == "login hide") {
			login.className = "login";
		} else {
			login.className = "login hide";
		}
	})
	reginBtn.addEventListener("touchstart",function (){
		if(regin.className == "regin hide") {
			regin.className = "regin";
		} else {
			regin.className = "regin hide";
		}
	})
	loginS.addEventListener("touchstart",function (){
		login.className = "login hide";
	})
	reginS.addEventListener("touchstart",function (){
		regin.className = "regin hide";
	})

	loginB.addEventListener("touchstart",function (){
		if(loginN.value != "wutao") {
			loginP.innerHTML = "用户名或密码错误";
		} else {
			loginP.innerHTML = "吴涛！你好！";
		}
	})

}
loRe();

