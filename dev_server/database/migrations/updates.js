'use strict';


// like this

module.exports = {
  // @ts-ignore
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique:true,
            type: Sequelize.INTEGER
          },
          email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique:true
          },
          google_id: {
            type: Sequelize.STRING(25),
            allowNull: false,
            unique:true
          },
          type: {
            type: Sequelize.CHAR(9),
            allowNull: false,
          },
    });
    await queryInterface.createTable('publishers', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          unique:true,
          type: Sequelize.INTEGER
        },
        user_id:{
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
              model: 'users',
              key: 'id'
          },
          unique: true,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        license_type: {
          type: Sequelize.CHAR(15),
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        books_langs: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        social: {
          type: Sequelize.TEXT,
        },
        books_types: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        image_url: {
          type: Sequelize.STRING(50),
        },
    });
    await queryInterface.createTable('books', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          unique:true,
          type: Sequelize.INTEGER
        },
        user_id:{
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
              model: 'users',
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        writer_name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        writer_email: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        book_name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        book_type: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        book_prints: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        book_image_url: {
          type: Sequelize.STRING(300),
          allowNull: false,
        }
    })
  },
  // @ts-ignore
  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable('users');
  }
};


