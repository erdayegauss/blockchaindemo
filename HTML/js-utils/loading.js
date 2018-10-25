jQuery.extend({
	pageloadingshow : function() {
		var top = $("#mask").height();
		var left = $("#mask").width();
		var top2 = $("#loading").height();
		var left2 = $("#loading").width();
		$("body").css("overflow","hidden");
		$("div#mask").css("z-index","1060").css("display", "block");
		$("div#loading").css("display", "block").css("top", (top - top2) / 2).css("left", (left - left2) / 2);
	},
	pageloadinghide : function() {
		$("body").css("overflow","auto");
		$("div#mask").css("display", "none");
		$("div#loading").css("display", "none")
	}
});