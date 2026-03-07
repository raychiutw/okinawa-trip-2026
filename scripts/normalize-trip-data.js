#!/usr/bin/env node
// normalize-trip-data.js — Normalize all trip JSON data for round-trip consistency
var fs = require('fs');
var path = require('path');

var tripsDir = path.join(__dirname, '..', 'data', 'trips');
var files = fs.readdirSync(tripsDir).filter(function(f) { return f.endsWith('.json'); });

// ─── 繁→簡中對照表（常用字） ───

var t2s = '萬萬與與書書來來個個備備傳傳億億優優兒兒內內兩兩冊冊幾幾凱凱則則劃劃動動務務勝勝區區協協單單佔佔卻卻廠廠歷歷壓壓縣縣參參叢叢變變號號問問園園國國圍圍圖圖團團場場塊塊報報處處備備複複夠夠夢夢體體將將專專導導層層屬屬島島嶺嶺帶帶師師歸歸廳廳張張強強歸歸從從戰戰無無時時書書會會條條極極構構標標機機決決準準滅滅滿滿漢漢點點無無熱熱營營環環現現產產畫畫當當發發節節經經線線練練結結統統網網總總館館國國際際電電類類關關離離難難雜雜領領體體魚魚點點齊齊齡齡龍龍龜龜車車軍軍較較輪輪輸輸辦辦農農運運過過進進還還達達選選適適遠遠鄉鄉際際華華藝藝衛衛裝裝覺覺親親觀觀話話語語說說課課論論識識護護變變讓讓豐豐質質資資賓賓賞賞辦辦邊邊陽陽險險飛飛馬馬駐駐驗驗積積鋼鋼錢錢錯錯鋪鋪銀銀鏡鏡門門開開間間閱閱隊隊費費賣賣買買實實寶寶圖圖報報塊塊場場壇壇廣廣歡歡雞雞頁頁響響幣幣壽壽義義獎獎減減溫溫計計記記設設許許評評詞詞試試話話認認誰誰課課調調論論講講證證識識議議豐豐賽賽趙趙躍躍邊邊遲遲鑰鑰陳陳陸陸隱隱電電面面項項預預願願風風駕駕確確礎礎築築驚驚顧顧顯顯養養餅餅餐餐餘餘麗麗齊齊齒齒鎮鎮門門閃閃樓樓櫃櫃歲歲殺殺濟濟開開關關鑰鑰鄰鄰險險際際雞雞雙雙離離靈靈靜靜響響頁頁順順須須預預頭頭題題願願類類飯飯飲飲館館驗驗骨骨醬醬釣釣鉄鉄鐵鐵銭銭舊舊藥藥虛虛豬豬貓貓獨獨燒燒營營爐爐燈燈滬滬檜檜濱濱櫻櫻歐歐潔潔滄滄漁漁潛潛選選達達際際雲雲電電雜雜壽壽對對導導屬屬嶼嶼帶帶廠廠廟廟廢廢廣廣廳廳彈彈從從復復態態愛愛應應懷懷慶慶擁擁擔擔據據損損搶搶撐撐撥撥擇擇擊擊擺擺擾擾攝攝攻攻斷斷會會楊楊極極概概構構標標樹樹機機權權條條東東歸歸決決準準減減溫溫滿滿漢漢點點煙煙無無燈燈營營環環現現產產畫畫當當發發節節經經線線練練結結統統網網總總飛飛馬馬駐駐驗驗';

var trad2simp = {};
for (var i = 0; i < t2s.length; i += 2) {
  trad2simp[t2s[i]] = t2s[i + 1];
}

