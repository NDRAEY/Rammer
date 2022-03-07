'use strict';

// builtins.js - app developing library.
// El Rammer standard - RammerFunction(lay[,option1,...])
// Commented class blocks is unstable functions...

class RammerApp {
   constructor(txt) {
        this.lay = app.CreateLayout("Linear", "Vertical,fillxy,Top");
        this._lay = app.CreateLayout( "Linear", "Vertical,fillxy,Top,TouchThrough" );
        this.lay.SetMargins(0,app.GetOrientation()=="Landscape"?0.07:0.03,0,0)
        this.lay.SetSize( 1,app.GetOrientation()=="Landscape"?0.845:0.915)
        this.state="unused"
        this.ifadded = false
        this.txt_prev = textapp.GetText()
        this.txt = typeof(txt)=="undefined"||typeof(txt)=="null"?lang=="ru"?"Неизвестное приложение":"Unknown app":txt
        this.lay.SetBackColor("gray");
        this._lay.AddChild(this.lay)
        this.nnus = rammer.appstack.push(this)
        //this.old = laycontrols_home.unk
        //alert(this.nnus) //DEBUG
	}
   raw() {
      return this.lay
   }
   show() {
      if(this.ifadded == false) {
         //this._lay.Animate("FadeIn",()=>{},100)
         app.AddLayout(this._lay);
         layotherstatusbar.SetBackColor( "gray" );
         laycontrols.SetBackColor( "gray" )
         if(rammer.appstack.length<=1){
         layotherothbar.AddChild(txttimeonbar,0)
         }
         //laycontrols_home.unk = this
         textapp.SetText(this.txt)
         this.ifadded = true
         this.state = "showed"
      }
   }
   close() {
      if(this.ifadded == true) {
         app.RemoveLayout(this._lay);
         textapp.SetText(this.txt_prev)
         this.ifadded = false
         //laycontrols_home.unk = this.old
         rammer.appstack.splice(this.nnus-1,1) // not working
         delete this
         if(rammer.appstack.length==0){
         layotherothbar.RemoveChild(txttimeonbar)
         layotherstatusbar.SetBackAlpha( 0 )
         laycontrols.SetBackAlpha(0)
         }
      }
   }
   hide() {
      if(this.ifadded == true) {
         app.RemoveLayout(this._lay);
         layotherothbar.RemoveChild(txttimeonbar)
         layotherstatusbar.SetBackAlpha( 0 )
         //laycontrols_home.unk = this.old
         textapp.SetText(this.txt_prev)
         this.ifadded = false
         this.state="hided"
      }
   }
   AddChild(c) {
       this.lay.AddChild(c)
   }
   RemoveChild(c) {
       this.lay.RemoveChild(c)
   }
   SetTitle(text) {
     textapp.SetText(text)
   }
}

class RammerCloseButton_CrossLayout {
constructor(laytoadd,laytoclose) {
this.w = app.GetOrientation()=="Landscape"?0.06:0.12
this.lta = laytoadd
this.h = this.w / (app.GetDisplayHeight()/app.GetDisplayWidth())
this.closebtn = app.CreateButton( "[fa-close]",this.w,this.h,"FontAwesome" );
this.closebtn.lta = this.lta
this.closebtn.ltc = laytoclose
this.closebtn.addit = function(){}
this.closebtn.SetOnTouch(function() {
  //alert(JSON.stringify(this)) helped to fix a bug
  this.addit()
  this.ltc.close()
})
}
close() {
  this.lta.close()
}
SetAdditional(func) {
  this.closebtn.addit = func
}
show() {
	this.lta.AddChild(this.closebtn)
}
hide() {
  this.lta.RemoveChild(this.closebtn)
}
raw() {
    return this.closebtn   
}
}

class RammerCloseButton {
constructor(laytoadd) {
this.w = app.GetOrientation()=="Landscape"?0.06:0.12
this.lta = laytoadd
this.h = this.w / (app.GetDisplayHeight()/app.GetDisplayWidth())
this.closebtn = app.CreateButton( "[fa-close]",this.w,this.h,"FontAwesome" );
this.closebtn.lta = this.lta
this.closebtn.addit = function(){}
this.closebtn.SetOnTouch(function() {
  //alert(JSON.stringify(this)) helped to fix a bug
  this.addit()
  this.lta.close()
})
}
close() {
  this.lta.close()
}
SetAdditional(func) {
  this.closebtn.addit = func
}
show() {
	this.lta.AddChild(this.closebtn)
}
hide() {
  this.lta.RemoveChild(this.closebtn)
}
raw() {
    return this.closebtn   
}
}

class RammerSquareButton {
constructor(lta,text,s,sot,nofa) {
this.w = s
this.lta = lta
this.h = this.w / (app.GetDisplayHeight()/app.GetDisplayWidth())
this.btn = app.CreateButton( text,this.w,this.h,nofa!=true?"FontAwesome":"" );
this.closebtn.SetOnTouch(sot)
}
show() {
	this.lta.AddChild(this.closebtn)
}
hide() {
  this.lta.RemoveChild(this.closebtn)
}
}

class RammerRepository {
constructor(repo) {
	// rammer/mobile/packages/MICROVER.txt
  this.repo = repo
  this.info = ""
  this.pkgs = []
  this.tmp = app.CreateDownloader(  )
  this.status = ""
}

GetPackages() {
  this.tmp = new XMLHttpRequest();
  this.tmp.open('GET',this.repo+'/rammer/mobile/packages/PACKAGES.txt',false)
  this.tmp.send()
  this.status = this.tmp.status==200?"OK":"ERROR "+ this.tmp.status
  return this.tmp.responseText
}

ParsePackages(data) {
  this.info = data.split("\n")
  return this.info
}

DownloadPackage(pkg) {
 this.tmp = app.CreateDownloader(  )
 this.tmp.Download( this.repo+"/rammer/mobile/packages/"+pkg, "/sdcard/Rammer/Temps/", pkg )
 this.tmp.SetOnError( function(){ return false } )
this. tmp.SetOnComplete( function() { return true } )
}

InstallPackage(pkg) {
if(app.FileExists( "/sdcard/Rammer/Temps/"+pkg )){
app.UnzipFile( "/sdcard/Rammer/Temps/"+pkg,"/sdcard/Rammer/Apps/" );
return true;
}else{ return false }
}
}

