document.querySelector('#countryForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const capital = document.querySelector('#capitalInput').value.trim();
  const results = document.querySelector('#results');
  if (!capital) return;
  results.innerHTML = "<p>Ładowanie...</p>";
  try {
    const res = await fetch(`https://restcountries.com/v3.1/capital/${encodeURIComponent(capital)}`);
    if (!res.ok) throw new Error("Nie znaleziono.");
    const data = await res.json();
    let table = `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Capital</th>
            <th>Population</th>
            <th>Region</th>
            <th>Subregion</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach(c => {
      table += `
        <tr>
          <td>${c.name.common}</td>
          <td>${c.capital ? c.capital.join(', ') : '-'}</td>
          <td>${c.population.toLocaleString()}</td>
          <td>${c.region}</td>
          <td>${c.subregion || '-'}</td>
        </tr>
      `;
    });
    table += `</tbody></table>`;
    results.innerHTML = table;
  } catch (err) {
    results.innerHTML = `<p">Błąd: ${err.message}</p>`;
  }
});

const baseUrl = "https://www.ncei.noaa.gov/cdo-web/api/v2";
const HARDCODED_TOKEN = "yCZHcKzBzDesDsNCGNHcMKEsodekHUDn";

localStorage.setItem("noaa_token", HARDCODED_TOKEN);
async function fetchNoaa(endpoint, params = "") {
  const token = localStorage.getItem("noaa_token");
  if (!token) throw new Error("Brak tokenu");

  const url = `${baseUrl}/${endpoint}${params ? "?" + params : ""}`;
  const response = await fetch(url, { headers: { token } });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Błąd API (${response.status}): ${text}`);
  }

  return await response.json();
}

document.getElementById("loadStations").addEventListener("click", async () => {
  const output = document.getElementById("stations");
  output.innerHTML = "<p>Ładowanie</p>";

  try {
    const params = "datasetid=GHCND&startdate=2020-01-01&enddate=2020-01-02&limit=10";
    const data = await fetchNoaa("stations", params);
    const results = data.results || [];

    let html = `
<table>
<thead>
<tr>
<th>Station ID</th>
<th>Name</th>
<th>State</th>
<th>Latitude</th>
<th>Longitude</th>
</tr>
</thead>
<tbody>
`;

    results.forEach(s => {
      html += `
<tr>
<td>${s.id}</td>
<td>${s.name}</td>
<td>${s.state || "-"}</td>
<td>${s.latitude || "-"}</td>
<td>${s.longitude || "-"}</td>
</tr>
`;
    });

    html += "</tbody></table>";
    output.innerHTML = html;

  } catch (err) {
    output.innerHTML = `<p>${err.message}</p>`;
  }
});