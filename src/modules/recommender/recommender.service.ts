import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import natural from 'natural';
import { BayesClassifier, WordTokenizer } from 'natural';
import { Cache } from 'cache-manager';
import { PostEntity } from '../posts/post.entity';

@Injectable()
export class RecommendationService {
  tokenizer: natural.WordTokenizer;
  classifier: natural.BayesClassifier;

  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {
    this.tokenizer = new WordTokenizer();
    this.classifier = new BayesClassifier();
  }

  // Phương thức train nhận một mảng dữ liệu và dùng nó để huấn luyện classifier. Mỗi mục trong mảng dữ liệu bao gồm một văn bản và một nhãn (label) tương ứng.
  train(post: PostEntity) {
    let data = [];
    data.push(post);
    data.forEach((entry) => {
      this.classifier.addDocument(
        this.tokenizer.tokenize(entry.text),
        entry.label,
      );
    });
    console.log('data train', data);

    this.classifier.train();
  }

  // Phương thức classify dùng để phân loại một văn bản đã cho dựa trên classifier. Văn bản được tách thành các từ bằng tokenizer trước khi phân loại.
  classify(text: string) {
    const data = this.classifier.classify(this.tokenizer.tokenize(text));
    console.log('data classify', data);
    return data;
  }

  // Phương thức suggestBasedOnSearchHistory gợi ý các mục dựa trên lịch sử tìm kiếm của người dùng. Nó lấy từ getMostFrequentSearch để xác định từ tìm kiếm phổ biến nhất, sau đó sử dụng classifier để phân loại và gợi ý các mục dựa trên từ này.
  async suggestBasedOnSearchHistory(user_id: string) {
    // Logic to suggest based on user's search history
    // Example: Get the most frequent search term in history and suggest items related to it
    const mostFrequentSearch = this.getMostFrequentSearch(user_id);

    const data = this.classify(await mostFrequentSearch);
    console.log(data);
    return data;
  }

  // Phương thức getMostFrequentSearch tính toán từ tìm kiếm phổ biến nhất dựa trên lịch sử tìm kiếm của người dùng. Nó sử dụng một Map để đếm số lần xuất hiện của mỗi từ khóa, sau đó trả về từ khóa với số lần xuất hiện cao nhất.
  private async getMostFrequentSearch(user_id: string) {
    const searchCountMap = new Map<string, number>();
    const dataSearch: any[] = await this.cacheService.get(user_id);
    dataSearch.forEach((search) => {
      searchCountMap.set(search, (searchCountMap.get(search) || 0) + 1);
    });

    let maxCount = 0;
    let mostFrequentSearch = '';
    searchCountMap.forEach((count, search) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentSearch = search;
      }
    });

    console.log('data search', dataSearch);

    return mostFrequentSearch;
  }
}