function RammerShExec(cmd)
{
	return app.SysExec( cmd )
}

class RammerSysIcon {
  constructor(icon,ontouch) {
    this.name = name
    this.ontouch = ontouch
    this.tmp = app.CreateText( icon,null,null,"FontAwesome" )
    this.tmp.SetOnTouch( ontouch );
    this.tmp.SetTextSize( 18 );
    this.tmp.SetMargins( 0, 0.003, 0, 0 )
    layothermainbar.AddChild(this.tmp)
  }
  show() {
    this.tmp.Show()
  }
  change(icon) {
    this.tmp.SetText(icon)
  }
  hide() {
    this.tmp.Hide()
  }
}

class RammerProgressBar {
constructor(_lay) {
this.lay = _lay
this.img = app.CreateImage( null,1,0.1 )
this.img.SetLineWidth( 7 )
this.img.SetPaintStyle( "line" )
this.img.DrawRectangle( 0,0,1,1 )
this.img.SetAutoUpdate( false )
this.img.SetTextSize( 28 )
}
show() {
this.lay.AddChild( this.img )
}
hide() {
this.lay.RemoveChild( this.img )
}
SetSize(a,b) {
this.img.SetSize(a,b)
}
update(percent) {
  this.img.SetPaintColor( "white" )
  this.img.SetPaintStyle( "line" )
  this.img.DrawRectangle( 0,0,1,1 )
  this.img.SetPaintStyle( "fill" )
  if(percent<=100&&percent>=0) {
	this.img.DrawRectangle( 0,0,percent>100?1:percent/100,1 )
  this.img.SetPaintColor( "gray" )
  this.img.DrawText(percent,(percent>85?(percent-20)/100:percent/100),0.6)
  this.img.Update()
 }
  this.img.Clear()
}
}

class RammerBootProgressBar {
constructor(lay) {
this.lay = lay
this.w = 1
this.h = 0.02
this.p = 1
this.img = app.CreateImage( null,this.w,this.h )
this.img.SetAutoUpdate(false)
}
setsize(w,h) {
  this.w = typeof(w)=="undefined"||w==null?this.w:w
  this.h = typeof(h)=="undefined"||h==null?this.h:h
  this.img.SetSize(this.w,this.h)
}
show() {
this.img.Clear()
this.img.SetPaintColor("gray")
this.img.DrawLine(0,0.5,1,0.5)
this.img.SetPaintColor("white")
this.img.DrawLine(0,0.5,this.p/100,0.5)
this.img.Update();
this.lay.AddChild(this.img)
}
hide() {
this.lay.RemoveChild(this.img)
}
update(pc) {
this.img.Clear()
this.p = pc==0?0.01:pc
this.img.SetPaintColor("gray")
this.img.DrawLine(0,0.5,1,0.5)
this.img.SetPaintColor("white")
this.img.DrawLine(0,0.5,this.p/100,0.5)
this.img.Update()
}
get_p() { return this.p }
}

class RammerUtility {
constructor(){}
AddChildMul(lay,arr) {
for(let i=0;i<arr.length;i++) { lay.AddChild( arr[i] ) }
}
squarexy(w) {
return [w,w/(app.GetDisplayHeight()/app.GetDisplayWidth())]
}
}

class RammerAdditionalTextUtilities {
constructor(text) {
this.txt = text
}
blink(timer) {
this.trigger = false
this.prev = this.txt.GetText();
this.placer = []
for(this.a=0;this.a<this.prev.length;this.a++) { this.placer.push(" ") }
this.tint = setInterval(()=>{
this.prev = this.txt.GetText();
if(this.trigger==true){
this.txt.SetText(this.prev);
this.trigger=false
}else{
this.txt.SetText(this.placer.join(""));
this.trigger=true
}
},timer)
}
stopBlink() {
clearInterval(this.tint)
}
}

