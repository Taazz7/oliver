document.getElementById("addCategoryBtn").addEventListener("click", async () => {
  const input = document.getElementById("categoryInput");
  const name = input.value.trim();

  if (!name) {
    await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      
    return false;
  }

  try {
      const res = await fetch("http://localhost:3000/categories", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ name })
      });

      if (!res.ok) {
          throw new Error("Error al guardar la categoría");
      }

      const data = await res.json();
      console.log("Categoría guardada:", data);

      // Redirigir a index.html
      window.location.href = "index.html"; 

  } catch (err) {
    console.log(name);
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "No se pudo guardar la categoría",
        text: "Something went wrong!",
      });
  }
});