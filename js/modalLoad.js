// JavaScript source code
var imageData = null; // global variable to store image metadata

var imageDataURL = 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/imageData.json'

function loadImageData() {
	$.ajax({

		url: imageDataURL,
		dataType: 'json',
		async: false,

		success: function (data) {

		}

	});

}

loadImageData();
///This is not running properly. Need to get JSON sync?


console.log(imageData)
$(".activity-image img").click(function () {
	var imageName = $(this).attr("src"); // get the image source
	var imageMetadata = null;

	imageData.forEach(function (obj) {
		if (obj.imageName === imageName) {
			// found matching image metadata
			imageMetadata = obj;
			return false; // exit loop early
		}
	});

	var modal = $("#imageModal");
	var modalImage = $("#modalImage");
	var imageCaption = $("#imageCaption");

	modalImage.attr("src", $(this).attr("src"));
	//captionText.text($(this).attr("alt"));

	if (imageMetadata !== null) {
		imageCaption.text("Description: " + imageMetadata.description + ", Author: " + imageMetadata.author + ", Image file name: " + imageMetadata.imageName);
	} else {
		metadataField.text("Metadata not found");
	}

	modal.show();
});

$(".close").click(function () {
	$("#myModal").hide();
});
