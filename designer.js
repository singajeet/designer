/******
 * Module: designer.js
 * Description: Provides api to build interactive visual language editor
 * Author: Ajeet Singh
 * Date: 25-Aug-2019
 * *****/

var Canvas = Class.create({
	id: '',
	container_id: undefined,
	height: undefined,
	width: undefined,
	css: 'canvas',
	instance: undefined,
	initialize: function(id, container_id, height, width){
		this.id = id;
		this.container_id = container_id;
		this.height = height;
		this.width = width;
		this.render();
	},
	render: function(){
		var html = "<div id='" + this.id + "' ";
		html += "class='" + this.css + "' ";
		if(this.height != undefined && this.width != undefined){
			html += "style='height:" + this.height;
			html += "; width:" + this.width + ";'  ";
		} else if(this.height != undefined && this.width === undefined){
			html += "style='height:" + this.height + ";' ";
		} else if(this.height === undefined && this.width != undefined){
			html += "style='width:" + this.width + ";' ";
		}
		html += "></div>";
		if(this.container_id === undefined){
			this.instance = $j('body').prepend(html);
		} else {
			var container = $j(this.container_id);
			this.instance = $j(html).appendTo($j(container));
		}
	}
});
