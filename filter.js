/**
* This is the content script that loads into the Twitter tab.
* The TimelineFilter object handles requesting our filters from the extension and applying them to Tweets.
*/
function TimelineFilter(filters) {
    var _regexes = new Array();
    var _promos = false;
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
                _hideTweet(tweet);
            }
        }
    }

    /**
    * Hide a tweet if it matches a filtered username
    */
    var _filterUser = function(user) {}

    /**
    * Hide a tweet if it's a promotion
    */
    var _filterPromoted = function(tweet) {
        if(tweet.hasClass('promoted-tweet')) {
            _hideTweet(tweet);
            return true;
        }
        return false;
    }

    /**
    * Hide a tweet and attach a handler to show the original text
    */
    var _hideTweet = function(tweet) {
        var text  = tweet.find('.js-tweet-text').html();
        var media = tweet.find('.AdaptiveMedia').html();

        //put the original tweet text in a data attribute
        tweet.data('original-text', text);
        tweet.data('original-media', media);

        //edit tweet text
        tweet.find('.js-tweet-text').html('<span class="expand-action-wrapper">Tweet filtered. Click to view the original.</span>');
        tweet.find('.AdaptiveMedia').html('');

        //add a click handler to the hidden tweet
        tweet.click(function(event) {
            var originalTweet = $(this).data('original-text');
            var originalMedia = $(this).data('original-media');
            $(this).find('.js-tweet-text').html(originalTweet);
            $(this).find('.AdaptiveMedia').html(originalMedia);
            $(this).unbind(event);
        });
    }

    /**
    * Step through each tweet and run the filters against it
    */
    var _runFilters = function(tweet) {
        var hidden = false;

        //check if promoted
        if(_promos) { hidden = _filterPromoted(tweet); }

        //check users

        //check content
        if(!hidden) {
            _filterText(tweet);
        }
    }

    /**
    * Configure filters and build regexes
    */
    var _buildFilters = function(filters) {
        //un-stringify our filters into an array and build them
        var unpackedFilters = JSON.parse(filters);
        for(var i = 0; i < unpackedFilters.length; i++) {
            var filter = JSON.parse(unpackedFilters[i]);
            //build filters by type
            switch(filter.type) {
                case 'content':
                    _regexes.push(new RegExp(filter.value, 'i'));
                    break;
                case 'user':
                    break;
                case 'promo':
                    _promos = (filter.value === 'yes');
                    break;
                default:
                    console.log('Timeline Filter type not found: ' + filter.type);
            }
        }
    }

    /**
    * Bind to any changes to the timeline and run each tweet through our filter method
    */
    var _init = function(filters) {
        _buildFilters(filters);

        //when tweets are added to the timeline, check 'em
        $('.stream-container').bind('DOMNodeInserted', function(event) {
            if($(event.target).hasClass('js-stream-item')){
                _runFilters($(event.target).find('.tweet'));
            }
        });

        //check any tweets currently showing on the timeline
        $('.tweet').each(function(){
            _runFilters($(this));
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
