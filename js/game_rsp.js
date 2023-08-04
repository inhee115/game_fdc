
//게임 기본 스피트 0.3초로 설정
let speed = 300;

//게임 회차 및 승패 정보 저장
let count = 0;
let winCount = 0;
let loseCount = 0;
let drawCount = 0;
let pcScore = 0;
let userScore = 0;

let playerLife = 3;

let timer = 0;
let lastPcSelect = "";
let pcSelect = "";

function changePcSelect() {
    const pcImage = document.querySelector('.pcImage');

    //난수를 PC선택값으로 설정
    //이전 값과 동일하지 않은 경우에만 PC가 선택하도록 구현
    while (true) {
        pcSelect = getRandom();

        if (pcSelect !== lastPcSelect) {
            lastPcSelect = pcSelect; //다음 순서에 비교값으로 사용하기 위하여 저장
            break;
        }
    }

    //화면 이미지 변경
    switch (pcSelect) {
        case 0:
            pcImage.src = "./images/rsp/scissor.svg";
            pcImage.alt = "가위";
            break;
        case 1:
            pcImage.src = "./images/rsp/rock.svg";
            pcImage.alt = "바위";
            break;
        case 2:
            pcImage.src = "./images/rsp/paper.svg";
            pcImage.alt = "보";
            break;

        default:
    }
}

//난수 생성 함수
function getRandom() {
    return parseInt(Math.random() * 3) //(max - min) + min : max는 3, min은 0
    //parseInt이란 문자열을 숫자로 변환
}

//사용자가 가위바위보 버튼 클릭 시 결과 출력 및 점수 추가
const btnWrp = document.querySelector('.btnWrp');
const rockBtn = document.querySelector('.rockBtn');
const scissorBtn = document.querySelector('.scissorBtn');
const paperBtn = document.querySelector('.paperBtn');

btnWrp.addEventListener("click", function (e) {
    let userSelect = "";

    //사용자가 선택한 버튼에 따라 사용자 선택 값 설정
    if (e.target === rockBtn) {
        userSelect = 0;
    } else if (e.target === scissorBtn) {
        userSelect = 1;
    } else if (e.target === paperBtn) {
        userSelect = 2;
    } else {
        return;
    }

    rockScissorPaper(userSelect);
});

//가위바위보 메인 계산 함수
function rockScissorPaper(userSelect) {
    //게임 카운트 +1
    count++;

    //Interval 정지
    clearInterval(timer);

    //대진 결과 판탄(사용자 패:0, 무:1, 서용자 승:2)
    let result = checkMatchResult(userSelect, pcSelect);
    console.log(result);

    //대진 결과 화면에 출력
    showMatchResult(result, userSelect, pcSelect);

    //기회 없으면 게임 종료
    if (playerLife === 0) {
        initGame();
    }

    //모달 종료 시 게임 재시작
    restartGameAfterExitModal();

}

//대진 결과를 판단하는 함수(가위:0, 바위:1, 보:2)
function checkMatchResult(user, pc) {
    let result = user - pc;

    if (result === 0) { //무승부인 경우
        drawCount++;
        return 1;
    } else if (result === 1 || result === -2) { //사용자가 승리한 경우
        winCount++;
        return 2;
    } else if (result === -1 || result === 2) { //사용자가 패배한 경우
        loseCount++;
        return 0;
    }
}

//대진 결과를 화면에 출력하는 함수
const modalTxt = document.querySelector('.modalTxt');
const pcScoreItem = document.querySelector('.pcScore');
const userScoreItem = document.querySelector('.userScore');
const playerLifeNum = document.querySelector('.playerLifeNum');
const modalWrp = document.querySelector('.modalWrp');

function showMatchResult(result, user, pc) {
    //화면에 점수 갱신
    if (result !== 1 || result !== null) {
        calculateScore(result);
    }

    //남은 기회 갱신(이기면 +1, 지면 -1)
    if (result === 0) {
        playerLife += -1;
    } else if (result === 2) {
        playerLife += 1;
    }

    playerLifeNum.innerText = playerLife;

    //모달에 대진 결과 대입
    if (playerLife > 0) {
        showRoundResult(result, user, pc);
    } else {
        showGameResult();
    }
}


