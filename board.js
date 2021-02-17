class Piece{

        constructor(type, color, file, rank) {
            this.color = color;
            this.file = file;
            this.rank = rank;
            this.type = type;
        }

}

class Queen extends Piece{

    constructor(color, file, rank) {
        super("q", color, file, rank);
        if(this.color == "light"){
            this.imagePath = "graphics/light_queen.png"
        }else{
            this.imagePath = "graphics/dark_queen.png"
        }
    }

}

class Rook extends Piece{
    
    constructor(color, file, rank,canCastle) {
        super("r", color, file, rank);
        this.canCastle = canCastle

        if(this.color == "light"){
            this.imagePath = "graphics/light_rook.png"
        }else{
            this.imagePath = "graphics/dark_rook.png"
        }
    }

}

class King extends Piece{
    
    constructor(color, file, rank, canCastle) {
        super("k", color, file, rank);
        this.canCastle = canCastle

        if(this.color == "light"){
            this.imagePath = "graphics/light_king.png"
        }else{
            this.imagePath = "graphics/dark_king.png"
        }
    }

}

class Pawn extends Piece{
    
    constructor(color, file, rank) {
        super("p", color, file, rank);
        if(this.color == "light"){
            this.imagePath = "graphics/light_pawn.png"
        }else{
            this.imagePath = "graphics/dark_pawn.png"
        }
    }

}

class Bishop extends Piece{
    
    constructor(color, file, rank) {
        super("b", color, file, rank);
        if(this.color == "light"){
            this.imagePath = "graphics/light_bishop.png"
        }else{
            this.imagePath = "graphics/dark_bishop.png"
        }
    }

}

class Knight extends Piece{
    
    constructor(color, file, rank) {
        super("n", color, file, rank);    
        if(this.color == "light"){
            this.imagePath = "graphics/light_knight.png"
        }else{
            this.imagePath = "graphics/dark_knight.png"
        }
    }

}



let boardContainer = document.querySelector('.board-container')
let board;
let selectedSquare;
let lightsTurn = true;
let squareSize = boardContainer.getBoundingClientRect().height/8;

let darkKingSquare = {"file":4,"rank":7}
let lightKingSquare = {"file":4,"rank":0}

//event listener for clicking
boardContainer.addEventListener('click',(e)=>{
    

    let file = Math.floor((e.clientX - boardContainer.getBoundingClientRect().x)/squareSize);
    let rank = 7-Math.floor((e.clientY - boardContainer.getBoundingClientRect().y)/squareSize);

    if(board[file][rank] != null && selectedSquare == null){
        selectedSquare = {"file":file,"rank":rank};
    }else if(selectedSquare!=null && (selectedSquare.file != file || selectedSquare.rank != rank)){
        attemptToMove(selectedSquare,{"file":file,"rank":rank})
        selectedSquare = null;
    }

})

//eventlistener for start drag
boardContainer.addEventListener('dragstart',(e)=>{
    

    let file = Math.floor((e.clientX - boardContainer.getBoundingClientRect().x)/squareSize);
    let rank = 7-Math.floor((e.clientY - boardContainer.getBoundingClientRect().y)/squareSize);


    if(board[file][rank] == null)return;

    
    draggedPiece = document.getElementById(`${file.toString() + rank.toString()}`);
    draggedPiece.classList.add("beingDragged")
    setTimeout(()=>(draggedPiece.classList.add("invisible")),0)

    //legalMovesFor({"file":file,"rank":rank}).forEach(move => {
    //    boardContainer.innerHTML+=`<div class = "move-indicator" style = "bottom:${move.rank*62.5}px ; left:${move.file*62.5}px"</div>`
    //})

    if(board[file][rank] != null && selectedSquare == null){
        selectedSquare = {"file":file,"rank":rank};
    }

})

//event listener for end drag
boardContainer.addEventListener('dragend',(e)=>{
    let file = Math.floor((e.clientX - boardContainer.getBoundingClientRect().x)/squareSize);
    let rank = 7-Math.floor((e.clientY - boardContainer.getBoundingClientRect().y)/squareSize);

    indicators = document.getElementsByClassName('move-indicator')
    for(i = indicators.length-1 ; i >= 0 ; i--){
        boardContainer.removeChild(indicators[i])
    }

    if(selectedSquare == null)return;

    draggedPiece = document.getElementById(`${selectedSquare.file.toString() + selectedSquare.rank.toString()}`);
    draggedPiece.classList.remove("beingDragged","invisible")

    attemptToMove(selectedSquare,{"file":file,"rank":rank})
    selectedSquare = null;
})

