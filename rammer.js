// Rammer by Andrey Pavlenko
// Testing by Nikita Serkov
// Translated to English by Andrey Pavlenko

// Чтобы сменить язык, зайдите в Настройки -> Язык (Language)
// To switch language, go to Settings -> Language
const version = "3.0.11"
var codename, buildnumber, funnyphrase, isbeta, background_default = null
var background, phonenumber, defaulturl, debug, daysofweek = null
var folder_exists, tmp_data, app_data, lang, notification, folder = null
var repeat_music, sh_rad, sh_dy, melodies, xcm, bootanimationtime = null
var fullscreen, mpslast, soundonboot, settingslistmenu,dir,dirf = null
var scw, sch, mainscr, procs, notifs, livewallpapers, synth, ntf, cmd_data = null;
app.LoadScript( "builtins.js" );
// ^^^ после обновления, выдавалась ошибка, так что был поставлен 'use strict' // after update rammer crashes wirh error, i put 'use strict' to a start of builtins.js
function init_vars() {
lang=app.LoadText( "syslang",(app.GetLanguage()=="русский"?"ru":"en"));
codename = "Berry"
buildnumber = "999999" // ЭТО ИМИТАЦИЯ, НЕ ОБРАЩАЙТЕ ВНИМАНИЯ // THIS IS IMITATION, DO NOT PAY ATTENTION
funnyphrase = lang=="ru"?"Баг в дебаггере это жесть!":"Roses are red. Violetts are blue. Unexpected '{' on line 32. BUT MY CODE IS 25 LINES"
isbeta = true
background_default = "/Sys/Img/GreenBack.jpg"
background = app.LoadText( "background","/Sys/Img/GreenBack.jpg" )
phonenumber=""
dir = ["sdcard","Rammer"]
dirf = ["sdcard","Rammer"]
scw = app.GetScreenWidth(  );
sch = app.GetScreenHeight(  );
defaulturl = "Html/wygl_start_page.html"
debug = app.LoadBoolean("debug",false)
// По JS дни начинаются с воскресенья // In JS days starts with Sunday
daysofweek = [
{ru:"Воскресенье",en:"Sunday"},
{ru:"Понедельник",en:"Monday"},
{ru:"Вторник",en:"Tuesday"},
{ru:"Среда",en:"Wednesday"},
{ru:"Четверг",en:"Thursday"},
{ru:"Пятница",en:"Friday"},
{ru:"Суббота",en:"Saturday"}
]
folder_exists = app.FolderExists( folder );
tmp_data = {}
cmd_data=""
app_data = {}
livewallpapers=false
notification = ""
repeat_music = false
sh_rad = 0
sh_dy = 0.05
procs = []
notifs = []
melodies = ["Snd/melody1.mp3"]
el = [
{name:{ru:"Музыка",en:"Music"},func:music_activity,icon:"Sys/Icon/music.png"}, /* Иконки есть!!! :) */
{name:{ru:"Файлы",en:"Files"},func:files_activity,icon:"Sys/Icon/files.png"},
{name:{ru:"Фото",en:"Photos"},func:photo_activity,icon:"Sys/Icon/photos.png"},
{name:{ru:"Камера",en:"Camera"},func:camera_activity,icon:"Sys/Icon/camera.png"},
{name:{ru:"IPTV",en:"IPTV"},func:livevideoapp,icon:"Sys/Icon/iptv.png"},
{name:{ru:"Заметки",en:"Notes"},func:notes_activity,icon:"Sys/Icon/notes.png"}
]
bpl=4
synth = app.CreateSynth();
xcm = app.ListFolder( folder );
ntf=[]
months_=[
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
if( debug==true ) {
 bootanimationtime = 2000
}else{
 bootanimationtime = 5000
}
 fullscreen = app.LoadBoolean("fs",false)
if( fullscreen ) app.SetScreenMode( "Full" );
}
_setInterval =  setInterval;
setInterval = function(callback,timer) {
const handler = _setInterval(callback, timer);
procs.push({
"handler": handler,
"callback": callback,
"timer": timer
})
return handler;
}

_clearInterval =  clearInterval;
clearInterval = function(id) {
const handler = _clearInterval(id);
for(i=0;i<procs.length;i++) {
if(procs[i].handler==id) {
if(i==0) {
procs.shift()
}else{
procs.splice(i,i);
}
}}
return handler;
}
init_vars()

function OnStart()
{
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "Vertical,fillxy,top" );
laydrawer = app.CreateLayout( "Linear", "Vertical,fillxy" );

// ЭКСПЕРИМЕНТАЛЬНЫЙ КОД!!! НЕКИТ НЕ ТРОГАЙ!!! СТЕРЕТЬ ЭТОТ КОММЕНТАРИЙ В СЛУЧАЕ АПОКАЛИПСИСА
//app.SetOrientation( "Portrait" );
app.LockDrawer( "left" );
layboot = app.CreateLayout( "Linear", "Vertical,fillxy" );
layboot.SetBackColor( "black" ); 
bootanim = app.CreateVideoView( 1.1,1 );
bootanim.SetFile( "Vid/bootanimation.mp4" );
bootanim.Play();
layboot.AddChild( bootanim );
app.AddLayout( layboot );
setTimeout(function() {
app.RemoveLayout(layboot);
app.AddLayout( lay );
/*
app.AddDrawer( laydrawer,"left",0.9,0.1 );
*/
//drawdrawer()
},bootanimationtime)
// КОНЕЦ
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

audioPlayer = app.CreateMediaPlayer();
soundPlayer = app.CreateMediaPlayer();
soundPlayer1 = app.CreateMediaPlayer();
notifSound = app.CreateMediaPlayer();

laymainbtns = app.CreateLayout( "linear", "Horizontal,fillxy,Bottom" );
lay.SetBackground( background );

layother = app.CreateLayout( "Linear", "Vertical" );
buttonphone = app.CreateButton( lang=="ru"?"Телефон":"Phone" );
laymainbtns.AddChild( buttonphone );
buttons = app.CreateButton( lang=="ru"?"Мелодии":"Melodies" );
buttons.SetOnTouch( s_event );
laymainbtns.AddChild( buttons );
buttonbrowser = app.CreateButton( lang=="ru"?"Браузер":"Browser" );
laymainbtns.AddChild( buttonbrowser );

// НАЧИНАЕТСЯ СТАТУС БАР

layotherstatusbar = app.CreateLayout( "Linear", "Horizontal" );
layotherstatusbar.SetBackColor( "gray" );
layotherstatusbar.SetSize( 1,0.04 );
layother.AddChild( layotherstatusbar );

layotherothbar = app.CreateLayout( "Linear", "Horizontal,Left" );
layotherothbar.SetSize( 0.6,0.04 );
layotherstatusbar.AddChild( layotherothbar );

layothermainbar = app.CreateLayout( "Linear", "Horizontal,Right" );
layothermainbar.SetSize( 0.4,0.04 );
layotherstatusbar.AddChild( layothermainbar );

showdwnbtn = app.CreateText( "[fa-arrow-down]",null,null,"FontAwesome" );
showdwnbtn.SetTextSize( 24 );
showdwnbtn.SetOnTouchDown( function() {
showdwnbtn.SetEnabled( false );
laystatus = app.CreateLayout( "Linear", "Vertical" );
laydrawer.AddChild( laystatus );
laybtnsdraw = app.CreateLayout( "Linear", "Horizontal" );
laybtnsdraw1 = app.CreateLayout( "Linear", "Horizontal" );
laybtnsdraw2 = app.CreateLayout( "Linear", "Horizontal" );
if(debug==true) {
laystatus.SetBackColor( "#123456" );
laydrawer.SetBackColor( "#556677" );
laybtnsdraw1.SetBackColor( "#cc55aa" );
}
if(lang=="ru") {
infobtn = app.CreateButton( "[fa-info]  О системе", null, null, "FontAwesome" );
}else{
infobtn = app.CreateButton( "[fa-info]  About system", null, null, "FontAwesome" );
}
infobtn.SetOnTouch( showinfo );
laybtnsdraw.AddChild( infobtn );
laydrawer.AddChild( laybtnsdraw );
laydrawer.AddChild( laybtnsdraw1 );
laydrawer.AddChild( laybtnsdraw2 );
if(lang=="ru") {
Appsbtn = app.CreateButton( "Приложения" );
}else{
Appsbtn = app.CreateButton( "Apps" );
}
Appsbtn.SetOnTouch( showApps );
laybtnsdraw.AddChild( Appsbtn );
if(lang=="ru") {
lockscreenbtn = app.CreateButton( "Заблокировать экран" );
}else{
lockscreenbtn = app.CreateButton( "Lock screen" );
}
lockscreenbtn.SetOnTouch( screenlock );
lockscreenbtn.SetOnLongTouch( function() {
passwd = prompt("Пароль")
screenlock(passwd)
});
laybtnsdraw1.AddChild( lockscreenbtn );
settingsbtn = app.CreateButton( lang=="ru"?"Настройки":"Settings" );
settingsbtn.SetOnTouch( settings_activity );
laybtnsdraw1.AddChild( settingsbtn );

procmanbtn = app.CreateButton( "ProcMan" );
procmanbtn.SetOnTouch( procman_activity );
laybtnsdraw.AddChild( procmanbtn );
if(lang=="ru") {
reloadvarsbtn = app.CreateButton( "Перезагрузка" );
}else{
reloadvarsbtn = app.CreateButton( "Reboot" );
}
reloadvarsbtn.SetEnabled( true );
reloadvarsbtn.SetOnTouch(function() { 
// ПЕРЕЗАГРУЗКА И ОЧИСТКА ПЕРЕМЕННЫХ
shutdown()

version, codename, buildnumber, funnyphrase, isbeta, background_default = null
background, phonenumber, defaulturl, debug, daysofweek = null
folder_exists, tmp_data, app_data, notification = null 
repeat_music, sh_rad, sh_dy, melodies, xcm, bootanimationtime = null
fullscreen, mpslast, settingslistmenu, listmenu = null
init_vars() 
OnStart()
});
reloadvarsbtn.SetOnLongTouch( function() {
shutdown_animation()
app.CloseDrawer( "left" );
app.LockDrawer( "left" );
shutdown()
});
laybtnsdraw2.AddChild( reloadvarsbtn );

fsbtn = app.CreateToggle( lang=="ru"?"Полноэкранный":"Fullscreen" );
fsbtn.SetOnTouch( function(g) {
fullscreen = g
app.SaveBoolean( "fs",g );
if( fullscreen ){ app.SetScreenMode( "Full" ) }else{ app.SetScreenMode( "Normal" ) }
});
fsbtn.SetChecked( fullscreen );
laybtnsdraw2.AddChild( fsbtn );
laydrawer.SetBackColor( "gray" );
//laydrawer.Animate( "FlipFromTop" );
app.AddLayout( laydrawer );
changewallpapersbtn = app.CreateButton( lang=="ru"?"Сменить обои":"Change wallpapers" );
changewallpapersbtn.SetOnTouch( changewallpapers );
laybtnsdraw2.AddChild( changewallpapersbtn );

close = app.CreateText( "[fa-arrow-up]",null,null,"fontawesome");
close.SetOnTouch( function() {
laydrawer.RemoveChild( laystatus );
laydrawer.RemoveChild( laybtnsdraw );
laydrawer.RemoveChild( laybtnsdraw1 );
laydrawer.RemoveChild( laybtnsdraw2 );
laydrawer.RemoveChild( infobtn );
laydrawer.RemoveChild( close );
app.RemoveLayout( laydrawer );
showdwnbtn.SetEnabled( true );
});
close.SetTextSize( 25 );
laydrawer.AddChild( close );
});
showdwnbtn.SetBackAlpha( 0 );
layotherothbar.AddChild( showdwnbtn );

update_debugger = setInterval( function() {
if(debug==true) {
layothermainbar.SetBackColor( "red" );
layotherothbar.SetBackColor( "green" );
}else{
layothermainbar.SetBackColor( "gray" );
layotherothbar.SetBackColor( "gray" );
}
},2000)
buttonphone.SetOnTouch( phone );
buttonbrowser.SetOnTouch( browser_activity );

lay.AddChild( layother );
lay.AddChild( laymainbtns );

	txttime = app.CreateText( "" );
txttime.SetTextSize( 32 );
txttime.SetTextShadow( sh_rad,sh_dy,sh_dy,"black" );
layother.AddChild( txttime );

	txtdate = app.CreateText( "" );
txtdate.SetTextSize( 18 );
txtdate.SetTextShadow( sh_rad,sh_dy,sh_dy,"black" );
layother.AddChild( txtdate );

	txtnotif = app.CreateText( "" );
txtnotif.SetTextSize( 24 );
txtnotif.SetTextShadow( sh_rad,sh_dy,0.01,"black" );
layother.AddChild( txtnotif );

layotherhoz = app.CreateLayout( "Linear", "Horizontal" );
layother.AddChild( layotherhoz );

layother1hoz = app.CreateLayout( "Linear", "Horizontal" );
layother.AddChild( layother1hoz );

layother2hoz = app.CreateLayout( "Linear", "Horizontal" );
layother.AddChild( layother2hoz );

txtwireless = app.CreateText( "", null, null, "FontAwesome" );
layothermainbar.AddChild( txtwireless );
txtwireless.SetTextColor( "white" );
txtwireless.SetTextSize( 18 );
txtwireless.SetMargins( 0, 0.005, 0, 0 )

txtbattery = app.CreateText( "", null, null, "FontAwesome" );
layothermainbar.AddChild( txtbattery );
txtbattery.SetTextColor( "white" );
txtbattery.SetTextSize( 18 );
txtbattery.SetMargins( 0, 0.003, 0, 0 )

textmps = app.CreateText( "" );

layotherwgt = app.CreateLayout( "Linear", "Horizontal" );
layother.AddChild( layotherwgt );
/*
if(livewallpapers==true){
setInterval(function() {
lay.SetBackground( "Img/livewallpaper/1.jpg" );
setTimeout(function() {
lay.SetBackground( "Img/livewallpaper/2.jpg" );
},200);
},400);
}
*/
calltime()
calltime_int = setInterval(calltime,1000)
if( debug ){ 
mpupdater = setInterval(updatemps,1000)
layother1hoz.AddChild( textmps );
}

for(i=0;i<el.length;i++) {
if(i%bpl==0) {
layiconshoriz= app.CreateLayout( "Linear", "Horizontal" );
layother.AddChild( layiconshoriz );
}
__lay__ = app.CreateLayout( "Linear", "Vertical" );
icon = app.CreateImage( typeof(el[i].icon)=="undefined"?null:el[i].icon, 0.18, (0.18/(app.GetDisplayHeight()/app.GetDisplayWidth())));
text = app.CreateText( lang=="ru"?el[i].name.ru:el[i].name.en )
icon.SetOnTouchDown( el[i].func );
__lay__.AddChild( icon );
__lay__.AddChild( text );
__lay__.SetMargins( 0.03, 0.01, 0.01, 0.01 );
layiconshoriz.AddChild( __lay__ );
}

layother.AddChild( layiconshoriz );

for(i in app.ListFolder( "/sdcard/Rammer/Mods/" )) {
try {
eval( app.ReadFile( "/sdcard/Rammer/Mods/"+app.ListFolder( "/sdcard/Rammer/Mods/" )[i]) )
}catch(e) { }
}
layother.AddChild( txtnotif, 3 );
// ПОФИКСИТЬ

//	app.AddLayout( lay );
}

