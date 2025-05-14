'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'userid',
        as: 'author'
      });
    }
  }
  Post.init({
    content: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "Content cannot be empty"
        }
      }
    },
    userid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};