// More complete mapping for common trip-related characters
var extraMap = {
  '國': '国', '際': '际', '機': '机', '場': '场', '車': '车', '站': '站',
  '點': '点', '區': '区', '門': '门', '開': '开', '關': '关', '電': '电',
  '話': '话', '號': '号', '線': '线', '鐵': '铁', '橋': '桥', '路': '路',
  '廳': '厅', '館': '馆', '樓': '楼', '園': '园', '島': '岛', '灣': '湾',
  '港': '港', '城': '城', '市': '市', '廣': '广', '東': '东', '西': '西',
  '南': '南', '北': '北', '里': '里', '堂': '堂', '寺': '寺', '神': '神',
  '社': '社', '宮': '宫', '殿': '殿', '閣': '阁', '樹': '树', '花': '花',
  '魚': '鱼', '雞': '鸡', '豬': '猪', '牛': '牛', '肉': '肉', '麵': '面',
  '飯': '饭', '餐': '餐', '廚': '厨', '燒': '烧', '烤': '烤', '煮': '煮',
  '醬': '酱', '湯': '汤', '餅': '饼', '糕': '糕', '糖': '糖', '鹽': '盐',
  '醋': '醋', '酒': '酒', '茶': '茶', '飲': '饮', '藥': '药', '醫': '医',
  '院': '院', '學': '学', '書': '书', '圖': '图', '報': '报', '經': '经',
  '濟': '济', '貿': '贸', '營': '营', '業': '业', '產': '产', '質': '质',
  '資': '资', '賣': '卖', '買': '买', '價': '价', '費': '费', '錢': '钱',
  '銀': '银', '幣': '币', '華': '华', '龍': '龙', '鳳': '凤', '獅': '狮',
  '馬': '马', '風': '风', '雲': '云', '雪': '雪', '霧': '雾', '陽': '阳',
  '陰': '阴', '溫': '温', '熱': '热', '涼': '凉', '凍': '冻', '冰': '冰',
  '歷': '历', '曆': '历', '歲': '岁', '齡': '龄', '壽': '寿', '長': '长',
  '舊': '旧', '舊': '旧', '傳': '传', '統': '统', '體': '体', '裝': '装',
  '備': '备', '設': '设', '計': '计', '記': '记', '認': '认', '識': '识',
  '語': '语', '說': '说', '讀': '读', '寫': '写', '畫': '画', '遊': '游',
  '運': '运', '動': '动', '練': '练', '賽': '赛', '獎': '奖', '處': '处',
  '辦': '办', '總': '总', '經': '经', '過': '过', '選': '选', '達': '达',
  '進': '进', '還': '还', '適': '适', '遠': '远', '連': '连', '隊': '队',
  '離': '离', '難': '难', '雜': '杂', '類': '类', '飛': '飞', '駕': '驾',
  '確': '确', '預': '预', '願': '愿', '頭': '头', '題': '题', '顯': '显',
  '養': '养', '對': '对', '導': '导', '將': '将', '層': '层', '專': '专',
  '戰': '战', '單': '单', '從': '从', '強': '强', '歸': '归', '復': '复',
  '應': '应', '愛': '爱', '慶': '庆', '會': '会', '條': '条', '極': '极',
  '構': '构', '標': '标', '決': '决', '準': '准', '減': '减', '滿': '满',
  '漢': '汉', '無': '无', '環': '环', '現': '现', '當': '当', '發': '发',
  '節': '节', '結': '结', '網': '网', '衛': '卫', '覺': '觉', '親': '亲',
  '觀': '观', '護': '护', '變': '变', '讓': '让', '豐': '丰', '賞': '赏',
  '邊': '边', '險': '险', '積': '积', '鋼': '钢', '錯': '错', '鋪': '铺',
  '鏡': '镜', '間': '间', '閱': '阅', '實': '实', '寶': '宝', '壇': '坛',
  '歡': '欢', '頁': '页', '響': '响', '義': '义', '溪': '溪', '嶺': '岭',
  '嶼': '屿', '帶': '带', '師': '师', '廠': '厂', '廟': '庙', '彈': '弹',
  '態': '态', '懷': '怀', '擔': '担', '據': '据', '損': '损', '擇': '择',
  '擊': '击', '攝': '摄', '斷': '断', '楊': '杨', '概': '概', '權': '权',
  '歐': '欧', '潔': '洁', '漁': '渔', '潛': '潜', '濱': '滨', '櫻': '樱',
  '檜': '桧', '滬': '沪', '煙': '烟', '壓': '压', '縣': '县', '參': '参',
  '億': '亿', '優': '优', '兒': '儿', '內': '内', '兩': '两', '冊': '册',
  '幾': '几', '劃': '划', '務': '务', '勝': '胜', '協': '协', '佔': '占',
  '卻': '却', '歷': '历', '複': '复', '夠': '够', '夢': '梦', '張': '张',
  '廢': '废', '擁': '拥', '搶': '抢', '撐': '撑', '撥': '拨', '擺': '摆',
  '擾': '扰', '攻': '攻', '櫃': '柜', '殺': '杀', '雙': '双', '靈': '灵',
  '靜': '静', '順': '顺', '須': '须', '骨': '骨', '釣': '钓', '獨': '独',
  '爐': '炉', '燈': '灯', '滄': '沧', '鎮': '镇', '閃': '闪', '鄰': '邻',
  '貓': '猫', '虛': '虚', '驚': '惊', '顧': '顾', '餘': '余', '麗': '丽',
  '齊': '齐', '齒': '齿', '鑰': '钥', '陳': '陈', '陸': '陆', '隱': '隐',
  '面': '面', '項': '项', '駐': '驻', '礎': '础', '築': '筑', '趙': '赵',
  '躍': '跃', '遲': '迟', '議': '议', '調': '调', '講': '讲', '證': '证',
  '論': '论', '詞': '词', '試': '试', '評': '评', '許': '许', '課': '课',
  '誰': '谁', '賓': '宾', '個': '个', '傑': '杰', '塊': '块', '壞': '坏',
  '嗎': '吗', '圍': '围', '團': '团', '墳': '坟', '壯': '壮', '夾': '夹',
  '嬰': '婴', '屆': '届', '嶽': '岳', '幹': '干', '廈': '厦', '後': '后',
  '徑': '径', '從': '从', '復': '复', '憶': '忆', '戲': '戏', '數': '数',
  '條': '条', '棗': '枣', '檔': '档', '歲': '岁', '歸': '归', '氣': '气',
  '決': '决', '沒': '没', '瀋': '沈', '灣': '湾', '爺': '爷', '犧': '牺',
  '獻': '献', '瑣': '琐', '畝': '亩', '當': '当', '碼': '码', '禮': '礼',
  '稱': '称', '穩': '稳', '窮': '穷', '競': '竞', '範': '范', '築': '筑',
  '紀': '纪', '約': '约', '紅': '红', '純': '纯', '紙': '纸', '納': '纳',
  '織': '织', '繪': '绘', '繳': '缴', '繼': '继', '績': '绩', '繩': '绳',
  '縮': '缩', '總': '总', '聖': '圣', '聞': '闻', '聯': '联', '聰': '聪',
  '職': '职', '與': '与', '興': '兴', '舉': '举', '舊': '旧', '艦': '舰',
  '藝': '艺', '蘇': '苏', '蘭': '兰', '處': '处', '號': '号', '補': '补',
  '製': '制', '複': '复', '規': '规', '視': '视', '覽': '览', '訂': '订',
  '詢': '询', '詩': '诗', '詳': '详', '誠': '诚', '誤': '误', '請': '请',
  '諸': '诸', '謝': '谢', '譯': '译', '貨': '货', '販': '贩', '貴': '贵',
  '購': '购', '贈': '赠', '軍': '军', '較': '较', '輕': '轻', '輛': '辆',
  '輝': '辉', '輪': '轮', '輸': '输', '轉': '转', '農': '农', '遼': '辽',
  '鄭': '郑', '鄰': '邻', '醫': '医', '釋': '释', '鈴': '铃', '銅': '铜',
  '鍋': '锅', '鍵': '键', '鎖': '锁', '鑑': '鉴', '閉': '闭', '閒': '闲',
  '陰': '阴', '陵': '陵', '隨': '随', '雕': '雕', '頓': '顿', '額': '额',
  '顏': '颜', '駛': '驶', '騎': '骑', '驅': '驱', '體': '体', '髮': '发',
  '鬥': '斗', '鬧': '闹', '鮮': '鲜', '鯨': '鲸', '鳥': '鸟', '鶴': '鹤',
  '黃': '黄', '黑': '黑', '點': '点', '齋': '斋'
};

