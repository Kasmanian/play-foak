import { s } from '../data/solutions.js'
export default class Game {
    constructor(game) {
        if (game!=undefined) {
            this.state = game.state;
            this.listeners = { move: [], win: [], lose: [] };
            this.displaced = game.displaced;
            this.moved = game.moved;
            this.x = game.x;
            this.y = game.y;
            this.x_old = game.x_old;
            this.y_old = game.y_old;
            this.board = game.board;
            this.mnext = game.mnext;
            this.moves = game.moves;
            this.hnt = game.hnt;
        } else {
            this.listeners = { move: [], win: [], lose: [] };
            this.displaced = [];
            this.moved = ''
            this.x = 2;
            this.y = 2;
            this.x_old = 2;
            this.y_old = 2;
            this.board = this.init();
            this.mnext = { 0: 1, 1: 1 };
            this.moves = 0;
            this.shuffle();
            this.mnext = { 0: 1, 1: 1 };
            this.moves = 0;
        }
    }

    init() {
        return s[Math.floor(new Date()/8.64e7-19067)%s.length];
    }
    move(e, i) {
        if (i > 4 || i < 0)
            return;
        let x = this.x;
        let y = this.y;
        let b = this.board;
        switch (e) {
            case 0: // u<=>d
                if (i != x) {
                    this.displaced.length = 0;
                    for (let j = 0; j < 5; j++)
                        if (j != y) {
                            [b[j * 5 + i], b[j * 5 + x]] = [b[j * 5 + x], b[j * 5 + i]];
                            this.displaced.push(j * 5 + i);
                            this.moved = i-this.x>0? 'right' : 'left';
                        }
                    this.x_old = this.x;
                    this.x = i;
                    if (this.mnext[0]==1) this.moves++;
                    this.mnext[0] = 0;
                    this.mnext[1] = 1;
                }
                break;
            case 1: // l<=>r
                if (i != y) {
                    this.displaced.length = 0;
                    for (let j = 0; j < 5; j++)
                        if (j != x) {
                            [b[i * 5 + j], b[y * 5 + j]] = [b[y * 5 + j], b[i * 5 + j]];
                            this.displaced.push(i * 5 + j);
                            this.moved = i-this.y>0? 'down' : 'up';
                        }
                    this.y_old = this.y;
                    this.y = i;
                    if (this.mnext[1]==1) this.moves++;
                    this.mnext[1] = 0;
                    this.mnext[0] = 1;
                }
                break;
            case 2: // solve
                this.board = this.init();
                break;
        }
        this.hints();
        if (this.boolean()) this.update(this.listeners['win']);
        else if (Object.keys(this.hnt).length>8) this.update(this.listeners['lose']);
        this.update(this.listeners['move']);
    }
    shuffle() {
        let x = [0, 1, 3, 4];
        let y = [0, 1, 3, 4];
        var rms =  String(BigInt(Math.floor(new Date()/8.64e7)**54)).split('').map((num)=>{
            return Number(num);
        });
        for (let i = 0; i < rms.length; i++) {
            let j = rms[i]%3;
            if (i % 2 != 1) {
                this.move(0, y[j]);
                y[j] = this.y;
            } else {
                this.move(1, x[j]);
                x[j] = this.x;
            }
        }
        this.move(0, 2);
        this.move(1, 2);
        this.x_old = 2;
        this.y_old = 2;
        if (Object.keys(this.hnt).length>7) this.shuffle();
    }
    boolean() {
        let col = [{}, {}, {}, {}, {}];
        let row = [{}, {}, {}, {}, {}];
        for (let i = 0; i < 25; i++) {
            let r = Math.floor(i/5);
            let c = i%5;
            let t = this.board[i];
            if (col[c][t]!=undefined) return false;
            col[c][t] = 1;
            if (row[r][t]!=undefined) return false;
            row[r][t] = 1;
        }
        return true;
    }
    hints() {
        let col = [[], [], [], [], []];
        let row = [[], [], [], [], []];
        for (let i = 0; i < 25; i++) {
            let r = Math.floor(i/5);
            let c = i%5;
            let t = this.board[i];
            col[c].push(t);
            row[r].push(t);
        }
        let hnt = {}
        for (let i = 0; i < 5; i++) {
            let r = row[this.y][i];
            row[this.y][i] = -1; col[i][this.y] = -1;
            if (row[this.y].includes(r)|col[i].includes(r)) hnt[this.y * 5 + i] = 1;
            row[this.y][i] = r;  col[i][this.y] = r;
            let c = col[this.x][i];
            col[this.x][i] = -1; row[i][this.x] = -1;
            if (col[this.x].includes(c)|row[i].includes(c)) hnt[i * 5 + this.x] = 1;
            col[this.x][i] = c;  row[i][this.x] = c;
        }
        this.hnt = hnt;
    }
    onMove(callBack) {
        this.listeners['move'].push(callBack);
    }
    onWin(callBack) {
        this.listeners['win'].push(callBack);
    }
    onLose(callBack) {
        this.listeners['lose'].push(callBack);
    }
    update(event) {
        for (const listener of event) {
            listener(this.board);
        }
    }
    print() {
        console.log(this.board);
    }
}