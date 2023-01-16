'use strict';
import {
  DataTypes,
} from 'sequelize';
import { Connection } from '../connection';

const PublishersTable = Connection.define('publishers', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique:true,
        type: DataTypes.INTEGER
      },
      user_id:{
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        unique: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      license_type: {
        type: DataTypes.CHAR(15),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      books_langs: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      social: {
        type: DataTypes.TEXT,
      },
      books_types: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
}, {timestamps: false});

export default PublishersTable
