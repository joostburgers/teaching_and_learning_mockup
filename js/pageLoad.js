
// This function creates a table of contents for the page by selecting all h2 and h3 tags, assigning them an ID based on their position, and generating an ordered list for each entry with a clickable link to their corresponding section in the page.


function loadTOC() {
    const headings = document.querySelectorAll("h2, h3");
    const tocHtml = [];
    for (let i = 0; i < headings.length; i++) {
        const current = headings[i];
        const tagName = current.tagName.toLowerCase();
        const title = current.textContent;
        const anchorName = `tocheading${i}`;

        current.id = anchorName;

        if (tagName === "h2" || tagName === "h3") {
            tocHtml.push(`<li class='toc-${tagName}'><a href='#${anchorName}'>${title}</a></li>`);
        }
    }

    const tocList = document.createElement("ul");
    tocList.innerHTML = tocHtml.join("");
    document.querySelector(".table-of-contents").appendChild(tocList);
}
