/****************************************************************************
**
** Copyright (C) 2005-2008 Intuisphere. All rights reserved.
**
** This file is provided AS IS with NO WARRANTY OF ANY KIND, INCLUDING THE
** WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
**
****************************************************************************/

function BrowserDetect_browser()
{
	return BrowserDetect.browser;
}

function BrowserDetect_OS()
{
	return BrowserDetect.OS;
}
function BrowserDetect_version()
{
	return BrowserDetect.version;
}

function is_get_flash_anim()
{
	return getElementByKey("flashanimpage");
}

function IsNumeric(sText)
{
   var ValidChars = "0123456789.";
   var IsNumber=true;
   var Char;

 
   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
         }
      }
   return IsNumber;
   
   }

function callFlashFunction(method_name,args)
{
	
	if (BrowserDetect_browser()=="Explorer")
	{
		var s_arg="<arguments>";
		for (k in args)
		{
			var v = args[k]

			//alert(v)
			if (IsNumeric(""+v))
			{
				s_arg+="<number>"+v+"</number>";
			}		
			else
			{
				s_arg+="<string>"+v+"</string>";	
			}	
		}	
		s_arg+="</arguments>";
		try
		{
			return is_get_flash_anim().CallFunction("<invoke name='"+method_name+"' returntype='javascript'>"+s_arg+"</invoke>")	
		}
		catch (err)
		{
			
		}
		return null;
	}
	var s_arg="";
	for (k in args)
	{
		var v = args[k]
		if (k>0)
		{
			s_arg+=","
		}
		s_arg+=""+v;
	}
	try
	{
		return eval("is_get_flash_anim()."+method_name+"("+s_arg+")");
	}
	catch (err)
	{
		
	}	
	return null;
	
}
	
	
function is_onscroll()
{
	callFlashFunction("scrollFlashPage",[getWindowScrollX(),getWindowScrollY()])
}


function is_set_visibility_html(b)
{
	var v_html_layer=getElementByKey('is-global-layer');
	for (var i=0;i<v_html_layer.childNodes.length;i++)
	{
		var node = v_html_layer.childNodes[i]
		if (node.getAttribute)
		{
			var id = node.getAttribute('id');
			if (id != null)
			{
				if (id.substr(0,5)=="html-" )
				{
					if (b)
					{
						node.style.display="block";

					}
					else
					{
						node.style.display="none";

					}					
				}
			}
		}	
	}
	
}



function is_get_key_event(e)
{
	var keynum;
	var keychar;
	var numcheck;
	if(window.event) // IE
	  {
	  keynum = e.keyCode;
	  }
	else if(e.which) // Netscape/Firefox/Opera
	  {
	  keynum = e.which;
	  }	
	return keynum;
}

function is_ondblclick(event)
{
	callFlashFunction("onEventMouseDblClic")
}

function is_onmousewheel(event){
	

	var delta = 0;
	if (!event) event = window.event;
	if (event.wheelDelta) {
		delta = event.wheelDelta/120; 
		if (window.opera) delta = -delta;
	} else if (event.detail) {
		delta = -event.detail/3;
	}
	
	
	var b_default =false;
	if (delta)
	{
		
		if (is_get_flash_anim())
		if (is_get_flash_anim().onEventMouseWheel)
		{
			var res = callFlashFunction("onEventMouseWheel",[delta]);
			if (res==true)
			{
				b_default = true;
			}
			//alert(res)	
		}		
	}
	
	if (b_default)
    if (event.preventDefault)
           event.preventDefault();		
	
	event.returnValue = !b_default;
}

/* Initialization code. */
if (window.addEventListener)
	window.addEventListener('DOMMouseScroll', is_onmousewheel, false);
window.onmousewheel = document.onmousewheel = is_onmousewheel;


function is_onkeydown(e)
{
	var keynum = is_get_key_event(e)
	if ((keynum==37)||(keynum==38)||(keynum==39)||(keynum==40))
	{
		if (is_get_flash_anim())
		if (is_get_flash_anim().onEventKeyDown)
		{
			callFlashFunction("onEventKeyDown",[keynum])
		}
		
	}
	return true;
}	

