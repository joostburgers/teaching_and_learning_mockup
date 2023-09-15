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
			populateFilter(data, "modality", "Formats");
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



/**
 * Populate filter element with options based on provided data.
 * 
 * @param {object[]} data - The data to generate options from.
 * @param {string} key - The object property to generate filter options for.
 * @param {string} label - The label to display on the filter.
 * @returns {jQuery} - The filter element with options added.
 */
function populateFilter(data, key, label) {
  var filters = $(`#${key}-filters`);
  filters.empty();
 
  
  var values = [];
  $.each(data, function(index, object) {
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
  
  // Create an "all" checkbox element and append it to the filter.
  var allCheckbox = $(`<div class='form-check'><input class='form-check-input all-${key}' type='checkbox' value='all' checked><label class='form-check-label align-middle'>All ${label}</label></div>`);
  filters.append(allCheckbox);
  
  // If values exist, create a checkbox element for each unique value and append it to the filter.
  if (typeof values === 'object' && Array.isArray(values) && values.length > 0) {
    if (typeof values[0] === 'object') {
      values = values.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.title === value.title
        ))
      );
      
      values.sort((a, b) => a.title.localeCompare(b.title));
      
		$.each(values, function (index, value) {
			
		  var checkbox = $(`<div class='form-check'><input class=' form-check-input single-${key} ' type='checkbox' value='${value.title}' ><label class='form-check-label align-middle'><span class="${value.type}">${value.title}</span> (${value.year})</label></div>`);


		  filters.append(checkbox);
      });
    } else {
      values = values.flat();
      values = Array.from(new Set(values));
      values = values.sort();
      
      $.each(values, function(index, value) {
        var checkbox = $(`<div class='form-check'><input class='form-check-input single-${key}' type='checkbox' value='${value}' ><label class='form-check-label align-middle'>${value}</label></div>`);
        filters.append(checkbox);
      });
    }
  } else {
    console.log("values is not an array");
  }
  
  return filters;
}


/**
 * Attaches change event listeners to checkboxes to change their state based on user interaction.
 * 
 * @param {string} key - The identifier used to select the checkboxes to attach listeners to.
 * The user can 
 */
function defineCheckboxes(key) {
	// Cache the jQuery selectors for the all and single checkboxes and the container.
	var allCheckboxes = $(`.all-${key}`);
	var singleCheckboxes = $(`.single-${key}`);
	var checkboxesContainer = $(`#${key}-filters`);

	// Attach event listeners to the container using event delegation.
	checkboxesContainer.on('click', '.all-' + key, function () {
		// When the all checkboxes are clicked, uncheck all the single checkboxes and update the indeterminate state of the all checkbox.
		var isChecked = $(this).prop('checked');
		singleCheckboxes.prop('checked', false);
		if (!isChecked) {
			allCheckboxes.prop('indeterminate', false);
		}
	});

	checkboxesContainer.on('click', '.single-' + key, function () {
		// When a single checkbox is clicked, update the indeterminate state and checked state of the all checkbox based on the state of the individual checkboxes.
		var totalBoxes = singleCheckboxes.length;
		var isAllChecked = singleCheckboxes.filter(':checked').length;

		allCheckboxes.prop('indeterminate', isAllChecked > 0 && isAllChecked < totalBoxes);

		if (isAllChecked === totalBoxes) {
			allCheckboxes.prop('indeterminate', false);
			allCheckboxes.prop('checked', true);
			
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
	
		selectedModalities.push($(this).val());
	
	});

	$("#paired_author-filters input[type='checkbox']:checked").each(function () {

		selectedAuthors.push($(this).val());

	});


	// Filter cards based on selected filters
	var filteredCards = [];

	$.each(cards, function (index, card) {
		var selected = false;
				
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

		const imageHTML = `<img src="images/${((card.image.card == "") ? 'background2.png' : card.image.card)}" class="card-img-top">`

		const titleHTML = `<h5 class="card-title">${card.title}</h5>`

		const storyHTML = `<p class="card-text"><span class="font-weight-bold">${((card.story.length > 1) ? 'Stories: ' : 'Story: ')}</span> ${storyTitle} </p>`

		const descriptionHTML = `<p class="card-text"><span class="font-weight-bold">Description: </span>${card.description}</p>`

		const modalityHTML = `<p class="card-text"><span class="font-weight-bold">Modality: </span>${modalityText}</p>`

		const paired_authorHTML = card.paired_author !== null ? `<p class= "card-text"><span class="font-weight-bold">Paired author:</span> ${card.paired_author} </p>` : ''

		var cardHtml = $(`<a href="pages/${card.filename}"> <div class="card"> <div class="info"> ${imageHTML}${titleHTML}
		 </div>
		 <div class="card-body"> ${storyHTML} ${modalityHTML} ${paired_authorHTML}${descriptionHTML}  </div > </div > </a > </div >`)



		/*var cardHtml = $("<div class='col'><a href='pages/" + card.url + "'><div class='card'><div class = 'info'><img src=images/" + ((card.image == "") ? 'background2.png' : card.image) + " class='card-img-top'><h5 class='card-title'>" + card.title + "</h5></div><div class='card-body'><p class='card-text'>" + ((card.story.length > 1) ? 'Stories: ' : 'Story: ') + card.story + "</p><p class='card-text'>Description: " + card.description + "</p><p class='card-text'>Modality: " + card.modality + "</p><p class='card-text'>" + ((card.paired_author !== null) ? 'Paired author: ' + card.paired_author : '') + "</p></div ></div ></a ></div > ");*/
		cardContainer.append(cardHtml);
	});
}