Object.keys(extraMap).forEach(function(k) {
  trad2simp[k] = extraMap[k];
});

function toSimplified(str) {
  return str.split('').map(function(ch) {
    return trad2simp[ch] || ch;
  }).join('');
}

// ─── URL helpers ───

function extractQueryFromUrl(url) {
  if (!url) return '';
  // Format: https://www.google.com/maps/search/<query>
  var m1 = url.match(/^https:\/\/www\.google\.com\/maps\/search\/(.+)$/);
  if (m1) return decodeURIComponent(m1[1].replace(/\+/g, ' '));
  // Format: https://maps.google.com/?q=<query>
  var m2 = url.match(/[?&]q=([^&]+)/);
  if (m2) return decodeURIComponent(m2[1].replace(/\+/g, ' '));
  // Format: https://maps.apple.com/?q=<query>
  // (same pattern as above)
  // Format: https://map.naver.com/v5/search/<query>
  var m3 = url.match(/^https:\/\/map\.naver\.com\/v5\/search\/(.+)$/);
  if (m3) return decodeURIComponent(m3[1].replace(/\+/g, ' '));
  return '';
}

function percentEncode(str) {
  // Encode everything except unreserved chars (RFC 3986)
  return encodeURIComponent(str).replace(/%20/g, '+');
}

