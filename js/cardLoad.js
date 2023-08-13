// JavaScript source code
//Source code loads the cards from index.html and displays them on the page



//function to load the cards from the json file


function getCards() {

	$.ajax({
		url: 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/cardData.json',
		dataType: 'json',
		async: false,
		success: function (data) {

			/*populateStoryFilters(data);*/
			
			populateFilter(data, "paired_author", "Authors")
			/*populateFilter(data, "story", "Stories");
			populateFilter(data, "modality", "Modalities");*/

			$("#story-filters input").change(function () { filterCards(data); });

			$("#modality-filters input").change(function () { filterCards(data); });
			$("#author-filters input").change(function () { filterCards(data); });


		}
	}).done(function () {
		console.log("Card data loaded successfully");
	}).fail(function () {
		console.warn("Card data could not be loaded");
	});

}





// Function to populate the story filters based on available stories in the cards
// loop over each card, to get multiple stories for each card and add them to the storyFilters.



function populateFilter(data, key, label) {
	console.log(key)

	var values = [];
	$.each(data, function (index, object) {
		if (values.indexOf(object[key]) === -1 && object[key] !== null) {
			values.push(object[key]);
			
		}
		//if there are modalities in the object then loop over them and add them to the stories array
	});

	
	values = values.flat()
	values = Array.from(new Set(values))
	values = values.sort()

	

	var filters = $(`#${key}-filters`);
	filters.empty();

	var allCheckbox = $(`<div class='form-check'><input class='form-check-input' type='checkbox' value='all' checked><label class='form-check-label'>All ${label}</label></div>`);
	filters.append(allCheckbox);

	$.each(values, function (index, value) {
		var checkbox = $(`<div class='form-check'><input class='form-check-input' type='checkbox' value=${value}><label class='form-check-label'>${value}</label></div>`)
	filters.append(checkbox);
	})

	console.log(filters)
	return filters
}



// Function to filter and display the information cards based on selected filters
function filterCards(data) {
	
	cards = data
	var selectedStories = [];
	var selectedModalities = [];
	var selectedAuthors = [];
	// Get selected story filters
	$("#story-filters input:checked").each(function () {
		selectedStories.push($(this).val())
		console.log("selected stories array: " + selectedStories.push($(this).val()))			;
	});
	console.log("selected stories " + selectedStories)
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

	console.log("cards: " + cards)

	$.each(cards, function (index, card) {
		
		var selected = false;
		$.each(card.story, function (index, story) {
			selectedStories.forEach(function (selectedStory) {
				if (story.includes(selectedStory)) {
					selected = true;
				}
			})
		});

		var Modalityselected = false;

		$.each(card.modality, function (index, modality) {
			
			selectedModalities.forEach(function (selectedModality) {
				if (modality.includes(selectedModality)) {
					Modalityselected = true;
				}
			})
		});


		if (
			(selected || selectedStories.length === 0) &&
			(selectedModalities.length === 0 || Modalityselected)
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

/*function populateStoryFilters(data) {
	cards = data
	var stories = [];

	$.each(cards, function (index, card) {
		if (stories.indexOf(card.story) === -1) {
			stories.push(card.story);

		}
		//if there are multiple stories in the object then loop over them and add them to the stories array

	});

	// turn stories into one array of stories
	stories = stories.flat();
	stories = Array.from(new Set(stories))
	stories = stories.sort()


	var storyFilters = $("#story-filters");
	storyFilters.empty();

	var allCheckbox = $("<div class='form-check'><input class='form-check-input' type='checkbox' value='all' checked><label class='form-check-label'>All Stories</label></div>");
	storyFilters.append(allCheckbox);

	$.each(stories, function (index, story) {
		var checkbox = $(`<div class='form-check'><input class='form-check-input' type='checkbox' value=${story}><label class='form-check-label'>${story}</label></div>`
		);
		storyFilters.append(checkbox);
	});
}*/

/*function populateAuthorFilters(data) {
	cards = data
	var authors = [];

	$.each(cards, function (index, card) {
		if (authors.indexOf(card.paired_author) === -1 && card.paired_author !== null) {
			authors.push(card.paired_author);
		}
		//if there are modalities in the object then loop over them and add them to the stories array
	});

	// turn stories into one array of stories
	authors = authors.flat();
	authors = Array.from(new Set(authors))
	authors = authors.sort()
	
	var authorFilters = $("#author-filters");
	authorFilters.empty();

	var allAuthors = $("<div class='form-check'><input class='form-check-input' type='checkbox' value='all' checked><label class='form-check-label'>All Authors</label></div>");
	authorFilters.append(allAuthors);


	$.each(authors, function (index, author) {
		var checkbox = $(`<div class='form-check'><input class='form-check-input' type='checkbox' value=${author}><label class='form-check-label'>${author}</label></div>`
		);
		authorFilters.append(checkbox);
	});
}

function populateModalityFilters(data) {
	cards = data;
	var modalities = [];

	$.each(cards, function (index, card) {
		if (modalities.indexOf(card.modality) === -1 && card.modality !== null) {
			modalities.push(card.modality);
		}
		
	});

	modalities = modalities.flat();
	modalities = Array.from(new Set(modalities))
	modalities = modalities.sort()

	var modalityFilters = $("#modality-filters");
	modalityFilters.empty();

	var allModalities = $("<div class='form-check'><input class='form-check-input' type='checkbox' value='all' checked><label class='form-check-label'>All Modalities</label></div>");
	modalityFilters.append(allModalities);

	$.each(modalities, function (index, modality) {
		var checkbox = $("<div class='form-check'><input class='form-check-input' type='checkbox' value='" + modality + "><label class='form-check-label'>" + modality + "</label></div>");
		modalityFilters.append(checkbox);
	});

}*/


