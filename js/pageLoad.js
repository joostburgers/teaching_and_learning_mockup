
// This function creates a table of contents for the page by selecting all h2 and h3 tags, assigning them an ID based on their position, and generating an ordered list for each entry with a clickable link to their corresponding section in the page.


// assuming you already have the JQuery library imported
function loadTOC() {
	const headings = $("h2, h3");

	const tocHtml = [];
	headings.each((i, current) => {
		console.log(current.tagName)
		const tagName = current.tagName.toLowerCase();
		const title = current.textContent;
		const anchorName = `tocheading${i}`;

		current.id = anchorName;

		if (tagName === "h2" || tagName === "h3") {
			tocHtml.push(`<li class='toc-${tagName}'><a href='#${anchorName}'>${title}</a></li>`);
		}
	});

	// assuming you already have an element in your HTML with id "toc-container"
	$("#TableOfContents").html(`<ul class="toc-list">${tocHtml.join("")}</ul>`);
}



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
	}).done(function () {
		console.log("Image data loaded successfully");
	})
		.fail(function () {
			console.warn("Image data could not be loaded");
		});;

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

	}).done(function () {
			console.log("Video data loaded successfully");
		})
		.fail(function () {
			console.warn("Video data could not be loaded");
		});		;

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

	console.log("source: " + source, "image: " +image )

	const creatorsStringHTML = creatorsString !== null ? `${creatorsString}. ` : '';

	const imageTitleHTML = image.title !== null ? `" ${image.title}."` : '';
	console.log(imageTitleHTML)
	const imageYearHTML = image.year !== null ? `${image.year}, ` : '';

	const imagePlaceHTML = image.place !== null ? `${image.place}.` : '';

	const imageRepositoryCollectionHTML = image.repository.collection !== null ? `${image.repository.collection}, ` : '';

	const imageRepositoryAccessionHTML = image.repository.accession !== null ? `${image.repository.accession}. ` : '';

	const imageRepositoryNameHTML = image.repository.name !== null ? `${image.repository.name}, ` : '';

	const imageRepositoryPlaceHTML = image.repository.place !== null ? `${image.repository.place}. ` : '';

	const imageRepositoryURLHTML = image.repository.url !== null ? `URL: <a href="${image.repository.url}">${image.repository.url}</a>. ` : '';

	
	let citationTemplate

	switch (image.media_type) {
		case 'site_photograph':
			citationTemplate =
				`${creatorsStringHTML}
           ${imageTitleHTML} ${imageYearHTML} ${imagePlaceHTML} 
		   ${imageRepositoryCollectionHTML}
		   ${imageRepositoryAccessionHTML}
		   ${imageRepositoryNameHTML} ${imageRepositoryPlaceHTML} ${imageRepositoryURLHTML}`
			break;
		case 'external_image':

			const imageWebsiteTitleHTML = image.website.title !== null && image.website.title !== undefined ? `<em>${image.website.title}</em>` : '';

			const imageWebsiteURLHTML = image.website.url !== null ? `<a href="${image.website.url}">${image.website.url}</a>.` : '';

			const imageAccessDateHTML = image.access_date !== null ? `Accessed ${new Date(image.access_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.` : '';

			citationTemplate =
				`${creatorsStringHTML}${imageTitleHTML} ${imageWebsiteTitleHTML} ${imageYearHTML} ${imageWebsiteURLHTML}
				${imageAccessDateHTML}`;
			break;
		case 'screen_capture':
			citationTemplate =
				`${creatorsStringHTML}${imageTitleHTML}
            ${imageYearHTML}${imageRepositoryNameHTML}${imageRepositoryPlaceHTML}${imageRepositoryURLHTML}`;
			break;

		case 'archive':
			citationTemplate = `${creatorsString}. "${image.title}."
            
			${image.repository.collection},
			${image.repository.accession},
			${image.repository.name},
			${image.repository.place},
			<a href="${image.repository.url}">${image.repository.url}</a>`;
			break;
		default:
			citationTemplate = "Image metadata not found."
			break;
	}

	imageTitle.html(image.title)
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
	const videoTitleHTML = video.title !== null ? `"${video.title}."` : '';




	switch (video.media_type) {
		case 'quick_tutorial':
			citationTemplate =
				`${videoTitleHTML}." <em>${video.repository.name}</em>, ${video.repository.place}. 
              <a href="${video.url}">${video.url}</a>.`;
			break;
		case 'external_video':
			citationTemplate =
				`${creatorsString}. "${video.title}." <em>${video.website_title}</em>, ${video.date}, <a href="${video.original_url}">${video.original_url}</a>. Accessed ${new Date(video.access_date).toLocaleDateString(
					'en-US',
					{ month: 'short', day: 'numeric', year: 'numeric' }
				)}.`;
			break;
		default:
			citationTemplate = 'Video not found'
			break;
	}

	videoTitle.html(video.title)
	videoSource.attr('src', currentVideoDirectory + video.source_filename)
	videoCitation.html(citationTemplate)
}

