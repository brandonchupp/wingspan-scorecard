const DEV_MODE = false;

const SCORE_TYPES = [
    {
        'scoreHint': 'Amount on Cards',
        'classes': 'light-blue',
        'categories': [
            'Birds',
            'Bonus Cards',
            'End-of-Round Goals'
        ]
    }, {
        'scoreHint': '1 Point Each',
        'classes': 'light-green',
        'categories': [
            'Eggs',
            'Food on Cards',
            'Tucked Cards'
        ]
    }
]

class Player {
    constructor(name) {
        this.name = name;
        this.pointsByCategory = {};
        this._initCategories();
    }

    _initCategories() {
        SCORE_TYPES.forEach((scoreType) => {
            scoreType.categories.forEach((category) => {
                if (DEV_MODE) {
                    this.pointsByCategory[category] = Math.floor(Math.random() * 20);
                } else {
                    this.pointsByCategory[category] = 0;
                }
            });
        });
    }
    setPoints(category, points){
        return this.pointsByCategory[category] = points;
    }

    getPoints(category){
        return this.pointsByCategory[category];
    }

    getTotalPoints(){
        return Object.values(this.pointsByCategory).reduce((p1, p2) => p1 + p2);
    }
}
class Scorecard {
    constructor(tableSelector, players) {
        this.table = document.querySelector(tableSelector);
        this.players = players;
        this.modal = new Modal();
        this.showTotals = false;
    }

    showScores(category) {
        this.modal.setTitle(`"${category}" Scoring`);

        let modalBody = `<div id="score-category" data-category="${category}">`;
        this.players.forEach((player) => {
            let currentScore = player.getPoints(category);
            if (currentScore === 0) {
                currentScore = '';
            }
            modalBody += `<div class="update-player-points">
                <div>${player.name}</div>
                <input name="${player.name}"
                    value="${currentScore}"
                    min="0" max="999"
                    type="number" pattern="[0-9]*"/>
                </div>`;
        });

        modalBody += '</div>';
        this.modal.setBody(modalBody);
        this.modal.setFooter('<button type="button">Update</button>');
        this.modal.show();

        document.querySelector('#modal footer button').addEventListener(
            'click', () => {
                this._updateScores()
            }, false
        );
    }

    _updateScores() {
        let category = document.querySelector("#score-category").dataset.category;
        this.players.forEach((player) => {
            let newScore = parseInt(document.querySelector(`input[name="${player.name}"]`).value);
            if (newScore >= 0 && newScore < 999) {
                player.setPoints(category, newScore);
            }
        });
        this.modal.hide();
        this.render();
    }

    _renderHeader() {
        let rendered = '<thead><th></th><th>Players</th>';
        this.players.forEach((player) => {
            rendered += `<th>${player.name}</th>`
        });
        rendered += '</thead>';
        return rendered;
    }

    _renderBody() {
        let rendered = '<tbody>';
        SCORE_TYPES.forEach((scoreType) => {
            let rowSpan = scoreType.categories.length;
            // Add score hint on an empty row
            rendered += (`<tr class="${scoreType.classes}">
                <td colspan="${2 + this.players.length}"
                    class="score-type ${scoreType.classes}">
                ${scoreType.scoreHint}</td></tr>`
            );
            scoreType.categories.forEach((category) => {
                rendered += `<tr class="${scoreType.classes}">`;
                rendered += '<td></td>';
                rendered += `<td><a href="#" class="category">${category}</a></td>`;
                this.players.forEach((player) => {
                    rendered += `<td class="player-points">${player.getPoints(category)}</td>`
                });
                rendered += '</tr>'
            });
        });
        rendered += '</tbody>'
        return rendered;
    }

    _renderFooter() {
        let rendered = '<tfoot><td></td>';

        if (this.showTotals) {
            rendered += (
                '<td><label for="totalsSwitch">'
                        + '<input type="checkbox" id="totalsSwitch" '
                        + 'name="totalsSwitch" role="switch" checked>'
                        + 'Total</label></td>'
            );
            this.players.forEach((player) => {
                rendered += `<td>${player.getTotalPoints()}</td>`;
            });
        } else {
            rendered += (
                '<td><label for="totalsSwitch">'
                        + '<input type="checkbox" id="totalsSwitch" '
                        + 'name="totalsSwitch" role="switch">'
                        + 'Total</label></td>'
            );
            this.players.forEach((player) => {
                rendered += '<td></td>';
            });
        }
        rendered += '</tfoot>';
        return rendered;
    }

    _addEventListeners() {
        this.table.querySelectorAll('.category').forEach((category) => {
            category.addEventListener(
                'click', (event) => {
                    event.preventDefault();
                    this.showScores(event.target.innerText);
                }, false
            );
        });

        this.table.querySelector('#totalsSwitch').addEventListener(
            'click', (event) => {
                this.showTotals = !this.showTotals;
                this.render();
            }, false
        );
    }

    _render() {
        return [
            '<table>',
            this._renderHeader(),
            this._renderBody(),
            this._renderFooter(),
            '</table>'
        ].join('');
    }

    render() {
        this.table.innerHTML = this._render();
        this._addEventListeners();
        this._saveToLocalStorage();
    }

    _saveToLocalStorage() {
        // Store the players state to local browser storage. We'll
        // try to reinstantiate on refresh.
        localStorage.setItem(
            'players',
            JSON.stringify(this.players)
        );
    }
}

function getEscapedValue(value) {
    return value.replace(/&/g, '')
        .replace(/"/g, '')
        .replace(/'/g, '')
        .replace(/</g, '')
        .replace(/>/g, '');
}

function getPlayerNamesFromURL() {
    let queryParams = (new URL(document.location)).searchParams;
    return JSON.parse(queryParams.get('players'));
}

function getPlayers() {
    let players = [];
    if ('players' in localStorage) {
        let savedPlayers = JSON.parse(localStorage.getItem('players'));
        savedPlayers.forEach((savedPlayer) => {
            let player = new Player(getEscapedValue(savedPlayer.name));
            player.pointsByCategory = savedPlayer.pointsByCategory;
            players.push(player);
        });
    } else {
        let playerNames = getPlayerNamesFromURL();
        playerNames.forEach((playerName) => {
            players.push(new Player(getEscapedValue(playerName)));
        });
    }
    return players;
}

function clickNewGame() {
    var modal = new Modal();
    modal.setTitle('');
    modal.setBody('<p>Are you sure you want to start a new scorecard?</p>');
    modal.setFooter(
        '<button class="modal-close secondary">Cancel</button>'
                + `<button id="confirm-new-game">New Game</button>`
    )
    modal.show();

    document.querySelector('#modal .modal-close').addEventListener(
        'click', (event) => {
            modal.hide();
        }, false
    );

    document.querySelector('#modal #confirm-new-game').addEventListener(
        'click', (event) => {
            localStorage.removeItem('players');
            window.location = '/';
        }, false
    );
}

function buildScorecard() {
    let players = getPlayers();
    let scorecard = new Scorecard(`#scorecard`, players);
    scorecard.render();

    document.querySelector('#new-game').addEventListener(
        'click', clickNewGame, false
    );
}

document.addEventListener('DOMContentLoaded', () => {
    buildScorecard();
}, false);