function is_onkeypress(e)
{
	var keynum = is_get_key_event(e)
	callFlashFunction("onEventKeyDown",[keynum])
	return true;
}


function is_onresize()
{
	var lx_page=document.webaca_width_page;
	var ly_page=document.webaca_height_page;
	var v_layer=getElementByKey('global-flash-page');
	var v_html_layer=getElementByKey('is-global-layer');

	var lx_window=getWindowWidth()
	var ly_window=getWindowHeight()	

//v_layer.style.width = "100%";	


	if (ly_window>ly_page)
	{
		v_layer.style.height = "100%";	
	}
	else
	{
		v_layer.style.height = (ly_page+10)+ "px";	
	}		

	var lx_flash = lx_page;
	if (lx_flash<lx_window)lx_flash=lx_window;
	if (is_get_flash_anim())
	is_get_flash_anim().style.width = lx_flash+"px";
	
	//alert("is_onresize");
	
	var flash_anim_height = "100%";
	if (ly_window>ly_page)
	{
		flash_anim_height = "100%";	

	}
	else
	{
		flash_anim_height = (ly_page+10)+ "px";	
	}
	if (is_get_flash_anim())
	if (flash_anim_height != (""+is_get_flash_anim().style.height))
	{
		is_get_flash_anim().style.height = flash_anim_height
	}	

	is_set_visibility_html(document.m_fullpage_resizing_policy!=true);
	
	if (document.webaca_page_is_centered)
	{
		var bg_offsetX = 0;
		var bg_offsetY =document.webaca_banner_height;

		if (lx_window>lx_page)bg_offsetX=(lx_window-lx_page)/2;
		
		document.body.style.backgroundPosition=bg_offsetX+"px "+bg_offsetY+"px";
  }
 
	callFlashFunction("onEventResize");
}


function IsEnableFullView(b)
{
	document.m_fullpage_resizing_policy = b;
	is_set_visibility_html(document.m_fullpage_resizing_policy!=true);
//	is_onresize();
}

///////

