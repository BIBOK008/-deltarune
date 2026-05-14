// ========== ВСЯ ЛОГИКА РАБОТЫ САЙТА ==========

// Глобальная переменная для отслеживания секретного режима
let isSecretMode = false;

// Функция плавной прокрутки к выбранному боссу
function scrollToBoss(bossId) {
    const bossElement = document.getElementById(`boss-${bossId}`);
    
    if (bossElement) {
        // Убираем подсветку у всех боссов
        document.querySelectorAll('.boss-encounter').forEach(boss => {
            boss.classList.remove('highlight');
        });
        
        // Убираем выделение у всех кнопок
        document.querySelectorAll('.save-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Подсвечиваем выбранного босса
        bossElement.classList.add('highlight');
        
        // Подсвечиваем нажатую кнопку
        const clickedButton = document.querySelector(`.save-slot[data-boss="${bossId}"]`);
        if (clickedButton) {
            clickedButton.classList.add('selected');
        }
        
        // Плавная прокрутка к боссу
        bossElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Показываем уведомление с учётом секретного режима
        const bossNames = {
            king: 'КОРОЛЯ',
            jevil: 'ДЖИВИЛА',
            queen: 'КОРОЛЕВУ',
            spamton: 'СПАМТОНА NEO',
            tenna: 'ТЕННУ',
            gerson: 'ТИТАНА',
            knight: 'РЫЦАРЯ'
        };
        
        let message = `➡️ Переход к ${bossNames[bossId] || bossId}`;
        if (isSecretMode) {
            message = `🔮 [СЕКРЕТНО] ${message} 🔮`;
        }
        window.showNotification(message);
        
        // Убираем подсветку через 2 секунды
        setTimeout(() => {
            bossElement.classList.remove('highlight');
        }, 2000);
    } else {
        window.showNotification(`❌ Босс не найден!`);
    }
}

// Глобальная функция для уведомлений
window.showNotification = function(message, duration = 3000) {
    const notificationArea = document.getElementById('notificationArea');
    if (!notificationArea) return;
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    
    notificationArea.appendChild(notification);
    
    setTimeout(() => {
        if (notification && notification.remove) {
            notification.remove();
        }
    }, duration);
};

// ОБНОВЛЁННАЯ: Цитаты боссов с секретными вариантами
function showBossQuote(bossId) {
    // Обычные цитаты
    const normalQuotes = {
        king: '"ВЫ ДУМАЕТЕ, ВЫ МОЖЕТЕ ПОБЕДИТЬ МЕНЯ?" — Король',
        jevil: '"CHAOS CHAOS! I CAN DO ANYTHING!" — Дживил',
        queen: '"Ох, Мои Милые Идиотские Дети..." — Королева',
        spamton: '"NOW\'S YOUR CHANCE TO BE A [[BIG SHOT]]!!" — Спамтон',
        tenna: '"ДОБРО ПОЖАЛОВАТЬ НА МОЁ ШОУ!" — Мистер Антенна',
        gerson: '"ТЫ ВСЕГО ЛИШЬ ПЫЛИНКА..." — Титан',
        knight: '"Я ОТКРОЮ ВСЕ ФОНТАНЫ..." — Рыцарь'
    };
    
    // СЕКРЕТНЫЕ цитаты (в секретном режиме)
    const secretQuotes = {
        king: '"Я БЫЛ ПРОСТО ПЕШКОЙ В ЧЬЕЙ-ТО ИГРЕ..." — Король (секрет)',
        jevil: '"ТЫ НИКОГДА НЕ ПОБЕДИШЬ МЕНЯ ПО-НАСТОЯЩЕМУ... ЭТО ВСЕГО ЛИШЬ ИГРА..." — Дживил (секрет)',
        queen: '"МОИ ДЕТИ... Я ПРОСТО ХОТЕЛА КАК ЛУЧШЕ..." — Королева (секрет)',
        spamton: '"[[BIG SHOT]]... ЭТО БЫЛА ЛОЖЬ... Я НИКТО..." — Спамтон (секрет)',
        tenna: '"ЗА ЭКРАНОМ ТАК ПУСТО... ПОЧЕМУ НИКТО НЕ ВИДИТ?" — Мистер Антенна (секрет)',
        gerson: '"ДАЖЕ ТИТАНЫ ОДНАЖДЫ ПАДАЮТ..." — Титан (секрет)',
        knight: '"ТЫ УЖЕ ЗНАЕШЬ, КТО Я... ПРОСТО ПРИМИ ЭТО..." — Рыцарь (секрет)'
    };
    
    const quotes = isSecretMode ? secretQuotes : normalQuotes;
    window.showNotification(`💬 ${quotes[bossId] || '❄☟✋💧 ☜✠🏱☜☼✋💣☜☠❄ ✋💧 ✞☜☼✡ ✋☠❄☜☼☜💧❄✋☠☝'}`);
}

// Функция прокрутки наверх
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    if (isSecretMode) {
        window.showNotification('⬆️ [СЕКРЕТНЫЙ РЕЖИМ] Возврат наверх ⬆️');
    } else {
        window.showNotification('⬆️ Возврат наверх');
    }
}

