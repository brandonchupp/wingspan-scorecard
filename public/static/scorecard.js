const DEV_MODE = false;

const SCORE_TYPES = [
    {
        'scoreHint': 'Amount on Cards',
        'categories': [
            'Birds',
            'Bonus Cards',
            'End-of-Round Goals'
        ]
    }, {
        'scoreHint': '1 Point Each',
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
    addPoints(points, category){
        return this.pointsByCategory[category] += points;
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
            scoreType.categories.forEach((category, index) => {
                rendered += '<tr>';
                if (index === 0) {
                    // Add score hint on the first category
                    rendered += (
                        '<td rowspan="3"><div class="score-type">'
                                + `${scoreType.scoreHint}</div></td>`
                    );
                }
                rendered += `<td>${category}</td>`;
                this.players.forEach((player) => {
                    rendered += `<td>${player.getPoints(category)}</td>`
                });
                rendered += '</tr>'
            });
        });
        rendered += '</tbody>'
        return rendered;
    }

    _renderFooter() {
        let rendered = '<tfoot><td></td><td>Total</td>';
        this.players.forEach((player) => {
            rendered += `<td>${player.getTotalPoints()}</td>`
        });
        rendered += '</tfoot>';
        return rendered;
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
    }
}

function getPlayerNamesFromURL() {
    let queryParams = (new URL(document.location)).searchParams;
    return JSON.parse(queryParams.get('players'));
}

function getPlayers() {
    let playerNames = getPlayerNamesFromURL();
    let players = [];
    playerNames.forEach((playerName) => {
        players.push(new Player(playerName));
    });
    return players;
}

function buildScorecard() {
    let players = getPlayers();
    let scorecard = new Scorecard(`#scorecard`, players);
    scorecard.render();
}

document.addEventListener('DOMContentLoaded', () => {
    buildScorecard();
}, false);