class RammerVideo {
	constructor(lay,w,h) {
		this.lta = lay
    this.h = h
    this.w = w
		this.lay = app.CreateLayout("frame","hcenter")
		this.lay.SetSize(w,h)
		this.ctrllay = app.CreateLayout("linear","Vbottom")
		this.ctrllay.SetBackColor("black")
		this.ctrllay.SetBackAlpha(0.4)
		this.video = app.CreateVideoView(w,h)
		this.lay.AddChild(this.video)
		this.vault = app.CreateLayout("linear","Vertical") // zhelezobetonno pofig
		this.vault.SetSize(w,h)
		this.lay.AddChild(this.vault)
		this.vault.ulay = this.lay
		this.vault.ctrllay = this.ctrllay
		this.ctrllay.ulay = this.lay
		// this.vault.SetBackColor("red") // for debug
		// ctrl
		this.btnslay = app.CreateLayout("linear","Horizontal")
		this.btnslayh = app.CreateLayout("linear","VCenter,touchthrough")
		this.ctrllay.AddChild(this.btnslayh)
		this.btnslayh.AddChild(this.btnslay)
		this.btnslayh.SetSize(w,h-(h/6))
		this.m10 = app.CreateText("-10")
		this.m10.SetOnTouchDown(()=>{this.seek(this.getpos()-10)})
		this.playbtn = app.CreateText("[fa-play]",null,null,"fontawesome")
		this.p10 = app.CreateText("+10")
		this.p10.SetOnTouchDown(()=>{this.seek(this.getpos()+10)})
		this.m10.SetTextSize(this.m10.GetTextSize()+9)
		this.playbtn.SetTextSize(this.playbtn.GetTextSize()+27)
		this.p10.SetTextSize(this.p10.GetTextSize()+9)
		this.m10.SetMargins(/*left*/0,/*top*/0,/*right*/0.05,/*bottom*/0)
		this.playbtn.SetMargins(/*left*/0.05,/*top*/0,/*right*/0.05,/*bottom*/0)
		this.p10.SetMargins(/*left*/0.05,/*top*/0,/*right*/0,/*bottom*/0)
		this.btnslay.AddChild(this.m10)
		this.btnslay.AddChild(this.playbtn)
		this.btnslay.AddChild(this.p10)
		this.vault.SetOnTouchDown(function(){this.ulay.AddChild(this.ctrllay)})
		this.ctrllay.SetOnTouchDown(function(){this.ulay.RemoveChild(this)})
		// bottom ctrls
		this.laybctr = app.CreateLayout("linear","horizontal,center")
		this.ctrllay.AddChild(this.laybctr)
		this.laybctr.SetSize(w,h/5.6)
		//this.laybctr.SetBackColor("gray")
		this.laybctr.SetBackAlpha(0.4)
		this.txttime1 = app.CreateText("00:00")
		this.txttime2 = app.CreateText("00:00")
		this.txttime1.SetMargins( 0,0.01,0.02,0 )
		this.txttime2.SetMargins( 0.02,0.01,0,0 )
		this.bar = app.CreateSeekBar(w-(0.15*2),0.05)
		this.bar.SetRange(1)
		this.bar.video=this.video
		this.bar.SetOnChange((val)=>{
			this.video.SeekTo(this.dur*val)
		})
		this.laybctr.AddChild(this.txttime1)
		this.laybctr.AddChild(this.bar)
		this.laybctr.AddChild(this.txttime2)
	}
	show() {
		this.lta.AddChild(this.lay)
		this.playbtn.SetOnTouchDown(()=>{this.play()})
	}
	// LOGIC
	play(from) {
		this.ll = setInterval(()=>{
			this.cur = this.video.GetPosition()
			this.dur = this.video.GetDuration()
			this.txttime1.SetText(this.normalize_time(this.cur))
			this.txttime2.SetText(this.normalize_time(this.dur))
			this.bar.SetValue(this.cur/this.dur)
   this.lay.SetSize(this.video.GetWidth()==0?this.w:this.video.GetWidth(),this.video.GetHeight()==0?this.h:this.video.GetHeight())
   this.laybctr.SetSize(this.video.GetWidth()==0?this.w:this.video.GetWidth(),this.video.GetHeight()==0?this.h/6:this.video.GetHeight()/6)
//   this.lay.SetSize(this.video.GetWidth()==0?this.w:this.video.GetWidth(),this.video.GetHeight()==0?this.h-(this.h/6):this.video.GetHeight()-(this.video.GetHeight()))
		},1000)
		this.playbtn.SetText("[fa-pause]")
		this.playbtn.SetOnTouchDown(()=>{this.pause()})
		this.video.Play()
    this.video.SetSize(1,null)
	}
	setfile(file) {
    this.video.Stop()
		this.video.SetFile(file)
	}
	pause() {
		clearInterval(this.ll)
		this.video.Pause()
		this.playbtn.SetText("[fa-play]")
		this.playbtn.SetOnTouchDown(()=>{this.play()})
	}
	stop() {
		clearInterval(this.ll)
		this.video.Stop()
		this.playbtn.SetText("[fa-play]")
		this.playbtn.SetOnTouchDown(()=>{this.play()})
	}
	seek(to) {
		this.video.SeekTo(to)
	}
	getpos() { return this.video.GetPosition() }
	normalize_time(a) {
    this.mins = String(Math.floor(a/60))
    this.secs = String(Math.floor(a%60))
    this.mins.length==1?this.mins="0"+this.mins:this.mins
    this.secs.length==1?this.secs="0"+this.secs:this.secs
    return this.mins+":"+this.secs
	}
}

function RammerCPUUsage()
{
	return app.ReadFile( "/proc/loadavg" ).split(" ")[0]
}

class RammerFileSelect {
constructor(param) {
if(typeof(param)=="String") {
this.shsd = param.toLowerCase()=="sd"?true:false
}else{ this.shsd = false }
this.lay = new RammerApp(lang=="ru"?"Выбор файла":"File Selector");
this.backbtn = app.CreateButton( lang=="ru"?"Назад":"Back" )
this.backbtn.SetOnTouch(this.back)
this.backbtn.shsd = this.shsd
this.cls = new RammerCloseButton(this.lay)
this.lay.AddChild(this.backbtn)
this.cls.show()
this.dir = ["sdcard",this.shsd?"":"Rammer"]
this.list = app.CreateList( app.ListFolder("/"+dir.join("/")),1,0.9 )
this.backbtn.list = this.list
this.backbtn.dir = this.dir
this.list.SetOnTouch(this.ontouch)
this.list.dir = this.dir
this.list.onfs = ()=>{}
this.list.lay = this.lay
this.lay.AddChild(this.list)
}
show() {
this.lay.show()
}
close() {
this.lay.close()
}
setonfileselect(func) {
this.list.onfs = func
}
ontouch(a) {
this.dir.push(a)
if(!app.IsFolder( "/"+this.dir.join("/") )) {
this.lay.close()
this.onfs("/"+this.dir.join("/"))
}else{
this.SetList(app.ListFolder( "/"+this.dir.join("/") ))
}
}
get() {
return "/"+this.dir.join("/")
}
back() {
if("/"+this.dir.join("/")!="/"+dirf.join("/") && this.shsd==false) {this.dir.pop()}
this.list.SetList(app.ListFolder( "/"+this.dir.join("/") ))
}
}