// НОВАЯ ФУНКЦИЯ: Показ дополнительной статистики
function showSecretStats() {
    const secretStats = document.querySelectorAll('.secret-stat');
    if (isSecretMode) {
        secretStats.forEach(stat => {
            stat.style.display = 'block';
        });
        window.showNotification('📊 [СЕКРЕТНАЯ СТАТИСТИКА] Теперь видно скрытые параметры боссов!');
    } else {
        secretStats.forEach(stat => {
            stat.style.display = 'none';
        });
    }
}

// НОВАЯ ФУНКЦИЯ: Переключение порядка кнопок
function reorderSaveSlots() {
    const savePanel = document.getElementById('savePanel');
    if (!savePanel) return;
    
    const slots = Array.from(document.querySelectorAll('.save-slot'));
    
    if (isSecretMode) {
        // Секретный порядок: случайный (как "хаос")
        const shuffled = [...slots];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        shuffled.forEach(slot => savePanel.appendChild(slot));
        window.showNotification('🎲 [ХАОС-РЕЖИМ] Кнопки боссов перемешаны!');
    } else {
        // Исходный порядок
        const originalOrder = ['king', 'jevil', 'queen', 'spamton', 'tenna', 'gerson', 'knight'];
        originalOrder.forEach(id => {
            const slot = document.querySelector(`.save-slot[data-boss="${id}"]`);
            if (slot) savePanel.appendChild(slot);
        });
    }
}

// НОВАЯ ФУНКЦИЯ: Показ секретного босса
function toggleSecretBoss() {
    const secretBoss = document.getElementById('boss-secret');
    
    if (isSecretMode) {
        if (secretBoss) {
            secretBoss.style.display = 'block';
            window.showNotification('⚠️ [СЕКРЕТНЫЙ БОСС ОБНАРУЖЕН] ГАСТЕР?! ⚠️', 4000);
        } else {
            window.showNotification('⚠️ [ОШИБКА] Секретный босс не загружен ⚠️');
        }
    } else {
        if (secretBoss) {
            secretBoss.style.display = 'none';
        }
    }
}

// НОВАЯ ФУНКЦИЯ: Секретные уведомления
function setupSecretNotifications() {
    if (isSecretMode) {
        // Добавляем секретный класс ко всем уведомлениям
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notif => {
            notif.style.borderLeftColor = '#ff00c1';
            notif.style.borderBottomColor = '#ff00c1';
        });
    } else {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notif => {
            notif.style.borderLeftColor = '#9147ff';
            notif.style.borderBottomColor = '#6a4e9b';
        });
    }
}

// ГЛАВНАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ СЕКРЕТНОЙ ТЕМЫ (ОБНОВЛЁННАЯ)
function toggleSecretTheme() {
    // Переключаем глобальный флаг
    isSecretMode = !isSecretMode;
    
    if (isSecretMode) {
        // ========== ВКЛЮЧАЕМ СЕКРЕТНУЮ ТЕМУ ==========
        
        // 1. Визуальные изменения
        document.body.style.backgroundColor = '#1a0f2e';
        document.body.style.backgroundImage = 'radial-gradient(circle at 50% 50%, rgba(255, 0, 200, 0.15) 0%, transparent 50%)';
        
        // 2. Добавляем класс для дополнительных CSS-эффектов
        document.body.classList.add('secret-theme-active');
        
        // 3. Меняем надпись на кнопке
        const secretBtn = document.getElementById('secretThemeBtn');
        if (secretBtn) secretBtn.textContent = '[ВЫКЛЮЧИТЬ СЕКРЕТЫ]';
        
        // 4. Показываем секретную статистику
        showSecretStats();
        
        // 5. Перемешиваем кнопки боссов (хаос)
        reorderSaveSlots();
        
        // 6. Показываем секретного босса
        toggleSecretBoss();
        
        // 7. Уведомление о включении
        window.showNotification('🔮 СЕКРЕТНАЯ ТЕМА АКТИВИРОВАНА! 🔮\n✨ Секретные цитаты + скрытая статистика + хаос-порядок + тайный босс! ✨', 5000);
        
    } else {
        // ========== ВЫКЛЮЧАЕМ СЕКРЕТНУЮ ТЕМУ ==========
        
        // 1. Возвращаем обычные цвета
        document.body.style.backgroundColor = '#0a0c0f';
        document.body.style.backgroundImage = 'radial-gradient(circle at 10% 20%, rgba(180, 70, 250, 0.08) 0%, transparent 30%), radial-gradient(circle at 90% 70%, rgba(70, 130, 250, 0.08) 0%, transparent 35%)';
        
        // 2. Убираем класс
        document.body.classList.remove('secret-theme-active');
        
        // 3. Возвращаем надпись на кнопке
        const secretBtn = document.getElementById('secretThemeBtn');
        if (secretBtn) secretBtn.textContent = '[СЕКРЕТНАЯ ТЕМА]';
        
        // 4. Скрываем секретную статистику
        showSecretStats();
        
        // 5. Восстанавливаем порядок кнопок
        reorderSaveSlots();
        
        // 6. Скрываем секретного босса
        toggleSecretBoss();
        
        // 7. Уведомление о выключении
        window.showNotification('✨ Обычная тема восстановлена ✨', 3000);
    }
    
    // Обновляем стиль уведомлений
    setupSecretNotifications();
}

