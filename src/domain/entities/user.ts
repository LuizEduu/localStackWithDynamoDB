import { randomUUID } from "node:crypto";

export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _cpf: string;

  private constructor(id: string, name: string, email: string, cpf: string) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._cpf = cpf;
  }

  get cpf(): string {
    return this._cpf;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get id(): string {
    return this._id;
  }

  static create(name: string, email: string, cpf: string, id?: string) {
    return new User(id ?? randomUUID(), name, email, cpf);
  }
}
