module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define("Applications", {
    ApplicationId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    JobID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CandidateID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ApplicationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Status: {
      type: DataTypes.ENUM("Applied", "In Review", "Accepted", "Rejected"),
      allowNull: false,
    },

    Resume: {
      type: DataTypes.STRING,
    },
  });

  return Application;
};