// НОВАЯ ФУНКЦИЯ: Создание секретного босса (Гастер)
function createSecretBoss() {
    // Проверяем, существует ли уже секретный босс
    if (document.getElementById('boss-secret')) return;
    
    const container = document.querySelector('.container');
    const footer = document.querySelector('.footer');
    
    const secretBossHTML = `
        <div class="boss-encounter secret-glitch" id="boss-secret" style="border-color: #ffffff; display: none;">
            <div class="boss-header" style="background-color: #000000; border-bottom-color: #ffffff;">
                <span class="boss-name" style="color: #ffffff;">W.D. GASTER / ТАЙНЫЙ СТРАЖ</span>
                <div class="boss-hp-bar"><div class="boss-hp-fill" style="width: 100%; background: linear-gradient(90deg, #ffffff, #888888);"></div></div>
                <span class="hp-text">?????? HP [ЗА ПРЕДЕЛАМИ]</span>
            </div>
            <div class="flex-container">
                <div class="boss-image-container" style="border-color: #ffffff;">
                    <img src="https://avatars.mds.yandex.net/i?id=a1ee1f0721fca5542f4cda0e0c65974b_l-9181103-images-thumbs&n=13" 
                         alt="Gaster Sprite" 
                         class="boss-img" data-boss-quote="secret"
                         onerror="this.src='https://via.placeholder.com/150x150/000000/ffffff?text=GASTER'">
                    <p style="color: #ffffff;">◈ W.D. GASTER ◈</p>
                </div>
                <div class="act-menu" style="margin: 0; border-color: #ffffff;">
                    <div class="act-item" data-info="СИЛА ГАСТЕРА: За пределами измерений"><strong>⚡ СИЛА:</strong> Бесконечная</div>
                    <div class="act-item" data-info="РЕАЛЬНОСТЬ: Разрушена"><strong>🌀 РЕАЛЬНОСТЬ:</strong> Искажена</div>
                    <div class="act-item" data-info="ФОРМА: Неизвестна"><strong>❓ ФОРМА:</strong> За пределами понимания</div>
                    <div class="act-item" data-info="ГОЛОС: Тишина"><strong>🔇 ГОЛОС:</strong> ..........</div>
                </div>
            </div>
            <div class="stats-grid">
                <div class="stat-card" style="border-color: #ffffff;">
                    <h4 style="color:#ffffff;">💀 СКРЫТЫЕ СПОСОБНОСТИ</h4>
                    <ul>
                        <li data-info="Манипуляция временем">Манипуляция временем</li>
                        <li data-info="Контроль над реальностью">Контроль над реальностью</li>
                        <li data-info="Доступ к файлам игры">Доступ к файлам игры</li>
                        <li data-info="Наблюдение за игроком">Наблюдение за игроком</li>
                        <li data-info="Существование между мирами">Существование между мирами</li>
                    </ul>
                </div>
                <div class="stat-card" style="border-color: #ffffff;">
                    <h4 style="color:#ffffff;">🎴 НЕОПИСУЕМЫЕ АТАКИ</h4>
                    <ul>
                        <li data-info="Удар из другой вселенной"><strong>ВЗЛОМ РЕАЛЬНОСТИ</strong></li>
                        <li data-info="Глюк экрана"><strong>НЕВОЗМОЖНОСТЬ</strong></li>
                        <li data-info="Сброс игры"><strong>КОНЕЦ ФАЙЛА</strong></li>
                        <li data-info="Тишина"><strong>.....</strong></li>
                    </ul>
                </div>
            </div>
            <div class="attack-pattern" style="border-left-color: #ffffff;">
                <div class="pattern-title" style="color:#ffffff;">⚠️ НЕИЗВЕСТНАЯ ОСОБЕННОСТЬ</div>
                <p><strong>ГАСТЕР</strong> — персонаж, который был удалён из игры... или нет? Его существование — одна из главных тайн вселенной Undertale и Deltarune. Говорят, что его можно встретить, только если знать правильную комбинацию...</p>
                <p style="margin-top: 10px; color: #888888;"><em>[...ЭТОТ БОСС НЕ ДОЛЖЕН СУЩЕСТВОВАТЬ...]</em></p>
            </div>
            <div class="quote-block" data-quote="secret" style="border-color: #ffffff; background-color:#000000;">
                "........................"
                <div class="quote-author" style="color:#ffffff;">— ???????</div>
            </div>
        </div>
    `;
    
    // Вставляем секретного босса перед подвалом
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', secretBossHTML);
    }
}

// Функция для добавления секретной статистики к существующим боссам
function addSecretStats() {
    // Добавляем скрытую статистику для каждого босса
    const bosses = document.querySelectorAll('.boss-encounter');
    
    bosses.forEach(boss => {
        // Пропускаем, если уже есть секретная статистика
        if (boss.querySelector('.secret-stat')) return;
        
        const statsGrid = boss.querySelector('.stats-grid');
        if (statsGrid) {
            const secretStat = document.createElement('div');
            secretStat.className = 'stat-card secret-stat';
            secretStat.style.display = 'none';
            secretStat.style.borderColor = '#ff00c1';
            
            // Определяем, какой это босс
            let secretContent = '';
            if (boss.id === 'boss-king') {
                secretContent = '<h4 style="color:#ff00c1;">🔮 СЕКРЕТНАЯ СТАТИСТИКА</h4><ul><li>Скрытый урон: +50% в фазе Солнца</li><li>Секретная фраза: "Я всего лишь пешка"</li></ul>';
            } else if (boss.id === 'boss-jevil') {
                secretContent = '<h4 style="color:#ff00c1;">🔮 СЕКРЕТНАЯ СТАТИСТИКА</h4><ul><li>Шанс хаоса: 99.9%</li><li>Секрет: Его можно загипнотизировать навсегда</li></ul>';
            } else if (boss.id === 'boss-spamton') {
                secretContent = '<h4 style="color:#ff00c1;">🔮 СЕКРЕТНАЯ СТАТИСТИКА</h4><ul><li>[[СЕКРЕТНАЯ СТАТИСТИКА]]: +999 ATK</li><li>Секрет: Он всё ещё продаёт... но никто не покупает</li></ul>';
            } else {
                secretContent = '<h4 style="color:#ff00c1;">🔮 СЕКРЕТНАЯ СТАТИСТИКА</h4><ul><li>Скрытый параметр: ???</li><li>Секрет: Разблокируется в следующей главе</li></ul>';
            }
            
            secretStat.innerHTML = secretContent;
            statsGrid.appendChild(secretStat);
        }
    });
}

