import { format } from "https://deno.land/std@0.138.0/datetime/mod.ts";

const COOKIE =
  "WX_USS=AAJYFAAB-eA0EeQtHSlkdCRM4fVJpxZCnBpLLSgYFeMYNZ6xkEatsCRDtcr0QAbf~0HP5x~BekEwAAC7EbhxHECosPJgslDtvtVwzFACkNBZ05EK0JZRAMN~cLZWNnELrC6w8tIPgL8BJlDihOKgwGp8INY6Y0DzByHg1SP8UNLQsAAMBukxIneAAAQKGmMs";

const USER_NAME = "程一凡";

const commonHeaders = {
  Cookie: COOKIE,
  Accept: "application/json",
  Refer: "https://servicewechat.com/wx1b8683fbb22af097/344/page-frame.html",
  "Accept-Encoding": "gzip,compress,br,deflate",
  "Content-Type": "application/json;charset=UTF-8",
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.20(0x18001432) NetType/WIFI Language/zh_CN",
};

interface Shop {
  shopId: number;
  subShopId: number;
  settledShopId: number;
  settledShopType: number;
  // 店铺名称
  settledShopName: string;
  // 店铺logo
  shopLogo: string;
  menuId: number;
  // 店铺地址
  address: string;
}

interface Food {
  skuBaseId: number;
  /** 菜品名称 */
  name: string;
  /** 副标题 */
  subtitle: string;
  /** 图片列表 */
  image: Array<{
    url: string;
  }>;
  stock: number;
  /** 月销 */
  sales: number;
}

interface DishTime {
  type: number;
  /** 名称：午餐/晚餐 */
  name: string;
  /** 截止送餐时间：19:00 */
  time: string;
  /** 开始送餐时间：18:30 */
  deliveryStartTime: string;
  /** 订餐截止时间：17:00 */
  orderTime: string;
  /** 是否可定 */
  available: boolean;
}

interface Welfare {
  welfareName: string;
  welfareId: number;
  welfareEmployeeId: number;
}

interface OrderDetail {
  /** 取餐地址 */
  receiverAddress: string;
  /** 取餐码 */
  takeMealCode: string;
  /** 商家名称 */
  subShopName: string;
  skuList: Array<{
    skuName: string;
    skuNumber: number;
  }>;
}

export async function fetchDishTimes(
  shopId: number,
  subShopId: number
): Promise<DishTime[]> {
  const resp = await fetch(
    "https://fs.sf-express.com/fsweb/app/shopping/getCalendarsAndDishTimes",
    {
      headers: commonHeaders,
      method: "POST",
      body: JSON.stringify({
        shopId: `${shopId}`,
        subShopId: `${subShopId}`,
        unionShopId: "15998082420222",
        shop_id: `${shopId}`,
        sub_shop_id: `${subShopId}`,
        union_shop_id: "15998082420222",
        lat: "40.010343",
        lng: "116.351001",
        businessDistrictId: 16484782143486,
        date: format(new Date(), "yyyy-MM-dd"),
      }),
    }
  );
  const body = await resp.json();

  if (body.errno) {
    throw new Error(`${body.errno}-${body.errmsg}`);
  }

  return body.data.dishTimes;
}

/* 获取团餐商家列表 */
export async function fetchShops(): Promise<Shop[]> {
  const resp = await fetch(
    "https://fs.sf-express.com/fsweb/app/shopping/tuanCanShopListV2",
    {
      headers: commonHeaders,
      method: "POST",
      body: JSON.stringify({
        shopId: "0",
        subShopId: "",
        unionShopId: "15998082420222",
        shop_id: "0",
        sub_shop_id: "",
        union_shop_id: "15998082420222",
        page: 1,
        pageSize: 20,
        date: format(new Date(), "yyyy-MM-dd"),
        shopListSource: 1,
        lat: "40.010343",
        lng: "116.351001",
        businessDistrictId: 16484782143486,
        showTab: 0,
        type: 10208370,
        mealType: 4,
      }),
    }
  );
  const body = await resp.json();

  if (body.errno) {
    throw new Error(`${body.errno}-${body.errmsg}`);
  }

  return body.data.list;
}

/** 获取商家菜单 */
export async function fetchMenu(
  shopId: number,
  subShopId: number,
  menuId: number,
  dishType: number
): Promise<Food[]> {
  const resp = await fetch(
    "https://fs.sf-express.com/fsweb/app/goods/querySkuByMenuId",
    {
      headers: commonHeaders,
      method: "POST",
      body: JSON.stringify({
        shopId: `${shopId}`,
        subShopId: `${subShopId}`,
        unionShopId: "15998082420222",
        shop_id: `${shopId}`,
        sub_shop_id: `${subShopId}`,
        union_shop_id: "15998082420222",
        type: 1,
        requireStatus: 0,
        menuId: menuId,
        mealType: 4,
        mealTimeId: dishType,
        date: format(new Date(), "yyyy-MM-dd"),
      }),
    }
  );
  const body = await resp.json();

  if (body.errno) {
    throw new Error(`${body.errno}-${body.errmsg}`);
  }

  return body.data.list;
}

