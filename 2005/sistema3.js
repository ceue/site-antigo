var contador
function init() {
	DynLayerInit()
	windowHeight = SW.h
	contentHeight = (is.ns)? SC.doc.height : SC.event.scrollHeight
	offsetHeight = contentHeight - windowHeight
	abaixo()
}

function rola_acima () {
	if (SC.y < 0) SC.moveBy(0,2)
}

function acima() {
	clearInterval(contador)
	contador=setInterval("rola_acima()",60)
}
  
function rola_abaixo() {
	if (SC.y > -offsetHeight){ 
	SC.moveBy(0,-2)
	if (SC.y <= -offsetHeight){
		SC.y = 0}
		}
}

function abaixo() {
	contador=setInterval("rola_abaixo()",100)
}

function para() {
	clearInterval(contador)
	init()
}

function parada() {
	clearInterval(contador)
}
