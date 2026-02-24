export interface Node {
  id: string;
  render(): HTMLDivElement;
  toObject(): Object;
}
