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
    div.classList.add("expression-node");

    this.operands.forEach((operand) => {
      div.appendChild(operand.render());
    });
    div.classList.add(this.operator);

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
  address: string;
  label: string;
  isOpen: boolean;

  constructor(address: string, label: string, isOpen: boolean = true) {
    this.address = address;
    this.label = label;
    this.isOpen = isOpen;
  }

  render(): HTMLDivElement {
    const node = document.createElement("div");
    node.classList.add("literal-node");

    const address = document.createElement("span");
    address.classList.add("node-address");
    address.textContent = this.address;
    address.contentEditable = "true";
    address.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        address.blur();
      }
    });
    address.addEventListener("blur", () => {
      this.address = address.textContent;
      console.log(this);
    });
    node.appendChild(address);

    const icon = document.createElement("div");
    icon.classList.add("node-icon");
    icon.textContent = `——]${this.isOpen ? " " : "/"}[——`;
    node.appendChild(icon);

    const label = document.createElement("span");
    label.classList.add("node-label");
    label.textContent = `"${this.label}"`;
    node.appendChild(label);

    return node;
  }
}

enum Operator {
  OR = "OR",
  AND = "AND",
}

function renderExample() {
  const literalTree = new LiteralNode("%I0.0", "START");
  const conjunctiveTree = new ConjunctiveNode([
    new LiteralNode("%I0.0", "START"),
    new LiteralNode("%I0.1", "STOP", false),
  ]);
  const disjunctiveTree = new DisjunctiveNode([
    new LiteralNode("%I0.0", "START"),
    new LiteralNode("%Q0.0", "LED"),
  ]);
  const nestedTree = new DisjunctiveNode([
    new ConjunctiveNode([
      new LiteralNode("%I0.0", "START"),
      new LiteralNode("%I0.1", "STOP", false),
    ]),
    new LiteralNode("%Q0.0", "LED"),
  ]);

  const sample = document.createElement("div");
  sample.style.display = "flex";
  sample.style.flexDirection = "column";
  sample.style.gap = "30px";
  sample.style.padding = "20px";

  sample.appendChild(literalTree.render());
  sample.appendChild(conjunctiveTree.render());
  sample.appendChild(disjunctiveTree.render());
  sample.appendChild(nestedTree.render());

  document.getElementsByTagName("body")[0].appendChild(sample);
}

export { renderExample };
