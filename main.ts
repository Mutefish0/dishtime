import {
  orderDish,
  getOrderDetail,
  getEatingDishDetail,
  fetchAllMenu,
} from "./dish.ts";

import { cron } from "https://deno.land/x/deno_cron/cron.ts";

import { sendNotification } from "./bark.ts";
import { sendMessage } from "./robot.ts";

let _shopId = 16410719109346;
let _subShopId = 16192715715071;

function notify(title: string, content: string, silence = false) {
  sendNotification(title, content, silence);
  sendMessage(title, content);
}

// 获取本周菜单
async function notifyWeekMenu() {
  const foodGroup = await fetchAllMenu();
  let msgs = [];
  for (let shopName in foodGroup) {
    const foods =
      foodGroup[shopName].length > 0
        ? foodGroup[shopName].map((f) => `• ${f}`).join("\n")
        : "• 暂无餐品";
    msgs.push(`${shopName}\n\n${foods}`);
  }

  sendMessage(`🍱  本周菜单`, msgs.join("\n\n"));
}

// 用餐提醒
async function eatingNotify() {
  const dishs = await getEatingDishDetail(_shopId, _subShopId);
  if (dishs.length === 0) {
    notify("🍔 用餐提醒", "暂无用餐信息", true);
  }
  const dish = dishs[0];
  notify(
    `🍔 ${dish.mealTimeName}提醒：取餐码${dish.takeMealCode}`,
    `${dish.subShopName}  \n${dish.address}`,
    true
  );
}

// 订餐
async function orderDishAndNotify(
  shopName: string,
  foodName: string,
  dishTypeName: string,
  welfareName: string
) {
  try {
    const { shop, orderId } = await orderDish(
      shopName,
      foodName,
      dishTypeName,
      welfareName
    );
    const orderDetail = await getOrderDetail(
      shop.shopId,
      shop.subShopId,
      orderId
    );
    const food = orderDetail.skuList[0];
    notify(
      `🍱 订餐成功，取餐码 ${orderDetail.takeMealCode}`,
      `${orderDetail.subShopName}  \n${food?.skuName}x${food?.skuNumber}`
    );
    _shopId = shop.shopId;
    _subShopId = shop.subShopId;
  } catch (e) {
    notify("🚧 订餐失败", e.message);
  }
}

// 早上9点 订午餐
cron("0 0 9 * * *", async () => {
  await orderDishAndNotify("海盗虾饭", "麻婆豆腐小龙虾", "午餐", "脉脉午餐");
});
// 11.50 提醒
cron("0 50 11 * * *", async function () {
  await eatingNotify();
});

// 12.30 订晚餐
cron("0 30 12 * * *", async () => {
  await orderDishAndNotify("霸蛮米粉", "麻辣牛肉粉", "晚餐", "脉脉晚餐");
});
// 18.50 提醒
cron("0 50 18 * * *", async function () {
  await eatingNotify();
});

await eatingNotify();
