// ========== ЭКРАН ЗАГРУЗКИ С КРУТЯЩЕЙСЯ ЗВЕЗДОЙ DELTARUNE ==========

(function() {
    // Создаём HTML структуру экрана загрузки НЕПОСРЕДСТВЕННО в body
    function createLoadingScreen() {
        // Проверяем, нет ли уже экрана загрузки
        if (document.getElementById('loadingScreen')) return;
        
        const loadingHTML = `
            <div class="loading-screen" id="loadingScreen">
                <div class="loading-container">
                    <canvas id="starCanvas" width="200" height="200"></canvas>
                    <div class="loading-text">
                        <span class="loading-title">ЭНЦИКЛОПЕДИЯ ТЬМЫ</span>
                        <div class="loading-progress">
                            <div class="progress-bar" id="progressBar"></div>
                        </div>
                        <div class="loading-status" id="loadingStatus">ЗАГРУЗКА ДАННЫХ...</div>
                        <div class="loading-tip" id="loadingTip">✧ НАЖМИ [СОХРАНИТЬ] ДЛЯ ПЕРЕХОДА ✧</div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем прямо в body
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    }

    // Анимация звезды Deltarune на Canvas
    class DeltaruneStar {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                console.error('Canvas not found:', canvasId);
                return;
            }
            
            this.ctx = this.canvas.getContext('2d');
            this.rotation = 0;
            this.pulse = 0;
            this.pulseDirection = 1;
            
            // Настройки звезды
            this.centerX = this.canvas.width / 2;
            this.centerY = this.canvas.height / 2;
            this.outerRadius = 70;
            this.innerRadius = 30;
            this.points = 5;
            
            this.startAnimation();
        }
        
        // Рисует звезду
        drawStar(rotation) {
            if (!this.ctx) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Пульсирующий эффект
            const currentRadius = this.outerRadius + Math.sin(this.pulse) * 5;
            
            // Внешнее свечение
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#ff66cc';
            
            // Рисуем звезду
            this.ctx.beginPath();
            
            for (let i = 0; i < this.points * 2; i++) {
                const radius = i % 2 === 0 ? currentRadius : this.innerRadius;
                const angle = (i * Math.PI / this.points) + rotation;
                const x = this.centerX + radius * Math.cos(angle);
                const y = this.centerY + radius * Math.sin(angle);
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            this.ctx.closePath();
            
            // Градиентная заливка
            const gradient = this.ctx.createLinearGradient(
                this.centerX - 30, this.centerY - 30,
                this.centerX + 30, this.centerY + 30
            );
            gradient.addColorStop(0, '#ff66cc');
            gradient.addColorStop(0.5, '#aa44ff');
            gradient.addColorStop(1, '#ff44aa');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Обводка
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Центральный круг
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, 12, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffddff';
            this.ctx.shadowBlur = 15;
            this.ctx.fill();
            
            // Сброс тени
            this.ctx.shadowBlur = 0;
            
            // Добавляем маленькие звёздочки вокруг
            this.drawSparkles(rotation);
        }
        
        // Маленькие искры вокруг звезды
        drawSparkles(rotation) {
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2 / 8) + rotation * 2;
                const radius = 85;
                const x = this.centerX + radius * Math.cos(angle);
                const y = this.centerY + radius * Math.sin(angle);
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(this.pulse * 2) * 0.3})`;
                this.ctx.fill();
            }
        }
        
        // Анимация
        animate() {
            this.rotation += 0.02;
            this.pulse += 0.05 * this.pulseDirection;
            
            if (this.pulse > Math.PI) {
                this.pulseDirection = -1;
            } else if (this.pulse < 0) {
                this.pulseDirection = 1;
            }
            
            this.drawStar(this.rotation);
            requestAnimationFrame(() => this.animate());
        }
        
        startAnimation() {
            this.animate();
        }
    }

    // Симуляция загрузки с прогресс-баром
    function simulateLoading() {
        let progress = 0;
        const progressBar = document.getElementById('progressBar');
        const loadingStatus = document.getElementById('loadingStatus');
        const loadingTip = document.getElementById('loadingTip');
        
        const loadingSteps = [
            { progress: 10, text: 'ЗАГРУЗКА ДАННЫХ О БОССАХ...' },
            { progress: 25, text: 'АНАЛИЗ СПОСОБНОСТЕЙ...' },
            { progress: 40, text: 'ЗАГРУЗКА СПРАЙТОВ...' },
            { progress: 55, text: 'ИНИЦИАЛИЗАЦИЯ ЭНЦИКЛОПЕДИИ...' },
            { progress: 70, text: 'ПОДГОТОВКА КАРТОЧЕК БОССОВ...' },
            { progress: 85, text: 'АКТИВАЦИЯ ТЁМНОЙ МАГИИ...' },
            { progress: 95, text: 'ПОЧТИ ГОТОВО...' },
            { progress: 100, text: 'ГОТОВО! ДОБРО ПОЖАЛОВАТЬ В ТЬМУ!' }
        ];
        
        let stepIndex = 0;
        const tips = [
            '✧ НАЖМИ [СОХРАНИТЬ] ДЛЯ ПЕРЕХОДА ✧',
            '✧ НЕКОТОРЫЕ БОССЫ ИМЕЮТ СЕКРЕТНЫЕ ФАЗЫ ✧',
            '✧ КАЖДЫЙ БОСС МОЖЕТ БЫТЬ ПОБЕЖДЁН ✧',
            '✧ СУЩЕСТВУЮТ СЕКРЕТНЫЕ МАРШРУТЫ ✧',
            '✧ ТЬМА НИКОГДА НЕ УМИРАЕТ ПО-НАСТОЯЩЕМУ ✧'
        ];
        
        let tipIndex = 0;
        const tipInterval = setInterval(() => {
            tipIndex = (tipIndex + 1) % tips.length;
            if (loadingTip) loadingTip.textContent = tips[tipIndex];
        }, 3000);
        
        const loadInterval = setInterval(() => {
            if (stepIndex < loadingSteps.length) {
                const step = loadingSteps[stepIndex];
                progress = step.progress;
                if (progressBar) progressBar.style.width = `${progress}%`;
                if (loadingStatus) loadingStatus.textContent = step.text;
                stepIndex++;
            } else {
                clearInterval(loadInterval);
                clearInterval(tipInterval);
                // Загрузка завершена
                setTimeout(() => {
                    finishLoading();
                }, 500);
            }
        }, 250);
    }
    
    // Завершение загрузки
    function finishLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.8s ease';
            
            setTimeout(() => {
                if (loadingScreen) loadingScreen.style.display = 'none';
                if (mainContent) {
                    mainContent.style.display = 'block';
                    mainContent.style.animation = 'fadeIn 0.8s ease';
                }
                
                // Показываем приветственное уведомление
                if (window.showNotification) {
                    window.showNotification('📖 Энциклопедия Тьмы загружена! Нажми [СЕКРЕТНАЯ ТЕМА] для полного погружения.', 5000);
                }
            }, 800);
        } else {
            // Если экрана загрузки нет, просто показываем контент
            if (mainContent) mainContent.style.display = 'block';
        }
    }
    
    // Добавляем CSS для экрана загрузки
    function addLoadingStyles() {
        if (document.getElementById('loadingStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'loadingStyles';
        style.textContent = `
            /* ЭКРАН ЗАГРУЗКИ */
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a0c0f 0%, #1a0a2e 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                transition: opacity 0.8s ease;
            }
            
            .loading-container {
                text-align: center;
                padding: 40px;
                background: rgba(20, 22, 27, 0.9);
                border: 3px solid #6a4e9b;
                box-shadow: 0 0 50px #8a2be2;
                backdrop-filter: blur(5px);
                border-radius: 10px;
            }
            
            #starCanvas {
                display: block;
                margin: 0 auto 30px;
                filter: drop-shadow(0 0 20px #ff66cc);
            }
            
            .loading-text {
                text-align: center;
            }
            
            .loading-title {
                font-family: 'Press Start 2P', 'Courier New', monospace;
                font-size: 20px;
                color: #ffffff;
                text-shadow: 3px 3px 0 #6a4e9b;
                display: block;
                margin-bottom: 25px;
                letter-spacing: 2px;
            }
            
            .loading-progress {
                width: 300px;
                height: 12px;
                background-color: #2a2e3a;
                border: 2px solid #6a4e9b;
                margin: 0 auto 15px;
                box-shadow: inset 0 0 5px #000;
            }
            
            .progress-bar {
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #9147ff, #ff66cc);
                transition: width 0.3s ease;
                box-shadow: 0 0 10px #ff66cc;
            }
            
            .loading-status {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                color: #bc94ff;
                margin-bottom: 15px;
                letter-spacing: 1px;
            }
            
            .loading-tip {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: #8888aa;
                font-style: italic;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Прячем основной контент до загрузки
    function hideMainContent() {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }
    
    // Инициализация
    function initLoadingScreen() {
        // Сначала прячем основной контент
        hideMainContent();
        
        // Добавляем стили
        addLoadingStyles();
        
        // Создаём экран загрузки
        createLoadingScreen();
        
        // Запускаем анимацию звезды с небольшой задержкой (ждём создания canvas)
        setTimeout(() => {
            const star = new DeltaruneStar('starCanvas');
        }, 50);
        
        // Запускаем симуляцию загрузки
        simulateLoading();
    }
    
    // Запускаем немедленно
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoadingScreen);
    } else {
        initLoadingScreen();
    }
})();