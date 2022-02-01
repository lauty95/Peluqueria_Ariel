const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('usuario', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.TEXT, allowNull: false }
  },
    {
      timestamps: false
    }
  );

  const Cliente = sequelize.define('cliente', {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    idCliente: { type: DataTypes.INTEGER, allowNull: false },
    dia: { type: DataTypes.STRING, allowNull: false },
    turno: { type: DataTypes.STRING, allowNull: false },
    ocupado: { type: DataTypes.STRING, defaultValue: "Cliente", allowNull: false }
  },
    {
      timestamps: false
    }
  );

  const Mensaje = sequelize.define('mensaje', {
    mensaje: { type: DataTypes.TEXT, allowNull: true }
  })

  const Precio = sequelize.define('precio', {
    precio: { type: DataTypes.INTEGER, allowNull: true }
  })
};
