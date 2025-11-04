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