/** 添加到购物车 */
export async function addTrolley(
  shopId: number,
  subShopId: number,
  menuId: number,
  startTime: string,
  endTime: string,
  dishType: number,
  skuBaseId: number
): Promise<string[]> {
  const resp = await fetch(
    "https://fs.sf-express.com/fsweb/app/trolley/addTrolley",
    {
      headers: commonHeaders,
      method: "POST",
      body: JSON.stringify({
        shopId: `${shopId}`,
        subShopId: `${subShopId}`,
        unionShopId: "15998082420222",
        shop_id: `${shopId}`,
        sub_shop_id: `${subShopId}`,
        union_shop_id: "15998082420222",
        menuId: menuId,
        orderType: 1,
        deliveryTime: `${format(
          new Date(),
          "yyyy-MM-dd"
        )} ${startTime}-${endTime}`,
        mealTimeId: dishType,
        mealType: 4,
        sku: {
          skuBaseId: skuBaseId,
          skuCount: 1,
          trolleyKey: "5cd1aee1ba71b8f57c6a005736bcd4c8",
        },
      }),
    }
  );
  const body = await resp.json();

  if (body.errno) {
    throw new Error(`${body.errno}-${body.errmsg}`);
  }

  return body.data.trolleyList.map((t: Food) => t.name);
}

/** 去收银台 */
export async function preOrder(
  shopId: number,
  subShopId: number,
  menuId: number
) {
  const resp = await fetch(
    "https://fs.sf-express.com/fsweb/app/merchant/checkTrolleySkuNum",
    {
      headers: commonHeaders,
      method: "POST",
      body: JSON.stringify({
        shopId: `${shopId}`,
        subShopId: `${subShopId}`,
        unionShopId: "15998082420222",
        shop_id: `${shopId}`,
        sub_shop_id: `${subShopId}`,
        union_shop_id: "15998082420222",
        mealType: 4,
        menuId: menuId,
        menu_id: menuId,
        businessDistrictId: 16484782143486,
        businessType: 1,
      }),
    }
  );
  const body = await resp.json();

  if (body.errno) {
    throw new Error(`${body.errno}-${body.errmsg}`);
  }
}

/** 获取下单福利券 */
export async function getOrderWelfares(
  shopId: number,
  subShopId: number,
  /** 地址，E座餐厅 16271844186299 */
  addressId: number,
  dishType: number,
  startTime: string,
  endTime: string
): Promise<Welfare[]> {
  const resp = await fetch(
    "https://fs.sf-express.com/fsweb/app/shopping/trade/calculateorderprice",
    {
      headers: commonHeaders,
      method: "POST",
      body: JSON.stringify({
        shopId: `${shopId}`,
        subShopId: `${subShopId}`,
        unionShopId: "15998082420222",
        shop_id: `${shopId}`,
        sub_shop_id: `${subShopId}`,
        union_shop_id: "15998082420222",
        welfareId: -1,
        welfareBirthdayId: 0,
        choice_logistics: 1,
        mealTimeId: dishType,
        award_status: -1,
        benefit_status: -1,
        bound_status: 1,
        canka_status: -1,
        choice_addr_id: addressId,
        companyBalanceStatus: -1,
        coupon_id: -1,
        customerGroupStatus: -1,
        deductionStatus: -1,
        deliveryDay: format(new Date(), "yyyy-MM-dd"),
        deliveryTime: `${format(
          new Date(),
          "yyyy-MM-dd"
        )} ${startTime}-${endTime}`,
        freightCouponId: -1,
        isWelfareCardEmpty: false,
        is_tuancan: 1,
        latitude: -1,
        longitude: -1,
        orderFlag: 1,
        platformCouponId: -1,
        use_shopping_cart: 1,
        version: 1,
        welfareCardChoose: [],
      }),
    }
  );
  const body = await resp.json();

  if (body.errno) {
    throw new Error(`${body.errno}-${body.errmsg}`);
  }

  return body.data.welfareList;
}