//returns an array of coordinates that a piece on a certain square can move to
function legalMovesFor(coord1){
    
    if(board[coord1.file][coord1.rank] == null || board[coord1.file][coord1.rank] == undefined) return  new Array(0);

    var pieceType = board[coord1.file][coord1.rank].type;
    var pieceColor = board[coord1.file][coord1.rank].color;
    var pieceFile = coord1.file;
    var pieceRank = coord1.rank;

    //an array of the legal moves
    var result = new Array(0);

    switch(pieceType)

    {
        //==============================Knight=================================
        case "n":{

            let knightMoves = [{"file":pieceFile+1,"rank":pieceRank+2},
                            {"file":pieceFile+1,"rank":pieceRank-2},
                            {"file":pieceFile+2,"rank":pieceRank+1},
                            {"file":pieceFile+2,"rank":pieceRank-1},
                            {"file":pieceFile-1,"rank":pieceRank+2},
                            {"file":pieceFile-1,"rank":pieceRank-2},
                            {"file":pieceFile-2,"rank":pieceRank+1},
                            {"file":pieceFile-2,"rank":pieceRank-1}]

            for(let i = 0 ; i < 8 ; i++){

                if(isLegalMove({"file":pieceFile,"rank":pieceRank} , knightMoves[i])){
                    result.push(knightMoves[i]);
                }
            }

        }break;
        //==============================Pawn=================================
        case "p":{
            if(pieceColor == "light"){

                pawnMoves = [{"file":pieceFile+1,"rank":pieceRank+1},
                            {"file":pieceFile-1,"rank":pieceRank+1},
                            {"file":pieceFile,"rank":pieceRank+2},
                            {"file":pieceFile,"rank":pieceRank+1}]


            }else{       

                pawnMoves = [{"file":pieceFile+1,"rank":pieceRank-1},
                            {"file":pieceFile-1,"rank":pieceRank-1},
                            {"file":pieceFile,"rank":pieceRank-2},
                            {"file":pieceFile,"rank":pieceRank-1}]

            }

            for(let i = 0 ; i < 4 ; i++){

                if(isLegalMove({"file":pieceFile,"rank":pieceRank} , pawnMoves[i])){
                    result.push(pawnMoves[i]);
                }
            }

        }break;
        //==============================Bishop=================================
        case "b":{

            i = pieceFile +1
            j = pieceRank+1

            while(i < 8 && j < 8){
                if(board[i][j]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                }
                else if(board[i][j].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                    break;
                }else{
                    break;
                }
                i++;
                j++;
            }

            i = pieceFile -1
            j = pieceRank+1

            while(i >= 0 && j < 8){
                if(board[i][j]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                }
                else if(board[i][j].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                    break;
                }else{
                    break;
                }
                i--;
                j++;
            }

            i = pieceFile -1
            j = pieceRank-1

            while(i >= 0 && j >= 0){
                if(board[i][j]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                }
                else if(board[i][j].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                    break;
                }else{
                    break;
                }
                i--;
                j--;
            }

            i = pieceFile +1
            j = pieceRank-1

            while(i < 8 && j >= 0){
                if(board[i][j]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                }
                else if(board[i][j].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                    break;
                }else{
                    break;
                }
                i++;
                j--;
            }

        }break;
        //==============================Rook=================================
        case "r":{
        
            for(i = pieceRank+1 ; i < 8 ; i++){
                if(board[pieceFile][i]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":pieceFile,"rank":i})){ 
                        result.push({"file":pieceFile,"rank":i})
                    };
                }
                else if(board[pieceFile][i].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":pieceFile,"rank":i})){ 
                        result.push({"file":pieceFile,"rank":i})
                    };
                    break;
                }else{
                    break;
                }

            }
            for(i = pieceRank-1 ; i >= 0 ; i--){    
                if(board[pieceFile][i]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":pieceFile,"rank":i})){ 
                        result.push({"file":pieceFile,"rank":i})
                    };
                }
                else if(board[pieceFile][i].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":pieceFile,"rank":i})){ 
                        result.push({"file":pieceFile,"rank":i})
                    };
                    break;
                }else{
                    break;
                }
            }
            for(i = pieceFile+1 ; i < 8 ; i++){
                
                if(board[i][pieceRank]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":pieceRank})){ 
                        result.push({"file":i,"rank":pieceRank})
                    };
                }
                else if(board[i][pieceRank].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":pieceRank})){ 
                        result.push({"file":i,"rank":pieceRank})
                    };
                    break;
                }else{
                    break;
                }

            }
            for(i = pieceFile-1 ; i >= 0 ; i--){

                if(board[i][pieceRank]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":pieceRank})){ 
                        result.push({"file":i,"rank":pieceRank})
                    };
                }
                else if(board[i][pieceRank].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":pieceRank})){ 
                        result.push({"file":i,"rank":pieceRank})
                    };
                    break;
                }else{
                    break;
                }

            }

        }break;
        //==============================King=================================
        case "k":{

            let kingMoves = [{"file":pieceFile+1,"rank":pieceRank+1},
                            {"file":pieceFile+1,"rank":pieceRank},
                            {"file":pieceFile+1,"rank":pieceRank-1},
                            {"file":pieceFile,"rank":pieceRank-1},
                            {"file":pieceFile-1,"rank":pieceRank-1},
                            {"file":pieceFile-1,"rank":pieceRank},
                            {"file":pieceFile-1,"rank":pieceRank+1},
                            {"file":pieceFile,"rank":pieceRank+1},
                            {"file":pieceFile+2,"rank":pieceRank},
                            {"file":pieceFile-2,"rank":pieceRank}]

            for(let i = 0 ; i < 10 ; i++){

                    if(isLegalMove({"file":pieceFile,"rank":pieceRank} , kingMoves[i])){
                        
                        result.push(kingMoves[i]);
                    }
            }                    

        }
        break;
        //==============================Queen=================================
        
        // combination of rook and bishop movement rules
        case "q":{
            for(i = pieceRank+1 ; i < 8 ; i++){
                if(board[pieceFile][i]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":pieceFile,"rank":i})){ 
                        result.push({"file":pieceFile,"rank":i})
                    };
                }
                else if(board[pieceFile][i].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":pieceFile,"rank":i})){ 
                        result.push({"file":pieceFile,"rank":i})
                    };
                    break;
                }else{
                    break;
                }

            }
            for(i = pieceRank-1 ; i >= 0 ; i--){    
                if(board[pieceFile][i]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":pieceFile,"rank":i})){ 
                        result.push({"file":pieceFile,"rank":i})
                    };
                }
                else if(board[pieceFile][i].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":pieceFile,"rank":i})){ 
                        result.push({"file":pieceFile,"rank":i})
                    };
                    break;
                }else{
                    break;
                }
            }
            for(i = pieceFile+1 ; i < 8 ; i++){
                
                if(board[i][pieceRank]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":pieceRank})){ 
                        result.push({"file":i,"rank":pieceRank})
                    };
                }
                else if(board[i][pieceRank].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":pieceRank})){ 
                        result.push({"file":i,"rank":pieceRank})
                    };
                    break;
                }else{
                    break;
                }

            }
            for(i = pieceFile-1 ; i >= 0 ; i--){

                if(board[i][pieceRank]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":pieceRank})){ 
                        result.push({"file":i,"rank":pieceRank})
                    };
                }
                else if(board[i][pieceRank].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":pieceRank})){ 
                        result.push({"file":i,"rank":pieceRank})
                    };
                    break;
                }else{
                    break;
                }

            }

            i = pieceFile +1
            j = pieceRank+1

            while(i < 8 && j < 8){
                if(board[i][j]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                }
                else if(board[i][j].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                    break;
                }else{
                    break;
                }
                i++;
                j++;
            }

            i = pieceFile -1
            j = pieceRank+1

            while(i >= 0 && j < 8){
                if(board[i][j]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                }
                else if(board[i][j].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                    break;
                }else{
                    break;
                }
                i--;
                j++;
            }

            i = pieceFile -1
            j = pieceRank-1

            while(i >= 0 && j >= 0){
                if(board[i][j]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                }
                else if(board[i][j].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                    break;
                }else{
                    break;
                }
                i--;
                j--;
            }

            i = pieceFile +1
            j = pieceRank-1

            while(i < 8 && j >= 0){
                if(board[i][j]==null){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                }
                else if(board[i][j].color != pieceColor){
                    if(isLegalMove({"file":coord1.file,"rank":coord1.rank},{"file":i,"rank":j})) result.push({"file":i,"rank":j});
                    break;
                }else{
                    break;
                }
                i++;
                j--;
            }

        }break;
    }  

    return result

}

