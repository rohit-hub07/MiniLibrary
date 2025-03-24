// const fetch = require("node-fetch");

const url =
  "https://api.freeapi.app/api/v1/public/books?page=1&limit=10&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech";
const options = { method: "GET", headers: { accept: "application/json" } };

 let currentPage = 1;
 const itemsPerPage = 5;
 let totalPages = 1;


async function getData(page) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data.data);
    const volume = data.data;

    const totalItems = response.headers.get("X-total-Count");

    totalPages = totalItems? Math.ceil(totalItems / itemsPerPage) : 10;


    return volume;

    // let volLength = Object.keys(volume).length;
    // console.log(data.data.length)
    // for(let i = 0; i<volLength; i++){
    //   // console.log(volume.data[i].volumeInfo)
    //   let data = volume.data[i].volumeInfo
    //   return data;
    // }
    
    // console.log(volume[0].volumeInfo)
  } catch (error) {
    console.error(error);
  }
}

function renderData(items){
  const constentDiv = document.getElementById('content');
  constentDiv.innerHTML = items.map(item =>  `<p><strong>${item.volumeInfo.title}:</strong> ${item.volumeInfo.author[0]}</p>`).join("");
}

function updateButtons() {
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

async function updatePage(page){
  currentPage = page;
  const data = await getData(page)
  console.log(data)
  renderData(data);
}

document.getElementById("prevBtn").addEventListener("click", () => updatePage(currentPage - 1));
document.getElementById("nextBtn").addEventListener("click", () => updatePage(currentPage + 1));


updatePage(1)
