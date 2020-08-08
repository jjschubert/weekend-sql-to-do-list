console.log('client.js connected');

$(document).ready(onReady);

function onReady() {
    console.log('jquery running');

    //add click listeners
    $('#submit').on('click', submitItem)
    $('#displayList').on('click', '.doneBtn', markComplete)
    $('#displayList').on('click', '.deleteBtn', deleteTask)
    //load data from server
    displayItems();
}

//delete task from list/DB
function deleteTask() {
    console.log('in deleteTask');
    let idToDelete = $(this).closest('tr').data('item-id')
    console.log(idToDelete);

    $.ajax({
        method: 'DELETE',
        url: `/todo/${idToDelete}`
    }).then(function (response) {
        displayItems();
    }).catch(function (error) {
        console.log('error in DELETE', error);
    })
    
};

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
        const taskList = response;
        for (let i = 0; i < taskList.length; i++) {
            console.log(taskList);
            if (taskList[i].status === 'Done') {
                $('#displayList').append(
                    `<tr class="taskCompleted" data-item-id="${taskList[i].id}">
                    <td class="check" ><input type="checkbox" checked></td>
                    <td>${taskList[i].task}</td>
                    <td>${taskList[i].goal}</td>
                    <td>${taskList[i].status}</td>
                    <td><button class="deleteBtn">Delete</button></td>
                    <tr>
                    `)
            } else if (taskList[i].status === 'Not done') {
                $('#displayList').append(
                    `<tr data-item-id="${taskList[i].id}">
                    <td class="doneBtnBox"><button class="doneBtn">Done</button></td>
                            <td>${taskList[i].task}</td>
                            <td>${taskList[i].goal}</td>
                            <td>${taskList[i].status}</td>
                            <td><button class="deleteBtn">Delete</button></td>
                            <tr>
                            `)
            }}
    }).catch(function (error) {
        console.log('error in GET', error)
    });
} 

//send item to DB
function submitItem() {
    console.log('in submitItem');

    let itemToAdd = {
        task: $('#taskIn').val(),
        goal: $('#goalIn').val(),
    }
    if ($('#taskIn').val() === '' || $('#goalIn').val() === '') {
        alert('Both fields are required');
    } else {
        $.ajax({
            type: 'POST',
            url: '/todo',
            data: itemToAdd
        }).then(function (response) {
            console.log('Response from server: ', response);
            displayItems();
            $('#taskIn').val('');
            $('#goalIn').val('');
        }).catch(function (error) {
            console.log('Error in POST ', error)
            alert('Unable to add task at this time. Please try again later');
        })
    }
}