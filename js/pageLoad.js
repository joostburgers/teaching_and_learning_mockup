
// This function creates a table of contents for the page by selecting all h2 and h3 tags, assigning them an ID based on their position, and generating an ordered list for each entry with a clickable link to their corresponding section in the page.


// assuming you already have the JQuery library imported
function loadTOC() {
	const headings = $("h2, h3");

	const tocHtml = [];
	headings.each((i, current) => {
	
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




function loadModal() {
	$('#imageSource').on('click', function () {
		var isZoomed = $(this).hasClass('zoomed-in');
		var modalContent = $(this).closest('.modal-content'); // Find the closest .modal-content ancestor
		var modalHeader = modalContent.find('.modal-header');
		var modalFooter = modalContent.find('.modal-footer');
		var modalBody = $(this).closest('.modal-body'); // Find the closest .modal-body ancestor

		if (isZoomed) {
			// Zooming out
			$(this).removeClass('zoomed-in');
			modalContent.removeClass('p-0'); // Add padding back to modal-content
			modalBody.removeClass('p-0'); // Add padding back to modal-body
			modalHeader.show(); // Show the modal header
			modalFooter.show(); // Show the modal footer
			$(this).css({
				'max-width': '', // Remove max-width
				'max-height': '' // Remove max-height
			});
		} else {
			// Zooming in
			$(this).addClass('zoomed-in');
			modalContent.addClass('p-0'); // Remove padding from modal-content
			modalBody.addClass('p-0'); // Remove padding from modal-body
			modalHeader.hide(); // Hide the modal header to provide more space
			modalFooter.hide(); // Hide the modal footer to provide more space
			var viewportWidth = $(window).width();
			var viewportHeight = $(window).height();
			$(this).css({
				'max-width': viewportWidth * 0.9 + 'px', // 90% of viewport width
				'max-height': viewportHeight * 0.9 + 'px' // 90% of viewport height
			});
		}
	});

	// Ensure the modal resets to its original state when closed
	$('#imageModal').on('hidden.bs.modal', function () {
		var imageSource = $('#imageSource');
		imageSource.removeClass('zoomed-in').css({
			'max-width': '',
			'max-height': ''
		});
		var modalContent = $(this).find('.modal-content');
		modalContent.removeClass('p-0'); // Add padding back to modal-content
		$(this).find('.modal-body').removeClass('p-0'); // Add padding back to modal-body
		$(this).find('.modal-header').show(); // Show the modal header
		$(this).find('.modal-footer').show(); // Show the modal footer
	});
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
			
			// Get the image data object corresponding to the clicked image
			const tempImageData = getImageData(source, jsonData);
			
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

function loadCarouselImageData() {
	const carouselDataURL = 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/imageData.json';

	// Get the JSON data via AJAX request
	$.getJSON(carouselDataURL, function (jsonData) {
		console.log("Carousel image data loaded successfully");
		console.log(jsonData);

		// Function to load image data for the active carousel item
		const loadImageDataForActiveItem = () => {
			const source = $('#carouselExampleIndicators .carousel-item.active img').attr('src');
			console.log(source);
			const tempImageData = getImageData(source, jsonData);
			setCarouselImageData(source, tempImageData);
		};

		// Listen for the 'slid.bs.carousel' event which is fired after the carousel has completed its slide transition
		$('#carouselExampleIndicators').on('slid.bs.carousel', function () {
			loadImageDataForActiveItem();
		});

		// Also load image data when the modal is initially shown
		$('#imageCarouselModal').on('show.bs.modal', function () {
			loadImageDataForActiveItem();
		});
	})
		.fail(function () {
			console.warn("Carousel image data could not be loaded");
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
		});;

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
	console.log("current file",currentFilename)
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
	console.log("Image Data", imageData)
	return imageData;

}




// Wrap each case into a function loading necessary constants on each call.
function site_photograph(image) {
	//define html strings. This could probably be more efficient.
	const creatorsStringHTML = extractCreators(image) !== null && extractCreators(image) !== undefined ? `${extractCreators(image)}. ` : '';

	const imageTitleHTML = image.title !== null && image.title !== undefined ? `\u201c${fancyQuotesEmbedded(image.title)}.\u201D` : '';


	const imageYearHTML = image.year !== null && image.year !== undefined ? `${image.year}, ` : '';
	const imagePlaceHTML = image.place !== null && image.place !== undefined ? `${image.place}.` : '';

	const imageRepositoryCollectionHTML = image.repository.collection !== null && image.repository.collection !== undefined ? `${image.repository.collection}, ` : '';

	const imageRepositoryAccessionHTML = image.repository.accession !== null && image.repository.accession !== undefined ? `${image.repository.accession}. ` : '';

	const imageRepositoryNameHTML = image.repository.name !== null && image.repository.name !== undefined ? `${image.repository.name}, ` : '';

	const imageRepositoryPlaceHTML = image.repository.place !== null && image.repository.place !== undefined ? `${image.repository.place}. ` : '';

	const imageRepositoryURLHTML = image.repository.url !== null && image.repository.url !== undefined ? `URL: <a href="${image.repository.url}">${image.repository.url}</a>. ` : '';

	let citationTemplate =
		`${creatorsStringHTML}
    ${imageTitleHTML} ${imageYearHTML} ${imagePlaceHTML} 
    ${imageRepositoryCollectionHTML}
    ${imageRepositoryAccessionHTML}
    ${imageRepositoryNameHTML} ${imageRepositoryPlaceHTML} ${imageRepositoryURLHTML}`;

	return citationTemplate;
}

function external_image(image) {
	//define html strings. This could probably be more efficient.
	const creatorsStringHTML = extractCreators(image) !== null && extractCreators(image) !== undefined ? `${extractCreators(image)}. ` : '';

	const imageTitleHTML = image.title !== null && image.title !== undefined ? `\u201C${fancyQuotesEmbedded(image.title)}.\u201D` : '';
	const imageWebsiteTitleHTML = image.website.title !== null && image.website.title !== undefined ? `<em>${image.website.title}</em>` : '';

	const imageYearHTML = image.year !== null && image.year !== undefined ? `${image.year}, ` : '';

	const imageWebsiteURLHTML = image.website.url !== null && image.website.url !== undefined ? `<a href="${image.website.url}">${image.website.url}</a>.` : '';

	const imageAccessDateHTML = image.access_date !== null && image.access_date !== undefined ? `Accessed ${new Date(image.access_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.` : '';

	let citationTemplate =
		`${creatorsStringHTML}${imageTitleHTML} ${imageWebsiteTitleHTML} ${imageYearHTML} ${imageWebsiteURLHTML}
    ${imageAccessDateHTML}`;

	return citationTemplate;
}

function screen_capture(image) {
	//define html strings. This could probably be more efficient.
	const creatorsStringHTML = extractCreators(image) !== null && extractCreators(image) !== undefined ? `${extractCreators(image)}. ` : '';

	const imageTitleHTML = image.title !== null && image.title !== undefined ? `\u201C${fancyQuotesEmbedded(image.title)}.\u201D` : '';
	const imageYearHTML = image.year !== null && image.year !== undefined ? `${image.year}, ` : '';
	const imageRepositoryNameHTML = image.repository.name !== null && image.repository.name !== undefined ? `${image.repository.name}, ` : '';
	const imageRepositoryPlaceHTML = image.repository.place !== null && image.repository.place !== undefined ? `${image.repository.place}. ` : '';
	const imageRepositoryURLHTML = image.repository.url !== null && image.repository.url !== undefined ? `URL: <a href="${image.repository.url}">${image.repository.url}</a>. ` : '';

	let citationTemplate =
		`${creatorsStringHTML}${imageTitleHTML}
            ${imageYearHTML}${imageRepositoryNameHTML}${imageRepositoryPlaceHTML}${imageRepositoryURLHTML}`;

	return citationTemplate;
}

function archive(image) {
	//define html strings. This could probably be more efficient.
	const creatorsStringHTML = extractCreators(image) !== null && extractCreators(image) !== undefined ? `${extractCreators(image)}. ` : '';

	const imageTitleHTML = image.title !== null && image.title !== undefined ? `\u201C${fancyQuotesEmbedded(image.title)}.\u201D` : '';

	const imageRepositoryCollectionHTML = image.repository.collection !== null && image.repository.collection !== undefined ? `${image.repository.collection}, ` : '';

	const imageRepositoryAccessionHTML = image.repository.accession !== null && image.repository.accession !== undefined ? `${image.repository.accession}. ` : '';

	const imageRepositoryNameHTML = image.repository.name !== null && image.repository.name !== undefined ? `${image.repository.name}, ` : '';

	const imageRepositoryPlaceHTML = image.repository.place !== null && image.repository.place !== undefined ? `${image.repository.place}. ` : '';

	const imageRepositoryURLHTML = image.repository.url !== null && image.repository.url !== undefined ? `URL: <a href="${image.repository.url}">${image.repository.url}</a>. ` : '';

	let citationTemplate = `${creatorsStringHTML}${imageTitleHTML} ${imageRepositoryCollectionHTML} ${imageRepositoryAccessionHTML} ${imageRepositoryNameHTML} ${imageRepositoryPlaceHTML} ${imageRepositoryURLHTML}`

	return citationTemplate
}

function student_sample(image) {
	//define html strings. This could probably be more efficient.

	const descriptionHTML = image.description !== null && image.description !== undefined ? `<div class='carousel-image-description'>${fancyQuotes(image.description)}</div>` : '';

	const creatorsStringHTML = extractCreators(image) !== null && extractCreators(image) !== undefined ? `${extractCreators(image)}. ` : '';
	const imageTitleHTML = image.title !== null && image.title !== undefined ? `\u201C${fancyQuotesEmbedded(image.title)}.\u201D` : '';

	const imageCourseNameHTML = image.course.name !== null && image.course.name !== undefined ? `\u201c${image.course.name}.\u201D ` : '';
	const imageCourseNumberHTML = image.course.number !== null && image.course.number !== undefined ? `${image.course.number}: ` : '';
	const imageCourseInstructorHTML = image.course.instructor !== null && image.course.instructor !== undefined ? `Instructor: ${image.course.instructor}. ` : '';
	const imageCourseInstitutionHTML = image.course.institution !== null && image.course.institution !== undefined ? `${image.course.institution}, ` : '';

	const imageCoursePlaceHTML = image.course.place !== null && image.course.place !== undefined ? `${image.course.place}. ` : '';
	const imageCourseSemesterHTML = image.course.semester !== null && image.course.semester !== undefined ? `${image.course.semester}. ` : '';
	const imageCourseURLHTML = image.course.url !== null && image.course.url !== undefined ? `URL: <a href="${image.course.url}">${image.course.url}</a>. ` : '';

	let citationTemplate = `${descriptionHTML}${creatorsStringHTML}${ imageTitleHTML } ${ imageCourseNumberHTML } ${ imageCourseNameHTML } ${ imageCourseSemesterHTML }${ imageCourseInstitutionHTML }${ imageCoursePlaceHTML }${ imageCourseInstructorHTML }   ${ imageCourseURLHTML } `;

	return citationTemplate;
}

function wikimedia(image) {
	//define html strings. This could probably be more efficient.
	const creatorsStringHTML = extractCreators(image) !== null && extractCreators(image) !== undefined ? `${extractCreators(image)}. ` : '';

	const creatorPlaceHTML = image.creator_place !== null && image.creator_place !== undefined ? `${image.creator_place} from ` : '';

	const imageTitleHTML = image.title !== null && image.title !== undefined ? `\u201C${fancyQuotesEmbedded(image.title)}.\u201D` : '';

	

	const imageRepositoryLicenseHTML = image.repository.license !== null && image.repository.license !== undefined ? `<a href="${image.repository.license_url}">${image.repository.license}</a>. ` : '';

	const imageRepositoryNameHTML = image.repository.name !== null && image.repository.name !== undefined ? `via ${image.repository.name}` : '';
	
	const imageRepositoryURLHTML = image.repository.url !== null && image.repository.url !== undefined ? `URL: <a href="${image.repository.url}">${image.repository.url}</a>. ` : '';

	let citationTemplate = `${creatorsStringHTML}${CreatorPlaceHTML}
		${imageTitleHTML}
		${imageRepositoryLicenseHTML}
		${imageRepositoryNameHTML} ${imageRepositoryURLHTML}`

	return citationTemplate
}

function setImageData(source, image) {
	const imageTitle = $('#imageTitle');
	const imageSource = $('#imageSource');
	const imageCitation = $('#imageCitation');
	

	const citationTemplate = (() => {
		switch (image.media_type) {
			case 'site_photograph':
				return site_photograph(image);
			case 'external_image':
				return external_image(image);
			case 'screen_capture':
				return screen_capture(image);
			case 'archive':
				return archive(image);
			case 'student_sample':
				return student_sample(image);
			default:
				return "Image metadata not found.";
		}
	})();

	// Update the modal for a single image
	imageTitle.html(fancyQuotes(image.title));
	imageSource.attr('src', source);
	imageSource.attr('alt', image.alt_text);
	imageCitation.html(citationTemplate);
	
}


function setCarouselImageData(source, image) {
	const carouselImageTitle = $('#carouselImageTitle');
	const carouselImageCitation = $('#carouselImageCitation');

	const citationTemplate = (() => {
		switch (image.media_type) {
			case 'site_photograph':
				return site_photograph(image);
			case 'external_image':
				return external_image(image);
			case 'screen_capture':
				return screen_capture(image);
			case 'archive':
				return archive(image);
			case 'wikimedia':
				return wikimedia(image);
			case 'student_sample':
				return student_sample(image);
			default:
				return "Image metadata not found.";
		}
	})();

	// Update the carousel modal with the image title and citation
	console.log(image.title)
	let fancyTitle = fancyQuotes(image.title)

	carouselImageTitle.html(fancyTitle);
	carouselImageCitation.html(citationTemplate);
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
	const videoTitleHTML = video.title !== null ? `\u201C${video.title}.\u201D` : '';




	switch (video.media_type) {
		case 'quick_tutorial':
			citationTemplate =
				`${videoTitleHTML}." <em>${video.repository.name}</em>, ${video.repository.place}. 
              <a href="${video.url}">${video.url}</a>.`;
			break;
		case 'external_video':
			citationTemplate =
				`${creatorsString}. \u201C${video.title}.\u201D <em>${video.website_title}</em>, ${video.date}, <a href="${video.original_url}">${video.original_url}</a>. Accessed ${new Date(video.access_date).toLocaleDateString(
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
			const creatorsStringHTML = creatorsString !== null ? `by ${creatorsString}` : '';
			const figure = img.closest('.activity-image');
			const caption = figure.find('.activity-image-caption');
			const imageTitle = matchingImage.short_title !== undefined ? matchingImage.short_title:matchingImage.title ;


			caption.html(`\u201C${fancyQuotesEmbedded(imageTitle)}\u201D ${creatorsStringHTML}`);


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


			const fullVideoDuration = matchingVideo.full_demo_duration !== null && matchingVideo.full_demo_duration !== undefined ? ` [${matchingVideo.full_demo_duration}]` : ''

			const fullVideoHTML = matchingVideo.full_demo_url !== null && matchingVideo.full_demo_url !== undefined ? ` | Full Tutorial: <a href=${matchingVideo.full_demo_url} target="_blank" rel="noopener noreferrer">${matchingVideo.full_demo_title}</a> ${fullVideoDuration}` : ''


			// Set the video caption with matchingVideo metadata
			caption.innerHTML = `${matchingVideo.media_label}: <a href=${matchingVideo.url} target="_blank" rel="noopener noreferrer">${matchingVideo.tool}</a>${fullVideoHTML}`;

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
		
		const lessonData = getLessonData(jsonData);
		
		setLessonData(lessonData)
		setGlanceData(lessonData)
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
	
	const pilotClassroomHTML = data.pilot_classroom !== null ? `<p> Pilot classroom: ${data.pilot_classroom}</p>` : '';

	const learningGoalsHTML = data.learning_goals !== null ? `<p>Learning Goals: <ol class="activity-list">${createList(data.learning_goals)}</ol></p>` : '';



	/*const groupedCodes = createCommonCoreCodes(data.common_core);*/

	

	const commonCoreHTML = data.common_core !== null ? `<p>Common Core State Standards: <ul class="activity-list-unordered-2col">${createCommonCoreCodes(data.common_core)}</ul></p>` : '';

	const studentSamplesHTML = data.student_samples !== null ? `<p>Student samples: <ul class="activity-list-unordered-blank">${createSamples(data.student_samples, data.filename)}</ul></p>` : '';

	

	const originalLessonsHTML = data.original_lesson_plan !== null ? `<p>Original lesson plan: <ul class="activity-list-unordered-blank">${createSamples(data.original_lesson_plan, data.filename)}</ul></p>` : '';

	const notesHTML = data.notes !== null ? `<p>Notes: <ul class="activity-list-unordered"> ${createList(data.notes)}</ul></p>` : '';

	const contactHTML = data.contact !== null ? `<p>Contact: <a href = "mailto: ${data.contact}">${data.contact}</a></p>` : '';

	teachers.html(`${pilotClassroomHTML}${learningGoalsHTML} ${studentSamplesHTML}${commonCoreHTML}${originalLessonsHTML}${notesHTML}${contactHTML}`)


	
}

//function to group and sort the Common Core Codes in an easily readable order.
function createCommonCoreCodes(codes) {
	// Sort codes numerically and alphabetically
	const sortedCodes = codes.sort((a, b) => {
		let [prefixA, gradeA, numA] = a.split('.');
		let [prefixB, gradeB, numB] = b.split('.');
		gradeA = parseInt(gradeA.split('-')[0], 10);
		gradeB = parseInt(gradeB.split('-')[0], 10);
		numA = parseInt(numA, 10);
		numB = parseInt(numB, 10);

		if (prefixA !== prefixB) return prefixA.localeCompare(prefixB);
		if (gradeA !== gradeB) return gradeA - gradeB;
		return numA - numB;
	});

	// Group, format codes, and build the final formatted string
	const formattedString = sortedCodes.reduce((acc, code) => {
		const [prefix, gradeRange, number] = code.split('.');
		const key = `${prefix}.${gradeRange}`;
		if (!acc[key]) {
			acc[key] = `<li>${key}.${number}`;
		} else {
			acc[key] += `, ${number}`;
		}
		
		return acc;
	}, {});

	// Join all formatted groups with a newline for the final output
	return Object.values(formattedString).map(item=> `${item}</li>`).join('\n');
}


function setGlanceData(data) {

	
	const lessonGlance = $('#lessonGlance');

	var storyTitle = "";

	if (data.story[0] === "All") {
		storyTitle = "All"

	} else {

		data.story.forEach(function (storyObj) {
			let fancyTitle = fancyQuotes(storyObj.title)
			storyTitle += `<span class = ${storyObj.type}>${fancyTitle}</span>, `

		});
		storyTitle = storyTitle.slice(0, -2);
	}

	const storyHTML = `<span class="font-weight-bold">${((data.story.length > 1) ? 'Stories: ' : 'Story: ')}</span> ${storyTitle}`


	var modalityText = "";

	if (data.modality.length > 1) {
		
		data.modality.forEach(function (modality) {
			modalityText += modality + ", "
		})
		modalityText = modalityText.slice(0, -2);
	} else {
		modalityText = data.modality
	}


	const modalityHTML = `<span class="font-weight-bold">Modality: </span> ${modalityText}`
	//Each HTML stub is created if the value in the at the key is actually a value and not null. This prevents everyone having to fill out all the exact same metadata

	if (data.paired_author !== null) {
		data.paired_author.forEach(function (authorObj) {
			fancyTitle = fancyQuotes(authorObj.title)
			

			pairedAuthorText = `<span>${authorObj.author_first_name} ${authorObj.author_last_name} - </span ><span class = ${authorObj.type} id = ${authorObj.title}>${authorObj.title}</span><span> (${authorObj.year}) </span>`
		})
	}

	const paired_authorHTML = data.paired_author !== null ? `<span class= "font-weight-bold">Paired text: </span>${pairedAuthorText}` : ''

	const institutionHTML = (data.institution !== null && data.institution !== undefined) ? `<span>, ${data.institution}</span>` : '';

	const instructorHTML = data.instructor !== null ? `<h4>${data.instructor}${institutionHTML}</h4>` : '';


	const lastUpdatedDate = new Date(document.lastModified);

	const pageLastUpdate = ` | Updated: ${lastUpdatedDate.toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}`;


	const createdHTML = data.created !== null ? `Created: ${new Date(data.created).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}${pageLastUpdate}` : '';

	
	const bannerImageHTML = data.image.banner !== null ? `<img src="../images/${data.image.banner}" class="w-100" alt="Banner image for ${data.title}">` : '';

	const fancyBannerImageTitle = fancyQuotes(data.title)

	const bannerHTML = `<div class="glance-info">
				${bannerImageHTML}		
	<h1 class="glance-title glance-centered">${fancyBannerImageTitle}<div class="glance-subtitle">${instructorHTML}</div></h1>
			<div class="glance-bottom">
				
				<div class="right">${createdHTML} </div></div>
			</div>`

	const fancyDescription = fancyQuotes(data.description)

	const descriptionHTML = `<span class="font-weight-bold">Description: </span>${fancyDescription}`

	// const textsHTML = Load in texts through cardload functions
	const glanceTextHTML = `<div class=glance-text><div class="row"><div class="col"><p>${descriptionHTML}</p><p>${storyHTML}</p>
	</div>
	<div class = "col">
	<p>${modalityHTML}</p><p>${paired_authorHTML}</p></div >
	</div></div>`
	

	lessonGlance.html(`

	${bannerHTML}${glanceTextHTML}
	`)
}



function createList(array) {
	
	if (array && Array.isArray(array)) {
		
		const list = array.map(items => `<li>${items}</li>`).join('');

	
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

function fancyQuotes(text) {

	
	// Replace straight double quotes at the beginning of a word with left curly double quote
	text = text.replace(/"(\w)/g, '&ldquo;$1');

	// Replace straight double quotes at the end of a word with right curly double quote
	text = text.replace(/(\w)"/g, '$1&rdquo;');

	// Replace straight single quotes at the beginning of a word with left curly single quote
	text = text.replace(/(\s)'(\w)/g, '$1&lsquo;$2');

	// Replace straight single quotes in the middle of a word with right curly single quote
	text = text.replace(/(\S)'(\S)/g, '$1&rsquo;$2');


	// Replace straight single quotes at the end of a word with right curly single quote
	text = text.replace(/(.)'(\s)/g, '$1&rsquo;$2');;

	return text;
}


function fancyQuotesEmbedded (text){

	// Replace straight double quotes at the beginning of a word with left curly single quote
	text = text.replace(/"(\w)/g, '&lsquo;$1');

	// Replace straight double quotes at the end of a word with right curly single quote
	text = text.replace(/(\w)"/g, '$1&rsquo;');

	// Replace straight single quotes at the beginning of a word with left curly single quote
	text = text.replace(/(\s)'(\w)/g, '$1&lsquo;$2');

	// Replace straight single quotes in the middle of a word with right curly single quote
	text = text.replace(/(\S)'(\S)/g, '$1&rsquo;$2');


	// Replace straight single quotes at the end of a word with right curly single quote
	text = text.replace(/(.)'(\s)/g, '$1&rsquo;$2');;

	return text;
}