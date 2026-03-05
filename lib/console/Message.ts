import { Severity } from "./Severity";

export class Message {
  text: string;
  severity: Severity;
  time: Date;

  constructor(text: string, severity: Severity, time: Date) {
    this.text = text;
    this.severity = severity;
    this.time = time;
  }

  render(): HTMLParagraphElement {
    const message = document.createElement("p");
    message.classList.add("message", this.severity);
    message.textContent = `${this.time.toLocaleTimeString()}: [${this.severity}] ${this.text}`;
    return message;
  }
}
