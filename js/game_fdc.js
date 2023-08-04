
let time = 15; //남은시간
let stage = 1; //게임 스테이지
let paletteRow = 2; //팔레트 행
let paletteSize = paletteRow ** 2; //팔레트 전체 갯수(행의 제곱) = paletteRow를 2번 곱해라
let targetIndex = 0;
let targetOpacity = 0.4; // 타겟 아이템 opacity
let color = {}; // 팔레트 아이템 색상(red, green, blue 값을 저장하는 object)

let timer = 0; //타이머

function startGame() {
    createPalette();

    timer = setInterval(() => {
        playTimeNum.innerText = --time;

        if (time <= 0) {
            playTimeNum.innerText = 0;

            //타이머 종료
            clearInterval(timer);

            //게임 결과
            showGameResult();

            //게임 설정 값 초기화
            initGame();
        }
    }, 1000);
}

//팔레트 생성
function createPalette() {
    //랜덤으로 타겟 생성
    targetIndex = createTarget(paletteSize);

    //팔레트 세팅
    settingPalette();
}

//타겟 생성
function createTarget(paletteSize) {
    return Math.floor(Math.random() * paletteSize);
    //Math.floor란 소수값이 존재할 때 소수값을 버리는 역할
}

//팔레트 세팅
const palette = document.getElementsByClassName('palette')[0];
const paletteItem = document.getElementsByClassName('paletteItem');
//querySelector로 클래스 지정시에는 []배열 값을 받지 못하여 for을 사용하여 작업 불가 -> 해당 문제 때문에 수정하는데 오래 걸림

function settingPalette() {
    //html 추가
    for (let i = 0; i < paletteSize; i++){

        if (i === targetIndex) {
            palette.innerHTML = palette.innerHTML +
                `
                    <div class="paletteItem" id="target"></div>
                `;
        } else {
            palette.innerHTML = palette.innerHTML +
                `
                    <div class="paletteItem"></div>

                `;
        }
    }

    //아이템 크기 세팅
    let itemSize = 100 / paletteRow;

    //랜덤 색상 색성
    color = createColor(color);

    //아이템 크키, 색상 적용
    for (let j = 0; j < paletteItem.length; j++){
        //크기 적용
        paletteItem[j].style.width = `${itemSize}%`;
        paletteItem[j].style.height = `${itemSize}%`;

        //색상 적용
        let opacity = 1;

        if (paletteItem[j].id === "target") {
            opacity = targetOpacity;
        }

        paletteItem[j].style.backgroundColor = `rgba(${color.red}, ${color.green}, ${color.blue}, ${opacity})`;

    }
}

//랜던 색상 생성
function createColor() {
    // 너무 어둡거나 너무 밝은 색이 나오지 않도록 범위를 100 ~ 200으로 지정
    color.red = Math.floor(Math.random() * 101) + 100;
    color.green = Math.floor(Math.random() * 101) + 100;
    color.blue = Math.floor(Math.random() * 101) + 100;

    return color;
}

//아이템 클릭 이벤트
palette.addEventListener("click", function (e) {
    if (e.target.className === "paletteItem") {
        if (e.target.id === "target") {
            selectTargetItem();
        } else {
            selectWrongItem();
        }
    }
});

//정답 처리
function selectTargetItem() {
    updateSetting();
    createPalette();
}

//사용자가 정답을 맞춘 경우 설정 값 변경
function updateSetting() {
    //화면 초기화
    palette.innerHTML = '';

    //targetIndex, color는 팔레트 아이템 생성 시 랜덤 값으로 재생성되기 때문에 따로 리셋 하지 않음
    time = 15;
    stage++;

    //stage가 2씩 올라갈 때 마다 팔레트 사이즈 증가
    if (stage % 2 === 1) {
        paletteRow++;
        paletteSize = paletteRow ** 2;
    }

    //opacity 값 0.02씩 증가(0.94 이상으로는 증가하지 않음)
    if (targetOpacity <= 0.92) {
        //2진수로 실수 계산 시 오차가 생기기 때문에 소수점 셋째자리에서 반올림하도록 처리
        targetOpacity = Number((targetOpacity + 0.02).toFixed(2));
        //toFixed(2)란 소수점 셋째자리에서 반올림하여 둘째자리까지만 보여줌
        //toFixed는 문자열로 반환하기 때문에 숫자로 type 변경이 필요하다
    }

    //화면 갱신
    playTimeNum.innerText = time;
    playStageNum.innerText = stage;
}

//오답 처리
function selectWrongItem() {
    //3초를 뺀 값이 0보다 작은 경우에도 0으로 고정
    if (time - 3 < 0) {
        time = 0;
    } else {
        time -= 3;
    }

    //오답 선택 시 애니메이션
    palette.classList.add('vibration');

    setTimeout(function () {
        palette.classList.remove('vibration');
    }, 400);

    //시간 갱신
    playTimeNum.innerText = time;
}

//설정 값 초기화
function initGame() {
    time = 15;
    stage = 1;
    paletteRow = 2;
    paletteSize = paletteRow ** 2;
    targetIndex = 0;
    targetOpacity = 0.4;
    color = {};
}

const modalWrp = document.querySelector('.modalWrp');
const modalTxt = document.querySelector('.modalTxt');
//게임 종료 시 출력 문구
function showGameResult() {
    let resultText = "";

    if (stage > 0 && resultText <= 5) {
        resultText = "다시 한 번 해볼까요?"
    } else if (stage > 5) {
        resultText = "조금 더 해봐요!"
    }

    modalTxt.innerHTML = `
        <h1>게임 종료!</h1>
        <p>기록 : <span>STAGE ${stage}</span>점</p>
        <p>
            ${resultText}
        </p>
    `;

    modalWrp.classList.add('show');
}

const modalBack = document.querySelector('.modalBack');
const modalCloseBtn = document.querySelector('.modalCloseBtn');
//게임 종료 모달창 닫기
modalWrp.addEventListener("click", function (e) {
    if (e.target === modalBack || e.target === modalCloseBtn) {
        modalWrp.classList.remove('show');

        //모달창 닫으면 화면 초기화 후 게임 재시작
        palette.innerHTML = '';
        playTimeNum.innerText = time;
        playStageNum.innerText = stage;
        startGame();
    }
});


const playTimeNum = document.querySelector('.playTimeNum');
const playStageNum = document.querySelector('.playStageNum');

window.onload = function () {
    playTimeNum.innerText = time;
    playStageNum.innerText = stage;

    startGame();
}