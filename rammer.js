// Rammer by Andrey Pavlenko
// Testing by Nikita Serkov and Nazar Prokudin
// Translated to English by Andrey Pavlenko

// The Rammer Project 2020

/*
Sounds from "Notification Sounds"
https://notificationsounds.com/
*/

// Смена языка не реализована
app.SetDebugEnabled( false )
const version = "4.1.9"
var codename, buildnumber, funnyphrase, isbeta, background_default = null
var background, defaulturl, RammerDaysOfWeek = null
var tmp_data, app_data, lang, notification = null
var repeat_music, RammerChargeTrackerMgr, show_bp, bootanimationtime, RammerOrientTrackerMgr__ = null
var RammerScreenWidth = app.GetScreenWidth(  );
var RammerScreenHeight = app.GetScreenHeight(  )
var mainscr, procs, notifs,  synth, cmd_data = null;
var RammerChargeTrackerProg = null
app.LoadScript( "builtins.js" );
// ^^^ после обновления, выдавалась ошибка, так что был поставлен 'use strict' // after update rammer crashes wirh error, i put 'use strict' to a start of builtins.js
function init_vars() {
codename = "Abra"
buildnumber = "Mainline" // Build Number turns into Version Stage
// По JS дни начинаются с воскресенья // In JS days starts from Sunday
RammerDaysOfWeek = [
{ru:"Воскресенье",en:"Sunday"},
{ru:"Понедельник",en:"Monday"},
{ru:"Вторник",en:"Tuesday"},
{ru:"Среда",en:"Wednesday"},
{ru:"Четверг",en:"Thursday"},
{ru:"Пятница",en:"Friday"},
{ru:"Суббота",en:"Saturday"}
]
bootcode = true
fastboot = true
bootanimationtime = fastboot?0:7000
notification = ""
isbeta = true
tmp_data = {}
app_data = {}
// From the future: "It needs to be optimized! I'll help-p you"
rammer = {}
rammer.appstack=[]
RammerChargeTrackerMgr = app.GetChargeType()
RammerOrientTrackerMgr__ = app.GetOrientation()
lang=app.LoadText( "syslang",(app.GetLanguage()=="русский"?"ru":"en"));
rammer_def_config = {"style":{"wireless":{"show":true},"battery":{"show":true,"percents":true}},"sounds":{"notifications":"Snd/notification.mp3"}}
rammer_config = app.FileExists( "config.json" )?JSON.parse(app.ReadFile( "config.json" )):rammer_def_config

funnyphrase = lang=="ru"?"Когда-нибудь будет 4.2":"From TikTok: Russia ia the best AMERICAN state in Ukraine"
background_default = "/Sys/Img/GreenBack.jpg"
background = app.LoadText( "background","/Sys/Img/GreenBack.jpg" )
dir = ["sdcard","Rammer"]
dirf = ["sdcard","Rammer"]
defaulturl = "Html/wygl_start_page.html"
procs = []
notifs = []
RammerSystem_ReloadEl()
bpl=app.GetOrientation()=="Portrait"?4:7
extappslist = app.ListFolder( "/"+ToFolder(Array.prototype.concat(dirf,['Apps'] ) ))
synth = app.CreateSynth();
RammerMonths=[
{ru:"Январь",en:"January"},
{ru:"Февраль",en:"February"},
{ru:"Март",en:"March"},
{ru:"Апрель",en:"April"},
{ru:"Май",en:"May"},
{ru:"Июнь",en:"June"},
{ru:"Июль",en:"July"},
{ru:"Август",en:"August"},
{ru:"Сентябрь",en:"September"},
{ru:"Октябрь",en:"October"},
{ru:"Ноябрь",en:"November"},
{ru:"Декабрь",en:"December"}
]
}

function RammerSystem_ReloadEl()
{
	el = [
{name:{ru:"Музыка",en:"Music"},func:music_activity,custom:false,icon:"Sys/Icon/music.png"}, /* Иконки есть!!! :) */
{name:{ru:"Файлы",en:"Files"},func:files_activity,custom:false,icon:"Sys/Icon/files.png"},
{name:{ru:"Фото",en:"Photos"},func:photo_activity,custom:false,icon:"Sys/Icon/photos.png"},
{name:{ru:"Камера",en:"Camera"},func:camera_activity,custom:false,icon:"Sys/Icon/camera.png"},
{name:{ru:"IPTV",en:"IPTV"},func:livevideoapp,custom:false,icon:"Sys/Icon/iptv.png"},
{name:{ru:"Заметки",en:"Notes"},func:notes_activity,custom:false,icon:"Sys/Icon/notes.png"},
{name:{ru:"Калькулятор",en:"Calculator"},func:calc_activity,custom:false,icon:"Sys/Icon/calculator.png"},
{name:{ru:"О системе",en:"About system"},func:showinfo,custom:false,icon:"Sys/Icon/about_system.png"},
{name:{ru:"Обои",en:"Wallpapers"},func:changewallpapers,custom:false,icon:"Sys/Icon/wallpaper.png"},
{name:{ru:"Текстовый редактор",en:"TextPad"},func:textpad,custom:false,icon:"Sys/Icon/textpad.png"},
{name:{ru:"Обновления",en:"Updates"},func:updates_app,custom:false,icon:"Sys/Icon/updates.png"}
]
}

// END INIT VARS
_setInterval =  setInterval;
setInterval = function(callback,timer,name) {
const handler = _setInterval(callback, timer);
procs.push({
"handler": handler,
"callback": callback,
"timer": timer,
"name": name
})
return handler;
}

_clearInterval =  clearInterval;
clearInterval = function(id) {
const handler = _clearInterval(id);
for(i=0;i<procs.length;i++) {
if(procs[i].handler==id) {
if(i==0) { procs.shift() }else{ procs.splice(i,1); }
}}
return handler;
}

