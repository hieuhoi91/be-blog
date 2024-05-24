import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly partnerCode = 'your_partner_code';
  private readonly accessKey = 'your_access_key';
  private readonly secretKey = 'your_secret_key';
  private readonly endpoint =
    'https://test-payment.momo.vn/gw_payment/transactionProcessor';

  async createPaymentRequest(
    orderId: string,
    amount: number,
    orderInfo: string,
    returnUrl: string,
    notifyUrl: string,
  ): Promise<any> {
    const requestId = orderId;
    const orderType = 'momo_wallet';
    const extraData = '';

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=captureMoMoWallet&notifyUrl=${notifyUrl}`;
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      returnUrl,
      notifyUrl,
      extraData,
      requestType: 'captureMoMoWallet',
      signature,
      lang: 'en',
    };

    const response = await axios.post(this.endpoint, requestBody);
    return response.data;
  }
}
