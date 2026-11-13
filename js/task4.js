const inputEl = document.getElementById('wordsInput');
const parseBtn = document.getElementById('parseBtn');
const block1 = document.getElementById('block1');
const block2 = document.getElementById('block2');
const outputText = document.getElementById('output-text');

const basePalette = ['#c8e6c9', '#bbdefb', '#ffe0b2', '#f8bbd0', '#d1c4e9', '#b2dfdb', '#fff9c4', '#ffccbc'];
const movePalette = ['#81d4fa', '#a5d6a7', '#ffab91', '#ce93d8', '#fff176', '#f48fb1', '#80cbc4', '#ffb74d', '#e57373', '#64b5f6'];

let items = [];
let baseColor = basePalette[0];
let zIndex = 1;
let idCounter = 0;
let wordColors = {};

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 40%)`;
}

function reset() {
    block1.innerHTML = '';
    block2.innerHTML = '';
    outputText.innerHTML = '';
    items = [];
    zIndex = 1;
    wordColors = {};
}

function parse() {
    reset();
    baseColor = randomFrom(basePalette);

    const parts = inputEl.value
        .split(/[-–—]/)
        .map(s => s.trim())
        .filter(Boolean);

    const lower = [];
    const upper = [];
    const numbers = [];

    parts.forEach(token => {
        if (/^\d+$/.test(token)) {
            numbers.push(token);
        } else {
            const ch = token.charAt(0);
            const isLower = ch === ch.toLocaleLowerCase('ru') && ch !== ch.toLocaleUpperCase('ru');
            if (isLower) {
                lower.push(token);
            } else {
                upper.push(token);
            }
        }
    });

    lower.sort((a, b) => a.localeCompare(b, 'ru'));
    upper.sort((a, b) => a.localeCompare(b, 'ru'));
    numbers.sort((a, b) => Number(a) - Number(b));

    const ordered = [];

    lower.forEach((value, index) => ordered.push({ key: 'a' + (index + 1), value }));
    upper.forEach((value, index) => ordered.push({ key: 'b' + (index + 1), value }));
    numbers.forEach((value, index) => ordered.push({ key: 'n' + (index + 1), value }));

    ordered.forEach(data => {
        const item = {
            id: ++idCounter,
            key: data.key,
            value: data.value,
            baseColor,
            currentColor: null,
            inBlock1: false,
            x: 0,
            y: 0,
            el: null
        };

        const el = document.createElement('div');
        el.className = 'task4-pill';
        el.innerHTML = '<span class="task4-pill__key"></span><span class="task4-pill__value"></span>';
        el.querySelector('.task4-pill__key').textContent = item.key;
        el.querySelector('.task4-pill__value').textContent = item.value;
        el.style.background = item.baseColor;
        el._item = item;
        item.el = el;
        el.addEventListener('pointerdown', startDrag);
        items.push(item);
        block2.appendChild(el);
    });
}

function startDrag(e) {
    if (e.button !== 0) return;
    e.preventDefault();

    const el = e.currentTarget;
    const item = el._item;
    const pointerId = e.pointerId;
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    let moved = false;

    function move(ev) {
        if (ev.pointerId !== pointerId) return;

        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        if (!moved && Math.hypot(dx, dy) > 4) {
            moved = true;

            if (!item.inBlock1) {
                item.inBlock1 = true;
                item.currentColor = randomFrom(movePalette);
                el.style.background = item.currentColor;
                el.style.outline = 'none';
                el.style.position = 'absolute';
                el.style.zIndex = String(++zIndex);
                block1.appendChild(el);
            }
        }

        if (!moved || !item.inBlock1) return;

        const b1Rect = block1.getBoundingClientRect();
        let left = ev.clientX - b1Rect.left - offsetX;
        let top = ev.clientY - b1Rect.top - offsetY;
        left = Math.max(0, Math.min(left, block1.clientWidth - el.offsetWidth));
        top = Math.max(0, Math.min(top, block1.clientHeight - el.offsetHeight));
        el.style.left = left + 'px';
        el.style.top = top + 'px';
        item.x = left;
        item.y = top;
    }

    function up(ev) {
        if (ev.pointerId !== pointerId) return;

        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        document.removeEventListener('pointercancel', up);

        if (!moved) {
            if (item.inBlock1) {
                if (!wordColors[item.value]) {
                    wordColors[item.value] = getRandomColor();
                }

                if (outputText.childNodes.length > 0) {
                    outputText.appendChild(document.createTextNode(' '));
                }

                const wordSpan = document.createElement('span');
                wordSpan.textContent = item.value;
                wordSpan.style.color = wordColors[item.value];
                outputText.appendChild(wordSpan);
            }
            return;
        }

        if (item.inBlock1) {
            const b2Rect = block2.getBoundingClientRect();
            const overBlock2 =
                ev.clientX >= b2Rect.left &&
                ev.clientX <= b2Rect.right &&
                ev.clientY >= b2Rect.top &&
                ev.clientY <= b2Rect.bottom;

            if (overBlock2) {
                returnToBlock2(item);
            }
        }
    }

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
}

function returnToBlock2(item) {
    const el = item.el;
    item.inBlock1 = false;
    el.style.position = '';
    el.style.left = '';
    el.style.top = '';
    el.style.zIndex = '';
    el.style.background = item.baseColor;
    el.style.outline = item.currentColor ? '2px solid ' + item.currentColor : '';

    let inserted = false;

    for (const other of items) {
        if (other === item) {
            inserted = true;
            continue;
        }

        if (inserted && !other.inBlock1 && other.el.parentNode === block2) {
            block2.insertBefore(el, other.el);
            return;
        }
    }

    block2.appendChild(el);
}

parseBtn.addEventListener('click', parse);

inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        parse();
    }
});