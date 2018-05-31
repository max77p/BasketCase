

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


var groceryList = database.ref("/groceryList");
// var list=groceryList.child(user.displayName);




$('.pullChevron').on('click', function () {
    $('#sidebar').toggleClass('active');

})
$(document).click(function (e) {
    var sidebar = $("#sidebar, .pullChevron");
    console.log(sidebar);
    if (!sidebar.is(e.target) && sidebar.has(e.target).length === 0) {//length of sidebar>pullchevron is greater than 0, a window object//
        sidebar.removeClass('active')
    }
});

var items = [];//create an array
////////////store list items in local storage/////////////////
$(document).ready(function () {

    $('#list-items').html(localStorage.getItem('listItems'));//on load populate with html from local storage

    $('.add-items').submit(function (event) {
        event.preventDefault();

        var item = $('#todo-list-item').val();//get value from user input

        if (item) {
            $('#list-items').append("<li><input class='checkbox' type='checkbox'/>" + item + "<a class='remove' data-name='" + item + "'>x</a><hr></li>");//sets checkbox and remove dynamically

            items.push(item);//push items into array

            localStorage.setItem('listItems', $('#list-items').html());//add html data to local storage
            localStorage.setItem('listArray', JSON.stringify(items));//keep record in localStorage


            var user = firebase.auth().currentUser;
            var userName = user.displayName;
            var getLocal = JSON.parse(localStorage.getItem('listArray'));
            console.log(userName);
            console.log(getLocal);
            groceryList.child(userName + "/items").set(getLocal);


            $('#todo-list-item').val("");
        }

    });

    $(document).on('change', '.checkbox', function () {
        if ($(this).attr('checked')) {//if it has checked then clicking it will remove the checked
            $(this).removeAttr('checked');
        }
        else {
            $(this).attr('checked', 'checked');//if it doesn't have the attribute, then clicked it will check it
        }

        $(this).parent().toggleClass('completed');//add completed class to parent

        localStorage.setItem('listItems', $('#list-items').html());//update info in local storage
    });

    $(document).on('click', '.remove', function () {
        $(this).parent().remove();//remove element that was clicked
        var currentListItem = $(this).data('name');
        // console.log(currentListItem);
        var user = firebase.auth().currentUser;
        var userName = user.displayName

        localStorage.setItem('listItems', $('#list-items').html());//update local storage with updated html
       
        var listings = groceryList.child(userName + "/items");
        removeFromFB(currentListItem, listings);

        listings.on("child_removed", function (snapshot) {
            // console.log(snapshot.val());
            var getLocal = JSON.parse(localStorage.getItem('listArray'));
            // console.log(getLocal);
            var location=getLocal.indexOf(snapshot.val());
            var newItem=getLocal.splice(location,1);
            // console.log(newItem);
            localStorage.setItem('listArray', JSON.stringify(getLocal));

        });

    });

});
////////////store list items in local storage/////////////////

  




function removeFromFB(valu, path) {
    path.on('child_added', function (data) {
        // console.log(data.val());
        // console.log(data.key);
        if (data.val() === valu) {
            path.child(data.key).remove();
        }

    });
}




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
        console.log(email);
        console.log(user.photoURL);

        // Set the user's profile pic and name.

        $('.popoverContent .name').text(userName);
        $('.popoverContent .email').text(email);
        // Show user's profile and sign-out button.
        var img = $('<img src="' + profilePicUrl + '"id="profile">');
        var img2 = $('<img src="' + profilePicUrl + '"id="profileInside">');
        $('.manIcon').hide();
        $('.profile1').append(img);
        $('.firstRow').append(img2);

        // Hide sign-in button.

        // We load currently existing chant messages.

        // var getLocal = JSON.parse(localStorage.getItem('listArray'));
        // groceryList.child(userName + "/items").set(getLocal);

       //when user connects load their info to the screen and set the localstorage, in case of browser clear
        var sendToLocal=[];
        var listings = groceryList.child(userName + "/items");
        listings.on("child_added", function (snapshot) {
            console.log(snapshot.val());
            sendToLocal.push(snapshot.val());
        
            localStorage.setItem('listArray', JSON.stringify(sendToLocal));

        });


    } else { // User is signed out!
        // $('#profile').attr("src", profilePicUrl);
        // Hide user's profile and sign-out button.
        // $('#profile').hide();

        $('.manIcon').show();
        $('#profile').remove();
        $('.firstRow #profileInside').remove();
        $('.name').text("");
        $('.email').text("");
        // Show sign-in button.

    }
});

$(document).on("click", ".signOut", function () {
    var user1 = firebase.auth().currentUser;
    console.log(user1);


    // user1.delete().then(function () {
    //     console.log("signed out");
    // }).catch(function (error) {
    //     // An error happened.
    // });
    firebase.auth().signOut().then(function (e) {
        console.log('Signed Out');
        checkUser();/*for testing*/
    }, function (error) {
        console.error('Sign Out Error', error);
    });
});

function checkUser() {/*for testing only*/

    var user = firebase.auth().currentUser;
    console.log(user);
}


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


