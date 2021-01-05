class RammerApp {
   constructor(params) {
   if(params!="") {
       this.lay = app.CreateLayout("Linear", params);
   }else{
       this.lay = app.CreateLayout("Linear", "Vertical,fillxy");
   }
   this.ifadded = false
   this.lay.SetBackColor("gray")
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
this.h = this.w / (app.GetDisplayHeight()/app.GetDisplayWidth())
this.closebtn = app.CreateButton( "[fa-close]",this.w,this.h,"FontAwesome" );
this.closebtn.SetOnTouch(function() {
laytoadd.close()
})
}
}