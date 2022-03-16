import Game from "./engine/game.js";
var game;
var time;
var boardState;
var isPaused;
var date;
var last;
var gamesPlayed;
var percentWon;
var currentStreak;
var maxStreak;
var averageTime;
var averageMoves;
var sec = 0;
var keydir = { 87: 1, 65: 0, 83: 1, 68: 0, 38: 1, 37: 0, 40: 1, 39: 0, 'w': 1, 'a': 0, 's': 1, 'd': 0 };
//              w      a      s      d      ^      <      v      >
// 32: 2
var unicode = {
    'none': '\u{2B1C}',
    'blk0': '\u{2B1B}',
    'blk3': '\u{2663}',
    'blk4': '\u{2660}',
    'red0': '\u{1F7E5}',
    'red2': '\u{2666}',
    'red5': '\u{2665}'
}

var keyfun = { 
    87:  ()=> {return game.y-1}, 
    65:  ()=> {return game.x-1}, 
    83:  ()=> {return game.y+1},
    68:  ()=> {return game.x+1},
    38:  ()=> {return game.y-1}, 
    37:  ()=> {return game.x-1}, 
    40:  ()=> {return game.y+1},
    39:  ()=> {return game.x+1},
    'w': ()=> {return game.y-1}, 
    'a': ()=> {return game.x-1}, 
    's': ()=> {return game.y+1},
    'd': ()=> {return game.x+1}
};
// 32: ()=> {return game.x}

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

const renderBoardState = function(board) {
    let isMobile = window.mobileCheck();
    let newb = ``;
    switch(boardState) {
        case 0:
            let state = game.state;
            let tiles = ``;
            for (let i=0; i<25; i++) {
                let tile = board[i];
                let theme = ``;
                let popClass = ``;
                if (state!=undefined) {
                    popClass = `pop-all`;
                    if (state) theme = `right${tile}`; else theme = `wrong${tile}`;
                } else {
                    popClass = game.x_old==game.x&game.y_old==game.y? `` : !game.displaced.includes(i)? `` : `pop-${game.moved}`;
                    theme = i%5!=game.x&Math.floor(i/5)!=game.y? `blank${tile}` : game.hnt[i]!=undefined? `wrong${tile}` : `right${tile}`;
                }
                let selClass = `style="background: url('./assets/${theme}.ico'); background-size: cover;"`;
                tiles+=`<div class="grid-item ${popClass}" ${selClass}><div></div></div>`;
            }
            newb = `<div id="board" class="grid">${tiles}</div>`;
            break;
        case 1:
            newb = `<div id="board" class="howto-display">
                        <div class="howto-header">
                            <p class="htp">HOW TO PLAY</p>
                            <p class="btn-exit">x</p>
                        </div>
                        <div class="howto-intro">
                            <p>Move the tiles until every row and column shows only one of each of the five suits.</p>
                            <p>As you move the tiles, their suits will change color to show if there are others like it in the same row or column.</p>
                        </div>
                        <div class="howto-body">
                            <div class="howto-wrong">
                                <div class="tile-list">
                                    <div class="tile pop-all" style="background: url('./assets/blank1.ico'); background-size: cover;"></div>
                                    <div class="tile pop-all" style="background: url('./assets/blank2.ico'); background-size: cover;"></div>
                                    <div class="tile pop-all" style="background: url('./assets/blank3.ico'); background-size: cover;"></div>
                                    <div class="tile pop-all" style="background: url('./assets/blank4.ico'); background-size: cover;"></div>
                                    <div class="tile pop-all" style="background: url('./assets/wrong1.ico'); background-size: cover;"></div>
                                </div>
                                <p>Above, the first suit is the same as the last suit.</p>
                            </div>
                            <div class="howto-right">
                                <div class="tile-list">
                                    <div class="tile pop-all" style="background: url('./assets/blank1.ico'); background-size: cover;"></div>
                                    <div class="tile pop-all" style="background: url('./assets/blank2.ico'); background-size: cover;"></div>
                                    <div class="tile pop-all" style="background: url('./assets/blank3.ico'); background-size: cover;"></div>
                                    <div class="tile pop-all" style="background: url('./assets/blank4.ico'); background-size: cover;"></div>
                                    <div class="tile pop-all" style="background: url('./assets/right5.ico'); background-size: cover;"></div>
                                </div>
                                <p>Above, all suits are unique.</p>
                            </div>
                        </div>
                        <div class="howto-footer">
                            <p>You win when the suits of all movable tiles are black, but <b>be careful!</b> You will lose the game if a move leaves you with only red suits!</p>
                        </div>
                    </div>`;
            break;
        case 2:
            let statsHeader = game.state==undefined? `STATISTICS` : game.state? `YOU WON!` : `YOU LOST!`;
            let shareStatus = game.state==undefined? `` : `shareable`;
            newb = `<div id="board" class="stats-display">
                        <div class="stats-header">
                            <p class="sth">${statsHeader}</p>
                            <p class="btn-exit">x</p>
                        </div>
                        <div class="stats-list">
                            <div class="stat">
                                <p class="stat-num">${gamesPlayed!=undefined? gamesPlayed : 0}</p>
                                <p class="stat-title">Played</p>
                            </div>
                            <div class="stat">
                                <p class="stat-num">${percentWon!=undefined? Math.floor(percentWon*100) : 0}</p>
                                <p class="stat-title">Win %</p>
                            </div>
                            <div class="stat">
                                <p class="stat-num">${currentStreak!=undefined? currentStreak : 0}</p>
                                <p class="stat-title">Current Streak</p>
                            </div>
                            <div class="stat">
                                <p class="stat-num">${maxStreak!=undefined? maxStreak : 0}</p>
                                <p class="stat-title">Max Streak</p>
                            </div>
                        </div>
                        <div class="avgs-header">
                            <p class="avh">PERFORMANCE</p>
                        </div>
                        <div class="avgs-list">
                            <div class="avg-moves">
                                <p class="stat">${averageMoves!=undefined? averageMoves : game.moves!=undefined? game.moves : 0}</p>
                                <p class="stat-title">Average Moves</p>
                            </div>
                            <div class="avg-time">
                                <p class="stat">${averageTime!=undefined? formatTime(averageTime) : formatTime(time)}</p>
                                <p class="stat-title">Average Time</p>
                            </div>
                        </div>
                        <div class="menu-list">
                            <div class="next-game">
                                <p class="stat-title">NEXT FOAK</p>
                                <p id="countdown" class="stat">00:00:00</p>
                            </div>
                            <div class="share">
                                <button id="copy" class="btn-share ${shareStatus}" type="button">SHARE</button>
                            </div>
                        </div>
                    </div>`
            break;
    }
    let oldb = document.getElementById("board");
    $(newb).insertAfter(oldb);
    oldb.remove();
    let newm = `<p id="moves">${game.moves}</p>`
    let oldm = document.getElementById("moves");
    $(newm).insertAfter(oldm);
    oldm.remove();
    if(isMobile&document.getElementById("controller").firstChild==undefined) {
        let ctrl = `<div id="controller" class="controller">
                        <div>
                            <button id="btn-w" class="btn-w" type="button">W</button>
                        </div>
                        <div class="AD">
                            <button id="btn-a" class="btn-a" type="button">A</button>
                            <button id="btn-d" class="btn-d" type="button">D</button>
                        </div>
                        <div>
                            <button id="btn-s" class="btn-s" type="button">S</button>
                        </div>
                    </div>`;
        let oldc = document.getElementById("controller");
        $(ctrl).insertAfter(oldc);
        oldc.remove();
        const $root = $('#root');
        $($root).on("click", ".btn-w", handleKeyPadPressed);
        $($root).on("click", ".btn-a", handleKeyPadPressed);
        $($root).on("click", ".btn-d", handleKeyPadPressed);
        $($root).on("click", ".btn-s", handleKeyPadPressed);
    }
}

