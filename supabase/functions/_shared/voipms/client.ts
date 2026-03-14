import { VoIPMSError } from './errors.ts';
import type { DIDNumber, PurchaseResult, SearchNumbersParams, SubAccount, VoIPMSResponse } from './types.ts';

const VOIPMS_API_URL = 'https://voip.ms/api/v1/rest.php';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeDID(raw: string): string {
  const trimmed = String(raw || '').trim();
  if (trimmed.startsWith('+')) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return trimmed;
}

function toNumber(v: unknown): number | undefined {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

export class VoIPMSClient {
  private username: string;
  private password: string;

  constructor(opts: { username: string; apiPassword: string }) {
    this.username = opts.username;
    this.password = opts.apiPassword;
  }

  private async call(method: string, params: Record<string, string> = {}): Promise<VoIPMSResponse> {
    const qp = new URLSearchParams({
      api_username: this.username,
      api_password: this.password,
      method,
      ...params,
    });

    const url = `${VOIPMS_API_URL}?${qp.toString()}`;

    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(url, { method: 'GET' });
        const data = (await res.json()) as VoIPMSResponse;

        if (!res.ok) {
          throw new VoIPMSError(`VoIP.ms HTTP ${res.status}`, 'http_error', res.status);
        }

        if (data.status !== 'success') {
          throw new VoIPMSError(`VoIP.ms error: ${data.status}`, 'voipms_error', 400);
        }

        return data;
      } catch (e) {
        lastErr = e;
        if (attempt < 2) {
          await sleep(300 * 2 ** attempt);
        }
      }
    }

    throw lastErr instanceof Error ? lastErr : new Error('VoIP.ms request failed');
  }

  async searchNumbers(params: SearchNumbersParams): Promise<DIDNumber[]> {
    const query: Record<string, string> = {
      type: 'local',
    };

    if (params.state) query.state = params.state;
    if (params.areaCode) query.npa = params.areaCode;
    if (params.ratecenter) query.ratecenter = params.ratecenter;

    // Only return numbers with SMS support by default
    query.sms = params.sms === false ? '0' : '1';

    const data = await this.call('getDIDsUSA', query);

    const dids = (data.dids as DIDNumber[] | undefined) ?? [];
    const filtered = dids.filter((d) => (params.sms === false ? true : String(d.sms_available || '').toLowerCase() === 'yes'));

    const limit = params.limit && params.limit > 0 ? params.limit : 25;
    return filtered.slice(0, limit).map((d) => ({ ...d, did: normalizeDID(d.did) }));
  }

  async createSubAccount(params: { username: string; password: string; email?: string; packageName?: string }): Promise<SubAccount> {
    const data = await this.call('createSubAccount', {
      username: params.username,
      password: params.password,
      protocol: 'sip',
      auth_type: 'user',
      device_type: 'softphone',
      lock_international: '1',
      ...(params.packageName ? { package: params.packageName } : {}),
      ...(params.email ? { description: params.email } : {}),
    });

    const account = String((data as any).account || '');
    if (!account) {
      throw new VoIPMSError('VoIP.ms createSubAccount missing account', 'invalid_response', 502);
    }

    return { account, username: params.username, password: params.password };
  }

  async purchaseNumber(params: { did: string; subAccountId: string; pop?: string; billingType?: 'perminute' | 'flatrate' }): Promise<PurchaseResult> {
    const did = normalizeDID(params.did);
    const digits = did.replace(/\D/g, '').replace(/^1/, ''); // VoIP.ms expects 10-digit DID for US

    const order = await this.call('orderDID', {
      did: digits,
      routing: 'account',
      account: params.subAccountId,
      billing_type: params.billingType || 'perminute',
      pop: params.pop || 'toronto',
      note: 'ContractorLink Auto-Provisioned',
      test: '0',
    });

    const orderId = (order as any).order_id ? String((order as any).order_id) : undefined;
    const monthlyFee = toNumber((order as any).monthly);

    // Enable SMS + configure webhook (best-effort)
    try {
      await this.call('setSMS', { did: digits, enable: '1' });
    } catch {
      // ignore
    }

    return { did, orderId, monthlyFee };
  }

  async setSMSWebhook(params: { did: string; url: string }) {
    const did = normalizeDID(params.did);
    const digits = did.replace(/\D/g, '').replace(/^1/, '');
    await this.call('setSMSURL', { did: digits, url: params.url });
  }
}
