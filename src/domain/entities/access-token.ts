export class AccessToken {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  static get expirationInMs(): number {
    return 30 * 60 * 1000; // equal to 30 minutes
  }
}
