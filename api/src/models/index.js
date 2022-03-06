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
    nombre: { type: DataTypes.STRING, allowNull: true },
    telefono: { type: DataTypes.TEXT, allowNull: true },
    tienePromo: { type: DataTypes.BOOLEAN, allowNull: true },
    dia: { type: DataTypes.STRING, allowNull: false },
    diaPromo: { type: DataTypes.STRING, allowNull: true },
    turno: { type: DataTypes.STRING, allowNull: false },
    idCliente: { type: DataTypes.INTEGER, allowNull: true },
    ocupado: { type: DataTypes.STRING, defaultValue: "Cliente", allowNull: false },
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

  const Push = sequelize.define('push', {
    endpoint: { type: DataTypes.STRING, allowNull: false },
    expirationTime: { type: DataTypes.STRING, allowNull: true },
    p256dh: { type: DataTypes.STRING, allowNull: false },
    auth: { type: DataTypes.STRING, allowNull: false },
  },
    {
      timestamps: false
    })
};
