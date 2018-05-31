

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCgKPddkgj3RhPS1B2Hw_DihvXgZBbxxiE",
    authDomain: "project1team3-39b4f.firebaseapp.com",
    databaseURL: "https://project1team3-39b4f.firebaseio.com",
    projectId: "project1team3-39b4f",
    storageBucket: "project1team3-39b4f.appspot.com",
    messagingSenderId: "74591335518"
};
firebase.initializeApp(config);

var database = firebase.database();

var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");

var messaging = firebase.messaging();

$('.pullChevron').on('click', function () {
    $('#sidebar').toggleClass('active');

});

$(document).click(function (e) {
    var sidebar = $("#sidebar, .pullChevron");
    console.log(sidebar);
    if (!sidebar.is(e.target) && sidebar.has(e.target).length === 0) {//length of sidebar>pullchevron is greater than 0, a window object//
        sidebar.removeClass('active')
    }
});



$(document).ready(function () {

    $('#list-items').html(localStorage.getItem('listItems'));

    $('.add-items').submit(function (event) {
        event.preventDefault();

        var item = $('#todo-list-item').val();

        if (item) {
            $('#list-items').append("<li><input class='checkbox' type='checkbox'/>" + item + "<a class='remove'>x</a><hr></li>");

            localStorage.setItem('listItems', $('#list-items').html());

            $('#todo-list-item').val("");
        }

    });

    $(document).on('change', '.checkbox', function () {
        if ($(this).attr('checked')) {
            $(this).removeAttr('checked');
        }
        else {
            $(this).attr('checked', 'checked');
        }

        $(this).parent().toggleClass('completed');

        localStorage.setItem('listItems', $('#list-items').html());
    });

    $(document).on('click', '.remove', function () {
        $(this).parent().remove();

        localStorage.setItem('listItems', $('#list-items').html());
    });

});


var provider = new firebase.auth.GoogleAuthProvider();
$(document).on("click", '.signIn', function (e) {


    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        console.log(token);
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });


})


firebase.auth().onAuthStateChanged(function (user) {
    if (user) { // User is signed in!

        // Get profile pic and user's name from the Firebase user object.
        var profilePicUrl = user.photoURL;   // TODO(DEVELOPER): Get profile pic.
        var userName = user.displayName;        // TODO(DEVELOPER): Get user's name.
        var email = user.email;
        console.log(user.photoURL);

        // Set the user's profile pic and name.
        $('#profile').show();
        $('#profile').attr("src", profilePicUrl);

        $('.popoverContent .name').text(userName);
        $('.popoverContent .email').text(email);

        // Show user's profile and sign-out button.


        // Hide sign-in button.


        // We load currently existing chant messages.


        // We save the Firebase Messaging Device token and enable notifications.



    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        $('#profile').hide();
        // Show sign-in button.

    }
});

$(document).on("click",".signOut",function(){
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });

});


 





var user = firebase.auth().currentUser;
$(document).ready(function () {
    $('#profile1').popover({
        html: true,
        content: function () {
            return $('.popoverContent').html();
        }
    });
});




// queryURL = "https://api.edamam.com/search?q=chicken&app_id=540719b1&app_key=2d98d59eaf4976edb2d1abd92540e167"



// $.ajax({
//     url: queryURL,
//     method: "GET"
// }).then(function (response) {
//     console.log(response);
//     console.log(response.hits[0].recipe.image);
//     var testimg = response.hits[0].recipe.image;
//     $('.card-img-top').attr("src",testimg);
// }
// );







      //TODO-api random images to carousal
      //TODO-add left side bar to carousal page
      //TODO-add top navbar to all pages
    //TODO-implement api search for recipes
            //-add images to recipe page
            //-add quick blurb of recipe into recipe card
    //TODO-implement favorites for recipe
    //TODO-toggle all on todolist-all
            //-toggle favorites
            //-toggle tbd

    //TODO-random jokes api on carousal page- top
    //TODO-create same fire object to compare to todo list. if same item, reject

    //TODO-luxury- able to click recipe item and add to list

    //TODO-calories,diet labels, nutrition label,health label,


