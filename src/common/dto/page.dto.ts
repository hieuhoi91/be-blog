export class SimpleResponse<T> {
  readonly data: T;

  readonly message: string;

  constructor(data: T, message?: string) {
    this.data = data;
    this.message = message ? message : 'Success';
  }
}
