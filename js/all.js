// 變數宣告
const task_container = document.querySelectorAll('.task_container')[0];
const removeAllTasksButton = document.querySelectorAll('.btn_empty')[0];
const taskAddBlock = document.querySelectorAll('.task_add_block')[0];
const taskInput = document.querySelectorAll('.task_name')[0];
const taskAddButton = document.querySelectorAll('.task_add')[0];
const tasklList = document.querySelectorAll('.task_list')[0];
let storageDataArr = JSON.parse(localStorage.getItem('storageList')) || [];

// 監聽事件
task_container.addEventListener('click', removeSingleTask);
task_container.addEventListener('click', removeAllTasks);
task_container.addEventListener('click', updateTask);
task_container.addEventListener('click', moveTask);
task_container.addEventListener('click', setTaskLevel);
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

// 初始化渲染
updateTaskList();

// 函式：新增事項
function addTask() {
    let inputText = taskInput.value.trim();
    let storageObj = {
        taskId: new Date(),
        taskSubject: inputText,
        taskLevel: 0
    }

    if (!!inputText) {
        storageDataArr.push(storageObj);
        localStorage.setItem('storageList', JSON.stringify(storageDataArr));
        updateTaskList();
    } else {
        alert('請輸入待辦事項！');
    }

    document.querySelectorAll('.task_name')[0].value = '';
}

// 函式：更新清單
function updateTaskList() {
    let str = '';

    for (let i = 0; i < storageDataArr.length; i++) {
        str += `
        <li data-id="${storageDataArr[i].taskId}">
            <div class="item_flex">
                <div class="left_block">
                <div class="btn_flex">
                    <button type="button" class="btn_up">往上</button>
                    <button type="button" class="btn_down">往下</button>
                </div>
                </div>
                <div class="middle_block">
                <div class="star_block">`

        let taskLevel = storageDataArr[i].taskLevel;
        for (let j = 0; j < 5; j++) {
            if ((taskLevel - 0) > 0) {
                str += `<span class="star -on" data-star="${j + 1}"><i class="fas fa-star"></i></span>`;
                taskLevel--;
            } else {
                str += `<span class="star" data-star="${j + 1}"><i class="fas fa-star"></i></span>`;
            }
        }

        str += `
            </div>
                <p class="para">${storageDataArr[i].taskSubject}</p>
                <input type="text" class="task_name_update -none" placeholder="更新待辦事項…" value="${storageDataArr[i].taskSubject}">
                </div>
                <div class="right_block">
                <div class="btn_flex">
                    <button type="button" class="btn_update">更新</button>
                    <button type="button" class="btn_delete">移除</button>
                </div>
                </div>
            </div>
        </li>`;
    }

    tasklList.innerHTML = str;
}

// 函式：淨空清單
function removeAllTasks(e) {
    e.preventDefault();
    if (e.target.classList.contains('btn_empty')) {

        if (!!tasklList.innerText) {
            let r = confirm('確定要移除全部待辦事項？');

            if (r) {
                let allTasks = document.querySelectorAll('li');

                for (let i = 0; i < allTasks.length; i++) {
                    allTasks[i].classList.add('fade_out');
                    setTimeout(function () {
                        allTasks[i].remove();
                    }, 800)
                }
            }

            storageDataArr = [];
            localStorage.removeItem('storageList');
        } else {
            alert('沒有資料需要清空！');
        }
    }
}

// 函式：清空特定事項
function removeSingleTask(e) {
    e.preventDefault();
    if (e.target.classList.contains('btn_delete')) {
        let r = confirm('確定要移除這個待辦事項？');

        if (r) {
            let thisTask = e.target.closest('div.item_flex').parentNode;

            thisTask.classList.add('fade_out');
            setTimeout(function () {
                thisTask.remove();
                for (let i = 0; i < storageDataArr.length; i++) {
                    if (storageDataArr[i].taskId == thisTask.dataset.id
                    ) {
                        storageDataArr.splice(i, 1)
                    }
                }
                localStorage.setItem('storageList', JSON.stringify(storageDataArr));
            }, 300)
        }
    }
}