function OnStart()
{
init_vars()

	lay = app.CreateLayout( "linear", "Vertical,fillxy,top" );

if(bootcode) {
layboot = app.CreateLayout( "Linear", "VCenter,fillxy" );
layboot.SetBackColor( "black" );
app.AddLayout( layboot );
bootprogress = new RammerBootProgressBar(layboot);
bootprogress.show()
boottxtstatus = app.CreateText( "Loading" )
layboot.AddChild( boottxtstatus )
setTimeout(function(){boottxtstatus.SetText("Loading (20%)"); bootprogress.update(20)},300)
setTimeout(function(){
boottxtstatus.SetText("Loading (100%)");
bootprogress.update(100)
bootprogress.hide()
layboot.RemoveChild( boottxtstatus )
bootanim = app.CreateVideoView( 1.1,1 );
bootanim.SetFile( "Vid/bootanimation.mp4" );
layboot.AddChild( bootanim );
bootanim.Play();
},500)

setTimeout(function() {
app.RemoveLayout(layboot);
delete bootanim
lay.Animate("FadeIn",function(){},500)
app.AddLayout( lay );
},bootanimationtime)
}else{
lay.Animate("FadeIn",function(){},500)
app.AddLayout( lay )
}
folder="/sdcard/Rammer/"
// ВЫГЛЯДИТ КАК РАБОТА ПЕРФЕКЦИОНИСТА В СЕРВЕРНОЙ
if (!app.FolderExists(folder)) app.MakeFolder( folder )
if (!app.FolderExists(folder+"/Music/")) app.MakeFolder( folder+"/Music/" )
if (!app.FolderExists(folder+"/Pictures/")) app.MakeFolder( folder+"/Pictures/" )
if (!app.FolderExists(folder+"/Apps/")) app.MakeFolder( folder+"/Apps/" )
if (!app.FolderExists(folder+"/Video/")) app.MakeFolder( folder+"/Video/" )
if (!app.FolderExists(folder+"/Mods/")) app.MakeFolder( folder+"/Mods/" )
if (!app.FolderExists(folder+"/Temps/")) app.MakeFolder( folder+"/Temps/" )
if (!app.FolderExists(folder+"/AppData/")) app.MakeFolder( folder+"/AppData/" )
if (!app.FolderExists(folder+"/Pictures/Wallpapers/")) app.MakeFolder( folder+"/Pictures/Wallpapers/" )

audioPlayer = app.CreateMediaPlayer();
soundPlayer = app.CreateMediaPlayer();
soundPlayer1 = app.CreateMediaPlayer();
notifSound = app.CreateMediaPlayer();
extappslist = app.ListFolder( "/"+ToFolder(Array.prototype.concat(dirf,['Apps'] ) ))

for(i=0;i<extappslist.length;i++) {
(function(eu){
elnew  =  {
		name:{
			ru:eu,
			en:eu
		},
		func:RammerAppRunnerUglyFix, // it's a ugly fix
		custom: true,
		icon:app.FileExists( "/sdcard/Rammer/Apps/"+eu+"/icon.png")?"/sdcard/Rammer/Apps/"+eu+"/icon.png":"Sys/Icon/unknown.png"
	}
})(extappslist[i]);
el.push(elnew)
}

laymainbtns = app.CreateLayout( "linear", "Horizontal,fillxy,Bottom" );
lay.SetBackground( background );

layother = app.CreateLayout( "Linear", "Vertical" );

buttonphone = app.CreateLayout( "Linear", "Vertical" )
buttonphone_i = app.CreateImage( "Sys/Icon/phone.png", RammerScreenHeight>RammerScreenWidth?0.16:0.08, RammerScreenHeight>RammerScreenWidth?(0.16/(RammerScreenHeight/RammerScreenWidth)):(0.08/(RammerScreenHeight/RammerScreenWidth)) )
buttonphone_t = app.CreateText( lang=="ru"?"Телефон":"Phone" );
buttonphone.AddChild( buttonphone_i )
buttonphone.AddChild( buttonphone_t )
buttonphone_i.SetOnTouchDown( phone )
laymainbtns.AddChild( buttonphone );

buttonbrowser = app.CreateLayout( "Linear", "Vertical" )
buttonbrowser_i = app.CreateImage( "Sys/Icon/web.png", RammerScreenHeight>RammerScreenWidth?0.16:0.08, RammerScreenHeight>RammerScreenWidth?(0.16/(RammerScreenHeight/RammerScreenWidth)):(0.08/(RammerScreenHeight/RammerScreenWidth)))
buttonbrowser_t = app.CreateText( lang=="ru"?"Браузер":"Browser" );
buttonbrowser.AddChild( buttonbrowser_i )
buttonbrowser.AddChild( buttonbrowser_t )
buttonbrowser_i.SetOnTouchDown( browser_activity )
laymainbtns.AddChild( buttonbrowser );
buttonphone.SetMargins( 0.03, 0.01, 0.01, 0.01 );
buttonbrowser.SetMargins( 0.03, 0.01, 0.01, 0.01 );

layotherstatusbar = app.CreateLayout( "linear", "horizontal,left" );
layotherstatusbar.SetSize( 1,0.04 );
layother.AddChild( layotherstatusbar );

layotherothbar = app.CreateLayout( "linear", "horizontal,left" );
layotherothbar.SetSize( 0.06,0.04  );
layotherstatusbar.AddChild( layotherothbar );

txttimeonbar = app.CreateText( "" )
txttimeonbar.SetFontFile( "Misc/digital-7.ttf" )
txttimeonbar.SetTextSize( 22 )
txttimeonbar.SetTextColor( "#ffffff" )
txttimeonbar.SetMargins( 0.01, 0.002, 0.01, 0 )

textapp = app.CreateText( lang=="ru"?"Рабочий стол":"Desktop" )
textapp.SetTextSize( 19 )
textapp.plo = function(a,b){
if(a!=(lang=="ru"?"Нет приложений":"No Apps")){
//this.Dismiss() // because this object is ListDialog //BUG: Object is damaged and Object.keys returns an array of numbers. 
alert(a)
}
}

textapp.SetMargins( 0.004,-0.005, 0.009,0 )
layotherothbar.AddChild( textapp )

layothermainbar = app.CreateLayout( "Linear", "Horizontal,right" );
layothermainbar.SetSize( 0.4,0.04 );
layotherstatusbar.AddChild( layothermainbar );

/*
TO BE RE-IMPLEMENT. DO NOT UNCOMMENT!
settingsbtn = app.CreateButton( lang=="ru"?"Настройки":"Settings" );
procmanbtn = app.CreateButton( "ProcMan" );
*/
buttonphone.SetOnTouch( phone );
buttonbrowser.SetOnTouch( browser_activity );

lay.AddChild( layother );
lay.AddChild( laymainbtns );

txttime = app.CreateText( "" );
txttime.SetTextSize( app.GetOrientation()=="Landscape"?30:38 );
layother.AddChild( txttime );
txttime.SetFontFile( "Misc/19809.otf" )

	txtdate = app.CreateText( "" );
txtdate.SetTextSize( 20 );
layother.AddChild( txtdate );
txtdate.SetFontFile( "Misc/19809.otf" )

	txtnotif = app.CreateText( "" );

txtnotif.SetTextSize( 24 );
layother.AddChild( txtnotif );

layotherhoz = app.CreateLayout( "Linear", "Horizontal" );

layother.AddChild( layotherhoz );
layotherstatusbar.SetSize( 1,0.04 );
layotherothbar.SetSize( 0.6,0.04 );
layothermainbar.SetSize( 0.4, 0.04 );
txtrebootopts = app.CreateText( "[fa-repeat]", null, null, "FontAwesome" )
txtrebootopts.SetOnTouchDown( ()=>{
this.op = app.CreateListDialog( lang=="ru"?"Выключение":"Power off",[lang=="ru"?"Выключение":"Power off",lang=="ru"?"Перезагрузка":"Reboot"] )
this.op.SetOnTouch((z)=>{
if(z==(lang=="ru"?"Выключение":"Power off")) {
shutdown_animation()
shutdown()
}else{
shutdown()
background, defaulturl  = null
tmp_data, app_data, notification = null 
listmenu = null
OnStart()
}
})
this.op.Show()
} )
layothermainbar.AddChild( txtrebootopts );
txtrebootopts.SetTextColor( "white" );
txtrebootopts.SetTextSize( 19 );
txtrebootopts.SetMargins( 0, 0.0025, 0.005, 0 )

txtwireless = app.CreateText( "", null, null, "FontAwesome" );
if(rammer_config.style.wireless.show){layothermainbar.AddChild( txtwireless )}
txtwireless.SetTextColor( "white" );
txtwireless.SetTextSize( 19 );
txtwireless.SetMargins( 0, 0.004, 0, 0 )

txtbattery = app.CreateText( "", null, null, "FontAwesome" )
layothermainbar.AddChild( txtbattery );
txtbattery.SetTextColor( "white" );
txtbattery.SetTextSize( 19 );
txtbattery.SetMargins( 0, 0.00225, 0.005, 0 )

layotherwgt = app.CreateLayout( "Linear", "Horizontal" );
check_wgts()
layother.AddChild( layotherwgt );

layapppicker = app.CreateLayout( "Linear", "Vertical,Left" )
scrlapppicker = app.CreateScroller( 1,0.64 )
scrlapppicker.SetMargins( 0.06, 0, 0, 0 )
scrlapppicker.AddChild( layapppicker )
layother.AddChild( scrlapppicker )

calltime()
calltime_int = setInterval(calltime,1000)

// like a love song on radio!
for(i=0;i<el.length;i++) {
(function(pa){
if(i%bpl==0) {
layiconshoriz= app.CreateLayout( "Linear", "Horizontal" );
layapppicker.AddChild( layiconshoriz );
}
__lay__ = app.CreateLayout( "Linear", "Vertical" );
__lay__.SetSize( app.GetOrientation()=="Portrait"?0.185:0.125, RammerScreenHeight>RammerScreenWidth?0.265/(RammerScreenHeight/RammerScreenWidth):0.1325/(RammerScreenHeight/RammerScreenWidth) )

icon = app.CreateImage( typeof(pa.icon)=="undefined"?null:pa.icon, RammerScreenHeight>RammerScreenWidth?0.16:0.08, RammerScreenHeight>RammerScreenWidth?0.16/(RammerScreenHeight/RammerScreenWidth):0.08/(RammerScreenHeight/RammerScreenWidth));
icon.runnbl = pa.name
icon.about = pa
icon.SetOnLongTouch( RammerSystem_AppOperation )
text = app.CreateText( lang=="ru"?pa.name.ru:pa.name.en, null, null, "Multiline" )
icon.SetOnTouchUp( pa.func );
//icon.SetOnLongTouch( function(){} )
if(el[i].name.ru.length>16||el[i].name.en.length>16){text.SetText( text.GetText().slice(0,16)+"..." )}
__lay__.AddChild( icon );
__lay__.AddChild( text );
__lay__.SetMargins( 0.02, 0, 0.016, 0.01 );
layiconshoriz.AddChild( __lay__ );
})(el[i]);
}

for(i in app.ListFolder( "/sdcard/Rammer/Mods/",null,null,"Files" )) {
setTimeout(function(){
try {
eval( app.ReadFile( "/sdcard/Rammer/Mods/"+app.ListFolder( "/sdcard/Rammer/Mods/" )[i]) )
}catch(e) { alert("Error while loading module "+app.ListFolder( "/sdcard/Rammer/Mods/" )[i]+": "+e) }
},bootanimationtime)
}
// END OF OnStart()
setTimeout("RammerSystem_CheckUpdates()",bootanimationtime+10000)
}

function RammerAppRunnerUglyFix()
{
	runapp(lang=="ru"?this.runnbl.ru:this.runnbl.en)
}

function RammerNotifyPopup(title,text)
{
	rammer_message(title+"\n"+text);
}

function RammerSystem_CheckUpdates()
{
//  RammerNotify("System","Update available!","Img/rammer.png",()=>{})
}

function RammerSystem_ReloadDesktop()
{
  bpl=app.GetOrientation()=="Portrait"?4:7
	RammerSystem_ReloadEl()
	extappslist = app.ListFolder( "/"+ToFolder(Array.prototype.concat(dirf,['Apps'] ) ))

	for(i=0;i<extappslist.length;i++) {
(function(eu){
elnew  =  {
		name:{
			ru:eu,
			en:eu
		},
		func:RammerAppRunnerUglyFix, // it's a ugly fix
		custom:true,
		icon:app.FileExists( "/sdcard/Rammer/Apps/"+eu+"/icon.png")?"/sdcard/Rammer/Apps/"+eu+"/icon.png":"Sys/Icon/unknown.png"
	}
})(extappslist[i]);
el.push(elnew)
}

scrlapppicker.RemoveChild( layapppicker )
layapppicker = app.CreateLayout( "Linear", "Vertical,Left" )

	for(i=0;i<el.length;i++) {
(function(pa){
if(i%bpl==0) {
layiconshoriz= app.CreateLayout( "Linear", "Horizontal" );
layapppicker.AddChild( layiconshoriz );
}
__lay__ = app.CreateLayout( "Linear", "Vertical" );
__lay__.SetSize( app.GetOrientation()=="Portrait"?0.185:0.125, app.GetOrientation()=="Portrait"?0.265/(RammerScreenHeight/RammerScreenWidth):0.1325/(RammerScreenHeight/RammerScreenWidth) )

icon = app.CreateImage( typeof(pa.icon)=="undefined"?null:pa.icon, app.GetOrientation()=="Portrait"?0.16:0.15, app.GetOrientation()=="Portrait" ?0.16/(RammerScreenHeight/RammerScreenWidth):0.15/(RammerScreenHeight/RammerScreenWidth));
icon.runnbl = pa.name
icon.about = pa
icon.SetOnLongTouch( RammerSystem_AppOperation )
text = app.CreateText( lang=="ru"?pa.name.ru:pa.name.en, null, null, "Multiline" )
icon.SetOnTouchUp( pa.func );
//icon.SetOnLongTouch( function(){} )
if(el[i].name.ru.length>16||el[i].name.en.length>16){text.SetText( text.GetText().slice(0,16)+"..." )}
__lay__.AddChild( icon );
__lay__.AddChild( text );
__lay__.SetMargins( 0.02, 0, 0.016, 0.01 );
layiconshoriz.AddChild( __lay__ );
})(el[i]);
}
scrlapppicker.AddChild( layapppicker )
}

