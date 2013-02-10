/**
* This script listens for the filter.js content script to ping. When we get a 'get_filters' message,
* we'll gather up all of our current filters, JSON them, and send them to our content script.
*/
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action === 'get_filters') {
			var filters = new Array();
			//Gather up the filters from local storage into an array
			for(var i = 0; i < localStorage.length; i++) {
				var key = localStorage.key(i);
				var filter = localStorage.getItem(key);
				filters.push(filter);
			}
			//Send our filters back as a JSON string
			sendResponse({msg: JSON.stringify(filters)});
		}
	}
);