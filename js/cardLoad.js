// JavaScript source code
//Source code loads the cards from index.html and displays them on the page



//function to load the cards from the json file


function getCards() {

	$.ajax({
		url: 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/lessonData.json',
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

	var filters = $(`#${key}-filters`);
	filters.empty();


	var values = [];
	$.each(data, function (index, object) {

		if (object[key] !== null) {
			if (values.indexOf(object[key]) === -1) {
				if (object[key] != "All") {
					if (Array.isArray(object[key])) {
						object[key].forEach(function (value) {
							if (values.indexOf(value) === -1 && value !== null && value !== "All") {
								values.push(value);
							}
						});
					} else if (typeof object[key] === 'object') {
						Object.values(object[key]).forEach(function (value) {
							if (Array.isArray(value)) {
								value.forEach(function (innerValue) {
									if (values.indexOf(innerValue) === -1 && innerValue !== null && innerValue !== "All") {
										values.push(innerValue);
									}
								});
							} else {
								if (values.indexOf(value) === -1 && value !== null && value !== "All") {
									values.push(value);
								}
							}
						});
					} else {
						values.push(object[key]);
					}
				}
			}
		}
	});



	var allCheckbox = $(`<div class='form-check'><input class='form-check-input all-${key}' type='checkbox' value='all' checked><label class='form-check-label align-middle'>All ${label}</label></div>`);

	filters.append(allCheckbox);



	if (typeof values === 'object' && Array.isArray(values) && values.length > 0) {
		if (typeof values[0] === 'object') {


			values = values.filter((value, index, self) =>
				index === self.findIndex((t) => (
					t.title === value.title
				))
			);

			values.sort((a, b) => a.title.localeCompare(b.title));
			$.each(values, function (index, value) {

				var checkbox = $(`<div class='form-check'><input class=' form-check-input single-${key} ' type='checkbox' value='${value.title}' ><label class='form-check-label align-middle'><span class="${value.type}">${value.title}</span> (${value.year})</label></div>`)
				filters.append(checkbox);
			});;
		} else {

			values = values.flat()
			values = Array.from(new Set(values))
			values = values.sort()
			$.each(values, function (index, value) {

				var checkbox = $(`<div class='form-check'><input class='form-check-input single-${key}' type='checkbox' value='${value}' ><label class='form-check-label align-middle'>${value}</label></div>`)
				filters.append(checkbox);
			});
		}
	} else {
		console.log("values is not an array");
	}







	/*$.each(values, function (index, value) {
		
		var checkbox = $(`<div class='form-check'><input class='form-check-input single-${key}' type='checkbox' value='${value}' ><label class='form-check-label align-middle'>${value}</label></div>`)
	filters.append(checkbox);
	})*/

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
		console.log("clicked value:" + $(this).val())

		/*if ($(this).val() !== "all") {*/
		selectedModalities.push($(this).val());
		/*}*/
	});

	$("#paired_author-filters input[type='checkbox']:checked").each(function () {

		selectedAuthors.push($(this).val());

	});



	/*if (selectedStories.length > 1 && selectedStories.includes("all")) {
	$("#story-filters input[value='all']").prop('checked', false);  
	}*/


	// Filter cards based on selected filters
	var filteredCards = [];

	$.each(cards, function (index, card) {
		var selected = false;

		console.log(card.story)

		if (card.story === "All") {
			selected = true;
		} else { card.story.forEach(function (storyObj) { Object.values(storyObj).forEach(function (title) { selectedStories.forEach(function (selectedStory) { if (title.includes(selectedStory) || selectedStory === "all" || title === "All") { selected = true; } }); }); }); }




		var Modalityselected = false;
		selectedModalities.forEach(function (selectedModality) {


			if (card.modality.includes(selectedModality) || selectedModality === "all") {

				Modalityselected = true;
			}
		});

		var Authorselected = false;


		if (selectedAuthors == "all") {
			Authorselected = true
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


		var storyTitle = "";

		if (card.story[0] === "All") {
			storyTitle = "All"

		} else {

			card.story.forEach(function (storyObj) {

				storyTitle += `<span class = ${storyObj.type}>${storyObj.title}</span>, `

			});
			storyTitle = storyTitle.slice(0, -2);
		}

		var modalityText = "";

		if (card.modality.length > 1) {
			console.log ("card.modality: " + card.modality)
			card.modality.forEach(function (modality) {
				modalityText += modality + ", "
				})
			modalityText = modalityText.slice(0, -2);
		} else {
			modalityText = card.modality
		}

		const imageHTML = `<img src="images/${((card.image == "") ? 'background2.png' : card.image)}" class="card-img-top">`

		const titleHTML = `<h5 class="card-title">${card.title}</h5>`

		const storyHTML = `<p class="card-text"><span class="font-weight-bold">${((card.story.length > 1) ? 'Stories: ' : 'Story: ')}</span> ${storyTitle} </p>`

		const descriptionHTML = `<p class="card-text"><span class="font-weight-bold">Description: </span>${card.description}</p>`

		const modalityHTML = `<p class="card-text"><span class="font-weight-bold">Modality: </span>${modalityText}</p>`

		const paired_authorHTML = card.paired_author !== null ? `<p class= "card-text"><span class="font-weight-bold">Paired author:</span> ${card.paired_author} </p>` : ''

		var cardHtml = $(`<a href="pages/${card.url}"> <div class="card"> <div class="info"> ${imageHTML}${titleHTML}
		 </div>
		 <div class="card-body"> ${storyHTML} ${modalityHTML} ${paired_authorHTML}${descriptionHTML}  </div > </div > </a > </div >`)



		/*var cardHtml = $("<div class='col'><a href='pages/" + card.url + "'><div class='card'><div class = 'info'><img src=images/" + ((card.image == "") ? 'background2.png' : card.image) + " class='card-img-top'><h5 class='card-title'>" + card.title + "</h5></div><div class='card-body'><p class='card-text'>" + ((card.story.length > 1) ? 'Stories: ' : 'Story: ') + card.story + "</p><p class='card-text'>Description: " + card.description + "</p><p class='card-text'>Modality: " + card.modality + "</p><p class='card-text'>" + ((card.paired_author !== null) ? 'Paired author: ' + card.paired_author : '') + "</p></div ></div ></a ></div > ");*/
		cardContainer.append(cardHtml);
	});
}
