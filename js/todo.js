window.onload = init;

var AlertType = {"success": 0, "warning": 1, "error": 2};

$(function() {
	$("#datepicker").datepicker();
});

/*
 * Initialize routine when window loads
 */
function init() {
	var tasks = getOpenTasks();
	for(var i=0; i<tasks.length;i++){
		addTaskToOpen(tasks[i]);
	}
	
	var finished = getFinishedTasks();
	for(var i=0; i<finished.length;i++){
		addTaskToFinished(finished[i]);
	}
	updateTaskContainers();
};

/*
 * Update DOM by removing task lists if empty 
 */
function updateTaskContainers(){
	var tasks = getOpenTasks();
	var openTaskContainer = document.getElementById("openTaskContainer");
	if(tasks.length == 0){
		openTaskContainer.setAttribute("style", "display:none;");
	}
	else{
		openTaskContainer.setAttribute("style", "display:block;");
	}
	
	var finished = getFinishedTasks();
	var finishedTaskContainer = document.getElementById("finishedTaskContainer");
	if(finished.length == 0){
		finishedTaskContainer.setAttribute("style", "display:none;");
	}
	else{
		finishedTaskContainer.setAttribute("style", "display:block;");
	}
}

/*
 * Get an array of open task objects
 */
function getOpenTasks() {
	var tasks = JSON.parse(localStorage.getItem("tasks"));
	if (!tasks) {
		tasks = [];
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}
	return tasks;
}

/*
 * Get an array of finished task objects
 */
function getFinishedTasks(){
	var finished = JSON.parse(localStorage.getItem("finished"));
	if(!finished){
		finished = [];
		localStorage.setItem("finished", JSON.stringify(finished));
	}
	return finished;
}

function clearForm(){
	
}

/*
 * Show inline alert message
 * @alertMessage: The message to be shown
 * @type: The type of message (see AlertType values at top)
 */
function showAlert(alertMessage, type){
	var alertBox = document.createElement("div");
	var alertClose = document.createElement("a");
	var alertHeading = document.createElement("h4");
	var alertText = document.createElement("p");
	
	alertBox.innerHTML = "";	
	
	switch(type){
	case AlertType.success:
		alertBox.setAttribute("class", "span11 alert alert-block alert-success fade in");
		break;
	case AlertType.warning:
		alertBox.setAttribute("class", "span11 alert alert-block fade in");
		break;
	case AlertType.error:
		alertBox.setAttribute("class", "span11 alert alert-block alert-error fade in");
		break;
	}
	
	alertClose.setAttribute("class", "close");
	alertClose.setAttribute("data-dismiss", "alert");
	alertClose.setAttribute("href", "#");
	alertClose.innerHTML = "&times;";
	
	alertHeading.setAttribute("class", "alert-heading");
	alertHeading.innerHTML = "Warnung!";
	
	alertText.innerHTML = alertMessage;
	
	alertBox.appendChild(alertClose);
	alertBox.appendChild(alertHeading);
	alertBox.appendChild(alertText);
	
	return alertBox;
}

/*
 * Create task object and add to local storage
 */
function addTask() {

	var time = new Date().getTime();
	
	// create new Task object
	var task = new Object();
	task.prio = document.getElementById("prio").value;
	task.dueDate = document.getElementById("datepicker").value;
	task.description = document.getElementById("description").value;
	task.id = "t_"+time;

	if(task.prio.length == 0 || task.dueDate.length == 0 || task.description.length == 0) {
		document.getElementById("alertrow").innerHTML = "";
		var alertBox = showAlert("Sie m&uuml;ssen alle Felder ausf&uuml;llen!", AlertType.warning);
		document.getElementById("alertrow").appendChild(alertBox);
	}
	else{
		// create key/value-pair to store task in local storage
		localStorage.setItem(task.id, JSON.stringify(task));

		var tasks = getOpenTasks();
		tasks.push(task.id);
		localStorage.setItem("tasks", JSON.stringify(tasks));
		updateTaskContainers();
		addTaskToOpen(task.id);
	}
	clearForm();
};

/*
 * Add open task object to DOM
 * @id: id of the open task object
 */
