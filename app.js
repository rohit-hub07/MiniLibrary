
    const apiUrl = "https://api.freeapi.app/api/v1/public/books";
    let currentPage = 1;
    const itemsPerPage = 10;
    let isLastPage = false;
    let items = [];
    // Fetch paginated data from the API
    async function fetchData(page) {
      try {
        const response = await fetch(`${apiUrl}?page=${page}`);
        const result = await response.json();
        
        // Determine the actual data array based on API structure.
        
        items = result.data.data;
        
        // Check if the current page is the last page.
        isLastPage = items.length < itemsPerPage;
        renderData(items);
        updateButtons();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Render the items in the UI
    function renderData(items) {
      const contentDiv = document.getElementById("content");
      // Map over the array and output each item's id and title (if available)
      contentDiv.innerHTML = items.map(item => 
        `<p><strong>${item.id}:</strong> ${item.volumeInfo?.title || "No Title"}</p>`
      ).join("");
    }

    // Enable or disable buttons based on current page and data
    function updateButtons() {
      document.getElementById("prevBtn").disabled = currentPage === 1;
      document.getElementById("nextBtn").disabled = isLastPage;
    }

    // Update the page and fetch new data
    function updatePage(page) {
      if (page >= 1 && (!isLastPage || page < currentPage)) {
        currentPage = page;
        fetchData(page);
      }
    }

    // Event listeners for navigation buttons
    document.getElementById("prevBtn").addEventListener("click", () => updatePage(currentPage - 1));
    document.getElementById("nextBtn").addEventListener("click", () => updatePage(currentPage + 1));

    //search bar
    document.getElementById("searchBar").addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      console.log(items)
      const filteredBooks = items.filter((book) =>  book.volumeInfo.title.toLowerCase().includes(query));

      renderData(filteredBooks);
    })

    // Initial load
    fetchData(currentPage);