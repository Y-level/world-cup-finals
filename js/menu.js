(function () {
    const items = [
        { href: 'index.html',       text: 'Главная' },
        { href: 'history.html',     text: 'История финалов' },
        { href: 'finals.html',      text: 'Обзоры финалов' },
        { href: 'tasks/task1.html', text: 'Задание 1' },
        { href: 'tasks/task2.html', text: 'Задание 2' },
        { href: 'tasks/task3.html', text: 'Задание 3' },
        { href: 'coursework.html',  text: 'Курсовая работа' }
    ];

    const nav = document.getElementById('menu');
    if (!nav) return;

    const page = location.pathname.split('/').pop() || 'index.html';
    const taskPages = ['task1.html', 'task2.html', 'task3.html'];
    const base = taskPages.includes(page) ? '../' : '';

    const title = document.createElement('p');
    title.className = 'menu-title';
    title.textContent = 'Меню';

    const ul = document.createElement('ul');

    items.forEach(item => {
        const li = document.createElement('li');
        const a  = document.createElement('a');

        a.href        = base + item.href;
        a.textContent = item.text;

        const fileName = item.href.split('/').pop();
        if (fileName === page) {
            a.classList.add('active');
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.innerHTML = '';
    nav.appendChild(title);
    nav.appendChild(ul);

    const toggle = document.querySelector('.menu-toggle');
    if (!toggle) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    document.body.appendChild(backdrop);

    function openMenu() {
        nav.classList.add('open');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
    }

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('open')) closeMenu();
        else openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeMenu();
        }
    });

    nav.addEventListener('click', e => {
        if (e.target.closest('a')) closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 900 && nav.classList.contains('open')) {
            closeMenu();
        }
    });
})();