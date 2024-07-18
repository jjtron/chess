NODE MODULE HACK:

In the file: /node_modules/chess/@types/chess/chess.d.ts

The following line (line 61) has to be hacked . . .

    FROM:   type ChessEvent = 'check' | 'checkmate'

    TO:     type ChessEvent = 'check' | 'checkmate' | 'capture' | 'promote'

or a typescript error will become evident, and will fail to compile

THE SOURCE FOR THE /public/stockfish.js FILE:
https://github.com/avinayak/chess/blob/master/public/stockfish.js

