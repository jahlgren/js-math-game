const problemIndexElement = document.getElementById('problem-index');
const expressionElement = document.getElementById('expression');
const buttonContainerElement = document.getElementById('button-container');

const playingContentElement = document.getElementById('playing-content');
const playingFooterElement = document.getElementById('playing-footer');
const endContentElement = document.getElementById('end-content');
const endFooterElement = document.getElementById('end-footer');

const canvasContext = document.getElementById('chart-canvas').getContext('2d');

const playAgainButton = document.getElementById('play-again-button');
playAgainButton.addEventListener('click', onPlayAgainClicked);

const gameEndChart = new Chart(canvasContext, {
    type: 'pie',
    data: {
        labels: ['Correct', 'Incorrect'],
        datasets: [{
            data: [],
            backgroundColor: [
                'rgb(125, 200, 255)',
                'rgb(255, 75, 128)'
            ]
        }]
    },
    options: {}
});

const game = new MathGame();
game.addEventListener('gamestart', onGameStart);
game.addEventListener('gameend', onGameEnd);
game.addEventListener('roundstart', onRoundStart);
game.addEventListener('roundend', onRoundEnd);
game.start();

function onPlayAgainClicked(event) {
    event.preventDefault();
    game.start();
}

function onGameStart(game) {
    playingContentElement.style.display = '';
    playingFooterElement.style.display = '';

    endContentElement.style.display = 'none';
    endFooterElement.style.display = 'none';
}

function onGameEnd(game) {
    playingContentElement.style.display = 'none';
    playingFooterElement.style.display = 'none';

    endContentElement.style.display = '';
    endFooterElement.style.display = '';

    gameEndChart.data.datasets[0].data = [
        game.correctAnswerCount,
        game.problemCount - game.correctAnswerCount
    ];
    gameEndChart.update();
}

function onRoundStart(game) {
    console.log('onRoundStart: '+game.problem.correctAnswer);
    
    while(buttonContainerElement.children.length > 0) {
        buttonContainerElement.removeChild(buttonContainerElement.firstChild);
    }

    problemIndexElement.innerHTML = (
        game.currentProblemIndex + '/' + game.problemCount
    );
    expressionElement.innerHTML = game.problem.expression;

    const answers = game.problem.generateAnswers(4);
    let rowElement = null;

    for(let i = 0; i < answers.length; i++) {
        if(rowElement == null) {
            rowElement = document.createElement('div');
            rowElement.classList.add('grid__row');
            buttonContainerElement.appendChild(rowElement);
        }

        const colElement = document.createElement('div');
        colElement.classList.add('grid__column');
        rowElement.appendChild(colElement);

        const buttonElement = document.createElement('a');
        buttonElement.classList.add('button');
        buttonElement.innerText = answers[i];
        colElement.appendChild(buttonElement);
        buttonElement.addEventListener('click', onAnswerButtonClicked);

        if(i % 2 == 1) {
            rowElement = null;
        }
    }
}

function onRoundEnd(game) {
    game.nextRound();
}

function onAnswerButtonClicked(event) {
    event.preventDefault();
    game.submitAnswer(event.target.innerText);
}
