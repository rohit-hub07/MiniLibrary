const apiUrl = "https://api.freeapi.app/api/v1/public/books";
let currentPage = 1;
const itemsPerPage = 10;
// let isLastPage = false;
let totalPages = 1;
let items = [];
let view = false;

// Fetch paginated data from the API
async function fetchData(page) {
  try {
    const response = await fetch(`${apiUrl}?page=${page}`);
    const result = await response.json();

    // Determine the actual data array based on API structure.

    items = result.data.data;
    totalPages = result.data.totalPages;
    // Check if the current page is the last page.
    // isLastPage = items.length < itemsPerPage;
    updateButtons();
    document.getElementById("parentDiv").innerHTML = "";
    renderData(items);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Render the items in the UI
function renderData(books) {
  const contentDiv = document.getElementById("parentDiv");
  contentDiv.innerHTML = "";

  books.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.className = "bookCards";
    const { title, authors, publisher, publishedDate, imageLinks } =
      book.volumeInfo;
    // console.log({ title, authors, publisher, publishedDate })
    const thumbnail = imageLinks?.thumbnail;
    console.log(thumbnail);
    bookDiv.innerHTML = `
      
          <div>
                <img src="${thumbnail}"></img>
                <h3>${title}</h3>
                <p><span>Written by:</span> ${
                  authors ? authors.join(", ") : "Unknown"
                }</p>
                <p><span>Publisher:</span> ${publisher || "Unknown"}</p>
                <p><span>Date:</span> ${publishedDate || "N/A"}</p>
                
            </div>
          `;
    contentDiv.appendChild(bookDiv);
  });
}

// Enable or disable buttons based on current page and data
function updateButtons() {
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

// Update the page and fetch new data
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchData(currentPage);
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchData(currentPage);
  }
});

//sort
document.getElementById("sortByAZ").addEventListener("click", () => {
  items.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
  renderData(items);
});

document.getElementById("sortByDate").addEventListener("click", () => {
  items.sort(
    (a, b) =>
      new Date(a.volumeInfo.publishedDate) -
      new Date(b.volumeInfo.publishedDate)
  );
  renderData(items);
});

//search bar
document.getElementById("searchBar").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  console.log(items);
  const filteredBooks = items.filter((book) =>
    book.volumeInfo.title.toLowerCase().includes(query)
  );

  renderData(filteredBooks);
});

// Initial load
fetchData(currentPage);
