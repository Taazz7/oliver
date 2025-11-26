// ======== CONFIGURACION ========
const API_URL = "http://localhost:3000";

// ======== CARGAR CATEGORÍAS EN EL SELECT ========
async function loadCategories() {
  const select = document.getElementById("siteCategory");
  select.innerHTML = ""; // limpiar antes

  try {
    const res = await fetch(`${API_URL}/categories`);
    const categories = await res.json();

    // Añadir opción por defecto
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Selecciona una categoría";
    select.appendChild(defaultOpt);

    // Agregar cada categoría
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;          // tu API debe devolver id
      option.textContent = cat.name;  // y name
      select.appendChild(option);
    });

  } catch (err) {
    console.error("Error cargando categorías:", err);
  }
}

// ======== AÑADIR NUEVO SITE ========
async function addNewSite() {
  const name = document.getElementById("siteName").value;
  const user = document.getElementById("siteUser").value;
  const password = document.getElementById("sitePass").value;
  const url = document.getElementById("siteUrl").value;
  const categoryId = document.getElementById("siteCategory").value;

  if (!categoryId) {
    alert("Debes seleccionar una categoría");
    return;
  }

  const newSite = {
    name,
    user,
    password,
    url,
    description: "Sin descripción"
  };

  try {
    const res = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSite)
    });

    if (!res.ok) {
      throw new Error("Error al añadir el site");
    }

    alert("Site añadido correctamente");
    clearForm();
    loadSites();

  } catch (err) {
    console.error("Error agregando site:", err);
  }
 

}

// ======== LIMPIAR FORMULARIO ========
function clearForm() {
  document.getElementById("siteName").value = "";
  document.getElementById("siteUser").value = "";
  document.getElementById("sitePass").value = "";
  document.getElementById("siteUrl").value = "";
  document.getElementById("siteCategory").value = "";
}

// ======== CARGAR LISTA DE SITES (OPCIONAL) ========
async function loadSites() {
  const tableBody = document.querySelector("#tableSites tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  try {
    const res = await fetch(`${API_URL}/sites`);
    const sites = await res.json();

    sites.forEach(site => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${site.name}</td>
        <td>${site.user}</td>
        <td>${new Date(site.created_at).toLocaleString()}</td>
        <td><button data-id="${site.id}" class="btnDelete">Eliminar</button></td>
      `;

      tableBody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error cargando sites:", err);
  }
}

// ======== EVENTOS ========
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadSites();

  const btnAdd = document.getElementById("submitBtn");
  if (btnAdd) {
    btnAdd.addEventListener("click", addNewSite);
  }
});