// 函式：更新事項內容
function updateTask(e) {
    e.preventDefault();
    if (e.target.classList.contains('btn_update')) {
        let thisTask = e.target.closest('div.item_flex').parentNode;
        let thisTaskText = thisTask.querySelectorAll('.para')[0];
        let thisUpdateInput = thisTask.querySelectorAll('.task_name_update')[0];
        let thisUpdateInputText = thisUpdateInput.value.trim();

        thisUpdateInput.classList.toggle('-none');

        if (!!thisUpdateInputText) {
            thisTaskText.innerHTML = thisUpdateInputText;

            for (let i = 0; i < storageDataArr.length; i++) {
                if (storageDataArr[i].taskId == thisTask.dataset.id
                ) {
                    storageDataArr[i].taskSubject = thisUpdateInputText;
                    localStorage.setItem('storageList', JSON.stringify(storageDataArr));
                }
            }

        } else {
            alert('請輸入更新內容！');
            thisUpdateInput.classList.remove('-none');
        }
    }
}

// 函式：移動事項
function moveTask(e) {
    e.preventDefault();

    if (e.target.classList.contains('btn_up')) {
        let thisTask = e.target.closest('div.item_flex').parentNode;
        let prevTask = thisTask.previousElementSibling;
        let thisStorageIndex;

        for (let i = 0; i < storageDataArr.length; i++) {
            if (storageDataArr[i].taskId == thisTask.dataset.id) {
                thisStorageIndex = i;
            }
        }

        let prevTaskCopy = storageDataArr[thisStorageIndex - 1];
        let thisTaskCopy = storageDataArr[thisStorageIndex];

        if (tasklList.firstElementChild !== thisTask) {
            prevTask.outerHTML = thisTask.outerHTML;
            thisTask.outerHTML = prevTask.outerHTML;
            storageDataArr[thisStorageIndex - 1] = thisTaskCopy;
            storageDataArr[thisStorageIndex] = prevTaskCopy;
        }
    } else if (e.target.classList.contains('btn_down')) {
        let thisTask = e.target.closest('div.item_flex').parentNode;
        let nextTask = thisTask.nextElementSibling;

        for (let i = 0; i < storageDataArr.length; i++) {
            if (storageDataArr[i].taskId == thisTask.dataset.id) {
                thisStorageIndex = i;
            }
        }

        let thisTaskCopy = storageDataArr[thisStorageIndex];
        let nextTaskCopy = storageDataArr[thisStorageIndex + 1];

        if (tasklList.lastElementChild !== thisTask) {
            nextTask.outerHTML = thisTask.outerHTML;
            thisTask.outerHTML = nextTask.outerHTML;
            storageDataArr[thisStorageIndex] = nextTaskCopy;
            storageDataArr[thisStorageIndex + 1] = thisTaskCopy;
        }
    }

    localStorage.setItem('storageList', JSON.stringify(storageDataArr));
}

// 函式：設定事項等級
function setTaskLevel(e) {
    e.preventDefault();

    if (e.target.nodeName == 'path') {
        let thisTask = e.target.closest('div.item_flex').parentNode;
        let star_block = e.target.closest('div.star_block');
        let stars = star_block.querySelectorAll('.star');
        let selectStar = e.target.closest('span.star');
        let setLevel = selectStar.dataset.star;
        let currentLevel = 0;

        for (let i = 0; i < stars.length; i++) {
            if (stars[i].classList.contains('-on')) {
                currentLevel++;
            }
        }

        if (setLevel > currentLevel) {
            for (let i = 0; i < setLevel; i++) {
                stars[i].classList.add('-on');
            }
        } else {
            for (let i = 0; i < stars.length; i++) {
                stars[i].classList.remove('-on');
            }
            for (let i = 0; i < setLevel; i++) {
                stars[i].classList.add('-on');
            }
        }

        for (let i = 0; i < storageDataArr.length; i++) {
            if (storageDataArr[i].taskId == thisTask.dataset.id
            ) {
                storageDataArr[i].taskLevel = setLevel;
            }
        }

        localStorage.setItem('storageList', JSON.stringify(storageDataArr));
    }
}
