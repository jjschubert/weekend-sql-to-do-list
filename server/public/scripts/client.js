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

function submitItem() {

}