function normalizeGoogleUrl(url) {
  if (!url) return url;
  var q = extractQueryFromUrl(url);
  if (!q) return url;
  return 'https://www.google.com/maps/search/' + percentEncode(q);
}

function normalizeAppleUrl(url) {
  if (!url) return url;
  var q = extractQueryFromUrl(url);
  if (!q) return url;
  return 'https://maps.apple.com/?q=' + percentEncode(q);
}

function normalizeNaverUrl(url) {
  if (!url) return url;
  var q = extractQueryFromUrl(url);
  if (!q) return url;
  var simplified = toSimplified(q);
  return 'https://map.naver.com/v5/search/' + percentEncode(simplified);
}

function normalizeLocation(loc) {
  if (!loc) return;
  if (loc.googleQuery) loc.googleQuery = normalizeGoogleUrl(loc.googleQuery);
  if (loc.appleQuery) loc.appleQuery = normalizeAppleUrl(loc.appleQuery);
  if (loc.naverQuery) loc.naverQuery = normalizeNaverUrl(loc.naverQuery);
}

// ─── Deep traversal ───

function traverseLocations(obj) {
  if (!obj) return;
  if (Array.isArray(obj)) {
    obj.forEach(traverseLocations);
    return;
  }
  if (typeof obj !== 'object') return;

  if (obj.googleQuery !== undefined || obj.appleQuery !== undefined || obj.naverQuery !== undefined) {
    normalizeLocation(obj);
  }

  Object.keys(obj).forEach(function(k) {
    traverseLocations(obj[k]);
  });
}

// ─── Emergency normalization ───

function extractPhone(str) {
  // Match phone patterns: +XX-X-XXXX-XXXX, XXX-XXX-XXXX, NNN short codes
  var m = str.match(/(\+?\d[\d\-]{2,}\d|\d{3,})/);
  return m ? m[0] : null;
}

function phoneToTel(phone) {
  return 'tel:' + phone.replace(/[\s\-()]/g, '');
}

function digitCount(str) {
  return (str.match(/\d/g) || []).length;
}

function parseContactFromString(str) {
  var parts = str.split(/[：:]/);
  if (parts.length >= 2) {
    var label = parts[0].trim();
    var rest = parts.slice(1).join('：').trim();
    var phone = extractPhone(rest);
    if (phone) {
      return { label: label, phone: phone, url: phoneToTel(phone) };
    }
  }
  return null;
}

function parseContactFromDash(str) {
  var parts = str.split(' — ');
  if (parts.length >= 2) {
    var right = parts.slice(1).join(' — ').trim();
    var phone = extractPhone(right);
    if (phone && digitCount(phone) >= 7) {
      return { label: parts[0].trim(), phone: phone, url: phoneToTel(phone) };
    }
  }
  return null;
}

