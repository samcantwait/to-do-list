const todoList = document.querySelector('ol');
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
        liEl.insertAdjacentHTML('beforeend', `${myTodo.value}<div class="container"><label class="complete">Complete<input type="checkbox"><span class="checkmark"></span></label><span class="delete">Delete</span></div>`);
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

function todoDelete(deleteItem) {
    deleteItem.addEventListener('click', e => {
        const listItem = deleteItem.closest('li');
           
        const drop = {
            transform: ['rotate(95deg)', 'rotate(85deg)', 'rotate(92deg)', 'rotate(90deg)', 'translateY(100vh) rotate(90deg)'],
            offset: [0.25, 0.5, 0.65, 0.75, 1], 
        }

        listItem.animate(drop, 2000)

        setTimeout(() => {
            listItem.remove();
        }, 1900)
    })
}

function todoComplete(complete) {
    complete.addEventListener('click', e => {
        console.log(e);
        const listItem = complete.closest('li');
        console.log('complete', listItem)
        listItem.classList.toggle('strike');
        console.log('gfhf', listItem)

    })
}