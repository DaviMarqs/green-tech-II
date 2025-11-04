export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] };
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + action.payload.quantity, 999),
                }
              : i
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, quantity: Math.max(1, action.payload.quantity) },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case "CLEAR_CART":
      return { items: [] };

    case "SET_CART":
      return { items: action.payload };

    default:
      return state;
  }
}
