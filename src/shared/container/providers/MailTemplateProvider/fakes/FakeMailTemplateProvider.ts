import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";


export default class FakeMailTemplateProvider implements IMailTemplateProvider{
  public async parse({}: IParseMailTemplateDTO): Promise<string>{
    return 'MailContent';
  }

}
