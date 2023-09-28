import { Game } from "./Game";
import { Square } from "./Square";
import { BoardArray, rowBoard, cellBoard } from "./types";

export class Board {
    game: Game;
    element: HTMLDivElement | null;
    SIZE: number;
    SIZE_SQUARE: number;
    containerSquares: HTMLDivElement;
    array: BoardArray;
    squareAnt: Square | null;
    idSquares: number;

    // Constructor de la clase
    constructor(game: Game, SIZE: number) {
        // Definimos propiedades iniciales
        this.game = game;
        this.SIZE = SIZE;
        this.SIZE_SQUARE = 90;
        this.squareAnt = null;
        this.idSquares = 0;
        this.element = document.querySelector(".board");
        this.array = this.createBoardArray(SIZE);
        this.containerSquares = this.createContainerSquares();
        this.init();
    }

    // Crear un array para el tablero
    createBoardArray(SIZE: number): BoardArray {
        const fragment = document.createDocumentFragment();
        const array = new Array(this.SIZE);
        for (let i = 0; i < SIZE; i++) {
            array[i] = [];
            for (let j = 0; j < this.SIZE; j++) {
                const cell = this.createCell();
                fragment.appendChild(cell);
                array[i][j] = { num: 0, square: null };
            }
        }
        this.createBoard(fragment, SIZE);
        return array;
    }

    // Crear el diseño visual del tablero
    createBoard(squares: DocumentFragment, SIZE: number) {
        this.element?.appendChild(squares);
        this.element!.style.gridTemplateColumns = `repeat(${SIZE}, ${this.SIZE_SQUARE}px)`;
        this.element!.style.gridTemplateRows = `repeat(${SIZE}, ${this.SIZE_SQUARE}px)`;
    }

    // Crear contenedor para los cuadros
    createContainerSquares() {
        const container = document.createElement("div");
        container.classList.add("container-squares");
        this.element?.appendChild(container);
        return container;
    }

    // Crear una celda individual
    createCell(): HTMLDivElement {
        const cell = document.createElement("div");
        cell.classList.add("board-cell");
        return cell;
    }

    // Agregar un cuadro aleatorio al tablero
    addRandomSquare(SIZE: number) {
        let max = SIZE * SIZE;
        for (let i = 0; i < max; i++) {
            const { x, y } = this.getRandomNumbers(SIZE);
            const cell = this.array[y][x];
            if (cell.num === 0) {
                this.idSquares++;
                const c = new Square(
                    this.idSquares,
                    this,
                    x,
                    y,
                    this.SIZE_SQUARE,
                    this.SIZE,
                    this.containerSquares
                );
                cell.num = 2;
                cell.square = c;
                break;
            }
        }
    }

    // Obtener números aleatorios para x y y
    getRandomNumbers(SIZE: number): { x: number; y: number } {
        const x = Math.floor(Math.random() * SIZE);
        const y = Math.floor(Math.random() * SIZE);
        return { x, y };
    }

    // Inicializar el juego
    init() {
        let flag = false;
        document.addEventListener("keydown", (e) => {
            if (!flag) {
                flag = true;
                this.handleMove(e);
            }
            this.game.addColorArrows(e);
        });
        document.addEventListener("keyup", (e) => {
            flag = false;
            this.game.removeColorArrows(e);
        });

        this.addRandomSquare(this.SIZE);
        this.addRandomSquare(this.SIZE);
    }

    // Manejar movimientos con teclas de flecha
    handleMove(e: KeyboardEvent) {
        if (this.game.win) return;
        const keyName = e.code;
        switch (keyName) {
            // Definimos las acciones según la dirección
            case "ArrowRight":
                this.handleMoveX(true);
                break;
            case "ArrowUp":
                this.handleMoveY(false);
                break;
            case "ArrowLeft":
                this.handleMoveX(false);
                break;
            case "ArrowDown":
                this.handleMoveY(true);
                break;
        }
    }
// Lógica para mover a lo largo del eje X
    handleMoveX(direction: boolean) {
        const newArray = this.array.map((row) => {
            const filteredRow = row.filter((n) => n.num > 0);
            const { summedRow, summed, squareAnt } = direction
                ? this.sumRight(filteredRow)
                : this.sumLeft(filteredRow);
            const finalRow = summedRow.filter((n) => n.num > 0);
            const fillRow = this.fillRow(finalRow, direction);
            this.moveX(fillRow, summed, squareAnt!);
            return fillRow;
        });
        this.array = newArray;
        this.addRandomSquare(this.SIZE);
        if (!this.hasValidMove()) {
            this.game.showGameOver();
        }
    }
// Lógica para mover a lo largo del eje Y
    handleMoveY(direction: boolean) {
      const arrayChanged = this.changeArrayDirecton(this.array);
      const newArray = arrayChanged.map((row) => {
          const filteredRow = row.filter((n) => n.num > 0);
          const { summedRow, summed, squareAnt } = direction
              ? this.sumRight(filteredRow)
              : this.sumLeft(filteredRow);
          const finalRow = summedRow.filter((n) => n.num > 0);
          const fillRow = this.fillRow(finalRow, direction);
          this.moveY(fillRow, summed, squareAnt!);
          return fillRow;
      });
      this.array = this.changeArrayDirecton(newArray);
      this.addRandomSquare(this.SIZE);
      if (!this.hasValidMove()) {
          this.game.showGameOver();
      }
  }
// Cambiar dirección del array
  changeArrayDirecton(array: BoardArray) {
    let newArray: BoardArray = [];
    for (let i = 0; i < this.SIZE; i++) {
      newArray[i] = [];
      for (let j = 0; j < this.SIZE; j++) {
        newArray[i][j] = array[j][i];
      }
    }
    return newArray;
  }

