// 1. 获取页面元素
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const scoreElement = document.getElementById('score');
const countdownElement = document.getElementById('countdown');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const messageElement = document.getElementById('message');

// 2. 定义全局变量
let currentLevel = 'easy'; // 当前难度（默认简单）
let score = 0; // 得分
let countdownTime = 20; // 倒计时初始时间（秒）
let timerId = null; // 定时器ID
let currentA, currentB, currentOp, correctAnswer; // 当前题目信息

// 3. 难度配置（数字范围）
const levelConfig = {
    easy: { min: 1, max: 10, multiplyMax: 10 }, // 简单：1-10（乘法1-10）
    medium: { min: 1, max: 20, multiplyMax: 15 }, // 中等：1-20（乘法1-15）
    hard: { min: 1, max: 100, multiplyMax: 20 } // 困难：1-100（乘法1-20）
};

// 4. 初始化：加载第一题+绑定事件
window.addEventListener('load', () => {
    generateQuestion();
    bindEvents();
});

// 5. 绑定交互事件
function bindEvents() {
    // 难度按钮点击事件
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 切换激活状态
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // 更新当前难度
            currentLevel = btn.dataset.level;
            // 生成新题目（符合当前难度）
            generateQuestion();
        });
    });

    // 提交按钮点击事件
    submitBtn.addEventListener('click', handleSubmit);

    // 回车键提交事件
    answerInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleSubmit();
    });
}

// 6. 生成随机题目（根据当前难度）
function generateQuestion() {
    const config = levelConfig[currentLevel];
    const ops = ['+', '-', '*', '/'];
    currentOp = ops[Math.floor(Math.random() * ops.length)];

    // 根据运算符生成合理数字
    switch (currentOp) {
        case '+':
            currentA = getRandomNum(config.min, config.max);
            currentB = getRandomNum(config.min, config.max);
            correctAnswer = currentA + currentB;
            break;
        case '-':
            currentA = getRandomNum(config.min, config.max);
            currentB = getRandomNum(config.min, currentA); // 减数≤被减数
            correctAnswer = currentA - currentB;
            break;
        case '*':
            currentA = getRandomNum(config.min, config.multiplyMax);
            currentB = getRandomNum(config.min, config.multiplyMax);
            correctAnswer = currentA * currentB;
            break;
        case '/':
            currentB = getRandomNum(config.min, config.max);
            currentA = currentB * getRandomNum(config.min, config.max); // 被除数是除数的倍数
            correctAnswer = currentA / currentB;
            break;
    }

    // 显示题目
    questionElement.textContent = `${currentA} ${currentOp} ${currentB} = ?`;

    // 重置状态
    answerInput.value = '';
    messageElement.textContent = '';
    messageElement.className = 'message';

    // 启动倒计时
    resetCountdown();
}

// 7. 倒计时逻辑
function resetCountdown() {
    // 清除之前的定时器
    clearInterval(timerId);
    // 重置时间
    countdownTime = 20;
    countdownElement.textContent = countdownTime;
    // 启动新定时器
    timerId = setInterval(() => {
        countdownTime--;
        countdownElement.textContent = countdownTime;
        // 超时处理
        if (countdownTime <= 0) {
            clearInterval(timerId);
            showMessage('超时啦！哈哈哈哈', 'wrong');
            // 1秒后生成下一题
            setTimeout(generateQuestion, 1000);
        }
    }, 1000);
}

// 8. 处理提交事件
function handleSubmit() {
    // 停止倒计时（用户提交后不再计时）
    clearInterval(timerId);

    // 获取用户输入（转换为整数）
    const userAnswer = parseInt(answerInput.value);

    // 验证输入有效性
    if (isNaN(userAnswer)) {
        showMessage('请输入有效的数字！', 'wrong');
        // 重新启动倒计时（继续剩余时间）
        startCountdown();
        return;
    }

    // 比较答案
    if (userAnswer === correctAnswer) {
        // 答对：得分+1
        score++;
        scoreElement.textContent = score;
        showMessage('正确！', 'correct');
        // 1秒后生成下一题（重置倒计时）
        setTimeout(generateQuestion, 1000);
    } else {
        // 答错：显示提示，清空输入框
        showMessage('哈哈哈哈！', 'wrong');
        answerInput.value = '';
        // 重新启动倒计时（继续剩余时间）
        startCountdown();
    }
}

// 9. 重新启动倒计时（用于答错/输入无效的情况）
function startCountdown() {
    timerId = setInterval(() => {
        countdownTime--;
        countdownElement.textContent = countdownTime;
        if (countdownTime <= 0) {
            clearInterval(timerId);
            showMessage('超时啦！哈哈哈哈', 'wrong');
            setTimeout(generateQuestion, 1000);
        }
    }, 1000);
}

// 10. 显示提示信息（封装样式）
function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
}

// 11. 生成指定范围的随机整数（辅助函数）
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}