function notify_update()
{
//layother.RemoveChild( txtnotif );
//txtnotif.Animate( "BounceLeft" );
	txtnotif.SetText( notification );

}

function updatemps()
{
textmps.SetText(window.performance.memory.totalJSHeapSize);
}

function notify(title,text)
{
	rammer_message(title+"\n"+text);
}

function addnotiftobar(title, text, icon, ontouch, sound)
{
_notifyimg = app.CreateImage( icon, 0.045 )
_notifyimg.SetMargins( 0.01, 0, 0, 0 );
_notifyimg.Animate( "ZoominEnter",null,1000 );
_notifyimg.title=title
_notifyimg.text=text
layotherothbar.AddChild( _notifyimg );
notifs.push(_notifyimg);
notifs[notifs.length-1].SetOnTouchDown( function() {
if(typeof(ontouch)!="null") {
ontouch()
}
notifs[notifs.length-1].Animate( "ZoominExit" );
layotherothbar.RemoveChild( notifs[notifs.length-1] );
notifs.pop()
})
notifSound.Stop();
if(typeof(sound)!=null) {
notifSound.SetFile( sound );
}else{
notifSound.SetFile( "Snd/notification.mp3" );
}
notifSound.SetOnReady( function() {
notifSound.Play( );
} );
showntf(title,text,icon)
}