function RammerNotify(title, text, icon, ontouch, sound)
{
_notifyimg = app.CreateImage( icon, 0.045 )
_notifyimg.SetMargins( 0.01, 0, 0, 0 );
//_notifyimg.Animate( "ZoominEnter",null,1000 );
_notifyimg.title=title
_notifyimg.text=text
_notifyimg.ontouch = ontouch
layotherothbar.AddChild( _notifyimg );
_notifyimg.SetOnTouchDown( function() {
  if(typeof(this.ontouch)!="null") {
  this.ontouch()
  }
  this.Animate( "ZoominExit" );
layotherothbar.RemoveChild( this );
})
if(typeof(sound)!="undefined") {
notifSound.Stop()
notifSound.SetFile( sound );
}else{
notifSound.Stop()
notifSound.SetFile( rammer_config.sounds.notifications );
}
notifSound.SetOnReady( function() {
notifSound.Play();
});
RammerShowNotifyPopup(title,text,icon,ontouch)
}

function RammerMusicPlayerPopup(file) {
laympp = app.CreateLayout( "Linear", "VCenter,fillxy" );
laympp1 = app.CreateLayout( "Linear", "VCenter" );
laympp1.SetBackColor( "white" );
laympp_txt = app.CreateText( "" );
laympp1.AddChild( laympp_txt );
laympp_clbt = app.CreateButton( "[fa-close]", null, null, "FontAwesome" );
laympp_clbt.SetOnTouch( function (){
audioPlayer.Stop();
app.RemoveLayout( laympp );
});
laympp1.AddChild( laympp_clbt );
if(typeof(file)!="undefined") {
laympp_txt.SetText( file );
audioPlayer.SetFile( file );
audioPlayer.SetOnReady( function() {
audioPlayer.Play( 0 );
} );
audioPlayer.SetOnComplete( function() {
audioPlayer.Stop();
app.RemoveLayout( laympp );
} );
app.AddLayout( laympp );
}else{
app.ShowPopup( "No file selected!" ); // if bug appears
}
laympp.SetBackColor( "black" );
laympp.SetBackAlpha( 0.30 );
laympp.Animate( "FadeIn" );
laympp.AddChild( laympp1 );
}

function _getlevel(num) {
if(num<=25) {return "1"}
if(num>=25) {return "2"}
if(num>=50) {return "3"}
if(num>=75) {return "4"}
}

function calltime()
{
RammerTime = new Date()
RammerDay = RammerTime.getDate()
RammerMonth = RammerTime.getMonth()+1
RammerYear = RammerTime.getFullYear()
txtnotif.SetText( notification );
if(app.FileExists( "/sys/class/power_supply/battery/BatteryAverageCurrent")) {
  if(app.GetChargeType()!="None") {
  if(app.ReadFile( "/sys/class/power_supply/battery/BatteryAverageCurrent" )!="0") {
    notification = app.ReadFile( "/sys/class/power_supply/battery/BatteryAverageCurrent" )+"mA"
}
}else{ notification="" }
}
txttime.SetText( RammerTime.getHours()+":"+(RammerTime.getMinutes()<10?"0"+RammerTime.getMinutes():""+RammerTime.getMinutes()));
txttimeonbar.SetText(RammerTime.getHours()+":"+(RammerTime.getMinutes()<10?"0"+RammerTime.getMinutes():""+RammerTime.getMinutes()))
if(lang=="ru") {
txtdate.SetText( RammerDaysOfWeek[ RammerTime.getUTCDay() ].ru+", "+RammerDay+" "+RammerMonths[RammerTime.getMonth()].ru+" "+RammerYear );
}else{
txtdate.SetText( RammerDaysOfWeek[ RammerTime.getUTCDay() ].en+", "+RammerDay+" of "+RammerMonths[RammerTime.getMonth()].en+" "+RammerYear ); // Вот так нас на английском учили
}
txtnotif.SetText( notification );
if( app.GetChargeType()!="None" ) {
 txtbattery.SetText( "[fa-battery-"+_getlevel(Math.ceil(app.GetBatteryLevel() * 100))+"][fa-bolt] "+Math.ceil(app.GetBatteryLevel() * 100)+"%" )
}else{
 txtbattery.SetText( "[fa-battery-"+_getlevel(Math.ceil(app.GetBatteryLevel() * 100))+"] "+Math.ceil(app.GetBatteryLevel() * 100)+"%" )
}
if(RammerChargeTrackerMgr!=app.GetChargeType()){
      if(app.GetChargeType()!="None") {
        soundPlayer1.SetFile( "Snd/charge_sound.mp3" )
        soundPlayer1.SetOnReady( function() {
          soundPlayer1.Play(  )
        } )
        try{
        RammerChargeTrackerProg()
        }catch(e){}
      }
  RammerChargeTrackerMgr = app.GetChargeType()
}
if(rammer_config.style.wireless.show){
if( app.IsWifiEnabled() == true ) {
txtwireless.SetText( "[fa-wifi] " );
}else if( app.IsWifiApEnabled() == true ) {
txtwireless.SetText( "AP " );
}
}

// ONLY IF CHANGE
if(RammerOrientTrackerMgr__!=app.GetOrientation()){
if( app.GetOrientation() == "Landscape" ) {
layotherstatusbar.SetSize( 1, 0.1 );
layotherothbar.SetSize( 0.55,0.1 );
layotherothbar.SetMargins( 0.02, 0, 0, 0 )
layothermainbar.SetSize( 0.4, 0.1  )
scrlapppicker.SetSize( 0.6, 0.34 )
layapppicker.SetSize( 0.6, 0.34 )
for(i=0;i<rammer.appstack.length;i++){
  rammer.appstack[i].raw().SetSize(1,0.94)
}
RammerSystem_ReloadDesktop()
}else{
try{
layotherstatusbar.SetSize( 1,0.035 );
layotherothbar.SetSize( 0.6,0.035 );
layotherothbar.SetMargins( 0, 0, 0, 0 )
layothermainbar.SetSize( 0.4, 0.035 );
scrlapppicker.SetSize( 1, 0.64 )
layapppicker.SetSize( 1, 0.64 )
for(i=0;i<rammer.appstack.length;i++){
  rammer.appstack[i].raw().SetSize(1,0.97)
}
RammerSystem_ReloadDesktop()
}catch(e){}
}
RammerOrientTrackerMgr__=app.GetOrientation()
}
// ...
}

function onchange(a,b,func,timer)
{
this.i=setInterval(function(){
	if(a!=b){
     a=b
     func()
  }
},1000,"OnChange process")
setTimeout(function(){clearInterval(this.i)},typeof(timer)=="undefined"?1000:timer)
}

function RammerSystem_AppOperation()
{
	'use strict'
	let _name = lang=="ru"?this.runnbl.ru:this.runnbl.en
	let _ab = this.about
	let appl_list = []
	
	if(typeof(_ab.custom)!="undefined"&&_ab.custom==true){appl_list.push(lang=="ru"?"Удалить":"Delete")}
	
	let actlist = app.CreateListDialog( lang=="ru"?("Приложение "+_name):(_name+" app"),appl_list);
	actlist.SetOnTouch( function(a){
	  if(a==(lang=="ru"?"Удалить":"Delete")){
	    if(typeof(_ab.custom)!="undefined"&&_ab.custom==true){
	      if(confirm("Do you want to delete this app? This operation cannot be undone")){
	        app.DeleteFolder( "/sdcard/Rammer/Apps/"+_name )
	        RammerSystem_ReloadDesktop()
	      }
	    }else{
	      alert("Cannot delete this app [ERR: SYSTEM_APP]")
	    }
	  }
	})
	actlist.Show()
}

function check_wgts()
{
	if(typeof(rammer.widget)!="undefined") {
layotherwgt.AddChild( rammer.widget )
}
}

function shutdown()
{
	clearInterval(calltime_int)
if( typeof(mpupdater)!="undefined" ) {
clearInterval( mpupdater )
}
lay.RemoveChild( laymainbtns );
lay.RemoveChild( layotherstatusbar );
app.RemoveLayout( lay );
laymainbtns = null
lay = null
audioPlayer.Stop();
soundPlayer.Stop();
soundPlayer1.Stop();
audioPlayer = null
soundPlayer = null
soundPlayer1 = null
mpscur = null
txttime = null
txtdate = null
txtnotif = null
layotherhoz = null
layother1hoz = null
buttonmusic = null
buttonfiles = null
buttoncamera = null
buttonphoto = null
buttonvideo = null
buttonvideolive = null
buttonnotes = null
buttonyoutube = null
textmps = null
layotherwgt = null
laystatus = null
laybtnsdraw = null
laybtnsdraw1 = null
infobtn = null
Appsbtn = null
lockscreenbtn = null
settingsbtn = null
reloadvarsbtn = null
layboot = null
delete lay
}

