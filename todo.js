////// QUERY SELECTORS
const todoList = document.querySelector('ol');
const all = document.querySelector('.select-all');
const completed = document.querySelector('.select-completed');
const notCompleted = document.querySelector('.select-not-completed');
const selectFilter = document.querySelector('.select-filter');
const clear = document.querySelector('.clear');
const prevList = localStorage.getItem('list');


////// LOAD FROM LOCAL STORAGE IF IT EXISTS
if (prevList) {
    JSON.parse(prevList).forEach(todo => {
        createList(todo);
    })
}

////// FUNCTIONS
const createForm = () => {
    const li = document.createElement('li');
    li.classList.add('new-todo');
    const html = `
        <form class="todo-form"><input type="text" class="item-to-add" placeholder="add item" /><button type="submit" class="add">+</button></form>
    `;
    li.insertAdjacentHTML('afterbegin', html);
    todoList.appendChild(li);
};
createForm();

function createList(value) {
    const li = document.createElement('li');
    li.classList.add('todo-item', 'draggable');
    li.insertAdjacentHTML('beforeend', createHTML(value));
    todoList.appendChild(li);

    const editText = li.querySelector('.text');
    editText.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            editText.blur();
        }

        listItem.animate(drop, 2000)

        setTimeout(() => {
            listItem.remove();
        }, 2000)
    })
}

function createHTML(value) {
    return `<span class='text' contenteditable="true" spellcheck="false">${value}</span><div class="container"><button class="complete" aria-label='complete'><span class='tooltip'>Mark as completed</span><span class="checkmark"></span></button><button aria-label='trash' class="trash-btn"><span class='tooltip'>Trash</span><img src="trash.svg" alt="trash" class="delete trash" draggable="false" /></button><div class="move-container"><div class="move"></div></div></div>`
}

function todoComplete(complete) {
    complete.classList.toggle('checked')
    const listItem = complete.closest('li');
    const text = listItem.firstChild;
    listItem.classList.toggle('strike');
    text.classList.toggle('strike-through')
}

function todoDelete(listItem) {
    const animation = animationChooser();
    listItem.style.transformOrigin = animation[0] === drop ? 'top left' : 'center center';
    listItem.animate(animation[0], { duration: animation[1], fill: 'forwards' })
    setTimeout(() => {
        listItem.remove();
    }, animation[2])
}

function getDragAfterElement(container, y) {
    const draggables = [...container.querySelectorAll('.draggable:not(.dragging)')];
    return draggables.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }
        else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}



////// EVENT LISTENERS
todoList.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e)
    const addTodo = document.querySelector('.todo-form');
    const myTodo = document.querySelector('.item-to-add');
    if (!myTodo.value) return;
    createList(myTodo.value);
    document.querySelector('.new-todo').remove();
    createForm();
})

todoList.addEventListener('click', e => {
    const target = e.target;
    const li = e.target.closest('li')
    const targetClass = target.classList[0];
    switch (targetClass) {
        case 'todo-list':
            break;
        case 'checkmark':
        case 'complete':
            todoComplete(target.closest('.complete'));
            break;
        case 'delete':
        case 'trash-btn':
            todoDelete(li);
            break;
        case 'move':
        case 'move-container':
            li.setAttribute('draggable', true);
            break;
        case 'text':
            break;
        default:
            return;
    }
})

todoList.addEventListener("dragover", (event) => {
    event.preventDefault();
    const afterElement = getDragAfterElement(todoList, event.clientY);
    const draggable = document.querySelector('.dragging');
    const nextTodo = todoList.querySelector('.new-todo');
    if (afterElement === undefined) todoList.insertBefore(draggable, nextTodo);
    else todoList.insertBefore(draggable, afterElement);
});

todoList.addEventListener('dragstart', e => {
    const li = e.target;
    li.classList.add('dragging');
});

todoList.addEventListener('dragend', e => {
    const li = e.target;
    li.classList.remove('dragging');
    li.setAttribute('draggable', false);
});

selectFilter.addEventListener('change', (e) => {
    console.log(e.target.value)
    const selectedFilter = e.target.value;
    const todoItems = document.querySelectorAll('.todo-item')
    if (todoItems.length < 1) return;
    if (selectedFilter === 'completed') {
        todoItems.forEach(item => !item.classList.contains('strike') ? item.classList.add('hide') : item.classList.remove('hide'))
    }
    if (selectedFilter === 'not completed') {
        todoItems.forEach(item => item.classList.contains('strike') ? item.classList.add('hide') : item.classList.remove('hide'))
    }
    if (selectedFilter === 'all') todoItems.forEach(item => item.classList.remove('hide'))
})

window.addEventListener('unload', e => {
    const allTodos = [...document.querySelectorAll('.todo-item')];
    const todoContent = allTodos.map(todo => todo.innerText);
    const listString = JSON.stringify(todoContent);
    localStorage.setItem('list', listString)
})

clear.addEventListener('click', e => {
    const allTodos = document.querySelectorAll('.todo-item');
    allTodos.forEach(todo => todo.remove())
})


////// ANIMATIONS
const drop = {
    transform: ['rotate(95deg)', 'rotate(85deg)', 'rotate(92deg)', 'rotate(90deg)', 'translateY(100vh) rotate(90deg)'],
    offset: [0.25, 0.5, 0.65, 0.75, 1],
};

const shrink = {
    transform: 'scale(0)',
};

const disappear = {
    transform: 'scale(50)',
    opacity: 0
};

const moveOut = {
    transform: 'translateX(100vw)'
}
const animationArray = [[shrink, 800, 900], [disappear, 800, 900], [drop, 2200, 2200], [moveOut, 1000, 1000]];


const animationChooser = () => {
    const randNumber = Math.random();
    return animationArray[2];

    // ADD ANIMATIONS
    // randNumber < .4 ? 
    // animationArray[2] : 
    // randNumber >=.4 && randNumber < .6 ?
    // animationArray[3] :
    // randNumber >=.6 && randNumber < .8 ? 
    // animationArray[1] : 
    // animationArray[0];
}