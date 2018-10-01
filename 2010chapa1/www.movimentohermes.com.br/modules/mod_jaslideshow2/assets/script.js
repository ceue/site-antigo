/*
# ------------------------------------------------------------------------
# JA Slideshow II module for Joomla 15
# ------------------------------------------------------------------------
# Copyright (C) 2004-2010 JoomlArt.com. All Rights Reserved.
# @license - PHP files are GNU/GPL V2. CSS / JS are Copyrighted Commercial,
# bound by Proprietary License of JoomlArt. For details on licensing, 
# Please Read Terms of Use at http://www.joomlart.com/terms_of_use.html.
# Author: JoomlArt.com
# Websites:  http://www.joomlart.com -  http://www.joomlancers.com
# Redistribution, Modification or Re-licensing of this file in part of full, 
# is bound by the License applied. 
# ------------------------------------------------------------------------
*/

Element.Events.extend({
	'wheelup': {
		type: Element.Events.mousewheel.type,
		map: function(event){
			event = new Event(event);
			if (event.wheel >= 0) this.fireEvent('wheelup', event)
		}
	},
	'wheeldown': {
		type: Element.Events.mousewheel.type,
		map: function(event){
			event = new Event(event);
			if (event.wheel <= 0) this.fireEvent('wheeldown', event)
		}
	}
});

