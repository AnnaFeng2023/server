module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comments", {
    CommentID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CompanyID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    PostDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  return Comment;
};
