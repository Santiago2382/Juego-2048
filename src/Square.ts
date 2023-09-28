import { Board } from "./Board";

export class Square {
  // Propiedades de la clase
  id;
  board;
  x;
  y;
  SIZE;
  SIZE_BOARD;
  element;
  squareNumber;
  container;
  number;

  // Constructor que inicializa una instancia de Square
  constructor(
    id: number,
    board: Board,
    x: number,
    y: number,
    SIZE: number,
    SIZE_BOARD: number,
    container: HTMLDivElement
  ) {
    this.id = id;
    this.board = board;
    this.x = x;
    this.y = y;
    this.SIZE = SIZE;
    this.SIZE_BOARD = SIZE_BOARD;
    this.number = 2;
    this.element = document.createElement("div");
    this.squareNumber = document.createElement("div");
    this.container = container;
    this.createSquare();
    this.moveTo(x, y, SIZE, 2);
  }

  // Método para crear visualmente el cuadro en el DOM
  createSquare() {
    this.element.id = this.id.toString();
    this.element.style.width = `${this.SIZE}px`;
    this.element.style.height = `${this.SIZE}px`;
    this.squareNumber.innerHTML = this.number.toString();
    this.squareNumber.classList.add("square-2", "square-number");
    this.element.classList.add("square");
    this.element.appendChild(this.squareNumber);
    this.container?.appendChild(this.element);
  }

  // Método para actualizar el elemento cuadrado según un número específico
  updateSquareElement(number: number) {
    if (this.number !== number) {
      this.squareNumber.classList.remove(
        `square-${this.number}`,
        "square-animated"
      );
      void this.squareNumber.offsetWidth;
      this.squareNumber.classList.add(`square-${number}`, "square-animated");
      this.squareNumber.innerHTML = number.toString();
      this.element.style.zIndex = `${number}`;
    }
  }

  // Método para mover el cuadro a una posición específica
  moveTo(x: number, y: number, SIZE: number, number: number) {
    const { borderX, borderY } = this.getBorder(x, y);
    this.element.style.transform = `translate(${x * SIZE + borderX}px, ${
      y * SIZE + borderY
    }px)`;
    this.updateSquareElement(number);
    this.number = number;
    this.x = x;
    this.y = y;
  }

  // Método para mover el cuadrado anterior a una posición determinada
  moveSquareAnt(x: number, y: number, SIZE: number, squareAnt: Square | null) {
    // Si no hay cuadrado anterior, salir
    if (!squareAnt) return;
    if (!this.squareExistInContainer(squareAnt.element.id)) return;
    const { borderX, borderY } = this.getBorder(x, y);
    squareAnt!.element.style.transform = `translate(${x * SIZE + borderX}px, ${
      y * SIZE + borderY
    }px)`;
    squareAnt.element.id = "";
    setTimeout(() => {
      squareAnt.element.style.display = "none";
      this.board.containerSquares.removeChild(squareAnt.element);
      this.squaresExistInArray(squareAnt.element.id);
    }, 50);
  }

  // Método para comprobar si existen cuadrados en el array
  squaresExistInArray(idAnt: string) {
    const squares = document.querySelectorAll(".square");
    const idsContainer = [...squares].map((s) => parseInt(s.id));
    if (idsContainer.length <= 0) return;
    idsContainer.pop();
    const rows = this.board.array.map((row) => {
      return row.map((s) => s.square && s.square.id);
    });
    const idsArray = Array(rows.length)
      .concat(...rows)
      .filter((id) => id !== null && id !== idAnt);
    idsContainer.forEach((idContainer) => {
      if (!idsArray.includes(idContainer))
        this.deleteSquare(idContainer.toString());
    });
  }

  // Método para eliminar un cuadrado específico por ID
  deleteSquare(id: string) {
    const square = document.getElementById(id);
    if (square) {
      this.board.containerSquares.removeChild(square!);
    }
  }

  // Método para comprobar si un cuadrado específico existe en el contenedor
  squareExistInContainer(id: string) {
    if (id === "") return false;
    const squares = document.querySelectorAll(".square");
    const ids = [...squares].map((s) => s.id);
    return ids.includes(id);
  }

  // Método para obtener los márgenes de un cuadrado
  getBorder(x: number, y: number) {
    return { borderX: 10 * x, borderY: 10 * y };
  }
}
