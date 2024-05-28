async function fetchData() {
  try {
    const response = await fetch("http://localhost:3000/scrape-data", {
      method: "POST",
    });
    const data = await response.json();

    displayData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("loading").textContent = "Error fetching data";
  }
}

function displayData(data) {
  const container = document.getElementById("data-container");
  const loadingDiv = document.getElementById("loading");

  loadingDiv.style.display = "none";
  container.innerHTML = "";

  if (data.length > 0) {
    data.slice(0, 3).forEach((row) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>${row[0]}</h3>
        <table>
          <tr><th>Units</th><td>${row[1]}</td></tr>
          <tr><th>Opening Date</th><td>${row[2]}</td></tr>
          <tr><th>Closing Date</th><td>${row[3]}</td></tr>
          <tr><th>Issue Manager</th><td>${row[4]}</td></tr>
          <tr><th>Status</th><td>${row[5]}</td></tr>
        </table>
      `;
      container.appendChild(card);
    });
  } else {
    loadingDiv.textContent = "No data found";
    loadingDiv.style.display = "block";
  }
}

document.getElementById("scrap-button").addEventListener("click", () => {
  document.getElementById("loading").style.display = "block";
  document.getElementById("loading").textContent = "Loading...";
  fetchData();
});