function music_play_popup(file) {
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
app.ShowPopup( "No file selected!" );
}
laympp.SetBackColor( "black" );
laympp.SetBackAlpha( 0.30 );
laympp.Animate( "FadeIn" );
laympp.AddChild( laympp1 );
}

function calltime()
{
time = new Date()
hours = time.getHours()
minutes = time.getMinutes()
seconds = time.getSeconds()
day = time.getDate()
month = time.getMonth()+1
year = time.getFullYear()
notify_update()
if(app.FileExists( "/sys/class/power_supply/battery/BatteryAverageCurrent")) {
  if(app.GetChargeType()!="None") {
  if(app.ReadFile( "/sys/class/power_supply/battery/BatteryAverageCurrent" )!="0") {
    notification = app.ReadFile( "/sys/class/power_supply/battery/BatteryAverageCurrent" )+"mA"
}
}else{ notification="" }
}
tmp_data.hours = hours
if(minutes<10) {
tmp_data.minutes = "0"+minutes
}else{
tmp_data.minutes = minutes
}
if(seconds<10) {
tmp_data.seconds = "0"+seconds
}else{
tmp_data.seconds = seconds
}
tmp_data.day = day
tmp_data.month = month
tmp_data.year = year
tmp_data.battery_percent = Math.ceil(app.GetBatteryLevel() * 100)
tmp_data.battery_charging = app.GetChargeType();
txttime.SetText( hours+":"+tmp_data.minutes );
if(lang=="ru") {
txtdate.SetText( daysofweek[ time.getUTCDay() ].ru+", "+day+" "+months_[tmp_data.month-1].ru+" "+year );
}else{
txtdate.SetText( daysofweek[ time.getUTCDay() ].en+", "+day+" of "+months_[tmp_data.month-1].en+" "+year );
}
txtnotif.SetText( notification );
if( tmp_data.battery_charging!="None" ) {
// app.FileExists( "/sys/class/power_supply/battery/BatteryAverageCurrent" )==true?app.ReadFile( "/sys/class/power_supply/battery/BatteryAverageCurrent" )
if(tmp_data.battery_percent<=25) {
txtbattery.SetText( "[fa-battery-1][fa-bolt] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=25){
txtbattery.SetText( "[fa-battery-2][fa-bolt] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=50){
txtbattery.SetText( "[fa-battery-3][fa-bolt] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=75){
txtbattery.SetText( "[fa-battery-4][fa-bolt] "+tmp_data.battery_percent + "%" )
}
}else{
if(tmp_data.battery_percent<=25) {
txtbattery.SetText( "[fa-battery-1] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=25){
txtbattery.SetText( "[fa-battery-2] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=50){
txtbattery.SetText( "[fa-battery-3] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=75){
txtbattery.SetText( "[fa-battery-4] "+tmp_data.battery_percent + "%" )
}
}

if( app.IsWifiEnabled() == true ) {
txtwireless.SetText( "[fa-wifi] " );
}else if( app.IsWifiApEnabled() == true ) {
txtwireless.SetText( "AP " );
}

if( app.GetOrientation() == "Landscape" ) {
layotherstatusbar.SetSize( 1,0.06 );
layotherothbar.SetSize( 0.7,0.06 );
layothermainbar.SetSize( 0.3, 0.06 );
}else{
layotherstatusbar.SetSize( 1,0.036 );
layotherothbar.SetSize( 0.7,0.036 );
layothermainbar.SetSize( 0.3, 0.036 );
}
}

function shutdown()
{
	clearInterval(calltime_int)
clearInterval(update_debugger)
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
layother1hoz.RemoveChild( textmps );
layotherstatusbar = null
layotherothbar = null
layothermainbar = null
txttime = null
txtdate = null
txtnotif = null
layotherhoz = null
layother1hoz = null
//txtstatus = null
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

function AddButton( lay, name )
{
	btn = app.CreateButton( name, 0.2, 0.1, "Alum" );
	btn.SetOnTouch( btnphone_OnTouch );
	lay.AddChild( btn );
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
//shutimage.SetMargins( 0, 0.01, 0, 0.01 );
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
},5000)
}

function showntf(title, text, icon)
{
layntf = app.CreateLayout( "Linear", "Horizontal,Top,Left" );
layntf.chck = false
layntf.SetSize( 1, null);
layntf_img = app.CreateImage( icon, 0.05 );
layntf_img.SetMargins( 0.025, 0.005, 0.025, 0.005 );
layntf_txt = app.CreateText( title+": "+text,null,null,"Multiline" );
layntf_txt.SetMargins( 0, 0.005, 0, 0.005 );
layntf.SetBackColor( "gray" );
ntf.push(layntf);
setTimeout(function() {
try{
if(ntf[ntf.length-1].chck == false) {
app.RemoveLayout( ntf[ntf.length-1] );
ntf.pop()
}
}
catch(e) {}
},2500);
ntf[ntf.length-1].AddChild( layntf_img );
ntf[ntf.length-1].AddChild( layntf_txt );
ntf[ntf.length-1].Animate( "BounceTop" );
	app.AddLayout( ntf[ntf.length-1] );
}

function phone()
{
	layphone = app.CreateLayout( "linear", "Vertical,fillxy" );
layphone.SetBackColor( "gray" );
lphtxt = app.CreateLayout( "linear", "Horizontal" );	
 	phonetxt = app.CreateText( "" );
	lphtxt.AddChild( phonetxt );
layphone.AddChild( lphtxt );
lph1 = app.CreateLayout( "linear", "Horizontal" );	
  AddButton(lph1,"1")
AddButton(lph1,"2")
AddButton(lph1,"3")
layphone.AddChild( lph1 );
lph2 = app.CreateLayout( "linear", "Horizontal" );	
  AddButton(lph2,"4")
AddButton(lph2,"5")
AddButton(lph2,"6")
layphone.AddChild( lph2 );
lph3 = app.CreateLayout( "linear", "Horizontal" );	
  AddButton(lph3,"7")
AddButton(lph3,"8")
AddButton(lph3,"9")
layphone.AddChild( lph3 );
lph4 = app.CreateLayout( "linear", "Horizontal" );	
  AddButton(lph4,"Call")
AddButton(lph4,"0")
AddButton(lph4,"<<<")
layphone.AddChild( lph4 );
lph5 = app.CreateLayout( "linear", "Horizontal" );	
layphone.AddChild( lph5 );
addclosebtn(layphone)
app.AddLayout( layphone );
}

function btnphone_OnTouch()
{
	app.Vibrate( "0,100" );
	
	//Get button text.
	btn = this;
var nmb = btn.GetText()
if( nmb == "<<<" ) {
phonenumber = ""
} else if( nmb == "Call" ) {
app.Call( phonenumber );
phonenumber = ""
} else {
phonenumber+=nmb
}
phonetxt.SetText( phonenumber );

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
browser.LoadHtml("<b>Браузер остановлен для оптимизации.</b>");
browser.Destroy();
app.RemoveLayout( lay )
lay = null
delete browser;
browser = null /* Браузер, ты никто! */
}
catch(e) {}
} );
}

function browser_activity(url)
{
	laybrowser = app.CreateLayout( "Linear", "Vertical,fillxy" );
laybrowser.SetBackColor( "gray" );
browser = app.CreateWebView( 1,0.87, "IgnoreErrors" );
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

addclosebtnbrowser(laybrowser)
laybrowser.AddChild( laybrowserhoz );
laybrowserhoz.AddChild( addressurlbar );
laybrowserhoz.AddChild( gobtn );
laybrowserhoz.AddChild( backbtnbrowser );
laybrowserhoz.AddChild( menubrowse );
laybrowser.AddChild( browser );
laybrowser.AddChild( laybrowserhoz1 );
if(typeof(url)=="undefined") {
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
app.AddLayout( laybrowser );
/*
setInterval(function(){
browsermemorytxt.SetText( window.performance.memory.usedJSHeapSize );
},1000)
*/
}

function showinfo()
{
infobtn.SetEnabled( false );
	layinfo = app.CreateLayout( "Linear", "Vertical,fillxy" );
layinfo.SetBackColor( "gray" );
addclosebtninfo(layinfo)
// КОД ИНФОРМАЦИИ О СИСТЕМЕ >> 1
logo = app.CreateImage( "Img/rammer.png", 0.15 );
logo.SetOnTouchDown( function() {
if(tmp_data.day==17 & tmp_data.month==12) {
soundPlayer1.Stop();
soundPlayer1.SetFile( "Snd/n64.mp3" );
soundPlayer1.SetOnReady( function(){ soundPlayer1.Play() } );
}else{
app.TextToSpeech( "Версия "+version );
}
} );
layinfo.AddChild( logo );
txtvers = app.CreateText( version );
txtfunnyphrase = app.CreateText( funnyphrase, null, null, "Multiline" );
txtfunnyphrase.SetTextSize( 14 );
txtcodename = app.CreateText( "Кодовое имя: " + codename );
if(isbeta==true) {
txtvers = app.CreateText( version+" beta" );
} else {
txtvers = app.CreateText( version );
}
txtvers.SetTextSize( 32 );
layinfo.AddChild( txtvers );
layinfo.AddChild( txtfunnyphrase );
layinfo.AddChild( txtcodename );
developersbtn = app.CreateButton( "О разработчиках" )
developersbtn.SetOnTouch( developersinfo );
layinfo.AddChild( developersbtn );
// КОНЕЦ << 1
app.AddLayout( layinfo );
}

function addclosebtninfo(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
infobtn.SetEnabled( true );
app.RemoveLayout( lay );
delete lay;
} );
}
 // ТУТ НАДО ЗВАТЬ ФИКСИКОВ
function music_activity(file)
{
laymusic = app.CreateLayout( "Linear", "Vertical,fillxy" );
laymusichoz = app.CreateLayout( "Linear", "Horizontal" );
laymusic.SetBackColor( "gray" );

musiclist = app.CreateList( app.ListFolder( "/sdcard/Rammer/Music/",".mp3" ),1,0.3 );
musiclist.SetOnTouch(choosemusic);

addclosebtn(laymusic)

laymusic.AddChild( musiclist );
laymusic.AddChild( laymusichoz );
app.AddLayout( laymusic );
}


function choosemusic(file)
{
audioPlayer.SetFile( "/sdcard/Rammer/Music/"+file );
  laymscdf = app.CreateLayout( "Linear", "Vertical,fillxy" );
  laymscdf.SetBackColor( "gray" );
  closebtnmsc = app.CreateButton( lang=="en"?"Close":"Закрыть" );
  closebtnmsc.SetOnTouch( function() {
    app.RemoveLayout( laymscdf );
  });
  laymscdfm = app.CreateLayout( "Linear", "Horizontal" );
control_volume = app.CreateSeekBar( 0.4,null );
  control_play = app.CreateButton( "[fa-play]",null,null,"FontAwesome" );
  control_stop = app.CreateButton( "[fa-stop]",null,null,"FontAwesome" );
  control_pause = app.CreateButton( "[fa-pause]",null,null,"FontAwesome" );
control_volume.SetRange( 1 );
control_play.SetOnTouch( audioPlayer.Play );
control_stop.SetOnTouch( audioPlayer.Stop );
control_pause.SetOnTouch( audioPlayer.Pause );
control_volume.SetOnTouch( function(a) {
audioPlayer.SetVolume( a,a )
} );

laymscdfm.AddChild( control_play );
laymscdfm.AddChild( control_pause );
laymscdfm.AddChild( control_stop );
laymscdfm.AddChild( control_volume );

  laymscdf.AddChild( closebtnmsc );
laymscdf.AddChild( laymscdfm );

  app.AddLayout( laymscdf );
}

function readdir(dir)
{
return app.ListFolder( dir );
}

function files_activity()
{
layfiles = app.CreateLayout( "Linear", "Vertical,fillxy" );
layfiles.SetBackColor( "gray" );
fileslist = app.CreateList( readdir("/"+ToFolder(dir)) ,null, 0.7 );
fileslist.SetOnTouch(chfolder)
//fileslist.SetOnLongTouch(file_operations)
addclosebtnfiles(layfiles)
layfiles.AddChild( fileslist );
backbtnfiles = app.CreateButton( "Назад" );
backbtnfiles.SetOnTouch( back_files );
txtpath = app.CreateText( "" );
layfiles.AddChild( txtpath );
layfiles.AddChild( backbtnfiles );
app.AddLayout( layfiles );
txtpath.SetText( "/"+ToFolder(dir) );
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
photo_activity("/"+ToFile(dir))
}
repng = new RegExp("\b*png");
if(repng.test("/"+ToFile(dir))) {
photo_activity("/"+ToFile(dir))
}
remp3 = new RegExp("\b*mp3");
if(remp3.test("/"+ToFile(dir))) {
music_play_popup("/"+ToFile(dir));
}
rewav = new RegExp("\b*wav");
if(rewav.test("/"+ToFile(dir))) {
music_play_popup("/"+ToFile(dir));
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
dir.pop()
}
txtpath.SetText( "/"+ToFolder(dir))
}

