import IMailProvider from "../models/IMailProvider";

interface IEmail {
  to: string;
  body: string
}

export default class FakeMailProvider implements IMailProvider {
  private fakeInbox: IEmail[] = [];

  public async sendMail(to: string, body: string): Promise<void>{
    this.fakeInbox.push({
      to: to,
      body: body,
    });
  }
}