//returns all legal moves for one color pieces
function getAllLegalMovesFor(color){
    result = new Array(0)

    for(let i = 0 ; i < 8 ; i++){
        for(let j = 0 ; j < 8 ; j++){
            if(board[i][j]!=null && board[i][j].color == color){
                legalMovesFor({"file":i,"rank":j}).forEach(move => {
                    result.push(move)


                })
            }
        }
    }

    return result
}

function movePiecePhysically(coord1,coord2,imagePath){


    let toBeMoved = coord1.file.toString()+coord1.rank.toString()
    let toBeCapturedId = coord2.file.toString()+coord2.rank.toString()
    boardContainer.removeChild(document.getElementById(`${toBeMoved}`))
    if(document.getElementById(`${toBeCapturedId}`)!=null)boardContainer.removeChild(document.getElementById(`${toBeCapturedId}`));

    boardContainer.innerHTML += `<img id = "${coord2.file.toString()+coord2.rank.toString()}" class = "piece" src = "${imagePath}"
    style = "left:${coord2.file*(squareSize)}px; 
            bottom:${coord2.rank*(squareSize)}px; "
    >`

}

function movePieceLogically(coord1,coord2){
    board[coord2.file][coord2.rank] = board[coord1.file][coord1.rank];
    let newPiece = board[coord2.file][coord2.rank];

    newPiece.file = coord2.file;
    newPiece.rank = coord2.rank;

    board[coord1.file][coord1.rank] = null;
}

//trys to make a move on the game board
function attemptToMove(coord1,coord2){

    let color;
    if(lightsTurn){
        color = "light"
    }else{
        color = "dark"
    }
    if(lightsTurn && board[coord1.file][coord1.rank].color == "dark" || !lightsTurn && board[coord1.file][coord1.rank].color == "light") return ;
    
    if(isLegalMove(coord1,coord2) && !putsKingInCheck(color,coord1,coord2)){
        executeMove(coord1,coord2)
    }

}