class RammerSevenSegment {
constructor(lay,dgcount) {
this.lta = lay
this.is = false
this.color = "white"
this.lay = app.CreateLayout( "Frame" )
this.text = app.CreateText( "" )
this.text.SetTextColor( this.color )
this.text.SetFontFile("Misc/digital-7.ttf")
this.lay.AddChild(this.text)
}
show() {
if(!this.is){this.lta.AddChild(this.lay); this.is=true}
}
hide() {
if(this.is){this.lta.AddChild(this.lay); this.is=false}
}
setText(txt) {
this.text.SetText(txt)
}
setSize(sz) {
this.text.SetTextSize(sz)
}
}

class RammerAudioPlayer {
constructor(lay,w){
//DESIGN
this.lta = lay
this.lay = app.CreateLayout( "Linear", "Vertical" )
this.lay.SetBackColor("gray")
this.layhoz = app.CreateLayout( "Linear", "Horizontal" )
this.layhoz1 = app.CreateLayout( "Linear", "Horizontal" )
this.time1 = app.CreateText( "00:00" )
this.skb = app.CreateSeekBar( w-(0.12*2),null )
this.time2 = app.CreateText( "00:00" )
this.layhoz.AddChild(this.time1)
this.layhoz.AddChild(this.skb)
this.layhoz.AddChild(this.time2)
this.lay.AddChild(this.layhoz)
this.playbtn = app.CreateButton( "[fa-play]",null,null,"FontAwesome" )
this.playbtn.mp = this.mp
this.playbtn.skb = this.skb
this.playbtn.time1 = this.time1
this.playbtn.time2 = this.time2
this.pausebtn = app.CreateButton( "[fa-pause]",null,null,"FontAwesome" )
this.stopbtn = app.CreateButton( "[fa-stop]",null,null,"FontAwesome" )
this.volskb = app.CreateSeekBar( w-(0.16*3) )
this.volskb.SetRange(1)
this.volskb.SetValue(3-2)
this.volskb.mp = this.mp
this.voltxt = app.CreateText( "100" )
this.volskb.voltxt = this.voltxt
this.layhoz1.AddChild(this.playbtn)
this.layhoz1.AddChild(this.pausebtn)
this.layhoz1.AddChild(this.stopbtn)
this.layhoz1.AddChild(this.volskb)
this.layhoz1.AddChild(this.voltxt)
this.lay.AddChild(this.layhoz1)
// LOGIC
this.mp = app.CreateMediaPlayer()
this.skb.mp = this.mp
this.skb.SetOnChange(function(v){
this.mp.SeekTo(v)
})
this.playbtn.SetOnTouch(()=>{this.play()})
this.pausebtn.SetOnTouch(()=>{this.pause()})
this.stopbtn.SetOnTouch(()=>{this.stop()})
this.volskb.SetOnChange((c)=>{this.setvolume(c)})
}
setfile(file) {
this.mp.SetFile(file)
this.time1.SetText(this.mp.GetPosition())
this.time2.SetText(this.mp.GetDuration())
this.skb.SetRange(this.mp.GetDuration())
}
play(){
this.oper = setInterval(()=>{
this.time1.SetText(this.mp.GetPosition())
this.time2.SetText(this.mp.GetDuration())
this.skb.SetRange(this.mp.GetDuration())
this.skb.SetValue(this.mp.GetPosition())
},999)
//this.mp.SetOnReady(()=>{
this.mp.Play()
//})
}
pause(){
clearInterval(this.oper)
this.mp.Pause()
}
stop(){
clearInterval(this.oper)
this.mp.Stop()
}
show(){
this.lta.AddChild(this.lay)
}
hide(){
this.lta.RemoveChild(this.lay)
}
setvolume(c){
this.mp.SetVolume(c,c)
this.voltxt.SetText(Math.floor(c*100))
}
}

function ImplementedSleep(ms){
 let d = Date.now();
 let cd = null
do{
  cd = Date.now()
}while(cd-d<ms)
}

class RammerImageCropper {
constructor(image) {
this.x = 0
this.y = 0
this.z = 3-2
this.oncomplete = ()=>{}
this.image = image
this.lay = new RammerApp(lang=="ru"?"Резчик изображений":"Image Cropper")
this.eha = app.CreateImage( null,1,0.6 )
this.eha.SetAutoUpdate( false )
this.lay.AddChild( this.eha )

this.eha.SetPaintColor( "gray" )
this.eha.DrawRectangle( 0,0,3-2,3-2 )
this.eha.DrawImage( app.CreateImage( this.image ),0,0,1,1/(app.GetScreenHeight()/app.GetScreenWidth()) )
this.eha.Update()

this.textz = app.CreateText( "Zoom" )
this.lay.AddChild( this.textz )

this.skb = app.CreateSeekBar( 1 )
this.skb.SetRange( 2 )
this.skb.oper = this
//this.skb.y = this.y
//this.skb.z = this.z
//this.skb.eha = this.eha
//this.skb.image = this.image
//this.skb.update  = this.update
//this.skb.txt = this.textz
this.skb.SetOnChange( function(x){
this.oper.z = x
this.oper.textz.SetText(x)
this.oper.update(this.oper.x,this.oper.y,this.oper.z)
})
this.lay.AddChild( this.skb )

this.textx = app.CreateText( "x" )
this.lay.AddChild( this.textx )

this.skbx = app.CreateSeekBar( 1 )
this.skbx.SetRange( -3+2 )
this.skbx.oper = this
this.skbx.SetOnChange( function(x){
this.oper.x = x
this.oper.textx.SetText(x)
this.oper.update(this.oper.x,this.oper.y,this.oper.z)
})
this.lay.AddChild( this.skbx )

this.texty = app.CreateText( "y" )
this.lay.AddChild( this.texty )

this.skby = app.CreateSeekBar( 1 )
this.skby.SetRange( -3+2 )
this.skby.oper = this
this.skby.SetOnChange( function(x){
this.oper.y = x
this.oper.texty.SetText(this.oper.y)
this.update(this.oper.x,this.oper.y,this.oper.z)
})
this.lay.AddChild( this.skby )
this.layh = app.CreateLayout( "Linear", "Horizontal" )
this.lay.AddChild(this.layh)
this.ok = app.CreateButton( "OK" )
this.ok.oper = this
this.ok.SetOnTouch(function(){
this.rn = "WP-"+Math.floor(Math.random()*1000)+"-"+tmp_data.year+"-"+tmp_data.month+"-"+"_"+tmp_data.hours+"-"+tmp_data.minutes+"-"+tmp_data.seconds+".png"
if(confirm(lang=="ru"?"Сохранить в Pictures/Wallpapers/"+this.rn+"?":"Save to Pictures/Wallpapers/"+this.rn+"?")) {
this.oper.eha.Save("/sdcard/Rammer/Pictures/Wallpapers/"+this.rn)
this.oper.lay.close()
this.oper.oncomplete("/sdcard/Rammer/Pictures/Wallpapers/"+this.rn)
}
})
this.layh.AddChild(this.ok)
this.cb = app.CreateButton( "Close" )
this.cb.oper = this
this.cb.SetOnTouch(function(){this.oper.oncomplete(this.oper.image);this.oper.lay.close()})
this.layh.AddChild(this.cb)
}
show(){
this.lay.show()
}
close(){
this.lay.close()
}
setoncomplete(func) {
this.oncomplete = func
}
update(x,y,z){
this.eha.Clear()
this.eha.DrawRectangle( 0,0,3-2,3-2 )
this.x = x
this.y = y
this.z = z
this.eha.DrawImage( app.CreateImage( this.image ),this.x,this.y,this.z,this.z/(app.GetScreenHeight()/app.GetScreenWidth()) )
this.eha.Update()
}
}

