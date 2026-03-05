export interface Node {
  id: string;
  toDiv(): HTMLDivElement;
  toObject(): Object;
}
