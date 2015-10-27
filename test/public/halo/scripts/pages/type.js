
function init() {

    // Responsive Table

	// Declare headings
	var theHeads = $('.vert-collapse thead th');
	var allHeadersSaved = [];

	// Get content of all table headers, add to array
	theHeads.each(function() {
		var headerContent = $(this).text();
		allHeadersSaved.push(headerContent);
	});

	//should get th or td
	var tableData = $('.vert-collapse tbody tr > *');

	//counter
	var n = 0;

	// Check create fake head for each table cell
	// Once counter reachers number of headers used, it starts over
	tableData.each(function(){
		$(this).prepend('<span class="fake-head">'+allHeadersSaved[n]+'</span>');
		if (n < (allHeadersSaved.length - 1)){
			n++
		}
		else {n=0;}
	});

}


APP.pages.typography = {
    init: init
};
