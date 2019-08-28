$(function(e) {
    console.log('DOM');
    // e.preventDefault();

const url = "http://localhost:3000/task";

let input = $('#simple-task-title');
const list = $('.task-list');
const form = $('.form');
const btnAddTask = $('.add-task');
const btnShowList = $('.show-list');
//
const startStoper = $('.start-time');
const stopStoper = $('.end-time');
const timeCircle = $('.stoper');
let timer = $('#stoper-time');

//Date 
let date = $('.date');
const currentdate = new Date();
date.html(`${currentdate.toLocaleDateString()}`);



//Stoper
let time = 1000;
let seconds = 0;
let minutes = 0;
let hours = 0;
let active = false;
let idInterval;

function startTime(){
    if(!active) {
        active = !active;
        $('.fa-play').css('color', 'rgb(47, 26, 241)');
        idInterval = setInterval(changeTime, time);
    }
    timeCircle.addClass('time-active');
    
}

function changeTime() {
    if(active === true) {
        seconds++;
        if(seconds === 60) {
            seconds = 0;
            minutes++;
        }
        if(minutes === 60) {
            minutes = 0;
            hours++;
        }
        
        timer.text(`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
    }  
}

const stopTime = () => {
    active = !active;
    clearInterval(idInterval);
    timeCircle.removeClass('time-active');
    $('.fa-play').css('color', 'white');
}


startStoper.on('click', startTime);
stopStoper.on('click', stopTime);


//Wyświetlanie zadań
loadList();

function loadList() {
    $.ajax({
        url: url,
        dataType : "json",
    }).done(function(resp) {
        console.log(resp)
        insertTask(resp);
    }).fail(function(err) {
        console.log(err);
    });
}

function insertTask(task) {
    list.empty();
    for(let i=0; i < task.length; i++) {
        const item = task[i];
        console.log(item);
        const newLi = $(`
        <li class="simple-task" data-id="${ item.id }">
            <div class="task-content">
                <h3 class="task-title">${ item.title }</h3>
                <p class="task-work-date"><span>Data:</span>${ item.date }</p>
                <p class="task-work-time"><span>Czas:</span> ${ item.time }</p>
                <button class="btn-delete">Usuń</button>
            </div>
        </li>
    `);
    list.append(newLi);
    }
}

 btnShowList.on('click', loadList);


//Dodawanie zadań

form.on("submit", function(e) {
     e.preventDefault();
    console.log('submit');

    let valInput = input.val();
    let valTimer = timer.html();
    let valDate = date.html();
   
    

    if(valInput === '') return alert('proszę wypełnić pole!');
    if(valTimer === '- - -') return alert('Brak czasu pracy!');

      addTask(valInput, valTimer, valDate);
      loadList();
});

function addTask(title, time, date) {

    let newDataTask = {
        title: title,
        date: date,
        time: time,
    }
    $.ajax({
        url: url,
        method: "POST",
        data: newDataTask,

    }).done(function() {
        console.log('dodane nowe zadanie');
        input.val('');
    }).fail(function(err) {
        console.log(err);
    }).always(function() {
        loadList();
    });
}


// Usuwanie elementów
list.on('click', '.btn-delete', function(e) {
    e.preventDefault();
    var $this = $(this);
    var li = $this.parent().parent();
    var id = li.data('id');
    removeTask(id);
});


function removeTask(id) {
    $.ajax({
        method: "DELETE",
        url: url + "/" + id,
        dataType : "json",
    }).done(function(resp) {
    }).fail(function(err) {
        console.log(err);
    }).always(loadList);
}

});
