import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export default class CronService {
  constructor() {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async callAPI() {
    try {
      const response = await axios.get(
        'https://be-blog-mzcc.onrender.com/categories',
      );
      console.log('API response:', response.data);
    } catch (error) {
      console.error('Error calling API:', error.message);
    }
  }
}
