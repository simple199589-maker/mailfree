/**
 * 通用工具函数模块
 * @module utils/common
 */

/**
 * 从邮件地址中提取纯邮箱地址
 * 处理各种格式如 "Name <email@domain.com>" 或 "<email@domain.com>"
 * @param {string} addr - 原始邮件地址字符串
 * @returns {string} 纯邮箱地址
 */
export function extractEmail(addr) {
  const s = String(addr || '').trim();
  const m = s.match(/<([^>]+)>/);
  if (m) return m[1].trim();
  return s.split(/\s/)[0] || s;
}

const BASE_ENGLISH_FIRST_NAMES = [
  'emma', 'olivia', 'ava', 'mia', 'zoe', 'luna', 'lucy', 'ivy',
  'amelia', 'grace', 'chloe', 'ella', 'scarlett', 'nora', 'ruby', 'hazel',
  'sophia', 'violet', 'stella', 'hannah', 'layla', 'madison', 'aria', 'elena',
  'jack', 'leo', 'alex', 'sam', 'ryan', 'ethan', 'logan', 'noah',
  'liam', 'owen', 'mason', 'lucas', 'henry', 'dylan', 'wyatt', 'jason',
  'carter', 'aiden', 'asher', 'julian', 'adrian', 'isaac', 'hudson', 'miles',
  'evan', 'nathan', 'aaron', 'caleb', 'connor', 'damon', 'felix', 'roman',
  'nolan', 'brandon', 'claire', 'alice', 'bella', 'zoey', 'lillian', 'camila'
];

const BASE_ENGLISH_LAST_NAMES = [
  'smith', 'johnson', 'brown', 'wilson', 'taylor', 'martin', 'clark', 'king',
  'wright', 'walker', 'hall', 'young', 'allen', 'scott', 'green', 'baker',
  'lee', 'adams', 'turner', 'parker', 'evans', 'cooper', 'bell', 'morris',
  'reed', 'ward', 'ross', 'bailey', 'brooks', 'coleman', 'foster', 'gray',
  'hayes', 'hughes', 'jenkins', 'kennedy', 'long', 'morgan', 'nelson', 'ortiz',
  'powell', 'price', 'ramsey', 'richards', 'sanders', 'simpson', 'watson', 'webb',
  'carter', 'bennett', 'mitchell', 'cook', 'cox', 'davis', 'edwards', 'flores',
  'gonzalez', 'griffin', 'harper', 'harrison', 'murray', 'perry', 'porter', 'russell'
];

const BASE_PINYIN_SURNAMES = [
  'wang', 'li', 'zhang', 'liu', 'chen', 'yang', 'zhao', 'huang',
  'zhou', 'wu', 'xu', 'sun', 'lin', 'guo', 'he', 'gao',
  'ma', 'hu', 'zhu', 'xie', 'luo', 'song', 'tang', 'deng',
  'han', 'feng', 'peng', 'cai', 'xiao', 'fan', 'jiang', 'yan',
  'wei', 'yuan', 'lu', 'qin', 'ren', 'su', 'ye', 'pan',
  'du', 'luan', 'tao', 'kang', 'bai', 'qiu', 'rao', 'shi'
];

const BASE_PINYIN_GIVEN_NAMES = [
  'wei', 'li', 'na', 'yu', 'hao', 'ting', 'xin', 'yan',
  'jia', 'min', 'lei', 'xuan', 'chen', 'lin', 'jing', 'rui',
  'xiaoyu', 'zihao', 'yutong', 'jingyi', 'ziyan', 'haoran', 'qian', 'shuo',
  'yifan', 'yihan', 'zihan', 'ziyu', 'yuxin', 'wenjing', 'xinyi', 'jiayi',
  'haoyu', 'chenxi', 'qing', 'ning', 'tong', 'wen', 'yue', 'meng',
  'jun', 'fan', 'bo', 'an', 'ran', 'fei', 'qi', 'jie',
  'haotian', 'yiming', 'shuhan', 'zixuan', 'ruoxi', 'jianing', 'chenhao', 'yuchen'
];