const handleKeyPressed = function(event) {
   let key = event.keyCode;
   if (game!=undefined&keydir[key]!=undefined) {
       game.move(keydir[key], keyfun[key]());
   }
}

const handleKeyPadPressed = function(event) {
    let key = event.target.id[4];
    if (game!=undefined&keydir[key]!=undefined) {
        game.move(keydir[key], keyfun[key]());
    }
}

const handleHelpPressed = function(event) {
    isPaused = game.state!=undefined? true : boardState!=1? true : false;
    boardState = boardState!=1? 1 : 0;
    if (isPaused) keyOff(); else keyOn();
    renderBoardState(game.board);
}

const handleStatsPressed = function(event) {
    isPaused = game.state!=undefined? true : boardState!=2? true : false;
    boardState = boardState!=2? 2 : 0;
    if (isPaused) keyOff(); else keyOn();
    renderBoardState(game.board);
}

const handleExitPressed = function(event) {
    boardState = 0;
    isPaused = game.state!=undefined? true : false;
    keyOn();
    renderBoardState(game.board);
}

const handleSharePressed = function(event) {
    let board = game.board;
    let text = `FOAK #${date} \u{23F1} ${formatTime(time)} \u{1F503} ${game.moves}`;
    let state = game.state? `blk` : `red`;
    for (let i=0; i<25; i++) {
        let newl = i%5!=0? `` : `\n`;
        let tile = board[i];
        text += i%5!=game.x&Math.floor(i/5)!=game.y? `${newl}${unicode['none']}` 
              : tile>1&unicode[`${state}${tile}`]!=undefined? `${newl}${unicode[`${state}${tile}`]}` 
              : `${newl}${unicode[`${state}0`]}`;
    }
    navigator.clipboard.writeText(text);
    document.getElementById('copy').textContent = 'RESULTS COPIED!';
    let shareData = {
        title: `FOAK #${date}`,
        text: text,
        url: 'https://www.play-foak.com'
      }
    navigator.share(shareData);
}