//executes a move on the game board both physcally and logically including special events like castling and en passant
function executeMove(coord1,coord2){

    toBeMoved = board[coord1.file][coord1.rank]
    targetSquare = {"file":coord2.file,"rank":coord2.rank}



    //castle light short
    if(toBeMoved.type == "k" && sameSquare(targetSquare,{"file":6,"rank":0})){
        movePiecePhysically(lightKingSquare,targetSquare,board[lightKingSquare.file][lightKingSquare.rank].imagePath);
        movePiecePhysically( {"file":7,"rank":0} , {"file":5,"rank":0} , board[7][0].imagePath);
        movePieceLogically(lightKingSquare,{"file":6,"rank":0});
        movePieceLogically({"file":7,"rank":0} , {"file":5,"rank":0});
    }

    //castle light long
    else if(toBeMoved.type == "k" && sameSquare(targetSquare,{"file":2,"rank":0})){
        movePiecePhysically(lightKingSquare,targetSquare,board[lightKingSquare.file][lightKingSquare.rank].imagePath);
        movePiecePhysically( {"file":0,"rank":0} , {"file":3,"rank":0} , board[0][0].imagePath);
        movePieceLogically(lightKingSquare,{"file":2,"rank":0});
        movePieceLogically({"file":0,"rank":0} , {"file":3,"rank":0});
    }

    //castle dark short
    else if(toBeMoved.type == "k" && sameSquare(targetSquare,{"file":6,"rank":7})){
        movePiecePhysically(darkKingSquare,targetSquare,board[darkKingSquare.file][darkKingSquare.rank].imagePath);
        movePiecePhysically( {"file":7,"rank":7} , {"file":5,"rank":7} , board[7][7].imagePath);
        movePieceLogically(darkKingSquare,{"file":6,"rank":7});
        movePieceLogically({"file":7,"rank":7} , {"file":5,"rank":7});
    }

    //castle dark long
    else if(toBeMoved.type == "k" && sameSquare(targetSquare,{"file":2,"rank":7})){
        movePiecePhysically(darkKingSquare,targetSquare,board[darkKingSquare.file][darkKingSquare.rank].imagePath);
        movePiecePhysically( {"file":0,"rank":7} , {"file":3,"rank":7} , board[0][7].imagePath);
        movePieceLogically(darkKingSquare,{"file":2,"rank":0});
        movePieceLogically({"file":0,"rank":7} , {"file":3,"rank":7});
    }
    else{
    movePieceLogically(coord1,coord2)
    movePiecePhysically(coord1,coord2,board[coord2.file][coord2.rank].imagePath)
    }
    
    if(toBeMoved.type == "k"){

        if(lightsTurn){
        lightKingSquare = targetSquare
        }else{
        darkKingSquare = targetSquare
        }
        board[lightKingSquare.file][lightKingSquare.rank].canCastle = false;  
    }

    if(toBeMoved.type == "r"){
        board[targetSquare.file][targetSquare.rank].canCastle = false;  
    }

    if(squareInCheckFrom("dark",lightKingSquare) && kingMated("light") ) displayVictoryFor("dark");
    if(squareInCheckFrom("light",darkKingSquare) && kingMated("dark")  ) displayVictoryFor("light");


    if(lightsTurn){    
        lightsTurn = false;  
    }else{
        lightsTurn = true;
    }

    return true;
}

function kingMated(color){

    if(color == "light"){
        return(getAllLegalMovesFor("light").length == 0)
    }else{
        return(getAllLegalMovesFor("dark").length == 0)
    }


}

