// Các biến quản lý trạng thái trò chơi
let score = 0;
let timeLeft = 30;
let gameInterval = null;
let moveInterval = null;
let isPlaying = false;

// Mã sinh viên (Bạn hãy thay đổi chuỗi này thành MSV thực tế của bạn)
const STUDENT_ID = "241A010101"; 

// Lấy các element từ DOM
const arena = document.getElementById('arena');
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const overlayMsg = document.getElementById('overlay-msg');
const resultModal = document.getElementById('result-modal');
const finalScoreDisplay = document.getElementById('final-score');
const customTimeInput = document.getElementById('custom-time');

const TARGET_SIZE = 40;

// 1. Chức năng đổi màu nền ngẫu nhiên cho #arena
function changeArenaColor() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    arena.style.backgroundColor = randomColor;
}

// 2. Chức năng hiển thị Mã số sinh viên
function showPlayerInfo() {
    alert(`Thông tin người chơi:\nMã sinh viên: ${STUDENT_ID}`);
}

// 3. Hàm bắt đầu trò chơi (sử dụng thời gian tùy chọn)
function startGame() {
    if (isPlaying) return;

    // Lấy thời gian tùy chọn từ input
    let userTime = parseInt(customTimeInput.value);
    if (isNaN(userTime) || userTime <= 0) {
        alert("Vui lòng nhập số giây hợp lệ (lớn hơn 0)!");
        return;
    }

    score = 0;
    timeLeft = userTime;
    isPlaying = true;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft + 's';
    startBtn.disabled = true;
    customTimeInput.disabled = true; // Khóa input thời gian khi đang chơi
    overlayMsg.style.display = 'none';

    target.style.display = 'block';
    moveTarget();

    target.onclick = handleTargetClick;

    // Đếm ngược thời gian
    gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft + 's';

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // Tự động đổi vị trí mục tiêu mỗi 1 giây
    moveInterval = setInterval(() => {
        if (isPlaying) {
            moveTarget();
        }
    }, 1000);
}

// Hàm đổi vị trí ngẫu nhiên
function moveTarget() {
    const arenaWidth = arena.clientWidth;   // 600px
    const arenaHeight = arena.clientHeight; // 400px

    const maxLeft = arenaWidth - TARGET_SIZE;
    const maxTop = arenaHeight - TARGET_SIZE;

    const randomLeft = Math.floor(Math.random() * maxLeft);
    const randomTop = Math.floor(Math.random() * maxTop);

    target.style.left = randomLeft + 'px';
    target.style.top = randomTop + 'px';
}

// Xử lý khi click trúng mục tiêu
function handleTargetClick(e) {
    e.stopPropagation();
    if (!isPlaying) return;

    score++;
    scoreDisplay.textContent = score;

    moveTarget();

    clearInterval(moveInterval);
    moveInterval = setInterval(() => {
        if (isPlaying) moveTarget();
    }, 1000);
}

// Hàm kết thúc trò chơi & khóa thao tác
function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(moveInterval);

    // Khóa toàn bộ thao tác
    target.style.display = 'none';
    target.onclick = null;
    startBtn.disabled = false;
    customTimeInput.disabled = false;

    // Hiển thị tổng số điểm đạt được
    finalScoreDisplay.textContent = score;
    resultModal.style.display = 'flex';
}

// Hàm đóng modal kết quả
function closeModalAndReset() {
    resultModal.style.display = 'none';
    overlayMsg.style.display = 'block';
    overlayMsg.textContent = 'Nhấn "Bắt đầu trò chơi" để chơi tiếp!';
}