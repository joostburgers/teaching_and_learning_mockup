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

			filterCards(data);
			$("#story-filters input[type='checkbox']").on('change', function () {
				filterCards(data);
			})
			$("#modality-filters input[type='checkbox']").on('change', function () {
				filterCards(data);
			})
			$("#paired_author-filters input[type='checkbox']").on('change', function () {
				filterCards(data);
			})

			
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
		
	});
		
	values = values.flat()
	values = Array.from(new Set(values))
	values = values.sort()
	
	var filters = $(`#${key}-filters`);
	filters.empty();

	var allCheckbox = $(`<div class='form-check'><input class='form-check-input all-${key}' type='checkbox' value='all' checked><label class='form-check-label align-middle'>All ${label}</label></div>`);
	filters.append(allCheckbox);

	$.each(values, function (index, value) {
		
		var checkbox = $(`<div class='form-check'><input class='form-check-input single-${key}' type='checkbox' value='${value}' ><label class='form-check-label align-middle'>${value}</label></div>`)
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
		

		if (selectedAuthors == "all") {
			Authorselected=true
		}


		if (card.paired_author !== null && selectedAuthors !== "all") {
			selectedAuthors.forEach(function (selectedAuthor) {
				if (card.paired_author.includes(selectedAuthor) || selectedAuthor === "all") {
					Authorselected = true;
				}
			})
		} 
		

		if (
			(selected) && (Modalityselected) && (Authorselected)
		) {
			filteredCards.push(card);
		}
	});


	filteredCards.sort(function (a, b) {
		var titleA = a.title.toLowerCase();
		var titleB = b.title.toLowerCase();
		if (titleA < titleB) {
			return -1;
		}
		if (titleA > titleB) {
			return 1;
		}
		return 0;
	});

	// Display filtered cards
	var cardContainer = $("#card-container");
	cardContainer.empty();




	$.each(filteredCards, function (index, card) {

		const imageHTML = `<img src="images/${((card.image == "") ? 'background2.png' : card.image)}" class="card-img-top">`

		const titleHTML = `<h5 class="card-title">${card.title}</h5>`

		const storyHTML = `<p class="card-text">${((card.story.length > 1) ? 'Stories: ' : 'Story: ') + card.story}</p>`

		const descriptionHTML = `<p class="card-text">Description: ${card.description}</p>`

		const modalityHTML = `<p class="card-text">Modality: ${card.modality}</p>`

		const paired_authorHTML = card.paired_author !== null ? `<p class= "card-text">Paired author: ${card.paired_author} </p>` : ''

		var cardHtml = $(`<a href="pages/${card.url}"> <div class="card"> <div class="info"> ${imageHTML}${titleHTML}
		 </div>
		 <div class="card-body"> ${storyHTML} ${modalityHTML} ${paired_authorHTML}${descriptionHTML}  </div > </div > </a > `)



		/*var cardHtml = $("<div class='col'><a href='pages/" + card.url + "'><div class='card'><div class = 'info'><img src=images/" + ((card.image == "") ? 'background2.png' : card.image) + " class='card-img-top'><h5 class='card-title'>" + card.title + "</h5></div><div class='card-body'><p class='card-text'>" + ((card.story.length > 1) ? 'Stories: ' : 'Story: ') + card.story + "</p><p class='card-text'>Description: " + card.description + "</p><p class='card-text'>Modality: " + card.modality + "</p><p class='card-text'>" + ((card.paired_author !== null) ? 'Paired author: ' + card.paired_author : '') + "</p></div ></div ></a ></div > ");*/
		cardContainer.append(cardHtml);
	});
}