//Looks at a certain square and returns true if it is being threatened by the specified color
function squareInCheckFrom(color , targetSquare){


    let enemyColor = color
    let file = targetSquare.file
    let rank = targetSquare.rank


    //Checks attacks by pawns

    if(enemyColor == "light"){
        if(file>=1 && rank>=1 &&
            board[file-1][rank-1] != null && 
            board[file-1][rank-1].type == "p" && 
            board[file-1][rank-1].color == enemyColor){return true;}
        if(targetSquare.file<=6 && rank>=1 &&
            board[file+1][rank-1] != null && 
            board[file+1][rank-1].type == "p" && 
            board[file+1][rank-1].color == enemyColor){return true;}
   
   
    }else{
        if(file>=1 && rank<=6 &&
            board[file-1][rank+1] != null && 
            board[file-1][rank+1].type == "p" && 
            board[file-1][rank+1].color == enemyColor){return true;}
        if(targetSquare.file<=6 && rank>=1 &&
            board[file+1][rank+1] != null && 
            board[file+1][rank+1].type == "p" && 
            board[file+1][rank+1].color == enemyColor){return true;}
    }

    //Checks for attacks on diagonals

    i = file+1
    j = rank+1

    while(i < 8 && j < 8){
        if(board[i][j]==null || board[i][j].type == "k"){
             
        }else if(board[i][j].color != enemyColor || ( board[i][j].type != "b" && board[i][j].type != "q" )){
            break;
        }else if(board[i][j].type == "b" || board[i][j].type == "q" && board[i][j].color == enemyColor){
            {return true;}
        }
        i++;
        j++;
    }

    i = file-1
    j = rank+1

    while(i >= 0 && j < 8){
        if(board[i][j]==null || board[i][j].type == "k"){
             
        }else if(board[i][j].color != enemyColor  || ( board[i][j].type != "b" && board[i][j].type != "q" )){
            break;
        }else if(board[i][j].type == "b" || board[i][j].type == "q" && board[i][j].color == enemyColor){
            {return true;}
        }
        i--;
        j++;
    }

    i = file-1
    j = rank-1

    while(i >= 0 && j >= 0){
        if(board[i][j]==null || board[i][j].type == "k"){
             
        }else if(board[i][j].color != enemyColor  || ( board[i][j].type != "b" && board[i][j].type != "q" )){
            break;
        }else if(board[i][j].type == "b" || board[i][j].type == "q" && board[i][j].color == enemyColor){
            {return true;}
        }
        i--;
        j--;
    }

    i = file+1
    j = rank-1

    while(i < 8 && j >= 0){
        if(board[i][j]==null || board[i][j].type == "k"){
             
        }else if(board[i][j].color != enemyColor || ( board[i][j].type != "b" && board[i][j].type != "q" )){
            break;
        }else if(board[i][j].type == "b" || board[i][j].type == "q" && board[i][j].color == enemyColor){
            {return true;}
        }
        i++;
        j--;
    }

    //checks for threats on ranks and files

    for(i = rank+1 ; i < 8 ; i++){
        if(board[file][i]==null || board[file][i].type == "k"){

        }
        else if(board[file][i].color != enemyColor  || ( board[file][i].type != "q" && board[file][i].type != "r" )){
            break;
        }else if(board[file][i].color == enemyColor && board[file][i].type == "q" ||board[file][i].type == "r") {
            {return true;}
        }

    }
    for(i = rank-1 ; i >= 0 ; i--){    
        if(board[file][i]==null || board[file][i].type == "k"){

        }
        else if(board[file][i].color != enemyColor || ( board[file][i].type != "q" && board[file][i].type != "r" )){
            break;
        }else if(board[file][i].color == enemyColor && board[file][i].type == "q" ||board[file][i].type == "r") {
            {return true;}
        }
    }
    for(i = file+1 ; i < 8 ; i++){
        
        if(board[i][rank]==null || board[i][rank].type == "k"){

        }
        else if(board[i][rank].color != enemyColor || ( board[i][rank].type != "q" && board[i][rank].type != "r" )){
            break;
        }else if(board[i][rank].color == enemyColor && board[i][rank].type == "q" ||board[i][rank].type == "r") {
            {return true;}
        }

    }
    for(i = file-1 ; i >= 0 ; i--){

        if(board[i][rank]==null || board[i][rank].type == "k"){

        }
        else if(board[i][rank].color != enemyColor || ( board[i][rank].type != "q" && board[i][rank].type != "r" )){
            break;
        }else if(board[i][rank].color == enemyColor && board[i][rank].type == "q" ||board[i][rank].type == "r") {
            {return true;}
        }

    }

    //checks for threats on knight moves
        if(typeof(board[file+1]) != "undefined" && typeof(board[file+1][rank+2]) != "undefined" && board[file+1][rank+2] != null && board[file+1][rank+2].color == enemyColor && board[file+1][rank+2].type == "n") return true;
        if(typeof(board[file+1]) != "undefined" && typeof(board[file+1][rank-2]) != "undefined" && board[file+1][rank-2] != null && board[file+1][rank-2].color == enemyColor && board[file+1][rank-2].type == "n") return true;
        if(typeof(board[file+2]) != "undefined" && typeof(board[file+2][rank+1]) != "undefined" && board[file+2][rank+1] != null && board[file+2][rank+1].color == enemyColor && board[file+2][rank+1].type == "n") return true;
        if(typeof(board[file+2]) != "undefined" && typeof(board[file+2][rank-1]) != "undefined" && board[file+2][rank-1] != null && board[file+2][rank-1].color == enemyColor && board[file+2][rank-1].type == "n") return true;
        if(typeof(board[file-1]) != "undefined" && typeof(board[file-1][rank+2]) != "undefined" && board[file-1][rank+2] != null && board[file-1][rank+2].color == enemyColor && board[file-1][rank+2].type == "n") return true;
        if(typeof(board[file-1]) != "undefined" && typeof(board[file-1][rank-2]) != "undefined" && board[file-1][rank-2] != null && board[file-1][rank-2].color == enemyColor && board[file-1][rank-2].type == "n") return true;
        if(typeof(board[file-2]) != "undefined" && typeof(board[file-2][rank+1]) != "undefined" && board[file-2][rank+1] != null && board[file-2][rank+1].color == enemyColor && board[file-2][rank+1].type == "n") return true;
        if(typeof(board[file-2]) != "undefined" && typeof(board[file-2][rank-1]) != "undefined" && board[file-2][rank-1] != null && board[file-2][rank-1].color == enemyColor && board[file-2][rank-1].type == "n") return true;

    //checks for king threats
        if(typeof(board[file+1]) != "undefined" && typeof(board[file+1][rank+1]) != "undefined" && board[file+1][rank+1] != null && board[file+1][rank+1].color == enemyColor && board[file+1][rank+1].type == "k") return true;
        if(typeof(board[file+1]) != "undefined" && typeof(board[file+1][rank]) != "undefined" && board[file+1][rank] != null && board[file+1][rank].color == enemyColor && board[file+1][rank].type == "k") return true;
        if(typeof(board[file+1]) != "undefined" && typeof(board[file+1][rank-1]) != "undefined" && board[file+1][rank-1] != null && board[file+1][rank-1].color == enemyColor && board[file+1][rank-1].type == "k") return true;
        if(typeof(board[file]) != "undefined" && typeof(board[file][rank-1]) != "undefined" && board[file][rank-1] != null && board[file][rank-1].color == enemyColor && board[file][rank-1].type == "k") return true;
        if(typeof(board[file-1]) != "undefined" && typeof(board[file-1][rank-1]) != "undefined" && board[file-1][rank-1] != null && board[file-1][rank-1].color == enemyColor && board[file-1][rank-1].type == "k") return true;
        if(typeof(board[file-1]) != "undefined" && typeof(board[file-1][rank]) != "undefined" && board[file-1][rank] != null && board[file-1][rank].color == enemyColor && board[file-1][rank].type == "k") return true;
        if(typeof(board[file-1]) != "undefined" && typeof(board[file-1][rank+1]) != "undefined" && board[file-1][rank+1] != null && board[file-1][rank+1].color == enemyColor && board[file-1][rank+1].type == "k") return true;
        if(typeof(board[file]) != "undefined" && typeof(board[file][rank+1]) != "undefined" && board[file][rank+1] != null && board[file][rank+1].color == enemyColor && board[file][rank+1].type == "k") return true;

    return false;
}

