import { orderDish, getOrderDetail } from "./dish.ts";

import { cron, hourly } from "https://deno.land/x/deno_cron/cron.ts";

import { sendNotification } from "./bark.ts";
import { sendMessage } from "./robot.ts";

function nitofy(title: string, content: string, silence = false) {
  sendNotification(title, content, silence);
  sendMessage(title, content);
}

// 早上9点 订午餐
cron("0 0 9 * * *", async () => {
  try {
    const { shop, orderId } = await orderDish(
      "你的心跳",
      "招牌酸菜小鱼",
      "午餐",
      "脉脉午餐"
    );
    const orderDetail = await getOrderDetail(
      shop.shopId,
      shop.subShopId,
      orderId
    );
    const food = orderDetail.skuList[0];
    nitofy(
      `🍱 订餐成功，取餐码 ${orderDetail.takeMealCode}`,
      `${orderDetail.subShopName}  \n${food?.skuName}x${food?.skuNumber}`
    );
  } catch (e) {
    nitofy("🚧 订餐失败", e.message);
  }
});

// 12.30 订晚餐
cron("0 30 12 * * *", async () => {
  try {
    const { shop, orderId } = await orderDish(
      "你的心跳",
      "招牌酸菜小鱼",
      "晚餐",
      "脉脉晚餐"
    );
    const orderDetail = await getOrderDetail(
      shop.shopId,
      shop.subShopId,
      orderId
    );
    const food = orderDetail.skuList[0];
    nitofy(
      `🍱 订餐成功，取餐码 ${orderDetail.takeMealCode}`,
      `${orderDetail.subShopName}  \n${food?.skuName}x${food?.skuNumber}`
    );
  } catch (e) {
    nitofy("🚧 订餐失败", e.message);
  }
});
