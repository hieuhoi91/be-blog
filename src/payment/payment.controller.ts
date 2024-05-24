import { Controller, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('create')
  async createPayment(
    @Query('orderId') orderId: string,
    @Query('amount') amount: number,
    @Query('orderInfo') orderInfo: string,
    @Query('returnUrl') returnUrl: string,
    @Query('notifyUrl') notifyUrl: string,
  ) {
    return this.paymentService.createPaymentRequest(
      orderId,
      amount,
      orderInfo,
      returnUrl,
      notifyUrl,
    );
  }

  @Get('notify')
  async notifyPayment(@Query() query: any) {
    // Xử lý phản hồi từ MoMo
    console.log('Notify:', query);
    return { message: 'Payment notification received' };
  }

  @Get('return')
  async returnPayment(@Query() query: any) {
    // Xử lý kết quả thanh toán từ MoMo
    console.log('Return:', query);
    return { message: 'Payment result received' };
  }
}
