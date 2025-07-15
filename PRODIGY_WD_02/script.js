/**
 * Stopwatch Application Implementation
 * Features: Start/pause/reset functionality, lap times, millisecond precision
 */

class Stopwatch {
    constructor() {
        // Timing state
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.lapTimes = [];
        this.lapStartTime = 0;
        
        // DOM elements
        this.timeDisplay = document.getElementById('time-display');
        this.millisecondsDisplay = document.getElementById('milliseconds');
        this.startButton = document.getElementById('start-btn');
        this.pauseButton = document.getElementById('pause-btn');
        this.resetButton = document.getElementById('reset-btn');
        this.lapButton = document.getElementById('lap-btn');
        this.lapTimesContainer = document.getElementById('lap-times');
        this.clearLapsButton = document.getElementById('clear-laps-btn');
        this.container = document.querySelector('.container');
        
        // Initialize the application
        this.initializeStopwatch();
    }
    
    /**
     * Initialize the stopwatch by setting up event listeners
     */
    initializeStopwatch() {
        this.startButton.addEventListener('click', this.start.bind(this));
        this.pauseButton.addEventListener('click', this.pause.bind(this));
        this.resetButton.addEventListener('click', this.reset.bind(this));
        this.lapButton.addEventListener('click', this.recordLap.bind(this));
        this.clearLapsButton.addEventListener('click', this.clearAllLaps.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Initialize display
        this.updateDisplay();
        this.updateButtonStates();
        this.updateLapDisplay();
    }
    
    /**
     * Handle keyboard shortcuts for accessibility
     */
    handleKeyDown(event) {
        // Only handle shortcuts when not typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (event.key.toLowerCase()) {
            case ' ': // Spacebar - Start/Pause
                event.preventDefault();
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
                break;
            case 'r': // R - Reset
                if (!this.isRunning) {
                    this.reset();
                }
                break;
            case 'l': // L - Lap
                if (this.isRunning) {
                    this.recordLap();
                }
                break;
            case 'c': // C - Clear laps
                if (this.lapTimes.length > 0) {
                    this.clearAllLaps();
                }
                break;
        }
    }
    
    /**
     * Start the stopwatch
     */
    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.lapStartTime = this.startTime;
            this.isRunning = true;
            
            // Update display every 10ms for smooth animation
            this.intervalId = setInterval(() => {
                this.updateDisplay();
            }, 10);
            