var JASlideshowThree = new Class({
	initialize: function(options){
		this.options = $extend({
			buttons : {},
			interval:5000,
			handle_event: 'click',
			button_event: 'click',
			box: {},
			size: 240,
			mode: 'horizontal',
			items:[],
			handles:[],
			onWalk:{},
			handlerBox:null,
			animation: 'fade',
			animationRepeat: 'true',
			autoPlay: false,
			languageDirection:null
		}, options || {});
		
		this.items = this.options.items;
		if( this.options.languageDirection == 'rtl' ) {
			this.modes = {horizontal:['right','width'], vertical:['top','height']};
		}else {
			this.modes = {horizontal:['left','width'], vertical:['top','height']};
		}
		this.box = $(this.options.box);
		
		this.buttons = {previous: [], next: [], play: [], playback: [], stop: []};
		
		this.allbuttons = [];
		if(this.options.buttons){
			for(var action in this.options.buttons){
				this.addActionButtons(action, $type(this.options.buttons[action])=='array' ? this.options.buttons[action] : [this.options.buttons[action]]);
			}
		}
		this.handles = this.options.handles;
		if(this.handles){
			this.addHandleButtons(this.handles);
		}
		///
		if( this.options.handlerBox != null){
			this.options.handlerBox.addEvents({
				'wheelup': function(e) {
					
					e = new Event(e).stop(); 
						this.previous(true);
				}.bind(this),
			 
				'wheeldown': function(e) {
					e = new Event(e).stop();
				
					this.next(true);
				}.bind(this)
			} );
		}
		////
		//this.fx = new Fx.Style(this.box,this.modes[this.options.mode][0],this.options.fxOptions||{duration:500,wait:false});
		this.allbuttons.each (function (button){
			button.addEvent ('mouseover', function (){this.addClass ('hover');});
			button.addEvent ('mouseout', function (){this.removeClass ('hover');});
		});
		
		this.currentIndex = this.options.startItem || 0;
		this.previousIndex = null;
		this.nextIndex = null;
		this._auto = null;
		this.initFx();
		if(this.options.autoPlay) this.play(this.options.interval,'next',true);
		this.walk (this.currentIndex);
	},

	previous: function(manual){
		this.lastIndex = this.currentIndex;
		this.currentIndex += this.currentIndex>0 ? -1 : this.items.length-1;
		this.walk(null,manual);
	},

	next: function(manual){
		this.lastIndex = this.currentIndex;
		this.currentIndex += this.currentIndex<this.items.length-1 ? 1 : 1-this.items.length;
		this.walk(null,manual);
	},

	play: function(delay,direction,wait){
		this.stop();
		if(!wait){
			this[direction](false);
		}
		this._auto = this[direction].periodical(delay,this,false);
	},

	stop: function(){
		$clear(this._auto);
	},

	walk: function(item,manual){
		//alert(item + ' ' + manual);
		if($defined(item)){
			this.lastIndex = this.currentIndex;
			//if(item==this.currentIndex) return;
			this.currentIndex= parseInt(item);
		}
		this.previousIndex = this.currentIndex + (this.currentIndex>0 ? -1 : this.items.length-1);
		this.nextIndex = this.currentIndex + (this.currentIndex<this.items.length-1 ? 1 : 1-this.items.length);
		
		if(manual || (this.nextIndex == 0 && this.options.animationRepeat=='false')){ 
			this.stop();			
		}
		//this.fx.start(-this.currentIndex*this.options.size + this.options.offset);
		if(this.options.onWalk){ this.options.onWalk(this.currentIndex,(this.handles?this.handles[this.currentIndex]:null)); }
		this.animate();
		if(manual && this.options.autoPlay){ this.play(this.options.interval,'next',true); }
	},
	initFx: function () {
		if (this.options.animation.test (/move/)) {
			this.box.setStyle(this.modes[this.options.mode][1],(this.options.size*this.options.items.length+200)+'px');
			this.box.setStyle(this.modes[this.options.mode][0],(-this.currentIndex*this.options.size) + this.options.offset+'px');
			this.fx = new Fx.Style(this.box,this.modes[this.options.mode][0],this.options.fxOptions||{duration:500,wait:false});
			return;
		}
		this.items.setStyles({'position':'absolute', 'top':0, 'display':'none'});
		this.items.setStyle(this.modes[this.options.mode][0],0);
		this.items[this.currentIndex].setStyle ('display', 'block');
		if (this.options.animation.test (/fade/)) {
			for (var i=0;i<this.items.length;i++) {
				this.items[i].fx = new Fx.Style(this.items[i],'opacity',this.options.fxOptions||{duration:500,wait:false});
			}
		}
	},
	animate: function () {
		if (this.options.animation.test (/move/)) {
			this.fx.start(-this.currentIndex*this.options.size + this.options.offset);
			return;
		}
		var others = [];
		for (var i=0;i<this.items.length;i++) {
			this.items[i].fx.stop();
			if (i!=this.currentIndex && i!= this.lastIndex) others.push (this.items[i]);
		}
		this.currentIndex = parseInt(this.currentIndex);
		$$(others).setStyle ('display', 'none');
		if (this.lastIndex == this.currentIndex) {
			this.items[this.currentIndex].setStyles ({'display':'block', 'opacity': 1});
		} else {
			this.items[this.currentIndex].setStyles ({'display':'block', 'opacity': 0, 'z-index': 10});
			this.items[this.lastIndex].setStyles ({'z-index': 9});
		}
		if (this.options.animation.test (/fade/)) {
			this.items[this.lastIndex].fx.start(0);
			this.items[this.currentIndex].fx.start(1);
			return;
		}
	},
	
	addHandleButtons: function(handles){
		for(var i=0;i<handles.length;i++){
			handles[i].addEvent(this.options.handle_event,this.walk.bind(this,[i,true]));
			this.allbuttons.push (handles[i]);
		}
		//handles.addEvent(this.options.handle_event, function(){this.blur();});
	},

	addActionButtons: function(action,buttons){
		for(var i=0; i<buttons.length; i++){
			switch(action){
				case 'previous': buttons[i].addEvent(this.options.button_event,this.previous.bind(this,true)); break;
				case 'next': buttons[i].addEvent(this.options.button_event,this.next.bind(this,true)); break;
				case 'play': buttons[i].addEvent(this.options.button_event,this.play.bind(this,[this.options.interval,'next',false])); break;
				case 'playback': buttons[i].addEvent(this.options.button_event,this.play.bind(this,[this.options.interval,'previous',false])); break;
				case 'stop': buttons[i].addEvent(this.options.button_event,this.stop.bind(this)); break;
			}
			this.buttons[action].push(buttons[i]);
			buttons[i].addEvent(this.options.button_event, function(){this.blur();});
			this.allbuttons.push (buttons[i]);
		}
	}
	
});
///