const BASE_SEMANTIC_WORDS = [
  'sunny', 'blue', 'forest', 'river', 'ocean', 'cloud', 'dream', 'light',
  'mango', 'coco', 'mint', 'pearl', 'olive', 'maple', 'berry', 'lucky',
  'smart', 'happy', 'clear', 'quiet', 'silver', 'golden', 'breeze', 'coffee',
  'winter', 'summer', 'autumn', 'spring', 'leaf', 'moon', 'star', 'garden',
  'meadow', 'morning', 'evening', 'glow', 'shadow', 'rain', 'snow', 'stone',
  'ember', 'mist', 'dawn', 'sunset', 'lake', 'field', 'valley', 'harbor',
  'bloom', 'petal', 'candy', 'cookie', 'latte', 'vanilla', 'citrus', 'melon',
  'island', 'planet', 'comet', 'aurora', 'echo', 'pixel', 'music', 'notebook'
];

const HUMAN_ENGLISH_FIRST_NAMES = uniqueStrings(BASE_ENGLISH_FIRST_NAMES);

const HUMAN_ENGLISH_LAST_NAMES = uniqueStrings(BASE_ENGLISH_LAST_NAMES);

const HUMAN_PINYIN_SURNAMES = uniqueStrings(BASE_PINYIN_SURNAMES);

const HUMAN_PINYIN_GIVEN_NAMES = uniqueStrings(BASE_PINYIN_GIVEN_NAMES);

const HUMAN_SEMANTIC_WORDS = uniqueStrings(BASE_SEMANTIC_WORDS);

const HUMAN_SHORT_NAMES = uniqueStrings([
  ...HUMAN_ENGLISH_FIRST_NAMES.filter(item => item.length <= 6),
  ...HUMAN_PINYIN_GIVEN_NAMES.filter(item => item.length <= 6),
  ...HUMAN_SEMANTIC_WORDS.filter(item => item.length <= 6)
]);

const HUMAN_COMMON_NUMBER_SUFFIXES = [
  '88', '66', '99', '168', '518', '520', '521', '666', '888', '999', '1314'
];

const HUMAN_BIRTHDAY_SUFFIXES = buildBirthdayPool();

const HUMAN_FILLER_DIGITS = ['8', '6', '9', '7', '5', '2', '0', '1'];

const HUMAN_SEPARATORS = ['.', '_', '-'];

/**
 * 生成指定长度的随机ID
 * @param {number} length - ID长度，默认为8
 * @returns {string} 随机生成的ID字符串
 */
export function generateRandomId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomInt(chars.length));
  }
  return result;
}

/**
 * 生成指定范围内的随机整数，优先使用加密级随机源
 * @param {number} max - 上限（不含）
 * @returns {number} 随机整数
 * @author AI by zb
 */
function randomInt(max) {
  const safeMax = Number.isFinite(max) ? Math.floor(max) : 0;
  if (safeMax <= 1) return 0;

  if (globalThis.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buffer);
    return buffer[0] % safeMax;
  }

  return Math.floor(Math.random() * safeMax);
}

/**
 * 从给定数组中随机选取一项
 * @template T
 * @param {Array<T>} items - 候选数组
 * @returns {T} 随机选中的项
 * @author AI by zb
 */
function pickRandom(items) {
  return items[randomInt(items.length)];
}

/**
 * 对字符串数组去重并统一转为小写
 * @param {Array<string>} items - 原始字符串数组
 * @returns {Array<string>} 去重后的字符串数组
 * @author AI by zb
 */
function uniqueStrings(items) {
  return Array.from(new Set(
    (Array.isArray(items) ? items : [])
      .map(item => String(item || '').trim().toLowerCase())
      .filter(Boolean)
  ));
}