//checks if a move from one square to another is a legal move for that piece, and tests if the move puts the king in check, regardless of whose turn it is
function isLegalMove(coord1,coord2){
    
    let toBeMoved = board[coord1.file][coord1.rank]
    let targetSquare = coord2
    
    //cannot attempt to move out of bounds

    if(targetSquare.file > 7 || targetSquare.file < 0 ||  targetSquare.rank < 0 || targetSquare.rank > 7) return false;
    
    //cannot move if it is not your turn
    //if(lightsTurn && toBeMoved.color == "dark" || !lightsTurn && toBeMoved.color == "light") return false;

    //you cannot move to the same square
    if(sameSquare(toBeMoved,targetSquare))return false;
    
    //pieces cant capture pieces of same color
    if(toBeMoved.color == "light"){
        if(board[targetSquare.file][targetSquare.rank] != null && board[targetSquare.file][targetSquare.rank].color == "light") return false

    }else{
        if(board[targetSquare.file][targetSquare.rank] != null &&  board[targetSquare.file][targetSquare.rank].color == "dark") return false
    }

    //piece specific movement rules
    switch(toBeMoved.type)
    {
        //==============================Knight=================================
        case "n":{
            if(coord1.rank+2 == targetSquare.rank && (coord1.file+1 == targetSquare.file || coord1.file-1 == targetSquare.file))return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
            if(coord1.rank-2 == targetSquare.rank && (coord1.file+1 == targetSquare.file || coord1.file-1 == targetSquare.file))return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
            if(coord1.rank+1 == targetSquare.rank && (coord1.file+2 == targetSquare.file || coord1.file-2 == targetSquare.file))return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
            if(coord1.rank-1 == targetSquare.rank && (coord1.file+2 == targetSquare.file || coord1.file-2 == targetSquare.file))return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
            return false;
        }break;
        //==============================Pawn=================================
        case "p":{
            if(toBeMoved.color == "light"){
                //cannot move backwards
                if(targetSquare.rank <= coord1.rank) return false;
                //pawn can move two squares only on first move
                if((targetSquare.rank >= coord1.rank+2 && coord1.rank != 1) || targetSquare.rank >= coord1.rank+3) return false;
                //pawns cannot capture forwards
                if(coord1.file == targetSquare.file && board[targetSquare.file][targetSquare.rank] != null) return false;
                //checks if a legal capture can be made on either side
                if(targetSquare.rank == coord1.rank+1 && targetSquare.file == coord1.file+1 && board[targetSquare.file][targetSquare.rank] != null) {
                    if(targetSquare.rank == 7) promote();
                    break;
                }
                if(targetSquare.rank == coord1.rank+1 && targetSquare.file == coord1.file-1 && board[targetSquare.file][targetSquare.rank] != null){ 
                    if(targetSquare.rank == 7) promote();
                    break;
                }
                //ensures pawns stay on file
                if(coord2.file != coord1.file) return false;
                //promotes if on last rank
                if(targetSquare.rank == 7) promote();
            }else{       
                //cannot move backwards         
                if(targetSquare.rank >= coord1.rank) return false;
                //pawn can move two squares only on first move
                if((targetSquare.rank <= coord1.rank-2 && coord1.rank != 6) || targetSquare.rank <= coord1.rank-3) return false;
                //pawns cannot capture forwards
                if(coord1.file == targetSquare.file && board[targetSquare.file][targetSquare.rank] != null) return false;  
                //checks if a legal capture can be made on either side
                if(targetSquare.rank == coord1.rank-1 && targetSquare.file == coord1.file+1 && board[targetSquare.file][targetSquare.rank] != null) {
                    if(targetSquare.rank == 0) promote(targetSquare);
                    break;
                }
                if(targetSquare.rank == coord1.rank-1 && targetSquare.file == coord1.file-1 && board[targetSquare.file][targetSquare.rank] != null) {
                    if(targetSquare.rank == 0) promote(targetSquare);
                    break;
                }
                //ensures pawns stay on file
                if(coord2.file != coord1.file) return false;
                //promotes if on first rank
                if(targetSquare.rank == 0) promote(targetSquare);
            }
        }break;
        //==============================Bishop=================================
        case "b":{
            //Looks in every diagonal direction and compiles a list of legal moves.
            //If the attempted move is in the list the move can be made.

            let legalMoves = []
            let rank = toBeMoved.rank
            let file = toBeMoved.file

            i = file+1
            j = rank+1

            while(i < 8 && j < 8){
                if(board[i][j]==null){
                    legalMoves.push({"file":i,"rank":j})
                }
                else if(board[i][j].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":j})
                    break;
                }else{
                    break;
                }
                i++;
                j++;
            }

            i = file-1
            j = rank+1

            while(i >= 0 && j < 8){
                if(board[i][j]==null){
                    legalMoves.push({"file":i,"rank":j})
                }
                else if(board[i][j].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":j})
                    break;
                }else{
                    break;
                }
                i--;
                j++;
            }

            i = file-1
            j = rank-1

            while(i >= 0 && j >= 0){
                if(board[i][j]==null){
                    legalMoves.push({"file":i,"rank":j})
                }
                else if(board[i][j].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":j})
                    break;
                }else{
                    break;
                }
                i--;
                j--;
            }

            i = file+1
            j = rank-1

            while(i < 8 && j >= 0){
                if(board[i][j]==null){
                    legalMoves.push({"file":i,"rank":j})
                }
                else if(board[i][j].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":j})
                    break;
                }else{
                    break;
                }
                i++;
                j--;
            }

            for(i = 0 ; i < legalMoves.length ; i++){
                if(sameSquare(targetSquare, legalMoves[i])) return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
            }
            return false;

        }break;
        //==============================Rook=================================
        case "r":{
            //Looks in every direction and compiles a list of legal moves.
            //If the attempted move is in the list the move can be made.
        
            let legalMoves = []
            let rank = toBeMoved.rank
            let file = toBeMoved.file
            for(i = rank+1 ; i < 8 ; i++){
                if(board[file][i]==null){
                    legalMoves.push({"file":file,"rank":i})
                }
                else if(board[file][i].color != toBeMoved.color){
                    legalMoves.push({"file":file,"rank":i})
                    break;
                }else{
                    break;
                }

            }
            for(i = rank-1 ; i >= 0 ; i--){    
                if(board[file][i]==null){
                    legalMoves.push({"file":file,"rank":i})
                }
                else if(board[file][i].color != toBeMoved.color){
                    legalMoves.push({"file":file,"rank":i})
                    break;
                }else{
                    break;
                }
            }
            for(i = file+1 ; i < 8 ; i++){
                
                if(board[i][rank]==null){
                    legalMoves.push({"file":i,"rank":rank})
                }
                else if(board[i][rank].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":rank})
                    break;
                }else{
                    break;
                }

            }
            for(i = file-1 ; i >= 0 ; i--){

                if(board[i][rank]==null){
                    legalMoves.push({"file":i,"rank":rank})
                }
                else if(board[i][rank].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":rank})
                    break;
                }else{
                    break;
                }

            }

            for(i = 0 ; i < legalMoves.length ; i++){
                if(sameSquare(targetSquare, legalMoves[i])){
                    return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
                }
            }
            return false;

        }break;
        //==============================King=================================
        case "k":{

            //checks if it is legal to move the king to a certain square or castle

            if(toBeMoved.color == "light"){
                if(squareInCheckFrom("dark",targetSquare)){
                    return false;
                }
            }else{
                if(squareInCheckFrom("light",targetSquare)){
                    return false;
                }
            }
            //try to castle light short
            if(toBeMoved.color == "light" && targetSquare.rank == 0 && targetSquare.file == 6 && toBeMoved.canCastle && board[7][0] != null && board[7][0].canCastle){
                if(board[5][0]==null && board[6][0] == null && !squareInCheckFrom("dark",{"file":4,"rank":0}) && !squareInCheckFrom("dark",{"file":5,"rank":0}) && !squareInCheckFrom("dark",{"file":6,"rank":0})){
                    return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
                }
            }
            //try to castle light long
            if(toBeMoved.color == "light" && targetSquare.rank == 0 && targetSquare.file == 2 && toBeMoved.canCastle && board[0][0] != null && board[0][0].canCastle){
                if(board[1][0]==null && board[2][0] == null && board[3][0] == null && !squareInCheckFrom("dark",{"file":2,"rank":0}) && !squareInCheckFrom("dark",{"file":3,"rank":0}) && !squareInCheckFrom("dark",{"file":4,"rank":0})){
                    return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
                }
            }

            //try to castle dark short
            if(toBeMoved.color == "dark" && targetSquare.rank == 7 && targetSquare.file == 6 && toBeMoved.canCastle && board[7][7] != null && board[7][7].canCastle){
                if(board[5][7]==null && board[6][7] == null && !squareInCheckFrom("light",{"file":4,"rank":7}) && !squareInCheckFrom("light",{"file":5,"rank":7}) && !squareInCheckFrom("light",{"file":6,"rank":7})){
                    return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
                }
            }

            //try to castle dark long
            if(toBeMoved.color == "dark" && targetSquare.rank == 7 && targetSquare.file == 2 && toBeMoved.canCastle && board[0][7] != null  && board[0][7].canCastle){
                if(board[1][7]==null && board[2][7] == null && board[3][7] == null && !squareInCheckFrom("light",{"file":2,"rank":7}) && !squareInCheckFrom("light",{"file":3,"rank":7}) && !squareInCheckFrom("light",{"file":4,"rank":7})){
                    return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
            }
        }

        if(Math.abs(targetSquare.rank - toBeMoved.rank) <= 1 && Math.abs(targetSquare.file - toBeMoved.file) <= 1){     

            return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
        }

            return false;
        }
        break;
        //==============================Queen=================================
        
        // combination of rook and bishop movement rules
        case "q":{
            let legalMoves = []
            let rank = toBeMoved.rank
            let file = toBeMoved.file
            for(i = rank+1 ; i < 8 ; i++){
                if(board[file][i]==null){
                    legalMoves.push({"file":file,"rank":i})
                }
                else if(board[file][i].color != toBeMoved.color){
                    legalMoves.push({"file":file,"rank":i})
                    break;
                }else{
                    break;
                }

            }
            for(i = rank-1 ; i >= 0 ; i--){    
                if(board[file][i]==null){
                    legalMoves.push({"file":file,"rank":i})
                }
                else if(board[file][i].color != toBeMoved.color){
                    legalMoves.push({"file":file,"rank":i})
                    break;
                }else{
                    break;
                }
            }
            for(i = file+1 ; i < 8 ; i++){
                
                if(board[i][rank]==null){
                    legalMoves.push({"file":i,"rank":rank})
                }
                else if(board[i][rank].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":rank})
                    break;
                }else{
                    break;
                }

            }
            for(i = file-1 ; i >= 0 ; i--){

                if(board[i][rank]==null){
                    legalMoves.push({"file":i,"rank":rank})
                }
                else if(board[i][rank].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":rank})
                    break;
                }else{
                    break;
                }

            }

            i = file+1
            j = rank+1

            while(i < 8 && j < 8){
                if(board[i][j]==null){
                    legalMoves.push({"file":i,"rank":j})
                }
                else if(board[i][j].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":j})
                    break;
                }else{
                    break;
                }
                i++;
                j++;
            }

            i = file-1
            j = rank+1

            while(i >= 0 && j < 8){
                if(board[i][j]==null){
                    legalMoves.push({"file":i,"rank":j})
                }
                else if(board[i][j].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":j})
                    break;
                }else{
                    break;
                }
                i--;
                j++;
            }

            i = file-1
            j = rank-1

            while(i >= 0 && j >= 0){
                if(board[i][j]==null){
                    legalMoves.push({"file":i,"rank":j})
                }
                else if(board[i][j].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":j})
                    break;
                }else{
                    break;
                }
                i--;
                j--;
            }

            i = file+1
            j = rank-1

            while(i < 8 && j >= 0){
                if(board[i][j]==null){
                    legalMoves.push({"file":i,"rank":j})
                }
                else if(board[i][j].color != toBeMoved.color){
                    legalMoves.push({"file":i,"rank":j})
                    break;
                }else{
                    break;
                }
                i++;
                j--;
            }


            for(i = 0 ; i < legalMoves.length ; i++){
                if(sameSquare(targetSquare, legalMoves[i])) return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);
            }
            return false;
        }break;
    }  


    return !putsKingInCheck(toBeMoved.color,{"file":coord1.file,"rank":coord1.rank} , targetSquare);

}