function getScrollXY() 
{
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if( document.documentElement &&
      ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [ eval(""+scrOfX), eval(""+scrOfY) ];
}

function qMin(a,b) 
{
	return (a>b)?b:a;
}
function qMax(a,b) 
{
	return (a<b)?b:a;
}


function getWindowWidth() 
{

	var myWidth = 0;
	if( document.body && ( document.body.clientWidth) ) 
	{
	//IE 4 compatible
	myWidth = document.body.clientWidth;
	}
	else
	if( document.documentElement && (document.documentElement.clientWidth) ) 
	{
	//IE 6+ in 'standards compliant mode'
	myWidth = document.documentElement.clientWidth;
	} 
	else
	if( typeof( window.innerWidth ) == 'number' ) 
	{
	//Non-IE
	myWidth = window.innerWidth;
	} 
	
	return myWidth;
	
}

function getWindowHeight() 
{
 var windowHeight=0;
    if (typeof(window.innerHeight)=='number') {
        windowHeight=window.innerHeight;
    }
    else {
     if (document.documentElement&&
       document.documentElement.clientHeight) {
         windowHeight = document.documentElement.clientHeight;
    }
    else {
     if (document.body&&document.body.clientHeight) {
         windowHeight=document.body.clientHeight;
      }
     }
    }
    return windowHeight;	

}

function getWindowScrollX() 
{
	var array = getScrollXY() ;
	return array[0];
}

function getWindowScrollY() 
{
	var array = getScrollXY() ;
	return array[1];
}

function IS_submitPagePassword(pwd,error_msg)
{
	if (IS_MD5("#"+document.forms['is-password-form'].is_page_password.value+"#")==pwd)
	{
		IS_successPagePassword(pwd);
	}
	else
	{
		IS_writeLayer(getElementByKey("is-password-form-layer-label"),error_msg);	
		document.forms['is-password-form'].is_page_password.focus();
	}
	return false;
}



function IS_successPagePassword(pwd)
{
	var l0 =getElementByKey("is-global-layer");
	l0.style.display="block"
	displayElement(l0,true);
	
	
	var l2 = null
	if (document.webaca_page_is_centered)
	{
		l2 = getElementByKey("global-flash-page-centered");
		l2.style.display="block"
		displayElement(l2,true);	
	}

	
	if (l0)
	{
		l0 = getElementByKey("global-flash-page");
		l0.style.display="block"
		displayElement(l0,true);		
	}

	
	
	var l =getElementByKey("is-password-form-layer");
	displayElement(l,false);
	l.style.display="none";
	IS_SetCookie("cariboost-password",pwd);
	//IS_put_main_flash_animation();
	IS_onload();
}

function IS_checkPagePassword(pwd)
{
	if (IS_GetCookie('cariboost-password')==pwd)
	{
		IS_successPagePassword(pwd);
		return true;
	}
	else
	{
		displayElement(getElementByKey("is-password-form-layer"),true);
		document.forms['is-password-form'].is_page_password.focus();
	}
	return false;
}

function IS_keypressPagePassword(event,pwd,error_msg)
{

	if ((event.keyCode==13) || (event.keyCode==3))
	{
	//	alert(event.keyCode)
		return IS_submitPagePassword(pwd,error_msg);
	}
	
	return(event.keyCode);
}

function IS_SetCookie (name, value) {
	var argv=IS_SetCookie.arguments;
	var argc=IS_SetCookie.arguments.length;
	var expires=(argc > 2) ? argv[2] : null;
	var path=(argc > 3) ? argv[3] : null;
	var domain=(argc > 4) ? argv[4] : null;
	var secure=(argc > 5) ? argv[5] : false;
	document.cookie=name+"="+escape(value)+
		((expires==null) ? "" : ("; expires="+expires.toGMTString()))+
		((path==null) ? "" : ("; path="+path))+
		((domain==null) ? "" : ("; domain="+domain))+
		((secure==true) ? "; secure" : "");
}

function getCookieVal(offset) {
	var endstr=document.cookie.indexOf (";", offset);
	if (endstr==-1)
      		endstr=document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}



function IS_GetCookie (name) 
{	
	var arg=name+"=";
	var alen=arg.length;
	var clen=document.cookie.length;
	var i=0;
	while (i<clen) 
	{
		var j=i+alen;
		if (document.cookie.substring(i, j)==arg)
                        return getCookieVal (j);
                i=document.cookie.indexOf(" ",i)+1;
                        if (i==0) break;
    }
	return "";
}


function IS_CookiesEnabled() 
{
    document.cookie = "is-test=cookiesEnabled";
    var pos = document.cookie.indexOf( "is-test=" );
    if( pos == -1 )
    {
        return false;
    }
    return true;
}

function IS_RemoveCookie(nom)
{
date=new Date;
date.setFullYear(date.getFullYear()-1);
IS_SetCookie(nom,null,date);
}


function IS_QueryString()
{
	return ""+location.search;
}


function stringStartsWidth (s,startStr) 
{
	if (s.substring(0,startStr.length)==startStr)
	{
		return true;
	}
	return false;
}


function trimString(str)
{
   return str.replace(/^\s*|\s*$/g,"");
}

function IS_writeLayer(l,txt)
{
	if (l)
	{
		if (document.layers) 
		{
			
		l.document.open()
		l.document.write(txt)
		l.document.close()
		}
		else
		{
			l.innerHTML = '';
			l.innerHTML = txt
		}	
	}
	
}

function getElementByKey(str)
{
	if (document.all)
	{
		// IE code
		return document.all[str];
	}
	else 
	if(document.layers)
	{
		// NN4.x code
		return document.getElementById(str);	
	}
	if (document.getElementById) 
	{
		return document.getElementById(str);	
	}
}

function displayElement(o,state)
{
	if (o)
	{
		o.style.visibility=(state)?"visible":"hidden";	
		
	}
}

function extractNum(st)
{
	var len  = st.length
	if ((len>0)&&(st.substring(len-2,len)=="px"))
	{
		return eval(st.substring(0,len-2))
	}
	return 0;

}

function getPositionX(o)
{
	if (o)
	{
		return extractNum(o.style.left);
	}
	return 0;
}

function getPositionY(o)
{
	if (o)
	{	
	return extractNum(o.style.top);
	}
	return 0;	
}

function getWidth(o)
{
	if (o)
	{	
	return extractNum(o.style.width);
	}
	return 0;	
}

function getHeight(o)
{
	if (o)
	{	
	return extractNum(o.style.height);
	}
	return 0;	
}

function setSize(o,lx,ly)
{
	if (o)
	{	
		o.style.width = ""+lx+"px";
		o.style.height = ""+ly+"px";
	}	
}

function moveElement(o,x,y)
{
	if (o)
	{
		o.style.left = ""+x+"px";
		o.style.top = ""+y+"px"
	}
}

function getZindex(o)
{
	if (o)
	{	
		return o.style.zIndex;
	}
	return -1;	
}

function setZindex(o,index)
{
	if (o)
	{	
		o.style.zIndex = index;
	}
}

function isDefined(v) 
{ 
	var undef;
	return v!=undef;
}

function IS_blockRightClick()
{
	if (window.Event && document.captureEvents) 
	document.captureEvents(Event.MOUSEUP); 
	
	function nocontextmenu() 
	{ 
		event.cancelBubble = true 
		event.returnValue = false; 
		return false; 
	} 
	
	function IS_blockIEContextMenu_fct()
	{
		return false;
	}
	
	function norightclick(e) 
	{ 
		if (window.Event && e && e.which) 
		{ 
			if (e.which == 2 || e.which == 3) 
			return false; 
		} 
		else 
		if (event.button == 2 || event.button == 3) 
		{ 
			event.cancelBubble = true 
			event.returnValue = false; 
			return false; 
		} 
	} 
	
	window.oncontextmenu=IS_blockIEContextMenu_fct
	document.oncontextmenu = nocontextmenu; 
	document.onmousedown = norightclick; 
}

function PreloadImg(s)
{
	var img=new Image();
	img.src=s;
}

/* SWFObject v1.5 <http://code.google.com/p/swfobject/>
	Copyright (c) 2007-2008 Geoff Stearns, Michael Williams, and Bobby van der Sluis
	This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/

if(typeof deconcept=="undefined"){var deconcept=new Object();}if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){if(!document.getElementById){return;}this.DETECT_KEY=_a?_a:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(_1){this.setAttribute("swf",_1);}if(id){this.setAttribute("id",id);}if(w){this.setAttribute("width",w);}if(h){this.setAttribute("height",h);}if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){deconcept.SWFObject.doPrepUnload=true;}if(c){this.addParam("bgcolor",c);}var q=_7?_7:"high";this.addParam("quality",q);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var _c=(_8)?_8:window.location;this.setAttribute("xiRedirectUrl",_c);this.setAttribute("redirectUrl","");if(_9){this.setAttribute("redirectUrl",_9);}};deconcept.SWFObject.prototype={useExpressInstall:function(_d){this.xiSWFPath=!_d?"expressinstall.swf":_d;this.setAttribute("useExpressInstall",true);},setAttribute:function(_e,_f){this.attributes[_e]=_f;},getAttribute:function(_10){return this.attributes[_10];},addParam:function(_11,_12){this.params[_11]=_12;},getParams:function(){return this.params;},addVariable:function(_13,_14){this.variables[_13]=_14;},getVariable:function(_15){return this.variables[_15];},getVariables:function(){return this.variables;},getVariablePairs:function(){var _16=new Array();var key;var _18=this.getVariables();for(key in _18){_16[_16.length]=key+"="+_18[key];}return _16;},getSWFHTML:function(){var _19="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath);}_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"";_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";var _1a=this.getParams();for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}var _1c=this.getVariablePairs().join("&");if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath);}_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\">";_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";var _1d=this.getParams();for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}var _1f=this.getVariablePairs().join("&");if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}return _19;},write:function(_20){if(this.getAttribute("useExpressInstall")){var _21=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title);}}if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){var n=(typeof _20=="string")?document.getElementById(_20):_20;n.innerHTML=this.getSWFHTML();return true;}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}return false;}};deconcept.SWFObjectUtil.getPlayerVersion=function(){var _23=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else{if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){var axo=1;var _26=3;while(axo){try{_26++;axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);_23=new deconcept.PlayerVersion([_26,0,0]);}catch(e){axo=null;}}}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}}return _23;};deconcept.PlayerVersion=function(_29){this.major=_29[0]!=null?parseInt(_29[0]):0;this.minor=_29[1]!=null?parseInt(_29[1]):0;this.rev=_29[2]!=null?parseInt(_29[2]):0;};deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major){return false;}if(this.major>fv.major){return true;}if(this.minor<fv.minor){return false;}if(this.minor>fv.minor){return true;}if(this.rev<fv.rev){return false;}return true;};deconcept.util={getRequestParameter:function(_2b){var q=document.location.search||document.location.hash;if(_2b==null){return q;}if(q){var _2d=q.substring(1).split("&");for(var i=0;i<_2d.length;i++){if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){return _2d[i].substring((_2d[i].indexOf("=")+1));}}}return "";}};deconcept.SWFObjectUtil.cleanupSWFs=function(){var _2f=document.getElementsByTagName("OBJECT");for(var i=_2f.length-1;i>=0;i--){_2f[i].style.display="none";for(var x in _2f[i]){if(typeof _2f[i][x]=="function"){_2f[i][x]=function(){};}}}};if(deconcept.SWFObject.doPrepUnload){if(!deconcept.unloadSet){deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs);};window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true;}}if(!document.getElementById&&document.all){document.getElementById=function(id){return document.all[id];};}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;
	
/*
 *  md5.js 1.0b 27/06/96
 * Javascript implementation of the RSA Data Security, Inc. MD5
 * Message-Digest Algorithm.
 * Copyright (c) 1996 Henri Torgemane. All Rights Reserved.
 */

function md5_array(n) {
  for(i=0;i<n;i++) this[i]=0;
  this.length=n;
}

function md5_integer(n) { return n%(0xffffffff+1); }

function shr(a,b) {
  a=md5_integer(a);
  b=md5_integer(b);
  if (a-0x80000000>=0) {
    a=a%0x80000000;
    a>>=b;
    a+=0x40000000>>(b-1);
  } else
    a>>=b;
  return a;
}

function shl1(a) {
  a=a%0x80000000;
  if (a&0x40000000==0x40000000)
  {
    a-=0x40000000;
    a*=2;
    a+=0x80000000;
  } else
    a*=2;
  return a;
}

function shl(a,b) {
  a=md5_integer(a);
  b=md5_integer(b);
  for (var i=0;i<b;i++) a=shl1(a);
  return a;
}

function and(a,b) {
  a=md5_integer(a);
  b=md5_integer(b);
  var t1=(a-0x80000000);
  var t2=(b-0x80000000);
  if (t1>=0)
    if (t2>=0)
      return ((t1&t2)+0x80000000);
    else
      return (t1&b);
  else
    if (t2>=0)
      return (a&t2);
    else
      return (a&b);
}

function or(a,b) {
  a=md5_integer(a);
  b=md5_integer(b);
  var t1=(a-0x80000000);
  var t2=(b-0x80000000);
  if (t1>=0)
    if (t2>=0)
      return ((t1|t2)+0x80000000);
    else
      return ((t1|b)+0x80000000);
  else
    if (t2>=0)
      return ((a|t2)+0x80000000);
    else
      return (a|b);
}

function xor(a,b) {
  a=md5_integer(a);
  b=md5_integer(b);
  var t1=(a-0x80000000);
  var t2=(b-0x80000000);
  if (t1>=0)
    if (t2>=0)
      return (t1^t2);
    else
      return ((t1^b)+0x80000000);
  else
    if (t2>=0)
      return ((a^t2)+0x80000000);
    else
      return (a^b);
}

function not(a) {
  a=md5_integer(a);
  return (0xffffffff-a);
}

/* Début de l'algorithme */

    var state = new md5_array(4);
    var count = new md5_array(2);
        count[0] = 0;
        count[1] = 0;
    var buffer = new md5_array(64);
    var transformBuffer = new md5_array(16);
    var digestBits = new md5_array(16);

    var S11 = 7;
    var S12 = 12;
    var S13 = 17;
    var S14 = 22;
    var S21 = 5;
    var S22 = 9;
    var S23 = 14;
    var S24 = 20;
    var S31 = 4;
    var S32 = 11;
    var S33 = 16;
    var S34 = 23;
    var S41 = 6;
    var S42 = 10;
    var S43 = 15;
    var S44 = 21;

    function F(x,y,z) {
        return or(and(x,y),and(not(x),z));
    }

    function G(x,y,z) {
        return or(and(x,z),and(y,not(z)));
    }

    function H(x,y,z) {
        return xor(xor(x,y),z);
    }

    function I(x,y,z) {
        return xor(y ,or(x , not(z)));
    }

    function rotateLeft(a,n) {
        return or(shl(a, n),(shr(a,(32 - n))));
    }

    function FF(a,b,c,d,x,s,ac) {
        a = a+F(b, c, d) + x + ac;
        a = rotateLeft(a, s);
        a = a+b;
        return a;
    }

    function GG(a,b,c,d,x,s,ac) {
        a = a+G(b, c, d) +x + ac;
        a = rotateLeft(a, s);
        a = a+b;
        return a;
    }

    function HH(a,b,c,d,x,s,ac) {
        a = a+H(b, c, d) + x + ac;
        a = rotateLeft(a, s);
        a = a+b;
        return a;
    }

    function II(a,b,c,d,x,s,ac) {
        a = a+I(b, c, d) + x + ac;
        a = rotateLeft(a, s);
        a = a+b;
        return a;
    }

    function transform(buf,offset) {
        var a=0, b=0, c=0, d=0;
        var x = transformBuffer;

        a = state[0];
        b = state[1];
        c = state[2];
        d = state[3];

        for (i = 0; i < 16; i++) {
            x[i] = and(buf[i*4+offset],0xff);
            for (j = 1; j < 4; j++) {
                x[i]+=shl(and(buf[i*4+j+offset] ,0xff), j * 8);
            }
        }

        /* tour 1 */
        a = FF ( a, b, c, d, x[ 0], S11, 0xd76aa478); /* 1 */
        d = FF ( d, a, b, c, x[ 1], S12, 0xe8c7b756); /* 2 */
        c = FF ( c, d, a, b, x[ 2], S13, 0x242070db); /* 3 */
        b = FF ( b, c, d, a, x[ 3], S14, 0xc1bdceee); /* 4 */
        a = FF ( a, b, c, d, x[ 4], S11, 0xf57c0faf); /* 5 */
        d = FF ( d, a, b, c, x[ 5], S12, 0x4787c62a); /* 6 */
        c = FF ( c, d, a, b, x[ 6], S13, 0xa8304613); /* 7 */
        b = FF ( b, c, d, a, x[ 7], S14, 0xfd469501); /* 8 */
        a = FF ( a, b, c, d, x[ 8], S11, 0x698098d8); /* 9 */
        d = FF ( d, a, b, c, x[ 9], S12, 0x8b44f7af); /* 10 */
        c = FF ( c, d, a, b, x[10], S13, 0xffff5bb1); /* 11 */
        b = FF ( b, c, d, a, x[11], S14, 0x895cd7be); /* 12 */
        a = FF ( a, b, c, d, x[12], S11, 0x6b901122); /* 13 */
        d = FF ( d, a, b, c, x[13], S12, 0xfd987193); /* 14 */
        c = FF ( c, d, a, b, x[14], S13, 0xa679438e); /* 15 */
        b = FF ( b, c, d, a, x[15], S14, 0x49b40821); /* 16 */

        /* tour 2 */
        a = GG ( a, b, c, d, x[ 1], S21, 0xf61e2562); /* 17 */
        d = GG ( d, a, b, c, x[ 6], S22, 0xc040b340); /* 18 */
        c = GG ( c, d, a, b, x[11], S23, 0x265e5a51); /* 19 */
        b = GG ( b, c, d, a, x[ 0], S24, 0xe9b6c7aa); /* 20 */
        a = GG ( a, b, c, d, x[ 5], S21, 0xd62f105d); /* 21 */
        d = GG ( d, a, b, c, x[10], S22,  0x2441453); /* 22 */
        c = GG ( c, d, a, b, x[15], S23, 0xd8a1e681); /* 23 */
        b = GG ( b, c, d, a, x[ 4], S24, 0xe7d3fbc8); /* 24 */
        a = GG ( a, b, c, d, x[ 9], S21, 0x21e1cde6); /* 25 */
        d = GG ( d, a, b, c, x[14], S22, 0xc33707d6); /* 26 */
        c = GG ( c, d, a, b, x[ 3], S23, 0xf4d50d87); /* 27 */
        b = GG ( b, c, d, a, x[ 8], S24, 0x455a14ed); /* 28 */
        a = GG ( a, b, c, d, x[13], S21, 0xa9e3e905); /* 29 */
        d = GG ( d, a, b, c, x[ 2], S22, 0xfcefa3f8); /* 30 */
        c = GG ( c, d, a, b, x[ 7], S23, 0x676f02d9); /* 31 */
        b = GG ( b, c, d, a, x[12], S24, 0x8d2a4c8a); /* 32 */

        /* tour 3 */
        a = HH ( a, b, c, d, x[ 5], S31, 0xfffa3942); /* 33 */
        d = HH ( d, a, b, c, x[ 8], S32, 0x8771f681); /* 34 */
        c = HH ( c, d, a, b, x[11], S33, 0x6d9d6122); /* 35 */
        b = HH ( b, c, d, a, x[14], S34, 0xfde5380c); /* 36 */
        a = HH ( a, b, c, d, x[ 1], S31, 0xa4beea44); /* 37 */
        d = HH ( d, a, b, c, x[ 4], S32, 0x4bdecfa9); /* 38 */
        c = HH ( c, d, a, b, x[ 7], S33, 0xf6bb4b60); /* 39 */
        b = HH ( b, c, d, a, x[10], S34, 0xbebfbc70); /* 40 */
        a = HH ( a, b, c, d, x[13], S31, 0x289b7ec6); /* 41 */
        d = HH ( d, a, b, c, x[ 0], S32, 0xeaa127fa); /* 42 */
        c = HH ( c, d, a, b, x[ 3], S33, 0xd4ef3085); /* 43 */
        b = HH ( b, c, d, a, x[ 6], S34,  0x4881d05); /* 44 */
        a = HH ( a, b, c, d, x[ 9], S31, 0xd9d4d039); /* 45 */
        d = HH ( d, a, b, c, x[12], S32, 0xe6db99e5); /* 46 */
        c = HH ( c, d, a, b, x[15], S33, 0x1fa27cf8); /* 47 */
        b = HH ( b, c, d, a, x[ 2], S34, 0xc4ac5665); /* 48 */

        /* tour 4 */
        a = II ( a, b, c, d, x[ 0], S41, 0xf4292244); /* 49 */
        d = II ( d, a, b, c, x[ 7], S42, 0x432aff97); /* 50 */
        c = II ( c, d, a, b, x[14], S43, 0xab9423a7); /* 51 */
        b = II ( b, c, d, a, x[ 5], S44, 0xfc93a039); /* 52 */
        a = II ( a, b, c, d, x[12], S41, 0x655b59c3); /* 53 */
        d = II ( d, a, b, c, x[ 3], S42, 0x8f0ccc92); /* 54 */
        c = II ( c, d, a, b, x[10], S43, 0xffeff47d); /* 55 */
        b = II ( b, c, d, a, x[ 1], S44, 0x85845dd1); /* 56 */
        a = II ( a, b, c, d, x[ 8], S41, 0x6fa87e4f); /* 57 */
        d = II ( d, a, b, c, x[15], S42, 0xfe2ce6e0); /* 58 */
        c = II ( c, d, a, b, x[ 6], S43, 0xa3014314); /* 59 */
        b = II ( b, c, d, a, x[13], S44, 0x4e0811a1); /* 60 */
        a = II ( a, b, c, d, x[ 4], S41, 0xf7537e82); /* 61 */
        d = II ( d, a, b, c, x[11], S42, 0xbd3af235); /* 62 */
        c = II ( c, d, a, b, x[ 2], S43, 0x2ad7d2bb); /* 63 */
        b = II ( b, c, d, a, x[ 9], S44, 0xeb86d391); /* 64 */

        state[0] +=a;
        state[1] +=b;
        state[2] +=c;
        state[3] +=d;

    }

    function md5_init() {
        count[0]=count[1] = 0;
        state[0] = 0x67452301;
        state[1] = 0xefcdab89;
        state[2] = 0x98badcfe;
        state[3] = 0x10325476;
        for (i = 0; i < digestBits.length; i++)
            digestBits[i] = 0;
    }

    function md5_update(b) {
        var index,i;

        index = and(shr(count[0],3) , 0x3f);
        if (count[0]<0xffffffff-7)
          count[0] += 8;
        else {
          count[1]++;
          count[0]-=0xffffffff+1;
          count[0]+=8;
        }
        buffer[index] = and(b,0xff);
        if (index  >= 63) {
            transform(buffer, 0);
        }
    }

    function md5_finish() {
        var bits = new md5_array(8);
        var        padding;
        var        i=0, index=0, padLen=0;

        for (i = 0; i < 4; i++) {
            bits[i] = and(shr(count[0],(i * 8)), 0xff);
        }
        for (i = 0; i < 4; i++) {
            bits[i+4]=and(shr(count[1],(i * 8)), 0xff);
        }
        index = and(shr(count[0], 3) ,0x3f);
        padLen = (index < 56) ? (56 - index) : (120 - index);
        padding = new md5_array(64);
        padding[0] = 0x80;
        for (i=0;i<padLen;i++)
          md5_update(padding[i]);
        for (i=0;i<8;i++)
          md5_update(bits[i]);

        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                digestBits[i*4+j] = and(shr(state[i], (j * 8)) , 0xff);
            }
        }
    }