function addclosebtnfiles(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
//dir=dirf
delete lay;
} );
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
	laycamera = app.CreateLayout( "Linear", "Vertical,fillxy" );
laycamera.SetBackColor( "gray" );
laycamerahoz = app.CreateLayout( "Linear", "Horizontal" );
camerascreen = app.CreateCameraView( 1, 0.9 );
camerascreen.SetOnReady( function() { 
camerascreen.StartPreview();
});
snapcamerabtn = app.CreateButton( lang=="ru"?"Съемка":"Capture" );
snapcamerabtn.SetOnTouch( snapcamera );
flashlightbtn = app.CreateToggle( lang=="ru"?"Вспышка":"Flashlight" );
flashlightbtn.SetOnTouch( function(g){
camerascreen.SetFlash( g );
});
recordcamerabtn = app.CreateButton( "Видеозапись" );
recordcamerabtn.SetOnTouch( function() {
if(recordcamerabtn.GetText()=="Видеозапись") {
camerascreen.Record( "/sdcard/Rammer/Video/VID_"+tmp_data.year+"_"+tmp_data.month+"_"+tmp_data.day+"_"+tmp_data.hours+"_"+tmp_data.minutes+"_"+tmp_data.seconds+".mp4");
recordcamerabtn.SetText( "Стоп" )
}else if(recordcamerabtn.GetText()=="Стоп") {
camerascreen.Stop();
recordcamerabtn.SetText( "Видеозапись" )
}
});
laycamera.AddChild( camerascreen );
laycamera.AddChild( laycamerahoz );
laycamerahoz.AddChild( snapcamerabtn );
laycamerahoz.AddChild( flashlightbtn );
laycamerahoz.AddChild( recordcamerabtn )
addclosebtncam(laycamerahoz)
app.AddLayout( laycamera );
}

