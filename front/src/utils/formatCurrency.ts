export const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(typeof value === "string" ? parseFloat(value) : value);
