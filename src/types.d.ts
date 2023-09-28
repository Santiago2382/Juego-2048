import { Square } from "./Square";

// Define un tipo para representar una celda individual en el tablero.
// Cada celda contiene un número (que representa el valor del cuadrado) y 
// una referencia al cuadrado (que puede ser nula si la celda está vacía).
export type cellBoard = { num: number; square: null | Square };

// Define un tipo para representar una fila completa en el tablero.
// Una fila es esencialmente un array de celdas.
export type rowBoard = cellBoard[];

// Define un tipo para representar el tablero completo.
// El tablero es un array de filas.
export type BoardArray = rowBoard[];
