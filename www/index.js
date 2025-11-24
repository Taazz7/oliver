let drawData = (data) => {
  data.forEach(category => {
    let parent = document.getElementsByTagName('ul')[0];
    let child = document.createElement('li');
    child.classList.add("category-item");

    // Texto del nombre
    let nameSpan = document.createElement('span');
    nameSpan.innerText = category.name;

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

fetch("http://localhost:3000/categories")
  .then(res => res.json())
  .then(data => drawData(data));