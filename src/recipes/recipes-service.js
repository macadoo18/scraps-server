const xss = require('xss');

const RecipesService = {
  insertRecipe(db, newRecipe) {
    return db
      .insert(newRecipe)
      .into('recipes')
      .returning('*')
      .then(([recipe]) => recipe);
  },
  getById(db, id) {
    return db.from('recipes').select('*').where({ id }).first();
  },
  getByUserId(db, user_id) {
    return db.select('*').from('recipes').where({ user_id });
  },
  updateRecipe(db, id, recipe) {
    return db.from('recipes').where({ id }).update(recipe);
  },
  deleteRecipe(db, id) {
    return db.from('recipes').where({ id }).delete();
  },
  serializeRecipe(recipe) {
    return {
      id: recipe.id,
      user_id: recipe.user_id,
      name: recipe.name,
      category: recipe.category,
      type: recipe.type,
    };
  },
};

module.exports = RecipesService;
