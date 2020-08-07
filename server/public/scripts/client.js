console.log('client.js connected');

$(document).ready(onReady);

function onReady () {
console.log('jquery running');

//add click listeners
$('#submit').on('click', submitItem)
//load data from server
displayItems();
}

//get books from DB and append to table
function displayItems() {
    $('#displayList').empty();
    $.ajax({
        type: 'GET',
        url: '/todo'
    }).then(function (response) {
        const taskList = response;
        for (let i=0; i < taskList.length; i++) {
            console.log(taskList);
            $('#displayList').append(
                `<tr data-id-${taskList[i].id}>
                <td>${taskList[i].task}</td>
                <td>${taskList[i].goal}</td>
                <td>${taskList[i].status}</td>
                <td></td>
                <tr>
                `
            )
        }
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
        }).catch(function (error) {
            console.log('Error in POST ', error)
            alert('Unable to add task at this time. Please try again later');
        })
    }
}