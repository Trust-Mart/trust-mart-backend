import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export interface UserAttributes {
  country: null | string;
  email: string;
  emailVerifiedAt: Date | null;
  id: number;
  isverified: boolean;
  lastLoginAt: Date | null;
  password: string;
  pin: null | string;
  privateKey: null | string;
  smartAccountAddress: null | string;
  smartAccountBalance: null | string;
  username: null | string;
  verificationToken: null | string;
  walletAddress: null | string;
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements UserAttributes {
  declare country: null | string;
  declare email: string;
  declare emailVerifiedAt: Date | null;
  declare id: CreationOptional<number>;
  declare isverified: boolean;
  declare lastLoginAt: Date | null;
  declare password: string;
  declare pin: null | string;
  declare privateKey: null | string;
  declare smartAccountAddress: null | string;
  declare smartAccountBalance: null | string;
  declare username: null | string;
  declare verificationToken: null | string;
  declare walletAddress: null | string;

  // static associate(_models: Record<string, typeof Model>): void {
  //   // define associations later
  // }

  static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        country: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        email: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true,
        },
        emailVerifiedAt: DataTypes.DATE,
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER.UNSIGNED,
        },
        isverified: {
          defaultValue: false,
          type: DataTypes.BOOLEAN,
        },
        lastLoginAt: DataTypes.DATE,
        password: DataTypes.STRING,
        pin: DataTypes.STRING,
        privateKey: DataTypes.TEXT,
        smartAccountAddress: DataTypes.STRING,
        smartAccountBalance: DataTypes.DECIMAL(20, 9),
        username: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        verificationToken: DataTypes.STRING,
        walletAddress: DataTypes.STRING,
      },
      {
        modelName: "User",
        sequelize,
        tableName: "users",
        timestamps: true,
      },
    );

    return User;
  }

  getFullName(): string {
    return (this.username ?? "").trim();
  }

  getSafeUserData(): Omit<UserAttributes, "password" | "privateKey" | "verificationToken"> {
    const { password: _password, privateKey: _privateKey, verificationToken: _verificationToken, ...safeData } = this.toJSON();
    return safeData;
  }

  isEmailVerified(): boolean {
    return !!(this.isverified && this.emailVerifiedAt);
  }
}

export default (sequelize: Sequelize): typeof User => {
  return User.initModel(sequelize);
};
