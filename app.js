const apiUrl = "https://api.freeapi.app/api/v1/public/books";
let currentPage = 1;
const itemsPerPage = 10;
let totalPages = 1;
let items = []; //items to store the data of books

// fetching data fromt he api
async function fetchData(page) {
  try {
    const response = await fetch(`${apiUrl}?page=${page}`);
    const result = await response.json();

    
    // storing the data in items array
    items = result.data.data;
    //getting totalPages
    totalPages = result.data.totalPages;
    updateButtons();
    document.getElementById("parentDiv").innerHTML = "";
    renderData(items);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// getting the data to display it
function renderData(books) {
  const contentDiv = document.getElementById("parentDiv");
  contentDiv.innerHTML = "";
  //looping through our data
  books.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.className = "bookCards";
    const { title, authors, publisher, publishedDate, imageLinks, infoLink } =
      book.volumeInfo;
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
                <a href="${infoLink}"><button id="infoBtn">Details</button></a>
            </div>
          `;
    contentDiv.appendChild(bookDiv);
  });
}

// disabling the buttons it they are in 1st page or last page
function updateButtons() {
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

// previous button login
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchData(currentPage);
  }
});

//next button logic
document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchData(currentPage);
  }
});

//sorting the data according to the alphabet and date
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

// Initial calling 
fetchData(currentPage);
