const PostData = async (url, datos) => {
    try {
      await axios.post(url, datos);
      alert("Producto creado exitosamente");
    } catch (error) {
      console.error(error);
    }
  };
  
  export default PostData;