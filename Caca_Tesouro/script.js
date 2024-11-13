const gridSize = 5;  // Tamanho da grade 5x5
let remainingAttempts;  // Tentativas iniciais
let treasurePosition;
let score = 0;  // Pontuação da rodada atual
let totalScore = 0;  // Pontuação acumulada em todas as rodadas
let scoreHistory = [];  // Histórico de pontuações
const gridElement = document.getElementById('grid');
const statusElement = document.getElementById('status');
const scoreElement = document.getElementById('score');
const totalScoreElement = document.getElementById('total-score');
const historyElement = document.getElementById('history');
const startBtn = document.getElementById('start-btn');
const modalElement = document.getElementById('treasure-modal');
const closeModalButton = document.getElementById('close-modal');

// Função para iniciar o jogo
function startGame() {
  remainingAttempts = 10;
  treasurePosition = {
    row: Math.floor(Math.random() * gridSize),
    col: Math.floor(Math.random() * gridSize)
  };

  score = 0; // Reinicia a pontuação da rodada
  statusElement.textContent = "Jogo iniciado! Clique nas células para encontrar o tesouro.";
  gridElement.innerHTML = ''; // Limpa o grid para uma nova partida
  gridElement.style.display = 'grid'; // Exibe o grid

  // Criar a grade de células
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleClick);
      gridElement.appendChild(cell);
    }
  }
}

// Função que lida com os cliques nas células
function handleClick(event) {
  const clickedRow = parseInt(event.target.dataset.row);
  const clickedCol = parseInt(event.target.dataset.col);
  
  if (remainingAttempts <= 0) {
    statusElement.textContent = "Você perdeu! Sem tentativas restantes!";
    return;
  }

  // Calcular a proximidade do tesouro
  const distance = calculateDistance(clickedRow, clickedCol, treasurePosition.row, treasurePosition.col);

  // Verificar se o jogador encontrou o tesouro
  if (distance === 0) {
    event.target.style.backgroundColor = "gold";
    showTreasureModal();  // Exibe o modal ao encontrar o tesouro
    calculateScore();
    saveScore();
    disableGrid();
    showHistory();
  } else {
    remainingAttempts--;
    event.target.style.backgroundColor = "#ff6347";
    event.target.textContent = getHint(distance);
    statusElement.textContent = `Tentativas restantes: ${remainingAttempts}`;
    
    if (remainingAttempts === 0) {
      statusElement.textContent = "Você perdeu! Sem tentativas restantes!";
      saveScore();
      disableGrid();
      showHistory();
      askToRestart();
    }
  }
}

// Função para desativar o grid após o jogo acabar
function disableGrid() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.removeEventListener('click', handleClick);
  });
}

// Função para calcular a distância entre o clique e o tesouro
function calculateDistance(row1, col1, row2, col2) {
  const rowDistance = Math.abs(row1 - row2);
  const colDistance = Math.abs(col1 - col2);
  return rowDistance + colDistance;
}

// Função para gerar uma dica com base na distância
function getHint(distance) {
  if (distance <= 1) {
    return "Muito perto!";
  } else if (distance <= 2) {
    return "Perto!";
  } else if (distance <= 3) {
    return "Um pouco longe!";
  } else {
    return "Muito longe!";
  }
}

// Função para calcular a pontuação da rodada
function calculateScore() {
  score = remainingAttempts * 10;  // A pontuação é baseada nas tentativas restantes
  totalScore += score;  // Atualiza a pontuação total
  scoreElement.textContent = `Pontuação: ${score}`;
  totalScoreElement.textContent = `Pontuação Total: ${totalScore}`;
}

// Função para salvar a pontuação no histórico
function saveScore() {
  scoreHistory.push(score);
}

// Função para exibir o histórico de pontuações
function showHistory() {
  if (scoreHistory.length === 0) {
    historyElement.textContent = "Histórico de Pontuações: Nenhum jogo ainda";
  } else {
    historyElement.textContent = `Histórico de Pontuações: ${scoreHistory.join(", ")}`;
  }
}

// Função para exibir o modal ao encontrar o tesouro
function showTreasureModal() {
  modalElement.style.display = 'flex';
}

// Fechar o modal ao clicar no botão "Fechar"
closeModalButton.addEventListener('click', () => {
  modalElement.style.display = 'none';
  askToRestart();  // Pergunta se o jogador quer jogar novamente
});

// Função para perguntar se o jogador deseja reiniciar o jogo
function askToRestart() {
  const restart = confirm("Deseja jogar novamente?");
  if (restart) {
    startGame();
  } else {
    statusElement.textContent = "Jogo finalizado. Obrigado por jogar!";
  }
}

// Adicionar evento ao botão de iniciar jogo
startBtn.addEventListener('click', startGame);
