import { randomUUID } from "crypto";

export class Attachment {
  private _id: string;
  private _title: string;
  private _url: string;

  private constructor(id: string, title: string, url: string) {
    this._id = id;
    this._title = title;
    this._url = url;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get url(): string {
    return this._url;
  }

  static create(title: string, url: string, id?: string) {
    return new Attachment(id ?? randomUUID(), title, url);
  }
}
