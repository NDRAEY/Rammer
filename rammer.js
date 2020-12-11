// Rammer by Andrey Pavlenko
var version, codename, buildnumber, funnyphrase, isbeta, background_default = null
var background, phonenumber, defaulturl, debug, daysofweek = null
var folder_exists, tmp_data, app_data, notification, folder = null
var repeat_music, sh_rad, sh_dy, melodies, xcm, bootanimationtime = null
var fullscreen, mpslast, soundonboot, settingslistmenu = null
var scw, sch, mainscr, procs, notifs, livewallpapers, synth = null;

function init_vars() {
version = "2.8.9"
codename = "Homework"
buildnumber = "15999" // ЭТО ИМИТАЦИЯ, НЕ ОБРАЩАЙТЕ ВНИМАНИЯ
funnyphrase = "У кого подгорала жопа когда вы пытались открыть уведомления?"
isbeta = true
background_default = "/Sys/Img/GreenBack.jpg"
background = app.LoadText( "background","/Sys/Img/GreenBack.jpg" )
phonenumber=""
folder = "/sdcard/Rammer/"
scw = app.GetScreenWidth(  );
sch = app.GetScreenHeight(  );
defaulturl = "Html/wygl_start_page.html"
debug = app.LoadBoolean("debug",false)
// По JS дни начинаются с воскресенья
daysofweek = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"]
folder_exists = app.FolderExists( folder );
tmp_data = {}
app_data = {}
livewallpapers=false
notification = ""
repeat_music = false
sh_rad = 0
sh_dy = 0.05
procs = []
notifs = []
melodies = ["Snd/melody1.mp3"]
n = [
{name:"Музыка",func:music_activity,icon:"Sys/Icon/music.png"}, /* Иконок нету :) */
{name:"Файлы",func:files_activity},
{name:"Фото",func:photo_activity},
{name:"Камера",func:camera_activity},
{name:"IPTV",func:livevideoapp},
{name:"Заметки",func:notes_activity}
]
bpl=4
synth = app.CreateSynth();
xcm = app.ListFolder( folder );
//laystatus=null
if( debug==true ) {
 bootanimationtime = 2000
}else{
 bootanimationtime = 6000
}
 fullscreen = app.LoadBoolean("fs",false)
if( fullscreen ) app.SetScreenMode( "Full" );
 soundonboot = [app.LoadBoolean("sob",false),app.SaveText("sobf","Snd/testbootsound.mp3")]
settingslistmenu = [
"Дебаг > "+(debug==true?"Вкл.":"Выкл"),
"Другой звук запуска > "+(soundonboot[0]==true?"Вкл.":"Выкл")
]
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
dwn = app.CreateDownloader(  );
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
bootsnd = app.CreateMediaPlayer();
bootsnd.SetFile( soundonboot[1] )
bootanim = app.CreateVideoView( 1.1,1 );
bootanim.SetFile( "Vid/bootanimation.mp4" );
bootanim.Play();
if(soundonboot[0]==true) { 
bootanim.SetVolume( 0,0 );
setTimeout( "bootsnd.Play()",2000)
}
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

if(folder_exists==false) {
app.MakeFolder( folder );
app.MakeFolder( folder+"/Music/" );
app.MakeFolder( folder+"/Pictures/" );
app.MakeFolder( folder+"/Apps/" );
app.MakeFolder( folder+"/Video/" );
app.MakeFolder( folder+"/Mods/" );
app.MakeFolder( folder+"/Temps/" );
}

audioPlayer = app.CreateMediaPlayer();
soundPlayer = app.CreateMediaPlayer();
soundPlayer1 = app.CreateMediaPlayer();
notifSound = app.CreateMediaPlayer();

laymainbtns = app.CreateLayout( "linear", "Horizontal,fillxy,Bottom" );
lay.SetBackground( background );

layother = app.CreateLayout( "Linear", "Vertical" );
buttonphone = app.CreateButton( "Телефон" );
laymainbtns.AddChild( buttonphone );
/*
buttonsms = app.CreateButton( "СМС" );
laymainbtns.AddChild( buttonsms );
*/
buttons = app.CreateButton( "Мелодии" );
buttons.SetOnTouch( s_event );
laymainbtns.AddChild( buttons );
buttonbrowser = app.CreateButton( "Браузер" );
laymainbtns.AddChild( buttonbrowser );

buttonbrowser.SetOnLongTouch( function() {
	laybrowser = null
browser = null
gobtn = null
laybrowserhoz = null
laybrowserhoz1 = null
addressurlbar = null
loadbar = null
browsermemorytxt = null
backbtnbrowser = null
urldata = null
rammer_message("RAM браузера очищен")
});

// НАЧИНАЕТСЯ СТАТУС БАР

layotherstatusbar = app.CreateLayout( "Linear", "Horizontal" );
layotherstatusbar.SetBackColor( "gray" );
layotherstatusbar.SetSize( 1,0.04 );
layother.AddChild( layotherstatusbar );

layotherothbar = app.CreateLayout( "Linear", "Horizontal,Left" );
//layotherothbar.SetBackColor( "gray" );
layotherothbar.SetSize( 0.7,0.04 );
layotherstatusbar.AddChild( layotherothbar );

layothermainbar = app.CreateLayout( "Linear", "Horizontal,Right" );
//layothermainbar.SetBackColor( "gray" );
layothermainbar.SetSize( 0.3,0.04 );
layotherstatusbar.AddChild( layothermainbar );

showdwnbtn = app.CreateText( "[fa-arrow-down]",null,null,"FontAwesome" );
showdwnbtn.SetTextSize( 25 );
showdwnbtn.SetOnTouchDown( function() {
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
infobtn = app.CreateButton( "[fa-info]  О системе", null, null, "FontAwesome" );
infobtn.SetOnTouch( showinfo );
laybtnsdraw.AddChild( infobtn );
laydrawer.AddChild( laybtnsdraw );
laydrawer.AddChild( laybtnsdraw1 );
laydrawer.AddChild( laybtnsdraw2 );

Appsbtn = app.CreateButton( "Приложения" );
Appsbtn.SetOnTouch( showApps );
laybtnsdraw.AddChild( Appsbtn );

lockscreenbtn = app.CreateButton( "Заблокировать экран" );
lockscreenbtn.SetOnTouch( screenlock );
lockscreenbtn.SetOnLongTouch( function() {
passwd = prompt("Пароль")
screenlock(passwd)
});
laybtnsdraw1.AddChild( lockscreenbtn );

settingsbtn = app.CreateButton( "Настройки" );
settingsbtn.SetOnTouch( settings_activity );
laybtnsdraw1.AddChild( settingsbtn );

procmanbtn = app.CreateButton( "ProcMan" );
procmanbtn.SetOnTouch( procman_activity );
laybtnsdraw.AddChild( procmanbtn );

reloadvarsbtn = app.CreateButton( "Перезагрузка" );
reloadvarsbtn.SetEnabled( true );
reloadvarsbtn.SetOnTouch(function() { 
// ПЕРЕЗАГРУЗКА И ОЧИСТКА ПЕРЕМЕННЫХ
shutdown()

version, codename, buildnumber, funnyphrase, isbeta, background_default = null
background, phonenumber, defaulturl, debug, daysofweek = null
folder_exists, tmp_data, app_data, notification = null 
repeat_music, sh_rad, sh_dy, melodies, xcm, bootanimationtime = null
fullscreen, mpslast, soundonboot, settingslistmenu = null
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

fsbtn = app.CreateToggle( "Полноэкранный" );
fsbtn.SetOnTouch( function(g) {
fullscreen = g
app.SaveBoolean( "fs",g );
if( fullscreen ){ app.SetScreenMode( "Full" ) }else{ app.SetScreenMode( "Normal" ) }
});
fsbtn.SetChecked( fullscreen );
laybtnsdraw2.AddChild( fsbtn );
laydrawer.SetBackColor( "gray" );
laydrawer.Animate( "FlipFromTop" );
app.AddLayout( laydrawer );
close = app.CreateText( "[fa-arrow-up]",null,null,"fontawesome");
close.SetOnTouch( function() {
laydrawer.RemoveChild( laystatus );
laydrawer.RemoveChild( laybtnsdraw );
laydrawer.RemoveChild( laybtnsdraw1 );
laydrawer.RemoveChild( laybtnsdraw2 );
laydrawer.RemoveChild( infobtn );
laydrawer.RemoveChild( close );
app.RemoveLayout( laydrawer );
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
txtdate.SetTextSize( 28 );
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
txtwireless.SetTextSize( "19" );

txtbattery = app.CreateText( "", null, null, "FontAwesome" );
layothermainbar.AddChild( txtbattery );
txtbattery.SetTextColor( "white" );
txtbattery.SetTextSize( "19" );

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

for(i=0;i<n.length;i++) {
if(i%bpl==0) {
layiconshoriz= app.CreateLayout( "Linear", "Horizontal" );
layother.AddChild( layiconshoriz );
}
icon = app.CreateButton( n[i].name )
icon.SetOnTouch( n[i].func );
layiconshoriz.AddChild( icon );
}

layother.AddChild( layiconshoriz );
if( app.FileExists( "/sdcard/Rammer/Mods/main.js" ) ) {
try{
eval( app.ReadFile( "/sdcard/Rammer/Mods/main.js" ) )
}
// ПОФИКСИТЬ
catch(e) { }
}


	//Add layout to app.	
//	app.AddLayout( lay );
}

function notify_update()
{
layother.RemoveChild( txtnotif );
txtnotif.Animate( "BounceLeft" );
	txtnotif.SetText( notification );
layother.AddChild( txtnotif, 3 );
}


function create_notify(text,time)
{
	// КОД УВЕДОМЛЕНИЙ
notification = text
notify_update()
// ТАЙМЕР КОД
setTimeout(function() {
notification=""
notify_update()
},time)
//КОНЕЦ
}

function updatemps()
{
textmps.SetText(window.performance.memory.totalJSHeapSize);
}

// addnotiftobar("Img/rammer.png",function() {},"Rammer","Hello, world!!!");

function addnotiftobar(icon, ontouch, title, text, sound)
{
_notifyimg = app.CreateImage( icon, 0.045 )
_notifyimg.SetMargins( 0.01, 0, 0, 0 );
_notifyimg.Animate( "ZoominEnter",null,1000 );
_notifyimg.title=title
_notifyimg.text=text
layotherothbar.AddChild( _notifyimg );
notifs.push(_notifyimg);
notifs[notifs.length-1].SetOnTouchDown( function() {
ontouch()
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
audioPlayer.SetFile( "/sdcard/Rammer/Music/"+file );
audioPlayer.SetOnReady( function() {
audioPlayer.Play(  );
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
laympp.SetBackAlpha( 0.35 );
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
txtdate.SetText( day+"/"+month+"/"+year+" "+daysofweek[ time.getUTCDay() ] );
txtnotif.SetText( notification );

if( tmp_data.battery_charging!="None" ) {
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


function drawdrawer()
{
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
infobtn = app.CreateButton( "[fa-info]  О системе", null, null, "FontAwesome" );
infobtn.SetOnTouch( showinfo );
laybtnsdraw.AddChild( infobtn );
laydrawer.AddChild( laybtnsdraw );
laydrawer.AddChild( laybtnsdraw1 );
laydrawer.AddChild( laybtnsdraw2 );
laynotifs_scroller = app.CreateScroller( 1,0.7 );
laynotifs_scroller_lay = app.CreateLayout( "Linear", "Vertical" );
laynotifs_scroller.AddChild( laynotifs_scroller_lay );
laydrawer.AddChild( laynotifs_scroller );

Appsbtn = app.CreateButton( "Приложения" );
Appsbtn.SetOnTouch( showApps );
laybtnsdraw.AddChild( Appsbtn );

lockscreenbtn = app.CreateButton( "Заблокировать экран" );
lockscreenbtn.SetOnTouch( screenlock );
lockscreenbtn.SetOnLongTouch( function() {
passwd = prompt("Пароль")
screenlock(passwd)
});
laybtnsdraw1.AddChild( lockscreenbtn );

settingsbtn = app.CreateButton( "Настройки" );
settingsbtn.SetOnTouch( settings_activity );
laybtnsdraw1.AddChild( settingsbtn );

procmanbtn = app.CreateButton( "ProcMan" );
procmanbtn.SetOnTouch( procman_activity );
laybtnsdraw.AddChild( procmanbtn );

reloadvarsbtn = app.CreateButton( "Перезагрузка" );
reloadvarsbtn.SetEnabled( true );
reloadvarsbtn.SetOnTouch(function() { 
// ПЕРЕЗАГРУЗКА И ОЧИСТКА ПЕРЕМЕННЫХ
shutdown()

version, codename, buildnumber, funnyphrase, isbeta, background_default = null
background, phonenumber, defaulturl, debug, daysofweek = null
folder_exists, tmp_data, app_data, notification = null 
repeat_music, sh_rad, sh_dy, melodies, xcm, bootanimationtime = null
fullscreen, mpslast, soundonboot, settingslistmenu = null
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

fsbtn = app.CreateToggle( "Полноэкранный" );
fsbtn.SetOnTouch( function(g) {
fullscreen = g
app.SaveBoolean( "fs",g );
if( fullscreen ){ app.SetScreenMode( "Full" ) }else{ app.SetScreenMode( "Normal" ) }
});
fsbtn.SetChecked( fullscreen );
laybtnsdraw2.AddChild( fsbtn );
//laynotifs_scroller.SetBackColor( "#cc22cc" );
for(i=0;i<2;i++) {
laynotif_drw = app.CreateLayout( "Linear", "Vertical" );
laynotif_drw.SetSize( 0.85 );
laynotif_drw_hoz_tit = app.CreateLayout( "Linear", "HLeft" );
laynotif_drw_hoz_txt = app.CreateLayout( "Linear", "HLeft" );
laynotif_drw_hoz_txt.SetBackColor( "#cc22cc" );
laynotif_drw_hoz_txt.SetSize( 0.85 );
laynotif_drw.SetCornerRadius( 1 );
laynotif_drw.SetBackColor( "#999966" );
laynotif_drw_image = app.CreateImage( "Img/rammer.png", 0.07 );
laynotif_drw_txt = app.CreateText( "Hello,world!!!" );
laynotif_drw_title = app.CreateText( " Rammer".toUpperCase() );
laynotif_drw_title.SetTextSize(16)
laynotif_drw.SetMargins( 0.01, 0.01, 0.01, 0.01 );
laynotif_drw.AddChild( laynotif_drw_hoz_tit );
laynotif_drw.AddChild( laynotif_drw_hoz_txt );
laynotif_drw_hoz_tit.AddChild( laynotif_drw_image );
laynotif_drw_hoz_tit.AddChild( laynotif_drw_title );
laynotif_drw_hoz_txt.AddChild( laynotif_drw_txt );
laynotifs_scroller_lay.AddChild( laynotif_drw );
}
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
// A4GAMNO
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
shuttxt = app.CreateText( " Выключение" );
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
urldata = browser.GetUrl()
addressurlbar.SetText( urldata );
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
if(tmp_data.day=="17" & tmp_data.month=="12") {
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

function music_activity(file)
{
clear_interval_if_exists(tmp_data.musictimeint);

folder = "/sdcard/Rammer/Music/"
laymusic = app.CreateLayout( "Linear", "Vertical,fillxy" );
laymusichoz = app.CreateLayout( "Linear", "Horizontal" );
laymusic.SetBackColor( "gray" );
musiclist = app.CreateList( app.ListFolder( folder,".mp3" ),1,0.3 );
musiclist.SetOnTouch(choosemusic)
statusmusictext = app.CreateText( "", null, null, "Multiline");
musictimetext = app.CreateText( "", null, null, "");
addclosebtn(laymusic)

stopmusicbtn = app.CreateButton( "[fa-stop]",null, null, "FontAwesome" );
stopmusicbtn.SetOnTouch( function() {
audioPlayer.Stop();
} );
swloopmusic = app.CreateToggle( "Повторять музыку", null, null, "FontAwesome" );
swloopmusic.SetChecked( repeat_music );
swloopmusic.SetOnTouch( function(yn) {
repeat_music=yn
});

laymusic.AddChild( musiclist );
laymusic.AddChild( statusmusictext );
laymusic.AddChild( musictimetext );
seekmusicbar = app.CreateSeekBar( 1 );
laymusic.AddChild( seekmusicbar );
laymusic.AddChild( laymusichoz );
if(typeof(file)!="undefined") {
choosemusic(file)
musicready()
}
laymusichoz.AddChild( swloopmusic );
laymusichoz.AddChild( stopmusicbtn );
app.AddLayout( laymusic );
}


function choosemusic(file)
{
audioPlayer.Stop();
audioPlayer.SetFile( folder+file )
statusmusictext.SetText( "Сейчас проигрывается: "+folder+file );
audioPlayer.Play(  );
musicready()
if(repeat_music) {
audioPlayer.SetOnComplete( function() {
audioPlayer.Stop();
audioPlayer.SetFile( folder+file )
statusmusictext.SetText( "Сейчас проигрывается: "+folder+file );
audioPlayer.Play(  );
musicready()
} );
}
audioPlayer.SetOnReady( function() {
statusmusictext.SetText( "Сейчас проигрывается: "+folder+file );
audioPlayer.Play(  );
musicready()
audioPlayer.SetOnSeekDone( musiccomplete );
})
}

function choosemusicfiles(file)
{
audioPlayer.Stop();
audioPlayer.SetFile( file );
audioPlayer.Play();
audioPlayer.SetOnReady( function() {
audioPlayer.Play();
});
//musicready()
//audioPlayer.SetOnSeekDone( musiccomplete );
}

function musicready()
{
seekmusicbar.SetRange( audioPlayer.GetDuration() );
seekmusicbar.SetOnTouch( seek_music );
 tmp_data.musictimeint = setInterval(function () {
var seekmusic = audioPlayer.GetPosition();
d = seekmusic
min = Math.ceil(Math.floor(d % 3600 / 60))
sec = Math.ceil(Math.floor(d % 3600 % 60))
mint = Math.ceil(Math.floor( audioPlayer.GetDuration() % 3600 / 60))
sect = Math.ceil(Math.floor( audioPlayer.GetDuration() % 3600 % 60))
mind = min.toString()
secd = sec.toString()
mintd = mint.toString()
sectd = sect.toString()
if(mind<=9) {
mind="0"+mind
}
if(secd<=9) {
secd="0"+secd
}
if(mintd<=9) {
mintd="0"+mintd
}
if(sectd<=9) {
sectd="0"+sectd
}
musictimetext.SetText( mind+":"+secd+" / "+mintd+":"+sectd);
seekmusicbar.SetValue( seekmusic );
},100)
}

function musiccomplete()
{
	clearInterval( tmp_data.musictimeint );
delete tmp_data.musictimeint
}

function seek_music(e)
{
audioPlayer.SeekTo( e );
}

// ЭТОТ КУСОК КОДА НУЖДАЕТСЯ В ПОЧИНКЕ
function files_activity()
{
curfold = folder
folder = "/sdcard/Rammer"
xcm = app.ListFolder( folder );
layfiles = app.CreateLayout( "Linear", "Vertical,fillxy" );
layfiles.SetBackColor( "gray" );
fileslist = app.CreateList( xcm ,null, 0.7 );
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
txtpath.SetText( folder );
/*
	lst = app.CreateList( xcm );
lst.SetOnTouch( chfolder );
btnback = app.CreateButton( "Back" );
btnback.SetOnTouch( function() {
dir="/sdcard/Rammer"
xcm = app.ListFolder( dir );
lst.SetList( xcm );
});
lay.AddChild( btnback );
*/

}

function chfolder(fold)
{
/*
	dir+="/"+ev
xcm = app.ListFolder( dir );
lst.SetList( xcm );
}
*/
if( app.IsFolder( folder+"/"+fold ) ) {
folder+="/"+fold
tmp_data.fold = fold
xcm = app.ListFolder( folder );
fileslist.SetList(xcm)
}else{

/*if( app.IsFolder( xcm ) ) {

}else{
*/
rejpg = new RegExp("\b*jpg");
if(rejpg.test(curfold+"/"+fold)) {
photo_activity(curfold+"/Pictures/"+fold)
}
remp3 = new RegExp("\b*mp3");
if(remp3.test(curfold+"/"+fold)) {
music_play_popup(fold);
//rammer_message("Аудио проигрывается: "+fold)
//choosemusicfiles(curfold+"/Music/"+fold);
}
remp4 = new RegExp("\b*mp4")
if(remp4.test(curfold+"/"+fold)) {
// rammer_message("Открываю видео")
video_activity(curfold+"/Video/"+fold)
// video_activity.otherfuncs()
}
}
txtpath.SetText( folder );
}

function addclosebtnfiles(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
folder="/sdcard/Rammer"
delete lay;
} );
}

function back_files()
{
folder="/sdcard/Rammer"
	fileslist.SetList(app.ListFolder(folder))
txtpath.SetText( folder );
//txtpath.SetText( xcm );
}

function showApps()
{
Appsbtn.SetEnabled( false );
layApps = app.CreateLayout( "Linear", "Vertical,fillxy" );
	layAppsbtn = app.CreateLayout( "Linear", "Horizontal" );
layApps.SetBackColor( "gray" );
layAppsbtn1 = app.CreateLayout( "Linear", "Horizontal" );
layApps.AddChild( layAppsbtn1 );
layApps.AddChild( layAppsbtn );
// КОД >>2
/*
addappbtn = app.CreateButton( "Добавить" );
addappbtn.SetOnTouch( addapp_event );
layAppsbtn.AddChild( addappbtn );
*/
changewallpapersbtn = app.CreateButton( "Сменить обои" );
changewallpapersbtn.SetOnTouch( changewallpapers );
layAppsbtn.AddChild( changewallpapersbtn );
dsmsbtn = app.CreateButton( "DSMS" );
dsmsbtn.SetOnTouch( dsms_activity );
layAppsbtn.AddChild( dsmsbtn )
/*
marketbtn = app.CreateButton( "appz" );
marketbtn.SetOnTouch( market_activity );
layAppsbtn.AddChild( marketbtn );
*/
//КОНЕЦ <<2

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
snapcamerabtn = app.CreateButton( "Сфотать" );
snapcamerabtn.SetOnTouch( snapcamera );
flashlightbtn = app.CreateToggle( "Вспышка" );
flashlightbtn.SetOnTouch( function(g){
camerascreen.SetFlash( g );
});
laycamera.AddChild( camerascreen );
laycamera.AddChild( laycamerahoz );
laycamerahoz.AddChild( snapcamerabtn );
laycamerahoz.AddChild( flashlightbtn );
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
	camerascreen.TakePicture( folder+"/Pictures/PIC_"+tmp_data.year+"-"+tmp_data.month+"-"+tmp_data.seconds+"_"+tmp_data.hours+"-"+tmp_data.minutes+"-"+tmp_data.seconds+".jpg" );
}

function photo_activity(file)
{
	layphoto = app.CreateLayout( "Linear", "Vertical,fillxy" );
layphoto.SetBackColor( "gray" );
imgphoto = app.CreateImage( file, 1, 0.9 );
if(typeof(file)=="undefined") {
file=null
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
txtdev2info = app.CreateText( "Никита Серков [WoT: NikSerNagibator30] [емэйл@gmail.com] - бета тестер и генератор идей.",null, null, "Multiline" );
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
txttimelock.SetText( hours+":"+minutes );
txtdatelock.SetText( day+"/"+month+"/"+year+" "+daysofweek[ time.getUTCDay() ] );
var intlocktime = setInterval(function () {
txttimelock.SetText( hours+":"+minutes );
txtdatelock.SetText( day+"/"+month+"/"+year+" "+daysofweek[ time.getUTCDay() ] );
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
imgwny = app.CreateImage( "Img/wallpaper4.jpg",0.2,0.2);
imgny.SetOnTouch( chwtowny );
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
layvideohoz.AddChild( btnvideoplay );
layvideohoz.AddChild( btnvideopause );
layvideohoz.AddChild( btnvideostop );
layvideo.AddChild( videoPlayer );
// КОНЕЦ << 4
	closebtn = app.CreateButton( "Закрыть" );
  layvideo.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
app.RemoveChild( layvideohoza );
app.RemoveLayout( layvideohoz );
//clearInterval(lvskblive)
} );
layvideo.AddChild( layvideohoz );
app.AddLayout( layvideo );
}
/*
function addclosebtnvid(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
app.RemoveChild( layvideohoza );
app.RemoveLayout( layvideohoz );
//clearInterval(lvskblive)
} );
}
*/
function dsms_activity()
{
laydsms = app.CreateLayout( "Linear", "Vertical,fillxy" );
laydsms.SetBackColor( "gray" );
// ТЕСТОВЫЙ КОД
tmp_data.notelength = 1.5
tmp_data.prefix = ":2"
tmp_data.buf = ""
scl = app.CreateTabs( "Synth,Roll,Options",1,0.9);
laydsms.AddChild( scl );

options_layout = scl.GetLayout("Options");
synth_layout = scl.GetLayout("Synth");
roll_layout = scl.GetLayout("Roll")
synth_layout_hoz = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz );
synth_layout_hoz1 = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz1 );
synth_layout_hoz2 = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz2 );
synth_layout_hoz3 = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz3 );
synth_layout_hoz4 = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz4 );
synth_layout_hoz5 = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz5 );
syn = app.CreateSynth( );
sd_text = app.CreateText( "" );
options_layout.AddChild(sd_text);
s_delay = app.CreateSeekBar( 1 );
s_delay.SetOnChange( Dsmsdelay_change );
options_layout.AddChild(s_delay)
sd_text.SetText( "Note length: "+ tmp_data.notelength );
syn.SetVca( 10, 400, 0.8, 100 );
syn.SetVcf( 10, 400, 0.8, 100, 1000, 0.85, 2.0 );
s_delay.SetRange( 5 );
s_delay.SetValue( tmp_data.notelength );
AddButtonDsms(synth_layout_hoz,0)
for(i=0; i<6; i++) {
AddButtonDsms(synth_layout_hoz,i+40)
}
for(i=7; i<14; i++) {
AddButtonDsms(synth_layout_hoz1,i+40)
}
for(i=14; i<21; i++) {
AddButtonDsms(synth_layout_hoz2,i+40)
}
for(i=21; i<28; i++) {
AddButtonDsms(synth_layout_hoz3,i+40)
}
for(i=28; i<35; i++) {
AddButtonDsms(synth_layout_hoz4,i+40)
}
for(i=35; i<42; i++) {
AddButtonDsms(synth_layout_hoz5,i+40)
}

syn.SetNoteLength( tmp_data.notelength )
roll_text = app.CreateTextEdit( "" );
roll_layout.AddChild(roll_text)
roll_enter = app.CreateButton( "Play" );
roll_enter.SetOnTouch( Dsmsplay_roll );
roll_layout.AddChild(roll_enter);

wavfrm_spn = app.CreateSpinner( "Saw,Square,Sine" );
wavfrm_spn.SetOnChange( DsmsSetWF );
options_layout.AddChild(wavfrm_spn)
vcasus_txt = app.CreateText( "Vca Sustain" );
options_layout.AddChild(vcasus_txt)
vcasus_scr = app.CreateSeekBar( 1 );
vcasus_scr.SetOnChange( Dsmschange_vcasus );
vcasus_scr.SetRange( 1 );
options_layout.AddChild(vcasus_scr)

vcadec_txt = app.CreateText( "Vca Decay" );
options_layout.AddChild(vcadec_txt)
vcadec_scr = app.CreateSeekBar( 1 );
vcadec_scr.SetOnChange( Dsmschange_vcadec );
vcadec_scr.SetRange( 1 );
options_layout.AddChild(vcadec_scr)

buffer = app.CreateText( "", null, null, "Multiline" );
synth_layout.AddChild(buffer)

clear_btn = app.CreateButton( "Clear" );
clear_btn.SetOnTouch( function() {
tmp_data.buf=""
buffer.SetText( "" );
} );
synth_layout.AddChild( clear_btn );

sendtr_btn = app.CreateButton( "Send to roll" );
sendtr_btn.SetOnTouch( function() {
roll_text.SetText( tmp_data.buf );
} );
synth_layout.AddChild( sendtr_btn );

function Dsmschange_vcasus(e)
{
syn.SetVcaSustain(e)
	vcasus_txt.SetText( "Vca Sustain: "+e );
}

function Dsmschange_vcadec(e)
{
syn.SetVcaDecay(e)
	vcadec_txt.SetText( "Vca Decay: : "+e );
}

function Dsmsdelay_change(e)
{
tmp_data.notelength = e
	syn.SetNoteLength( tmp_data.notelength );
sd_text.SetText( "Note length: " + tmp_data.notelength );
}

function AddButtonDsms(lay, name)
{
	btn = app.CreateButton( name, 0.13, 0.08, "Alum" );
	btn.SetOnTouch( Dsmsbtns_OnTouch );
	lay.AddChild( btn );
}

function Dsmsbtns_OnTouch()
{
btn = this
btn_txt = btn.GetText();
	syn.PlayMidiTune( btn_txt+tmp_data.prefix )
tmp_data.buf+=btn_txt+tmp_data.prefix+","
buffer.SetText( tmp_data.buf );
}

function Dsmsplay_roll()
{
	sht = roll_text.GetText();
syn.PlayMidiTune( sht )
}

function DsmsSetWF(e)
{
	syn.SetWaveShape(e)
}
// КОНЕЦ
addclosebtn(laydsms)
app.AddLayout( laydsms );
}

function get_tmp_data()
{
	return JSON.stringify(tmp_data)
}
/*
function market_activity() {
appdownloader = app.CreateDownloader(  );
	laymarket = app.CreateLayout( "linear", "Vertical,FillXY" );	
laymarket.SetBackColor( "gray" );
	marketweb = app.CreateWebView( 1,0.9,"");
mkreq = new XMLHttpRequest();
mkreq.open('GET', 'http://c91451dc.beget.tech/rammer_store', false);
mkreq.send()
marketweb.LoadHtml( mkreq.responseText );
addclosebtn(laymarket)
	laymarket.AddChild( marketweb );
	app.AddLayout( laymarket );
}
*/

function livevideoapp()
{
if( typeof(lvskblive) != "undefined" ){
clearInterval( lvskblive )
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
},100)
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

settingslist = app.CreateList( settingslistmenu,1 ,null, "FontAwesome" );
settingslist.SetOnTouch( function(choice) {
if(choice.match("Дебаг >")=="Дебаг >") {
if(debug==true){
 debug=false 
app.SaveBoolean( "debug",false ) 
}else{
 debug=true
app.SaveBoolean( "debug",true )
}
}

if(choice.match("Другой звук запуска >")=="Другой звук запуска >") {
if(soundonboot[0]==true){
soundonboot[0]=false 
app.SaveBoolean( "sob",false ) 
}else{
 soundonboot[0]=true
app.SaveBoolean( "sob",true )
}
}
settingslistmenu = ["Дебаг > "+(debug==true?"Вкл.":"Выкл"),"Другой звук запуска > "+(soundonboot[0]==true?"Вкл.":"Выкл")]
settingslist.SetList( settingslistmenu );

});
laysettings.AddChild( settingslist );

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

function instpkg(src)
{
if(src!="") {
	app.UnzipFile( src,"/sdcard/Rammer/Apps/" );
rammer_message("Установлено");
}else{
return "Укажите файл";
}
}

function setmainscreen(lay)
{
	mainscr = lay;
}

function closeapp()
{
if(typeof(mainscr)!="undefined") {
	app.RemoveLayout( mainscr );
}
}

function syssig(arg) {
if(arg=="RSHUTDOWN") {
shutdown()
}else if(arg=="RCLOSEAPP") {
closeapp()
}else if(arg=="RREBOOT") {
shutdown() 
version, codename, buildnumber, funnyphrase, isbeta, background_default = null
background, phonenumber, defaulturl, debug, daysofweek = null
folder_exists, tmp_data, app_data, notification = null 
repeat_music, sh_rad, sh_dy, melodies, xcm, bootanimationtime = null
fullscreen, mpslast, soundonboot, settingslistmenu = null
init_vars() 
OnStart()
}
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
term_txte_1.SetText( "" );
term_txte.SetText(term_txte.GetText()+"> "+cmd+"\n");
if( app.FileExists( "/sdcard/Rammer/Sys/Cmd/"+cmd+".js" ) ) {
eval("/sdcard/Rammer/Sys/Cmd/"+cmd+".js");
}else{
try{
this.result = eval(cmd);
term_txte.SetText(term_txte.GetText()+this.result+"\n");
}catch(e) {
term_txte.SetText(term_txte.GetText()+"shell: unknown function or other error"+e+"\n");
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