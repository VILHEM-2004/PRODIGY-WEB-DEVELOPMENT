/**
 * Tic Tac Toe Game Implementation
 * Features: Two-player gameplay, win detection, draw detection, reset functionality
 */

class TicTacToe {
    constructor() {
        // Game state
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'human'; // Could be extended for AI mode
        
        // Winning combinations (indices of board array)
        this.winConditions = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Diagonal top-left to bottom-right
            [2, 4, 6]  // Diagonal top-right to bottom-left
        ];
        
        // DOM elements
        this.cells = document.querySelectorAll('.cell');
        this.playerDisplay = document.getElementById('player-display');
        this.resetButton = document.getElementById('reset-btn');
        this.statusMessage = document.getElementById('status-message');
        this.winnerModal = document.getElementById('winner-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.playAgainButton = document.getElementById('play-again-btn');
        
        // Initialize game
        this.initializeGame();
    }
    
    /**
     * Initialize the game by setting up event listeners
     */
    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', this.handleCellClick.bind(this));
            cell.addEventListener('keydown', this.handleKeyDown.bind(this));
            cell.setAttribute('tabindex', '0'); // Make cells focusable
        });
        
        this.resetButton.addEventListener('click', this.resetGame.bind(this));
        this.playAgainButton.addEventListener('click', this.resetGame.bind(this));
        
        // Close modal when clicking outside
        this.winnerModal.addEventListener('click', (e) => {
            if (e.target === this.winnerModal) {
                this.closeModal();
            }
        });
        
        // Initial display update
        this.updatePlayerDisplay();
        this.showStatusMessage('Game started! X goes first.');
    }
    
    /**
     * Handle keyboard navigation for accessibility
     */
    handleKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleCellClick(event);
        }
    }
    
    /**
     * Handle cell click events
     */
    handleCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'));
        
        // Validate move
        if (!this.isValidMove(cellIndex)) {
            this.showStatusMessage('Invalid move! Try again.');
            return;
        }
        
        // Make move
        this.makeMove(cellIndex, cell);
        
        // Check game state
        if (this.checkWinner()) {
            this.handleGameWin();
        } else if (this.checkDraw()) {
            this.handleGameDraw();
        } else {
            this.switchPlayer();
            this.showStatusMessage(`Player ${this.currentPlayer}'s turn`);
        }
    }
    
    /**
     * Check if a move is valid
     */
    isValidMove(cellIndex) {
        return this.gameActive && 
               cellIndex >= 0 && 
               cellIndex < 9 && 
               this.board[cellIndex] === '';
    }
    
    /**
     * Make a move on the board
     */
    makeMove(cellIndex, cellElement) {
        this.board[cellIndex] = this.currentPlayer;
        cellElement.textContent = this.currentPlayer;
        cellElement.classList.add(this.currentPlayer.toLowerCase());
        cellElement.classList.add('disabled');
        
        // Add animation effect
        cellElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cellElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    /**
     * Switch to the other player
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updatePlayerDisplay();
    }
    
    /**
     * Update the current player display
     */
    updatePlayerDisplay() {
        this.playerDisplay.textContent = this.currentPlayer;
        this.playerDisplay.className = `player-${this.currentPlayer.toLowerCase()}`;
    }
    
    /**
     * Check for a winner
     */
    checkWinner() {
        return this.winConditions.some(condition => {
            const [a, b, c] = condition;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                this.winningCombination = condition;
                return true;
            }
            return false;
        });
    }
    
    /**
     * Check for a draw
     */
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    /**
     * Handle game win
     */
    handleGameWin() {
        this.gameActive = false;
        this.highlightWinningCells();
        this.disableAllCells();
        
        const winner = this.currentPlayer;
        this.showStatusMessage(`Player ${winner} wins!`);
        
        // Show winner modal after a short delay
        setTimeout(() => {
            this.showWinnerModal(`Player ${winner} Wins!`, `Congratulations! Player ${winner} has won the game.`);
        }, 1000);
    }
    
    /**
     * Handle game draw
     */
    handleGameDraw() {
        this.gameActive = false;
        this.disableAllCells();
        this.showStatusMessage("It's a draw!");
        
        // Show draw modal after a short delay
        setTimeout(() => {
            this.showWinnerModal("It's a Draw!", "The game ended in a tie. Well played!");
        }, 1000);
    }
    
    /**
     * Highlight winning cells with animation
     */
    highlightWinningCells() {
        if (this.winningCombination) {
            this.winningCombination.forEach(index => {
                this.cells[index].classList.add('winning');
            });
        }
    }
    
    /**
     * Disable all cells
     */
    disableAllCells() {
        this.cells.forEach(cell => {
            cell.classList.add('disabled');
            cell.setAttribute('tabindex', '-1');
        });
    }
    
    /**
     * Enable all cells
     */
    enableAllCells() {
        this.cells.forEach(cell => {
            cell.classList.remove('disabled');
            cell.setAttribute('tabindex', '0');
        });
    }
    
    /**
     * Show status message with animation
     */
    showStatusMessage(message) {
        this.statusMessage.textContent = message;
        this.statusMessage.classList.remove('show');
        
        // Force reflow and add class for animation
        setTimeout(() => {
            this.statusMessage.classList.add('show');
        }, 10);
    }
    
    /**
     * Show winner modal
     */
    showWinnerModal(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.winnerModal.classList.add('show');
        
        // Focus on play again button for accessibility
        this.playAgainButton.focus();
    }
    
    /**
     * Close winner modal
     */
    closeModal() {
        this.winnerModal.classList.remove('show');
    }
    
    /**
     * Reset the game to initial state
     */
    resetGame() {
        // Reset game state
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningCombination = null;
        
        // Reset UI
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.enableAllCells();
        this.updatePlayerDisplay();
        this.closeModal();
        this.showStatusMessage('Game reset! X goes first.');
        
        // Focus on first cell for better UX
        this.cells[0].focus();
    }
    
    /**
     * Get game statistics (could be extended for score tracking)
     */
    getGameStats() {
        return {
            currentPlayer: this.currentPlayer,
            gameActive: this.gameActive,
            movesCount: this.board.filter(cell => cell !== '').length,
            board: [...this.board] // Return copy of board
        };
    }
}

// Error handling and game initialization
try {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new TicTacToe();
        });
    } else {
        // DOM already loaded
        new TicTacToe();
    }
} catch (error) {
    console.error('Failed to initialize Tic Tac Toe game:', error);
    
    // Show user-friendly error message
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #e53e3e;">
                <h2>Game Error</h2>
                <p>Sorry, there was an error loading the game. Please refresh the page to try again.</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

// Additional utility functions for potential future enhancements

/**
 * Utility function to check if the game can be extended with AI
 */
function canAddAI() {
    return typeof TicTacToe !== 'undefined';
}

/**
 * Utility function for analytics or game tracking
 */
function logGameEvent(eventType, data = {}) {
    // Could be extended to track game analytics
    console.log(`Game Event: ${eventType}`, data);
}

// Export for potential module usage (if needed in future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TicTacToe;
}
