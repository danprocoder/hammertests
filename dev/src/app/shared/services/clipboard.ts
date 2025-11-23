import { Injectable } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";

@Injectable({
  providedIn: 'root'
})
export class Clipboard {

  clipboard: Record<string, string> = {};

  private constructor(private message: NzMessageService) {}

  copyToClipboard(key: string, text: string): void {
    this.clipboard[key] = text;
    this.message.success('Copied to clipboard');
  }

  readFromClipboard(key: string): Promise<string> {
    const data = this.clipboard[key];
    delete this.clipboard[key];
    return Promise.resolve(data);
  }

  exists(key: string): boolean {
    return !!this.clipboard[key];
  }
}