function promote(coord1){
    console.log("promote")
}

function displayVictoryFor(color){
    if(color == "light"){
        console.log("white wins")
    }else{
        console.log("black wins")
    }
}

//Checks if a move from one coordinate to another will put the king in check. Cannot yet check for en passant
function putsKingInCheck(color,originalSquare,endSquare){

    let result = false;


    // saves a copy of the original board
    const originalBoard = []

    const originalDarkKingSquare = darkKingSquare
    const originalLightKingSquare = lightKingSquare

    for(i = 0 ; i < 8 ; i++){
        originalBoard[i] = board[i].slice()
    }


    let rank1 = originalSquare.rank
    let file1 = originalSquare.file

    let rank2 = endSquare.rank
    let file2 = endSquare.file

    if(board[file1][rank1].type == "k" && board[file1][rank1].color == "light") lightKingSquare = {"file":file2,"rank":rank2};
    if(board[file1][rank1].type == "k" && board[file1][rank1].color == "dark") darkKingSquare = {"file":file2,"rank":rank2};

    //performs a said move on the game board

    board[file2][rank2] = board[file1][rank1]
    board[file2][rank2].file = file2
    board[file2][rank2].rank = rank2
    board[file1][rank1] = null

    //checks if the move puts the king in check or not

    if(color == "light"){
        result = squareInCheckFrom("dark",lightKingSquare)
    }else{
        result = squareInCheckFrom("light",darkKingSquare)
    }

    //copies board back to original state

    for(i = 0 ; i < 8 ; i++){
        board[i] = originalBoard[i].slice()
    }
    darkKingSquare = originalDarkKingSquare 
    lightKingSquare = originalLightKingSquare

    //if(result == true) console.log("the king cannot be in check") 
    
    //return whether a certain move put the king in check

    return result;

}

