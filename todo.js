const todoList = document.querySelector('ol');
const all = document.querySelector('.select-all');
const completed = document.querySelector('.select-completed');
const notCompleted = document.querySelector('.select-not-completed');
const selectFilter = document.querySelector('.select-filter');
let addTodo, id = 0;

const todoInput = () => {
    const li = document.createElement('li');
    li.classList.add('new-todo');
    const html = `
        <form class="todo-form"><input type="text" class="item-to-add" placeholder="add item" /><button type="submit" class="add">+</button></form>
    `;
    li.insertAdjacentHTML('afterbegin', html);
    todoList.appendChild(li);
    addTodo = document.querySelector('.todo-form');

    addTodo.addEventListener('submit', e => {
        e.preventDefault();
        const liEl = document.createElement('li');
        const myTodo = document.querySelector('.item-to-add');
        if (!myTodo.value) return;
        liEl.classList.add('todo-item');
        liEl.insertAdjacentHTML('beforeend', `${myTodo.value}<div class="container"><button class="complete" aria-label='complete'><span class='tooltip'>Mark as completed</span><span class="checkmark"></span></button><span class="delete"><button aria-label='trash'><img src="trash.svg" alt="trash" class="trash" /><button></span></div>`);
        todoList.appendChild(liEl);
        const deleteItem = liEl.querySelector('.delete');
        todoDelete(deleteItem);
        const complete = liEl.querySelector('.complete');
        todoComplete(complete);
        document.querySelector('.new-todo').remove();
        todoInput();
        id++;
    })
}
todoInput();


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
const animationArray = [[shrink, 800, 900], [disappear, 800, 900], [drop, 3000, 3000], [moveOut, 1000, 1000]];


const animationChooser = () => {
    const randNumber = Math.random();
    return randNumber < .4 ? 
    animationArray[2] : 
    randNumber >=.4 && randNumber < .6 ?
    animationArray[3] :
    randNumber >=.6 && randNumber < .8 ? 
    animationArray[1] : 
    animationArray[0];
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
        const listItem = complete.closest('.todo-item');
        listItem.classList.toggle('strike');
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