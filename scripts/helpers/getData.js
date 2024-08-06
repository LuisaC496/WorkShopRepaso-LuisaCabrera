const Getdata = async (url) =>{
  try{
    const { data } = await axios.get(url)
    return data
  }
  catch(error){
      console.error(error)
  }
  }
  
  export default Getdata