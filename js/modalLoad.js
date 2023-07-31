// File: C:\Users\joost\source\repos\lesson_plans\js\modalLoad.js

/**
 * Loads image data from a JSON file and sets up click event listeners for image modals.
 */
function loadImageData() {
	const imageDataURL = 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/imageData.json';
	
	// Get the JSON data via AJAX request
	$.getJSON(imageDataURL, function (jsonData) {
		// Set up click event listeners for all image elements within an element with class ".activity-image"

		setImageCaptions(jsonData);


		$('.activity-image').on('click', 'img', function () {
			const source = $(this).attr('src');
			console.log(source)
			// Get the image data object corresponding to the clicked image
			const tempImageData = getImageData(source, jsonData);
			console.log(tempImageData)
			// Set the image modal data using the obtained data object and show the modal
			setImageData(source, tempImageData);
			$("#imageModal").show();
		});
	});

	// Closes the image modal on click of elements with class ".close"
	$(".close").click(function () {
		$("#imageModal").hide();
	});
}

/**
 * Loads videos data from a JSON file and sets up click event listeners for video modals.
 */
function loadVideoData() {
	const videoDataURL = 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/videoData.json';

	

	// Get the JSON data via AJAX request
	$.getJSON(videoDataURL, function (jsonData) {
		// Set up click event listeners for all image elements within an element with class ".activity-video"

		setVideoCaptions(jsonData);

		/*$('.activity-video').on('click', 'img', function () {
			const source = $(this).attr('src');

			// Get the video data object corresponding to the clicked image
			const tempVideoData = getVideoData(source, jsonData);

			// Set the video modal data using the obtained data object and show the modal
			setVideoData(tempVideoData);
			$('video')[0].load();
			$("#videoModal").show();
		});*/
	});

	// Closes the video modal on click of elements with class ".close"
	/*$(".close").click(function () {
		$("#videoModal").hide();
	});*/
}

/**
 * Returns the image data object from the provided JSON data array, corresponding to the provided image source URL.
 * @param {string} source The image source URL
 * @param {Array} jsonData The JSON data array to search through
 * @returns {Object} The image data object corresponding to the provided image source URL
 */
function getImageData(source, jsonData) {
	console.log(source)
	const currentFilename = source.substring(source.lastIndexOf('/') + 1);
	let imageData = null;
	try {
		imageData = jsonData.find(object => object.filename === currentFilename);
		if (!imageData) {
			throw new Error('Image metadata not found');
		}
	} catch (error) {
		console.error(`Error loading ${currentFilename}. ${error.message}`);
		imageData = {
			"creators": [{
				"first_name": "Error",
				"last_name": "Error"
			}],
			"media_type": "error",
			"description":"File metadata not found",
			"alt_text": "File not found",
			}
		}
	
	return imageData;
}

/**
 * Sets the image modal data based on the provided image data object, and updates the UI accordingly.
 * @param {string} source The image source URL
 * @param {Object} image The image data object to use
 */
function setImageData(source, image) {
	const imageTitle = $('#imageTitle')
	const imageSource = $('#imageSource')
	const imageCitation = $('#imageCitation')

	const creatorsString = extractCreators(image);

	

	let citationTemplate

	switch (image.media_type) {
		case 'site_photograph':
			citationTemplate =
				`${creatorsString}.
           "${image.image_title}." ${image.year}, ${image.image_place}. ${image.repository.name}, ${image.repository.place}. URL: <a href="${image.repository.url}">${image.repository.url}</a>`;
			break;
		case 'external_image':
			citationTemplate =
				`${creatorsString}. "${image.image_title}." <em>${image.website.title}</em>, ${image.year}, <a href="${image.website.url}">${image.website.url}</a>. Accessed ${new Date(image.access_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`;
			break;
		case 'screen_capture':
			citationTemplate =
				`${creatorsString}. "${image.image_title}."
            ${image.year}.
          <em>${image.repository.name},</em> ${image.repository.place}, 
          <a href="${image.repository.url}">${image.repository.url}</a>`;
			break;

		case 'archive':
			citationTemplate = `${ creatorsString }. "${image.image_title}."
            
			<b>${image.repository.collection},</b>
			${image.repository.accession},
			${image.repository.name },
			${image.repository.place },
			<a href="${image.repository.url}">${image.repository.url}</a>`;
			break;
		default:
			citationTemplate="Image metadata not found."
			break;
	}

	imageTitle.html(image.image_title)
	imageSource.attr('src', source)
	imageSource.attr('alt', image.alt_text)
	imageCitation.html(citationTemplate)
}

