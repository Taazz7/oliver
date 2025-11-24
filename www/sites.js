// sites.js

// Referencias al DOM
const formAddSite = document.getElementById("formAddSite");
const siteName = document.getElementById("siteName");
const siteUser = document.getElementById("siteUser");
const sitePass = document.getElementById("sitePass");
const siteUrl = document.getElementById("siteUrl");
const siteCategory = document.getElementById("siteCategory");
const sitesTableBody = document.getElementById("sitesTableBody");

// URL base del servidor (ajústala según tu backend)
const API_URL = "http://localhost:3000"; // ejemplo

// --- Funciones de API ---
async function getSitesByCategory(categoryId) {
  const res = await fetch(`${API_URL}/categorias/${categoryId}/sites`);
  return res.json();
}

async function addSite(data) {
  const res = await fetch(`${API_URL}/sites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function deleteSite(id) {
  await fetch(`${API_URL}/sites/${id}`, { method: "DELETE" });
}

// --- Funciones de UI ---
function renderSites(sites) {
  sitesTableBody.innerHTML = "";
  if (sites.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "No hay sitios en esta categoría.";
    tr.appendChild(td);
    sitesTableBody.appendChild(tr);
    return;
  }

  sites.forEach(site => {
    const tr = document.createElement("tr");

    const tdSite = document.createElement("td");
    tdSite.textContent = site.nombre;

    const tdUser = document.createElement("td");
    tdUser.textContent = site.usuario;

    const tdCreated = document.createElement("td");
    tdCreated.textContent = new Date(site.createdAt).toLocaleDateString();

    const tdActions = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.title = "Eliminar";
    delBtn.addEventListener("click", async () => {
      if (confirm("¿Eliminar este site?")) {
        await deleteSite(site.id);
        loadSites(site.categoriaId);
      }
    });
    tdActions.appendChild(delBtn);

    tr.append(tdSite, tdUser, tdCreated, tdActions);
    sitesTableBody.appendChild(tr);
  });
}

// --- Eventos ---
formAddSite.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = siteName.value.trim();
  const usuario = siteUser.value.trim();
  const password = sitePass.value.trim();
  const url = siteUrl.value.trim();
  const categoriaId = siteCategory.value;

  // Validaciones obligatorias
  if (!nombre || !usuario || !password) {
    alert("Nombre, usuario y contraseña son obligatorios");
    return;
  }

  await addSite({ nombre, usuario, password, url, categoriaId });
  formAddSite.reset();
  loadSites(categoriaId);
});

// --- Inicialización ---
async function loadSites(categoryId) {
  const sites = await getSitesByCategory(categoryId);
  renderSites(sites);
}

// Ejemplo: cargar sites de la categoría activa (ajusta según tu lógica)
const activeCategoryId = siteCategory.value;
if (activeCategoryId) {
  loadSites(activeCategoryId);
}
