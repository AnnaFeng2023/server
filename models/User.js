module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("Users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    UserType: {
      type: DataTypes.ENUM("Job Seeker", "Employer", "Admin"),
      allowNull: false,
    },
    FirstName: {
      type: DataTypes.STRING(100),
    },
    LastName: {
      type: DataTypes.STRING(100),
    },
    ProfileImage: {
      type: DataTypes.STRING(1000),
    },
    ContactInformation: {
      type: DataTypes.STRING(1000),
    },
    ResumeFilePath: {
      type: DataTypes.STRING(1000),
    },
  });

  return User;
};