function extractCreators(object) {
	const creators = object.creators.map((creator, index) => {
		if (index === 0) {
			return `${creator.last_name ? creator.last_name + ', ' : ''}${creator.first_name || ''}`;
		}
		return `${creator.first_name || ''} ${creator.last_name || ''}`;
	})
	const creatorsString = creators.join(', ')
	if (!creatorsString.trim()) {
		return null;
	}
	return creatorsString
}

function setImageCaptions(jsonData) {

	$('.thumbnail-container img').each(function () {
		const img = $(this);
		const imageSourceName = img.attr('src').split('/').pop()
		const matchingImage = jsonData.find(x => x.filename === imageSourceName);

		if (matchingImage) {
			const creatorsString = extractCreators(matchingImage)
			const creatorsStringHTML= creatorsString	!== null ? `by ${creatorsString}` : '';
			const figure = img.closest('.activity-image');
			const caption = figure.find('.activity-image-caption');
			
			caption.html(`"${matchingImage.title}" ${creatorsStringHTML}`);


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
			caption.innerHTML = `${matchingVideo.media_label}: <a href=${matchingVideo.url} target="_blank" rel="noopener noreferrer">${matchingVideo.tool}</a>`;

			// Set each matchingVideo metadata to data-* attributes
			setElementMetaData(video, matchingVideo);

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
		console.log("getting lesson data")
		const lessonData = getLessonData(jsonData);
		console.log(lessonData)
		setLessonData(lessonData)
	})
		.done(function () {
			console.log("Lesson data loaded successfully");
		})
		.fail(function () {
			console.warn("Lesson data could not be loaded");
		});
}

//Gets lesson data of page based on page name. Page name should be faculty member plus number.
function getLessonData(jsonData) {

	const currentFilename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

	return jsonData.find(object => object.filename === currentFilename)
}

/** 
This fills in the lesson data based on the 
*@param {object} data - the lesson data object
If the values are null, they are not added to the HTML
**/
function setLessonData(data) {

	const teachers = $('#TeacherInfo');
	const about = $('#AboutInfo');

	//Each HTML stub is created if the value in the at the key is actually a value and not null. This prevents everyone having to fill out all the exact same metadata
	console.log(data)
	const pilotClassroomHTML = data.pilot_classroom !== null ? `<p> Pilot classroom: ${data.pilot_classroom}</p>` : '';

	const learningGoalsHTML = data.learning_goals !== null ? `<p>Learning Goals: <ul class="activity-list">${createList(data.learning_goals)}</ul></p>` : '';

	console.log(data.common_core)
	const commonCoreHTML = data.common_core !== null ? `<p>Common Core: <ul class="activity-list-unordered-blank">${createList(data.common_core)}</ul></p>` : '';

	const studentSamplesHTML = data.student_samples !== null ? `<p>Student samples: <ul class="activity-list-unordered-blank">${createSamples(data.student_samples, data.filename)}</ul></p>` : '';

	const originalLessonsHTML = data.original_lesson_plan !== null ? `<p>Original lesson plan: <ul class="activity-list-unordered-blank">${createSamples(data.original_lesson_plan, data.filename)}</ul></p>` : '';


	teachers.html(`${pilotClassroomHTML}${learningGoalsHTML} ${studentSamplesHTML}${commonCoreHTML}${originalLessonsHTML}`)


	const instructorHTML = data.instructor !== null ? `<p>Instructor: ${data.instructor}</p>` : '';

	const contactHTML = data.contact !== null ? `<p>Contact: <a href = "mailto: ${data.contact}">${data.contact}</a></p>` : '';

	console.log(data.created)
	const createdHTML = data.created !== null ? `<p>Date created: ${new Date(data.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>` : '';

	const notesHTML = data.notes !== null ? `<p>Notes: <ul class="activity-list-unordered"> ${createList(data.notes)}</ul></p>` : '';

	about.html(`${instructorHTML}${contactHTML}${createdHTML}${notesHTML}`)
}

function createList(array) {
	if (array && Array.isArray(array)) {
		const list = array.map(items => `<li>${items}</li>`).join('');

		console.log(list)
		return list;
	}
	return null
}

/**
 * Creates a list of file samples for display.
 *
 * @param {Array} data - The data array containing the file information.
 * @param {string} filename - The name of the file.
 *
 * @returns {string} - A string representing the list of file samples.
 */

function createSamples(data, filename) {
	const folder = filename.split(/\d/)[0];
	const filepath = `../supplementary_files/${folder}/`;

	const samples = data
		.filter(item => item.filename && item.file_type)
		.map(item => {
			const icon = item.file_type;
			const attribution = item.first_name && item.last_name ? `${item.first_name} ${item.last_name}: ` : '';
			const link = item.file_type === 'url' ? `<a href='${item.filename}' target="_blank" rel="noopener noreferrer">${item.title}</a>` : `<a href='${filepath}${item.filename}'>${item.title}</a>`;
			return `<li><i class="bi bi-file-${icon}"></i>${attribution}${link}</li>`;
		})
		.join('');

	return samples;
}

