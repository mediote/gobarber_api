export default interface IHashProvider {
  genarateHash(payload: string): Promise<string>;
  compareHash(palyload: string, hashed: string): Promise<boolean>;
}