function addTaskToOpen(id){
	var task = JSON.parse(localStorage.getItem(id));
	
	var table = document.getElementById("taskList");
	var row = document.createElement("tr");
	var checkboxCell = document.createElement("td");
	var prioCell = document.createElement("td");
	var descriptionCell = document.createElement("td");
	var dateCell = document.createElement("td");
	var buttonCell = document.createElement("td");
	var checkBox = document.createElement("input");
	var badge = document.createElement("span");
	
	prioCell.setAttribute("id", id + "_prio");
	dateCell.setAttribute("id", id + "_date");
	descriptionCell.setAttribute("id", id + "_desc");
	buttonCell.setAttribute("id", id + "_butt");

	badge.innerHTML = task.prio;
	switch(parseInt(task.prio)){
	case 1: badge.setAttribute("class", "badge"); break;
	case 2: badge.setAttribute("class", "badge badge-info"); break;
	case 3: badge.setAttribute("class", "badge badge-warning"); break;
	case 4: badge.setAttribute("class", "badge badge-important"); break;
	case 5: badge.setAttribute("class", "badge badge-inverse"); break;
	}

	checkBox.setAttribute("type", "checkbox");
	checkBox.setAttribute("class", "checkbox");
	
	checkboxCell.appendChild(checkBox);
	prioCell.appendChild(badge);
	descriptionCell.innerHTML = task.description;
	dateCell.innerHTML = task.dueDate;
	buttonCell.appendChild(createButtonRow(task));
	
	row.id = task.id;
	row.appendChild(checkboxCell);
	row.appendChild(prioCell);
	row.appendChild(descriptionCell);
	row.appendChild(dateCell);
	row.appendChild(buttonCell);
	row.setAttribute("class", "collapse");
	
	
	table.appendChild(row);

}

/*
 * Add finished task object to DOM
 * @id: id of the finished task object
 */
function addTaskToFinished(id){
	var task = JSON.parse(localStorage.getItem(id));	
	
	// set finish time
	var time = new Date();
	var finishTime = time.getMonth() + "/" + time.getDate() + "/" + "/" + time.getFullYear();
	task.finishDate = finishTime;
	
	var table = document.getElementById("finishedList");
	var row = document.createElement("tr");
	var checkboxCell = document.createElement("td");
	var prioCell = document.createElement("td");
	var descriptionCell = document.createElement("td");
	var dueDateCell = document.createElement("td");
	var finishDateCell = document.createElement("td");
	var buttonCell = document.createElement("td");
	var checkBox = document.createElement("input");
	var badge = document.createElement("span");

	badge.innerHTML = task.prio;
	switch(parseInt(task.prio)){
	case 1: badge.setAttribute("class", "badge"); break;
	case 2: badge.setAttribute("class", "badge badge-info"); break;
	case 3: badge.setAttribute("class", "badge badge-warning"); break;
	case 4: badge.setAttribute("class", "badge badge-important"); break;
	case 5: badge.setAttribute("class", "badge badge-inverse"); break;
	}

	checkBox.setAttribute("type", "checkbox");
	checkBox.setAttribute("class", "checkbox");
	
	checkboxCell.appendChild(checkBox);
	prioCell.appendChild(badge);
	descriptionCell.innerHTML = task.description;
	dueDateCell.innerHTML = task.dueDate;
	finishDateCell.innerHTML = task.finishDate;
	buttonCell.appendChild(createButtonRow(task));
	
	row.id = task.id;
	row.appendChild(checkboxCell);
	row.appendChild(prioCell);
	row.appendChild(descriptionCell);
	row.appendChild(dueDateCell);
	row.appendChild(finishDateCell);
	row.appendChild(buttonCell);
	
	table.appendChild(row);
}

/*
 * Remove a task from DOM
 * @id: id of the task to be removed
 */
function removeTaskFromDOM(id){
	var tr = document.getElementById(id);
	tr.parentNode.removeChild(tr);
}

/*
 * Create delete/edit/finish-Buttons for a task
 * @task: task object to create button row for
 * @return: div-Element containing buttons
 */