// Инициализация всех обработчиков
function setupEventListeners() {
    // Кнопки сохранения
    document.querySelectorAll('.save-slot').forEach(slot => {
        slot.removeEventListener('click', saveSlotClickHandler);
        slot.addEventListener('click', saveSlotClickHandler);
    });
    
    // Кликабельные элементы
    setupInteractiveElements();
}

function saveSlotClickHandler(e) {
    const bossId = this.getAttribute('data-boss');
    if (bossId) {
        scrollToBoss(bossId);
    }
}

function setupInteractiveElements() {
    // ACT элементы
    document.querySelectorAll('.act-item').forEach(item => {
        item.removeEventListener('click', handleActClick);
        item.addEventListener('click', handleActClick);
    });
    
    // Пункты списков
    document.querySelectorAll('.stat-card li').forEach(li => {
        li.removeEventListener('click', handleLiClick);
        li.addEventListener('click', handleLiClick);
    });
    
    // Изображения боссов
    document.querySelectorAll('.boss-img').forEach(img => {
        img.removeEventListener('click', handleImgClick);
        img.addEventListener('click', handleImgClick);
    });
    
    // Цитаты
    document.querySelectorAll('.quote-block').forEach(quote => {
        quote.removeEventListener('click', handleQuoteClick);
        quote.addEventListener('click', handleQuoteClick);
    });
}

function handleActClick(e) {
    const item = e.currentTarget;
    const info = item.getAttribute('data-info');
    if (info) {
        let message = `📊 ${info}`;
        if (isSecretMode) message = `🔮 ${message} 🔮`;
        window.showNotification(message);
    }
}

function handleLiClick(e) {
    const li = e.currentTarget;
    const info = li.getAttribute('data-info');
    if (info) {
        let message = `⚔️ ${info}`;
        if (isSecretMode) message = `🔮 ${message} 🔮`;
        window.showNotification(message);
    }
}

function handleImgClick(e) {
    const img = e.currentTarget;
    const bossId = img.getAttribute('data-boss-quote');
    if (bossId) {
        showBossQuote(bossId);
    } else {
        window.showNotification(`🖼️ ${img.alt || 'Изображение босса'}`);
    }
}

function handleQuoteClick(e) {
    const quote = e.currentTarget;
    const bossId = quote.getAttribute('data-quote');
    if (bossId) {
        showBossQuote(bossId);
    }
}

// Отслеживание прокрутки для кнопки "Наверх"
window.addEventListener('scroll', function() {
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
});

// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', function() {
    // Создаём секретного босса
    createSecretBoss();
    
    // Добавляем секретную статистику
    addSecretStats();
    
    // Настраиваем обработчики
    setupEventListeners();
    
    // Настраиваем кнопку "Наверх"
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        backBtn.addEventListener('click', scrollToTop);
    }
    
    // Настраиваем кнопку секретной темы
    const secretBtn = document.getElementById('secretThemeBtn');
    if (secretBtn) {
        secretBtn.addEventListener('click', toggleSecretTheme);
    }
    
    window.showNotification('📖 Энциклопедия Тьмы загружена! Нажми [СЕКРЕТНАЯ ТЕМА] для полного погружения.', 5000);
});

// Экспортируем в глобальную область
window.scrollToBoss = scrollToBoss;
window.showBossQuote = showBossQuote;
window.scrollToTop = scrollToTop;
window.toggleSecretTheme = toggleSecretTheme;
window.showNotification = window.showNotification;