function rammer_show_dialog(text, func, timer, size)
{
	rammer_dialog = app.CreateDialog( "","notitle" );
rammer_dialog_lay = app.CreateLayout( "Linear", "Horizontal" );
rammer_dialog_lay.SetSize( size[0], size[1] );
rammer_dialog.AddLayout( rammer_dialog_lay );

rammer_text = app.CreateText( text );
rammer_dialog_lay.AddChild( rammer_text );
rammer_dialog.Show();
setTimeout(function() {
func()
rammer_dialog.Hide();
},timer)
}

function clear_interval_if_exists(interval)
{
	if( typeof(interval)!="undefined" ) {
clearInterval( interval )
return true
}else{
return false
}
}

function addclosebtn(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
delete lay;
	clear_interval_if_exists( tmp_data.musictimeint );
} );
}

function procman_activity()
{
layprocman = app.CreateLayout( "Linear", "Vertical,fillxy" );
layprocman.SetBackColor( "gray" );
	lst = app.CreateList( [],1 );
layprocman.AddChild( lst );
lmt = []
for(i=0;i<procs.length;i++) {
lmt.push("ID-> "+procs[i].handler+" Период-> "+procs[i].timer );
}
lst.SetList( lmt );
lst.SetOnTouch( function (a,b,c,d){
	alert(procs[d].callback);
});
lst.SetOnLongTouch( function (a,b,c,d) {
clearInterval(procs[d].handler);
lmt = []
for(i=0;i<procs.length;i++) {
lmt.push("ID-> "+procs[i].handler+" Период-> "+procs[i].timer );
}
lst.SetList( lmt );
} );
app.AddLayout( layprocman );
addclosebtn(layprocman);
}

function shutdown_animation(timer)
{
	shutdown_sound = app.CreateMediaPlayer();
shutdown_sound.SetFile( "Snd/shutdown.mp3" );
shutdown_sound.SetOnReady( function() { shutdown_sound.Play(0) } );
layshutdown = app.CreateLayout( "Linear", "VCenter,fillxy,top" );
layshutdown.Animate( "ZoomInEnter");
layshutdown.SetBackground( "Img/shutdown_background.jpg" );
laytextshut = app.CreateLayout( "Linear", "Horizontal,center" );
shutimage = app.CreateImage( "Misc/shutdown.gif", 0.05 );
if(lang=="ru") {
shuttxt = app.CreateText( " Выключение" );
}else{
shuttxt = app.CreateText( " Shutting down..." );
}
shuttxt.SetTextSize( 22 );
shuttxt.SetTextColor( "white" );
laytextshut.AddChild( shutimage );
laytextshut.AddChild( shuttxt );
layshutdown.AddChild( laytextshut );
textnamer = app.CreateText( "Rammer "+version );
textnamer.SetTextColor( "white" );
layshutdown.AddChild( textnamer );
app.AddLayout( layshutdown );
setTimeout(function() {
app.RemoveLayout( layshutdown );
},4000)
for(__=0;__<procs.length;__++){
  clearInterval(procs[__].handler)
}
}

function RammerShowNotifyPopup(title, text, icon, onclick)
{
layntf = app.CreateLayout( "Linear", "Horizontal,Top,Left" );
layntf.chck = false
layntf.SetSize( 1, null);
layntf.img = app.CreateImage( icon, 0.05 );
layntf.img.SetMargins( 0.025, 0.005, 0.025, 0.005 );
layntf.txt = app.CreateText( title+": "+text,null,null,"Multiline" );
layntf.txt.SetOnTouch(onclick)
layntf.txt.SetMargins( 0, 0.005, 0, 0.005 );
layntf.SetBackColor( "gray" );
(function(n){
_D3e7b__6m = setTimeout(function() { // Just obfuscated
try{
if(n.chck == false) {
app.RemoveLayout( n );
}
}
catch(e) {}
},2500);

})(layntf);
layntf.AddChild( layntf.img );
layntf.AddChild( layntf.txt );
	app.AddLayout( layntf );
}

function phone()
{
    phonenumber="" // to be fixed
    layphone = new RammerApp(lang=="ru"?"Телефон":"Phone");
     lphtxt = app.CreateLayout( "linear", "Horizontal" );	
 	 phonetxt = app.CreateText( "" );
    phonetxt.SetTextSize( 36 )
	  lphtxt.AddChild( phonetxt );
    layphone.AddChild( lphtxt );
    lph1 = app.CreateLayout( "linear", "Horizontal" );	
    PhoneAddButton(lph1,"1")
    PhoneAddButton(lph1,"2")
    PhoneAddButton(lph1,"3")
    layphone.AddChild( lph1 );
    lph2 = app.CreateLayout( "linear", "Horizontal" );	
    PhoneAddButton(lph2,"4")
    PhoneAddButton(lph2,"5")
    PhoneAddButton(lph2,"6")
    layphone.AddChild( lph2 );
    lph3 = app.CreateLayout( "linear", "Horizontal" );	
    PhoneAddButton(lph3,"7")
    PhoneAddButton(lph3,"8")
    PhoneAddButton(lph3,"9")
    layphone.AddChild( lph3 );
    lph4 = app.CreateLayout( "linear", "Horizontal" );	
    PhoneAddButton(lph4,"Call")
    PhoneAddButton(lph4,"0")
    PhoneAddButton(lph4,"<<<")
    layphone.AddChild( lph4 );
    lph5 = app.CreateLayout( "linear", "Horizontal" );
    layphone.AddChild( lph5 );
    layphone.show()
    this.cb = new RammerCloseButton(layphone)
    //this.cb.SetAdditional(()=>{alert("additional")})
    this.cb.raw().SetSize(0.9,null)
    this.cb.show()
}

function PhoneAddButton( lay, name )
{
	btn = app.CreateButton( name, 0.25, 0.125, "Alum" );
  btn.SetTextSize( btn.GetTextSize()+6 )
	btn.SetOnTouch( function(){
		app.Vibrate( "0,100" );
	btn = this;
var nmb = btn.GetText()
if( nmb == "<<<" ) {
phonenumber = ""
} else if( nmb == "Call" ) {
alert( phonenumber )
app.Call( phonenumber )
phonenumber = ""
} else {
phonenumber+=nmb
}
phonetxt.SetText( phonenumber );
	});
	lay.AddChild( btn );
}

function rammer_error(err)
{
errdialog = app.CreateDialog( "", "NoTitle");
laydialogerr = app.CreateLayout( "Linear", "Vertical" );
txterrdialog = app.CreateText( "Ошибка: "+err, null, null, "FontAwesome,Multiline" );
txterrdialog.SetTextSize( 26 );
laydialogerr.AddChild( txterrdialog );
buttonerrdialog = app.CreateButton( "OK" );
buttonerrdialog.SetOnTouch( function() {
errdialog.Dismiss();
});
laydialogerr.AddChild( buttonerrdialog );
errdialog.AddLayout( laydialogerr );
errdialog.Show();
}

function rammer_message(msg)
{
msgdialog = app.CreateDialog( "", "NoTitle");
laydialogmsg = app.CreateLayout( "Linear", "Vertical" );
txtmsgdialog = app.CreateText( msg, null, null, "FontAwesome,Multiline" );
txtmsgdialog.SetTextSize( 26 );
laydialogmsg.AddChild( txtmsgdialog );
buttonmsgdialog = app.CreateButton( "OK" );
buttonmsgdialog.SetOnTouch( function() {
try{
msgdialog.Dismiss();
delete msgdialog;
}
catch(e) {}
});
laydialogmsg.AddChild( buttonmsgdialog );
msgdialog.AddLayout( laydialogmsg );
msgdialog.Show();
}

function addclosebtnbrowser(lay)
{
	closebtn = app.CreateButton( "Закрыть", null, 0.06 );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
try{
// FIXME: browser not closing on large sites
app.RemoveLayout( lay )
lay = null
delete browser;
}
catch(e) {}
} );
}

function browser_activity(url)
{
	laybrowser = new RammerApp("Browser - SurfIt")
browser = app.CreateWebView( 1,0.83, "IgnoreErrors" );
gobtn = app.CreateButton( "[fa-arrow-up]",0.125,0.07,"FontAwesome" );
laybrowserhoz = app.CreateLayout( "Linear", "Horizontal" );
laybrowserhoz1 = app.CreateLayout( "Linear", "Horizontal" );
addressurlbar = app.CreateTextEdit( defaulturl, 0.6, null, "SingleLine" );
backbtnbrowser = app.CreateButton( "[fa-arrow-left]",0.125, 0.07, "FontAwesome" );
backbtnbrowser.SetOnTouch(function(){browser.Back()});
gobtn.SetOnTouch( function () {
browser.LoadUrl(addressurlbar.GetText())
});
menubrowse = app.CreateButton( "[fa-bars]",0.125,0.07,"FontAwesome" );
browlist = app.CreateListDialog( "Меню","Скопировать" );
browlist.SetOnTouch( function(a) {
if(a=="Скопировать") {
app.SetClipboardText( addressurlbar.GetText() );
rammer_message("Скопировано!")
}
} );
menubrowse.SetOnTouch( function() {
browlist.Show();
});
laybrowser.AddChild( laybrowserhoz );
laybrowserhoz.AddChild( addressurlbar );
laybrowserhoz.AddChild( gobtn );
laybrowserhoz.AddChild( backbtnbrowser );
laybrowserhoz.AddChild( menubrowse );
laybrowser.AddChild( browser );
laybrowser.AddChild( laybrowserhoz1 );
browser_closebtn = new RammerCloseButton(laybrowser)
browser_closebtn.show()
if(typeof(url)=="undefined"||typeof(url)=="object") {
browser.LoadUrl(defaulturl)
}else{
browser.LoadUrl(url)
}
browser.SetOnTouch( function() {
try{
urldata = browser.GetUrl()
addressurlbar.SetText( urldata );
}
catch(e) {
}
});
laybrowser.show()
}

