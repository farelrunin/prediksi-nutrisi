const { DataTypes } = require("sequelize");
const { sequelize } = require("./database-express");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), nullable: false },
  email: { type: DataTypes.STRING(100), unique: true, nullable: false },
  hashed_password: { type: DataTypes.STRING(255), nullable: false },
  phone: { type: DataTypes.STRING(20) },
  birth_date: { type: DataTypes.STRING(50) },
  gender: { type: DataTypes.STRING(20) },
  height: { type: DataTypes.FLOAT },
  weight: { type: DataTypes.FLOAT },
  activity_level: { type: DataTypes.STRING(50) },
  nutrition_goal: { type: DataTypes.STRING(100) },
  target_calories: { type: DataTypes.FLOAT },
  target_protein: { type: DataTypes.FLOAT },
  target_carbs: { type: DataTypes.FLOAT },
  target_fat: { type: DataTypes.FLOAT },
  is_pregnant: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_breastfeeding: { type: DataTypes.BOOLEAN, defaultValue: false },
  age: { type: DataTypes.INTEGER },
  sleep_hours: { type: DataTypes.FLOAT },
  profile: { type: DataTypes.JSON, defaultValue: {} },
  avatar_url: { type: DataTypes.TEXT('long') },
}, {
  tableName: "users",
  underscored: true
});

const FoodEntry = sequelize.define("FoodEntry", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  meal_type: { type: DataTypes.STRING(50), defaultValue: "breakfast", field: 'meal_type' },
  food_name: { type: DataTypes.STRING(100), allowNull: false, field: 'food_name' },
  quantity: { type: DataTypes.FLOAT, defaultValue: 0.0 },
  unit: { type: DataTypes.STRING(50), defaultValue: "gram" },
  calories: { type: DataTypes.FLOAT, allowNull: false },
  protein: { type: DataTypes.FLOAT, allowNull: false },
  carbs: { type: DataTypes.FLOAT, allowNull: false },
  fat: { type: DataTypes.FLOAT, allowNull: false },
}, {
  tableName: "food_entries",
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

const Category = sequelize.define("Category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), nullable: false, unique: true },
  section: { type: DataTypes.STRING(100), nullable: false },
  description: { type: DataTypes.TEXT },
  item_count: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: "categories",
  underscored: true
});

const Food = sequelize.define("Food", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  food_name_en: { type: DataTypes.STRING(255), nullable: false },
  food_name_id: { type: DataTypes.STRING(255), nullable: false },
  calories: { type: DataTypes.FLOAT },
  protein: { type: DataTypes.FLOAT },
  carbohydrates: { type: DataTypes.FLOAT },
  total_fat: { type: DataTypes.FLOAT },
  category_id: { type: DataTypes.INTEGER },
}, {
  tableName: "foods",
  underscored: true
});

// Relationships
User.hasMany(FoodEntry, { foreignKey: "user_id" });
FoodEntry.belongsTo(User, { foreignKey: "user_id" });

Category.hasMany(Food, { foreignKey: "category_id" });
Food.belongsTo(Category, { foreignKey: "category_id" });

module.exports = { User, FoodEntry, Category, Food };
