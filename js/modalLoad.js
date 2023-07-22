function loadImageData() {
	const imageDataURL = 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/imageData.json';

	$.getJSON(imageDataURL, function (jsonData) {
		$('.activity-image img').click(function () {
			const source = $(this).attr('src');
			const tempImageData = getImageData(source, jsonData);
			setImageData(source, tempImageData);
			$("#imageModal").show();
		});
	});

	$(".close").click(function () {
		$("#imageModal").hide();
	});

	function getImageData(source, jsonData) {
		const currentFilename = source.substring(source.lastIndexOf('/') + 1);
		return jsonData.find(object => object.filename === currentFilename);
	}

	function setImageData(source, image) {
		const imageTitle = $('#imageTitle');
		const imageSource = $('#imageSource');
		const imageCitation = $('#imageCitation')

		const creators = image.creators.map((creator, index) => {
			if (index === 0) {
				return `${creator.last_name}, ${creator.first_name}`;
			}
			return `${creator.first_name} ${creator.last_name}`;
		});
		const creatorsString = creators.join(', ');

		let citationTemplate;

		switch (image.media_type) {
			case 'site_photograph':
				citationTemplate =
					`${creatorsString}.
          "${image.image_title}." ${image.year}, ${image.image_place}. ${image.repository_name}, ${image.repository_place}. URL: <a href="${image.repository_url}">${image.repository_url}</a>`;
				break;
			case 'external_image':
				citationTemplate =
					`${creatorsString}. "${image.image_title}." <em>${image.website_title}</em>, ${image.year}, <a href="${image.original_url}">${image.original_url}</a>. Accessed ${new Date(image.access_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`;
				break;
			case 'screen_capture':
				citationTemplate =
					`${creatorsString}. "${image.image_title}."
            ${image.year}.
          <em>${image.repository_name},</em> ${image.repository_place}, 
          <a href="${image.repository_url}">${image.repository_url}</a>`;
				break;
			default:
				// Default case if image type is not provided
				break;
		}

		imageTitle.html(image.alt_text);
		imageSource.attr('src', source);
		imageSource.attr('alt', image.alt_text);
		imageCitation.html(citationTemplate);

	}
}


function loadVideoData() {
	const videoDataURL = 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/videoData.json';

	$.getJSON(videoDataURL, function (jsonData) {
		console.log(jsonData)
		$('.activity-video img').click(function () {
			console.log("clicked")
			const source = $(this).attr('src');
			const tempVideoData = getVideoData(source, jsonData);
			setVideoData(source, tempVideoData);
			$("#videoModal").show();
		});
	});

	$(".close").click(function () {
		$("#videoModal").hide();
	});

	function getVideoData(source, jsonData) {
		const currentFilename = source.substring(source.lastIndexOf('/') + 1);
		return jsonData.find(object => object.preview_filename === currentFilename);
	}

	function setVideoData(source, video) {
		console.log(video)
		const currentVideoDirectory = "../video/"
		const videoTitle = $('#videoTitle');
		const videoSource = $('#videoSource');
		const videoCitation = $('#videoCitation')

		const creators = video.creators.map((creator, index) => {
			if (index === 0) {
				return `${creator.last_name}, ${creator.first_name}`;
			}
			return `${creator.first_name} ${creator.last_name}`;
		});
		const creatorsString = creators.join(', ');

		let citationTemplate = '';

		switch (video.media_type) {
			case 'quick_tutorial':
				citationTemplate =
					`"${video.video_title}." ${video.repository_name}, ${video.repository_place}. 
			href="${video.url}">${video.url}</a>.`;
				break;
			case 'external_video':
				citationTemplate =
					`${creatorsString}. "${video.video_title}." <em>${video.website_title}</em>, ${video.date}, <a href="${video.original_url}">${video.original_url}</a>. Accessed ${new Date(video.access_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`;
				break;
			default:
				citationTemplate = 'Video not found'
				break;
		}

		videoTitle.html(video.video_title);
		videoSource.attr('src', currentVideoDirectory + video.source_filename);
		videoCitation.html(citationTemplate);

	}
}
