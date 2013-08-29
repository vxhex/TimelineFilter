/**
* Draws our filter inputs and loads them with any filters found in local storage
*/
var redrawInputs = function() {
	//output an input box for each stored filter
	for(var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		var filter = JSON.parse(localStorage.getItem(key));
		var type = filter.type;
		var value = filter.value;
		if(type === 'content') {
			$('#filterContainer').append('<input type="text" placeholder="Regular Expression..." class="filter" value="'+value+'" />');
		}
		if(type === 'promo' && value === 'yes') {
			$('#promoted').attr('checked','checked');
		}
	}
	//always add one blank input for the user to add a filter
	$('#filterContainer').append('<input type="text" placeholder="Regular Expression..." class="filter" value="">');
};

/**
* Save all filters to localstorage and redraw inputs
*/
var saveFilters = function() {
	localStorage.clear();
	
	//save each content filter
	$('.filter').each(function(index){
		var filter = $(this).val();
		if(filter) {
			localStorage.setItem(
				index, 
				JSON.stringify({
					'type': 'content',
					'value': filter
				})
			);
		}
	});
	
	//save a promo filter if it's selected
	if($('#promoted').is(':checked')) {
		localStorage.setItem(
			'Promo Filter', 
			JSON.stringify({
				'type': 'promo',
				'value': 'yes'
			})
		);
	}
	
	//remove the filter inputs and redraw them
	$('.filter').remove();
	redrawInputs();
}

/**
* When the document is loaded, generate inputs and attach handlers
*/
$(document).ready(function(){
	redrawInputs();
	
	//clears storage and saves whatever we currently have
	$('#save').click(function(){
		saveFilters();
	});
});
