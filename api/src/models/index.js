const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cliente = sequelize.define('cliente', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.TEXT, allowNull: false },
    dia: { type: DataTypes.STRING, allowNull: false },
    turno: { type: DataTypes.STRING, allowNull: false },
    ocupado: { type: DataTypes.STRING, defaultValue: "Cliente", allowNull: false }
  },
    {
      timestamps: false
    }
  );
};
