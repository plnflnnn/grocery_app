export async function ensureListingsTable(db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS groceryitems (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      src TEXT,
      category TEXT,
      price REAL
    );
  `);
}

export async function upsertListings(db, items) {
  if (!items?.length) return;

  const uniqueItems = [
    ...new Map(items.map((item) => [String(item.id), item])).values(),
  ];

  await db.withTransactionAsync(async () => {
    await db.execAsync("DELETE FROM groceryitems");

    for (const item of uniqueItems) {
      await db.runAsync(
        `INSERT INTO groceryitems (id, name, src, category, price)
         VALUES (?, ?, ?, ?, ?)`,
        [item.id, item.name, item.src, item.category, item.price]
      );
    }
  });
}

export async function getAllListings(db) {
  return db.getAllAsync("SELECT * FROM groceryitems");
}

export async function filterListings(db, query, categories) {
  let sql = "SELECT * FROM groceryitems";
  const clauses = [];
  const params = [];

  if (categories.length > 0) {
    const categoryCondition = `(${categories
      .map(() => "category = ?")
      .join(" OR ")})`;
    clauses.push(categoryCondition);
    params.push(...categories.map((category) => category.toLowerCase()));
  }

  const trimmed = query.trim();
  if (trimmed) {
    clauses.push("name LIKE ?");
    params.push(`%${trimmed}%`);
  }

  if (clauses.length > 0) {
    sql += ` WHERE ${clauses.join(" AND ")}`;
  }

  return params.length ? db.getAllAsync(sql, ...params) : db.getAllAsync(sql);
}
