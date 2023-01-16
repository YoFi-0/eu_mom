'use strict';
import {
  DataTypes,
} from 'sequelize';
import { Connection } from '../connection';

const BooksTable = Connection.define('books', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique:true,
      type: DataTypes.INTEGER
    },
    publisher_id:{
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
          model: 'publishers',
          key: 'id'
      },
      unique: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    writer_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    writer_email: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    book_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    book_type: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    book_prints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_image_url: {
      type: DataTypes.STRING(300),
      allowNull: false,
    }
}, {timestamps: false});

export default BooksTable
