import { Message } from "./Message";
import { Severity } from "./Severity";

export class Console {
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
    this.append(new Message(text, Severity.WARN, new Date()));
    return text;
  }

  static error(text: string): string {
    this.append(new Message(text, Severity.ERROR, new Date()));
    return text;
  }
}
