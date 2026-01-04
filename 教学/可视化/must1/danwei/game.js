class PhysicsGame {
    constructor() {
        this.difficulty = 'easy';
        this.gameData = [];
        this.selectedConcept = null;
        this.selectedUnit = null;
        this.matches = [];
        this.timer = null;
        this.timeLeft = 0;
        this.isPlaying = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDifficultyDisplay();
    }

    bindEvents() {
        // 难度选择
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.difficulty = e.target.dataset.difficulty;
                this.updateDifficultyDisplay();
            });
        });

        // 开始按钮
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });

        // 重置按钮
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
    }

    updateDifficultyDisplay() {
        const config = difficultyConfig[this.difficulty];
        document.getElementById('status').textContent = config.name;
    }

    startGame() {
        this.isPlaying = true;
        this.matches = [];
        this.selectedConcept = null;
        this.selectedUnit = null;

        // 根据难度选择题目
        const config = difficultyConfig[this.difficulty];
        this.gameData = this.shuffleArray([...physicsData])
            .slice(0, config.itemCount);

        this.renderGame();
        this.startTimer(config.timeLimit);

        document.getElementById('startBtn').disabled = true;
        document.getElementById('resetBtn').disabled = false;
        document.getElementById('status').textContent = '游戏中...';
        this.updateProgress();
    }

    renderGame() {
        const conceptsDiv = document.getElementById('concepts');
        const unitsDiv = document.getElementById('units');

        conceptsDiv.innerHTML = '';
        unitsDiv.innerHTML = '';

        // 渲染概念卡片
        this.gameData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card concept-card';
            card.dataset.id = item.id;
            card.innerHTML = `
                <div>
                    <div class="concept-name">${item.concept}</div>
                    <div class="concept-desc">${item.description}</div>
                </div>
            `;
            card.addEventListener('click', () => this.selectConcept(item.id, card));
            conceptsDiv.appendChild(card);
        });

        // 渲染单位卡片（打乱顺序）
        const shuffledUnits = this.shuffleArray([...this.gameData]);
        shuffledUnits.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card unit-card';
            card.dataset.id = item.id;
            // 显示第一个单位
            card.innerHTML = `
                <div class="unit-text">${item.units[0]}</div>
                <div class="formula-text">${item.formula}</div>
            `;
            card.addEventListener('click', () => this.selectUnit(item.id, card));
            unitsDiv.appendChild(card);
        });
    }

    selectConcept(id, card) {
        if (!this.isPlaying || this.matches.includes(id)) return;

        // 取消之前的选择
        document.querySelectorAll('.concept-card.selected').forEach(c => 
            c.classList.remove('selected')
        );

        this.selectedConcept = id;
        card.classList.add('selected');

        // 如果已经选择了单位，进行匹配
        if (this.selectedUnit !== null) {
            this.checkMatch();
        }
    }

    selectUnit(id, card) {
        if (!this.isPlaying || this.matches.includes(id)) return;

        // 取消之前的选择
        document.querySelectorAll('.unit-card.selected').forEach(c => 
            c.classList.remove('selected')
        );

        this.selectedUnit = id;
        card.classList.add('selected');

        // 如果已经选择了概念，进行匹配
        if (this.selectedConcept !== null) {
            this.checkMatch();
        }
    }

    checkMatch() {
        if (this.selectedConcept === this.selectedUnit) {
            // 匹配成功
            this.matches.push(this.selectedConcept);
            
            document.querySelectorAll(`[data-id="${this.selectedConcept}"]`).forEach(card => {
                card.classList.remove('selected');
                card.classList.add('matched');
            });

            this.updateProgress();

            // 检查是否完成
            if (this.matches.length === this.gameData.length) {
                this.gameWin();
            }
        } else {
            // 匹配失败
            const cards = document.querySelectorAll('.card.selected');
            cards.forEach(card => {
                card.classList.add('wrong');
                setTimeout(() => {
                    card.classList.remove('wrong', 'selected');
                }, 500);
            });
        }

        this.selectedConcept = null;
        this.selectedUnit = null;
    }

    updateProgress() {
        document.getElementById('progress').textContent = 
            `${this.matches.length}/${this.gameData.length}`;
    }

    startTimer(timeLimit) {
        if (timeLimit === 0) {
            document.getElementById('timer').textContent = '∞';
            return;
        }

        this.timeLeft = timeLimit;
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 10) {
                document.getElementById('timer').classList.add('warning');
            }

            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        document.getElementById('timer').textContent = `${this.timeLeft}秒`;
    }

    gameWin() {
        this.endGame();
        const config = difficultyConfig[this.difficulty];
        const timeUsed = config.timeLimit === 0 ? 
            '无限制' : 
            `${config.timeLimit - this.timeLeft}秒`;

        this.showResult(
            '🎉 恭喜通关！',
            `你成功完成了所有匹配！<br>用时：${timeUsed}`,
            '完美！'
        );
    }

    gameOver() {
        this.endGame();
        this.showResult(
            '⏰ 时间到！',
            `完成进度：${this.matches.length}/${this.gameData.length}`,
            '继续努力！'
        );
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.timer);
        document.getElementById('timer').classList.remove('warning');
        document.getElementById('status').textContent = '游戏结束';
    }

    showResult(title, message, score) {
        document.getElementById('resultTitle').innerHTML = title;
        document.getElementById('resultMessage').innerHTML = message;
        document.getElementById('finalScore').textContent = score;
        document.getElementById('resultModal').classList.add('show');
    }

    resetGame() {
        this.endGame();
        this.matches = [];
        this.selectedConcept = null;
        this.selectedUnit = null;
        
        document.getElementById('concepts').innerHTML = '';
        document.getElementById('units').innerHTML = '';
        document.getElementById('timer').textContent = '--';
        document.getElementById('progress').textContent = '0/0';
        document.getElementById('status').textContent = '准备开始';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('resetBtn').disabled = true;
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('resultModal').classList.remove('show');
}

// 初始化游戏
const game = new PhysicsGame();