function showinfo()
{
'use strict'
	let layinfo = new RammerApp(lang=="ru"?"О системе":"About system")
  let cb = new RammerCloseButton(layinfo)
  cb.show()
// КОД ИНФОРМАЦИИ О СИСТЕМЕ >> 1
let logo = app.CreateImage( "Img/rammer.png", 0.15 );
logo.SetOnTouchDown( function() {
if(RammerDay==17 & RammerMonth==12) {
soundPlayer1.Stop();
soundPlayer1.SetFile( "Snd/bdaysound.mp3" );
soundPlayer1.SetOnReady( function(){ soundPlayer1.Play() } );
}else{ app.TextToSpeech( (lang=="ru"?"Версия ":"v. ")+version ); }
});
layinfo.AddChild( logo );
let txtvers = app.CreateText( version );
let txtfunnyphrase = app.CreateText( funnyphrase, null, null, "Multiline" );
txtfunnyphrase.SetTextSize( 17 );
let txtcodename = app.CreateText( (lang=="ru"?"Кодовое имя: ":"Codename: ") + codename );
txtcodename.SetTextSize( 17 )
txtvers = app.CreateText( isbeta?(version+" beta ["+buildnumber+"]"):version );
txtvers.SetTextSize( 30 );
layinfo.AddChild( txtvers );
layinfo.AddChild( txtfunnyphrase );
layinfo.AddChild( txtcodename );
let disptxt = app.CreateText( "Display resolution: "+app.GetDisplayWidth()+"x"+app.GetDisplayHeight() )
disptxt.SetTextSize( 22 )
layinfo.AddChild(disptxt)
let developersbtn = app.CreateButton( "О разработчиках" )
developersbtn.SetOnTouch( developersinfo );
layinfo.AddChild( developersbtn );
// КОНЕЦ << 1
layinfo.show()
}

function addclosebtninfo(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
lay.close()
delete lay;
} );
}
 // first RammerApp use...
function music_activity()
{
this.bapp = new RammerApp(lang=="ru"?"Музыка":"Music");

this.cb = new RammerCloseButton(this.bapp)
this.cb.show()
musiclist = app.CreateList( Array.prototype.concat(app.ListFolder( "/sdcard/Rammer/Music/",".mp3" ),app.ListFolder( "/sdcard/Rammer/Music/",".wav" ),app.ListFolder( "/sdcard/Rammer/Music/",".m4a" )),1,0.3 );
musiclist.SetOnTouch(choosemusic);
this.bapp.AddChild(musiclist)
this.bapp.show()
}

function choosemusic(file)
{
audioPlayer.SetFile( "/sdcard/Rammer/Music/"+file );
this.bapp = new RammerApp(lang=="ru"?"Медиа-плеер":"Music")
this.cb = new RammerCloseButton(this.bapp)
this.cb.show()
this.cb.SetAdditional(() => {layotherstatusbar.SetBackColor( "gray" );})

laymscdfh = app.CreateLayout( "Linear", "Horizontal" );
control_volume = app.CreateSeekBar( 0.38,null );

control_play = app.CreateButton( "[fa-play]",null,null,"FontAwesome" );
control_stop = app.CreateButton( "[fa-stop]",null,null,"FontAwesome" );
control_pause = app.CreateButton( "[fa-pause]",null,null,"FontAwesome" );
control_volume.SetRange( 1.2 );
control_play.SetOnTouch( audioPlayer.Play );
control_stop.SetOnTouch( audioPlayer.Stop );
control_pause.SetOnTouch( audioPlayer.Pause );
control_volume.SetOnTouch( function(a) {
audioPlayer.SetVolume( a,a )
app.ShowPopup( lang=="ru"?"Громкость: "+Math.floor(a*100):"Volume: "+Math.floor(a*100) )
} );

musicutil = new RammerUtility();
musicutil.AddChildMul(laymscdfh,[control_play,control_pause,control_stop,control_volume])

this.bapp.AddChild( laymscdfh );
this.bapp.show()
}

function readdir(dir)
{
return app.ListFolder( dir );
}

function files_activity()
{
layfiles = new RammerApp(lang=="ru"?"Файлы":"Files")
fileslist = app.CreateList( readdir("/"+ToFolder(dir)) ,null, 0.7 );
fileslist.SetOnTouch(chfolder)
fileslist.SetOnLongTouch(function(a,b,c){
'use strict'
let dialog = app.CreateListDialog( "Operation with "+a,["Rename","Delete"] )
dialog.SetOnTouch( (oper)=>{
if(oper=="Rename"){
app.RenameFile( "/"+ToFolder(dir)+a, "/"+ToFolder(dir)+prompt("Enter file name",a))
}else if(oper=="Delete"){
if(confirm("Confirm operation")){app.DeleteFile( "/"+ToFolder(dir)+a )}
}
fileslist.SetList( readdir("/"+ToFolder(dir)) )
} )
dialog.Show()
})
cb = new RammerCloseButton(layfiles)
cb.show()
layfiles.AddChild( fileslist );
backbtnfiles = app.CreateButton( lang=='ru'?"Назад":"Back" );
backbtnfiles.SetOnTouch( back_files );
txtpath = app.CreateText( "" );
layfiles.AddChild( txtpath );
layfiles.AddChild( backbtnfiles );
layfiles.show()
txtpath.SetText( "/"+ToFolder(dir) );
}

function calc_activity()
{
	keys = [ 7,8,9,"/", 4,5,6,"*", 1,2,3,"-", 0,".","C","+","&","^","|","~"];
sum = ""
c_lay = new RammerApp("Calculator")
c_lay.show()

	txtSum = app.CreateText( "", 0.8, 0.1 );
	txtSum.SetTextSize( 42 );
	txtSum.SetBackColor( "#ff222222" );
	txtSum.SetMargins( 0, 0.1, 0, 0.05 );
	c_lay.AddChild( txtSum );
lay_1st = app.CreateLayout( "linear", "Horizontal" );	
for( i=0; i<4; i++ ) __AddButton( lay_1st, keys[i] );
c_lay.AddChild( lay_1st );
	
lay_2nd = app.CreateLayout( "linear", "Horizontal" );	
for( i=4; i<8; i++ ) __AddButton( lay_2nd, keys[i] );
	c_lay.AddChild( lay_2nd );
	
lay_3rd = app.CreateLayout( "linear", "Horizontal" );	
	for( i=8; i<12; i++ ) __AddButton( lay_3rd, keys[i] );
	c_lay.AddChild( lay_3rd );
	
lay_4th = app.CreateLayout( "linear", "Horizontal" );	
	for( i=12; i<16; i++ ) __AddButton( lay_4th, keys[i] );
	c_lay.AddChild( lay_4th );

lay_6th = app.CreateLayout( "linear", "Horizontal" );	
	for( i=16; i<20; i++ ) __AddButton( lay_6th, keys[i] );
	c_lay.AddChild( lay_6th );
	
lay_5th = app.CreateLayout( "linear", "Horizontal" );	
	__AddButton( lay_5th, "=" );
	c_lay.AddChild( lay_5th );

calc_clsbtn = new RammerCloseButton(c_lay)
calc_clsbtn.show()

function __AddButton( lay, name )
{
	if( name=="=" ) w = 0.8; else w=0.2;
	clbtn = app.CreateButton( name, w, 0.1, "Alum" );
	clbtn.SetOnTouch( calc_btns_OnTouch );
	lay.AddChild( clbtn );
}

function calc_btns_OnTouch()
{
	app.Vibrate( "0,100" );
	xbtn = this;
	txt = xbtn.GetText()
	if( txt=="=" ) CalcResult();
	else if( txt=="Закрыть" ) app.RemoveLayout( c_lay );
	else if( txt=="C" ) sum = "";
	else sum += txt;
	txtSum.SetText( sum );
}

function CalcResult()
{
	try {
		//Evaluate sum (and catch errors). (Gotta catch 'em all)
		sum = eval( sum ).toFixed(2);
	}
	catch(e) { sum = "Error" }
}
}

function chfolder(fold)
{
dir.push(fold)
if( app.IsFolder("/"+ToFile(dir)) ) {
xcm = readdir("/"+ToFile(dir))
fileslist.SetList( xcm );
}else{
rejpg = new RegExp("\b*jpg");
if(rejpg.test("/"+ToFile(dir))) {
photo_activity({},"/"+ToFile(dir))
}
repng = new RegExp("\b*png");
if(repng.test("/"+ToFile(dir))) {
photo_activity({},"/"+ToFile(dir))
}
remp3 = new RegExp("\b*mp3");
if(remp3.test("/"+ToFile(dir))) {
RammerMusicPlayerPopup("/"+ToFile(dir));
}
rewav = new RegExp("\b*wav");
if(rewav.test("/"+ToFile(dir))) {
RammerMusicPlayerPopup("/"+ToFile(dir));
}
rem4a = new RegExp("\b*m4a");
if(rem4a.test("/"+ToFile(dir))) {
RammerMusicPlayerPopup("/"+ToFile(dir));
}
remp4 = new RegExp("\b*mp4")
if(remp4.test("/"+ToFile(dir))) {
video_activity("/"+ToFile(dir))
}
remkv = new RegExp("\b*mkv")
if(remkv.test("/"+ToFile(dir))) {
video_activity("/"+ToFile(dir))
}
rejs = new RegExp("\b*js");
if(rejs.test("/"+ToFile(dir))) {
__code = app.ReadFile( "/"+ToFile(dir))
eval(__code)
}
rerpkg = new RegExp("\b*rpkg");
if(rerpkg.test("/"+ToFile(dir))) {
if(confirm(lang=="ru"?"Вы хотите установить это приложение?":"Install this package(app)?")) {
app.UnzipFile( "/"+ToFile(dir),"/sdcard/Rammer/Apps/" )
alert("Package "+ToFile(dir).split("/")[ToFile(dir).split("/").length-1]+" installed successfully!!!")
RammerSystem_ReloadDesktop()
}
}
dir.pop()
}
txtpath.SetText( "/"+ToFolder(dir))
}

