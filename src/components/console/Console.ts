import { Message } from "./Message";
import { Severity } from "./Severity";

export class Console {
  static isShown = true;

  static show() {
    const main = document.getElementsByTagName("main")[0]!;
    const consoleElement = document.getElementById("console")!;
    main.style.height = "calc(100vh - 10em)";
    consoleElement.style.height = "10em";
    consoleElement.style.display = "block";
    this.isShown = true;
  }

  static hide() {
    const main = document.getElementsByTagName("main")[0]!;
    const consoleElement = document.getElementById("console")!;
    main.style.height = "100vh";
    consoleElement.style.height = "0px";
    consoleElement.style.display = "none";
    this.isShown = false;
  }

  static toggle() {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  }

  static append(message: Message) {
    const consoleElement = document.getElementById("console")!;
    const messageElement = message.render();
    consoleElement.appendChild(messageElement);
    messageElement.scrollIntoView();
  }

  static info(text: string): string {
    this.append(new Message(text, Severity.INFO, new Date()));
    return text;
  }

  static warn(text: string): string {
    this.show();
    this.append(new Message(text, Severity.WARN, new Date()));
    return text;
  }

  static error(text: string): string {
    this.show();
    this.append(new Message(text, Severity.ERROR, new Date()));
    return text;
  }
}
