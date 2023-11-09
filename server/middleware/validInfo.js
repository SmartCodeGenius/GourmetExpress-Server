module.exports = (req, res, next) => {
    console.log(req.body);
    const { email, nome, senha } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/registro") {
      if (![email, nome, senha].every(Boolean)) {
        return res.status(401).json("Credentiais faltando");
      } else if (!validEmail(email)) {
        return res.res.status(401).json("Email inválido");
      } 
    } 
    
    else if (req.path === "/login") {
      if (![email, senha].every(Boolean)) {
        return res.status(401).json("Credentiais faltando");
      } else if (!validEmail(email)) {
        return res.res.status(401).json("Email inválido");
      }
    }
  
    next();
  };