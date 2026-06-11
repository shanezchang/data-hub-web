// 中国地级行政区注册表(regions 内容线数据源)。
// query 字段 = 在新闻联播全文检索用的查询形态:
//   全国唯一且不易与常用词混淆的城市名用裸词(召回高);
//   有歧义的(重名区县/常用词/人名地标,如 中山/朝阳/通州/普洱/大同/阿里)用"<名>市"后缀(精度高)。
// 主编纪律:宁可标记过度(多用后缀)也不要污染数据。

export type City = { zh: string; pinyin: string; query: string };
export type Province = { slug: string; zh: string; en: string; cities: City[] };

export const PROVINCES: Province[] = [
  {
    slug: "beijing", zh: "北京", en: "Beijing",
    cities: [
      { zh: "北京", pinyin: "Beijing", query: "北京" },
    ],
  },
  {
    slug: "tianjin", zh: "天津", en: "Tianjin",
    cities: [
      { zh: "天津", pinyin: "Tianjin", query: "天津" },
    ],
  },
  {
    slug: "hebei", zh: "河北", en: "Hebei",
    cities: [
      { zh: "石家庄", pinyin: "Shijiazhuang", query: "石家庄" },
      { zh: "唐山", pinyin: "Tangshan", query: "唐山" },
      { zh: "秦皇岛", pinyin: "Qinhuangdao", query: "秦皇岛" },
      { zh: "邯郸", pinyin: "Handan", query: "邯郸" },
      { zh: "邢台", pinyin: "Xingtai", query: "邢台" },
      { zh: "保定", pinyin: "Baoding", query: "保定" },
      { zh: "张家口", pinyin: "Zhangjiakou", query: "张家口" },
      { zh: "承德", pinyin: "Chengde", query: "承德" },
      { zh: "沧州", pinyin: "Cangzhou", query: "沧州" },
      { zh: "廊坊", pinyin: "Langfang", query: "廊坊" },
      { zh: "衡水", pinyin: "Hengshui", query: "衡水" },
    ],
  },
  {
    slug: "shanxi", zh: "山西", en: "Shanxi",
    cities: [
      { zh: "太原", pinyin: "Taiyuan", query: "太原" },
      { zh: "大同", pinyin: "Datong", query: "大同市" }, // 常用词:天下大同/世界大同
      { zh: "阳泉", pinyin: "Yangquan", query: "阳泉" },
      { zh: "长治", pinyin: "Changzhi", query: "长治市" }, // 常用词:长治久安
      { zh: "晋城", pinyin: "Jincheng", query: "晋城" },
      { zh: "朔州", pinyin: "Shuozhou", query: "朔州" },
      { zh: "晋中", pinyin: "Jinzhong", query: "晋中" },
      { zh: "运城", pinyin: "Yuncheng", query: "运城" },
      { zh: "忻州", pinyin: "Xinzhou", query: "忻州" },
      { zh: "临汾", pinyin: "Linfen", query: "临汾" },
      { zh: "吕梁", pinyin: "Lüliang", query: "吕梁" },
    ],
  },
  {
    slug: "neimenggu", zh: "内蒙古", en: "Inner Mongolia",
    cities: [
      { zh: "呼和浩特", pinyin: "Hohhot", query: "呼和浩特" },
      { zh: "包头", pinyin: "Baotou", query: "包头" },
      { zh: "乌海", pinyin: "Wuhai", query: "乌海" },
      { zh: "赤峰", pinyin: "Chifeng", query: "赤峰" },
      { zh: "通辽", pinyin: "Tongliao", query: "通辽" },
      { zh: "鄂尔多斯", pinyin: "Ordos", query: "鄂尔多斯" },
      { zh: "呼伦贝尔", pinyin: "Hulunbuir", query: "呼伦贝尔" },
      { zh: "巴彦淖尔", pinyin: "Bayannur", query: "巴彦淖尔" },
      { zh: "乌兰察布", pinyin: "Ulanqab", query: "乌兰察布" },
      { zh: "兴安盟", pinyin: "Hinggan", query: "兴安盟" }, // 裸词"兴安"易混大兴安岭/兴安县,盟名整体使用
      { zh: "锡林郭勒", pinyin: "Xilingol", query: "锡林郭勒" },
      { zh: "阿拉善", pinyin: "Alxa", query: "阿拉善" },
    ],
  },
  {
    slug: "liaoning", zh: "辽宁", en: "Liaoning",
    cities: [
      { zh: "沈阳", pinyin: "Shenyang", query: "沈阳" },
      { zh: "大连", pinyin: "Dalian", query: "大连" },
      { zh: "鞍山", pinyin: "Anshan", query: "鞍山" },
      { zh: "抚顺", pinyin: "Fushun", query: "抚顺" },
      { zh: "本溪", pinyin: "Benxi", query: "本溪" },
      { zh: "丹东", pinyin: "Dandong", query: "丹东" },
      { zh: "锦州", pinyin: "Jinzhou", query: "锦州" },
      { zh: "营口", pinyin: "Yingkou", query: "营口" },
      { zh: "阜新", pinyin: "Fuxin", query: "阜新" },
      { zh: "辽阳", pinyin: "Liaoyang", query: "辽阳" },
      { zh: "盘锦", pinyin: "Panjin", query: "盘锦" },
      { zh: "铁岭", pinyin: "Tieling", query: "铁岭" },
      { zh: "朝阳", pinyin: "Chaoyang", query: "朝阳市" }, // 北京朝阳区/常用词"朝阳产业"
      { zh: "葫芦岛", pinyin: "Huludao", query: "葫芦岛" },
    ],
  },
  {
    slug: "jilin", zh: "吉林", en: "Jilin",
    cities: [
      { zh: "长春", pinyin: "Changchun", query: "长春" },
      { zh: "吉林", pinyin: "Jilin", query: "吉林市" }, // 与吉林省同名,必须带市
      { zh: "四平", pinyin: "Siping", query: "四平" },
      { zh: "辽源", pinyin: "Liaoyuan", query: "辽源" },
      { zh: "通化", pinyin: "Tonghua", query: "通化" },
      { zh: "白山", pinyin: "Baishan", query: "白山市" /* 长白山子串污染(实测裸词 101 条中 66 条来自长白山) */ },
      { zh: "松原", pinyin: "Songyuan", query: "松原" },
      { zh: "白城", pinyin: "Baicheng", query: "白城" },
      { zh: "延边", pinyin: "Yanbian", query: "延边" },
    ],
  },
  {
    slug: "heilongjiang", zh: "黑龙江", en: "Heilongjiang",
    cities: [
      { zh: "哈尔滨", pinyin: "Harbin", query: "哈尔滨" },
      { zh: "齐齐哈尔", pinyin: "Qiqihar", query: "齐齐哈尔" },
      { zh: "鸡西", pinyin: "Jixi", query: "鸡西" },
      { zh: "鹤岗", pinyin: "Hegang", query: "鹤岗" },
      { zh: "双鸭山", pinyin: "Shuangyashan", query: "双鸭山" },
      { zh: "大庆", pinyin: "Daqing", query: "大庆" },
      { zh: "伊春", pinyin: "Yichun", query: "伊春" },
      { zh: "佳木斯", pinyin: "Jiamusi", query: "佳木斯" },
      { zh: "七台河", pinyin: "Qitaihe", query: "七台河" },
      { zh: "牡丹江", pinyin: "Mudanjiang", query: "牡丹江" },
      { zh: "黑河", pinyin: "Heihe", query: "黑河市" }, // 甘肃/内蒙古黑河流域(河流)同名
      { zh: "绥化", pinyin: "Suihua", query: "绥化" },
      { zh: "大兴安岭", pinyin: "Daxing'anling", query: "大兴安岭地区" }, // 裸词指山脉,地区名整体使用
    ],
  },
  {
    slug: "shanghai", zh: "上海", en: "Shanghai",
    cities: [
      { zh: "上海", pinyin: "Shanghai", query: "上海" },
    ],
  },
  {
    slug: "jiangsu", zh: "江苏", en: "Jiangsu",
    cities: [
      { zh: "南京", pinyin: "Nanjing", query: "南京" },
      { zh: "无锡", pinyin: "Wuxi", query: "无锡" },
      { zh: "徐州", pinyin: "Xuzhou", query: "徐州" },
      { zh: "常州", pinyin: "Changzhou", query: "常州" },
      { zh: "苏州", pinyin: "Suzhou", query: "苏州" },
      { zh: "南通", pinyin: "Nantong", query: "南通" },
      { zh: "连云港", pinyin: "Lianyungang", query: "连云港" },
      { zh: "淮安", pinyin: "Huai'an", query: "淮安" },
      { zh: "盐城", pinyin: "Yancheng", query: "盐城" },
      { zh: "扬州", pinyin: "Yangzhou", query: "扬州" },
      { zh: "镇江", pinyin: "Zhenjiang", query: "镇江" },
      { zh: "泰州", pinyin: "Taizhou", query: "泰州" },
      { zh: "宿迁", pinyin: "Suqian", query: "宿迁" },
    ],
  },
  {
    slug: "zhejiang", zh: "浙江", en: "Zhejiang",
    cities: [
      { zh: "杭州", pinyin: "Hangzhou", query: "杭州" },
      { zh: "宁波", pinyin: "Ningbo", query: "宁波" },
      { zh: "温州", pinyin: "Wenzhou", query: "温州" },
      { zh: "嘉兴", pinyin: "Jiaxing", query: "嘉兴" },
      { zh: "湖州", pinyin: "Huzhou", query: "湖州" },
      { zh: "绍兴", pinyin: "Shaoxing", query: "绍兴" },
      { zh: "金华", pinyin: "Jinhua", query: "金华" },
      { zh: "衢州", pinyin: "Quzhou", query: "衢州" },
      { zh: "舟山", pinyin: "Zhoushan", query: "舟山" },
      { zh: "台州", pinyin: "Taizhou", query: "台州" },
      { zh: "丽水", pinyin: "Lishui", query: "丽水" },
    ],
  },
  {
    slug: "anhui", zh: "安徽", en: "Anhui",
    cities: [
      { zh: "合肥", pinyin: "Hefei", query: "合肥" },
      { zh: "芜湖", pinyin: "Wuhu", query: "芜湖" },
      { zh: "蚌埠", pinyin: "Bengbu", query: "蚌埠" },
      { zh: "淮南", pinyin: "Huainan", query: "淮南" },
      { zh: "马鞍山", pinyin: "Ma'anshan", query: "马鞍山" },
      { zh: "淮北", pinyin: "Huaibei", query: "淮北" },
      { zh: "铜陵", pinyin: "Tongling", query: "铜陵" },
      { zh: "安庆", pinyin: "Anqing", query: "安庆" },
      { zh: "黄山", pinyin: "Huangshan", query: "黄山市" }, // 黄山(山岳/景区)同名
      { zh: "滁州", pinyin: "Chuzhou", query: "滁州" },
      { zh: "阜阳", pinyin: "Fuyang", query: "阜阳" },
      { zh: "宿州", pinyin: "Suzhou", query: "宿州" },
      { zh: "六安", pinyin: "Lu'an", query: "六安" },
      { zh: "亳州", pinyin: "Bozhou", query: "亳州" },
      { zh: "池州", pinyin: "Chizhou", query: "池州" },
      { zh: "宣城", pinyin: "Xuancheng", query: "宣城" },
    ],
  },
  {
    slug: "fujian", zh: "福建", en: "Fujian",
    cities: [
      { zh: "福州", pinyin: "Fuzhou", query: "福州" },
      { zh: "厦门", pinyin: "Xiamen", query: "厦门" },
      { zh: "莆田", pinyin: "Putian", query: "莆田" },
      { zh: "三明", pinyin: "Sanming", query: "三明" },
      { zh: "泉州", pinyin: "Quanzhou", query: "泉州" },
      { zh: "漳州", pinyin: "Zhangzhou", query: "漳州" },
      { zh: "南平", pinyin: "Nanping", query: "南平" },
      { zh: "龙岩", pinyin: "Longyan", query: "龙岩" },
      { zh: "宁德", pinyin: "Ningde", query: "宁德市" }, // 宁德时代(CATL)品牌混淆
    ],
  },
  {
    slug: "jiangxi", zh: "江西", en: "Jiangxi",
    cities: [
      { zh: "南昌", pinyin: "Nanchang", query: "南昌" },
      { zh: "景德镇", pinyin: "Jingdezhen", query: "景德镇" },
      { zh: "萍乡", pinyin: "Pingxiang", query: "萍乡" },
      { zh: "九江", pinyin: "Jiujiang", query: "九江" },
      { zh: "新余", pinyin: "Xinyu", query: "新余" },
      { zh: "鹰潭", pinyin: "Yingtan", query: "鹰潭" },
      { zh: "赣州", pinyin: "Ganzhou", query: "赣州" },
      { zh: "吉安", pinyin: "Ji'an", query: "吉安" },
      { zh: "宜春", pinyin: "Yichun", query: "宜春" },
      { zh: "抚州", pinyin: "Fuzhou", query: "抚州" },
      { zh: "上饶", pinyin: "Shangrao", query: "上饶" },
    ],
  },
  {
    slug: "shandong", zh: "山东", en: "Shandong",
    cities: [
      { zh: "济南", pinyin: "Jinan", query: "济南" },
      { zh: "青岛", pinyin: "Qingdao", query: "青岛" },
      { zh: "淄博", pinyin: "Zibo", query: "淄博" },
      { zh: "枣庄", pinyin: "Zaozhuang", query: "枣庄" },
      { zh: "东营", pinyin: "Dongying", query: "东营" },
      { zh: "烟台", pinyin: "Yantai", query: "烟台" },
      { zh: "潍坊", pinyin: "Weifang", query: "潍坊" },
      { zh: "济宁", pinyin: "Jining", query: "济宁" },
      { zh: "泰安", pinyin: "Tai'an", query: "泰安" },
      { zh: "威海", pinyin: "Weihai", query: "威海" },
      { zh: "日照", pinyin: "Rizhao", query: "日照市" }, // 常用词:日照时数/阳光日照
      { zh: "临沂", pinyin: "Linyi", query: "临沂" },
      { zh: "德州", pinyin: "Dezhou", query: "德州市" }, // 美国得州常写作德州/德州扑克
      { zh: "聊城", pinyin: "Liaocheng", query: "聊城" },
      { zh: "滨州", pinyin: "Binzhou", query: "滨州" },
      { zh: "菏泽", pinyin: "Heze", query: "菏泽" },
    ],
  },
  {
    slug: "henan", zh: "河南", en: "Henan",
    cities: [
      { zh: "郑州", pinyin: "Zhengzhou", query: "郑州" },
      { zh: "开封", pinyin: "Kaifeng", query: "开封" },
      { zh: "洛阳", pinyin: "Luoyang", query: "洛阳" },
      { zh: "平顶山", pinyin: "Pingdingshan", query: "平顶山" },
      { zh: "安阳", pinyin: "Anyang", query: "安阳" },
      { zh: "鹤壁", pinyin: "Hebi", query: "鹤壁" },
      { zh: "新乡", pinyin: "Xinxiang", query: "新乡" },
      { zh: "焦作", pinyin: "Jiaozuo", query: "焦作" },
      { zh: "濮阳", pinyin: "Puyang", query: "濮阳" },
      { zh: "许昌", pinyin: "Xuchang", query: "许昌" },
      { zh: "漯河", pinyin: "Luohe", query: "漯河" },
      { zh: "三门峡", pinyin: "Sanmenxia", query: "三门峡" },
      { zh: "南阳", pinyin: "Nanyang", query: "南阳" },
      { zh: "商丘", pinyin: "Shangqiu", query: "商丘" },
      { zh: "信阳", pinyin: "Xinyang", query: "信阳" },
      { zh: "周口", pinyin: "Zhoukou", query: "周口" },
      { zh: "驻马店", pinyin: "Zhumadian", query: "驻马店" },
    ],
  },
  {
    slug: "hubei", zh: "湖北", en: "Hubei",
    cities: [
      { zh: "武汉", pinyin: "Wuhan", query: "武汉" },
      { zh: "黄石", pinyin: "Huangshi", query: "黄石市" }, // 美国黄石公园同名
      { zh: "十堰", pinyin: "Shiyan", query: "十堰" },
      { zh: "宜昌", pinyin: "Yichang", query: "宜昌" },
      { zh: "襄阳", pinyin: "Xiangyang", query: "襄阳" },
      { zh: "鄂州", pinyin: "Ezhou", query: "鄂州" },
      { zh: "荆门", pinyin: "Jingmen", query: "荆门" },
      { zh: "孝感", pinyin: "Xiaogan", query: "孝感" },
      { zh: "荆州", pinyin: "Jingzhou", query: "荆州" },
      { zh: "黄冈", pinyin: "Huanggang", query: "黄冈" },
      { zh: "咸宁", pinyin: "Xianning", query: "咸宁" },
      { zh: "随州", pinyin: "Suizhou", query: "随州" },
      { zh: "恩施", pinyin: "Enshi", query: "恩施" },
    ],
  },
  {
    slug: "hunan", zh: "湖南", en: "Hunan",
    cities: [
      { zh: "长沙", pinyin: "Changsha", query: "长沙" },
      { zh: "株洲", pinyin: "Zhuzhou", query: "株洲" },
      { zh: "湘潭", pinyin: "Xiangtan", query: "湘潭" },
      { zh: "衡阳", pinyin: "Hengyang", query: "衡阳" },
      { zh: "邵阳", pinyin: "Shaoyang", query: "邵阳" },
      { zh: "岳阳", pinyin: "Yueyang", query: "岳阳" },
      { zh: "常德", pinyin: "Changde", query: "常德" },
      { zh: "张家界", pinyin: "Zhangjiajie", query: "张家界" },
      { zh: "益阳", pinyin: "Yiyang", query: "益阳" },
      { zh: "郴州", pinyin: "Chenzhou", query: "郴州" },
      { zh: "永州", pinyin: "Yongzhou", query: "永州" },
      { zh: "怀化", pinyin: "Huaihua", query: "怀化" },
      { zh: "娄底", pinyin: "Loudi", query: "娄底" },
      { zh: "湘西", pinyin: "Xiangxi", query: "湘西州" }, // 裸词泛指湘西地域(含张家界/怀化)
    ],
  },
  {
    slug: "guangdong", zh: "广东", en: "Guangdong",
    cities: [
      { zh: "广州", pinyin: "Guangzhou", query: "广州" },
      { zh: "韶关", pinyin: "Shaoguan", query: "韶关" },
      { zh: "深圳", pinyin: "Shenzhen", query: "深圳" },
      { zh: "珠海", pinyin: "Zhuhai", query: "珠海" },
      { zh: "汕头", pinyin: "Shantou", query: "汕头" },
      { zh: "佛山", pinyin: "Foshan", query: "佛山" },
      { zh: "江门", pinyin: "Jiangmen", query: "江门" },
      { zh: "湛江", pinyin: "Zhanjiang", query: "湛江" },
      { zh: "茂名", pinyin: "Maoming", query: "茂名" },
      { zh: "肇庆", pinyin: "Zhaoqing", query: "肇庆" },
      { zh: "惠州", pinyin: "Huizhou", query: "惠州" },
      { zh: "梅州", pinyin: "Meizhou", query: "梅州" },
      { zh: "汕尾", pinyin: "Shanwei", query: "汕尾" },
      { zh: "河源", pinyin: "Heyuan", query: "河源市" }, // 常用词:江河源头/河源区(泛指)
      { zh: "阳江", pinyin: "Yangjiang", query: "阳江" },
      { zh: "清远", pinyin: "Qingyuan", query: "清远" },
      { zh: "东莞", pinyin: "Dongguan", query: "东莞" },
      { zh: "中山", pinyin: "Zhongshan", query: "中山市" }, // 孙中山/中山路/中山大学
      { zh: "潮州", pinyin: "Chaozhou", query: "潮州" },
      { zh: "揭阳", pinyin: "Jieyang", query: "揭阳" },
      { zh: "云浮", pinyin: "Yunfu", query: "云浮" },
    ],
  },
  {
    slug: "guangxi", zh: "广西", en: "Guangxi",
    cities: [
      { zh: "南宁", pinyin: "Nanning", query: "南宁" },
      { zh: "柳州", pinyin: "Liuzhou", query: "柳州" },
      { zh: "桂林", pinyin: "Guilin", query: "桂林" },
      { zh: "梧州", pinyin: "Wuzhou", query: "梧州" },
      { zh: "北海", pinyin: "Beihai", query: "北海市" }, // 北京北海公园/欧洲北海
      { zh: "防城港", pinyin: "Fangchenggang", query: "防城港" },
      { zh: "钦州", pinyin: "Qinzhou", query: "钦州" },
      { zh: "贵港", pinyin: "Guigang", query: "贵港" },
      { zh: "玉林", pinyin: "Yulin", query: "玉林市" }, // 成都玉林路/玉林街道等重名
      { zh: "百色", pinyin: "Baise", query: "百色" },
      { zh: "贺州", pinyin: "Hezhou", query: "贺州" },
      { zh: "河池", pinyin: "Hechi", query: "河池" },
      { zh: "来宾", pinyin: "Laibin", query: "来宾市" }, // 常用词:出席活动的"来宾"
      { zh: "崇左", pinyin: "Chongzuo", query: "崇左" },
    ],
  },
  {
    slug: "hainan", zh: "海南", en: "Hainan",
    cities: [
      { zh: "海口", pinyin: "Haikou", query: "海口" },
      { zh: "三亚", pinyin: "Sanya", query: "三亚" },
      { zh: "三沙", pinyin: "Sansha", query: "三沙" },
      { zh: "儋州", pinyin: "Danzhou", query: "儋州" },
    ],
  },
  {
    slug: "chongqing", zh: "重庆", en: "Chongqing",
    cities: [
      { zh: "重庆", pinyin: "Chongqing", query: "重庆" },
    ],
  },
  {
    slug: "sichuan", zh: "四川", en: "Sichuan",
    cities: [
      { zh: "成都", pinyin: "Chengdu", query: "成都" },
      { zh: "自贡", pinyin: "Zigong", query: "自贡" },
      { zh: "攀枝花", pinyin: "Panzhihua", query: "攀枝花" },
      { zh: "泸州", pinyin: "Luzhou", query: "泸州" },
      { zh: "德阳", pinyin: "Deyang", query: "德阳" },
      { zh: "绵阳", pinyin: "Mianyang", query: "绵阳" },
      { zh: "广元", pinyin: "Guangyuan", query: "广元" },
      { zh: "遂宁", pinyin: "Suining", query: "遂宁" },
      { zh: "内江", pinyin: "Neijiang", query: "内江" },
      { zh: "乐山", pinyin: "Leshan", query: "乐山" },
      { zh: "南充", pinyin: "Nanchong", query: "南充" },
      { zh: "眉山", pinyin: "Meishan", query: "眉山" },
      { zh: "宜宾", pinyin: "Yibin", query: "宜宾" },
      { zh: "广安", pinyin: "Guang'an", query: "广安" },
      { zh: "达州", pinyin: "Dazhou", query: "达州市" /* 佛罗里达州/内华达州 音译子串污染(实测裸词 374 条中 227 条来自佛罗里达州) */ },
      { zh: "雅安", pinyin: "Ya'an", query: "雅安" },
      { zh: "巴中", pinyin: "Bazhong", query: "巴中市" }, // 双边缩写:巴中(巴西-中国/巴基斯坦-中国)
      { zh: "资阳", pinyin: "Ziyang", query: "资阳" },
      { zh: "阿坝", pinyin: "Aba", query: "阿坝" },
      { zh: "甘孜", pinyin: "Garzê", query: "甘孜" },
      { zh: "凉山", pinyin: "Liangshan", query: "凉山" },
    ],
  },
  {
    slug: "guizhou", zh: "贵州", en: "Guizhou",
    cities: [
      { zh: "贵阳", pinyin: "Guiyang", query: "贵阳" },
      { zh: "六盘水", pinyin: "Liupanshui", query: "六盘水" },
      { zh: "遵义", pinyin: "Zunyi", query: "遵义" },
      { zh: "安顺", pinyin: "Anshun", query: "安顺" },
      { zh: "毕节", pinyin: "Bijie", query: "毕节" },
      { zh: "铜仁", pinyin: "Tongren", query: "铜仁" },
      { zh: "黔西南", pinyin: "Qianxinan", query: "黔西南" },
      { zh: "黔东南", pinyin: "Qiandongnan", query: "黔东南" },
      { zh: "黔南", pinyin: "Qiannan", query: "黔南" },
    ],
  },
  {
    slug: "yunnan", zh: "云南", en: "Yunnan",
    cities: [
      { zh: "昆明", pinyin: "Kunming", query: "昆明" },
      { zh: "曲靖", pinyin: "Qujing", query: "曲靖" },
      { zh: "玉溪", pinyin: "Yuxi", query: "玉溪" },
      { zh: "保山", pinyin: "Baoshan", query: "保山" },
      { zh: "昭通", pinyin: "Zhaotong", query: "昭通" },
      { zh: "丽江", pinyin: "Lijiang", query: "丽江" },
      { zh: "普洱", pinyin: "Pu'er", query: "普洱市" }, // 普洱茶混淆
      { zh: "临沧", pinyin: "Lincang", query: "临沧" },
      { zh: "楚雄", pinyin: "Chuxiong", query: "楚雄" },
      { zh: "红河", pinyin: "Honghe", query: "红河州" }, // 红河(河流)同名
      { zh: "文山", pinyin: "Wenshan", query: "文山州" }, // 常用词:文山会海
      { zh: "西双版纳", pinyin: "Xishuangbanna", query: "西双版纳" },
      { zh: "大理", pinyin: "Dali", query: "大理州" }, // 子串混淆:大理石
      { zh: "德宏", pinyin: "Dehong", query: "德宏" },
      { zh: "怒江", pinyin: "Nujiang", query: "怒江州" }, // 怒江(河流)同名
      { zh: "迪庆", pinyin: "Diqing", query: "迪庆" },
    ],
  },
  {
    slug: "xizang", zh: "西藏", en: "Tibet",
    cities: [
      { zh: "拉萨", pinyin: "Lhasa", query: "拉萨" },
      { zh: "日喀则", pinyin: "Shigatse", query: "日喀则" },
      { zh: "昌都", pinyin: "Qamdo", query: "昌都" },
      { zh: "林芝", pinyin: "Nyingchi", query: "林芝" },
      { zh: "山南", pinyin: "Shannan", query: "山南市" }, // 泛方位词:山南/山北
      { zh: "那曲", pinyin: "Nagqu", query: "那曲" },
      { zh: "阿里", pinyin: "Ngari", query: "阿里地区" }, // 阿里巴巴品牌混淆
    ],
  },
  {
    slug: "shaanxi", zh: "陕西", en: "Shaanxi",
    cities: [
      { zh: "西安", pinyin: "Xi'an", query: "西安" },
      { zh: "铜川", pinyin: "Tongchuan", query: "铜川" },
      { zh: "宝鸡", pinyin: "Baoji", query: "宝鸡" },
      { zh: "咸阳", pinyin: "Xianyang", query: "咸阳" },
      { zh: "渭南", pinyin: "Weinan", query: "渭南" },
      { zh: "延安", pinyin: "Yan'an", query: "延安" },
      { zh: "汉中", pinyin: "Hanzhong", query: "汉中" },
      { zh: "榆林", pinyin: "Yulin", query: "榆林" },
      { zh: "安康", pinyin: "Ankang", query: "安康市" }, // 常用词:幸福安康
      { zh: "商洛", pinyin: "Shangluo", query: "商洛" },
    ],
  },
  {
    slug: "gansu", zh: "甘肃", en: "Gansu",
    cities: [
      { zh: "兰州", pinyin: "Lanzhou", query: "兰州" },
      { zh: "嘉峪关", pinyin: "Jiayuguan", query: "嘉峪关" },
      { zh: "金昌", pinyin: "Jinchang", query: "金昌" },
      { zh: "白银", pinyin: "Baiyin", query: "白银市" }, // 常用词:白银(贵金属)
      { zh: "天水", pinyin: "Tianshui", query: "天水" },
      { zh: "武威", pinyin: "Wuwei", query: "武威" },
      { zh: "张掖", pinyin: "Zhangye", query: "张掖" },
      { zh: "平凉", pinyin: "Pingliang", query: "平凉" },
      { zh: "酒泉", pinyin: "Jiuquan", query: "酒泉" },
      { zh: "庆阳", pinyin: "Qingyang", query: "庆阳" },
      { zh: "定西", pinyin: "Dingxi", query: "定西" },
      { zh: "陇南", pinyin: "Longnan", query: "陇南" },
      { zh: "临夏", pinyin: "Linxia", query: "临夏" },
      { zh: "甘南", pinyin: "Gannan", query: "甘南州" }, // 黑龙江有甘南县(齐齐哈尔)
    ],
  },
  {
    slug: "qinghai", zh: "青海", en: "Qinghai",
    cities: [
      { zh: "西宁", pinyin: "Xining", query: "西宁" },
      { zh: "海东", pinyin: "Haidong", query: "海东市" }, // 泛方位词,知名度低易混
      { zh: "海北", pinyin: "Haibei", query: "海北州" }, // 泛方位词
      { zh: "黄南", pinyin: "Huangnan", query: "黄南" },
      { zh: "海南", pinyin: "Hainan", query: "海南州" }, // 与海南省同名,必须带州
      { zh: "果洛", pinyin: "Golog", query: "果洛" },
      { zh: "玉树", pinyin: "Yushu", query: "玉树州" }, // 常用词:玉树临风/玉树(植物)
      { zh: "海西", pinyin: "Haixi", query: "海西州" }, // 海西经济区(海峡西岸)同名
    ],
  },
  {
    slug: "ningxia", zh: "宁夏", en: "Ningxia",
    cities: [
      { zh: "银川", pinyin: "Yinchuan", query: "银川" },
      { zh: "石嘴山", pinyin: "Shizuishan", query: "石嘴山" },
      { zh: "吴忠", pinyin: "Wuzhong", query: "吴忠市" }, // 常见人名形态
      { zh: "固原", pinyin: "Guyuan", query: "固原" },
      { zh: "中卫", pinyin: "Zhongwei", query: "中卫市" }, // 常用词:中卫(足球位置)
    ],
  },
  {
    slug: "xinjiang", zh: "新疆", en: "Xinjiang",
    cities: [
      { zh: "乌鲁木齐", pinyin: "Urumqi", query: "乌鲁木齐" },
      { zh: "克拉玛依", pinyin: "Karamay", query: "克拉玛依" },
      { zh: "吐鲁番", pinyin: "Turpan", query: "吐鲁番" },
      { zh: "哈密", pinyin: "Hami", query: "哈密市" }, // 子串混淆:哈密瓜
      { zh: "昌吉", pinyin: "Changji", query: "昌吉" },
      { zh: "博尔塔拉", pinyin: "Bortala", query: "博尔塔拉" },
      { zh: "巴音郭楞", pinyin: "Bayingolin", query: "巴音郭楞" },
      { zh: "阿克苏", pinyin: "Aksu", query: "阿克苏" },
      { zh: "克孜勒苏", pinyin: "Kizilsu", query: "克孜勒苏" },
      { zh: "喀什", pinyin: "Kashgar", query: "喀什" },
      { zh: "和田", pinyin: "Hotan", query: "和田地区" }, // 子串混淆:和田玉
      { zh: "伊犁", pinyin: "Ili", query: "伊犁" },
      { zh: "塔城", pinyin: "Tacheng", query: "塔城" },
      { zh: "阿勒泰", pinyin: "Altay", query: "阿勒泰" },
    ],
  },
];
