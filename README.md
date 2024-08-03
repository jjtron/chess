NODE MODULE HACK:

In the file: /node_modules/chess/@types/chess/chess.d.ts

The following line (line 61) has to be hacked . . .

    FROM:   type ChessEvent = 'check' | 'checkmate'

    TO:     type ChessEvent = 'check' | 'checkmate' | 'capture' | 'promote'

or a typescript error will become evident, and will fail to compile

THE SOURCE FOR THE /public/stockfish.js FILE:
https://github.com/avinayak/chess/blob/master/public/stockfish.js

PRODUCTION LAUNCH
1.  on the production server . . .

 a) pm2 stop id#
    where # = web-socket app (/home/chess/ws/app.js), process '.env.production app'

 b) pm2 stop id#
    where # = chess-app (/home/chess), process 'PORT=3002 npm run start'

 c) rm /home/chess.zip

 d) rm -rf /home/chess/

2.  in VSCode: npm run build

3.  zip the chess/ directory

4.  scp ~/Documents/ReactProjects/chess.zip root@159.203.165.202:/home/

1.  on the production server . . .

 a) in home directory: unzip chess.zip

 b) in home directory: sudo chown -R jjtron:jjtron chess/

 c) cd chess/ws
    and
    pm2 start id# of process '.env.production app'
    (
      to start the process from scratch, i.e. '.env.production app' in pm2 list doesn't exist, then run  . . .

        pm2 start 'PORT=3003 node --env-file=../.env.production app.js'
        
      in the /home/chess/ws/ dir
    )
  
 d) cd ../ (up into the /home/chess/ dir)

 e) pm2 start id# of process 'PORT=3002 npm run start'
    (
      to start the process from scratch, i.e. 'PORT=3002 npm run start' in pm2 list doesn't exist, then run  . . .

        pm2 start 'PORT=3002 npm run start'
        
      in the /home/chess/ dir
    )