function normalizeEmergency(trip) {
  if (!trip.emergency) return;

  // Standardize title (remove emoji)
  trip.emergency.title = trip.emergency.title
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
    .trim();
  if (!trip.emergency.title) trip.emergency.title = '緊急聯絡資訊';

  var cards = trip.emergency.content && trip.emergency.content.cards;
  if (!cards) return;

  cards.forEach(function(card) {
    // Ensure color
    if (!card.color) card.color = 'var(--blue-light)';

    // Normalize contacts array
    if (card.contacts) {
      card.contacts = card.contacts.map(function(c) {
        // Already correct format {label, phone, url}
        if (typeof c === 'object' && c.phone !== undefined && c.url !== undefined) return c;

        // String format: "Label：phone"
        if (typeof c === 'string') {
          var parsed = parseContactFromString(c);
          return parsed || { label: c, phone: '', url: '' };
        }

        // {label, value} format (Kyoto)
        if (typeof c === 'object' && c.value !== undefined) {
          var phone = extractPhone(c.value);
          if (phone) {
            return { label: c.label, phone: phone, url: phoneToTel(phone) };
          }
          return { label: c.label, phone: c.value, url: '' };
        }

        return c;
      });
    }

    // Convert items[] to contacts[]/notes[]/address
    if (card.items) {
      var newContacts = card.contacts || [];
      var newNotes = card.notes || [];

      card.items.forEach(function(item) {
        // Address line
        if (/^地址[：:]/.test(item)) {
          card.address = item.replace(/^地址[：:]\s*/, '');
          return;
        }

        // Try colon-separated phone
        var parsed = parseContactFromString(item);
        if (parsed) {
          newContacts.push(parsed);
          return;
        }

        // Try dash-separated phone (require >= 7 digits)
        parsed = parseContactFromDash(item);
        if (parsed) {
          newContacts.push(parsed);
          return;
        }

        // Otherwise keep as note
        newNotes.push(item);
      });

      if (newContacts.length) card.contacts = newContacts;
      else delete card.contacts;
      if (newNotes.length) card.notes = newNotes;
      delete card.items;
    }
  });
}

// ─── Flight normalization ───

function normalizeFlights(trip) {
  if (!trip.flights || !trip.flights.content) return;

  var content = trip.flights.content;

  // Normalize segments to {label, route, time} only
  if (content.segments) {
    content.segments = content.segments.map(function(seg) {
      // Already correct format
      if (Object.keys(seg).length === 3 && seg.label && seg.route && seg.time) {
        return seg;
      }

      var result = { label: seg.label, route: seg.route };

      if (seg.time && !seg.depart) {
        // Has time but also extra fields like flight
        if (seg.flight) {
          result.time = seg.flight + '｜' + seg.time;
        } else {
          result.time = seg.time;
        }
      } else if (seg.depart && seg.arrive) {
        // Expanded format: {depart, arrive, flight, date}
        var parts = [];
        if (seg.flight) parts.push(seg.flight);
        var timePart = '';
        if (seg.date) timePart += seg.date + ' ';
        timePart += seg.depart + ' 出發 → ' + seg.arrive + ' 抵達';
        if (parts.length) {
          result.time = parts.join('') + '｜' + timePart;
        } else {
          result.time = timePart;
        }
      } else {
        result.time = seg.time || '';
      }

      return result;
    });
  }

  // Ensure airline exists
  if (!content.airline) {
    content.airline = { name: '', note: '' };
  }
}

// ─── Main ───

var targetSlugs = process.argv.slice(2);

