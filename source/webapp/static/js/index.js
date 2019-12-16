const baseUrl = 'http://localhost:8000/api/v1/';



function getFullPath(path) {
    path = path.replace(/^\/+|\/+$/g, '');
    path = path.replace(/\/{2,}/g, '/');
    return baseUrl + path + '/';
}

function makeRequest(path, method, auth=true, data=null) {
    let settings = {
        url: getFullPath(path),
        method: method,
        dataType: 'json'
    };
    if (data) {
        settings['data'] = JSON.stringify(data);
        settings['contentType'] = 'application/json';
    }
    if (auth) {
        settings.headers = {'Authorization': 'Token ' + getToken()};
    }
    return $.ajax(settings);
}

function saveToken(token) {
    localStorage.setItem('authToken', token);
}

function getToken() {
    return localStorage.getItem('authToken');
}

function removeToken() {
    localStorage.removeItem('authToken');
}

function logIn(username, password) {
    const credentials = {username, password};
    let request = makeRequest('login', 'post', false, credentials);
    request.done(function(data, status, response) {
        console.log('Received token');
        saveToken(data.token);
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
        getQuotesList(true);
        formModal.modal("hide");
    }).fail(function(response, status, message) {
        console.log('Could not get token');
        console.log(response);
    });
}

function logOut() {
    let request = makeRequest('logout', 'post', true);
    request.done(function(data, status, response) {
        console.log('Cleaned token');
        removeToken();
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
        getQuotesList(false);
        formModal.modal("hide");
    }).fail(function(response, status, message) {
        console.log('Could not clean token');
        console.log(response.responseText);
    });
}

function displayQuotesList(list, container) {
    for (let i = 0; i < list.length; i++) {

        container.append($(`<div class="card w-75" id="quoteContainer">
    <div class="card-body">
        <h5 class="card-title" id="author">${list[i].author}</h5>
        <p class="card-text" id="text">${list[i].text}</p>
        <p class="card-text" id="email">${list[i].email}</p>
        <p class="card-text" id="added">${new Date (Date.parse(list[i].added))}</p>
        <div class="row justify-content-between">
            <div class="btn-group" id="viewRating">
                <button class='btn btn-info' id="view_${list[i].id}" data-toggle="modal" data-target="#form_modal"><i class="fas fa-eye"></i></button>
                <span class='btn btn-outline-primary disabled' id="rating_${list[i].id}">${list[i].rating}</span>
            </div>
            <div class="btn-group btn-group-sm" >
                <button class='btn btn-success' id="rate_up_${list[i].id}"><i class="fas fa-plus-square"></i></button>
                <button class='btn btn-danger' id="rate_down_${list[i].id}"><i class="fas fa-minus-square"></i></button>
            </div>
            <div class="btn-group btn-group-sm edit_delete">
                <button class='btn btn-secondary' id="edit_${list[i].id}" data-toggle="modal" data-target="#form_modal"><i class="fas fa-pencil-alt"></i></button>
                <button class='btn btn-secondary' id="delete_${list[i].id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    </div>
</div>
        `));

        $('#view_'  + list[i].id).on('click', function(event) {
            event.preventDefault();

            quoteBox.removeClass('d-none');
            quoteEditForm.addClass('d-none');
            logInForm.addClass('d-none');
            quoteForm.addClass('d-none');

            let request = makeRequest('quotes/'+list[i].id, 'get', true);
            request.done(function(data, status, response) {
                console.log('Quote view');
                quoteViewText.text(data.text);
                quoteViewAuthor.text(data.author);
                quoteViewDate.text(new Date (Date.parse(list[i].added)))

            }).fail(function(response, status, message) {
                console.log('Could not upload quote');
                console.log(response);
            });


            formTitle.text('Просмотр цитаты');
            formSubmit.hide();

        });


        $('#rate_up_' + list[i].id).on('click', function(event) {
            console.log('click');
            event.preventDefault();
            rateUp(list[i].id);
        });
        $('#rate_down_' + list[i].id).on('click', function(event) {
            console.log('click');
            event.preventDefault();
            rateDown(list[i].id);
        });


        $('#edit_'  + list[i].id).on('click', function(event) {
            event.preventDefault();

            console.log();
            quoteEditForm.removeClass('d-none');
            quoteBox.addClass('d-none');
            logInForm.addClass('d-none');
            quoteForm.addClass('d-none');

            formTitle.text('Редактировать цитату');
            formSubmit.text('Редактировать');
            formSubmit.off('click');

            idEdit.val(list[i].id);
            textEdit.val(list[i].text);
            emailEdit.val(list[i].email);

            formSubmit.on('click', function(event) {
                quoteEditForm.submit();
        });
        });

        $('#delete_'  + list[i].id).on('click', function(event) {
            event.preventDefault();
            let request = makeRequest('quotes/'+list[i].id, 'delete', true);
            request.done(function(data, status, response) {
                console.log('Quote deleted');
                getQuotesList(true);
            }).fail(function(response, status, message) {
                console.log('Could not delete quote');
                console.log(response);
            });
        });
    }
}

