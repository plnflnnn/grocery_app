export async function ensureCartTable(db) {
  try {
    await db.getFirstAsync("SELECT user_id FROM cartitems LIMIT 1");
  } catch {
    await db.execAsync("DROP TABLE IF EXISTS cartitems");
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cartitems (
      id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      quantity INTEGER,
      name TEXT,
      src TEXT,
      category TEXT,
      price REAL,
      PRIMARY KEY (id, user_id)
    );
  `);
}

export async function getCartItems(db, userId) {
  return db.getAllAsync(
    "SELECT * FROM cartitems WHERE user_id = ?",
    String(userId)
  );
}

export async function getCartItem(db, userId, id) {
  return db.getFirstAsync(
    "SELECT * FROM cartitems WHERE id = ? AND user_id = ?",
    id,
    String(userId)
  );
}

export async function insertCartItem(db, userId, item) {
  await db.runAsync(
    `INSERT INTO cartitems (id, user_id, quantity, name, src, category, price)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    item.id,
    String(userId),
    item.quantity,
    item.name,
    item.src,
    item.category,
    item.price
  );
}

export async function updateCartItemQuantity(db, userId, id, quantity) {
  await db.runAsync(
    "UPDATE cartitems SET quantity = ? WHERE id = ? AND user_id = ?",
    quantity,
    id,
    String(userId)
  );
}

export async function deleteCartItem(db, userId, id) {
  await db.runAsync(
    "DELETE FROM cartitems WHERE id = ? AND user_id = ?",
    id,
    String(userId)
  );
}

export async function clearCartItems(db, userId) {
  await db.runAsync(
    "DELETE FROM cartitems WHERE user_id = ?",
    String(userId)
  );
}
