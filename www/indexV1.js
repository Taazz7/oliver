// index.js

const categoryList = document.getElementById("categoryList");
const sitesTableBody = document.getElementById("sitesTableBody");

const API_URL = "http://localhost:3000"; // ajusta según tu servidor
let activeCategoryId = null;

// --- API ---
async function getCategories() {
  const res = await fetch(`${API_URL}/categorias`);
  return res.json();
}

async function getSitesByCategory(categoryId) {
  const res = await fetch(`${API_URL}/categorias/${categoryId}/sites`);
  return res.json();
}

// --- UI ---
function renderCategories(categorias) {
  categoryList.innerHTML = "";
  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.nombre;
    btn.className = "category-btn";
    if (cat.id === activeCategoryId) btn.classList.add("active");
    btn.addEventListener("click", () => {
      activeCategoryId = cat.id;
      loadSites(cat.id);
      renderCategories(categorias);
    });
    categoryList.appendChild(btn);
  });
}

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
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    const viewBtn = document.createElement("button");
    viewBtn.textContent = "🔍";
    tdActions.append(editBtn, delBtn, viewBtn);

    tr.append(tdSite, tdUser, tdCreated, tdActions);
    sitesTableBody.appendChild(tr);
  });
}

// --- Inicialización ---
async function loadCategories() {
  const categorias = await getCategories();
  if (categorias.length > 0 && !activeCategoryId) {
    activeCategoryId = categorias[0].id;
    loadSites(activeCategoryId);
  }
  renderCategories(categorias);
}

async function loadSites(categoryId) {
  const sites = await getSitesByCategory(categoryId);
  renderSites(sites);
}

loadCategories();

