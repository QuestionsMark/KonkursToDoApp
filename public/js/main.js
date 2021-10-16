const HOST_ADDRESS = 'http://localhost:3000';

const listToDo = document.querySelector('.list__toDo');
const listDone = document.querySelector('.list__done');
const arrows = [...document.querySelectorAll('.arrow')];
const addNewTask = document.querySelector('.list__addNewTask');

const popup = document.querySelector('.popup');
const form = document.querySelector('.form');
const goBack = document.querySelector('.button__back');
const inpTask = document.querySelector('.form__inpTask');
const textResponse = document.querySelector('.form__response');

const init = () => {
    listToDo.innerHTML = '';
    listDone.innerHTML = '';
    fetch(`${HOST_ADDRESS}/tasks`)
        .then(res => res.json())
        .then(({ toDoList, doneList }) => {
            toDoList.forEach((t, i) => {
                appendItem('todo', t.task, i);
            });
            doneList.forEach((t, i) => {
                appendItem('done', t.task, i);
            });
        });
};

const handleArrowClick = ({ target }) => {
    if (target.classList.contains('fa-angle-up')) {
        target.classList.toggle('active');
        target.nextElementSibling.classList.toggle('active');
    } else {
        target.classList.toggle('active');
        target.previousElementSibling.classList.toggle('active');
    }
    target.parentElement.parentElement.classList.toggle('list__grow')
}

const handleDoneTask = async (e) => {
    const index = e.target.getAttribute('data-index');
    try {
        const response = await fetch(`${HOST_ADDRESS}/tasks/finish/${index}`, {
            method: 'PUT',
        });
        if (response.ok) {
            init();
        }
    } catch (e) {
        console.log(e);
    }
};

const handleRemoveTask = async (e) => {
    const index = e.target.getAttribute('data-index');
    try {
        const response = await fetch(`${HOST_ADDRESS}/tasks/remove/${index}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            init();
        }
    } catch (e) {
        console.log(e.message);
    }
};

const handleRemoveFinishedTask = async (e) => {
    const index = e.target.getAttribute('data-index');
    try {
        const response = await fetch(`${HOST_ADDRESS}/tasks/remove-finished/${index}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            init();
        }
    } catch (e) {
        console.log(e.message);
    }
};

const appendItem = (type, task, index) => {
    if (type === 'todo') {
        const item = document.createElement('li');
        item.classList.add('item');
        const text = document.createElement('p');
        text.classList.add('item__text');
        text.innerText = task;
        const options = document.createElement('div');
        options.classList.add('item__options');

        const divDone = document.createElement('div');
        divDone.classList.add('item__button');
        divDone.setAttribute('data-index', index);
        const btnDone = document.createElement('button');
        btnDone.classList.add('item__btnBackground');
        btnDone.setAttribute('data-index', index);
        btnDone.innerText = 'Zrobione';
        divDone.append(btnDone);
        divDone.addEventListener('click', handleDoneTask);

        const divRemove = document.createElement('div');
        divRemove.classList.add('item__button');
        divRemove.setAttribute('data-index', index);
        const btnRemove = document.createElement('button');
        btnRemove.classList.add('item__btnBackground');
        btnRemove.setAttribute('data-index', index)
        btnRemove.innerText = 'Usuń';
        divRemove.append(btnRemove);
        divRemove.addEventListener('click', handleRemoveTask);

        options.append(divDone, divRemove);

        item.append(text, options);

        listToDo.append(item);
    } else {
        const item = document.createElement('li');
        item.classList.add('item');
        const text = document.createElement('p');
        text.classList.add('item__text');
        text.innerText = task;

        const divRemove = document.createElement('div');
        divRemove.classList.add('item__button');
        divRemove.setAttribute('data-index', index);
        const btnRemove = document.createElement('button');
        btnRemove.classList.add('item__btnBackground');
        btnRemove.setAttribute('data-index', index)
        btnRemove.innerText = 'Usuń';
        divRemove.append(btnRemove);
        divRemove.addEventListener('click', handleRemoveFinishedTask);

        item.append(text, divRemove);

        listDone.append(item);
    }
}

const handleAddNewTask = async (task) => {
    textResponse.innerText = 'Oczekiwanie na odpowiedź serwera...';
    textResponse.style.color = '#e0e0e0';
    const response = await fetch(`${HOST_ADDRESS}/tasks/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            task
        })
    });
    const { message } = await response.json();
    if (response.ok) {
        inpTask.value = '';
        textResponse.innerText = message;
        textResponse.style.color = 'green';
        init();
    } else {
        textResponse.innerText = message;
        textResponse.style.color = 'red';
    }
}

arrows.forEach(a => {
    a.addEventListener('click', handleArrowClick);
});

addNewTask.addEventListener('click', () => {
    popup.classList.toggle('none');
    inpTask.focus();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (inpTask.value) {
        handleAddNewTask(inpTask.value);
    }
});

goBack.addEventListener('click', () => {
    inpTask.value = '';
    textResponse.innerText = '';
    popup.classList.toggle('none');
});

init();