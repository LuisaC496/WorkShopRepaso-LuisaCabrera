import Getdata from "./helpers/getData.js";
import { PRODUCTOS } from "./helpers/urls.js";
import ShowCard from "./modules/show.js";
import PostData from "./helpers/postData.js";
import PutData from "./helpers/putData.js";
import DeleteData from "./helpers/delete.js";

const templateFragment = document.getElementById("template").content;
const containerCards = document.getElementById("containerCards");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginClose = document.getElementsByClassName("close")[1]; 

let currentProductId = null; 
let isAuthenticated = false; 

document.addEventListener("DOMContentLoaded", async () => {
  // Verificar si el usuario ya está autenticado
  isAuthenticated = JSON.parse(localStorage.getItem("isAuthenticated")) || false;

  const result = await Getdata(PRODUCTOS);
  ShowCard(templateFragment, containerCards, result, openEditModal, deleteProduct);
  
  // Mostrar el modal de inicio de sesión solo si no está autenticado
  if (!isAuthenticated) {
    openLoginModal();
  }
});

/* FUNCIONES PARA INICIAR SESIÓN */
const openLoginModal = () => {
  loginModal.style.display = "block";
};

// Cerrar el modal de inicio de sesión
const closeLoginModal = () => {
  loginModal.style.display = "none";
};

// Evento para cerrar el modal de login al hacer clic en la X
loginClose.onclick = closeLoginModal;

// Evento para cerrar el modal de login al hacer clic fuera del modal
window.onclick = function(event) {
  if (event.target == loginModal) {
    closeLoginModal();
  }
};

// Evento para iniciar sesión
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (email === "usuario@gmail.com" && password === "12345") {
    isAuthenticated = true;
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
    
    alert("Inicio de sesión exitoso");
    closeLoginModal();
    showAdminButtons();
  } else {
    alert("Credenciales incorrectas");
  }
});

const showAdminButtons = () => {
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");
  const addButton = document.createElement("button");
  addButton.textContent = "Registrar Producto";
  addButton.onclick = openModal;
  document.body.appendChild(addButton);

  editButtons.forEach(btn => btn.classList.remove("hidden"));
  deleteButtons.forEach(btn => btn.classList.remove("hidden"));
};

// Función para abrir el modal
const openModal = () => {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
};

// Función para cerrar el modal
const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  form.reset(); // Resetear el formulario al cerrar el modal
  currentProductId = null; // Resetear el ID
};

// Evento para cerrar el modal al hacer clic en la X
const span = document.getElementsByClassName("close")[0];
span.onclick = closeModal;

// Evento para cerrar el modal al hacer clic fuera del modal
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    closeModal();
  }
};


/*AGREGAR*/
const btn = document.createElement("button");
btn.textContent = "Registrar Producto";
btn.onclick = openModal;
document.body.appendChild(btn);

// Configuración del formulario
const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const sizes = document.getElementById("sizes").value.split(",").map(size => size.trim());
  const images = document.getElementById("images").value.split(",").map(img => img.trim());

  // Crear objeto de producto
  let objProduct = {
    id: currentProductId ? currentProductId : Math.floor(Math.random() * 1000), // Mantener el ID si está editando
    name,
    price,
    sizes,
    images
  };

  if (currentProductId) {
    // Actualizar el producto en localStorage
    await PutData(`${PRODUCTOS}/${currentProductId}`, objProduct); 
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    const index = productos.findIndex(p => p.id === currentProductId);
    productos[index] = objProduct;
    localStorage.setItem("productos", JSON.stringify(productos));
  } else {
    // Crear nuevo producto
    await PostData(PRODUCTOS, objProduct);
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(objProduct);
    localStorage.setItem("productos", JSON.stringify(productos));
  }

  // Cerrar el modal después de registrar o editar el producto
  closeModal();
  const updatedProducts = JSON.parse(localStorage.getItem("productos"));
  ShowCard(templateFragment, containerCards, updatedProducts, openEditModal, deleteProduct); // Actualizar la vista
});

/* FUNCIONES PARA EDITAR */
const openEditModal = (product) => {
  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("sizes").value = product.sizes.join(", ");
  document.getElementById("images").value = product.images.join(", ");
  currentProductId = product.id; // Guardar el ID del producto
  openModal(); // Abrir el modal
};

/* FUNCIONES PARA ELIMINAR */
const deleteProduct = async (id) => {
  await DeleteData(`${PRODUCTOS}/${id}`);
  // Eliminar de localStorage
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  productos = productos.filter(p => p.id !== id);
  localStorage.setItem("productos", JSON.stringify(productos));
  ShowCard(templateFragment, containerCards, productos, openEditModal, deleteProduct); 
};
