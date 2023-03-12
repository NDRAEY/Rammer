function Ads(width, height) {
	this.getter = new XMLHttpRequest();
	this.webview = app.CreateWebView();
	this.webview.SetSize(width, height);
	this.load=function() {
	this.webview.LoadUrl("http://c91451dc.beget.tech/rammer_ads");
	}
	this.load()
	return this.webview
}