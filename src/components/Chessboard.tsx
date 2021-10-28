import React, { useEffect, useRef, useState } from "react";
import "./Chessboard.css";
import Tile from "./Tile";

const yAxis = [1, 2, 3, 4, 5, 6, 7, 8];
const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece {
    image: string
    x: number
    y: number
}

const initialBoardState: Piece[] = [];

for(let p=0; p < 2; p++){
    const type = (p === 0) ? "b" : "w";
    const y = (p === 0) ? 7 : 0;
    const y2 = (p === 0) ? 6 : 1;

    for(let i=0; i < 8; i++){
        initialBoardState.push({image: `assets/images/pawn_${type}.png`, x: i, y: y2})
    }
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 0, y: y})
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 7, y: y})
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 1, y: y})
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 6, y: y})
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 2, y: y})
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 5, y: y})
    initialBoardState.push({image: `assets/images/queen_${type}.png`, x: 3, y: y})
    initialBoardState.push({image: `assets/images/king_${type}.png`, x: 4, y: y})
}

export default function Chessboard(){
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setgridX] = useState(0);
    const [gridY, setgridY] = useState(0);

    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);

    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard){
            const gridX = Math.floor((e.clientX - chessboard.offsetLeft)/100);
            const gridY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800)/100));
            setgridX(gridX);
            setgridY(gridY);
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            setActivePiece(element);
        }
    }
    
    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard){
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            activePiece.style.position = "absolute";
            if (x < minX){
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }
            if (y < minY){
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }
    
    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard){
            const x = Math.floor((e.clientX - chessboard.offsetLeft)/100);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800)/100));
            setPieces((value) => {
                value.map(p => {
                    if (p.x === gridX && p.y === gridY){
                        p.x = x;
                        p.y = y;
                    }
                    return p;
                })
                return pieces;
            });
            setActivePiece(null);
        }
    }

    let board = [];
    for(let j = yAxis.length - 1; j >= 0; j--){
        for(let i = 0; i < xAxis.length; i++){
            const number = i + j;
            let image= undefined;
            pieces.forEach((p) => {
                if (p.x === i && p.y === j){
                    image = p.image;
                }
            })

            board.push(<Tile key={`${j},${i}`} image={image} number={number}/>);
        }
    }
    return <div onMouseMove={(e) => movePiece(e)} onMouseDown={e => grabPiece(e)} onMouseUp={e => dropPiece(e)} id="chessboard" ref={chessboardRef}>{board}</div>
}