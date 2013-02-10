/**
* This is the content script that loads into the Twitter tab.
* The TimelineFilter object handles requesting our filters from the extension and applying them to Tweets.
*/
function TimelineFilter(filters) {
	var _regexes = new Array();
	var _this = this;
	
	/**
	* Check a tweet and hide it if it matches a regex filter
	*/
	var _filterText = function(tweet) {
		//for each regex
		for(var i = 0; i < _regexes.length; i++) {
			var tweetText = tweet.find('.js-tweet-text').html();
			//if the regex matches the tweet text
			if(_regexes[i].test(tweetText)) {
				//put the original tweet text in a data attribute
				tweet.data('original-text', tweetText)
				tweet.find('.js-tweet-text').html('<span class="expand-action-wrapper">Tweet filtered. Click to view the original.</span>');
				
				//add a click handler to the hidden tweet
				tweet.click(function(event){
					var originalTweet = $(this).data('original-text');
					$(this).find('.js-tweet-text').html(originalTweet);
					$(this).unbind(event);
				});
			}
		}
	}
	
	/**
	* Bind to any changes to the timeline and run each tweet through our filter method
	*/
	var _init = function(filters) {
		//Un-stringify our filters into an array and build them
		var unpackedFilters = JSON.parse(filters);
		for(var i = 0; i < unpackedFilters.length; i++) {
			_regexes.push(new RegExp(unpackedFilters[i], 'gi'));
		}
		console.log(_regexes);
	
		//When tweets are added to the timeline, check 'em
		$('.stream-container').bind('DOMNodeInserted', function(event) {
			if($(event.target).hasClass('js-stream-item')){
				_filterText($(event.target).find('.tweet'));
			}
		});
		
		//Check any tweets currently showing on the timeline
		$('.tweet').each(function(){
			_filterText($(this));
		});
	}
	
	_init(filters);
};

/**
* Once the document is loaded, request our filters and make a new TimelineFilter object.
*/
$(document).ready(function(){
	chrome.extension.sendMessage({action: "get_filters"}, function(response) {
		var filter = new TimelineFilter(response.msg);
	});
});