files.forEach(function(file) {
  var filePath = path.join(tripsDir, file);
  var trip = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  var slug = file.replace('.json', '');

  if (targetSlugs.length && targetSlugs.indexOf(slug) === -1) return;

  console.log('Normalizing ' + slug + ' ...');

  // Normalize all location URLs (deep traverse)
  traverseLocations(trip);

  // Normalize emergency contacts
  normalizeEmergency(trip);

  // Normalize flight segments
  normalizeFlights(trip);

  // Add source to entities missing it
  var srcCount = 0;
  function ensureSource(obj) {
    if (obj && obj.source === undefined) {
      obj.source = 'ai';
      srcCount++;
    }
  }
  function ensureSourceInBoxes(boxes) {
    (boxes || []).forEach(function(box) {
      if (box.type === 'restaurants' && box.restaurants) {
        box.restaurants.forEach(ensureSource);
      }
      if (box.type === 'shopping' && box.shops) {
        box.shops.forEach(ensureSource);
      }
      if (box.type === 'gasStation' && box.station) ensureSource(box.station);
    });
  }
  trip.days.forEach(function(day) {
    if (day.content.hotel && day.content.hotel.name) {
      ensureSource(day.content.hotel);
      ensureSourceInBoxes(day.content.hotel.infoBoxes);
    }
    (day.content.timeline || []).forEach(function(ev) {
      if (ev.travel === undefined) ensureSource(ev);
      ensureSourceInBoxes(ev.infoBoxes);
    });
  });
  if (srcCount) console.log('  Added ' + srcCount + ' missing source fields');

  // Ensure blogUrl exists on restaurants and shops
  var blogCount = 0;
  function ensureBlogUrl(obj) {
    if (obj && obj.blogUrl === undefined) {
      obj.blogUrl = '';
      blogCount++;
    }
  }
  function ensureBlogUrlInBoxes(boxes) {
    (boxes || []).forEach(function(box) {
      if (box.type === 'restaurants' && box.restaurants) {
        box.restaurants.forEach(ensureBlogUrl);
      }
      if (box.type === 'shopping' && box.shops) {
        box.shops.forEach(ensureBlogUrl);
      }
    });
  }
  trip.days.forEach(function(day) {
    if (day.content.hotel && day.content.hotel.name) {
      ensureBlogUrlInBoxes(day.content.hotel.infoBoxes);
    }
    (day.content.timeline || []).forEach(function(ev) {
      ensureBlogUrlInBoxes(ev.infoBoxes);
    });
  });
  if (blogCount) console.log('  Added ' + blogCount + ' missing blogUrl fields');

  // Add note: "" to entities missing it
  var noteCount = 0;
  function ensureNote(obj) {
    if (obj && obj.note === undefined) {
      obj.note = '';
      noteCount++;
    }
  }
  function ensureNoteInBoxes(boxes) {
    (boxes || []).forEach(function(box) {
      if (box.type === 'restaurants' && box.restaurants) {
        box.restaurants.forEach(ensureNote);
      }
      if (box.type === 'shopping' && box.shops) {
        box.shops.forEach(ensureNote);
      }
      if (box.type === 'parking') ensureNote(box);
    });
  }
  trip.days.forEach(function(day) {
    // hotel
    if (day.content.hotel && day.content.hotel.name) {
      ensureNote(day.content.hotel);
      ensureNoteInBoxes(day.content.hotel.infoBoxes);
    }
    // timeline
    (day.content.timeline || []).forEach(function(ev) {
      // event (skip travel entries)
      if (ev.travel === undefined) ensureNote(ev);
      ensureNoteInBoxes(ev.infoBoxes);
    });
  });
  if (noteCount) console.log('  Added ' + noteCount + ' missing note fields');

  // Fill missing location.name from googleQuery
  var nameCount = 0;
  function fillLocationName(loc) {
    if (loc && (loc.name === undefined || loc.name === '') && loc.googleQuery) {
      var q = extractQueryFromUrl(loc.googleQuery);
      if (q) {
        loc.name = q;
        nameCount++;
      }
    }
  }
  trip.days.forEach(function(day) {
    (day.content.timeline || []).forEach(function(ev) {
      fillLocationName(ev.location);
      (ev.infoBoxes || []).forEach(function(box) {
        if (box.type === 'restaurants' && box.restaurants) {
          box.restaurants.forEach(function(r) { fillLocationName(r.location); });
        }
        if (box.type === 'shopping' && box.shops) {
          box.shops.forEach(function(s) { fillLocationName(s.location); });
        }
        if (box.type === 'gasStation' && box.station) {
          fillLocationName(box.station.location);
        }
      });
    });
    if (day.content.hotel && day.content.hotel.location) {
      fillLocationName(day.content.hotel.location);
    }
  });
  if (nameCount) console.log('  Filled ' + nameCount + ' missing location.name');

  // Delete gasStation box-level location (redundant with station.location)
  trip.days.forEach(function(day) {
    (day.content.timeline || []).forEach(function(ev) {
      (ev.infoBoxes || []).forEach(function(box) {
        if (box.type === 'gasStation' && box.location && box.station && box.station.location) {
          delete box.location;
          console.log('  Deleted gasStation box-level location');
        }
      });
    });
  });

  // Delete last day hotel
  var lastDay = trip.days[trip.days.length - 1];
  if (lastDay && lastDay.content && lastDay.content.hotel) {
    delete lastDay.content.hotel;
    console.log('  Deleted last day hotel');
  }

  // Write back
  fs.writeFileSync(filePath, JSON.stringify(trip, null, 2) + '\n');
  console.log('  Done');
});

console.log('\nNormalization complete!');
