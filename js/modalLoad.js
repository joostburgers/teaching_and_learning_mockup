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

	});

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
			"description": "File metadata not found",
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
			citationTemplate = `${creatorsString}. "${image.image_title}."
            
			<b>${image.repository.collection},</b>
			${image.repository.accession},
			${image.repository.name},
			${image.repository.place},
			<a href="${image.repository.url}">${image.repository.url}</a>`;
			break;
		default:
			citationTemplate = "Image metadata not found."
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
		const imageSourceName = img.attr('src').split('/').pop()
		const matchingImage = jsonData.find(x => x.filename === imageSourceName);

		if (matchingImage) {
			const creatorsString = extractCreators(matchingImage);
			const figure = img.closest('.activity-image');
			const caption = figure.find('.activity-image-caption');
			caption.html(`"${matchingImage.image_title}" by ${creatorsString}`);


			setElementMetaData(img, matchingImage);


		} else {

			const figure = img.closest('.activity-image');
			const caption = figure.find('.activity-image-caption');
			console.log('No matching image found')
			caption.html(`${imageSourceName}`)
		}



	}
	)
};

function setElementMetaData(element, data) {

	//Loop through the data object
	for (const [key, value] of Object.entries(data)) {
		if (value === null) {
			continue;
		}

		// If the value is an object, it may contain nested properties 
		if (typeof (value) === 'object' && value !== null) {
			// If value is an array, loop through the nested objects' properties and set them as a comma-separated string
			if (Array.isArray(value)) {

				var allvalues = [];
				// loop through the array and get the values of the nested objects
				for (const [arrayIndex, arrayValue] of value.entries()) {
					objectvalues = '';
					for (const [nestedkey, nestedvalue] of Object.entries(arrayValue)) {

						if (nestedvalue !== null) {
							objectvalues += nestedvalue + ' '
						}
					}
				/** add object values to 
				 * @param {array} allvalues 
				 - array of all values. Generally, first name last name
				 **/

					allvalues.push(objectvalues.trim())
					const objectstring = allvalues.join(', ')
					element.attr(`data-${key}`, objectstring)
				}

			} else {
				//if not a nested object. Name the label the key and the nested key and the value the nested value
				for (const [nestedkey, nestedvalue] of Object.entries(value)) {
					if (nestedvalue !== null) {
						const nestedDataKey = `data-${key}-${nestedkey}`;
						element.attr(nestedDataKey, nestedvalue);
					}
				}
			}
		} else {
			const dataKey = `data-${key}`;
			element.attr(dataKey, value);
		}
	}
}



// Sets captions and metadata for all videos on the page.
// jsonData: an array containing objects with filenames and their corresponding metadata.
function setVideoCaptions(jsonData) {
	$('video').each(function () {
		const video = $(this);
		const videoSourceName = video.attr('src').split('/').pop();
		const matchingVideo = jsonData.find(x => x.filename === videoSourceName);

		if (matchingVideo) {
			// Get the creators string for the metadata
			const creatorsString = extractCreators(matchingVideo);

			//Find the closest ancestor element with .activity-video class for the frame
			const frame = video.closest('.activity-video');
			//Find the .activity-video-caption element for the caption
			const caption = frame.children('.activity-video-caption').get(0);

			// Set the video caption with matchingVideo metadata
			caption.innerHTML = `${matchingVideo.media_label}: <a href=${matchingVideo.url}  target="_blank" rel="noopener noreferrer">${matchingVideo.tool}</a>`;

			// Set each matchingVideo metadata to data-* attributes
			setElementMetaData(video, matchingVideo);

			/*video.attr({
				"data-title": matchingVideo.video_title,
				"data-creators": creatorsString,
				"data-description": matchingVideo.video_description,
				"data-date-created": matchingVideo.created,
				"data-duration": matchingVideo.duration,
				"data-file-size": matchingVideo.file_size
			});*/
		} else {
			// If there's no matching video metadata, just display the video source filename
			const frame = video.closest('.activity-video');
			const caption = frame.children('.activity-video-caption').get(0);
			console.log("File not found: ", videoSourceName);
			caption.innerHTML = `Video: ${videoSourceName}`;
		}
	});
}


function loadLessonData() {
	const lessonDataURL = 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/lessonData.json';
	$.getJSON(lessonDataURL, function (jsonData) {
		// Set up click event listeners for all image elements within an element with class ".activity-image"

		const lessonData = getLessonData(jsonData);
		console.log(lessonData)
		setLessonData(lessonData)

	})
}

function getLessonData(jsonData) {
	
	const currentFilename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
		return jsonData.find(object => object.filename === currentFilename)
}

function setLessonData(data) {

	const teachers = $('#TeacherInfo');
	const about = $('#AboutInfo');

	const learningGoals = createList(data.learning_goals)
	const commonCore = createList(data.common_core)
	const studentSamples = createSamples(data.student_samples)
		



	console.log(commonCore)

	teachers.html(`<p>Pilot classroom: ${data.pilot_classroom}</p><p>Learning Goals: <ul class="activity-list">${learningGoals}</ul></p><p>${studentSamples}</p>`)
	about.html(`<p>Instructor: ${data.instructor}</p>
	<p>Contact: <a href = "mailto: ${data.contact}">${data.contact}</p>
	<p>Date created: ${data.created}</p>
	<p>Notes: ${data.notes}</p>`)

}

function createList(array) {
	if (array && Array.isArray(array)) {
		const list = array.map(items => `<li>${items}</li>`).join('');
		return list;
	}
	return null

}

function createSamples(data) {
	const samples = data.map(item => {
		let file = `<a href = '${item.filename}'>${item.title}</a>`;
		let icon = `${item.file_type}`
		if (item.first_name && item.last_name) {
			file = `${item.first_name} ${item.last_name}: <a href = '${item.filename}'>${item.title}</a>`
		}
		
		return `<span><i class="bi bi-file-${icon}"></i> ${file}</span>`;

	
	})
	return samples
}