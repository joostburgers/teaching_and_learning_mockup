// JavaScript source code
//Source code loads the cards from index.html and displays them on the page



//function to load the cards from the json file


function getCards() {

	$.ajax({
		url: 'https://raw.githubusercontent.com/joostburgers/teaching_and_learning_mockup/master/data/lessonData.json',
		dataType: 'json',
		async: true,
		success: function (data) {



			populateFilter(data, "paired_author", "paired texts")
			populateFilter(data, "story", "stories");
			populateFiltersFromCommonCore(data, "common_core", "common core")

			//populateFilter(data, "modality", "Formats");
			defineCheckboxes("story")
			/*defineCheckboxes("modality")*/
			defineCheckboxes("paired_author")
			defineCommonCoreCheckboxes()


			filterCards(data);
			$("#story-filters input[type='checkbox']").on('change', function () {
				filterCards(data);
			})
			
			$("#paired_author-filters input[type='checkbox']").on('change', function () {
				filterCards(data);
			})

			$('.facet-outline').on('change', '#enableStateStandardsToggle', function () {
				if ($(this).is(':checked')) {
					// Toggle is on, show or recreate the Common Core State Standards filters.
					populateFiltersFromCommonCore(data, 'common_core', 'Common Core State Standards');
					defineCommonCoreCheckboxes();
					$("#common_core-categories-filters input[type='checkbox']").on('change', function () {
						filterCards(data);
					})
					$("#common_core-gradeLevels-filters input[type='checkbox']").on('change', function () {
						filterCards(data);
					})
					$("#common_core-standards-filters input[type='checkbox']").on('change', function () {
						filterCards(data);
					})



					// Ensure the sections are visible.
					$('.common_core_search').slideDown(200);

				} else {
					// Toggle is off, hide the sections.
					$('.common_core_search').slideUp(200);
				}
				filterCards(data)
			});

			




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
 * Populates filter checkboxes based on unique values or properties from the data.
 * 
 * @param {Array} data - The dataset from which to extract values.
 * @param {String} key - The key in the dataset objects to look for values.
 * @param {String} label - The label to use for the filter group.
 */
function populateFilter(data, key, label) {
	// Select the container where the filters will be appended.
	const filtersContainer = $(`#${key}-filters`);
	filtersContainer.empty(); // Clear any existing content.

	// Extract unique values from the data for the given key.
	const uniqueValues = extractUniqueValues(data, key);

	// Append an "All" checkbox to allow selecting/deselecting all options.
	appendAllCheckbox(filtersContainer, key, label);

	// For each unique value, append a checkbox to the container.
	uniqueValues.forEach(value => appendValueCheckbox(value, filtersContainer, key, label));
}

/**
 * Extracts unique values or properties from the data based on the specified key.
 * Handles arrays, objects, and primitive values.
 * 
 * @param {Array} data - The dataset to process.
 * @param {String} key - The key to extract values from within the dataset.
 * @returns {Array} - An array of unique values sorted alphabetically.
 */
function extractUniqueValues(data, key) {
	const unique = new Set();

	data.forEach(item => {
		if (item[key] && item[key] !== "All") {
			if (Array.isArray(item[key])) {
				// If the value is an array, add each element.
				item[key].forEach(value => addValue(unique, value));
			} else if (typeof item[key] === 'object') {
				// If the value is an object, add each property value.
				Object.values(item[key]).forEach(value => {
					if (Array.isArray(value)) {
						// If the property value is an array, add each element.
						value.forEach(innerValue => addValue(unique, innerValue));
					} else {
						// Add the property value.
						addValue(unique, value);
					}
				});
			} else {
				// For primitive values, add directly.
				addValue(unique, item[key]);
			}
		}
	});

	// Convert the set to an array, sort it, and return.
	return Array.from(unique).sort();
}

/**
 * Adds a value to the set if it's not null or "All".
 * Uses JSON.stringify to handle both objects and primitive values uniformly.
 * 
 * @param {Set} set - The set to add the value to.
 * @param {*} value - The value to add.
 */
function addValue(set, value) {
	if (value && value !== "All") {
		set.add(JSON.stringify(value));
	}
}

/**
 * Appends an "All" checkbox to the given container.
 * 
 * @param {jQuery} container - The container to append the checkbox to.
 * @param {String} key - The key associated with the filter.
 * @param {String} label - The label for the filter group.
 */
function appendAllCheckbox(container, key, label) {
	const allCheckboxHtml = `<div class='form-check'><input class='form-check-input all-${key}' type='checkbox' value='all' checked><label class='form-check-label align-middle'>All ${label}</label></div>`;
	container.append(allCheckboxHtml);
}

/**
 * Appends a checkbox for a given value to the container.
 * Handles both objects (with a title property) and primitive values.
 * 
 * @param {*} value - The value for which to create a checkbox. Can be an object or primitive.
 * @param {jQuery} container - The container to append the checkbox to.
 * @param {String} key - The key associated with the filter.
 * @param {String} label - The label for the filter group.
 */
function appendValueCheckbox(value, container, key, label) {
	value = JSON.parse(value); // Parse the value back into its original form.
	let checkboxHtml;
	if (typeof value === 'object' && value.title) {
		// If the value is an object with a title, construct a detailed checkbox HTML.
		const pairLabel = value.author_last_name ? `${value.author_first_name} ${value.author_last_name} - ` : "";
		checkboxHtml = `<div class='form-check'><input class='form-check-input single-${key}' type='checkbox' value='${value.title}'><label class='form-check-label align-middle'><span>${pairLabel}</span><span class="${value.type}">${value.title}</span><span> (${value.year})</label></div>`;
	} else {
		// For primitive values, construct a simple checkbox HTML.
		checkboxHtml = `<div class='form-check'><input class='form-check-input single-${key}' type='checkbox' value='${value}'><label class='form-check-label align-middle'>${value}</label></div>`;
	}
	container.append(checkboxHtml);
}

function populateFiltersFromCommonCore(data, key, label) {
	if (!$('#enableStateStandardsToggle').is(':checked')) {
		
		return;
	}

	const categories = new Set();
	const gradeLevels = new Set();
	const standards = new Set();

	data.forEach((card) => {
		if (card.common_core) {
			card.common_core.forEach((code) => {
				const parts = code.split('.');
				categories.add(parts[0]); // Add category
				const gradeLevelMatch = parts[1].match(/\d+-\d+/); // Extract grade level range
				if (gradeLevelMatch) {
					gradeLevels.add(gradeLevelMatch[0]);
				}
				standards.add(parts[parts.length - 1]); // Add standard
			});
		}
	});

	// Function to append checkboxes for a given set of values
	function appendCheckboxes(set, key, className, label) {
		// Sort the set based on className
		let sortedValues = Array.from(set);
		if (className === 'gradeLevels') {
			sortedValues.sort((a, b) => {
				const numA = parseInt(a.split('-')[0], 10);
				const numB = parseInt(b.split('-')[0], 10);
				return numA - numB;
			});
		} else {
			sortedValues.sort();
		}

		const containerSelector = `#${key}-${className}-filters`;
		const container = $(containerSelector);
		container.empty(); // Ensure the container is empty before appending new checkboxes

		// Append an "All" checkbox
		container.append(`<div class='form-check facet-subfilter-all'><input class='form-check-input all-${className}' type='checkbox' value='all' checked><label class='form-check-label align-middle'>All ${label}</label></div>`);
		// Append a checkbox for each unique value
		sortedValues.forEach((value) => {
			container.append(`<div class='form-check facet-subfilter-item'><input class='form-check-input single-${className}' type='checkbox' value='${value}'><label class='form-check-label align-middle'>${value}</label></div>`);
		});
	}

	// Append checkboxes for categories, grade levels, and standards
	appendCheckboxes(categories, key, 'categories', 'categories');
	appendCheckboxes(gradeLevels, key, 'gradeLevels', 'grade levels');
	appendCheckboxes(standards, key, 'standards', 'standards');
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
	checkboxesContainer.on('click', `.all-${key}`, function () {
		// When the all checkboxes are clicked, uncheck all the single checkboxes and update the indeterminate state of the all checkbox.
		var isChecked = $(this).prop('checked');
		singleCheckboxes.prop('checked', false);
		if (!isChecked) {
			allCheckboxes.prop('indeterminate', false);
		}
	});

	checkboxesContainer.on('click', `.single-${key}`, function () {
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


function defineCommonCoreCheckboxes() {
	const keys = ['categories', 'gradeLevels', 'standards'];

	keys.forEach((key) => {
		var allCheckbox = $(`.all-${key}`);
		var singleCheckboxes = $(`.single-${key}`);
		var checkboxesContainer = $(`#common_core-${key}-filters`);

		// Debugging: Log to ensure this function is called
		

		checkboxesContainer.on('click', `.all-${key}`, function () {
			// When the "All" checkbox is clicked, set all single checkboxes to the same state
			var isChecked = $(this).prop('checked');
			singleCheckboxes.prop('checked', isChecked);
			
			
		});

		checkboxesContainer.on('click', `.single-${key}`, function () {
			// Calculate the total and checked single checkboxes
			var totalBoxes = singleCheckboxes.length;
			var checkedBoxes = singleCheckboxes.filter(':checked').length;

			
			// Determine the state of the "All" checkbox based on the single checkboxes
			if (checkedBoxes === 0) {
				allCheckbox.prop('checked', true).prop('indeterminate', false);
			} else if (checkedBoxes < totalBoxes) {
				allCheckbox.prop('checked', false).prop('indeterminate', true);
			} else {
				allCheckbox.prop('checked', true).prop('indeterminate', false);
			}
		});
	});
}





// Function to filter and display the information cards based on selected filters
function filterCards(data) {

	var cards = data;
	var selectedStories = [];
	var selectedAuthors = [];
	let searchStrings = [];
	if ($('#enableStateStandardsToggle').is(':checked')) {
		searchStrings = constructCommonCoreSearchStrings(data);
	}
	console.log("searchStrings", searchStrings)
	function constructCommonCoreSearchStrings(data) {
		// Helper function to collect selected values from checkboxes
		const collectSelectedValues = (selector) => {
			return $(selector).filter(':checked').map(function () { return this.value; }).get();
		};

		// Collect selected values for each part of the Common Core standards
		const selectedCategories = collectSelectedValues('.single-categories');
		const selectedGradeLevels = collectSelectedValues('.single-gradeLevels');
		const selectedStandards = collectSelectedValues('.single-standards');

		// Initialize an empty set to store unique search strings
		let searchStrings = new Set();

		// Iterate over the data to find common_core codes that match the selected filters
		data.forEach(card => {
			if (card.common_core) {
				card.common_core.forEach(code => {
					const parts = code.split('.');
					const category = parts[0];
					const gradeLevel = parts[1];
					const standard = parts[parts.length - 1];

					// Check if the current code matches any of the selected filters
					if ((selectedCategories.length === 0 || selectedCategories.includes(category)) &&
						(selectedGradeLevels.length === 0 || selectedGradeLevels.includes(gradeLevel)) &&
						(selectedStandards.length === 0 || selectedStandards.includes(standard))) {
						// If it matches, add the code to the set of search strings
						searchStrings.add(code);
					}
				});
			}
		});

		// Convert the set to an array and return it
		return Array.from(searchStrings);
	}






	// Existing code to collect selectedStories and selectedAuthors...

	// Filter cards based on selected filters


	// Get selected story filters
	$("#story-filters input[type='checkbox']:checked").each(function () {
		selectedStories.push($(this).val());
	});

	$("#paired_author-filters input[type='checkbox']:checked").each(function () {
		selectedAuthors.push($(this).val());
	});

	

	// Filter cards based on selected filters
	var filteredCards = cards.filter(function (card) {
		var storyMatch = selectedStories.includes("all") || (card.story && card.story.some(storyObj => selectedStories.includes(storyObj.title)));
		var authorMatch = selectedAuthors.includes("all") || (card.paired_author && card.paired_author.some(paired_authorObj=>selectedAuthors.includes(paired_authorObj.title)));

		// If State Standards Toggle is checked, further filter by Common Core search strings
		var commonCoreMatch = !$('#enableStateStandardsToggle').is(':checked'); // Assume true if toggle is not checked
        if ($('#enableStateStandardsToggle').is(':checked') && searchStrings.length > 0) {
            // Check if any of the card's common_core codes are included in the searchStrings
            console.log("commonCoreMatch:", commonCoreMatch);
            console.log("searchStrings:", searchStrings);
            commonCoreMatch = card.common_core && card.common_core.some(code => {
                console.log("code:", code);
                return searchStrings.includes(code);
            });
        }
		return storyMatch && authorMatch && commonCoreMatch;
	});

	filteredCards.sort(function (a, b) {
		var titleA = a.title.toLowerCase().replace(/['"]+/g, '');
		var titleB = b.title.toLowerCase().replace(/['"]+/g, '');
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

		card.story.forEach(function (storyObj) {
			storyTitle += `<span class = ${storyObj.type}>${storyObj.title}</span >`
		});

		if (card.paired_author !== null) {
			card.paired_author.forEach(function (authorObj) {
				storyTitle += `<span> and </span><span class = ${authorObj.type} id = ${authorObj.title}>${authorObj.title}</span><span> by ${authorObj.author_first_name} ${authorObj.author_last_name}</span >`
			})
		}

		const urlHTML = card.url ? card.url : `pages/${card.filename}`;

		const imageHTML = `<img src="images/${((card.image.card == "") ? 'background2.png' : card.image.card)}" class="card-img-top">`

		const titleFancy = fancyQuotes(card.title);

		const titleHTML = `<h5 class="card-title">${titleFancy}</h5>`

		const storyHTML = `<p class="card-text"><span class="font-weight-bold">${((card.paired_author !== null) ? 'Texts: ' : 'Text: ')}</span> ${storyTitle} </p>`

		const descriptionFancy = fancyQuotes(card.description);
		const descriptionHTML = `<p class="card-text"><span class="font-weight-bold">Description: </span>${descriptionFancy}</p>`



		var cardHtml = $(`<a href="${urlHTML}"> <div class="card"> <div class="info"> ${imageHTML}${titleHTML}
		 </div>
		 <div class="card-body"> ${storyHTML} ${descriptionHTML}  </div > </div > </a > </div >`)




		cardContainer.append(cardHtml);
	});
}

//Helper functions



function fancyQuotes(text) {
	// Replace straight double quotes at the beginning of a word with left curly double quote
	text = text.replace(/"(\w)/g, '\u201C$1');

	// Replace straight double quotes at the end of a word with right curly double quote
	text = text.replace(/(\w)"/g, '$1\u201D');

	// Replace straight single quotes at the beginning of a word with left curly single quote
	text = text.replace(/(\s)'(\w)/g, '$1\u2018$2');

	// Replace straight single quotes in the middle of a word with right curly single quote
	text = text.replace(/(\S)'(\S)/g, '$1\u2019$2');


	// Replace straight single quotes at the end of a word with right curly single quote
	text = text.replace(/(.)'(\s)/g, '$1\u2019$2');;

	return text;
}


