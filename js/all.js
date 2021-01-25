// 變數宣告
const taskAddBlock = document.querySelectorAll('.task_add_block')[0];
const taskInput = document.querySelectorAll('.task_name')[0];
const taskAddButton = document.querySelectorAll('.task_add')[0];
const tasklList = document.querySelectorAll('.task_list')[0];

// 監聽事件
taskInput.addEventListener('focus', function () {
    taskAddBlock.classList.add('-on');
});
taskInput.addEventListener('blur', function () {
    taskAddBlock.classList.remove('-on');
});
taskInput.addEventListener('keyup', function (e) {
    if (e.keyCode == 13) { addTask(); }
});
taskAddButton.addEventListener('click', addTask);


function addTask() {
    let inputText = taskInput.value.trim();
    let taskItem = document.createElement('li');

    taskItem.innerHTML = `
        <div class="item_flex">
            <div class="left_block">
            <div class="btn_flex">
                <button type="button" class="btn_up">往上</button>
                <button type="button" class="btn_down">往下</button>
            </div>
            </div>
            <div class="middle_block">
            <div class="star_block">
                <span class="star" data-star="1"><i class="fas fa-star"></i></span>
                <span class="star" data-star="2"><i class="fas fa-star"></i></span>
                <span class="star" data-star="3"><i class="fas fa-star"></i></span>
                <span class="star" data-star="4"><i class="fas fa-star"></i></span>
                <span class="star" data-star="5"><i class="fas fa-star"></i></span>
            </div>
            <p class="para">${inputText}</p>
            </div>
            <div class="right_block">
            <div class="btn_flex">
                <button type="button" class="btn_update">更新</button>
                <button type="button" class="btn_delete">移除</button>
            </div>
            </div>
        </div>`;

    if (!!inputText !== false) {
        tasklList.insertBefore(taskItem, tasklList.childNodes[0]);
    }

    document.querySelectorAll('.task_name')[0].value = '';
};