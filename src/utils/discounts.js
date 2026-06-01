export const DEFAULT_ACTION_THRESHOLD = 4;
export const DEFAULT_ACTION_DISCOUNT_FROM_THRESHOLD = 25;

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const getCartQuantity = (items = []) =>
  items.reduce((sum, item) => sum + toNumber(item.quantity), 0);

export const getProductDiscount = (item, totalQuantity = 0) => {
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
    ? totalQuantity >= actionThreshold
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
      totalQuantity >= actionThreshold
        ? "action"
        : percent > 0
          ? "regular"
          : "none",
    actionThreshold,
  };
};

export const getDiscountedPrice = (item, totalQuantity = 0) => {
  const price = toNumber(item.cijena);
  const { percent } = getProductDiscount(item, totalQuantity);

  return price * (1 - percent / 100);
};

export const getLineTotal = (item, totalQuantity = 0) =>
  getDiscountedPrice(item, totalQuantity) * toNumber(item.quantity);

export const getCartSubtotal = (items = []) => {
  const totalQuantity = getCartQuantity(items);
  return items.reduce(
    (sum, item) => sum + getLineTotal(item, totalQuantity),
    0
  );
};

export const getCartSavings = (items = []) => {
  const totalQuantity = getCartQuantity(items);
  return items.reduce((sum, item) => {
    const original = toNumber(item.cijena) * toNumber(item.quantity);
    return sum + (original - getLineTotal(item, totalQuantity));
  }, 0);
};
