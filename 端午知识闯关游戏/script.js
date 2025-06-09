// 游戏数据和状态
const gameData = {
    currentLevel: 0,
    score: 0,
    totalQuestions: 8,
    questions: [
        {
            image: "🏮",
            question: "端午节是为了纪念哪位历史人物？",
            options: ["屈原", "伍子胥", "曹娥", "介子推"],
            correct: 0,
            hint: "他是战国时期楚国的爱国诗人，投汨罗江以身殉国",
            knowledge: "屈原（约公元前340-278年）是中国历史上第一位伟大的爱国诗人，端午节正是为了纪念这位忠贞爱国的诗人。"
        },
        {
            image: "🚣‍♂️",
            question: "端午节赛龙舟的起源是什么？",
            options: ["娱乐活动", "救屈原", "祭祀龙王", "军事训练"],
            correct: 1,
            hint: "人们划船在江中寻找一位投江的诗人",
            knowledge: "赛龙舟起源于古时楚国人因舍不得贤臣屈原投江死去，许多人划船追赶拯救，后来每年五月五日划龙舟以纪念之。"
        },
        {
            image: "🥟",
            question: "粽子最初的作用是什么？",
            options: ["节日美食", "祭祀供品", "防止鱼虾吃屈原", "储存食物"],
            correct: 2,
            hint: "人们担心江中的生物会伤害诗人的身体",
            knowledge: "据传说，人们为了不让鱼虾损伤屈原的身体，就向江中投粽子喂鱼，后来逐渐发展成端午节吃粽子的习俗。"
        },
        {
            image: "🌿",
            question: "端午节挂艾草和菖蒲的寓意是什么？",
            options: ["装饰房屋", "驱邪避疫", "招财进宝", "祈求丰收"],
            correct: 1,
            hint: "这些植物有特殊的香味，古人认为能够净化环境",
            knowledge: "艾草和菖蒲都有浓烈的香味，古人认为可以驱虫防疫，在端午节这个疾病易发的时节起到保健作用。"
        },
        {
            image: "🧧",
            question: "五彩绳（五色丝）通常系在哪里？",
            options: ["脖子上", "手腕上", "脚踝上", "头发上"],
            correct: 1,
            hint: "系在人体的关节部位，寓意健康平安",
            knowledge: "五彩绳由红、黄、蓝、白、黑五种颜色的丝线编成，系在手腕或脚踝上，象征着五行调和，祈求健康平安。"
        },
        {
            image: "🍷",
            question: "端午节传统上要喝什么酒？",
            options: ["米酒", "雄黄酒", "花雕酒", "桂花酒"],
            correct: 1,
            hint: "这种酒的颜色是黄色的，古人认为能驱毒辟邪",
            knowledge: "雄黄酒是端午节的传统饮品，古人认为雄黄能驱毒辟邪，在酒中加入雄黄粉制成，但现代医学证明雄黄有毒，不宜饮用。"
        },
        {
            image: "📅",
            question: "端午节是农历的哪一天？",
            options: ["五月初四", "五月初五", "五月初六", "五月十五"],
            correct: 1,
            hint: "这个日期和节日名称中的'午'字有关",
            knowledge: "端午节在农历五月初五，'端'是开始的意思，'午'指五月，所以端午就是五月初五的意思。"
        },
        {
            image: "🎭",
            question: "《离骚》是哪位诗人的代表作？",
            options: ["李白", "杜甫", "屈原", "白居易"],
            correct: 2,
            hint: "这位诗人正是端午节所纪念的历史人物",
            knowledge: "《离骚》是屈原的代表作，是中国古代最长的抒情诗，表达了诗人对祖国的深切热爱和对理想的执着追求。"
        }
    ]
};

// DOM元素
const elements = {
    startPage: document.getElementById('start-page'),
    gamePage: document.getElementById('game-page'),
    resultPage: document.getElementById('result-page'),
    startBtn: document.getElementById('start-btn'),
    progress: document.getElementById('progress'),
    score: document.getElementById('score'),
    currentLevel: document.getElementById('current-level'),
    questionImage: document.getElementById('question-image'),
    questionText: document.getElementById('question-text'),
    options: document.getElementById('options'),
    hintBtn: document.getElementById('hint-btn'),
    hintModal: document.getElementById('hint-modal'),
    hintText: document.getElementById('hint-text'),
    resultIcon: document.getElementById('result-icon'),
    resultTitle: document.getElementById('result-title'),
    finalScore: document.getElementById('final-score'),
    resultMessage: document.getElementById('result-message'),
    knowledgeText: document.getElementById('knowledge-text'),
    restartBtn: document.getElementById('restart-btn'),
    shareBtn: document.getElementById('share-btn')
};

// 初始化游戏
function initGame() {
    // 绑定事件监听器
    elements.startBtn.addEventListener('click', startGame);
    elements.hintBtn.addEventListener('click', showHint);
    elements.restartBtn.addEventListener('click', restartGame);
    elements.shareBtn.addEventListener('click', shareResult);
    
    // 关闭模态框
    document.querySelector('.close').addEventListener('click', closeHint);
    window.addEventListener('click', (e) => {
        if (e.target === elements.hintModal) {
            closeHint();
        }
    });
    
    initAudioControls();
}

// 初始化音频控制
function initAudioControls() {
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = audioToggle.querySelector('.audio-icon');
    
    // 音频开关事件
    audioToggle.addEventListener('click', () => {
        const isEnabled = audioManager.toggle();
        audioToggle.classList.toggle('muted', !isEnabled);
        audioIcon.textContent = isEnabled ? '🔊' : '🔇';
        
        // 播放点击音效
        if (isEnabled) {
            audioManager.play('click');
        }
    });
    
    // 初始状态
    const status = audioManager.getStatus();
    audioToggle.classList.toggle('muted', !status.enabled);
    audioIcon.textContent = status.enabled ? '🔊' : '🔇';
}

