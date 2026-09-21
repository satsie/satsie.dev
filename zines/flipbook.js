// Code is from this tutorial: https://youtu.be/0kD6ff2J3BQ?si=fmXKLoFtKbld42lC
// https://github.com/codingstar-jason/3D-Book-Tutorial-Basic-CodingStar

// Refrences to DOM elements
const prevBtn = document.querySelector("#flipbook-prev-button");
const nextBtn = document.querySelector("#flipbook-next-button");
const book = document.querySelector("#flipbook");

// Build the pages. The flipbook is always 8 pages (4 papers, front and back)
// The images for each page are named flipbook_<some_topic>_1.png ... flipbook_<some_topic>_8.png
const NUM_PAGES = 8;
const pageImagePrefix = book.dataset.pageImagePrefix;

for (let i = 1; i <= NUM_PAGES / 2; i++) {
    const frontImage = `${pageImagePrefix}${2 * i - 1}.png`;
    const backImage = `${pageImagePrefix}${2 * i}.png`;

    book.insertAdjacentHTML("beforeend", `
        <!-- Paper ${i} -->
        <div id="p${i}" class="paper">
            <div class="front">
                <div id="f${i}" class="front-content">
                    <img class="pgimg" src="${frontImage}">
                </div>
            </div>
            <div class="back">
                <div id="b${i}" class="back-content">
                    <img class="pgimg" src="${backImage}">
                </div>
            </div>
        </div>
    `);
}



const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");
const paper3 = document.querySelector("#p3");
const paper4 = document.querySelector("#p4");


// Event Listeners
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

// Business Logic
let currentLocation = 1;
let numOfPapers = 4;
let maxLocation = numOfPapers + 1;

// Should only one page be shown at a time? Yes if this is a narrow screen (i.e. mobile)
// Keep this breakpoint in sync with flipbook.css
const singlePageQuery = window.matchMedia("(max-width: 599px)");
singlePageQuery.addEventListener("change", positionBook);

// Single page view only: are we looking at the right or left page?
let showingRightPage = false;

// Slide the book so the page(s) we want are centered on the screen
function positionBook() {
    let offset;

    if (currentLocation == 1) {
        // front cover
        offset = "0%";
    } else if (currentLocation == maxLocation) {
        // back cover
        offset = "100%"; 
    } else if (singlePageQuery.matches) {
        // device is too small and only one page can be shown at a time
        offset = showingRightPage ? "0%" : "100%";
    } else {
        // normal desktop - show both pages in spread
        offset = "50%";
    }

    book.style.transform = `translateX(${offset})`;
}

function goNextPage() {
    if (singlePageQuery.matches && currentLocation > 1 && currentLocation < maxLocation && !showingRightPage) {
        // left page of the spread is showing, so just slide over to the right page
        showingRightPage = true;
        positionBook();
        return;
    }

    if (currentLocation < maxLocation) {
        switch(currentLocation){
            case 1:
                paper1.classList.add("flipped");
                paper1.style.zIndex = 1;
                break;
            case 2:
                paper2.classList.add("flipped");
                paper2.style.zIndex = 2;
                break;
            case 3:
                paper3.classList.add("flipped");
                paper3.style.zIndex = 3;
                break;
            case 4:
                paper4.classList.add("flipped");
                paper4.style.zIndex = 4;
                break;
            default:
                throw new Error("Unknown page state");
        }
        currentLocation++;
        showingRightPage = false //a page flip always lands on the left page of the next spread
        positionBook();
    }
}

function goPrevPage() {
    if (singlePageQuery.matches && currentLocation > 1 && currentLocation < maxLocation && showingRightPage){
        // Right page of the spread is showing, so just slide back to the left page
        showingRightPage = false;
        positionBook();
        return;
    }

    if (currentLocation > 1) {
        switch(currentLocation) {
            case 2:
                paper1.classList.remove("flipped");
                paper1.style.zIndex = 4;
                break;
            case 3:
                paper2.classList.remove("flipped");
                paper2.style.zIndex = 3;
                break;
            case 4:
                paper3.classList.remove("flipped");
                paper3.style.zIndex = 2;
                break;
            case 5:
                paper4.classList.remove("flipped");
                paper4.style.zIndex = 1;
                break;
            default:
                throw new Error("Unknown page state");
        }
        currentLocation--;
        showingRightPage = true; // flipping back always lands on the right page of the previous spread
        positionBook();
    }
}