import {
  getCartSubtotal,
  getDiscountedPrice,
  getProductDiscount,
} from "./discounts";

const actionProduct = {
  id: "hydro-gen",
  naziv: "Hydro Gen",
  cijena: 100,
  quantity: 1,
  naPopustu: true,
  popustProcenat: 20,
  naAkciji: true,
  akcijaOdKolicine: 3,
  akcijaPopustPovecani: 25,
};

describe("discounts", () => {
  it("uses the product quantity for action threshold, not the whole cart quantity", () => {
    const cart = [
      actionProduct,
      { id: "other-1", cijena: 10, quantity: 1 },
      { id: "other-2", cijena: 10, quantity: 1 },
    ];

    expect(getProductDiscount(actionProduct)).toMatchObject({
      percent: 20,
      type: "regular",
    });
    expect(getDiscountedPrice(actionProduct)).toBe(80);
    expect(getCartSubtotal(cart)).toBe(100);
  });

  it("applies the larger action discount when that same product reaches the threshold", () => {
    const item = { ...actionProduct, quantity: 3 };

    expect(getProductDiscount(item)).toMatchObject({
      percent: 25,
      type: "action",
    });
    expect(getDiscountedPrice(item)).toBe(75);
  });
});
