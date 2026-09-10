export function mapListing(item) {
  return {
    id: item.id,
    name: item.item_name ?? "",
    src: item.item_src ?? "",
    category: String(item.item_category ?? "").toLowerCase(),
    price: Number(item.item_price ?? 0),
  };
}
