// MiniScroll Object
// gives controls to a set of 2 layers for scrolling
// 19990410

// Copyright (C) 1999 Dan Steinman
// Distributed under the terms of the GNU Library General Public License
// Available at http://www.dansteinman.com/dynapi/

function MiniScroll(window,content) {
	this.window = window
	this.content = content
	this.inc = 8
	this.speed = 20
	this.contentHeight = (is.ns)? this.content.doc.height : this.content.elm.scrollHeight
	this.contentWidth = (is.ns)? this.content.doc.width : this.content.elm.scrollWidth
	this.up = MiniScrollUp
	this.down = MiniScrollDown
	this.left = MiniScrollLeft
	this.right = MiniScrollRight
	this.stop = MiniScrollStop
	this.activate = MiniScrollActivate
	this.activate(this.contentWidth,this.contentHeight)
}
function MiniScrollActivate() {
	this.offsetHeight = this.contentHeight-this.window.h
	this.offsetWidth = this.contentWidth-this.window.w
	this.enableVScroll = (this.offsetHeight>0)
	this.enableHScroll = (this.offsetWidth>0)
}
function MiniScrollUp() {
	if (this.enableVScroll) this.content.slideTo(null,0,this.inc,this.speed)
}
function MiniScrollDown() {
	if (this.enableVScroll) this.content.slideTo(null,-this.offsetHeight,this.inc,this.speed)
}
function MiniScrollLeft() {
	if (this.enableHScroll) this.content.slideTo(0,null,this.inc,this.speed)
}
function MiniScrollRight() {
	if (this.enableHScroll) this.content.slideTo(-this.offsetWidth,null,this.inc,this.speed)
}
function MiniScrollStop() {
	this.content.slideActive = false
}
