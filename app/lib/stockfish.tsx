export var stockfish: any = (() => {
    if (typeof Worker !== 'undefined') {
        return new Worker("/stockfish.js");
    }
})();