function addclosebtncam(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
app.RemoveLayout( laycamera );
delete lay
delete laycamera
} );
}


function snapcamera()
{
	camerascreen.TakePicture( folder+"/Pictures/PIC_"+tmp_data.year+"-"+tmp_data.month+"-"+"_"+tmp_data.hours+"-"+tmp_data.minutes+"-"+tmp_data.seconds+".jpg" );
}

function photo_activity(x,file_)
{
//alert(JSON.stringify(file_))
	layphoto = app.CreateLayout( "Linear", "Vertical,fillxy" );
layphoto.SetBackColor( "gray" );
imgphoto = app.CreateImage( file_, 1, 0.9 );
if(typeof(file_)=="undefined") {
file_=null
imgphoto.SetTextSize( 22 );
imgphoto.DrawText( "Выберите изображение в Файлах",0.01,0.5  );
}
//alert(file)
layphotohoz = app.CreateLayout( "Linear", "Horizontal" );
layphoto.AddChild( imgphoto );
layphoto.AddChild( layphotohoz );
addclosebtnpht(layphotohoz)
app.AddLayout( layphoto );
}

function addclosebtnpht(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
try{
app.RemoveLayout( lay );
app.RemoveLayout( layphoto );
}
catch (e) {}
delete lay
delete layphoto
} );
}

