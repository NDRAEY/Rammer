'use strict';
class RammerApp {
   constructor(params) {
   if(typeof(params)!="undefined") {
       this.lay = app.CreateLayout("Linear", params);
   }else{
       this.lay = app.CreateLayout("Linear", "Vertical,fillxy");
   }
   this.ifadded = false
   this.lay.SetBackColor("gray");
	 this.lay.SetSize(1,0.96)
	 }
   show() {
      if(this.ifadded == false) {
         app.AddLayout(this.lay);
         this.ifadded = true
      }
   }
   close() {
      if(this.ifadded == true) {
         app.RemoveLayout(this.lay);
         this.ifadded = false
      }
   }
   AddChild(c) {
       this.lay.AddChild(c)
   }
   RemoveChild(c) {
       this.lay.RemoveChild(c)
   }
}

class RammerCloseButton {
constructor(laytoadd) {
this.w = 0.1
this.lta = laytoadd
this.h = this.w / (app.GetDisplayHeight()/app.GetDisplayWidth())
this.closebtn = app.CreateButton( "[fa-close]",this.w,this.h,"FontAwesome" );
this.closebtn.SetOnTouch(function() {
laytoadd.close()
})
}
show() {
	this.lta.AddChild(this.closebtn)
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