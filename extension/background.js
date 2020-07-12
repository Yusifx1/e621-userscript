
chrome.runtime.onMessage.addListener(
  function(arg) {
	 
	if (arg.active == false) {
		console.log(1)
	  if (chrome) {chrome.downloads.download({url: arg.url,filename: arg.filename})}
		else {
	browser.downloads.download({url: arg.url,filename: arg.filename})}
	
	}
if (arg.active ==true) {
	
if (chrome) {
	chrome.downloads.search({
		state: "complete",
		 exists: true,
    query: [arg.url]
   }, function (downloadItems) { console.log(downloadItems)
   if (downloadItems.length == 0) {
chrome.downloads.download({url: arg.url,filename: arg.filename})
}}
	)
} else {
	browser.downloads.search({
		state: "complete",
		 exists: true,
    query: [arg.url]
   }, function (downloadItems) { if (downloadItems.length == 0) {
		  browser.downloads.download({url: arg.url,filename: arg.filename})  }
})
}

} 
	

  }
) 
