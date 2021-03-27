import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailProvider from "../models/IMailProvider";

export default class FakeMailProvider implements IMailProvider {
  private fakeInbox: ISendMailDTO[] = [];

  public async sendMail(data: ISendMailDTO): Promise<void>{
    this.fakeInbox.push(data);
  }
}
