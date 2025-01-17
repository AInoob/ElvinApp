interface DynastyColor {
  dynasty: string;
  pinyin: string;
  color: string;
  colorName: string;
  value: number;
}

export const DYNASTY_COLORS: DynastyColor[] = [
  {
    dynasty: "夏",
    pinyin: "Xia",
    color: "#9d2933",
    colorName: "胭脂",
    value: 2
  },
  {
    dynasty: "商",
    pinyin: "Shang",
    color: "#5d513c",
    colorName: "黎",
    value: 4
  },
  {
    dynasty: "周",
    pinyin: "Zhou",
    color: "#4c8dae",
    colorName: "群青",
    value: 8
  },
  {
    dynasty: "秦",
    pinyin: "Qin",
    color: "#5c1e19",
    colorName: "栗棕",
    value: 16
  },
  {
    dynasty: "汉",
    pinyin: "Han",
    color: "#62102e",
    colorName: "葡萄酒红",
    value: 32
  },
  {
    dynasty: "南北朝",
    pinyin: "NanBeiChao",
    color: "#789262",
    colorName: "竹青",
    value: 64
  },
  {
    dynasty: "隋",
    pinyin: "Sui",
    color: "#f7c242",
    colorName: "缃色",
    value: 128
  },
  {
    dynasty: "唐",
    pinyin: "Tang",
    color: "#f04b22",
    colorName: "大红",
    value: 256
  },
  {
    dynasty: "宋",
    pinyin: "Song",
    color: "#2b73af",
    colorName: "品蓝",
    value: 512
  },
  {
    dynasty: "元",
    pinyin: "Yuan",
    color: "#1a3b32",
    colorName: "深海绿",
    value: 1024
  },
  {
    dynasty: "明",
    pinyin: "Ming",
    color: "#f26b1f",
    colorName: "金黄",
    value: 2048
  },
  {
    dynasty: "清",
    pinyin: "Qing",
    color: "#2775b6",
    colorName: "景泰蓝",
    value: 4096
  },
  {
    dynasty: "华",
    pinyin: "Hua",
    color: "#c91f37",
    colorName: "国旗红",
    value: 8192
  }
];
