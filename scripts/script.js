let deceptionLoop = null;
const isGameFolder = window.location.pathname.toLowerCase().includes('/jogo/');
const imageBasePath = isGameFolder ? '../images/' : 'images/';

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


function checkAnswer(element, word, index) {
    if (document.body.dataset.gameOver === 'true') {
        return;
    }

    const card = element.closest('.game-card');
    const options = card.querySelectorAll('.option');
    const feedback = card.querySelector('.feedback');

    // Não deixa a mesma carta contar ou mudar depois que já foi respondida corretamente.
    if (card.dataset.answered === 'true') {
        return;
    }

    // Remove classes anteriores desta carta.
    options.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
    });
    feedback.classList.remove('success', 'error');

    if (index === correctAnswers[word]) {
        element.classList.add('correct');
        feedback.textContent = '✓ Correto!';
        feedback.classList.add('success');
        card.dataset.answered = 'true';

        // Trava as opções dessa carta depois do acerto.
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
    explosion.src = imageBasePath + 'exp.gif?time=' + new Date().getTime();

    deception.src = imageBasePath + 'desappear.gif?time=' + new Date().getTime();

    if (deceptionLoop) {
        clearInterval(deceptionLoop);
    }

    deceptionLoop = setInterval(() => {
        deception.src = imageBasePath + 'desappear.gif?time=' + new Date().getTime();
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

    const scoreElement = document.getElementById('score');
    if (!scoreElement) {
        return;
    }

    scoreElement.textContent = correctCount;

    if (correctCount === totalCount && document.body.dataset.gameOver !== 'true') {
        showWinScreen();
    }
}

function resetGame() {
    document.querySelectorAll('.game-card').forEach(card => {
        delete card.dataset.answered;
    });

    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'disabled');
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

function backToPortfolio() {
    resetGame();
    window.location.href = '../index.html';
}

function validateContactForm(event) {
    event.preventDefault();

    const form = event.target;
    const feedback = document.getElementById('form-feedback');
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();
    const contactPreference = form.querySelector('input[name="contactPreference"]:checked');
    const interests = form.querySelectorAll('input[name="interest"]:checked');

    feedback.classList.remove('success', 'error');

    if (name.length < 3) {
        feedback.textContent = 'Digite um nome com pelo menos 3 caracteres.';
        feedback.classList.add('error');
        return;
    }

    if (!/^[0-9]{10,11}$/.test(phone)) {
        feedback.textContent = 'Digite um número válido com 10 ou 11 dígitos, usando apenas números.';
        feedback.classList.add('error');
        return;
    }

    if (!date) {
        feedback.textContent = 'Selecione uma data.';
        feedback.classList.add('error');
        return;
    }

    if (!subject) {
        feedback.textContent = 'Selecione um assunto.';
        feedback.classList.add('error');
        return;
    }

    if (!contactPreference) {
        feedback.textContent = 'Escolha uma preferência de contato.';
        feedback.classList.add('error');
        return;
    }

    if (interests.length === 0) {
        feedback.textContent = 'Marque pelo menos um interesse.';
        feedback.classList.add('error');
        return;
    }

    if (message.length < 10) {
        feedback.textContent = 'Digite uma mensagem com pelo menos 10 caracteres.';
        feedback.classList.add('error');
        return;
    }

    feedback.textContent = 'Mensagem validada com sucesso! Como este é um formulário de atividade, os dados não são enviados para servidor.';
    feedback.classList.add('success');
    form.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', validateContactForm);
    }
});