const colorList = ["colorRed", "colorGreen", "colorBlue"];
//한 라운드 종료 시 출력 문구
function showRoundResult(result, user, pc) {
    const resultList = ["패배", "무승부", "승리"];
    let rspList = ["✌", "✊", "✋"];

    modalTxt.innerHTML = `
        <h1 class="${colorList[result]}">
            ${resultList[result]}
        </h1>
        <p>
            PC : ${rspList[pc]}<br />
            Player : ${rspList[user]}
        </p>
    `;

    modalWrp.classList.add('show');
}

//게임 종료 시 출력 문구
function showGameResult() {
    time = 10;

    modalTxt.innerHTML = `
        <h1>게임 종료!</h1>
        <p>점수 : <span>${userScore}</span>점</p>
        <p>
            총 <strong>${count}번</strong>의 대결 동안<br />
            <span class="${colorList[2]}">${winCount}번</span>의 승리<br />
            <span class="${colorList[0]}">${loseCount}번</span>의 패배<br />
            <span class="${colorList[1]}">${drawCount}번</span>의 무승부가<br />
            있었습니다.
        </p>
    `;
    modalWrp.classList.add('show');
}

//점수 계산 후 화면에 갱신하는 함수
function calculateScore(result) {
    if (result === 2) {
        userScore += 10;
        userScoreItem.innerText = userScore;
    } else if (result === 0) {
        pcScore += 10;
        pcScoreItem.innerText = pcScore;
    }
}

//5초 동안 결과를 출력하는 모달 창이 닫히면 게임을 재시작하는 함수
const timeNum = document.querySelector('.timeNum');

let closeTimer = 0;
let time = 5;

function restartGameAfterExitModal() {
    timeNum.innerText = time;

    closeTimer = setInterval(() => {
        timeNum.innerText = --time;

        if (time === 0) {
            modalWrp.classList.remove('show');
            restartGame();
        }
    }, 1000);
}

//5초가 되기 전에 사용자가 수동으로 모달창을 종료하는 경우
const modalBack = document.querySelector('.modalBack');
const modalCloseBtn = document.querySelector('.modalCloseBtn');

modalWrp.addEventListener("click", function (e) {
    if (e.target === modalBack || e.target === modalCloseBtn) {
        modalWrp.classList.remove('show');
        restartGame();
    }
});

//게임을 재시작하는 함수
function restartGame() {
    //결과 모달 출력 타이머 종료
    clearInterval(closeTimer);

    //결과 모달 time 초기화
    time = 5;

    //검퓨터의 마지막 선택 값 재설정

    //화면 초기화
    playerLifeNum.innerText = playerLife;
    userScoreItem.innerText = userScore;
    pcScoreItem.innerText = pcScore;

    //게임 회차에 따라 스피트 빠르게 조절(20회차 이상부터는 속도 고정)
    if (count <= 20 && count > 0) {
        speed = speed - 10;
    }

    //게임 재시작
    timer = setInterval(changePcSelect, speed);
}

//개임 중단 버튼 클릭
const stopBtn = document.querySelector('.stopBtn');

stopBtn.addEventListener("click", function () {
    //게임 종료 문구
    showGameResult();

    //Interval 정지
    clearInterval(timer);

    //게임 종료(게임 설정 초기화)
    initGame();

    //모달 종료 시 게임 재시작
    restartGameAfterExitModal();
});

//게임에 필요한 설정 값 초기화 함수
function initGame() {
    speed = 300;
    playerLife = 3;
    userScore = 0;
    pcScore = 0;
    count = 0;
    winCount = 0;
    drawCount = 0;
    loseCount = 0;
}

window.onload = function () {
    timer = setInterval(changePcSelect, speed);

    playerLifeNum.innerText = playerLife;
    userScoreItem.innerText = userScore;
    pcScoreItem.innerText = pcScore;
}

//5초 되기 전에 사용자가 수동으로 모달창을 종료하는 경우 미완성
//css 작업 미완성