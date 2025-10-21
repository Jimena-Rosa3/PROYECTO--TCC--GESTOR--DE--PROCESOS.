// Middleware para verificar el rol del usuario
function authorizeRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        message: 'Acceso denegado: no tienes permisos para realizar esta acción'
      });
    }
    next();
  };
}

module.exports = authorizeRoles;
