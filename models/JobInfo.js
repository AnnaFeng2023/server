module.exports = (sequelize, DataTypes) => {
  const JobInfo = sequelize.define('JobInfos', {
    JobID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CompanyID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Location: {
      type: DataTypes.STRING(255),
    },
    Requirements: {
      type: DataTypes.TEXT,
    },
    PostedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    StartDate: {
      type: DataTypes.DATE,
    },
    EndDate: {
      type: DataTypes.DATE,
    },
    SalaryRange: {
      type: DataTypes.STRING(255),
    },
    CompanyLogo: {
      type: DataTypes.STRING(255),
    },
});

return JobInfo;
};