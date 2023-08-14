// JavaScript source code
//Source code loads the cards from index.html and displays them on the page



//function to load the cards from the json file


function getCards() {

	$.ajax({
		url: 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/cardData.json',
		dataType: 'json',
		async: false,
		success: function (data) {

			
			
			populateFilter(data, "paired_author", "Authors")
			populateFilter(data, "story", "Stories");
			populateFilter(data, "modality", "Modalities");
			defineCheckboxes("story")
			defineCheckboxes("modality")
			defineCheckboxes("paired_author")
			$("#story-filters input[type='checkbox']").on('change', function () {
				filterCards(data);
			})

			/*$("#story-filters input[type='checkbox']").on('change', function () {
				console.log($(this))
				if ($(this).val() !== "all") {
					if ($(this).is(':checked')) {
						$("#story-filters input[value='all']").prop('indeterminate', true);
					}
					else {
						var count = $("#story-filters input[type='checkbox']:checked").length;
						if (count === 0) {
							$(this).prop('checked', true);
						}
						else {
							$("#story-filters input[value='all']").prop('indeterminate', true);
						}
					}
				}
				else {
					if ($(this).is(':checked')) {
						$("#story-filters input[type='checkbox']").prop('checked', false);
						$("#story-filters input[value='all']").prop('checked', true);
						$("#story-filters input[type='checkbox']").prop('indeterminate', false);
					}
					else {
						$("#story-filters input[value='all']").prop('checked', false);
						$("#story-filters input[type='checkbox']").prop('indeterminate', true);
					}
				}

				filterCards(data);
			});



			*//*$('#story-filters input[value="all"]').prop('checked', true).change();*//*
			$("#modality-filters input[type='checkbox']").on('change', function () {

				if ($(this).val() !== "all") {
					if ($(this).is(':checked')) {
						$("#modality-filters input[value='all']").prop('indeterminate', true);
					}
					else {
						var count = $("#modality-filters input[type='checkbox']:checked").length;
						if (count === 0) {
							$(this).prop('checked', true);
						}
						else {
							$("#modality-filters input[value='all']").prop('indeterminate', true);
						}
					}
				}
				else {
					if ($(this).is(':checked')) {
						$("#modality-filters input[type='checkbox']").prop('checked', false);
						$("#modality-filters input[value='all']").prop('checked', true);
						$("#modality-filters input[type='checkbox']").prop('indeterminate', false);
					}
					else {
						$("#modality-filters input[value='all']").prop('checked', false);
						$("#modality-filters input[type='checkbox']").prop('indeterminate', true);
					}
				}




				filterCards(data);
			});


			$("#paired_author-filters input").on('change', function () {

			if ($(this).val() !== "all") {
				if ($(this).is(':checked')) {
					$("#paired_author-filters input[value='all']").prop('indeterminate', true);
				}
				else {
					var count = $("#paired_author-filters input[type='checkbox']:checked").length;
					if (count === 0) {
						$(this).prop('checked', true);
					}
					else {
						$("#paired_author-filters input[value='all']").prop('indeterminate', true);
					}
				}
			}
			else {
				if ($(this).is(':checked')) {
					$("#paired_author-filters input[type='checkbox']").prop('checked', false);
					$("#paired_author-filters input[value='all']").prop('checked', true);
					$("#paired_author-filters input[type='checkbox']").prop('indeterminate', false);
				}
				else {
					$("#paired_author-filters input[value='all']").prop('checked', false);
					$("#paired_author-filters input[type='checkbox']").prop('indeterminate', true);
				}
			}




			 filterCards(data); });*/


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
	

	var values = [];
	$.each(data, function (index, object) {
		if (values.indexOf(object[key]) === -1 && object[key] !== null) {
			
			if (object[key] != "All") {
				values.push(object[key]);
			}
		}
		//if there are modalities in the object then loop over them and add them to the stories array
	});

	
	values = values.flat()
	values = Array.from(new Set(values))
	values = values.sort()


	

	var filters = $(`#${key}-filters`);
	filters.empty();

	var allCheckbox = $(`<div class='form-check'><input class='form-check-input all-${key}' type='checkbox' value='all' checked><label class='form-check-label'>All ${label}</label></div>`);
	filters.append(allCheckbox);

	$.each(values, function (index, value) {
		
		var checkbox = $(`<div class='form-check'><input class='form-check-input single-${key}' type='checkbox' value='${value}' ><label class='form-check-label'>${value}</label></div>`)
	filters.append(checkbox);
	})


	return filters
}


	function defineCheckboxes(key) {


	$(`.all-${key}`).change(function () {
		if (this.checked) {
			$(`.single-${key}`).each(function () {
				this.checked = false;

			})

		} else {
			$(`.single-${key}`).each(function () {
				this.checked = false;

			})
		}
	});

	$(`.single-${key}`).click(function () {
		if ($(this).is(":checked")) {


			var isAllChecked = 1;

			$(`.single-${key}`).each(function () {
				if (!this.checked)
					isAllChecked = 0;
			})

			if (isAllChecked == 1) {
				$(`.all-${key}`).prop("checked", true);
			} else {
				$(`.all-${key}`).prop("indeterminate", true);
			}
		} else {
			$(`.all-${key}`).prop("checked", false);
		}
	});
	}




// Function to filter and display the information cards based on selected filters
function filterCards(data) {
	var cards = data;
	var selectedStories = [];
	var selectedModalities = [];
	var selectedAuthors = [];

	// Get selected story filters
	$("#story-filters input[type='checkbox']:checked").each(function () {
		
			selectedStories.push($(this).val());
			

	});

	$("#modality-filters input[type='checkbox']:checked").each(function () {
		console.log("clicked value:" +$(this).val())
		
		/*if ($(this).val() !== "all") {*/
			selectedModalities.push($(this).val());
		/*}*/
	});

	$("#paired_author-filters input[type='checkbox']:checked").each(function () {
				
			selectedAuthors.push($(this).val());
		
	});

	console.log("Story Selection: " + selectedStories + "Modality Selection: " + selectedModalities + "Author Selection: " + selectedAuthors)
	
	/*if (selectedStories.length > 1 && selectedStories.includes("all")) {
	$("#story-filters input[value='all']").prop('checked', false);  
	}*/


	// Filter cards based on selected filters
	var filteredCards = [];

	$.each(cards, function (index, card) {
		var selected = false;
		
			card.story.forEach(function (story) {
				selectedStories.forEach(function (selectedStory) {
					if (story.includes(selectedStory) || selectedStory === "all" || story ==="All") {
						selected = true;
					}
				});
			});

		var Modalityselected = false;
		selectedModalities.forEach(function (selectedModality) {
			console.log(selectedModality)

			if (card.modality.includes(selectedModality) || selectedModality === "all") {

				Modalityselected = true;
			}
		});

		var Authorselected = false;
		selectedAuthors.forEach(function (selectedAuthor) {
			if (card.paired_author.includes(selectedAuthor) || selectedAuthor === "all") {
				Authorselected = true;
			}
		})

		

		if (
			(selected) && (Modalityselected) && (Authorselected)
		) {
			filteredCards.push(card);
		}
	});

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


