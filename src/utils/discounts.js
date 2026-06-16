export const DEFAULT_ACTION_THRESHOLD = 4;
export const DEFAULT_ACTION_DISCOUNT_FROM_THRESHOLD = 25;

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const getCartQuantity = (items = []) =>
  items.reduce((sum, item) => sum + toNumber(item.quantity), 0);

export const getProductDiscount = (item) => {
  const itemQuantity = toNumber(item.quantity);
  const regularDiscount =
    item.naPopustu && toNumber(item.popustProcenat) > 0
      ? toNumber(item.popustProcenat)
      : 0;

  const actionThreshold = Math.max(
    1,
    toNumber(item.akcijaOdKolicine, DEFAULT_ACTION_THRESHOLD)
  );
  const actionThresholdDiscount = toNumber(
    item.akcijaPopustPovecani,
    DEFAULT_ACTION_DISCOUNT_FROM_THRESHOLD
  );
  const actionDiscount = item.naAkciji && regularDiscount > 0
    ? itemQuantity >= actionThreshold
      ? actionThresholdDiscount
      : regularDiscount
    : 0;

  const percent = Math.max(regularDiscount, actionDiscount);

  return {
    percent,
    type:
      percent > 0 &&
      actionDiscount > regularDiscount &&
      item.naAkciji &&
      itemQuantity >= actionThreshold
        ? "action"
        : percent > 0
          ? "regular"
          : "none",
    actionThreshold,
  };
};

export const getDiscountedPrice = (item) => {
  const price = toNumber(item.cijena);
  const { percent } = getProductDiscount(item);

  return price * (1 - percent / 100);
};

export const getLineTotal = (item) =>
  getDiscountedPrice(item) * toNumber(item.quantity);

export const getCartSubtotal = (items = []) => {
  return items.reduce(
    (sum, item) => sum + getLineTotal(item),
    0
  );
};

export const getCartSavings = (items = []) => {
  return items.reduce((sum, item) => {
    const original = toNumber(item.cijena) * toNumber(item.quantity);
    return sum + (original - getLineTotal(item));
  }, 0);
};