const initGame = function() {
    date = Math.floor(new Date()/8.64e7)-19067;
    let state = window.localStorage.getItem(`${date-1}`)!=null||window.localStorage.getItem(`${date}`)!=null ? 0 : 1;
    window.localStorage.removeItem(`${date-1}`);
    if (window.localStorage.getItem(`${date}`)!=null) {
        let save = JSON.parse(window.localStorage.getItem(`${date}`));
        game = new Game(save['game']);
        time = save['time'];
        boardState = state;
        isPaused = save['isPaused'];
        if (game.state!=undefined) keyOff();
    } else {
        game = new Game();
        time = 0;
        boardState = state;
        isPaused = state>0;
    }
    setStats();
    onload();
    if (game.boolean()) game.update(game.listeners['win']);
    else if (Object.keys(game.hnt).length>8) game.update(game.listeners['lose']);
    document.getElementById('time').textContent = formatTime(time);
    timer();
}

const saveGame = function() {
    window.localStorage.setItem(`${date}`, JSON.stringify({
        'game': game,
        'time': time,
        'boardState': boardState,
        'isPaused': game.state!=undefined
    }));
}

const setStats = function() {
    let stats = JSON.parse(window.localStorage.getItem(`stats`));
    if (stats!=null) {
        last = stats.last;
        gamesPlayed = stats.gamesPlayed;
        percentWon = stats.percentWon;
        currentStreak = stats.currentStreak;
        maxStreak = stats.maxStreak;
        averageTime = stats.averageTime;
        averageMoves = stats.averageMoves;  
    }
}

const saveStats = function() {
    if (last!=date) {
        let winInt = game.state? 1 : 0;
        gamesPlayed = gamesPlayed!=undefined? gamesPlayed+1 : 1;
        currentStreak = currentStreak==undefined? winInt : game.state? currentStreak+1 : 0;
        window.localStorage.setItem('stats', JSON.stringify({
            'last': date,
            'gamesPlayed': gamesPlayed,
            'percentWon': percentWon!=undefined? (percentWon*(gamesPlayed-1)+winInt)/gamesPlayed : winInt,
            'currentStreak': currentStreak,
            'maxStreak': maxStreak!=undefined? Math.max(maxStreak, currentStreak) : currentStreak,
            'averageTime': averageTime!=undefined? Math.ceil((averageTime+time)/2) : time,
            'averageMoves': averageMoves!=undefined? Math.ceil(((averageMoves+game.moves)/2)*10)/10 : game.moves
        }));
    }
}

const onload = function() {
    game.onMove(board => {
        renderBoardState(board);
    });
    
    game.onWin(async board => {
        saveGame();
        keyOff();
        await sleep(1000);
        game.state = true;
        saveStats();
        setStats();
        renderBoardState(board);
        await sleep(1000);
        if (boardState!=2) {
            boardState = 2;
            renderBoardState(board);
        }
    });
    
    game.onLose(async board => {
        saveGame();
        keyOff();
        await sleep(1000);
        game.state = false;
        saveStats();
        setStats();
        renderBoardState(board);
        await sleep(1000);
        if (boardState!=2) {
            boardState = 2;
            renderBoardState(board);
        }
    });
}

const keyOn = function() {
    keydir = { 87: 1, 65: 0, 83: 1, 68: 0, 38: 1, 37: 0, 40: 1, 39: 0, 'w': 1, 'a': 0, 's': 1, 'd': 0 };
}

const keyOff = function() {
    keydir = {};
}

const loadBoardIntoDOM = function(board) {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');
    $($root).on("click", ".btn-menu", handleHelpPressed);
    $($root).on("click", ".btn-stats", handleStatsPressed);
    $($root).on("click", ".btn-exit", handleExitPressed);
    $($root).on("click", ".shareable", handleSharePressed);
    document.onkeydown = function(e) {
        handleKeyPressed(e)
        e.preventDefault();
    };
    renderBoardState(board);
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function formatTime(t) {
    let t0 = Math.floor(t/100);
    let t1 = Math.floor(t0/60);
    t1 = t1<10? `0${t1}` : `${t1}`;
    let t2 = (t0%60)<10? `:0${t0%60}` : `:${t0%60}`;
    return t1 + t2;
}

async function timer() {
    while (true) {
        await sleep(10);
        if (!isPaused) {
            if (Object.keys(keydir).length != 0) {
                document.getElementById('time').textContent = formatTime(time);
                time+=1;
                if (time%100==0) saveGame();
            }
        }
        if (boardState==2) {
            let t0 = new Date()/1000;
            let t1 = Math.floor(new Date()/8.64e7)*24*60*60+86400;
            let tp = Math.floor(t1-t0)/86400;
            let ts = Math.floor(tp*86400)%60;
            if (document.getElementById('countdown').textContent=='00:00:00'||ts!=sec) {
                ts = ts<10? `0${ts}` : `${ts}`;
                let tm = Math.floor(tp*1440)%60;
                tm = tm<10? `0${tm}` : `${tm}`;
                let th = Math.floor(tp*24);
                th = th<10? `0${th}` : `${th}`;
                document.getElementById('countdown').textContent = `${th}:${tm}:${ts}`;
                sec = ts;
            }
        }
    }
}

initGame();

$(function() {
    loadBoardIntoDOM(game.board);
});