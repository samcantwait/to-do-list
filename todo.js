const form = document.querySelector('form');
const myTodo = document.querySelector('.my-todo');
const todoList = document.querySelector('ol');

form.addEventListener('submit', e => {
    e.preventDefault();
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.insertAdjacentHTML('beforeend', `${myTodo.value}<div class="container"><span class="complete">Complete</span><span
    class="delete">Delete</span></div>`);
    todoList.appendChild(li);
    const deleteItem = li.querySelector('.delete');
    todoDelete(deleteItem);
    const completeItem = li.querySelector('.complete');
    complete(completeItem);
    myTodo.value = '';
})

function todoDelete(deleteItem) {
    deleteItem.addEventListener('click', e => {
        const listItem = deleteItem.closest('li');
           
        const drop = {
            transform: ['rotate(95deg)', 'rotate(85deg)', 'rotate(92deg)', 'rotate(90deg)', 'translateY(100vh) rotate(90deg)'],
            offset: [0.15, 0.4, 0.6, 0.65, 1], 
        }

        listItem.animate(drop, 1000)

        setTimeout(() => {
            listItem.remove();
        }, 1000)
    })
}

function complete(completeItem) {
    completeItem.addEventListener('click', e => {
        const listItem = completeItem.closest('li');
        listItem.classList.add('strike')
    })
}