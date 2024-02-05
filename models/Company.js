module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define("Company", {
    companyID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    companyInfo: {
      type: DataTypes.TEXT,
    },
    contactInfo: {
      type: DataTypes.TEXT,
    },
  });

  Company.associate = (models) => {
    Company.belongsTo(models.Users, { foreignKey: "employerID" });
  };

  return Company;
};