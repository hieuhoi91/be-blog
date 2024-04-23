import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as natural from 'natural';

@Injectable()
export class RecommenderService {
  private tfidf = new natural.TfIdf();

  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {
    // Tạm thời dùng mẫu dữ liệu cứng để mô tả
  }

  async recommend(userId: string) {
    const documents = await this.cacheService.get(userId);
    console.log(documents);

    //   documents.forEach((doc: any) => {
    //     this.tfidf.addDocument(doc);
    //   });
    //   const result: { index: number; score: number }[] = [];
    //   this.tfidf.tfidfs(document, (i, measure) => {
    //     result.push({ index: i, score: measure });
    //   });

    //   // Sắp xếp kết quả theo điểm giảm dần và trả về các văn bản có điểm cao nhất
    //   return result
    //     .sort((a, b) => b.score - a.score)
    //     .map((r) => `Document ${r.index} with score: ${r.score}`);
    // }
    // return documents;
  }
}