var JASlideshow2 = new Class({	
	initialize: function(element, options) {
		this.options = $extend({
			startItem: 0,
			showItem: 4,
			mainWidth: 360,
			mainHeight: 240,
			itemWidth: 160,
			itemHeight: 160,
			duration: 400,
			interval: 5000,
			transition: Fx.Transitions.Back.easeOut,
			thumbOpacity:'0.8',			
			maskDesc : 'maskDesc',
			maskWidth:360,
			maskHeigth:50,
			but_prev:'ja-slide-prev',
			but_next: 'ja-slide-next',
			maskOpacity: '0.8',
			buttonOpacity: '0.4',
			overlap: 1,
			navigation: '',
			animation: 'fade',
			animationRepeat: 'true',
			thumbSpaces: [3,3],
			autoPlay: false,
			maskAlignment:'bottom',
			showbtncontrol:false,
			urls:'',
			maskerTransStyle:'opacity',
			maskerTrans:Fx.Transitions.linear,
			navePos:'horizontal',
			languageDirection:null
			
		}, options || {});
		
		if (!this.options.animation.test(/move/)) this.options.overlap = 0;
		
		this.el = $(element);
		this.fxOptions = {duration:this.options.duration, transition:this.options.transition, wait: false}
		
		this.elmain = this.el.getElement('.ja-slide-main-wrap');
		var conWidth = this.options.overlap?'100%':this.options.mainWidth;
		this.elmain.setStyles ({'width':conWidth, 'height':this.options.mainHeight});
		this.els = this.el.getElements('.ja-slide-item');
		this.els.setStyles ({'width':this.options.mainWidth, 'height':this.options.mainHeight});
		this.options.rearWidth = 0;
		this.options.mainSpace = 0;
		
		if ( this.options.overlap ) { 
			this.options.mainSpace = 10; 
			this.options.rearWidth = Math.ceil((this.elmain.offsetWidth - this.options.mainWidth)/2) - this.options.mainSpace;

			this.but_prev = this.el.getElement('.'+this.options.but_prev);
			this.but_next = this.el.getElement('.'+this.options.but_next);
	
				this.but_prev.setStyles({'opacity': this.options.buttonOpacity, 'width': this.options.rearWidth, 'height': this.options.mainHeight});
			this.but_next.setStyles({'opacity': this.options.buttonOpacity, 'width': this.options.rearWidth, 'height': this.options.mainHeight});
			
			this.but_prev.addEvents ({
				'mouseover': function (){this.but_prev.setStyle('opacity', this.options.buttonOpacity/2);}.bind(this),
				'mouseout': function (){this.but_prev.setStyle('opacity', this.options.buttonOpacity);}.bind(this)
			});
			
			this.but_next.addEvents ({
				'mouseenter': function (){this.but_next.setStyle('opacity', this.options.buttonOpacity/2);}.bind(this),
				'mouseleave': function (){this.but_next.setStyle('opacity', this.options.buttonOpacity);}.bind(this)
			});
			this.els.setStyle ('margin-right', this.options.mainSpace);
		}
		
		/*Need to be fixed to work with moving up/down*/
		var navWrap= this.el.getElement('.ja-slide-thumbs-wrap');		
		if( this.options.navigation && navWrap != null ){
		// for hori

			if( this.options.languageDirection == 'rtl' ){
				var modes = {horizontal:['right','width'], vertical_left:['top','height'],vertical_right:['top','height']};
			} else {
				var modes = {horizontal:['left','width'], vertical_left:['top','height'],vertical_right:['top','height']};	
			}
			if( this.options.navePos == 'vertical_left' || this.options.navePos == 'vertical_right' ){	
				navWrap.setStyles ({'width':this.options.itemWidth, 'height':this.options.itemHeight*this.options.showItem});
			
			} else {
				navWrap.setStyles ({'width':this.options.itemWidth*this.options.showItem, 'height':this.options.itemHeight});
			}
			var thumbs_thumbs 	= this.el.getElement('.ja-slide-thumbs');
			thumbs_thumbs.setStyle('left',0);
			thumbs_thumbs.getChildren().setStyles ({'width':this.options.itemWidth, 'height':this.options.itemHeight});
			var thumbs_handles 	= this.el.getElement('.ja-slide-thumbs-handles');
			thumbs_handles.setStyle('left',0);
			thumbs_handles.getChildren().setStyles ({'width':this.options.itemWidth, 'height':this.options.itemHeight});
			
			var thumbsFx_thumbs = new Fx.Style(thumbs_thumbs,modes[this.options.navePos][0],this.fxOptions);			
			var thumbsFx_handles= new Fx.Style(thumbs_handles,modes[this.options.navePos][0],this.fxOptions);

			this.el.getElement('.ja-slide-thumbs-mask-left').setStyles ({'height':this.options.itemHeight,'width':2000,'opacity':this.options.thumbOpacity});
			this.el.getElement('.ja-slide-thumbs-mask-right').setStyles ({'height':this.options.itemHeight,'width':2000,'opacity':this.options.thumbOpacity});
			this.el.getElement('.ja-slide-thumbs-mask-center').setStyles ({'height':this.options.itemHeight,'width':this.options.itemWidth,'opacity':this.options.thumbOpacity});
			var tmp = this.el.getElement('.ja-slide-thumbs-mask');
			var thumbs_mask = tmp.setStyles ( {'width':5000} );
			
			tmp.setStyle(modes[this.options.navePos][0], this.options.startItem*this.options.itemHeight-2000 );
			
			//var thumbs_mask 	= this.el.getElement('.ja-slide-thumbs-mask').setStyle('left',(this.options.startItem*this.options.itemWidth-this.options.maskPos)+'px').setOpacity(this.options.thumbOpacity);	

			var thumbsFx_mask 	= new Fx.Style(thumbs_mask, modes[this.options.navePos][0],this.fxOptions);

		}
		// templ
		var navItems=this.el.getElements ('.ja-slide-thumb'); 
		//When slideshow animate
		this.onWalk = function (currentIndex, hander ) {
			if (this.options.navigation && thumbsFx_mask !=null ) {
				if (currentIndex <= this.options.startItem || currentIndex - this.options.startItem >= this.options.showItem-1) {
					this.options.startItem = currentIndex - this.options.showItem+2;
					if (this.options.startItem < 0) this.options.startItem = 0;
					if (this.options.startItem > this.els.length-this.options.showItem) this.options.startItem = this.els.length-this.options.showItem;
				}
				thumbsFx_mask.start((currentIndex - this.options.startItem)*this.options.itemHeight-2000);
				thumbsFx_thumbs.start(-this.options.startItem*this.options.itemHeight);
				thumbsFx_handles.start(-this.options.startItem*this.options.itemHeight);
				
				if( $defined(hander) ){
					thumbs_handles.getElements('span').removeClass ('active');
					hander.addClass('active');
					navItems.removeClass ('active');
					navItems[currentIndex].addClass ('active');
				}
				
			}
			if (this.options.descMode.test(/load/) && this.options.showDesc  ){
				this.hideDesc();
			}
		}
		
		//Description
		this.maskDesc = this.el.getElement ('.'+this.options.maskDesc);
		
		this.maskDesc.setStyles ({ 'display':'block',
								   'position':'absolute',
									'width': this.options.maskWidth,
									'height': this.options.maskHeigth
								});
		
	
		
		if ( this.options.showDesc ) {
			if (this.options.animation.test (/move/) && this.options.overlap ) {
				this.options.maskAlignment = 'left';
				this.options.maskerTransStyle = 'opacity';
			}
			this.maskDesc.setStyle( this.options.maskAlignment, this.options.rearWidth+this.options.mainSpace );
			this.maskDesc.setStyle( 'opacity', 0 );
			if(  this.options.maskerTransStyle == 'opacity' ){
				
				this.descFx = new Fx.Style (this.maskDesc, 'opacity',{duration:400,transition:this.options.maskerTrans});
				
				this.descs = this.el.getElements ('.ja-slide-desc');
				this.showDesc = function() {
					this.descFx.stop();
					this.descFx.start(this.options.maskOpacity);
				};
				this.hideDesc = function () {
					this.descFx.stop();
					this.descFx.start(0.01);
					
				};
			} else {
			
				sizeOff = this.options.maskAlignment == 'top' || this.options.maskAlignment=='bottom'?this.options.maskHeigth : this.options.maskWidth;

				this.maskDesc.setStyle( 'opacity', this.options.maskOpacity );
				this.maskDesc.setStyle( this.options.maskAlignment, -this.options.mainWidth );
				this.descFx = new Fx.Style (this.maskDesc, this.options.maskAlignment,{duration:400,transition:this.options.maskerTrans});
				this.descs = this.el.getElements ('.ja-slide-desc');
				this.showDesc = function() { 
					this.descFx.stop();
					this.descFx.start( 0 );
				};
				this.hideDesc = function () {
					this.descFx.stop();
					this.descFx.start( -sizeOff );
					
				};				
			}
			
			this.swapDesc = function (currentIndex) {
			//console.log('swap '+currentIndex);
				if (this.maskDesc.currentIndex == currentIndex) return;
				if (this.maskDesc.desc) {
					this.maskDesc.desc.remove();
					this.maskDesc.desc = null;
					if( !$defined(this.maskDesc.getElement('.inner .readon')) ){
						this.maskDesc.setHTML('');
					}
				}
				if (this.descs[currentIndex] && this.descs[currentIndex].innerHTML) this.maskDesc.desc = this.descs[currentIndex].inject (this.maskDesc);
				this.maskDesc.currentIndex = currentIndex;
			}
			
			if (this.options.descMode.test(/mouseover/)){
				var childs = this.el.getElements('.ja-slide-item');
					childs.each( function(itm, index){
					itm.addEvent ('mouseover', this.showDesc.bind(this) );
					itm.addEvent ('mouseout', this.hideDesc.bind(this));
				}.bind(this) )
				this.maskDesc.addEvent ('mouseover', this.showDesc.bind(this) );
				this.maskDesc.addEvent ('mouseout', this.hideDesc.bind(this));
			} else {
				this.maskDesc.setStyle ('opacity', this.options.maskOpacity);
			}
		} else {
			this.maskDesc.setStyle ('opacity', 0 );
		}
		this.fxOptions.onComplete = function() {
			if (this.options.showDesc) {
				this.swapDesc(this.hs.currentIndex);
				if (this.options.descMode.test(/load/)){
					this.showDesc();
				}
			}
		}.bind(this);
		
		
		if (this.options.urls) {
			this.maskDesc.addEvent('click', function () {
				// URL
				var url = this.options.urls[this.hs.currentIndex];
				if (url) {
					var target = this.options.targets[this.hs.currentIndex];
					switch(target){
						case "_blank":{
							window.open(url, "newWindow");
							break;	
						}
						default:{							
							window.location.href = url;
							break;	
						}
					}					
				}
				// Target of URL
				
			}.bind(this));
		}


		this.hs = new JASlideshowThree({
			box: this.el.getElement('.ja-slide-main'),	
			languageDirection:this.options.languageDirection,
			items: this.els,
			handlerBox:thumbs_handles,
			handles: thumbs_handles?thumbs_handles.getChildren():[],
			fxOptions: this.fxOptions,
			interval: this.options.interval,
			onWalk: this.onWalk.bind(this),
			size: this.options.mainWidth + this.options.mainSpace,
			animation: this.options.animation,
			animationRepeat: this.options.animationRepeat,
			buttons: {
				previous: this.el.getElements('.ja-slide-prev'),
				play: this.el.getElements('.ja-slide-play'),
				stop: this.el.getElements('.ja-slide-stop'),
				playback: this.el.getElements('.ja-slide-playback'),
				next: this.el.getElements('.ja-slide-next')
			},
			startItem: this.options.startItem,
			offset: this.options.overlap?this.options.rearWidth-this.options.mainWidth:0,
			autoPlay: this.options.autoPlay
		});
	
		//Case xxxx
		if(this.options.overlap){
				var childs = this.hs.box.getChildren();
			childs[0].clone().inject(this.hs.box);
			childs[this.hs.items.length-1].clone().injectTop(this.hs.box);
			this.hs.box.setStyle(this.hs.modes[this.hs.options.mode][1],(this.hs.options.size*(this.hs.items.length+2)+200)+'px');			
		} 
		this.el.setStyle('visibility', 'visible');
	},
	
	getFxObjectByMode: function( mode, start, end ){
	
		switch( mode ){
			case 'sideright' : return { 'left': [start, -end] } ; break;
			case 'sideleft'  : return { 'left': [start, end]  } ; break;	
			case 'sidetop'   : return { 'top':  [start, end]   } ; break;
			case 'sidedown'  : return { 'top':  [start, -end]  } ;  break;	
			case 'botleft' : return	  { 'top': start , 'left': end  } ;  break;	
			default: return { 'height': [start, end] };		break;		
		}
	},
	controlMark:function(){
		
	}
});