/**
 * Returns the video data object from the provided JSON data array, corresponding to the provided video source URL.
 * @param {string} source The video source URL
 * @param {Array} jsonData The JSON data array to search through
 * @returns {Object} The video data object corresponding to the provided video source URL
 */
function getVideoData(source, jsonData) {
	const currentFilename = source.substring(source.lastIndexOf('/') + 1)
	return jsonData.find(object => object.filename === currentFilename)
}

/**
 * Sets the video modal data based on the provided video data object, and updates the UI accordingly.
 * @param {Object} video The video data object to use
 */
function setVideoData(video) {
	const currentVideoDirectory = "../video/"
	const videoTitle = $('#videoTitle')
	const videoSource = $('#videoSource')
	const videoCitation = $('#videoCitation')

	const creatorsString = extractCreators(video);

	let citationTemplate = '';

	switch (video.media_type) {
		case 'quick_tutorial':
			citationTemplate =
				`"${video.video_title}." <em>${video.repository_name}</em>, ${video.repository_place}. 
              <a href="${video.url}">${video.url}</a>.`;
			break;
		case 'external_video':
			citationTemplate =
				`${creatorsString}. "${video.video_title}." <em>${video.website_title}</em>, ${video.date}, <a href="${video.original_url}">${video.original_url}</a>. Accessed ${new Date(video.access_date).toLocaleDateString(
					'en-US',
					{ month: 'short', day: 'numeric', year: 'numeric' }
				)}.`;
			break;
		default:
			citationTemplate = 'Video not found'
			break;
	}

	videoTitle.html(video.video_title)
	videoSource.attr('src', currentVideoDirectory + video.source_filename)
	videoCitation.html(citationTemplate)
}

function extractCreators(object) {
	const creators = object.creators.map((creator, index) => {
		if (index === 0) {
			return `${creator.last_name}, ${creator.first_name}`
		}
		return `${creator.first_name} ${creator.last_name}`
	})
	const creatorsString = creators.join(', ')
return creatorsString
}

function setImageCaptions(jsonData) {

	$('.thumbnail-container img').each(function () {
		const img = $(this);
		const matchingImage = jsonData.find(x => x.filename === img.attr('src').split('/').pop());
		
		if (matchingImage) {
			const creatorsString = extractCreators(matchingImage);
			const figure = img.closest('.activity-image');
			const caption = figure.find('.activity-image-caption');
			caption.html(`"${matchingImage.image_title}" by ${creatorsString}`);
		}
	});

}

function setVideoCaptions(jsonData) {


	console.log($('video').attr('src'))
	console.log($('video'))

	$('video').each(function () {
		const video = $(this);
		const videoSourceName = video.attr('src').split('/').pop();
		const matchingVideo = jsonData.find(x => x.filename === videoSourceName);
				
		if (matchingVideo) {
			const creatorsString = extractCreators(matchingVideo);
			const frame = video.closest('.activity-video');
			const caption = frame.find('.activity-video-caption');

			caption.html(`${matchingVideo.media_label}: <a href=${matchingVideo.url}  target="_blank" rel="noopener noreferrer">${matchingVideo.tool}</a>`);
			video.attr("data-title", matchingVideo.video_title)
			video.attr("data-description", matchingVideo.video_description)
			video.attr("data-authors", creatorsString)

			

		} else { 
			
			const frame = video.closest('.activity-video');
			const caption = frame.find('.activity-video-caption');
			console.log("File not found: ", videoSourceName)
			caption.html(`Video: ${videoSourceName}`);
		}
	});
}