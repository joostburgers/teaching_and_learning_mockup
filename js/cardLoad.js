// JavaScript source code
//Source code loads the cards from index.html and displays them on the page



//function to load the cards from the json file
function getCards() {
	$.getJSON('https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/cardData.json', function (data) {

		populateStoryFilters(data);
		populateAuthorFilters(data);
		filterCards(data);

	});
}


// Function to populate the story filters based on available stories in the cards
// loop over each card, to get multiple stories for each card and add them to the storyFilters.
function populateStoryFilters(data) {
	cards = data
	var stories = [];

	$.each(cards, function (index, card) {
		if (stories.indexOf(card.story) === -1) {
			stories.push(card.story);
		}
		//if there are multiple stories in the object then loop over them and add them to the stories array

	});
	console.log(stories);
	// turn stories into one array of stories
	stories = stories.flat();
	console.log(stories)
	var storyFilters = $("#story-filters");
	storyFilters.empty();


	$.each(stories, function (index, story) {
		var checkbox = $("<div class='form-check'><input class='form-check-input' type='checkbox' value='" + story + "'checked><label class='form-check-label'>" + story + "</label></div>");
		storyFilters.append(checkbox);
	});
}


function populateAuthorFilters(data) {
	cards = data
	var authors = [];

	$.each(cards, function (index, card) {
		if (authors.indexOf(card.paired_author) === -1 && card.paired_author !== null) {
			authors.push(card.paired_author);
		}
		//if there are multiple stories in the object then loop over them and add them to the stories array

	});

	// turn stories into one array of stories
	authors = authors.flat();
	console.log(authors)
	var authorFilters = $("#author-filters");
	authorFilters.empty();


	$.each(authors, function (index, author) {
		var checkbox = $("<div class='form-check'><input class='form-check-input' type='checkbox' value='" + author + "'checked><label class='form-check-label'>" + author + "</label></div>");
		authorFilters.append(checkbox);
	});
}



// Function to filter and display the information cards based on selected filters
function filterCards(data) {
	cards = data
	var selectedStories = [];
	var selectedModalities = [];
	var selectedAuthors = [];
	// Get selected story filters
	$("#story-filters input:checked").each(function () {
		selectedStories.push($(this).val());
	});

	// Get selected modality filters
	$("#modality-filters input:checked").each(function () {
		selectedModalities.push($(this).val());
	});

	$("#author-filters input:checked").each(function () {
		selectedAuthors.push($(this).val());
	});
	console.log("selected authors " + selectedAuthors)
	// Filter cards based on selected filters
	var filteredCards = [];

	$.each(cards, function (index, card) {
		console.log(card.story);
		var selected = false;
		$.each(card.story, function (index, story) {
			selectedStories.forEach(function (selectedStory) {
				if (story.includes(selectedStory)) {
					selected = true;
				}
			})
		});

		if (
			(selected || selectedStories.length === 0) &&
			(selectedModalities.length === 0 || selectedModalities.indexOf(card.modality) !== -1)
			&&
			(selectedAuthors.indexOf(card.paired_author) !== -1 || card.paired_author === null)
		) {
			filteredCards.push(card);
		}
	});

	console.log(filteredCards);

	// Display filtered cards
	var cardContainer = $("#card-container");
	cardContainer.empty();

	$.each(filteredCards, function (index, card) {
		var cardHtml = $("<div class='col'><a href='pages/" + card.url + "'><div class='card'><div class = 'info'><img src=images/" + ((card.image == "") ? 'background2.png' : card.image) + " class='card-img-top'><h5 class='card-title'>" + card.title + "</h5></div><div class='card-body'><p class='card-text'>" + ((card.story.length > 1) ? 'Stories: ' : 'Story: ') + card.story + "</p><p class='card-text'>Description: " + card.description + "</p><p class='card-text'>Modality: " + card.modality + "</p><p class='card-text'>" + ((card.paired_author !== null) ? 'Paired author: ' + card.paired_author : '') + "</p></div ></div ></a ></div > ");
		cardContainer.append(cardHtml);
	});
}