/** 下单 */
export async function createOrder(
  shopId: number,
  subShopId: number,
  /** 地址，E座餐厅 16271844186299 */
  addressId: number,
  welfareId: number,
  welfareEmployeeId: number,
  dishType: number,
  startTime: string,
  endTime: string
): Promise<number> {
  const resp = await fetch(
    "https://fs.sf-express.com/fsweb/app/shopping/trade/ordercreate",
    {
      headers: commonHeaders,
      method: "POST",
      body: JSON.stringify({
        shopId: `${shopId}`,
        subShopId: `${subShopId}`,
        unionShopId: "15998082420222",
        shop_id: `${shopId}`,
        sub_shop_id: `${subShopId}`,
        union_shop_id: "15998082420222",
        is_check: 0,
        receiver_name: USER_NAME,
        receiver_phone: "",
        source: 0,
        remark: "",
        is_trolley: 1,
        longitude: -1,
        latitude: -1,
        welfareCardChoose: [],
        is_invoice: 0,
        invoice_info: "",
        addr_id: addressId,
        dispatch_method: 1,
        coupon_id: 0,
        freight_coupon_id: 0,
        platform_coupon_id: 0,
        welfareId: welfareId,
        welfareEmployeeId: welfareEmployeeId,
        order_flag: 1,
        dining_num: "依据餐量提供",
        mealTimeId: dishType,
        fs_pay_type: "[]",
        reduce_list: "[0]",
        delivery_time: JSON.stringify({
          date: format(new Date(), "yyyy-MM-dd"),
          from: startTime,
          to: endTime,
        }),
        sku_list: "[]",
      }),
    }
  );
  const body = await resp.json();

  if (body.errno) {
    throw new Error(`${body.errno}-${body.errmsg}`);
  }

  return body.data;
}

/** 支付 */
export async function pay(shopId: number, subShopId: number, orderId: number) {
  const resp = await fetch("https://fs.sf-express.com/fsweb/app/pay/wxpay", {
    headers: commonHeaders,
    method: "POST",
    body: JSON.stringify({
      shopId: `${shopId}`,
      subShopId: `${subShopId}`,
      shop_id: `${shopId}`,
      sub_shop_id: `${subShopId}`,
      union_shop_id: "15998082420222",
      orderId: orderId,
      orderType: 0,
    }),
  });
  const body = await resp.json();

  if (body.errno) {
    throw new Error(`${body.errno}-${body.errmsg}`);
  }
}

/** 查询订单详情 */
export async function getOrderDetail(
  shopId: number,
  subShopId: number,
  orderId: number
): Promise<OrderDetail> {
  const resp = await fetch(
    "https://fs.sf-express.com/fsweb/app/order/queryMergeOrderDetail",
    {
      headers: commonHeaders,
      method: "POST",
      body: JSON.stringify({
        shopId: `${shopId}`,
        subShopId: `${subShopId}`,
        unionShopId: "15998082420222",
        shop_id: `${shopId}`,
        sub_shop_id: `${subShopId}`,
        union_shop_id: "15998082420222",
        longitude: "116.351001",
        latitude: "40.010343",
        orderId: `${orderId}`,
        orderClassify: "1",
      }),
    }
  );

  const body = await resp.json();

  if (body.errno) {
    throw new Error(`${body.errno}-${body.errmsg}`);
  }

  return body.data;
}

export async function orderDish(
  shopName: string,
  foodName: string,
  dishTypeName: string,
  welfareName: string
): Promise<{ shop: Shop; orderId: number }> {
  // E座餐厅
  const addressId = 16271844186299;

  const shops = await fetchShops();

  const shop = shops.find((s) => s.settledShopName.includes(shopName));

  console.log(shop);

  if (!shop) {
    throw Error(`没有找到商家：${shopName}`);
  }
  // 订餐时间 - 午餐/晚餐
  const dishTimes = await fetchDishTimes(shop.shopId, shop.subShopId);

  const dishTime = dishTimes.find((d) => d.name === dishTypeName);

  if (!dishTime) {
    throw Error(`没有找到用餐类型：${dishTypeName}`);
  }

  // 菜单
  const menu = await fetchMenu(
    shop.shopId,
    shop.subShopId,
    shop.menuId,
    dishTime.type
  );

  const food = menu.find((f) => f.name.includes(foodName));

  if (!food) {
    throw Error(`没有找到菜品：${foodName}`);
  }

  const itemNames = await addTrolley(
    shop.shopId,
    shop.subShopId,
    shop.menuId,
    dishTime.deliveryStartTime,
    dishTime.time,
    dishTime.type,
    food.skuBaseId
  );

  console.log(`添加到购物车：${itemNames.join("+")}`);

  await preOrder(shop.shopId, shop.subShopId, shop.menuId);

  const welfares = await getOrderWelfares(
    shop.shopId,
    shop.subShopId,
    addressId,
    dishTime.type,
    dishTime.deliveryStartTime,
    dishTime.time
  );

  const welfare = welfares.find((w) => w.welfareName === welfareName);

  if (!welfare) {
    throw Error(`没有可用的福利券：${welfareName}`);
  }

  const orderId = await createOrder(
    shop.shopId,
    shop.subShopId,
    addressId,
    welfare.welfareId,
    welfare.welfareEmployeeId,
    dishTime.type,
    dishTime.deliveryStartTime,
    dishTime.time
  );

  if (!orderId) {
    throw Error(`下单失败！`);
  }

  console.log("下单成功！");

  await pay(shop.shopId, shop.subShopId, orderId);

  console.log("支付成功，预定完成！");

  return {
    shop,
    orderId,
  };
}
