export type VoIPMSStatus = 'success' | 'error' | string;

export type DIDNumber = {
  did: string;
  ratecenter?: string;
  province?: string;
  state?: string;
  city?: string;
  monthly?: string;
  setup?: string;
  minute?: string;
  sms_available?: string;
  mms_available?: string;
};

export type SearchNumbersParams = {
  state?: string; // e.g. CA
  areaCode?: string; // NPA
  ratecenter?: string;
  sms?: boolean;
  mms?: boolean;
  limit?: number;
};

export type SubAccount = {
  account: string;
  username: string;
  password: string;
};

export type PurchaseResult = {
  orderId?: string;
  did: string;
  monthlyFee?: number;
};

export type VoIPMSResponse = {
  status: VoIPMSStatus;
  [key: string]: any;
};
