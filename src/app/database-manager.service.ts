import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import * as CDSSPlugin from "capacitor-data-storage-sqlite";
import { Note } from "./models/note.model";
const { CapacitorDataStorageSqlite, Device } = Plugins;

@Injectable({
  providedIn: "root",
})
export class DatabaseManagerService {
  _storage;
  constructor() {}

  async initializeDB() {
    const info = await Device.getInfo();
    if (info.platform === "ios" || info.platform === "android") {
      this._storage = CapacitorDataStorageSqlite;
    } else if (info.platform === "electron") {
      this._storage = CDSSPlugin.CapacitorDataStorageSqliteElectron;
    } else {
      this._storage = CDSSPlugin.CapacitorDataStorageSqlite;
    }
    return await this._storage.openStore({});
  }

  async checkKey(key: string) {
    return await this._storage.iskey({ key: key });
  }

  async fetch(key: string) {
    return await this._storage.get({ key: key });
  }

  async insert(key: string, note: Note[]): Promise<any> {
    return await this._storage.set({
      key: key,
      value: JSON.stringify(note),
    });
  }
}
