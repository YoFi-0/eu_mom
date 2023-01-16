'use strict';
import {
  DataTypes,
} from 'sequelize';
import { Connection } from '../connection';

const UsersTable = Connection.define('users', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique:true,
    type: DataTypes.INTEGER
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique:true
  },
  google_id: {
    type: DataTypes.STRING(25),
    allowNull: false,
    unique:true
  },
  type: {
    type: DataTypes.CHAR(9),
    allowNull: false,
  },
}, {timestamps: false});

export default UsersTable
