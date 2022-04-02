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
        this.points = 0;
    }

    addPoints(points) {
        this.points += points;
    }
    getPoints(points) {
        return this.points
    }
}
class Scorecard {
    constructor(tableSelector, players) {
        this.table = document.querySelector(tableSelector);
        this.players = players;
    }

    _getPlayerTDs() {
        return '<td></td>'.repeat(this.players.length);
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
                    rendered += `<td rowspan="3" class="score-type">${scoreType.scoreHint}</td>`;
                }
                rendered += `<td>${category}</td>`;
                rendered += this._getPlayerTDs();
                rendered += '</tr>'
            });
        });
        rendered += '</tbody>'
        return rendered;
    }

    _renderFooter() {
        let rendered = '<tfoot><td></td><td>Total</td>';
        rendered += this._getPlayerTDs();
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
    console.log(scorecard.render())
}

document.addEventListener('DOMContentLoaded', () => {
    buildScorecard();
}, false);