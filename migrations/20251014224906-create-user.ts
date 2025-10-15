'use strict';
import type {
  QueryInterface,
  Sequelize as SequelizeType,
} from "sequelize";

export async function down(
  queryInterface: QueryInterface
): Promise<void> {
  await queryInterface.dropTable("users");
}

export async function up(
  queryInterface: QueryInterface,
  Sequelize: SequelizeType
): Promise<void> {
  await queryInterface.createTable("users", {
    country: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    },
    emailVerifiedAt: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    isverified: {
      allowNull: true,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    lastLoginAt: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    pin: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    privatekey: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    smartAccountAddress: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    smartAccountBalance: {
      allowNull: true,
      defaultValue: 0,
      type: Sequelize.DECIMAL(20, 9),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    username: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    },
    verificationToken: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    walletAddress: {
      allowNull: true,
      type: Sequelize.STRING,
    },
  });

  await queryInterface.addIndex("users", ["email"], {
    name: "users_email_index",
    unique: true,
  });

  await queryInterface.addIndex("users", ["username"], {
    name: "users_username_index",
    unique: true,
  });

  await queryInterface.addIndex("users", ["walletAddress"], {
    name: "users_wallet_address_index",
    where: {
      walletAddress: {
        [Sequelize.Op.ne]: null,
      },
    },
  });

  await queryInterface.addIndex("users", ["smartAccountAddress"], {
    name: "users_smart_account_address_index",
    where: {
      smartAccountAddress: {
        [Sequelize.Op.ne]: null,
      },
    },
  });

  await queryInterface.addIndex("users", ["smartAccountBalance"], {
    name: "users_smart_account_balance_index",
    where: {
      smartAccountBalance: {
        [Sequelize.Op.ne]: null,
      },
    },
  });
}