/**
 * 生成较大的生日数字池，用于模拟常见邮箱中的出生年份、出生年月与生日后缀
 * @returns {Array<string>} 生日数字池
 * @author AI by zb
 */
function buildBirthdayPool() {
  const result = new Set(HUMAN_COMMON_NUMBER_SUFFIXES);

  for (let year = 1978; year <= 2012; year++) {
    const yearText = String(year);
    const shortYear = yearText.slice(2);
    result.add(yearText);

    for (let month = 1; month <= 12; month++) {
      const monthText = String(month).padStart(2, '0');
      result.add(`${yearText}${monthText}`);

      for (let day = 1; day <= 28; day++) {
        const dayText = String(day).padStart(2, '0');
        result.add(`${monthText}${dayText}`);
        result.add(`${shortYear}${monthText}${dayText}`);
        result.add(`${yearText}${monthText}${dayText}`);
      }
    }
  }

  return Array.from(result);
}

/**
 * 按最大长度筛选并随机选取一项
 * @param {Array<string>} items - 候选字符串数组
 * @param {number} maxLength - 最大允许长度
 * @returns {string} 选中的字符串，若没有可用项则返回空字符串
 * @author AI by zb
 */
function pickRandomWithinLength(items, maxLength) {
  const filtered = items.filter(item => String(item || '').length <= maxLength);
  return filtered.length ? pickRandom(filtered) : '';
}

/**
 * 按概率返回布尔值
 * @param {number} probability - 命中概率，范围 0~1
 * @returns {boolean} 是否命中
 * @author AI by zb
 */
function randomChance(probability) {
  const safeProbability = Math.max(0, Math.min(1, Number(probability) || 0));
  return randomInt(1000000) < Math.floor(safeProbability * 1000000);
}

/**
 * 生成更像真实邮箱使用习惯的生日或年份后缀
 * @param {number} maxLength - 最大允许长度
 * @returns {string} 年份、出生年月、月日或出生年月日形式的数字后缀
 * @author AI by zb
 */
function getBirthdaySuffix(maxLength = 8) {
  return pickRandomWithinLength(HUMAN_BIRTHDAY_SUFFIXES, maxLength);
}

/**
 * 规范化邮箱本地部分，只保留合法字符并清理多余分隔符
 * @param {string} localPart - 原始本地部分
 * @returns {string} 规范化后的本地部分
 * @author AI by zb
 */
