// JavaScript source code
function loadTOC() {
	var headings = $("h2, h3");
	// Loop through each heading element and generate a TOC entry with a corresponding link
	var tocHtml = "<ul>";
	headings.each(function (index) {
		var current = $(this);
		var tagName = current.prop("tagName").toLowerCase();
		var title = current.text();
		var anchorName = "tocheading" + index;

		current.attr("id", anchorName);

		if (tagName == "h2" || tagName == "h3") {
			tocHtml += "<li class='toc-" + tagName + "'>" +
				"<a href='#" + anchorName + "'>" + title + "</a>" +
				"</li>";
		}
	});

	tocHtml += "</ul>";

	// Insert the generated TOC into the Table of Contents div
	$(".table-of-contents").html(tocHtml);
}