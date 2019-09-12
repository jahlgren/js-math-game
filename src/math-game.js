
class MathProblem {
    constructor() {
        this.expression = this._generateExpression();
        this.correctAnswer = this._evalExpression(this.expression);
        this.answer = null;
    }

    isAnswerCorrect() {
        return this.answer === this.correctAnswer;
    }

    submitAnswer(answer) {
        this.answer = parseInt(answer);
    }

    generateAnswers(count) {
        let generatedAnswers = [];
        while(generatedAnswers.length < count) {
            let expression = this._generateExpression();
            let answer = this._evalExpression(expression);
            if(generatedAnswers.indexOf(answer) < 0) {
                generatedAnswers.push(answer);
            }
        }
        generatedAnswers[Math.floor(Math.random() * count)] = this.correctAnswer;
        return generatedAnswers;
    }

    _generateExpression() {
        return (
            Math.round(Math.random() * 100) + 
            ' + ' + 
            Math.round(Math.random() * 100)
        );
    }

    _evalExpression(expression) {
        return parseInt(eval(expression));
    }
}

class MathGame {

    constructor() {
        this.isPlaying = false;
        this.problemCount = 10;
        this.currentProblemIndex = 0;
        this.correctAnswerCount = 0;
        this.problem = null;
        this._eventListeners = [];
    }

    start() {
        if(this.isPlaying) {
            throw 'The game has already been started!';
        }

        this.isPlaying = true;
        this.currentProblemIndex = 0;
        this.correctAnswerCount = 0;
        this.problem = null;

        this._emit('gamestart');

        this.nextRound();
    }

    end() {
        if(this.isPlaying === false) {
            throw 'The game has not been started!';
        }

        this.isPlaying = false;
        this._emit('gameend');
    }
    
    nextRound() {
        if(this.isPlaying == false) {
            throw 'The game has not been started!';
        }
        
        if(this.currentProblemIndex >= this.problemCount) {
            this.end();
            return;
        }

        this.currentProblemIndex++;
        this.problem = new MathProblem();
        this._emit('roundstart');
    }

    submitAnswer(answer) {
        if(this.isPlaying == false) {
            throw 'The game has not been started!';
        }

        if(this.problem == null) {
            throw 'No problem to answer!';
        }

        if(this.problem.answer != null) {
            throw 'The problem has already been answered!';
        }

        this.problem.submitAnswer(answer);
        if(this.problem.isAnswerCorrect()) {
            this.correctAnswerCount++;
        }
        
        this._emit('roundend');
    }

    addEventListener(eventName, callback) {
        if(typeof this._eventListeners[eventName] == 'undefined') {
            this._eventListeners[eventName] = [];
        }
        const index = this._eventListeners[eventName].indexOf(callback);
        if(index < 0) {
            this._eventListeners[eventName].push(callback);
        }
    }

    removeEventListener(eventName, callback) {
        if(typeof this._eventListeners[eventName] == 'undefined') {
            return;
        }
        const index = this._eventListeners[eventName].indexOf(callback);
        if(index >= 0) {
            this._eventListeners[eventName].splice(index, 1);
        }
    }
    
    _emit(eventName) {
        if(typeof this._eventListeners[eventName] === undefined) {
            return;
        }
        this._eventListeners[eventName].forEach(callback => {
            callback(this);
        });
    }
}