function s_event()
{
	lays = app.CreateLayout( "Linear", "Vertical,fillxy" );
lays.SetBackColor( "gray" );
lstswork = app.CreateList( melodies )
lstswork.SetOnTouch( function(mel){ 
audioPlayer.Stop();
audioPlayer.SetFile( mel )
audioPlayer.SetOnReady( function(){
audioPlayer.Play();
})
});
lays.AddChild( lstswork );
addclosebtn(lays)
app.AddLayout( lays );
}

function developersinfo()
{
laydevinfo = app.CreateLayout( "Linear", "Vertical,fillxy" );
laydevinfo.SetBackGradient( "blue","green","red" );
	txtdev1info = app.CreateText( "Андрей Павленко [andrejpavlenko666@gmail.com] - разработчик, бета тестер, и дизайнер (хотя дизайна нет)",null, null, "Multiline" );
txtdev1info.SetHtml("<b>Андрей Павленко</b> [andrejpavlenko666@gmail.com] - разработчик, бета тестер, и дизайнер (хотя дизайна нет)")
txtdev2info = app.CreateText( "Никита Серков [Main BETA-tester] [WoT: NikSerNagibator30]  - бета тестер и генератор идей.",null, null, "Multiline" );
laydevinfo.AddChild( txtdev1info )
laydevinfo.AddChild( txtdev2info );
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
txtdatelock = app.CreateText( "" );
statustxt = app.CreateText( "", null, null, "FontAwesome" );
msgtxt = app.CreateText( "", null, null, "FontAwesome" );
txttimelock.SetTextSize( 28 );
txtdatelock.SetTextSize( 24 );
statustxt.SetTextSize( statustxt.GetTextSize( )+6 );
txttimelock.SetText( hours+":"+tmp_data.minutes );
txtdatelock.SetText( day+"/"+month+"/"+year+" "+(lang=="ru"?daysofweek[ time.getUTCDay() ].ru:daysofweek[ time.getUTCDay() ].en) );
var intlocktime = setInterval(function () {
txttimelock.SetText( hours+":"+minutes );
txtdatelock.SetText( day+"/"+month+"/"+year+" "+(lang=="ru"?daysofweek[ time.getUTCDay() ].ru:daysofweek[ time.getUTCDay() ].en) );
if( tmp_data.battery_charging!="None" ) {
if(tmp_data.battery_percent<=25) {
statustxt.SetText( "[fa-battery-1][fa-bolt] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=25 && tmp_data.battery_percent<=50) {
statustxt.SetText( "[fa-battery-2][fa-bolt] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=50 && tmp_data.battery_percent<=75) {
statustxt.SetText( "[fa-battery-3][fa-bolt] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=75 && tmp_data.battery_percent<=100) {
statustxt.SetText( "[fa-battery-4][fa-bolt] "+tmp_data.battery_percent + "%" )
}else{
statustxt.SetText( "[fa-battery-4][fa-bolt]"+tmp_data.battery_percent + "%" )
}
}else{
if(tmp_data.battery_percent<=25) {
statustxt.SetText( "[fa-battery-1] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=25 && tmp_data.battery_percent<=50) {
statustxt.SetText( "[fa-battery-2] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=50 && tmp_data.battery_percent<=75) {
statustxt.SetText( "[fa-battery-3] "+tmp_data.battery_percent + "%" )
}else if(tmp_data.battery_percent>=75 && tmp_data.battery_percent<=100) {
statustxt.SetText( "[fa-battery-4] "+tmp_data.battery_percent + "%" )
}else{
statustxt.SetText( "[fa-battery-4] "+tmp_data.battery_percent + "%" )
}
}
},400)
txttimelock.SetTextSize( 44 );
laylock.AddChild( txttimelock );
laylock.AddChild( txtdatelock );
laylock.AddChild( statustxt );
laylock.AddChild( msgtxt );
btnunlock = app.CreateButton( "Разблокировать" );
btnunlock.SetOnTouch( function () {
if(typeof(password)!="undefined" && password!="") {
if(password==prompt("Ты поставил пароль, теперь разблокируй")) {
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
	laychwallpapers = app.CreateLayout( "Linear", "Vertical,fillxy" );
laychwallpapers.SetBackColor( "gray" );
laychwallpapershoz = app.CreateLayout( "Linear", "Horizontal" );
laychwallpapershoz1 = app.CreateLayout( "Linear", "Horizontal" );
imgw1 = app.CreateImage( "Img/wallpaper1.jpg",0.2,0.2);
imgw1.SetOnTouch( chwtow1 );
imgw2 = app.CreateImage( "Img/wallpaper2.jpg",0.2,0.2);
imgw2.SetOnTouch( chwtow2 );
imgw3 = app.CreateImage( "Img/wallpaper3.jpg",0.2,0.2);
imgw3.SetOnTouch( chwtow3 );
imgw4 = app.CreateImage( "Img/wallpaper4.jpg",0.2,0.2);
imgw4.SetOnTouch( chwtow4 );
imgwny = app.CreateImage( "Img/wallpaperny.jpg",0.2,0.2);
imgwny.SetOnTouch( chwtowny );
laychwallpapers.AddChild( laychwallpapershoz );
laychwallpapershoz.AddChild( imgw1 );
laychwallpapershoz.AddChild( imgw2 );
laychwallpapershoz.AddChild( imgw3 );
laychwallpapershoz.AddChild( imgw4 );
laychwallpapers.AddChild( laychwallpapershoz1 );
laychwallpapershoz1.AddChild( imgwny );
txtwallpaperstatus = app.CreateText( "" );
btnresetwallpaper = app.CreateButton( "Вернуть обои!!!" );
btnresetwallpaper.SetOnTouch( function(){
app.SaveText( "background",background_default );
//txtwallpaperstatus.SetText( "Перезапустите приложение для установки обоев" );
lay.SetBackground( background_default );
});
laychwallpapers.AddChild( btnresetwallpaper );
laychwallpapers.AddChild( txtwallpaperstatus );
addclosebtnchw(laychwallpapers)
app.AddLayout( laychwallpapers );
}

function addclosebtnchw(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
delete lay
} );
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

function livevideoapp()
{
if( typeof(lvskblive) != "undefined" ){
clearInterval( lvskblive );
clearInterval( typeof(tmp_data.seeklivetv)!="undefined"?null:tmp_data.seeklivetv )
}
		layvideo = app.CreateLayout( "Linear","Vertical,fillxy" );
layvideohoz = app.CreateLayout( "Linear", "Horizontal" );
layvideo.SetBackColor( "gray" );
// НАЧАЛО КОДА >> 4
videoPlayer = app.CreateVideoView( 1,0.6 );
urlboxtxt = app.CreateTextEdit( "",1, null, "SingleLine" );
skblivetv = app.CreateSeekBar( 1 );
url=""
btnvideoplay = app.CreateButton( "[fa-play]", null, null, "FontAwesome" );
btnvideoplay.SetOnTouch( function() {
url= urlboxtxt.GetText();
if(url=="") {
rammer_error("Введите адрес видеопотока")
}else{
videoPlayer.SetFile( url );
}
skblivetv.SetOnTouch( function(time) {
videoPlayer.SeekTo( time );
});
videoPlayer.Play();
tmp_data.seeklivetv = setInterval( function() {
livetvdur = videoPlayer.GetDuration();
livetvcur = videoPlayer.GetPosition();
skblivetv.SetRange( livetvdur );
skblivetv.SetValue( livetvcur );
},1000)
});
btnvideopause = app.CreateButton( "[fa-pause]", null, null, "FontAwesome" );
btnvideopause.SetOnTouch( function() {
videoPlayer.Pause();
});
btnvideostop = app.CreateButton( "[fa-stop]", null, null, "FontAwesome" );
btnvideostop.SetOnTouch( function() {
videoPlayer.Stop();
clearInterval(tmp_data.seeklivetv)
});
layvideo.AddChild( urlboxtxt );
layvideo.AddChild( skblivetv );
layvideohoz.AddChild( btnvideoplay );
layvideohoz.AddChild( btnvideopause );
layvideohoz.AddChild( btnvideostop );
layvideo.AddChild( videoPlayer );
// КОНЕЦ << 4
Ks = app.CreateButton( "Закрыть" );
Ks.SetOnTouch( function() {
app.RemoveLayout( layvideo );
clearInterval( typeof(tmp_data.seeklivetv)!="undefined"?null:tmp_data.seeklivetv )
clearInterval( typeof(lvskblive)!="undefined"?null:lvskblive )
} );
layvideo.AddChild( Ks );
layvideo.AddChild( layvideohoz );
app.AddLayout( layvideo );
lvskblive = setInterval( function() {
if( app.GetOrientation() == "Landscape" ) {
videoPlayer.SetSize( 1, 1 );
layvideo.RemoveChild( urlboxtxt );
layvideo.RemoveChild( skblivetv );
}else{
videoPlayer.SetSize( 1, 0.4 );
layvideo.AddChild( urlboxtxt, 0);
layvideo.AddChild( skblivetv, 1);
}
},1000)
}

function notes_activity()
{
var notes = app.LoadText( "notes",[] );
notes = notes.split(",")
for(i=0;i<notes.length;i++) {
notes[i].replace(":",'^c^');
}
var lasttxt = ""
var spl = ""

noteslay = app.CreateLayout( "linear", "Vertical,FillXY" );	
noteslist = app.CreateList( notes, 1, 0.8 );
noteslay.SetBackColor( "gray" );
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

notesclearbtn = app.CreateButton( "Очистить" )
notesclearbtn.SetOnTouch( clearnotes );
noteslay.AddChild( notesclearbtn );

noteshinttext = app.CreateText( "Чтобы удалить заметку, нужно удерживать заметку.", null, null, "Multiline" );

addclosebtnnotes(noteslayhoz)
noteslay.AddChild( noteslayhoz );
if(notes[0]=="") {
notes.splice(0,1)
}
	//Add layout to app.	
noteslay.AddChild( noteshinttext );
	app.AddLayout( noteslay );

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

function addclosebtnnotes(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
app.RemoveLayout( noteslay );
} );
}

function settings_activity() {
settingsbtn.SetEnabled( false );
laysettings = app.CreateLayout( "Linear", "Vertical,fillxy" );
laysettings.SetBackColor( "gray" );
laysettings1 = app.CreateLayout( "Linear", "Horizontal" );

dbgbtn = app.CreateToggle( "Дебаг" );
dbgbtn.SetChecked( debug );
dbgbtn.SetOnTouch( function(g) {
if(debug==true) {
debug = app.SaveBoolean( "debug",false );
debug = false
}else{
debug = app.SaveBoolean( "debug",true );
debug = true
}
} );
laysettings1.AddChild( dbgbtn );

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

function addclosebtnsettings(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
settingsbtn.SetEnabled( true );
});
}

function __instpkg(src)
{
	app.UnzipFile( src,"/sdcard/Rammer/Apps/" );
}

function terminal_act()
{
	layterm = app.CreateLayout( "Linear", "Vertical" );
layterm.SetBackColor( "gray" );
term_txte = app.CreateTextEdit( "Welcome to Rammer "+version+" terminal!\n",1,0.8 );
term_txte.SetBackColor( "black" );
laytermhoz = app.CreateLayout( "Linear", "Horizontal" );
term_txte_1 = app.CreateTextEdit( "",0.85,null );
term_btn = app.CreateButton( ">" );
term_clsb = app.CreateButton( "[fa-close]",null,null,"FontAwesome" );
term_clsb.SetOnTouch( function() {
layterm.RemoveChild( term_txte );
layterm.RemoveChild( term_txte_1 );
layterm.RemoveChild( laytermhoz );
layterm.RemoveChild( term_btn );
layterm.RemoveChild( term_clsb );
app.RemoveLayout( layterm );
} );
term_btn.SetOnTouch( function() {
cmd = term_txte_1.GetText();
if(cmd!="") {
term_txte_1.SetText( "" );
term_txte.SetText(term_txte.GetText()+"> "+cmd+"\n");
if( app.FileExists( "/sdcard/Rammer/Sys/Cmd/"+cmd+".js" ) ) {
__=app.ReadFile("/sdcard/Rammer/Sys/Cmd/"+cmd+".js") 
eval(__) // ТУПО ВЫПОЛНИТЬ
}else{
try{
this.result = eval(cmd);
term_txte.SetText(term_txte.GetText()+this.result+"\n");
this.rpl = cmd.split(" ");
cmd_data=this.rpl
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
app.AddLayout( layterm );
}


//ЭТОТ КОД ОБЯЗАН БЫТЬ В КОНЦЕ
function runapp(name)
{
	code = app.ReadFile( "/sdcard/Rammer/Apps/"+name+"/main.js" );
tmp_data.assetslocation = "/sdcard/Rammer/Apps/"+name+"/"
try{
eval(code)
}
catch(e) {
alert("Произошла ошибка: "+e)
}
}