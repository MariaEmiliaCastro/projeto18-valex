import { connection } from "../database";

export interface Recharge {
  id: number;
  cardId: number;
  timestamp: Date;
  amount: number;
}
export type RechargeInsertData = Omit<Recharge, "id" | "timestamp">;

export async function findByCardId(cardId: number) {
  const result = await connection.query<Recharge, [number]>(
    `SELECT * FROM recharges WHERE "cardId"=$1`,
    [cardId]
  );

  return result.rows;
}

export async function insert(rechargeData: RechargeInsertData) {
  const { cardId, amount } = rechargeData;

  connection.query<any, [number, number]>(
    `INSERT INTO recharges ("cardId", amount) VALUES ($1, $2)`,
    [cardId, amount]
  );
}

export async function balanceRecharges(cardId : number){
  const balance = await connection.query<any, [number]>(
    `SELECT SUM(recharges.amount) as "balance" 
    FROM recharges 
    JOIN cards
    ON recharges."cardId" = cards.id
    WHERE cards.id = $1`,
    [cardId]
  );

  return balance.rows[0];
}
