interface Node {
  render(): HTMLDivElement;
}

class ExpressionNode implements Node {
  operator: Operator;
  operands: Node[];

  constructor(operator: Operator, operands: Node[]) {
    this.operator = operator;
    this.operands = operands;
  }

  render(): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add(this.operator);

    this.operands.forEach((operand) => {
      div.appendChild(operand.render());
    });
    return div;
  }
}

class DisjunctiveNode extends ExpressionNode {
  constructor(operands: Node[]) {
    super(Operator.OR, operands);
  }
}

class ConjunctiveNode extends ExpressionNode {
  constructor(operands: Node[]) {
    super(Operator.AND, operands);
  }
}

class LiteralNode implements Node {
  value: string;
  isOpen: boolean;

  constructor(value: string, isOpen: boolean = true) {
    this.value = value;
    this.isOpen = isOpen;
  }

  render(): HTMLDivElement {
    const div = document.createElement("div");

    if (!this.isOpen) {
      div.classList.add("NOT");
    }
    div.textContent = this.value;

    return div;
  }
}

enum Operator {
  OR = "OR",
  AND = "AND",
}

function renderExample() {
  const literalTree = new LiteralNode("START");
  const conjunctiveTree = new ConjunctiveNode([
    new LiteralNode("START"),
    new LiteralNode("STOP", false),
  ]);
  const disjunctiveTree = new DisjunctiveNode([
    new LiteralNode("START"),
    new LiteralNode("LED"),
  ]);
  const nestedTree = new DisjunctiveNode([
    new ConjunctiveNode([
      new LiteralNode("START"),
      new LiteralNode("STOP", false),
    ]),
    new LiteralNode("LED"),
  ]);

  const sample = document.createElement("div");
  sample.style.display = "flex";
  sample.style.flexDirection = "column";
  sample.style.gap = "60px";

  sample.appendChild(literalTree.render());
  sample.appendChild(conjunctiveTree.render());
  sample.appendChild(disjunctiveTree.render());
  sample.appendChild(nestedTree.render());

  document.getElementsByTagName("body")[0].appendChild(sample);
}

export { renderExample };
