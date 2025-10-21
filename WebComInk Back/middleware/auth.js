const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user.schema");

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Token d'authentification requis" 
      });
    }

    // Vérifier et décoder le token
    const decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    
    // Récupérer l'utilisateur
    const user = await User.findById(decodedToken.sub);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Utilisateur non trouvé" 
      });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token expiré" 
      });
    }
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token invalide" 
      });
    }

    console.error("Erreur d'authentification:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de l'authentification" 
    });
  }
};

module.exports = authenticateToken;