function RammerSystem_GetRemoteVersion(){
  'use strict'
  let xhr = new XMLHttpRequest();
  xhr.open("GET","https://raw.githubusercontent.com/AndreyTheHacker/Rammer/master/rammer.js",false)
  xhr.send()
  
  let req = xhr.responseText
  req = req.slice(req.indexOf("const version = "),req.length)
  req = req.slice(req.indexOf('"')+1,req.length)
  req = req.slice(0,req.indexOf('"'))
  return (req==""?null:req)
}
/*
function RammerSystem_GetRemoteCode(file) {
  'use strict'
  if(file==null){ return null }
  let xhr = new XMLHttpRequest();
  xhr.open("GET","https://raw.githubusercontent.com/AndreyTheHacker/Rammer/master/"+file,false)
  xhr.send()
  
  let req = xhr.responseText
  return (req==""?null:req)
}
*/
function RammerVersionCompare(v1, v2, options) {
    // It's not my work...
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');
    function isValidPart(x) { return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x); }
    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) { return NaN; }
    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }
    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }
    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) { return 1; }

        if (v1parts[i] == v2parts[i]) { continue; }
        else if (v1parts[i] > v2parts[i]) { return 1; }
        else { return -1; }
    }
    if (v1parts.length != v2parts.length) { return -1; }
    return 0;
    
    // returns 1 if local version is latest
    // returns 0 if versions are equal
    // returns -1 if remote version is latest
    // returns NaN if error
}

/*
Update Algorithm:

1. Create Downloader
2. Set Error Trigger
3. Set Complete Trigger
4. Download
4.1. Unzip downloaded file to temporal folder
4.2. Copy contents from temporal foldrf to system folder

let dwn = app.CreateDownloader( )

dwn.SetOnError( function(e)
alert(e)
 } )
 dwn.SetOnComplete( function(){
 	app.UnzipFile( app.GetAppPath()+"/master.zip","update" )
	lst = app.ListFolder( app.GetAppPath()+"/update/Rammer-master/" );
  app.CopyFolder( app.GetAppPath()+"/update/Rammer-master/",app.GetAppPath() )
  alert("Okay!")
})
	dwn.Download( "https://github.com/AndreyTheHacker/Rammer/archive/master.zip",app.GetAppPath())
*/

function RammerText_IntRunner(txt,a,b,c,tml,tme,addit,cb)
{
	'use strict'
	let aa = a
	let bb = b
	let cnt = aa
	let itrvl = setInterval(function(){
	  if(cnt<=bb/1.25) {
	    cnt+=c
	    txt.SetText( cnt+addit )
	  }else{
	  clearInterval(itrvl)
  	let itr = setInterval(function(){
  	  if(cnt<bb) {
  	    cnt+=c
  	    txt.SetText(cnt+addit)
  	  }else{
  	    clearInterval(itr)
  	    if(typeof(cb)!="undefined"){
  	      cb()
  	    }
  	  }
	  },tme)
	 }
	},tml)
}

function Rammer_IntRunnerFunction(cbi,a,b,c,tml,tme,addit,cb)
{
	'use strict'
	let aa = a
	let bb = b
	let cnt = aa
	let itrvl = setInterval(function(){
	  if(cnt<=bb/1.25) {
	    cnt+=c
	    cbi( cnt+addit )
	  }else{
	  clearInterval(itrvl)
  	let itr = setInterval(function(){
  	  if(cnt<bb) {
  	    cnt+=c
  	    cbi(cnt+addit)
  	  }else{
  	    clearInterval(itr)
  	    if(typeof(cb)!="undefined"){
  	      cb()
  	    }
  	  }
	  },tme)
	 }
	},tml)
}

class Pikachu {
  constructor(){
    this.dwn = app.CreateDownloader(  )
  }
  runupdate(){
    this.dwn.Download( "https://github.com/AndreyTheHacker/Rammer/archive/master.zip",app.GetAppPath() )
    this.dwn.SetOnError( function(e){
       alert((lang=="ru"?"Ошибка: ":"Error: ")+e)
    })
   this.dwn.SetOnComplete( function(){
     	app.DeleteFile( "config.json" )
   	app.DeleteFile( "rammer.js" )
 	  app.DeleteFile( "builtins.js" )
 	  app.UnzipFile( app.GetAppPath()+"/master.zip","update" )
     app.CopyFolder( app.GetAppPath()+"/update/Rammer-master/",app.GetAppPath() )
     shutdown_animation()
     shutdown()
     app.DeleteFile( app.GetAppPath()+"/master.zip" )
     app.DeleteFolder( app.GetAppPath()+"/updates" )
     alert("Updates is installed, restart Rammer!")
   })
  }
}