function createButtonRow(task){
	
	// EDIT button
	var editButton = document.createElement("a");
	var editIcon = document.createElement("i");
	editIcon.setAttribute("class", "icon-edit");
	editButton.setAttribute("class", "btn");
	editButton.appendChild(editIcon);
	editButton.href = "javascript:editTask(\""+task.id+"\")";
	
	// DELETE button
	var deleteButton = document.createElement("a");
	var deleteIcon = document.createElement("i");
	deleteIcon.setAttribute("class", "icon-trash icon-white");
	deleteButton.setAttribute("class", "btn btn-danger");
	deleteButton.appendChild(deleteIcon);
	deleteButton.href = "javascript:confirmDelete(\""+task.id+"\")";
	
	// FINISHED button
	var finishedButton = document.createElement("a");
	var finishedIcon = document.createElement("i");
	finishedIcon.setAttribute("class", "icon-ok-circle icon-white");
	finishedButton.setAttribute("class", "btn btn-success");
	finishedButton.appendChild(finishedIcon);
	finishedButton.href = "javascript:finishTask(\""+task.id+"\")";

	
	var buttonRow = document.createElement("div");
	buttonRow.setAttribute("class", "clearfix");
	buttonRow.appendChild(deleteButton);
	if(task.id.substring(0,1) == "t"){
		buttonRow.appendChild(editButton);
		buttonRow.appendChild(finishedButton);
	}
	
	return buttonRow;
}

/*
 * Show modal dialog to confirm delete
 */
function confirmDelete(id){
	document.getElementById("confirmDeleteButton").setAttribute("href", "javascript:deleteTask(\"" + id + "\")");
	$("#confirmModal").modal("show");
}

/*
 * Delete task from local storage and remove from DOM
 * @id: id of the task to be removed
 */
function deleteTask(id){
	localStorage.removeItem(id);
	
	if(id.substring(0,1) == "t") deleteKeyFromOpen(id);
	else deleteKeyFromFinished(id);

	removeTaskFromDOM(id);
	$("#confirmModal").modal("hide");
	updateTaskContainers();
}

/*
 * Delete a task key from open tasks key-array
 */
function deleteKeyFromOpen(id){
	var open = getOpenTasks();
	if(open){
		for (var i=0;i<open.length;i++){
			if(open[i] == id){
				open.splice(i,1);
			}
		}
		localStorage.setItem("tasks", JSON.stringify(open));
	}
}

/*
 * Delete a task key from open finished key-array
 */
function deleteKeyFromFinished(id){
	var finished = getFinishedTasks();
	if(finished){
		for (var i=0;i<finished.length;i++){
			if(finished[i] == id){
				finished.splice(i,1);
			}
		}
		localStorage.setItem("finished", JSON.stringify(finished));
	}
}

/*
 * Mark a task as finished and add to "finished" list in DOM
 * @id: id of the task to be marked as finished
 */
function finishTask(id){	
	var task = JSON.parse(localStorage.getItem(id));
	task.id = "f_" + task.id.substring(2); // change id prefix
	
	var finished = getFinishedTasks();
	finished.push(task.id); // add to finished array
	localStorage.setItem("finished", JSON.stringify(finished));
	localStorage.setItem(task.id, JSON.stringify(task)); //add to local storage
	addTaskToFinished(task.id); // add to DOM	

	deleteTask(id); // delete open task from local storage and DOM
}

/*
 * Insert Edit form in DOM
 */
function editTask(id){
	var task = JSON.parse(localStorage.getItem(id));
	
	var prioCell = document.getElementById(id + "_prio");
	var dateCell = document.getElementById(id + "_date");
	var descCell = document.getElementById(id + "_desc");
	var buttCell = document.getElementById(id + "_butt");
	
	while(prioCell.childNodes.length > 0){
		prioCell.removeChild(prioCell.firstChild);
	}	
	while(dateCell.childNodes.length > 0){
		dateCell.removeChild(dateCell.firstChild);
	}	
	while(descCell.childNodes.length > 0){
		descCell.removeChild(descCell.firstChild);
	}	
	while(buttCell.childNodes.length > 0){
		buttCell.removeChild(buttCell.firstChild);
	}	
	
	// PRIO
	var prioDropdown = document.createElement("select");
	prioDropdown.setAttribute("class", "span1");
	prioDropdown.setAttribute("id", prioCell.id + "_e");
	
	for(var p=0; p<=5; p++){
		var prio=document.createElement("option");
		prio.innerHTML = p;
		if(p==task.prio) prio.setAttribute("selected", "selected");
		prioDropdown.appendChild(prio);
			
	}
	
	// DESCRIPTION
	var descriptionInput = document.createElement("input");
	descriptionInput.setAttribute("type", "text");
	descriptionInput.setAttribute("class", "span6");
	descriptionInput.setAttribute("value", task.description);
	descriptionInput.setAttribute("id", descCell.id + "_e");
	
	// DATE
	var dateInput = document.createElement("input");
	dateInput.setAttribute("type", "text");
	dateInput.setAttribute("class", "span2");
	dateInput.setAttribute("value", task.dueDate);
	dateInput.setAttribute("id", dateCell.id + "_e");
	
	// BUTTONS
	var saveButton = document.createElement("a");
	var cancelButton = document.createElement("a");
	saveButton.innerHTML = "Save";
	saveButton.setAttribute("class", "btn btn-success");
	saveButton.setAttribute("href", "javascript:saveEdited(\"" + id + "\")");
	cancelButton.innerHTML = "Cancel";
	cancelButton.setAttribute("class", "btn btn-danger");
	cancelButton.setAttribute("href", "javascript:cancelEdited(\"" + id + "\")");
	
	// construct row
	prioCell.appendChild(prioDropdown);
	descCell.appendChild(descriptionInput);
	dateCell.appendChild(dateInput);
	buttCell.appendChild(saveButton);
	buttCell.appendChild(cancelButton);
}

