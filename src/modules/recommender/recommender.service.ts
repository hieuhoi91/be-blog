import { Injectable } from '@nestjs/common';
import natural from 'natural';
import { BayesClassifier, WordTokenizer } from 'natural';
import { PostEntity } from '../posts/post.entity';
import { RedisService } from '../redis/redis.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class RecommendationService {
  tokenizer: natural.WordTokenizer;
  classifier: natural.BayesClassifier;

  constructor(private redisService: RedisService) {
    this.tokenizer = new WordTokenizer();
    this.classifier = new BayesClassifier();
  }

  // Phương thức train nhận một mảng dữ liệu và dùng nó để huấn luyện classifier. Mỗi mục trong mảng dữ liệu bao gồm một văn bản và một nhãn (label) tương ứng.
  async train(data: PostEntity[]) {
    data.forEach((entry) => {
      this.classifier.addDocument(
        this.tokenizer.tokenize(entry.description),
        entry.title,
      );
    });

    const model = JSON.stringify(this.classifier);
    console.log(model);

    await this.redisService.set('classifier_model', model, 999999999999999);
    this.classifier.train();
  }

  // Phương thức classify dùng để phân loại một văn bản đã cho dựa trên classifier. Văn bản được tách thành các từ bằng tokenizer trước khi phân loại.
  classify(searchHistory: string[]) {
    const uniqueResults = new Set<string>();
    const results = searchHistory.map((text) => {
      const tokens = this.tokenizer.tokenize(text);
      const label = this.classifier.classify(tokens);
      console.log(`Classify result for "${text}":`, label);
      uniqueResults.add(label);
    });
    return Array.from(uniqueResults);
  }

  // Phương thức suggestBasedOnSearchHistory gợi ý các mục dựa trên lịch sử tìm kiếm của người dùng. Nó lấy từ getMostFrequentSearch để xác định từ tìm kiếm phổ biến nhất, sau đó sử dụng classifier để phân loại và gợi ý các mục dựa trên từ này.
  // async suggestBasedOnSearchHistory(user_id: string) {

  //   const mostFrequentSearch = this.getMostFrequentSearch(user_id);

  //   const data = this.classify(await mostFrequentSearch);
  //   console.log(data);
  //   return data;
  // }

  // Phương thức getMostFrequentSearch tính toán từ tìm kiếm phổ biến nhất dựa trên lịch sử tìm kiếm của người dùng. Nó sử dụng một Map để đếm số lần xuất hiện của mỗi từ khóa, sau đó trả về từ khóa với số lần xuất hiện cao nhất.
  // private async getMostFrequentSearch(user_id: string) {
  //   const searchCountMap = new Map<string, number>();
  //   const dataSearch: any = await this.redisService.get(user_id);
  //   dataSearch.forEach((search: any) => {
  //     searchCountMap.set(search, (searchCountMap.get(search) || 0) + 1);
  //   });

  //   let maxCount = 0;
  //   let mostFrequentSearch = '';
  //   searchCountMap.forEach((count, search) => {
  //     if (count > maxCount) {
  //       maxCount = count;
  //       mostFrequentSearch = search;
  //     }
  //   });

  //   console.log('data search', dataSearch);

  //   return mostFrequentSearch;
  // }
}