function hexa(n) {
 var hexa_h = "0123456789abcdef";
 var hexa_c="";
 var hexa_m=n;
 for (hexa_i=0;hexa_i<8;hexa_i++) {
   hexa_c=hexa_h.charAt(Math.abs(hexa_m)%16)+hexa_c;
   hexa_m=Math.floor(hexa_m/16);
 }
 return hexa_c;
}

function IS_MD5(message)
{
 var l,s,k,ka,kb,kc,kd;

var ascii="01234567890123456789012345678901" +
          " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
          "[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
          
 md5_init();
 for (k=0;k<message.length;k++) {
   l=message.charAt(k);
   md5_update(ascii.lastIndexOf(l));
 }
 md5_finish();
 ka=kb=kc=kd=0;
 for (i=0;i<4;i++) ka+=shl(digestBits[15-i], (i*8));
 for (i=4;i<8;i++) kb+=shl(digestBits[15-i], ((i-4)*8));
 for (i=8;i<12;i++) kc+=shl(digestBits[15-i], ((i-8)*8));
 for (i=12;i<16;i++) kd+=shl(digestBits[15-i], ((i-12)*8));
 s=hexa(kd)+hexa(kc)+hexa(kb)+hexa(ka);
 return s;
}


function IS_initialize_flash_message(mess1,mess2)
{
	var mess=""
	if (flashPlayerIsAvailable()==false)
	{
		mess=mess1;
	}
	else
		{
			mess=mess2;
		}
	IS_writeLayer(getElementByKey("global-flash-page"),"<a href='http://www.adobe.com/go/getflashplayer' target='_blank'><br><div style='cursor:hand;width:400px;' class='flash-message'>"+mess+"</div></a>");
}



function redirectWhenFlashPlayerNoAvailable()
{
	if ((flashPlayerIsAvailable()==false)||(document.webaca_force_html_version))
	{
		window.location.assign(document.webaca_html_version);
	}
}

function flashPlayerIsAvailable()
{
	try
	{
		var installedVer = deconcept.SWFObjectUtil.getPlayerVersion();
		if (installedVer.major>=8)
		{
			return true;
		}
	}
	catch (e){}
	return false;
}




var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();