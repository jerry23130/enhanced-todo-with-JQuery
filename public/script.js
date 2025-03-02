// Use jQuery's document ready to initialize the page
$(document).ready(function() {
    if (window.location.pathname === "/") {
        loadTasks();
    }
});

// Enhanced loadTasks using jQuery to render checkboxes and task text
function loadTasks() {
    $.getJSON("/tasks", function(tasks) {
        const $taskList = $("#taskList");
        $taskList.empty();
        tasks.forEach(function(task, index) {
            // Create a list item for each task
            const $li = $("<li></li>");
            // Create a checkbox; set it as checked if task.done is true
            const $checkbox = $('<input type="checkbox" class="task-checkbox">').prop("checked", task.done);
            // Create a span element for task text
            const $span = $("<span></span>").text(task.text);
            
            // Apply strikethrough style if the task is marked as done
            if (task.done) {
                $span.css("text-decoration", "line-through");
            }
            
            // Attach an event handler to the checkbox for toggling
            $checkbox.change(function() {
                const isChecked = $(this).is(":checked");
                // Update the text style immediately
                if (isChecked) {
                    $span.css("text-decoration", "line-through");
                } else {
                    $span.css("text-decoration", "none");
                }
                // Send an AJAX request to update the task status on the server
                $.ajax({
                    url: "/toggle-task",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ index: index, done: isChecked }),
                    success: function(response) {
                        if (!response.success) {
                            alert("Error updating task status.");
                        }
                    },
                    error: function() {
                        alert("Server error while updating task.");
                    }
                });
            });
            
            // Append the checkbox and text to the list item, then add it to the list
            $li.append($checkbox).append(" ").append($span);
            $taskList.append($li);
        });
    });
}

// The addTask function remains unchanged (used on add.html)
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();
    
    if (task) {
        fetch("/add-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task })
        })
        .then(response => response.json())
        .then(() => {
            taskInput.value = "";
            window.location.href = "/"; // Redirect back to home page
        });
    }
}