class RammerNotification{
  constructor(title,text,func,icon,sound,options) {
    this.title = title
    this.text = text
    this.func = func
    this.icon = icon
    this.sound = sound
    this.options = options
    
    //DESIGN
  this.nk = app.CreateLayout( "Card","Vertical" )
  this.nk.SetBackColor( "#4F4E4E" )
  this.nk.SetCornerRadius( 20 )
  this.nk.SetSize( 0.98,0.16 )
  this.nk.func = this.func
  this.nk.SetOnTouchUp(function(){
    app.RemoveLayout( this )
    clearTimeout(this.nid)
    if(this.func!="undefined"&&this.func!=null){this.func()}
  })
  
  this.evlay = app.CreateLayout( "Linear", "Vertical,top,touchthrough" )
  this.nk.AddChild( this.evlay )
  
  this.evlay.SetOnTouchUp(function(){
    app.RemoveLayout( this )
    clearTimeout(this.nid)
    if(this.func!="undefined"&&this.func!=null){this.func()}
  })
  
  this.psn = app.CreateText( this.title+" | now",0.7,null,"Left,touchthrough" )
  this.psn.SetMargins( -0.05,0.01,0,0 )
  this.psn.SetTextSize( 13 )
  this.evlay.AddChild( this.psn )
  
  this.polk = app.CreateLayout( "Linear", "Horizontal,touchthrough" )
  this.polk.SetSize( 0.98, 0.12 )
  
  this.polk.SetOnTouchUp(function(){
    app.RemoveLayout( this )
    clearTimeout(this.nid)
    if(this.func!="undefined"&&this.func!=null){this.func()}
  })
  
  this.plimg = app.CreateImage( typeof this.icon!="undefined"?this.icon:"Img/rammer.png", 0.11 )
  this.plimg.SetMargins( 20, 15, 0, 0, "px")
  this.polk.AddChild( this.plimg )
  
  this.nlay = app.CreateLayout( "Linear", "Vertical" )
  this.nlay.SetSize(0.8,0.12)
  this.polk.AddChild( this.nlay )
  
  this.nlay.SetOnTouchUp(function(){
    app.RemoveLayout( this )
    clearTimeout(this.nid)
    if(this.func!="undefined"&&this.func!=null){this.func()}
  })
  
  this.pltxt = app.CreateText( this.text, null, null, "Left,Multiline,touchthrough" )
  this.pltxt.SetMargins( 0.03, 0.01 )
  this.pltxt.SetTextSize( 17 )
  if(!(options&&options.notxt)) {
    this.nlay.AddChild( this.pltxt )
  }
  
  this.msc = app.CreateMediaPlayer()
  this.msc.SetFile(typeof(this.sound)=="undefined"||this.sound==null?rammer_config.sounds.notifications:this.sound)
  this.evlay.AddChild( this.polk )
  }
  
  trigger(){
    this.nk.Animate("FlipFromTop",()=>{},300)
    app.AddLayout( this.nk )
    //this.msc.Stop()
    //this.msc.SetOnReady(function() {
    this.msc.Play()
    //})
    this.nk.nid = setTimeout(()=>{
      this.nk.Animate( "Fadeout",()=>{},300 )
      app.RemoveLayout( this.nk )
      if(this.options&&(typeof(this.options.ondisappear)=="function")){
        this.options.ondisappear()
      }
    },3000)
  }
  
  raw() {
    return this.nlay
  }
}

function RammerIPTV_ParseM3U8(data)
{
	'use strict'
	let total = []
	let nlsp = data.split("\n")
	let obj = {}
	for(let i=0;i<nlsp.length;i++) {
	  if(nlsp[i][0]=="#"){
	    let dt = (nlsp[i].slice(1,7))
	    if(dt=="EXTINF") {
	      obj.name = nlsp[i]
	    }else if(dt=="EXTGRP") {
	      obj.group = nlsp[i]
	    }
	  }else{
	    if(nlsp[i].indexOf("http")>-1) {
	      obj.url = nlsp[i]
	      total.push(obj)
	    }
	  }
	}
	return total
}

class RammerFlexMenu {
  constructor(){
    this.lay = app.CreateLayout( "Linear", "VCenter,Fillxy" )
    this.lay.SetBackColor("#000000")
    this.lay.SetBackAlpha(6/9)
    this.lay.SetOnTouchDown(()=>{
      this.close()
    })
    this.mlay = app.CreateLayout( "Card", "Vertical" )
    this.mlay.SetCornerRadius(15)
    this.mlay.SetBackColor("gray")
    this.mlay.SetSize(0.95,0.5)
    this.lay.AddChild(this.mlay)
  }
  show(){
    app.AddLayout( this.lay )
  }
  raw(){
    return this.mlay
  }
  close(){
    app.RemoveLayout( this.lay )
  }
}


class RammerVerticalSeparator{
  constructor(lay){
    this.lay = lay
    this.color = "#000000"
    this.img = app.CreateImage( null, 0.005, 1 )
    this.img.SetPaintColor(this.color)
    this.img.DrawRectangle(0,0,1,1)
  }
  setsize(w,h) {
   if(w<=0.02) {
     this.img.Clear()
     this.img.SetSize(w,h)
     this.img.SetPaintColor(this.color)
     this.img.DrawRectangle(0,0,1,1)
   }
  }
  setcolor(clr){
     this.img.Clear()
     this.color = clr
     this.img.SetPaintColor(this.color)
     this.img.DrawRectangle(0,0,1,1)
  }
  show(){
    this.lay.AddChild(this.img)
  }
  hide(){
    this.lay.RemoveChild(this.img)
  }
}
 