            this.updateButtonStates();
            this.container.classList.add('running');
            this.logEvent('stopwatch_started');
        }
    }
    
    /**
     * Pause the stopwatch
     */
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.intervalId);
            this.elapsedTime = Date.now() - this.startTime;
            
            this.updateButtonStates();
            this.container.classList.remove('running');
            this.logEvent('stopwatch_paused', { elapsedTime: this.elapsedTime });
        }
    }
    
    /**
     * Reset the stopwatch
     */
    reset() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.startTime = 0;
        this.elapsedTime = 0;
        this.lapStartTime = 0;
        
        this.updateDisplay();
        this.updateButtonStates();
        this.container.classList.remove('running');
        this.logEvent('stopwatch_reset');
    }
    
    /**
     * Record a lap time
     */
    recordLap() {
        if (this.isRunning) {
            const currentTime = Date.now();
            const totalTime = currentTime - this.startTime;
            const splitTime = currentTime - this.lapStartTime;
            
            const lapData = {
                lapNumber: this.lapTimes.length + 1,
                totalTime: totalTime,
                splitTime: splitTime,
                timestamp: new Date().toISOString()
            };
            
            this.lapTimes.push(lapData);
            this.lapStartTime = currentTime;
            
            this.updateLapDisplay();
            this.updateButtonStates();
            this.logEvent('lap_recorded', lapData);
        }
    }
    
    /**
     * Clear all lap times
     */
    clearAllLaps() {
        this.lapTimes = [];
        this.updateLapDisplay();
        this.updateButtonStates();
        this.logEvent('laps_cleared');
    }
    
    /**
     * Update the time display
     */
    updateDisplay() {
        const currentTime = this.isRunning ? Date.now() - this.startTime : this.elapsedTime;
        const timeString = this.formatTime(currentTime);
        const milliseconds = Math.floor((currentTime % 1000));
        
        this.timeDisplay.textContent = timeString;
        this.millisecondsDisplay.textContent = milliseconds.toString().padStart(3, '0');
    }
    
    /**
     * Format time in HH:MM:SS format
     */
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Update button states based on current status
     */
    updateButtonStates() {
        this.startButton.disabled = this.isRunning;
        this.pauseButton.disabled = !this.isRunning;
        this.resetButton.disabled = this.isRunning;
        this.lapButton.disabled = !this.isRunning;
        this.clearLapsButton.disabled = this.lapTimes.length === 0;
        
        // Update button text
        this.startButton.textContent = this.elapsedTime > 0 && !this.isRunning ? 'Resume' : 'Start';
    }
    
    /**
     * Update the lap times display
     */
    updateLapDisplay() {
        if (this.lapTimes.length === 0) {
            this.lapTimesContainer.innerHTML = '<div class="no-laps">No lap times recorded</div>';
            return;
        }
        
        // Find fastest and slowest laps for highlighting
        const fastestLap = this.lapTimes.reduce((fastest, current) => 
            current.splitTime < fastest.splitTime ? current : fastest
        );
        const slowestLap = this.lapTimes.reduce((slowest, current) => 
            current.splitTime > slowest.splitTime ? current : slowest
        );
        
        // Create lap items HTML
        const lapItemsHTML = this.lapTimes
            .slice()
            .reverse() // Show most recent first
            .map(lap => {
                let extraClass = '';
                if (this.lapTimes.length > 1) {
                    if (lap.lapNumber === fastestLap.lapNumber) {
                        extraClass = 'fastest-lap';
                    } else if (lap.lapNumber === slowestLap.lapNumber) {
                        extraClass = 'slowest-lap';
                    }
                }
                
                return `
                    <div class="lap-item ${extraClass}">
                        <div class="lap-number">Lap ${lap.lapNumber}</div>
                        <div class="lap-time">${this.formatTime(lap.totalTime)}.${Math.floor(lap.totalTime % 1000).toString().padStart(3, '0')}</div>
                        <div class="lap-split">+${this.formatTime(lap.splitTime)}.${Math.floor(lap.splitTime % 1000).toString().padStart(3, '0')}</div>
                    </div>
                `;
            })
            .join('');
        
        this.lapTimesContainer.innerHTML = lapItemsHTML;
    }
    
    /**
     * Get current stopwatch statistics
     */
    getStats() {
        const currentTime = this.isRunning ? Date.now() - this.startTime : this.elapsedTime;
        
        return {
            isRunning: this.isRunning,
            currentTime: currentTime,
            formattedTime: this.formatTime(currentTime),
            lapCount: this.lapTimes.length,
            totalLaps: this.lapTimes.length,
            averageLapTime: this.lapTimes.length > 0 
                ? this.lapTimes.reduce((sum, lap) => sum + lap.splitTime, 0) / this.lapTimes.length 
                : 0,
            fastestLap: this.lapTimes.length > 0 
                ? Math.min(...this.lapTimes.map(lap => lap.splitTime)) 
                : 0,
            slowestLap: this.lapTimes.length > 0 
                ? Math.max(...this.lapTimes.map(lap => lap.splitTime)) 
                : 0
        };
    }
    
    /**
     * Export lap times as JSON
     */
    exportLapTimes() {
        const exportData = {
            exportDate: new Date().toISOString(),
            totalTime: this.isRunning ? Date.now() - this.startTime : this.elapsedTime,
            lapTimes: this.lapTimes,
            stats: this.getStats()
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    /**
     * Log events for debugging or analytics
     */
    logEvent(eventType, data = {}) {
        console.log(`Stopwatch Event: ${eventType}`, {
            timestamp: new Date().toISOString(),
            ...data
        });
    }
}

// Error handling and initialization
try {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new Stopwatch();
        });
    } else {
        // DOM already loaded
        new Stopwatch();
    }
} catch (error) {
    console.error('Failed to initialize Stopwatch application:', error);
    
    // Show user-friendly error message
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #e53e3e;">
                <h2>Application Error</h2>
                <p>Sorry, there was an error loading the stopwatch. Please refresh the page to try again.</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

// Additional utility functions

/**
 * Format milliseconds to readable string
 */
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Performance measurement utility
 */
function measurePerformance(fn, name = 'Operation') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`);
    return result;
}

// Export for potential module usage (if needed in future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Stopwatch;
}