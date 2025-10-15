import type { QueryInterface } from "sequelize";

import { DataTypes } from "sequelize";

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable("users");
}
export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable("users", {
    country: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    emailVerifiedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    isverified: {
      allowNull: true,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    lastLoginAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    pin: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    privatekey: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    smartAccountAddress: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    smartAccountBalance: {
      allowNull: true,
      defaultValue: 0,
      type: DataTypes.DECIMAL(20, 9),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    verificationToken: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    walletAddress: {
      allowNull: true,
      type: DataTypes.STRING,
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
        [Symbol.for("ne")]: null,
      },
    },
  });

  await queryInterface.addIndex("users", ["smartAccountAddress"], {
    name: "users_smart_account_address_index",
    where: {
      smartAccountAddress: {
        [Symbol.for("ne")]: null,
      },
    },
  });

  await queryInterface.addIndex("users", ["smartAccountBalance"], {
    name: "users_smart_account_balance_index",
    where: {
      smartAccountBalance: {
        [Symbol.for("ne")]: null,
      },
    },
  });
}
