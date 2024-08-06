const PutData = async (url, datos) => {
    try {
      await axios.put(url, datos)
      alert("Producto Modificado exitosamente")
    } catch (error) {
      console.error(error);
    }
  };
  
  export default PutData