import { Board } from "./Board";

export class Game {
    score = 0;
    elementScore;
    elementBestScore;
    board;
    win;
    // Selecciona elementos para las teclas de flecha y la pantalla de juego terminado
    arrowLeft: HTMLDivElement | null = document.querySelector(".left");
    arrowUp: HTMLDivElement | null = document.querySelector(".up");
    arrowBottom: HTMLDivElement | null = document.querySelector(".bottom");
    arrowRight: HTMLDivElement | null = document.querySelector(".right");
    gameOverElement: HTMLDivElement | null = document.querySelector(".game-over-container");
    restartButton: HTMLButtonElement | null = document.querySelector(".restart-btn");
    gameGoal: number = 2048; // Establece el objetivo por defecto

    constructor() {
        // Inicializa el tablero y selecciona elementos del DOM
        this.board = new Board(this, 4);
        this.elementScore = document.querySelector(".score span");
        this.elementBestScore = document.querySelector(".best-score span");
        this.win = false;
        this.drawBestScore();

        // Añade escuchadores de eventos para los botones
        document.querySelector(".newgame button")?.addEventListener("click", () => this.newGame());
        document.querySelector(".button-win")?.addEventListener("click", () => this.newGame());
        this.restartButton?.addEventListener("click", () => this.newGame());
    }

    // Actualiza la puntuación y la muestra
    handleScore(number: number) {
        this.score += number;
        this.elementScore!.innerHTML = this.score.toString();
        this.updateBestScore(this.score);
        this.drawBestScore();
    }

    // Actualiza el mejor puntaje en el almacenamiento local
    updateBestScore(score: number) {
        const value = localStorage.getItem("bestScore");
        if (typeof value === "string") {
            const puntos: number[] = JSON.parse(value);
            puntos.push(score);
            localStorage.setItem("bestScore", JSON.stringify(puntos));
        }
    }

    // Muestra el mejor puntaje en el DOM
    drawBestScore() {
        const value = localStorage.getItem("bestScore");
        if (typeof value === "string") {
            let puntos: number[] = JSON.parse(value);
            let max = 0;
            puntos.forEach((p) => {
                if (p > max) {
                    max = p;
                }
            });
            this.elementBestScore!.innerHTML = `${max}`;
        }
    }

    // Reinicia el juego
    newGame() {
        this.hideGameOver();
        this.score = 0;
        this.win = false;
        this.elementScore!.innerHTML = this.score.toString();
        const newArray = this.board.array.map((row) => {
            return row.map(() => {
                return { num: 0, square: null };
            });
        });
        this.board.array = newArray;
        this.board.containerSquares.innerHTML = "";
        this.board.addRandomSquare(this.board.SIZE);
        this.board.addRandomSquare(this.board.SIZE);
    }

    // Verifica si se ha alcanzado la victoria
    checkWin(number: number) {
        if (number === this.gameGoal) {
            this.handleWin();
        }
    }

    // Maneja la victoria del juego, mostrando un mensaje
    handleWin() {
        this.win = true;
        const containerWin: HTMLDivElement | null = document.querySelector(".container-win");
        const winScore: HTMLDivElement | null = document.querySelector(".win-score span");
        containerWin!.style.display = "flex";
        winScore!.innerHTML = this.score.toString();
    }

    // Muestra el mensaje de juego terminado
    showGameOver() {
        this.gameOverElement!.style.display = "block";
    }

    // Oculta el mensaje de juego terminado
    hideGameOver() {
        this.gameOverElement!.style.display = "none";
    }

    // Cambia el color de las flechas según la dirección presionada
    addColorArrows(e: KeyboardEvent) {
        const keyName = e.code;
        switch (keyName) {
            case "ArrowRight":
                this.arrowRight!.style.background = "#f2b179";
                break;
            case "ArrowUp":
                this.arrowUp!.style.background = "#f2b179";
                break;
            case "ArrowLeft":
                this.arrowLeft!.style.background = "#f2b179";
                break;
            case "ArrowDown":
                this.arrowBottom!.style.background = "#f2b179";
                break;
        }
    }

    // Devuelve el color original a las flechas cuando se suelta la tecla
    removeColorArrows(e: KeyboardEvent) {
        const keyName = e.code;
        switch (keyName) {
            case "ArrowRight":
                this.arrowRight!.style.background = "";
                break;
            case "ArrowUp":
                this.arrowUp!.style.background = "";
                break;
            case "ArrowLeft":
                this.arrowLeft!.style.background = "";
                break;
            case "ArrowDown":
                this.arrowBottom!.style.background = "";
                break;
        }
    }

    // Establece un nuevo objetivo para ganar el juego
    setGameGoal(goal: number) {
        this.gameGoal = goal;
    }
}