function back_files()
{
if(ToFolder(dir)!=ToFolder(dirf)) {
	dir.pop()
xcm = readdir("/"+ToFolder(dir))
fileslist.SetList( xcm );
}
txtpath.SetText( "/"+ToFolder(dir) );
}

function ToFolder(dirp)
{
	if(dirp.length!=0){
return dirp.join("/")+"/"
}
}

function ToFile(fp)
{
	if(fp.length!=0){
return fp.join("/")
}
}

function showApps()
{
Appsbtn.SetEnabled( false );
layApps = app.CreateLayout( "Linear", "Vertical,fillxy" );
layApps.SetSize( 1,0.96 );
	layAppsbtn = app.CreateLayout( "Linear", "Horizontal" );
layApps.SetBackColor( "gray" );
layAppsbtn1 = app.CreateLayout( "Linear", "Horizontal" );
layApps.AddChild( layAppsbtn1 );
layApps.AddChild( layAppsbtn );
tmp_data.Apps = app.ListFolder( "/sdcard/Rammer/Apps/", null, null, "Folders");
Appslist = app.CreateList( tmp_data.Apps );
Appslist.SetOnTouch( runapp );
layApps.AddChild( Appslist );
addclosebtnApps(layAppsbtn)
app.AddLayout( layApps );
}

function addclosebtnApps(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
Appsbtn.SetEnabled( true );
app.RemoveLayout( layApps );
delete lay
delete layApps
} );
}

function camera_activity()
{
laycamera = new RammerApp(lang=="ru"?"Камера":"Camera");
laycamerahoz = app.CreateLayout( "Linear", "Horizontal" );
camerascreen = app.CreateCameraView( 1, 0.87 );
camerascreen.SetOnReady( function() {camerascreen.StartPreview();});
snapcamerabtn = app.CreateButton( lang=="ru"?"Съемка":"Capture" );
snapcamerabtn.SetOnTouch( snapcamera );
flashlightbtn = app.CreateToggle( lang=="ru"?"Вспышка":"Flashlight" );
flashlightbtn.SetOnTouch( function(g){camerascreen.SetFlash( g );});
recordcamerabtn = app.CreateButton( "Видеозап." );

recordcamerabtn.SetOnTouch( function() {
if(this.GetText()=="Видеозап.") {
camerascreen.Record( "/sdcard/Rammer/Video/VID_"+RammerYear+"_"+RammerMonth+"_"+RammerDay+"_"+RammerTime.getHours()+"_"+RammerTime.getMinutes()+"_"+RammerTime.getSeconds()+".mp4");
this.SetText( "Стоп" )
}else if(this.GetText()=="Стоп") {
camerascreen.Stop();
recordcamerabtn.SetText( "Видеозап." )
}
});
laycamera.AddChild( camerascreen );
laycamera.AddChild( laycamerahoz );
laycamerahoz.AddChild( snapcamerabtn );
laycamerahoz.AddChild( flashlightbtn );
laycamerahoz.AddChild( recordcamerabtn );
addclosebtncam(laycamerahoz)
laycamera.show()
}

function addclosebtncam(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
laycamera.close()
delete lay
delete laycamera
} );
}


function snapcamera()
{
	camerascreen.TakePicture( folder+"/Pictures/PIC_"+RammerYear+"-"+RammerMonth+"-"+RammerDay+"-"+RammerTime.getMinutes()+"-"+RammerTime.getSeconds()+".jpg" );
}

function photo_activity(x,file_)
{
//alert(JSON.stringify(file_))
layphoto=new RammerApp(lang=="ru"?"Галерея":"Gallery");
layphoto.show()
imgphoto = app.CreateImage( file_, 1, 0.9 );
if(typeof(file_)=="undefined") {
file_=null
// GALLERY CODE HERE
this.path = "/"+ToFolder(['sdcard','Rammer','Pictures'])
//alert(this.path)
var photos_lists = Array.prototype.concat(app.ListFolder( this.path,"png"),app.ListFolder( this.path,"jpg" ))
	photos_scrl_ = app.CreateScroller(1,0.86)
	photos_scrl = app.CreateLayout( "Linear", "Vertical" )
	//photos_scrl.SetBackColor( "#cc22cc" )
	photos_scrl.SetSize(1,0.9)
	photos_scrl_.AddChild( photos_scrl )
	layphoto.AddChild(photos_scrl_)
    for(i=0;i<photos_lists.length;i++) {
    if(i%3==0) {
    photos_newlay = app.CreateLayout( "Linear", "Horizontal" )
    photos_scrl.AddChild( photos_newlay )
    }
    photos_img = app.CreateImage( this.path+photos_lists[i],0.31,0.3/(app.GetScreenHeight()/app.GetScreenWidth()) )
    photos_img.SetMargins( 0, 0, 0.02, 0.01 )
    //alert("Processing: "+this.path+photos_lists[i])
    photos_newlay.AddChild( photos_img )
		}
}
if(file_!=null){layphoto.AddChild( imgphoto )}
this.cb=new RammerCloseButton(layphoto)
this.cb.show()
}

function developersinfo()
{
laydevinfo = app.CreateLayout( "Linear", "Vertical,fillxy" );
laydevinfo.SetBackGradient( "blue","green","red" );
	txtdev1info = app.CreateText( "",null, null, "Multiline" );
txtdev1info.SetHtml(lang=="ru"?"<b>Андрей Павленко</b> [andrejpavlenko666@gmail.com] - разработчик, бета тестер, и дизайнер (хотя дизайна нет)":"<b>Andrey Pavlenko</b> [andrejpavlenko666@gmail.com] - main developer, secondary beta-tester and designer (no design)");
txtdev2info = app.CreateText( "",null, null, "Multiline" );
txtdev2info.SetHtml(lang=="ru"?"Никита Серков [Main BETA-tester] [lirina.molk0000@gmail.com] - бета тестер и генератор идей.":"Nikita Serkov [Main BETA-tester] [WoT: NikSerNagibator30]  - main beta-tester and idea generator.")
laydevinfo.AddChild( txtdev1info )
laydevinfo.AddChild( txtdev2info );
txtdev3info = app.CreateText( "",null, null, "Multiline" );
txtdev3info.SetHtml(lang=="ru"?"Назар Прокудин [nazarprokudin74@gmail.com] - бета тестер":"Nazar Prokudin - beta tester.")
laydevinfo.AddChild( txtdev3info )

addclosebtn(laydevinfo)
app.AddLayout( laydevinfo );
}

function screenlock(password)
{
background = app.LoadText( "background","/Sys/Img/GreenBack.jpg" )
app.CloseDrawer( "Left" );
app.LockDrawer( "Left" );
	laylock = app.CreateLayout( "Linear", "Vertical,fillxy" );
laylock.SetBackground( background );
app.AddLayout( laylock );
// ТУТ НАЧАЛО КОДА >> 3
txttimelock = app.CreateText( "" );
txttimelock.SetFontFile( "Misc/19809.otf" )
txtdatelock = app.CreateText( "" );
statustxt = app.CreateText( "", null, null, "FontAwesome" );
msgtxt = app.CreateText( "", null, null, "FontAwesome" );
txttimelock.SetTextSize( 28 );
txtdatelock.SetTextSize( 24 );
statustxt.SetTextSize( statustxt.GetTextSize( )+6 );
txttimelock.SetText( hours+":"+tmp_data.minutes );
txtdatelock.SetText( day+"/"+month+"/"+year+" "+(lang=="ru"?RammerDaysOfWeek[ time.getUTCDay() ].ru:RammerDaysOfWeek[ time.getUTCDay() ].en) );
var intlocktime = setInterval(function () {
txttimelock.SetText( hours+":"+minutes );
txtdatelock.SetText( day+"/"+month+"/"+year+" "+(lang=="ru"?RammerDaysOfWeek[ time.getUTCDay() ].ru:RammerDaysOfWeek[ time.getUTCDay() ].en) );
if( app.app.GetChargeType()!="None" ) {
 statustxt.SetText( "[fa-battery-"+_getlevel(_bp)+"][fa-bolt] "+_bp+"%" )
}else{
 statustxt.SetText( "[fa-battery-"+_getlevel(_bp)+"] "+_bp+"%" )
}
},500)
txttimelock.SetTextSize( 44 );
laylock.AddChild( txttimelock );
laylock.AddChild( txtdatelock );
laylock.AddChild( statustxt );
laylock.AddChild( msgtxt );
btnunlock = app.CreateButton( "Разблокировать" );
btnunlock.SetOnTouch( function () {
if(typeof(password)!="undefined" && password!="") {
if(password==prompt(lang=="ru"?"Был установлен пароль. Введите пароль для продолжения.":"Password set. Type password to continue.")) {
soundPlayer.SetFile( "Snd/unlock1.ogg" );
soundPlayer.Stop();
soundPlayer.SetOnReady( function() {
soundPlayer.Play();
})
clearInterval( intlocktime );
app.UnlockDrawer( "Left" );
laylock.Animate( "SlideToLeft" );
}
}else{
soundPlayer.SetFile( "Snd/unlock1.ogg" );
soundPlayer.Stop();
soundPlayer.SetOnReady( function() {
soundPlayer.Play();
})
clearInterval( intlocktime );
app.UnlockDrawer( "Left" );
laylock.Animate( "SlideToLeft" );
}
});
soundPlayer.SetFile( "Snd/lock.ogg" );
laylock.AddChild( btnunlock );
//КОНЕЦ << 3
laylock.Animate( "SlideFromLeft" );
soundPlayer.Play();
}

