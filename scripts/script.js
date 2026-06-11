let deceptionLoop = null;

const correctAnswers = {
    'vaca': 2,
    'gato': 0,
    'bolo': 1,
    'bola': 1,
    'abelha': 2,
    'cesta': 0,
    'botao': 1,
    'sino': 2,
    'boneca': 1
};

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
}

function checkAnswer(element, word, index) {
    if (document.body.dataset.gameOver === 'true') {
        return;
    }

    const card = element.closest('.game-card');
    const options = card.querySelectorAll('.option');
    const feedback = card.querySelector('.feedback');
    
    if (card.dataset.answered === 'true') {
        return;
    }
    
    options.forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'selected');
    });
    feedback.classList.remove('success', 'error');

    if (index === correctAnswers[word]) {
        element.classList.add('correct');
        feedback.textContent = '✓ Correto!';
        feedback.classList.add('success');
        card.dataset.answered = 'true';

        options.forEach(opt => opt.classList.add('disabled'));
    } else {
        element.classList.add('incorrect');
        feedback.textContent = '✗ Errado! Ce é besta é?';
        feedback.classList.add('error');
        document.body.dataset.gameOver = 'true';
        showWrongReaction();
    }

    updateScore();
}

function showWrongReaction() {
    const reaction = document.getElementById('wrong-reaction');
    const explosion = document.getElementById('explosion-gif');
    const deception = document.getElementById('deception-gif');

    explosion.classList.remove('hide-explosion');
    explosion.src = 'images/exp.gif?time=' + new Date().getTime();

    deception.src = 'images/desappear.gif?time=' + new Date().getTime();

    if (deceptionLoop) {
        clearInterval(deceptionLoop);
    }

    deceptionLoop = setInterval(() => {
        deception.src = 'images/desappear.gif?time=' + new Date().getTime();
    }, 1500);

    reaction.classList.remove('hidden');
    reaction.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
        explosion.classList.add('hide-explosion');
    }, 800);
}

function showWinScreen() {
    const winScreen = document.getElementById('win-screen');
    document.body.dataset.gameOver = 'true';
    winScreen.classList.remove('hidden');
    winScreen.setAttribute('aria-hidden', 'false');
}

function updateScore() {
    const correctCount = document.querySelectorAll('.game-card[data-answered="true"]').length;
    const totalCount = Object.keys(correctAnswers).length;

    document.getElementById('score').textContent = correctCount;

    if (correctCount === totalCount && document.body.dataset.gameOver !== 'true') {
        showWinScreen();
    }
}

function resetGame() {
    document.querySelectorAll('.game-card').forEach(card => {
        delete card.dataset.answered;
    });

    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'selected', 'disabled');
    });

    document.querySelectorAll('.feedback').forEach(fb => {
        fb.textContent = '';
        fb.classList.remove('success', 'error');
    });

    delete document.body.dataset.gameOver;

    if (deceptionLoop) {
        clearInterval(deceptionLoop);
        deceptionLoop = null;
    }

    const wrongReaction = document.getElementById('wrong-reaction');
    wrongReaction.classList.add('hidden');
    wrongReaction.setAttribute('aria-hidden', 'true');

    const winScreen = document.getElementById('win-screen');
    winScreen.classList.add('hidden');
    winScreen.setAttribute('aria-hidden', 'true');

    updateScore();
}
