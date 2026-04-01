/**
 * API 模块统一入口
 * @module api
 */

import { handleUsersApi } from './users.js';
import { handleMailboxesApi } from './mailboxes.js';
import { handleEmailsApi } from './emails.js';
import { handleSendApi } from './send.js';
import { getJwtPayload, errorResponse } from './helpers.js';

/**
 * 处理所有 API 请求
 * @param {Request} request - HTTP 请求
 * @param {object} db - 数据库连接
 * @param {Array<string>} mailDomains - 邮件域名列表
 * @param {object} options - 选项
 * @returns {Promise<Response>} HTTP 响应
 */
export async function handleApiRequest(request, db, mailDomains, options = {
  mockOnly: false,
  resendApiKey: '',
  adminName: '',
  r2: null,
  authPayload: null,
  mailboxOnly: false,
  temporaryAccess: false,
  tempAccessSalt: '123@x5'
}) {
  const url = new URL(request.url);
  const path = url.pathname;
  const isMock = !!options.mockOnly;
  const isMailboxOnly = !!options.mailboxOnly;
  const isTemporaryAccess = !!options.temporaryAccess;

  // 邮箱用户或临时访问用户只能访问特定的API端点和自己的数据
  if (isMailboxOnly || isTemporaryAccess) {
    const payload = getJwtPayload(request, options);
    const mailboxAddress = payload?.mailboxAddress;
    const mailboxId = Number(payload?.mailboxId || 0);
    
    // 允许的API端点
    const allowedPaths = isTemporaryAccess
      ? ['/api/emails', '/api/emails/batch', '/api/email/']
      : ['/api/emails', '/api/emails/batch', '/api/email/', '/api/auth', '/api/quota', '/api/mailbox/password'];
    const isAllowedPath = allowedPaths.some(allowedPath => path.startsWith(allowedPath));
    
    if (!isAllowedPath) {
      return errorResponse('访问被拒绝', 403);
    }

    if (isTemporaryAccess && request.method !== 'GET') {
      return errorResponse('临时授权仅支持只读访问', 403);
    }
    
    // 对于邮件相关API，限制只能访问自己的邮箱
    if (path === '/api/emails' && request.method === 'GET') {
      const requestedMailbox = url.searchParams.get('mailbox');
      if (requestedMailbox && requestedMailbox.toLowerCase() !== mailboxAddress?.toLowerCase()) {
        return errorResponse('只能访问自己的邮箱', 403);
      }
      // 如果没有指定邮箱，自动设置为用户自己的邮箱
      if (!requestedMailbox && mailboxAddress) {
        url.searchParams.set('mailbox', mailboxAddress);
      }
    }

    if (path === '/api/emails/batch' && request.method === 'GET' && mailboxId) {
      const ids = String(url.searchParams.get('ids') || '')
        .split(',')
        .map(item => parseInt(item, 10))
        .filter(id => Number.isInteger(id) && id > 0);

      if (ids.length) {
        const placeholders = ids.map(() => '?').join(',');
        try {
          const { results } = await db.prepare(`
            SELECT id FROM messages
            WHERE mailbox_id = ? AND id IN (${placeholders})
          `).bind(mailboxId, ...ids).all();

          if ((results || []).length !== ids.length) {
            return errorResponse('无权访问部分邮件', 403);
          }
        } catch (_) {
          return errorResponse('验证失败', 500);
        }
      }
    }
    
    // 对于单个邮件操作，验证邮件是否属于该用户的邮箱
    if (path.startsWith('/api/email/') && mailboxId) {
      if (isTemporaryAccess && path.endsWith('/download')) {
        return errorResponse('临时授权不支持下载原始邮件', 403);
      }

      const emailId = path.split('/')[3];
      if (emailId && emailId !== 'batch') {
        try {
          const { results } = await db.prepare('SELECT mailbox_id FROM messages WHERE id = ? LIMIT 1').bind(emailId).all();
          if (!results || results.length === 0) {
            return errorResponse('邮件不存在', 404);
          }
          if (results[0].mailbox_id !== mailboxId) {
            return errorResponse('无权访问此邮件', 403);
          }
        } catch (e) {
          return errorResponse('验证失败', 500);
        }
      }
    }
  }

  // 依次尝试各个 API 处理器
  let response;

  // 用户管理 API
  response = await handleUsersApi(request, db, url, path, options);
  if (response) return response;

  // 邮箱管理 API
  response = await handleMailboxesApi(request, db, mailDomains, url, path, options);
  if (response) return response;

  // 邮件 API
  response = await handleEmailsApi(request, db, url, path, options);
  if (response) return response;

  // 发送 API
  response = await handleSendApi(request, db, url, path, options);
  if (response) return response;

  return errorResponse('未找到 API 路径', 404);
}

export { handleUsersApi } from './users.js';
export { handleMailboxesApi } from './mailboxes.js';
export { handleEmailsApi } from './emails.js';
export { handleSendApi } from './send.js';
