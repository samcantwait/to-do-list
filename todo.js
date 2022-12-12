const todoList = document.querySelector('ol');
const all = document.querySelector('.select-all');
const completed = document.querySelector('.select-completed');
const notCompleted = document.querySelector('.select-not-completed');
const selectFilter = document.querySelector('.select-filter');

const prevList = localStorage.getItem('list');
JSON.parse(prevList).forEach(todo => {
    createList(todo);
})

const createForm = () => {  
    const li = document.createElement('li');
    li.classList.add('new-todo');
    const html = `
        <form class="todo-form"><input type="text" class="item-to-add" placeholder="add item" /><button type="submit" class="add">+</button></form>
    `;
    li.insertAdjacentHTML('afterbegin', html);
    todoList.appendChild(li);
    const addTodo = document.querySelector('.todo-form');

    addTodo.addEventListener('submit', e => {
        e.preventDefault();
        const myTodo = document.querySelector('.item-to-add');
        if (!myTodo.value) return;
        createList(myTodo.value);
        document.querySelector('.new-todo').remove();
        createForm();

    })
};
createForm();

function createList(value) {
    const li = document.createElement('li');
        
        li.classList.add('todo-item', 'draggable');
        li.insertAdjacentHTML('beforeend', creatHTML(value));
        todoList.appendChild(li);
        const deleteItem = li.querySelector('.delete');
        todoDelete(deleteItem);
        const complete = li.querySelector('.complete');
        todoComplete(complete);

        const editText = li.querySelector('.text');
        editText.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                editText.blur();
            }
        })   
        
        const moveItem = li.querySelector('.move-container');
        moveItem.addEventListener('mousedown', e => {
            console.log('i want to move it move it')
            li.setAttribute('draggable', true)
        })
        moveItem.addEventListener('mouseup', e => {
            li.setAttribute('draggable', false)
        })

        li.addEventListener('dragstart', e => {
            li.classList.add('dragging');
        })
          
        todoList.addEventListener("dragover", (event) => {
            event.preventDefault();
            const afterElement = getDragAfterElement(todoList, event.clientY);
            const draggable = document.querySelector('.dragging');
            const nextTodo = todoList.querySelector('.new-todo');
            if (afterElement.offset === -Infinity) todoList.insertBefore(draggable, nextTodo); 
            else todoList.insertBefore(draggable, afterElement.element);
        });

        todoList.addEventListener('dragend', e => {
            li.classList.remove('dragging');
        })
}

function getDragAfterElement(container, y) {
    const draggables = [...container.querySelectorAll('.draggable:not(.dragging)')];
    return draggables.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height/2;
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }
        else return closest;
    }, { offset: Number.NEGATIVE_INFINITY })
}

function creatHTML(value) {
    return `<span class='text' contenteditable="true" spellcheck="false">${value}</span><div class="container"><button class="complete" aria-label='complete'><span class='tooltip'>Mark as completed</span><span class="checkmark"></span></button><span class="delete"><button aria-label='trash'><img src="trash.svg" alt="trash" class="trash" draggable="false" /></button></span><div class="move-container"><div class="move"></div></div></div>`
}

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

function todoDelete(deleteItem) {
    deleteItem.addEventListener('click', e => {
        const listItem = deleteItem.closest('.todo-item');
        const animation = animationChooser();
        
        listItem.style.transformOrigin = animation[0] === drop ? 'top left' : 'center center';
        console.log(listItem)
        listItem.animate(animation[0], { duration: animation[1], fill: 'forwards' })

        setTimeout(() => {
            listItem.remove();
        }, animation[2])
    })
}

function todoComplete(complete) {
    complete.addEventListener('click', e => {
        console.log(complete);
        complete.classList.toggle('checked')
        const listItem = complete.closest('li');
        const text = listItem.firstChild;
        console.log('text item is: ', text)
        listItem.classList.toggle('strike');
        text.classList.toggle('strike-through')
        console.log('gfhf', listItem)
    })
}

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

    console.log('items present', todoItems)
})

window.addEventListener('unload', e => {
    const allTodos = [...document.querySelectorAll('.todo-item')];
    const todoContent = allTodos.map(todo => todo.innerText);
    const listString = JSON.stringify(todoContent);
    localStorage.setItem('list', listString)
})