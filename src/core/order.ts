export type Order = {
  shopId: string | number;
  shopName: string;
  amountCents: number;
  counted: boolean;
  date: string | null;
};
