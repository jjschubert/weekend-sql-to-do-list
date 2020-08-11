console.log('client.js connected');

$(document).ready(onReady);

let editStatus = '';
let item = {};

function onReady() {
    console.log('jquery running');

    //add click listeners
    $('#submit').on('click', handleSubmit)
    $('#displayList').on('click', '.doneBtn', markComplete)
    $('#displayList').on('click', '.deleteBtn', deleteItem)
    $('#displayList').on('click', '.editBtn', editTask)
    $('#forCancelBtn').on('click', '#cancelBtn', cancelEdit);
    //load data from server
    displayItems();
}

function cancelEdit() {
    $('#forCancelBtn').text('');
    $('input').val('');
    //turn title back to add book
    $('#inputTitle').text('Add Task');
    editStatus = false;
}


//opens edit status to add completed date
function editTask() {
    console.log('in editTask');
    editStatus = true;
    //add cancel button
    $('#forCancelBtn').append(`
    <button class="btn btn-secondary" id='cancelBtn'>Cancel<button>`);
    $('#inputTitle').text('Edit Task');

    //fill inputs for editing
    let itemGoal = $(this).closest('tr').data('item-goal');
    let itemTask = $(this).closest('tr').data('item-task');
    let itemCompletion = $(this).closest('tr').data('item-completion');
    $('#taskIn').val(itemTask),
        $('#goalIn').val(itemGoal),
        $("#completedDateIn").val(itemCompletion)

    item.id = $(this).closest('tr').data('item-id');
    item.editStatus = 'toEdit';
    console.log('in edit', item);
}

function deleteItem() {
    console.log('in deleteTask');
    let idToDelete = $(this).closest('tr').data('item-id')
    console.log(idToDelete);
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this task!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal("Your task has been deleted!", {
                    icon: "success",
                });
                $.ajax({
                    method: 'DELETE',
                    url: `/todo/${idToDelete}`
                }).then(function (response) {
                    displayItems();
                }).catch(function (error) {
                    console.log('error in DELETE', error);
                });
            } else {
                swal("Your task is safe!");
            }
        });

}


//mark item done in DB
function markComplete() {
    console.log('in markComplete');
    let idToUpdate = $(this).closest('tr').data('item-id');
    console.log(idToUpdate);
    let status = {
        status: 'Done',
    };
    $.ajax({
        method: 'PUT',
        url: `/todo/${idToUpdate}`,
        data: status
    }).then(function () {
        displayItems();
    }).catch(function (error) {
        console.log(error);
    });
}


//get books from DB and append to table
function displayItems() {
    $('#displayList').empty();
    $.ajax({
        type: 'GET',
        url: '/todo'
    }).then(function (response) {
        for (let i = 0; i < response.length; i++) {
            const oneTask = response[i];
            console.log(oneTask);

            if (oneTask.status === 'Done') {
                $('#displayList').append(
                    `<tr class="taskCompleted" data-item-completion="${oneTask.completion}" data-item-goal="${oneTask.goal}" data-item-id="${oneTask.id}" data-item-task="${oneTask.task}">
                    <td class="check" ><input type="checkbox" checked></td>
                    <td>${oneTask.task}</td>
                    <td>${oneTask.goal}</td>
                    <td>${oneTask.status}</td>
                    <td>${oneTask.completion}</td>
                    <td><button class="btn btn-outline-dark btn-sm editBtn">Edit</button>
                    <button class="deleteBtn btn btn-danger btn-sm">Delete</button></td>
                    <tr>
                    `)
            } else if (oneTask.status === 'Not done') {
                $('#displayList').append(
                    `<tr data-item-completion="${oneTask.completion}" data-item-goal="${oneTask.goal}" data-item-id="${oneTask.id}" data-item-task="${oneTask.task}" >
                    <td class="doneBtnBox"><button class="doneBtn btn btn-info btn-sm">Mark Done</button></td>
                            <td>${oneTask.task}</td>
                            <td>${oneTask.goal}</td>
                            <td>${oneTask.status}</td>
                            <td></td>
                            <td><button class="btn btn-outline-dark btn-sm editBtn">Edit</button>
                            <button class="deleteBtn btn btn-danger btn-sm">Delete</button></td>
                            <tr>
                            `)
            }
        }
    }).catch(function (error) {
        console.log('error in GET', error)
    });
}

function handleSubmit() {
    console.log('in handleSubmit');
    if (editStatus === true) {
        submitEditedItem();
    } else {
        submitItem();
    }
}

//send edits to DB
function submitEditedItem() {

    item.task = $('#taskIn').val();
    item.goal = $('#goalIn').val();
    item.completion = $('#completedDateIn').val();

    console.log('in submitEditedItem', item);
    $.ajax({
        method: 'PUT',
        url: `/edit/${item.id}`,
        data: item
    }).then(function () {
        displayItems();
        cancelEdit();
    }).catch(function (error) {
        console.log('Error in submitEditedItem', error);
    })
}

//send new item to DB
function submitItem() {

    item = {
        task: $('#taskIn').val(),
        goal: $('#goalIn').val(),
    }
    console.log('in submitItem', item);
    if ($('#taskIn').val() === '' || $('#goalIn').val() === '') {
        alert('Task and goal fields are required');
    } else {
        $.ajax({
            type: 'POST',
            url: '/todo',
            data: item
        }).then(function (response) {
            console.log('Response from server: ', response);
            displayItems();
            $('#taskIn').val('');
            $('#goalIn').val('');
            $('#completedDateIn').val('');
        }).catch(function (error) {
            console.log('Error in POST ', error)
            alert('Unable to add task at this time. Please try again later');
        })
    }
}