  // Mover a lo largo de X
  moveX(row: rowBoard, summed: boolean, squareAnt: Square) {
    row.forEach((s, i) => {
        if (s.num <= 0) return;
        const y = s.square!.y;
        if (summed) {
            s.square!.moveSquareAnt(i, y, this.SIZE_SQUARE, squareAnt);
        }
        s.square!.moveTo(i, y, this.SIZE_SQUARE, s.num);
    });
}

// Mover a lo largo de Y
moveY(row: rowBoard, summed: boolean, squareAnt: Square) {
    row.forEach((s, i) => {
        if (s.num <= 0) return;
        const x = s.square!.x;
        if (summed) {
            s.square!.moveSquareAnt(x, i, this.SIZE_SQUARE, squareAnt);
        }
        s.square!.moveTo(x, i, this.SIZE_SQUARE, s.num);
    });
}

// Sumar los valores cuando dos celdas contiguas son iguales (movimiento hacia la derecha)
sumRight(array: rowBoard) {
    let summed = false;
    let squareAnt: Square | null = null;
    for (let i = array.length - 1; i > 0; i--) {
        if (i < 0) break;
        const cell = array[i];
        const cellAnt = array[i - 1];
        if (cell.num === cellAnt.num) {
            this.sumSquares(cell, cellAnt);
            squareAnt = cellAnt.square;
            summed = true;
            cellAnt.num = 0;
            cellAnt.square = null;
        }
    }
    return { summedRow: array, summed, squareAnt };
}

// Sumar los valores cuando dos celdas contiguas son iguales (movimiento hacia la izquierda)
sumLeft(array: rowBoard) {
    let summed = false;
    let squareAnt: Square | null = null;
    for (let i = 0; i < array.length; i++) {
        if (i >= array.length - 1) break;
        const cell = array[i];
        const cellAnt = array[i + 1];
        if (cell.num === cellAnt.num) {
            this.sumSquares(cell, cellAnt);
            squareAnt = cellAnt.square;
            summed = true;
            cellAnt.num = 0;
            cellAnt.square = null;
        }
    }
    return { summedRow: array, summed, squareAnt };
}

// Función que efectivamente suma las celdas y actualiza el score y verifica victoria
sumSquares(cell: cellBoard, cellAnt: cellBoard) {
    cell.num += cellAnt.num;
    this.game.handleScore(cell.num);
    this.game.checkWin(cell.num);
}

// Llena la fila con celdas vacías (0) según la dirección del movimiento
fillRow(row: rowBoard, direction: boolean) {
    const newRow = row;
    for (let j = 0; j < this.SIZE; j++) {
        if (newRow.length < this.SIZE) {
            direction
                ? newRow.unshift({ num: 0, square: null })
                : newRow.push({ num: 0, square: null });
        }
    }
    return newRow;
}

// Verificar si hay movimientos válidos restantes
hasValidMove(): boolean {
    for (let y = 0; y < this.SIZE; y++) {
        for (let x = 0; x < this.SIZE; x++) {
            const current = this.array[y][x].num;
            const neighbors = [
                { x: x + 1, y: y },
                { x: x - 1, y: y },
                { x: x, y: y + 1 },
                { x: x, y: y - 1 }
            ];

            // Comprueba si alguna de las celdas vecinas es igual o está vacía
            for (let neighbor of neighbors) {
                if (neighbor.x >= 0 && neighbor.x < this.SIZE && neighbor.y >= 0 && neighbor.y < this.SIZE) {
                    if (this.array[neighbor.y][neighbor.x].num === current || this.array[neighbor.y][neighbor.x].num === 0) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
}