function changewallpapers()
{
	laychwallpapers = new RammerApp(lang=="ru"?"Обои":"Wallpapers")
laychwallpapershoz = app.CreateLayout( "Linear", "Horizontal" );
laychwallpapershoz1 = app.CreateLayout( "Linear", "Horizontal" );
laychwallpapershoz2 = app.CreateLayout( "Linear", "Horizontal" );
imgw1 = app.CreateImage( "Img/wallpaper1.jpg",0.2,0.2);
imgw1.SetOnTouch( chwtow1 );
imgw2 = app.CreateImage( "Img/wallpaper2.jpg",0.2,0.2);
imgw2.SetOnTouch( chwtow2 );
imgw3 = app.CreateImage( "Img/wallpaper3.jpg",0.2,0.2);
imgw3.SetOnTouch( chwtow3 );
imgw4 = app.CreateImage( "Img/wallpaper4.jpg",0.2,0.2);
imgw4.SetOnTouch( chwtow4 );
imgw5 = app.CreateImage( "Img/wallpaper5.jpg",0.2,0.2);
imgw5.SetOnTouch( chwtow5 );
imgwny = app.CreateImage( "Img/wallpaperny.jpg",0.2,0.2);
imgwny.SetOnTouch( chwtowny );
laychwallpapers.AddChild( laychwallpapershoz );
laychwallpapershoz.AddChild( imgw1 );
laychwallpapershoz.AddChild( imgw2 );
laychwallpapershoz.AddChild( imgw3 );
laychwallpapershoz.AddChild( imgw4 );
laychwallpapers.AddChild( laychwallpapershoz1 );
laychwallpapershoz1.AddChild( imgw5 );
laychwallpapershoz1.AddChild( imgwny );
laychwallpapers.AddChild( laychwallpapershoz1 );
txtwallpaperstatus = app.CreateText( "" );
btnresetwallpaper = app.CreateButton( lang=="ru"?"Вернуть обои!!!":"Return wallpaper!!!" );
btnresetwallpaper.SetOnTouch( function(){
app.SaveText( "background",background_default );
//txtwallpaperstatus.SetText( "Перезапустите приложение для установки обоев" ); // From version 1.2
lay.SetBackground( background_default );
});
btnownwp = app.CreateButton( lang=="ru"?"Свои обои":"Set own wallpaper" );
btnownwp.SetOnTouch( function(){
	this.wp = new RammerFileSelect()
this.wp.setonfileselect(function(w){
/*if(app.CreateImage(w).GetAbsHeight()-75>app.CreateImage(w).GetAbsWidth()) {
this.img = app.CreateImage( null, 3-2,3-2 ) // because touchscreen is broken
this.img.DrawImage(app.CreateImage( w ),-0.5,0,1.8,1.8/(RammerScreenHeight/RammerScreenWidth))
this.nw = "/sdcard/Rammer/Pictures/Wallpapers/WP-"+Math.floor(Math.random()*32768)
this.img.Save(this.nw)
app.SaveText( "background",this.nw );
lay.SetBackground( this.nw );
}else{
app.SaveText( "background",w );
lay.SetBackground( w );
}
*/
this.mci = new RammerImageCropper(w)
this.mci.setoncomplete(function(x){
app.SaveText( "background",x )
lay.SetBackground( x )
})
this.mci.show()
});
this.wp.show()
})
laychwallpapers.AddChild( btnownwp );
laychwallpapers.AddChild( btnresetwallpaper );
laychwallpapers.AddChild( txtwallpaperstatus );
this.cb = new RammerCloseButton(laychwallpapers)
this.cb.show()
laychwallpapers.show()
}

function chwtow1()
{
app.SaveText( "background","Img/wallpaper1.jpg" );
//txtwallpaperstatus.SetText( "Перезапустите приложение для продолжения..." );
lay.SetBackground( "Img/wallpaper1.jpg" );
txtdate.SetTextColor( "gray" );
txttime.SetTextColor( "gray" );
}

function chwtow2()
{
app.SaveText( "background","Img/wallpaper2.jpg" );
//txtwallpaperstatus.SetText( "Перезапустите приложение для продолжения..." );
lay.SetBackground( "Img/wallpaper2.jpg" );
txtdate.SetTextColor( "#22ff22" );
txttime.SetTextColor( "#22ff22" );
}

function chwtow3()
{
app.SaveText( "background","Img/wallpaper3.jpg" );
//txtwallpaperstatus.SetText( "Перезапустите приложение для продолжения..." );
lay.SetBackground( "Img/wallpaper3.jpg" );
txtdate.SetTextColor( "gray" );
txttime.SetTextColor( "gray" );
}

function chwtow4()
{
app.SaveText( "background","Img/wallpaper4.jpg" );
//txtwallpaperstatus.SetText( "Перезапустите приложение для продолжения..." );
lay.SetBackground( "Img/wallpaper4.jpg" );
txtdate.SetTextColor( "gray" );
txttime.SetTextColor( "gray" );
}

function chwtow5()
{
app.SaveText( "background","Img/wallpaper5.jpg" );
lay.SetBackground( "Img/wallpaper5.jpg" );
txtdate.SetTextColor( "gray" );
txttime.SetTextColor( "gray" );
}

function chwtowny()
{
app.SaveText( "background","Img/wallpaperny.jpg" );
//txtwallpaperstatus.SetText( "Перезапустите приложение для продолжения..." );
lay.SetBackground( "Img/wallpaperny.jpg" );
txtdate.SetTextColor( "gray" );
txttime.SetTextColor( "gray" );
}

function video_activity(file)
{
//alert(file)
	layvideo = app.CreateLayout( "Linear","Vertical,fillxy" );
layvideohoz = app.CreateLayout( "Linear", "Horizontal" );
layvideo.SetBackColor( "gray" );
// НАЧАЛО КОДА >> 4
videoPlayer = app.CreateVideoView( 1,0.8 );
if(typeof(file)=="undefined") {
videoPlayer.SetFile( "Vid/testvideo.mp4" );
}else{
videoPlayer.SetFile( file ); 
}
seektxt = app.CreateText( "" );
seektxt_1 = app.CreateText( "" );
btnvideoplay = app.CreateButton( "[fa-play]", null, null, "FontAwesome" );

btnvideopause = app.CreateButton( "[fa-pause]", null, null, "FontAwesome" );
btnvideopause.SetOnTouch( function() {
videoPlayer.Pause();
});
btnvideostop = app.CreateButton( "[fa-stop]", null, null, "FontAwesome" );
btnvideostop.SetOnTouch( function() {
videoPlayer.Stop();
clearInterval(tmp_data.svt)
});
btnp10 = app.CreateButton( "-10" );
btnp10.SetOnTouch( function() {
videoPlayer.SeekTo( videoPlayer.GetPosition()-10 );
} );
btnm10 = app.CreateButton( "+10" );
btnm10.SetOnTouch( function (){
videoPlayer.SeekTo( videoPlayer.GetPosition()+10 );
});
layvideohoza = app.CreateLayout( "Linear", "Horizontal" );
seekvideotime = app.CreateSeekBar( 0.8 )
video_activity.otherfuncs = function() {
seekvideotime.SetRange( videoPlayer.GetDuration() );
tmp_data.svt = setInterval(function(){
tmp_data.videopos=videoPlayer.GetPosition()
seekvideotime.SetValue( tmp_data.videopos );
seektxt.SetText( Math.floor(tmp_data.videopos) );
seektxt_1.SetText( Math.floor(videoPlayer.GetDuration()) );
},1000)
}
seekvideotime.SetOnTouch( function(time) {
videoPlayer.SeekTo( time );
});
btnvideoplay.SetOnTouch( function() {
videoPlayer.Play();
video_activity.otherfuncs()
});
layvideohoza.AddChild( seektxt );
layvideohoza.AddChild( seekvideotime );
layvideohoza.AddChild( seektxt_1 );
 layvideo.AddChild( layvideohoza );
layvideohoz.AddChild( btnp10 );
layvideohoz.AddChild( btnvideoplay );
layvideohoz.AddChild( btnvideopause );
layvideohoz.AddChild( btnvideostop );
layvideohoz.AddChild( btnm10 );
layvideo.AddChild( videoPlayer );
// КОНЕЦ << 4
	closebtn = app.CreateButton( "Закрыть" );
  layvideo.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( layvideo );
app.RemoveLayout( layvideohoz );
//clearInterval(lvskblive)
} );
layvideo.AddChild( layvideohoz );
app.AddLayout( layvideo );
}

function get_tmp_data()
{
	return JSON.stringify(tmp_data)
}

