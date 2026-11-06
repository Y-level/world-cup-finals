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
            a.setAttribute('aria-current', 'page');
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.innerHTML = '';
    nav.appendChild(title);
    nav.appendChild(ul);
})();