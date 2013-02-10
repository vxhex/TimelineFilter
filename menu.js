/**
* Draws our filter inputs and loads them with any filters found in local storage
*/
var redrawInputs = function() {
	//Output an input box for each stored filter
	for(var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		var filter = localStorage.getItem(key);
		$('#filterContainer').append('<input type="text" placeholder="Regular Expression..." class="filter" value="'+filter+'" />');
	}
	//Always add one blank input for the user to add a filter
	$('#filterContainer').append('<input type="text" placeholder="Regular Expression..." class="filter" value="">');
};

/**
* When the document is loaded, generate inputs and attach handlers
*/
$(document).ready(function(){
	redrawInputs();
	//Save handler. Clears storage and saves whatever we currently have
	$('#save').click(function(){
		localStorage.clear();
		$('.filter').each(function(index){
			if($(this).val()) {
				localStorage.setItem(index, $(this).val());
			}
			$('.filter').remove();
			redrawInputs();
		});
	});
});
