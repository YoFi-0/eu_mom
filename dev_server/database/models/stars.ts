'use strict';
import {
  DataTypes,
} from 'sequelize';
import { Connection } from '../connection';

const StarsTable = Connection.define('stars', {
  user_id:{
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
        model: 'users',
        key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  publisher_id:{
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
        model: 'publishers',
        key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  stars:{
    allowNull: false,
    type: DataTypes.INTEGER,
  },
}, {timestamps: false});

export default StarsTable