/*
 * Save user entered/edited data to task and update DOM
 */
function saveEdited(id){

	var prio_e = document.getElementById(id + "_prio_e").value;
	var date_e = document.getElementById(id + "_date_e").value;
	var desc_e = document.getElementById(id + "_desc_e").value;
	
	var task = JSON.parse(localStorage.getItem(id));
	
	var prioCell = document.getElementById(id + "_prio");
	var dateCell = document.getElementById(id + "_date");
	var descCell = document.getElementById(id + "_desc");
	var buttCell = document.getElementById(id + "_butt");
	
	while(prioCell.hasChildNodes() && prioCell.childNodes.length > 0){
		prioCell.removeChild(prioCell.firstChild)
	}	
	while(dateCell.hasChildNodes() && dateCell.childNodes.length > 0){
		dateCell.removeChild(dateCell.firstChild)
	}	
	while(descCell.hasChildNodes() && descCell.childNodes.length > 0){
		descCell.removeChild(descCell.firstChild)
	}	
	while(buttCell.hasChildNodes() && buttCell.childNodes.length > 0){
		buttCell.removeChild(buttCell.firstChild)
	}	

	var badge = document.createElement("span");
	badge.innerHTML = prio_e;
	switch(parseInt(prio_e)){
	case 1: badge.setAttribute("class", "badge"); break;
	case 2: badge.setAttribute("class", "badge badge-info"); break;
	case 3: badge.setAttribute("class", "badge badge-warning"); break;
	case 4: badge.setAttribute("class", "badge badge-important"); break;
	case 5: badge.setAttribute("class", "badge badge-inverse"); break;
	}
	
	prioCell.appendChild(badge);
	descCell.innerHTML = desc_e;
	dateCell.innerHTML = date_e;

	buttCell.appendChild(createButtonRow(task));	
	
	task.prio = prio_e;
	task.description = desc_e;
	task.dueDate = date_e;
	localStorage.removeItem(id);
	localStorage.setItem(task.id, JSON.stringify(task));

}

/*
 * Remove edit-form from DOM and restore original values
 */
function cancelEdited(id){
	var task = JSON.parse(localStorage.getItem(id));
	
	var prioCell = document.getElementById(id + "_prio");
	var dateCell = document.getElementById(id + "_date");
	var descCell = document.getElementById(id + "_desc");
	var buttCell = document.getElementById(id + "_butt");
	
	while(prioCell.hasChildNodes() && prioCell.childNodes.length > 0){
		prioCell.removeChild(prioCell.firstChild)
	}	
	while(dateCell.hasChildNodes() && dateCell.childNodes.length > 0){
		dateCell.removeChild(dateCell.firstChild)
	}	
	while(descCell.hasChildNodes() && descCell.childNodes.length > 0){
		descCell.removeChild(descCell.firstChild)
	}	
	while(buttCell.hasChildNodes() && buttCell.childNodes.length > 0){
		buttCell.removeChild(buttCell.firstChild)
	}	

	var badge = document.createElement("span");
	badge.innerHTML = task.prio;
	switch(parseInt(task.prio)){
	case 1: badge.setAttribute("class", "badge"); break;
	case 2: badge.setAttribute("class", "badge badge-info"); break;
	case 3: badge.setAttribute("class", "badge badge-warning"); break;
	case 4: badge.setAttribute("class", "badge badge-important"); break;
	case 5: badge.setAttribute("class", "badge badge-inverse"); break;
	}
	
	prioCell.appendChild(badge);
	descCell.innerHTML = task.description;
	dateCell.innerHTML = task.dueDate;

	buttCell.appendChild(createButtonRow(task));
	
}