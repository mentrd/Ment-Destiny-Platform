/** 出生地選項（台灣縣市 + 港澳 + 海外），僅供顯示與真太陽時提醒，不影響排盤計算 */

export const PLACE_GROUPS: { label: string; places: string[] }[] = [
  {
    label: "台灣",
    places: [
      "台北市", "新北市", "基隆市", "桃園市", "新竹市", "新竹縣", "苗栗縣",
      "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "台南市",
      "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣",
    ],
  },
  { label: "港澳", places: ["香港", "澳門"] },
  { label: "海外", places: ["其他海外地區"] },
];

export const PLACES: string[] = PLACE_GROUPS.flatMap((g) => g.places);

export const TRUE_SOLAR_NOTE =
  "傳統命理會依出生地經度換算「真太陽時」。本站以你輸入的當地時間直接排盤，若出生時間非常接近時辰交界（約單數整點前後），結果可能相差一個時辰，僅供參考。";
