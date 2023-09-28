import { Game } from "./Game";

// Comprobar si no existe una puntuación máxima en el almacenamiento local; si no existe, establecerla.
if (localStorage.getItem("bestScore") === null) {
    let puntos: [] | number[] = [];
    localStorage.setItem("bestScore", JSON.stringify(puntos));
}

// Instanciar un nuevo juego
const g = new Game();

// Seleccionar el contenedor del juego y añadir el tablero al DOM.
const containerGame = document.querySelector<HTMLDivElement>(".container-game");
containerGame?.appendChild(g.board.element!);

// Escuchar cambios en el menú desplegable para ajustar el objetivo del juego.
const gameGoalSelector = document.getElementById("gameGoal") as HTMLSelectElement;
// Seleccionar el título del juego para actualizarlo con el objetivo actual.
const titleElement = document.querySelector(".title") as HTMLElement;

gameGoalSelector.addEventListener("change", (e) => {
    // Obtener el objetivo seleccionado y convertirlo a número.
    const selectedGoal = parseInt(gameGoalSelector.value);
    // Establecer el nuevo objetivo en la instancia del juego.
    g.setGameGoal(selectedGoal);
    // Comenzar un nuevo juego con el nuevo objetivo.
    g.newGame();
    // Actualizar el título del juego para reflejar el nuevo objetivo.
    titleElement.textContent = selectedGoal.toString();
});