function updates_app()
{
	'use strict'
	let rapp = new RammerApp("Updates")
	let rapp_cb = new RammerCloseButton(rapp)
	rapp_cb.show()
	
	let remver = RammerSystem_GetRemoteVersion()
	let rapp_txt = app.CreateText( lang=="ru"?"Проверка обновлений...":"Checking updates..." )
	rapp_txt.SetTextSize( 22 )
	rapp.AddChild( rapp_txt )
	rapp.show()
		
	let rapp_txtversrem = app.CreateText( "" )
	rapp_txtversrem.SetTextSize( 20 )
	
	let rapp_txtversloc = app.CreateText( "" )
	rapp_txtversloc.SetTextSize( 20 )
	
	rapp_txtversrem.SetText( (lang=="ru"?"Версия на сервере: ":"Remote version: ")+remver )
	rapp_txtversloc.SetText( (lang=="ru"?"Локальная (текущая) версия: ":"Local version: ")+version )
	
	rapp.AddChild(rapp_txtversrem)
	rapp.AddChild(rapp_txtversloc)
	
	let UpdateBtn = app.CreateButton( lang=="ru"?"Обновить":"Install updates"  )
	UpdateBtn.SetOnTouch( function(){
	  updates_process()
	} )
	
	if(RammerVersionCompare(remver,version)==-1){
	  rapp_txt.SetText(lang=="ru"?"У вас последняя версия.":"No updates available")
	}else if(RammerVersionCompare(remver,version)==0) {
  	rapp_txt.SetText(lang=="ru"?"У вас последняя версия.":"No updates available")
	}else if(RammerVersionCompare(remver,version)==1){
	  rapp_txt.SetText(lang=="ru"?"Доступно обновление ("+remver+")":"Update available ("+remver+")")
	  rapp.AddChild(UpdateBtn)
	}
}

function updates_process()
{
	'use strict'
	let pdwn = new Pikachu()
	pdwn.runupdate()
}

function livevideoapp()
{
'use strict'
let layvideo = new RammerApp("IPTV [dev]")
let layvideo_cb = new RammerCloseButton(layvideo)
layvideo_cb.show()
let layvideo_url_lay = app.CreateLayout( "Linear", "Horizontal" )
let layvideo_url = app.CreateTextEdit( "",0.8,null)
layvideo_url.SetHint( "URL" )
let layvideo_url_go = app.CreateButton( "[fa-play]",0.2,null,"FontAwesome" )
layvideo_url_lay.AddChild( layvideo_url )
layvideo_url_lay.AddChild( layvideo_url_go )
layvideo.AddChild( layvideo_url_lay )
let layvideo_vp = new RammerVideo(layvideo,1,0.3)
layvideo_vp.show()

layvideo_url_go.SetOnTouch( function(){
  let url = layvideo_url.GetText()
  layvideo_vp.setfile(url)
})
layvideo.show()
}

function notes_activity()
{
var notes = app.LoadText( "notes",[] );
notes = notes.split(",")
for(i=0;i<notes.length;i++) {
notes[i].replace(":","^c^");
}
var lasttxt = ""
var spl = ""

noteslay = new RammerApp(lang=="ru"?"Заметки":"Notes")
noteslist = app.CreateList( notes, 1, 0.79 );
noteslist.SetOnTouch( function (data){
	alert(data)
});
noteslist.SetOnLongTouch( deleteaction );
noteslay.AddChild( noteslist );

noteslayhoz = app.CreateLayout( "Linear", "Horizontal" );
notestxtedt = app.CreateTextEdit( "", 0.6, null );
noteslayhoz.AddChild( notestxtedt );

notesokbtn = app.CreateButton( "OK" )
notesokbtn.SetOnTouch( addnote );
noteslayhoz.AddChild( notesokbtn );

notesclearbtn = app.CreateButton( lang=="ru"?"Очистить":"Clear" )
notesclearbtn.SetOnTouch( clearnotes );
noteslay.AddChild( notesclearbtn );



//noteshinttext = app.CreateText( "Чтобы удалить заметку, нужно удерживать заметку.", null, null, "Multiline" );

this.cb = new RammerCloseButton_CrossLayout(noteslayhoz,noteslay)
this.cb.show()
noteslay.AddChild( noteslayhoz );
if(notes[0]=="") {
notes.splice(0,1)
}
//noteslay.AddChild( noteshinttext );
noteslay.show()

function addnote()
{
notestext = notestxtedt.GetText();
if( notestext!="" ) {
notes.push(notestext)
}
app.SaveText( "notes",notes );
noteslist.SetList( notes );
lasttxt=notestext
}

function clearnotes()
{
notes=[]
app.SaveText( "notes",notes );
noteslist.SetList( notes );
}

function del(a,b,c)
{
if(a==spl) {
	notes.splice(b,1)
}
app.SaveText( "notes",notes );
noteslist.SetList( notes );
}

function deleteaction(data)
{
spl = data
  notes.filter(del);
}
}
/*
function settings_activity() {
settingsbtn.SetEnabled( false );
laysettings = app.CreateLayout( "Linear", "Vertical,fillxy" );
laysettings.SetBackColor( "gray" );
laysettings1 = app.CreateLayout( "Linear", "Horizontal" );

langbtn = app.CreateButton( "Language: "+lang );
langbtn.SetOnTouch( function() {
if(lang=="ru") {
app.SaveText( "syslang","en" );
lang="en"
langbtn.SetText( "Language: "+lang );
}else{
app.SaveText( "syslang","ru" );
lang="ru"
langbtn.SetText( "Language: "+lang );
}
alert("Please click on Reboot button");
} );
laysettings1.AddChild( langbtn );

laysettings.AddChild( laysettings1 );
addclosebtnsettings(laysettings)
app.AddLayout( laysettings );
}
*/
function RammerSystem_InstallPackageSimple(src)
{
	app.UnzipFile( src,"/sdcard/Rammer/Apps/" );
}

function terminal_act()
{
'use strict'
let	layterm = new RammerApp(lang=="ru"?"Терминал":"Terminal")
let term_txte = app.CreateTextEdit( "Welcome to Rammer "+version+" terminal!\n",1,0.8 );
term_txte.SetBackColor( "black" );
let laytermhoz = app.CreateLayout( "Linear", "Horizontal" );
let term_txte_1 = app.CreateTextEdit( "",0.85,null );
let term_btn = app.CreateButton( ">" );
let term_clsb = new RammerCloseButton(layterm)
term_clsb.show()
term_btn.SetOnTouch( function() {
'use strict'
let cmd = term_txte_1.GetText();
if(cmd!="") {
term_txte_1.SetText( "" );
term_txte.SetText(term_txte.GetText()+"> "+cmd+"\n");
if( app.FileExists( "/sdcard/Rammer/Sys/Cmd/"+cmd+".js" ) ) {
let __=app.ReadFile("/sdcard/Rammer/Sys/Cmd/"+cmd+".js") 
eval(__) // ТУПО ВЫПОЛНИТЬ
}else{
try{
this.result = eval(cmd);
term_txte.SetText(term_txte.GetText()+this.result+"\n");
this.rpl = cmd.split(" ");
let cmd_data=this.rpl
}catch(e) {
term_txte.SetText(term_txte.GetText()+"shell: unknown function or other error\n"+e+"\n");
}
}
}
});
layterm.AddChild( term_txte );
layterm.AddChild( laytermhoz );
laytermhoz.AddChild( term_txte_1 );
laytermhoz.AddChild( term_btn );
layterm.AddChild( term_clsb );
layterm.show()
}

function textpad()
{
  'use strict';
  let appy = new RammerApp("TextPad")
	let txtedit = app.CreateTextEdit( "",1,0.8 )
  txtedit.SetBackColor( "#ffffff" )
  txtedit.SetTextColor( "#000000" )
  txtedit.SetCursorColor( "#000000" )
  appy.AddChild( txtedit )

let path = ""

let layctrlhoz = app.CreateLayout( "Linear", "Horizontal" )
appy.AddChild( layctrlhoz )

let btnopen = app.CreateButton( "[fa-folder]",null,null,"FontAwesome" )
btnopen.SetOnTouch( function(){
this.oper = new RammerFileSelect();
this.oper.setonfileselect(function(w){
path = w
txtedit.SetText( app.ReadFile( w ) )
})
this.oper.show()
} )
layctrlhoz.AddChild( btnopen )

let btnsave = app.CreateButton( "[fa-save]",null,null,"FontAwesome" )
btnsave.SetOnTouch( function(){
if(path!="") {
app.WriteFile( path,txtedit.GetText() )
alert(lang=="ru"?"Сохранено!":"Saved!")
}else{ alert(lang=="ru"?"Создание файла ещё не реализовано.":"File creation is not implemented yet.") }
} )
layctrlhoz.AddChild( btnsave )
	
let btnundo = app.CreateButton( "[fa-undo]",null,null,"FontAwesome" )
btnundo.SetOnTouch( function(){
txtedit.Undo()
} )
layctrlhoz.AddChild( btnundo )

let btnredo = app.CreateButton( "\uf01e",null,null,"FontAwesome" ) //because [fa-redo] not working...
btnredo.SetOnTouch( function(){
txtedit.Redo()
} )
layctrlhoz.AddChild( btnredo )

let cb = new RammerCloseButton_CrossLayout(layctrlhoz,appy)
cb.show()
appy.show()
}

//ЭТОТ КОД ОБЯЗАН БЫТЬ В КОНЦЕ
function runapp(name,params)
{
app_data.assetslocation = "/sdcard/Rammer/Apps/"+name+"/"
app_data.name = name
try{
app_data.params = params
eval( app.ReadFile( "/sdcard/Rammer/Apps/"+name+"/main.js" ))
}
catch(e) {
alert((lang=="ru"?"Произошла ошибка: ":"An error occured:")+e.message)
}
}