function sameSquare(coord1,coord2){
    return(coord1.rank == coord2.rank && coord1.file == coord2.file)
}

function initializeBoard(){



    board = new Array(8);

    for(i = 0 ; i < board.length; i++){
        board[i] = new Array(8);
    }

    for(i = 0 ; i < 8 ; i++){
        for(j = 0 ; j < 8 ; j++){
            board[i][j] = null;
        }
    }

    for(i = 0 ; i < 8 ; i++){
        board[i][1] = new Pawn("light",i,1) ;
        board[i][6] = new Pawn("dark",i,6) ;
    }

    board[0][0] = new Rook("light",0,0,true);
    board[7][0] = new Rook("light",7,0,true);
    board[1][0] = new Knight("light",1,0);
    board[6][0] = new Knight("light",6,0);
    board[2][0] = new Bishop("light",2,0);
    board[5][0] = new Bishop("light",5,0);
    board[3][0] = new Queen("light",3,0);
    board[4][0] = new King("light",4,0,true);

    board[0][7] = new Rook("dark",0,7,true);
    board[7][7] = new Rook("dark",7,7,true);
    board[1][7] = new Knight("dark",1,7);
    board[6][7] = new Knight("dark",6,7);
    board[2][7] = new Bishop("dark",2,7);
    board[5][7] = new Bishop("dark",5,7);
    board[3][7] = new Queen("dark",3,7);
    board[4][7] = new King("dark",4,7,true);



    for(i = 0 ; i < 8 ; i++){
        for(j = 0 ; j < 8 ; j++){
            if(board[i][j] != null){

                boardContainer.innerHTML+=`<img id = "${i.toString()+j.toString()}" class = "piece" src = "${board[i][j].imagePath}"
                        style = "left:${board[i][j].file*(squareSize)}px; 
                                bottom:${board[i][j].rank*(squareSize)}px; "
                        >`
            }
        }
    }

}

initializeBoard()