class RammerHorizontalSeparator{
  constructor(lay){
    this.lay = lay
    this.color = "#000000"
    this.img = app.CreateImage( null, 1,0.005 )
    this.img.SetPaintColor(this.color)
    this.img.DrawRectangle(0,0,1,1)
  }
  setsize(w,h) {
   if(h<=0.02) {
     this.img.Clear()
     this.img.SetSize(w,h)
     this.img.SetPaintColor(this.color)
     this.img.DrawRectangle(0,0,1,1)
   }
  }
  setcolor(clr){
     this.img.Clear()
     this.color = clr
     this.img.SetPaintColor(this.color)
     this.img.DrawRectangle(0,0,1,1)
  }
  show(){
    this.lay.AddChild(this.img)
  }
  hide(){
    this.lay.RemoveChild(this.img)
  }
 }
 
class RammerBatteryIcon {
 constructor(lay,options) {
  this.lay = lay
  this.img = app.CreateImage( null, 0.7, 0.15 )
  this.bt = app.GetBatteryLevel()*100
  this.showpercents = (options&&options.showpercents)
  this.update()
 }
 show(){
  this.lay.AddChild( this.img )
 }
 hide(){
  this.lay.RemoveChild( this.img )
 }
 update(){
  this.bt = (app.GetBatteryLevel()*100).toFixed(0)
  this.img.SetPaintStyle( "Line" )
	this.img.SetLineWidth( 10 )
	this.img.DrawRectangle( 0,0,0.95,1 )
	this.img.SetPaintStyle( "Fill" )
	this.img.DrawRectangle( 0.97,0.35,1,0.65 )
	this.img.DrawRectangle( 0.03,0.055,0.92*(this.bt/100),0.95 )
	if(this.showpercents){
	  this.img.SetPaintColor("#797979")
	  this.img.SetTextSize(42)
	  this.img.DrawText(this.bt+"%",0.35,0.58)
	}
 }
 raw(){
   return this.img
 }
 setsize(w,h) {
   this.img.SetSize(w,h)
   this.update()
 }
}

class RammerToggle{
  constructor(lay){
    this.lay = lay
    this.imgs = ["Img/swon.png","Img/swoff.png"]
    this.switched = false
    this.ontouch=(e)=>{}
    this.img = app.CreateImage( this.imgs[1], 0.2 )
    this.initial = this.img.GetWidth()/this.img.GetHeight()
    //alert((this.img.GetAbsWidth()/this.img.GetAbsHeight())+"=>"+(this.img.GetWidth()/this.img.GetHeight()))
    this.img.SetOnTouchUp(()=>{this.toggle()})
  }
  show(){
    this.lay.AddChild(this.img)
  }
  hide(){
    this.lay.RemoveChild(this.img)
  }
  toggle(){
    this.switched=!this.switched
    this.img.SetImage( this.switched?this.imgs[0]:this.imgs[1] )
    this.ontouch(this.switched)
  }
  setsize(w,h){
    this.img.SetSize(w,h)
  }
  setsizenorm(s){
    this.img.SetSize(s,s/(this.initial))
  }
  setontouch(func){
    this.ontouch=func
  }
}


class RammerHorizontalSlider {
constructor(lay) {
  this.lay = lay
  this.l = app.CreateLayout( "Card", "Horizontal" )
	this.l.SetCornerRadius( 20 )
  this.l.SetBackColor( "#777777" )
	this.l.SetSize( 0.7,0.11 )
	
	this.range = 1
	this.onchange = function(e){}
	this.ak = app.CreateImage( null, 1, 1, "FontAwesome" )
	this.drawown = function(e){}
	this.ak.SetAutoUpdate( false )
	this.ak.onchange = this.onchange
	this.ak.drawown = this.drawown
	this.ak.SetOnTouchMove( (e)=>{
	  this.ak.Clear()
	  this.ak.DrawRectangle(0,0,e.X,1)
	  this.drawown(this.ak,(this.range/this.l.GetWidth())*e.X)
	  this.ak.Update()
	  if(e.X<this.l.GetWidth()){
	    this.onchange((this.range/this.l.GetWidth())*e.X)
	  }
	})
	this.l.AddChild( this.ak )
}
setsize(w,h) {
  this.l.SetSize( w,h )
}
show(){
  this.lay.AddChild(this.l)
  this.ak.drawown(this.ak,0)
  this.ak.Update()
}
hide(){
  this.lay.RemoveChild(this.l)
}
setonchange(func){
  this.onchange = func
  this.ak.onchange = func
}
setdrawown(func){
  this.drawown = func // to be fixed
  this.ak.drawown = func // to be fixed
}
setrange(r){
  this.range = r
}
raw(){
 return this.ak
}
}

function RammerTerminal_GetTerminals(){
'use strict'
let tmp = []
for(i=0;i<rammer.appstack.length;i++){
  if(rammer.appstack[i].txt==(lang=="ru"?"Терминал":"Terminal")){
    tmp.push(rammer.appstack[i])
  }
  //alert(rammer.appstack[i].txt)
}
return tmp
}

function RammerTerminal_GetCurrentTerminal(){
'use strict'
let tmp = RammerTerminal_GetTerminals();
return tmp[tmp.length-1]
}

function RammerTerminal_Print(str){
  'use strict'
  let term = RammerTerminal_GetCurrentTerminal()
  let Rlay = term.cmdl
  Rlay.SetText(Rlay.GetText()+str+"\n")
  return ""
}