// 开始游戏
function startGame() {
    gameData.currentLevel = 0;
    gameData.score = 0;
    showPage('game-page');
    loadQuestion();
    updateUI();
    
    // 播放背景音乐
    audioManager.playBackground();
    
    // 播放点击音效
    audioManager.play('click');
}

// 重新开始游戏
function restartGame() {
    showPage('start-page');
    
    // 播放点击音效
    audioManager.play('click');
}

// 显示页面
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// 加载题目
function loadQuestion() {
    const question = gameData.questions[gameData.currentLevel];
    
    elements.questionImage.textContent = question.image;
    elements.questionText.textContent = question.question;
    
    // 清空选项容器
    elements.options.innerHTML = '';
    
    // 创建选项按钮
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.setAttribute('data-index', String.fromCharCode(65 + index)); // A, B, C, D
        button.addEventListener('click', () => selectOption(index));
        
        // 添加点击动画效果
        button.addEventListener('click', function() {
            this.style.transform = 'translateY(-1px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        elements.options.appendChild(button);
    });
}

// 选择选项
function selectOption(selectedIndex) {
    const question = gameData.questions[gameData.currentLevel];
    const options = document.querySelectorAll('.option');
    
    // 播放音效
    if (selectedIndex === question.correct) {
        audioManager.play('correct');
    } else {
        audioManager.play('wrong');
    }
    
    // 禁用所有选项
    options.forEach(option => {
        option.disabled = true;
    });
    
    // 显示正确答案
    options[question.correct].classList.add('correct');
    
    if (selectedIndex === question.correct) {
        // 答对了
        gameData.score += 100;
        showFeedback('正确！', 'success');
    } else {
        // 答错了
        options[selectedIndex].classList.add('wrong');
        showFeedback('很遗憾，答错了', 'error');
    }
    
    updateUI();
    
    // 延迟进入下一题或结束游戏
    setTimeout(() => {
        gameData.currentLevel++;
        if (gameData.currentLevel < gameData.totalQuestions) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 2000);
}

// 显示反馈
function showFeedback(message, type) {
    // 可以在这里添加更丰富的反馈效果
    console.log(`${type}: ${message}`);
}

// 更新UI
function updateUI() {
    elements.score.textContent = gameData.score;
    elements.currentLevel.textContent = gameData.currentLevel + 1;
    
    const progress = ((gameData.currentLevel) / gameData.totalQuestions) * 100;
    elements.progress.style.width = `${progress}%`;
}

// 显示提示
function showHint() {
    const question = gameData.questions[gameData.currentLevel];
    elements.hintText.textContent = question.hint;
    elements.hintModal.style.display = 'block';
}

// 关闭提示
function closeHint() {
    elements.hintModal.style.display = 'none';
}

// 显示结果
function showResult() {
    showPage('result-page');
    
    // 停止背景音乐
    audioManager.stopBackground();
    
    // 播放完成音效
    audioManager.play('complete');
    
    const percentage = (gameData.score / (gameData.totalQuestions * 100)) * 100;
    
    // 根据得分显示不同的结果
    if (percentage >= 90) {
        elements.resultIcon.textContent = '🏆';
        elements.resultTitle.textContent = '端午文化达人！';
        elements.resultMessage.textContent = '太棒了！你对端午传统文化了如指掌，是真正的文化传承者！';
    } else if (percentage >= 70) {
        elements.resultIcon.textContent = '🎉';
        elements.resultTitle.textContent = '端午知识小能手！';
        elements.resultMessage.textContent = '不错哦！你对端午文化有很好的了解，继续加油！';
    } else if (percentage >= 50) {
        elements.resultIcon.textContent = '📚';
        elements.resultTitle.textContent = '还需努力哦！';
        elements.resultMessage.textContent = '你对端午文化有一定了解，多学习一些传统文化知识会更棒！';
    } else {
        elements.resultIcon.textContent = '💪';
        elements.resultTitle.textContent = '加油学习！';
        elements.resultMessage.textContent = '端午文化博大精深，让我们一起学习传统文化的魅力吧！';
    }
    
    elements.finalScore.textContent = `${gameData.score} / ${gameData.totalQuestions * 100}`;
    
    // 随机显示一个知识点
    const randomKnowledge = gameData.questions[Math.floor(Math.random() * gameData.questions.length)].knowledge;
    elements.knowledgeText.textContent = randomKnowledge;
}

// 分享结果
function shareResult() {
    const percentage = (gameData.score / (gameData.totalQuestions * 100)) * 100;
    const shareText = `我在"端午知识闯关"中获得了${gameData.score}分（${percentage.toFixed(0)}%）！快来测试你的端午文化知识吧！🐉🥟`;
    
    if (navigator.share) {
        navigator.share({
            title: '端午知识闯关',
            text: shareText,
            url: window.location.href
        });
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareText).then(() => {
            alert('分享内容已复制到剪贴板！');
        }).catch(() => {
            alert('分享功能暂不可用，请手动分享您的成绩！');
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initGame);

// 添加一些有趣的交互效果
document.addEventListener('click', (e) => {
    // 点击效果
    if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
        createClickEffect(e.clientX, e.clientY);
    }
});

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.width = '20px';
    effect.style.height = '20px';
    effect.style.background = 'radial-gradient(circle, #ff6b6b, transparent)';
    effect.style.borderRadius = '50%';
    effect.style.pointerEvents = 'none';
    effect.style.animation = 'clickEffect 0.6s ease-out forwards';
    effect.style.zIndex = '9999';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        document.body.removeChild(effect);
    }, 600);
}

// 添加点击效果的CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes clickEffect {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);