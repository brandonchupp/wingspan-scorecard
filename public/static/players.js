let players = [];

function addNewPlayerInput() {
    let addPlayerInput = document.createElement('input');
    addPlayerInput.id = 'new-player-name';
    addPlayerInput.setAttribute('placeholder', `Enter Player ${players.length + 1}`);

    let playersContainer = document.querySelector('#players');
    let addPlayerButton = playersContainer.querySelector('#add-player');
    playersContainer.insertBefore(addPlayerInput, addPlayerButton);

    playersContainer.querySelector('#new-player-name').addEventListener('input', () => {
        toggleAddPlayerButtonState();
    })
    toggleAddPlayerButtonState();
    toggleContinueButtonState();
}

function addNewPlayer() {
    // Make the player name input plain text and add another input
    let playerNameInput = document.querySelector('#new-player-name');
    let playerNameValue = playerNameInput.value;
    let playerTextDiv = document.createElement('div');
    playerTextDiv.className = 'player-name';
    playerTextDiv.textContent = playerNameValue;
    playerNameInput.replaceWith(playerTextDiv);
    players.push(playerNameValue);

    addNewPlayerInput();
}

function toggleAddPlayerButtonState() {
    // Disable the button if the input does not have a value
    let addPlayerButton = document.querySelector('#add-player');
    let playerNameInputValue = document.querySelector('#new-player-name').value.trim();
    if (playerNameInputValue) {
        addPlayerButton.removeAttribute('disabled');
    } else {
        addPlayerButton.setAttribute('disabled', true);
    }
}

function toggleContinueButtonState() {
    let continueButton = document.querySelector('#build-scorecard');
    if (players.length > 1) {
        continueButton.style.display = '';
    } else {
        continueButton.style.display = 'none';
    }
}

function continueButtonClick() {
    let playersString = JSON.stringify(players);
    window.location = `/scorecard/?players=${encodeURIComponent(playersString)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Add an initial player input
    addNewPlayerInput();
    document.querySelector('#add-player').addEventListener(
        'click', addNewPlayer, false
    );
    document.querySelector('#build-scorecard').addEventListener(
        'click', continueButtonClick, false
    );
}, false);