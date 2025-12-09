const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const API_URL = "https://69383e584618a71d77cf8252.mockapi.io/todo/api/task";


async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    listContainer.innerHTML = "";
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}


function addTaskToDOM(task) {
    let li = document.createElement("li");
    li.textContent = task.name;
    li.dataset.id = task.id;

    if(task.state) li.classList.add("checked");

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);
}


async function addTask() {
    if(inputBox.value === '') {
        alert("You must write something!");
        return;
    }

    const newTask = {
        name: inputBox.value,
        state: false
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
    });

    const createdTask = await response.json();
    addTaskToDOM(createdTask);
    inputBox.value = "";
}

// Manejo de clics (marcar completada o borrar)
listContainer.addEventListener("click", async function(e) {
    const li = e.target.tagName === "LI" ? e.target : e.target.parentElement;
    const id = li.dataset.id;

    if(e.target.tagName === "LI") {
        li.classList.toggle("checked");
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: li.classList.contains("checked") })
        });
    } else if(e.target.tagName === "SPAN") {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        li.remove();
    }
});

fetchTasks();
