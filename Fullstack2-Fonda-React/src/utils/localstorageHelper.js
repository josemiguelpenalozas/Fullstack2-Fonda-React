// utils/localStorage.js
export const saveToLocalstorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (ex) {
    console.error("Error al guardar:", ex);
  }
};

export const loadFromLocalstorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (ex) {
    console.error("Error al cargar:", ex);
    return null;
  }
};

export const removeFromLocalstorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (ex) {
    console.error("Error al eliminar:", ex);
  }
};

//métodos para el carrito (guiño guiño)


//métodos para el login


//métodos para los pokemones