class RammerProgressBarLoadingAnim{
  constructor(lay,w){
    this.lay = lay
    this.img = app.CreateImage(null,w,0.01)
    this.img.SetAutoUpdate(false)
    this.ticks = 0
    this.added = false
    this.width = 0.5
  }
  start(){
    this.an = setInterval(()=>{
      this.img.Clear()
      this.img.SetPaintColor("gray")
      this.img.DrawRectangle(0,0,1,1)
      this.img.SetPaintColor("white")
      this.img.DrawRectangle((this.ticks/100)-this.width,0,this.ticks/100,1)
      this.img.Update()
      this.ticks+=3.5
      if(this.ticks>150){ this.ticks=0 }
    },1000/30)
  }
  stop(){
      this.img.Clear()
      this.img.SetPaintColor("gray")
      this.img.DrawRectangle(0,0,1,1)
      this.img.SetPaintColor("white")
      this.img.DrawRectangle((this.ticks/100)-this.width,0,this.ticks/100,1)
      this.img.Update()
      this.ticks+=3.5
      if(this.ticks>150){ this.ticks=0 }
    clearInterval(this.an)
  }
  show(){
    if(!this.added) { this.lay.AddChild(this.img); this.start() }
  }
}

function RammerDownload_Confirm(url,path,name) {
  'use strict'
  let ldr = app.CreateDialog( "Download" )
	let ldr_lay = app.CreateLayout( "Linear", "VCenter" )
	ldr_lay.SetSize( 0.9,0.2 )
	ldr.AddLayout( ldr_lay )
	
  let ldr_lay_name = app.CreateLayout( "Linear", "Horizontal" )
	let ldr_lay_name_text = app.CreateText( "Name: " )
	ldr_lay_name_text.SetMargins( 0, 0.007 )
	ldr_lay_name_text.SetTextSize( 18 )
	ldr_lay_name.AddChild( ldr_lay_name_text )
	
	let ldr_lay_name_name = app.CreateTextEdit( name )
	ldr_lay_name_name.SetSize( 0.7 )
	ldr_lay_name.AddChild( ldr_lay_name_name )
	ldr_lay.AddChild( ldr_lay_name )
	
	let ldr_lay_path = app.CreateLayout( "Linear", "Horizontal" )
  let ldr_lay_path_text = app.CreateText( "Path: " )
	ldr_lay_path_text.SetMargins( 0, 0.007 )
	ldr_lay_path_text.SetTextSize( 18 )
	ldr_lay_path.AddChild( ldr_lay_path_text )
	
	let ldr_lay_path_path = app.CreateTextEdit( path )
	ldr_lay_path_path.SetSize( 0.7 )
	ldr_lay_path.AddChild( ldr_lay_path_path )
	ldr_lay.AddChild( ldr_lay_path )
	
	let ldr_lay_btns = app.CreateLayout( "Linear", "Horizontal" )
	let ldr_lay_btns_cancel = app.CreateButton( "Cancel" )
	ldr_lay_btns_cancel.dlg = ldr
	ldr_lay_btns_cancel.SetOnTouch( function(){
	  this.dlg.Dismiss()
	})
	ldr_lay_btns.AddChild( ldr_lay_btns_cancel )
	ldr_lay.AddChild( ldr_lay_btns )
	
  let ldr_lay_btns_dwn = app.CreateButton( "Download" )
	ldr_lay_btns_dwn.dlg = ldr
	ldr_lay_btns_dwn.SetOnTouch( function(){
	  this.dlg.Dismiss()
	  let jdwn = app.CreateDownloader(  )
	  jdwn.SetOnError( function(e){
	    alert("Error: "+e)
	  })
	  jdwn.Download( url, ldr_lay_path_path.GetText(), name )
	})
	ldr_lay_btns.AddChild( ldr_lay_btns_dwn )
	ldr_lay.AddChild( ldr_lay_btns )
	ldr.Show()
}

class RammerService{
  constructor(app,title){
    this.fstart=function(){}
    this.fstop=function(){}
    this.app=app
    this.title=title
    this.state = "unused"
    RammerServices.push(this)
    this.num = RammerServices.length-1
  }
  
  start(){
    this.fstart()
    this.state="running"
  }
  
  stop(){
    this.fstop()
    this.state="stopped"
    RammerServices.splice(this.num,1)
  }
}

function Rammer_FindService(title){
  for(i in RammerServices){
    if(title==RammerServices[i].title){
      return RammerServices[i]
    }
  }
}


function RammerVFSList(){
  return RammerVirtualFS
}

function RammerVFSExists(path){
  return RammerVFSGet(path)!=null
}

function RammerVFSGet(fld) {
  'use strict'
  let wd = fld.split("/")
  wd = wd.filter(i=>i!=="")
  let nav = RammerVirtualFS['/']
  if(wd.length==0) {
    return nav
  }
  for(let i in wd) {
    //RammerTerminal_Print("Scanning "+wd[i]+"...")
    if(typeof nav['contents'][wd[i]] == "undefined") {
      return null
    }
    nav = nav['contents'][wd[i]]
  }
  return nav
}

function RammerVFSMkdir1(fld) {
  'use strict'
  let cwd = RammerVirtualFSCWD+fld
  cwd = cwd.split("/")
  if(fld.split("/").length>(fld[0]=="/"?2:1)) {
    RammerTerminal_Print("Could not create subdirs in Mkdir1")
    return
  }
  cwd = cwd.filter(item=>item!=="")
  let navig = "/"+cwd.splice(0,cwd.length-1).join("/")
  
  let folder = RammerVFSGet(navig)
  folder['contents'][cwd] = {
    'type':'folder',
    'datetime':new Date(),
    'contents':{}
  }
  return [navig, cwd] // Navigate to [0] and create [1]
}

function RammerVFSMkdir(folder){
  'use strict'
  let oldcwd = RammerVirtualFSCWD
  let fld = folder.split("/")
  fld = fld.filter(i=>i!=="")
  for(let i in fld) {
    RammerVFSMkdir1(fld[i])
    RammerVirtualFSCWD+=fld[i]+"/"
    //RammerTerminal_Print("Now CWD is: "+RammerVirtualFSCWD)
  }
}