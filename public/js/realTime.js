const socket = io();
//evento para agregar un producto
document.getElementById('productForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    title: e.target.title.value,
    price: e.target.price.value
  };
  socket.emit('new-product', data);
});
// Evento para eliminar un producto (ejemplo fijo)
document.getElementById('deleteBtn').addEventListener('click', () => {
  const productId = document.getElementById('deleteId').value;
  socket.emit('delete-product', productId);
});

// Evento para actualizar un producto (ejemplo fijo)
document.getElementById('updateBtn').addEventListener('click', () => {
  const updatedData = {
    id: document.getElementById('updateId').value,
    title: document.getElementById('updateTitle').value,
    price: document.getElementById('updatePrice').value
  };
  socket.emit('update-product', updatedData);
});