let logInForm, quoteForm, homeLink, enterLink, exitLink, addQuoteLink, formSubmit, formTitle, content, formModal,
    usernameInput, passwordInput, authorInput, textInput, emailInput, quotesContainer, quoteEditForm,idEdit, textEdit,
    emailEdit, statusEdit, quoteBox, quoteViewText, quoteViewAuthor, quoteViewDate;

function setUpGlobalVars() {
    logInForm = $('#log_in_form');
    quoteForm = $('#quote_form');
    homeLink = $('#home_link');
    enterLink = $('#enter_link');
    exitLink = $('#exit_link');
    formSubmit = $('#form_submit');
    formTitle = $('#form_title');
    content = $('#content');
    formModal = $('#form_modal');
    usernameInput = $('#username_input');
    passwordInput = $('#password_input');
    authorInput = $('#author_input');
    textInput = $('#text_input');
    emailInput = $('#email_input');
    quotesContainer = $('#quotesList');
    addQuoteLink = $('#create_link');

    quoteBox = $('#quote_view');
    quoteViewText = $('#quote_text');
    quoteViewAuthor =$('#quote_author');
    quoteViewDate = $('#quote_added');

    quoteEditForm = $('#quote_edit_form');
    idEdit = $('#id_edit');
    textEdit = $('#text_edit');
    emailEdit = $('#email_edit');
    statusEdit = $('#status_edit');
}

function sendQuote(text, author, email) {
    const credentials = {'text': text, 'author': author, 'email': email};
    let request = makeRequest('quotes/', 'post', false, credentials);
    request.done(function(data, status, response) {
        console.log('Quote added');

        quoteForm.addClass('d-none');
        logInForm.removeClass('d-none');
        getQuotesList(false);
        formModal.modal("hide");

    }).fail(function(response, status, message) {
        console.log('Could not add quote');
        console.log(response);
    });
}


function editQuote(id, text, email, status) {
    const credentials = {'text': text, 'email': email, 'status': status };
    let request = makeRequest('quotes/'+id, 'patch', true, credentials);
    request.done(function(data, status, response) {
        console.log('Quote edited');

        quoteForm.addClass('d-none');
        quoteBox.removeClass('d-none');
        logInForm.removeClass('d-none');


        getQuotesList(true);
        formModal.modal("hide");

    }).fail(function(response, status, message) {
        console.log('Could not edit quote');
        console.log(response);
    });
}




function setUpAuth() {
    quoteEditForm.on('submit', function(event) {
        event.preventDefault();
        editQuote(idEdit.val(), textEdit.val(), emailEdit.val(), statusEdit.val());
    });
    logInForm.on('submit', function(event) {
        event.preventDefault();
        logIn(usernameInput.val(), passwordInput.val());
    });

    quoteForm.on('submit', function(event) {
        event.preventDefault();
        sendQuote(textInput.val(), authorInput.val(), emailInput.val());
    });

    enterLink.on('click', function(event) {
        event.preventDefault();
        logInForm.removeClass('d-none');
        quoteForm.addClass('d-none');
        quoteBox.addClass('d-none');
        formTitle.text('Войти');
        formSubmit.text('Войти');
        formSubmit.off('click');
        formSubmit.on('click', function(event) {
            logInForm.submit();
        });
    });

    exitLink.on('click', function(event) {
        event.preventDefault();
        logOut();
    });

    addQuoteLink.on('click', function(event) {
        event.preventDefault();
        quoteForm.removeClass('d-none');
        quoteBox.addClass('d-none');
        logInForm.addClass('d-none');
        formTitle.text('Добавить цитату');
        formSubmit.text('Добавить');
        formSubmit.off('click');
        formSubmit.on('click', function(event) {
            quoteForm.submit();
        });
    })
}

function checkAuth() {
    let token = getToken();
    if(token) {
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
        getQuotesList(true);

    } else {
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
        getQuotesList(false);
    }
}

function rateUp(id) {
    let request = makeRequest('quotes/' + id + '/rate_up', 'patch', true);
    request.done(function(data, status, response) {
        console.log('Rated up quote with id ' + id + '.');
        $('#rating_' + id).text(data.rating);
    }).fail(function(response, status, message) {
        console.log('Could not rate up quote with id ' + id + '.');
        console.log(response.responseText);
    });
}

function rateDown(id) {
    let request = makeRequest('quotes/' + id + '/rate_down/', 'patch', true);
    request.done(function(data, status, response) {
        console.log('Rated down quote with id ' + id + '.');
        $('#rating_' + id).text(data.rating);
    }).fail(function(response, status, message) {
        console.log('Could not rate down quote with id ' + id + '.');
        console.log(response.responseText);
    });
}

function getQuotesList(checkStatus) {
    quotesContainer.empty();
    let quotesListRequest = makeRequest('quotes/', 'get', checkStatus);
    quotesListRequest.done(function(data, status, response){
        let quotesList = data;
        console.log(data.length);
        displayQuotesList(quotesList, quotesContainer);
        let token = getToken();
        if(token) {
            $('.edit_delete').removeClass('d-none');
        } else {
            $('.edit_delete').addClass('d-none');
        }
    }).fail(function(response, status, message) {
        console.log('Could not access to quotes list!')
    });
}





$(document).ready(function() {
    setUpGlobalVars();
    setUpAuth();
    checkAuth();
});
