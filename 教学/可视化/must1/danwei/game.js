class PhysicsGame {
    constructor() {
        this.difficulty = 'easy';
        this.subjects = []; // 默认不选中任何学科
        this.gameData = [];
        this.selectedConcept = null;
        this.selectedUnit = null;
        this.matches = [];
        this.timer = null;
        this.timeLeft = 0;
        this.isPlaying = false;
        this.audioPlayed = false; // 标记倒计时音频是否已播放
        this.volume = 0.5; // 设置统一音量值（0.0-1.0）
        this.soundEnabled = true; // 音效开关状态，默认开启
        
        // 初始化音频对象
        this.countdownAudio = new Audio('djs.mp3'); // 倒计时音频
        this.victoryAudio = new Audio('victory.mp3'); // 游戏成功音频
        this.defeatAudio = new Audio('defeat.mp3'); // 游戏失败音频
        this.errorAudio = new Audio('error.wav'); // 匹配错误音频
        this.correctAudio = new Audio('correct.wav'); // 匹配正确音频
        this.backgroundMusic = new Audio('background.mp3'); // 背景音乐
        this.backgroundMusic.loop = true;
        
        // 设置初始音量
        this.countdownAudio.volume = this.volume+0.1;
        this.victoryAudio.volume = this.volume;
        this.defeatAudio.volume = this.volume;
        this.errorAudio.volume = this.volume;
        this.correctAudio.volume = this.volume;
        
        // 设置背景音乐循环
        if (this.backgroundMusic) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.volume * 0.2 ; // 背景音乐音量较低
        }
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDifficultyDisplay();
        // 默认背景音乐关闭，不自动播放
    }

    bindEvents() {
        // 学科选择
        document.querySelectorAll('.subject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.classList.toggle('active');
                const subject = e.target.dataset.subject;
                if (e.target.classList.contains('active')) {
                    if (!this.subjects.includes(subject)) {
                        this.subjects.push(subject);
                    }
                } else {
                    this.subjects = this.subjects.filter(s => s !== subject);
                }
            });
        });

        // 难度选择
        document.querySelectorAll('.difficulty-btn[data-difficulty]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn[data-difficulty]').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.difficulty = e.target.dataset.difficulty;
                this.updateDifficultyDisplay();
            });
        });

        // 音效开关按钮
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        if (soundToggleBtn) {
            soundToggleBtn.addEventListener('click', () => this.toggleSound());
        }

        // 合并开始和重新开始按钮
        const startResetBtn = document.getElementById('startResetBtn');
        startResetBtn.addEventListener('click', () => {
            if (!this.isPlaying) {
                this.startGame();
            } else {
                this.resetGame();
            }
        });
    }

    loadSubjectData() {
        // 如果未选择任何学科，使用默认的data.js数据
        if (this.subjects.length === 0) {
            return physicsData;
        }
        
        // 合并所有选中学科的数据
        let combinedData = [];
        this.subjects.forEach(subject => {
            switch(subject) {
                case 'physics':
                    // 加载基础力学单位（data.js）和扩展力学单位（mechanics.js）
                    combinedData = combinedData.concat(physicsData);
                    combinedData = combinedData.concat(mechanicsData);
                    break;
                case 'electromagnetism':
                    combinedData = combinedData.concat(electromagnetismData);
                    break;
                case 'thermodynamics':
                    combinedData = combinedData.concat(thermodynamicsData);
                    break;
                case 'optics':
                    combinedData = combinedData.concat(opticsData);
                    break;
            }
        });
        return combinedData;
    }

    startGame() {
        this.isPlaying = true;
        this.matches = [];
        this.selectedConcept = null;
        this.selectedUnit = null;

        // 根据学科加载数据
        const subjectData = this.loadSubjectData();
        const config = difficultyConfig[this.difficulty];
        this.gameData = this.shuffleArray([...subjectData])
            .slice(0, config.itemCount);

        this.renderGame();
        this.startTimer(config.timeLimit);

        const startResetBtn = document.getElementById('startResetBtn');
        startResetBtn.textContent = '🔄 重新开始';
        document.getElementById('status').textContent = '游戏中...';
        this.updateProgress();
    }

    updateDifficultyDisplay() {
        const config = difficultyConfig[this.difficulty];
        document.getElementById('status').textContent = config.name;
    }

    renderGame() {
        const conceptsDiv = document.getElementById('concepts');
        const formulasDiv = document.getElementById('formulas');

        conceptsDiv.innerHTML = '';
        formulasDiv.innerHTML = '';

        // 渲染概念卡片
        this.gameData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card concept-card';
            card.dataset.id = item.id;
            card.innerHTML = `
                <div class="concept-name" style="display: flex; align-items: center; justify-content: center; height: 100%;">
                    ${item.concept}
                </div>
            `;
            card.addEventListener('click', () => this.selectConcept(item.id, card));
            conceptsDiv.appendChild(card);
        });

        // 渲染公式卡片（打乱顺序）
        const shuffledFormulas = this.shuffleArray([...this.gameData]);
        shuffledFormulas.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card formula-card';
            card.dataset.id = item.id;
            card.innerHTML = `
                <div class="formula-text" style="display: flex; align-items: center; justify-content: center; height: 100%;">
                    ${this.renderLatex(item.formula)}
                </div>
            `;
            card.addEventListener('click', () => this.selectUnit(item.id, card));
            formulasDiv.appendChild(card);
        });

        // 渲染LaTeX公式
        this.renderLatexInCards();
    }

    renderLatex(formula) {
        // 将LaTeX公式包装在KaTeX渲染元素中
        return `<span class="latex-formula">${formula}</span>`;
    }

    renderLatexInCards() {
        // 使用KaTeX渲染所有LaTeX公式
        const renderLatex = () => {
            if (window.katex) {
                document.querySelectorAll('.latex-formula').forEach(element => {
                    try {
                        katex.render(element.textContent, element, {
                            throwOnError: false,
                            displayMode: false
                        });
                    } catch (error) {
                        console.error('KaTeX渲染错误:', error);
                        // 如果渲染失败，显示原始文本
                        element.innerHTML = element.textContent;
                    }
                });
            } else {
                // 如果KaTeX未加载，等待一段时间后重试
                setTimeout(renderLatex, 100);
            }
        };
        
        // 立即尝试渲染
        renderLatex();
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
        document.querySelectorAll('.formula-card.selected').forEach(c => 
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
            // 匹配成功，播放正确音频
            this.playCorrectAudio();
            
            this.matches.push(this.selectedConcept);
            
            // 添加消失动画并移除当前选中的两张卡片
            const selectedCards = document.querySelectorAll('.card.selected');
            selectedCards.forEach(card => {
                card.classList.add('matched');
                // 添加消失动画
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0)';
                
                // 动画结束后移除卡片
                setTimeout(() => {
                    card.remove();
                }, 500);
            });

            this.updateProgress();

            // 检查是否完成
            if (this.matches.length === this.gameData.length) {
                this.gameWin();
            }
        } else {
            // 匹配失败，播放错误音频
            this.playErrorAudio();
            
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
        this.audioPlayed = false; // 重置倒计时音频播放标记
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 10) {
                document.getElementById('timer').classList.add('warning');
                // 最后十秒播放倒计时音频（只播放一次）
                if (!this.audioPlayed) {
                    this.playCountdownAudio();
                    this.audioPlayed = true;
                }
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
            '完美！',
            'victory.mp4'  // 显示胜利视频
        );
    }

    gameOver() {
        this.endGame();
        
        this.showResult(
            '⏰ 时间到！',
            `完成进度：${this.matches.length}/${this.gameData.length}`,
            '继续努力！',
            'defeat.mp4'  // 显示失败视频
        );
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.timer);
        document.getElementById('timer').classList.remove('warning');
        document.getElementById('status').textContent = '游戏结束';
        this.stopAllAudio(); // 停止所有音频
    }

    showResult(title, message, score, videoSrc = null) {
        document.getElementById('resultTitle').innerHTML = title;
        document.getElementById('resultMessage').innerHTML = message;
        document.getElementById('finalScore').textContent = score;
        
        const videoContainer = document.getElementById('videoContainer');
        const continueBtnContainer = document.getElementById('continueButtonContainer');
        const video = document.getElementById('resultVideo');
        const videoSource = document.getElementById('videoSource');
        
        if (videoSrc) {
            videoContainer.style.display = 'block';
            continueBtnContainer.style.display = 'none';
            
            // 设置视频源
            videoSource.src = videoSrc;
            video.load();
            video.currentTime = 0;
            video.play().catch(e => console.log('视频播放失败:', e));
            
            // 视频播放结束后显示继续按钮容器
            video.onended = () => {
                continueBtnContainer.style.display = 'block';
            };
        } else {
            videoContainer.style.display = 'none';
            continueBtnContainer.style.display = 'block';
        }
        
        document.getElementById('resultModal').classList.add('show');
    }

    resetGame() {
        this.endGame();
        this.matches = [];
        this.selectedConcept = null;
        this.selectedUnit = null;
        
        document.getElementById('concepts').innerHTML = '';
        document.getElementById('formulas').innerHTML = '';
        document.getElementById('timer').textContent = '--';
        document.getElementById('progress').textContent = '0/0';
        document.getElementById('status').textContent = '准备开始';
        const startResetBtn = document.getElementById('startResetBtn');
        startResetBtn.textContent = '🎮 开始游戏';
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // 音频播放方法
    playCountdownAudio() {
        this.stopAllAudio();
        this.countdownAudio.currentTime = 0;
        this.countdownAudio.play().catch(e => console.log('倒计时音频播放失败:', e));
    }

    playVictoryAudio() {
        this.stopAllAudio();
        this.victoryAudio.currentTime = 0;
        this.victoryAudio.play().catch(e => console.log('胜利音频播放失败:', e));
    }

    playDefeatAudio() {
        this.stopAllAudio();
        this.defeatAudio.currentTime = 0;
        this.defeatAudio.play().catch(e => console.log('失败音频播放失败:', e));
    }

    playErrorAudio() {
        this.stopAllAudio();
        this.errorAudio.currentTime = 0;
        this.errorAudio.play().catch(e => console.log('错误音频播放失败:', e));
    }

    playCorrectAudio() {
        this.stopAllAudio();
        this.correctAudio.currentTime = 0;
        this.correctAudio.play().catch(e => console.log('正确匹配音频播放失败:', e));
    }

    toggleSound() {
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            // 如果背景音乐正在播放，暂停它
            this.backgroundMusic.pause();
            soundToggleBtn.textContent = '🔇 背景音乐关闭';
            soundToggleBtn.classList.remove('active');
        } else {
            // 如果背景音乐暂停，尝试播放它
            if (this.backgroundMusic) {
                this.backgroundMusic.play().catch(e => {
                    console.log('恢复背景音乐播放失败:', e.message);
                    // 如果自动播放失败，在用户交互后重试
                    document.addEventListener('click', () => {
                        this.backgroundMusic.play()
                            .then(() => {
                                console.log('背景音乐播放成功');
                                soundToggleBtn.textContent = '🔊 背景音乐开启';
                                soundToggleBtn.classList.add('active');
                            })
                            .catch(e => console.log('背景音乐播放失败:', e.message));
                    }, { once: true });
                });
                soundToggleBtn.textContent = '🔊 背景音乐开启';
                soundToggleBtn.classList.add('active');
            }
        }
    }

    playBackgroundMusic() {
        if (this.backgroundMusic) {
            console.log('页面加载时尝试自动播放背景音乐...');
            console.log('背景音乐元素状态:', {
                readyState: this.backgroundMusic.readyState,
                networkState: this.backgroundMusic.networkState,
                error: this.backgroundMusic.error
            });
            
            this.backgroundMusic.play().then(() => {
                console.log('背景音乐自动播放成功');
                const soundToggleBtn = document.getElementById('soundToggleBtn');
                if (soundToggleBtn) {
                    soundToggleBtn.textContent = '🔊 背景音乐开启';
                    soundToggleBtn.classList.add('active');
                }
            }).catch(e => {
                console.log('背景音乐自动播放失败，需要用户交互:', e.message);
                console.log('错误详情:', {
                    name: e.name,
                    message: e.message,
                    code: e.code
                });
                
                // 如果自动播放失败，在用户交互后重试
                document.addEventListener('click', () => {
                    console.log('用户点击后尝试播放背景音乐...');
                    this.backgroundMusic.play()
                        .then(() => {
                            console.log('背景音乐播放成功');
                            const soundToggleBtn = document.getElementById('soundToggleBtn');
                            if (soundToggleBtn) {
                                soundToggleBtn.textContent = '🔊 背景音乐开启';
                                soundToggleBtn.classList.add('active');
                            }
                        })
                        .catch(e => console.log('背景音乐播放失败:', e.message));
                }, { once: true });
            });
        } else {
            console.error('背景音乐元素未找到，请检查HTML中的audio元素');
        }
    }
    
    stopAllAudio() {
        this.countdownAudio.pause();
        this.countdownAudio.currentTime = 0;
        this.victoryAudio.pause();
        this.victoryAudio.currentTime = 0;
        this.defeatAudio.pause();
        this.defeatAudio.currentTime = 0;
        this.errorAudio.pause();
        this.errorAudio.currentTime = 0;
        this.correctAudio.pause();
        this.correctAudio.currentTime = 0;
        // 注意：不停止背景音乐
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('resultModal').classList.remove('show');
}

// 初始化游戏
const game = new PhysicsGame();