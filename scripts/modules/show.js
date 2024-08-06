const ShowCard = (template, container, datos, openEditModal, deleteProduct) => {
    let fragment = document.createDocumentFragment();

    // Verificar si hay datos
    if (!datos || datos.length === 0) {
        console.error("No hay datos disponibles");
        return;
    }

    datos.forEach((item) => {
        const { id, name, price, sizes, images } = item;

        // Clonar el template
        const clone = template.cloneNode(true);

        // Configurar las imágenes
        const imgElements = clone.querySelectorAll(".card-images img");
        imgElements.forEach((imgElement, index) => {
            if (images && images[index]) {
                imgElement.setAttribute("src", images[index]);
                imgElement.setAttribute("alt", `${name} imagen ${index + 1}`);
            } else {
                imgElement.style.display = 'none'; 
            }
        });

        // Configurar el nombre, precio y tallas
        clone.querySelector("h5").textContent = name;
        clone.querySelector(".price").textContent = `$${price.toFixed(2)}`;
        clone.querySelector(".sizes").textContent = `Tallas: ${sizes ? sizes.join(", ") : "No disponibles"}`;

        // Asignar ID al botón de editar
        const editButton = clone.querySelector(".edit-btn");
        editButton.setAttribute("data-id", id);
        editButton.onclick = () => openEditModal(item); 

        // Asignar ID al botón de eliminar
        const deleteButton = clone.querySelector(".delete-btn");
        deleteButton.setAttribute("data-id", id);
        deleteButton.onclick = () => deleteProduct(id); 

        fragment.appendChild(clone);
    });
    container.appendChild(fragment);
};

export default ShowCard;
