// CARGAR CATEGORÍAS
let drawData = (data) => {
  data.forEach(category => {
    let parent = document.getElementsByTagName('ul')[0];
    let child = document.createElement('li');
    child.classList.add("category-item");

    // Borrado Categorias

    // Texto del nombre
    let nameSpan = document.createElement('button');
    nameSpan.innerText = category.name;
    let className = category.name;
    nameSpan.classList.add(className);

     // Al hacer clic, cargar los sites de esa categoría
     nameSpan.addEventListener("click", () => {
      loadSitesByCategory(category.id);
    });

    // Botón borrar
    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = "🗑️";
    deleteBtn.classList.add("delete-btn");

    // Acción al borrar
    deleteBtn.addEventListener("click", async () => {
      try {
        const res = await fetch(`http://localhost:3000/categories/${category.id}`, {
          method: "DELETE"
        });

        if (!res.ok) throw new Error("Error al borrar");

        child.remove();
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo borrar la categoría",
        });
      }
    });

    child.appendChild(nameSpan);
    child.appendChild(deleteBtn);
    parent.appendChild(child);
  });
};


// PETICIÓN CATEGORÍAS
fetch("http://localhost:3000/categories")
  .then(res => res.json())
  .then(data => drawData(data));


// ===============================
// NUEVO: CARGAR SITES de categoría
// ===============================
async function loadSitesByCategory(categoryId) {
  try {
    const res = await fetch(`http://localhost:3000/categories/${categoryId}`);
    const data = await res.json();
    drawSites(data.sites);
  } catch (err) {
    console.error("Error cargando sites por categoría:", err);
  }
}


// DIBUJAR SITES EN TABLA
function drawSites(sites) {
  const tbody = document.getElementById("sitesTableBody");
  tbody.innerHTML = "";

  sites.forEach(site => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${site.name}</td>
      <td>${site.user}</td>
      <td>${new Date(site.created_at).toLocaleString()}</td>
      <td>
        <button class="delete-site" data-id="${site.id}">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  addDeleteSiteEvents();
}


// Cargar todos los sites al iniciar
async function loadSites() {
  try {
    const res = await fetch("http://localhost:3000/sites");
    const data = await res.json();
    drawSites(data);
  } catch (err) {
    console.error("Error cargando sites:", err);
  }
}


// Borrar site
function addDeleteSiteEvents() {
  const buttons = document.querySelectorAll(".delete-site");

  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");

      try {
        const res = await fetch(`http://localhost:3000/sites/${id}`, {
          method: "DELETE"
        });

        if (!res.ok) throw new Error("No se pudo borrar");

        loadSites(); // o loadSitesByCategory si quieres mantener la vista filtrada
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "No se pudo borrar el sitio"
        });
      }
    });
  });
}


// INICIALIZAR
document.addEventListener("DOMContentLoaded", () => {
  loadSites();
});