function normalizeMailboxLocalPart(localPart) {
  return String(localPart || '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/[._-]{2,}/g, '-')
    .replace(/^[._-]+|[._-]+$/g, '');
}

/**
 * 按目标长度收缩或补齐邮箱本地部分，同时尽量保持真人风格
 * @param {string} localPart - 原始本地部分
 * @param {number} targetLength - 目标长度
 * @returns {string} 调整后的本地部分
 * @author AI by zb
 */
function fitMailboxLocalPart(localPart, targetLength) {
  const requested = Number(targetLength);
  const safeTarget = Number.isFinite(requested) ? Math.max(1, Math.min(64, Math.floor(requested))) : 8;
  let result = normalizeMailboxLocalPart(localPart);

  if (!result) {
    result = generateRandomId(safeTarget);
  }

  if (result.length > safeTarget) {
    result = normalizeMailboxLocalPart(result.slice(0, safeTarget));
  }

  while (result.length < safeTarget) {
    const remaining = safeTarget - result.length;
    const filler = normalizeMailboxLocalPart(
      remaining >= 6
        ? pickRandom([
          getBirthdaySuffix(remaining),
          getBirthdaySuffix(remaining),
          pickRandomWithinLength(HUMAN_COMMON_NUMBER_SUFFIXES, remaining)
        ])
        : remaining >= 4
          ? pickRandom([
            getBirthdaySuffix(remaining),
            '1998',
            '2001',
            '199812',
            '200306',
            '0823',
            '0908'
          ].filter(item => String(item || '').length <= remaining))
          : remaining >= 2
            ? pickRandomWithinLength(HUMAN_COMMON_NUMBER_SUFFIXES, remaining)
            : pickRandom(HUMAN_FILLER_DIGITS)
    ) || generateRandomId(remaining);
    result = normalizeMailboxLocalPart(`${result}${filler.slice(0, remaining)}`);
    if (!result) {
      result = generateRandomId(safeTarget);
    }
  }

  if (result.length > safeTarget) {
    result = normalizeMailboxLocalPart(result.slice(0, safeTarget));
  }

  if (!result) {
    result = generateRandomId(safeTarget);
  }

  return result.slice(0, safeTarget);
}

/**
 * 生成真人风格的身份主体，覆盖英文名、拼音名与语义化词组
 * @param {number} targetLength - 目标长度
 * @returns {string} 身份主体字符串
 * @author AI by zb
 */
function buildHumanIdentityToken(targetLength) {
  const separator = pickRandom(HUMAN_SEPARATORS);
  const firstName = pickRandom(HUMAN_ENGLISH_FIRST_NAMES);
  const lastName = pickRandom(HUMAN_ENGLISH_LAST_NAMES);
  const surname = pickRandom(HUMAN_PINYIN_SURNAMES);
  const givenName = pickRandom(HUMAN_PINYIN_GIVEN_NAMES);
  const wordA = pickRandom(HUMAN_SEMANTIC_WORDS);
  const wordB = pickRandom(HUMAN_SEMANTIC_WORDS);
  const candidates = [
    pickRandom(HUMAN_SHORT_NAMES),
    firstName,
    `${firstName}${lastName}`,
    `${firstName}${separator}${lastName}`,
    `${surname}${givenName}`,
    `${surname}${separator}${givenName}`,
    wordA,
    `${wordA}${wordB}`,
    `${wordA}${separator}${wordB}`,
    `${firstName}${separator}${wordA}`,
    `${surname}${separator}${wordA}`
  ]
    .map(normalizeMailboxLocalPart)
    .filter(Boolean);

  const nearTarget = candidates.filter(item => item.length <= targetLength + 2);
  return pickRandom(nearTarget.length ? nearTarget : candidates);
}

/**
 * 生成真人风格的附加片段，覆盖出生年月、常见数字和短语义词
 * @param {number} maxLength - 最大允许长度
 * @param {number} stage - 当前拼接阶段
 * @returns {string} 附加片段
 * @author AI by zb
 */
function buildHumanAddonToken(maxLength, stage) {
  if (maxLength <= 0) return '';

  const options = [
    getBirthdaySuffix(maxLength),
    getBirthdaySuffix(maxLength),
    pickRandomWithinLength(HUMAN_COMMON_NUMBER_SUFFIXES, maxLength)
  ].filter(Boolean);

  if (stage === 0 && maxLength >= 3) {
    options.push(pickRandomWithinLength(HUMAN_SHORT_NAMES, maxLength));
  }

  if (stage === 0 && maxLength >= 4) {
    options.push(
      pickRandomWithinLength(HUMAN_SEMANTIC_WORDS.filter(item => item.length <= 6), maxLength)
    );
  }

  return options.length ? pickRandom(options) : '';
}

/**
 * 随机组合真人风格规则，生成单个候选邮箱本地部分
 * @param {number} targetLength - 目标长度
 * @returns {string} 单个候选本地部分
 * @author AI by zb
 */
function composeHumanLikeMailboxCandidate(targetLength) {
  let candidate = normalizeMailboxLocalPart(buildHumanIdentityToken(targetLength));
  let remaining = targetLength - candidate.length;
  let stage = 0;

  while (remaining > 0 && stage < 2) {
    const useSeparator = remaining >= 3 && !/[._-]/.test(candidate) && randomChance(stage === 0 ? 0.35 : 0.2);
    const tokenMaxLength = remaining - (useSeparator ? 1 : 0);
    if (tokenMaxLength <= 0) break;

    const addon = buildHumanAddonToken(tokenMaxLength, stage);
    if (!addon) break;

    const separator = useSeparator ? pickRandom(HUMAN_SEPARATORS) : '';
    candidate = normalizeMailboxLocalPart(`${candidate}${separator}${addon}`);
    remaining = targetLength - candidate.length;
    stage += 1;

    if (remaining <= 1 || randomChance(0.45)) {
      break;
    }
  }

  return candidate;
}

/**
 * 评估候选邮箱本地部分与目标长度的贴合程度
 * @param {string} candidate - 候选本地部分
 * @param {number} targetLength - 目标长度
 * @returns {number} 评分，越低越好
 * @author AI by zb
 */
function scoreHumanLikeCandidate(candidate, targetLength) {
  const diff = Math.abs(targetLength - candidate.length);
  const overPenalty = candidate.length > targetLength ? 1.5 : 0;
  const separatorPenalty = /[._-]{2,}/.test(candidate) ? 2 : 0;
  return diff + overPenalty + separatorPenalty;
}

/**
 * 构造真人风格的邮箱本地部分基础模板，通过随机组合多组候选并选择最接近目标长度的结果
 * @param {number} targetLength - 目标长度
 * @returns {string} 基础模板字符串
 * @author AI by zb
 */
function buildHumanLikeMailboxBase(targetLength) {
  let bestCandidate = composeHumanLikeMailboxCandidate(targetLength);
  let bestScore = scoreHumanLikeCandidate(bestCandidate, targetLength);

  for (let i = 0; i < 20; i++) {
    const candidate = composeHumanLikeMailboxCandidate(targetLength);
    const score = scoreHumanLikeCandidate(candidate, targetLength);
    if (score < bestScore || (score === bestScore && randomChance(0.35))) {
      bestCandidate = candidate;
      bestScore = score;
      if (bestScore === 0) break;
    }
  }

  return bestCandidate;
}

/**
 * 生成真人风格的邮箱本地部分，兼顾英文名、中文拼音名、语义词与常见数字
 * @param {number} length - 目标长度
 * @returns {string} 真人风格的邮箱本地部分
 * @author AI by zb
 */
export function generateHumanLikeId(length = 8) {
  const requested = Number(length);
  const targetLength = Number.isFinite(requested) ? Math.max(1, Math.min(64, Math.floor(requested))) : 8;
  const base = buildHumanLikeMailboxBase(targetLength);
  return fitMailboxLocalPart(base, targetLength);
}

/**
 * 验证邮箱地址格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为有效的邮箱格式
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * 计算文本的SHA-256哈希值并返回十六进制字符串
 * @param {string} text - 需要计算哈希的文本内容
 * @returns {Promise<string>} 十六进制格式的SHA-256哈希值
 */
export async function sha256Hex(text) {
  const enc = new TextEncoder();
  const data = enc.encode(String(text || ''));
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
}

/**
 * 基于邮箱地址与盐值生成固定的临时授权码
 * @param {string} email - 邮箱地址
 * @param {string} salt - 授权盐值
 * @returns {Promise<string>} 32位十六进制授权码
 * @author AI by zb
 */
export async function buildTemporaryAccessCode(email, salt) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedSalt = String(salt || '').trim() || '123@x5';
  const entropy = (globalThis.crypto?.randomUUID && globalThis.crypto.randomUUID())
    || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const digest = await sha256Hex(`${normalizedEmail}:${normalizedSalt}:${entropy}`);
  return digest.slice(0, 32);
}

/**
 * 验证原始密码与哈希密码是否匹配
 * @param {string} rawPassword - 原始明文密码
 * @param {string} hashed - 已哈希的密码
 * @returns {Promise<boolean>} 验证结果，true表示密码匹配
 */
export async function verifyPassword(rawPassword, hashed) {
  if (!hashed) return false;
  try {
    const hex = (await sha256Hex(rawPassword)).toLowerCase();
    return hex === String(hashed || '').toLowerCase();
  } catch (_) {
    return false;
  }
}
