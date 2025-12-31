const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');
const winnerSpan = document.getElementById('winner');
const locationsInput = document.getElementById('locationsInput');
const updateBtn = document.getElementById('updateBtn');

let options = [];
let startAngle = 0;
let arc = 0;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;
let isSpinning = false;

// 顏色庫
const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
    "#E7E9ED", "#8AC926", "#1982C4", "#6A4C93", "#FF595E", "#FFCA3A"
];

function init() {
    updateOptionsFromInput();
    drawRouletteWheel();
}

function updateOptionsFromInput() {
    const text = locationsInput.value;
    // 分割字串並移除空白
    options = text.split(',').map(item => item.trim()).filter(item => item !== "");
    
    if (options.length === 0) {
        options = ["請輸入地點"];
    }
    
    arc = Math.PI * 2 / options.length;
    drawRouletteWheel();
}

function drawRouletteWheel() {
    if (canvas.getContext) {
        const outsideRadius = 200;
        const textRadius = 160;
        const insideRadius = 50;

        ctx.clearRect(0, 0, 500, 500);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        ctx.font = 'bold 20px Helvetica, Arial';

        for(let i = 0; i < options.length; i++) {
            const angle = startAngle + i * arc;
            
            // 繪製扇形
            ctx.fillStyle = colors[i % colors.length];
            
            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            // 繪製文字
            ctx.save();
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur    = 0;
            ctx.shadowColor   = "rgb(220,220,220)";
            ctx.fillStyle = "white"; // 文字顏色
            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                          250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            const text = options[i];
            // 簡單的文字截斷，避免太長
            const displayText = text.length > 8 ? text.substring(0, 8) + "..." : text;
            ctx.fillText(displayText, -ctx.measureText(displayText).width / 2, 0);
            ctx.restore();
        } 

        // 繪製中心裝飾
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(250, 250, insideRadius, 0, Math.PI * 2, true);
        ctx.fill();
        
        // 繪製指針 (現在用 CSS 繪製了，這裡可以省略或畫一個中心點)
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(250, 250, 10, 0, Math.PI * 2, true);
        ctx.fill();
    }
}

function spin() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    resultDiv.classList.add('hidden');
    
    spinAngleStart = Math.random() * 10 + 10; // 初始速度
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000; // 旋轉時間 4-7秒
    
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if(spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    
    // 緩動函數 (Ease Out)
    const spinAngle = spinAngleStart - (spinAngleStart * (spinTime / spinTimeTotal)); // 速度遞減
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    
    // 計算結果
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    const text = options[index];
    
    // 顯示結果
    winnerSpan.textContent = text;
    resultDiv.classList.remove('hidden');
    
    isSpinning = false;
    spinBtn.disabled = false;
    ctx.restore();
}

// 事件監聽
spinBtn.addEventListener('click', spin);

updateBtn.addEventListener('click', () => {
    updateOptionsFromInput();
});

// 初始化
init();
