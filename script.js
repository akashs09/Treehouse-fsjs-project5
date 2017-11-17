
let currentSlide = 0;
let numberOfUsers = 12;
$(function() {
  // numberOfUsers = 12;
  exclude = "gender,login.username,registered,phone,id,nat";
  english = "au,ca,dk,es,fi,fr,gb,ie,nl,nz,us"
  $.ajax({
      url: 'https://randomuser.me/api/?results='+numberOfUsers+'&exc='+exclude+'&nat='+english,
      dataType: 'json',
      success: function(data) {
        users = data.results;
        orignal = data.results;
        renderPage(users);
}
});
});
//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 500;  //time in ms (5 seconds)

//on keyup, start the countdown
$('.search').keyup(function(){
    clearTimeout(typingTimer);
    let input = $('.search').val();
    if(input === ""){
      $('.container-fluid > div').remove();
      $('#lightbox').remove();
      numberOfUsers = orignal.length;
      renderPage(orignal);
    }
    else if ($('.search').val()) {
        typingTimer = setTimeout(searchUsers($('.search').val()), doneTypingInterval);
    }
});


function searchUsers(input){
  var finalArray = [];
  userAdded = [];
  for(var i = 0; i < orignal.length; i++){
    if(((((users[i].name.first).indexOf(input) > -1) || ((users[i].name.last).indexOf(input) > -1) || ((users[i].email).indexOf(input) > -1)) && userAdded.indexOf(i) < 0)) {
      finalArray.push(users[i]);
      userAdded.push(i);
    }
  }
  console.log("updated", finalArray);
  $('.container-fluid > div').remove();
  $('#lightbox').remove();
  numberOfUsers = finalArray.length;
  renderPage(finalArray);
}
function renderPage(users){
  let string = "";
  $.each(users, function(index, user) { //create the modal view here as well
      string += "<div class='col-sm-4 user' data-slide="+index+" onClick=\"handleClick(this)\">";
      string += "<img src="+user.picture.medium+" alt='thumb pic' data-slide="+index+">";
      string += "<h5 data-slide="+index+">"+user.name.first+" "+user.name.last+"</h5>";
      string += "<p data-slide="+index+">"+user.email+"</p>";
      string += "<p data-slide="+index+">"+user.location.city+"</p>";
      string += "</div>";
    });
  $('h4').after(string);
  $('div.user').on('click', function(event) {
    let curr = (event.target);
    console.log(curr);
    let slideNum = $(curr).attr('data-slide');
    if ($('#lightbox').length > 0) {
      $('#lightbox').fadeIn('400');
    } else {
      let lightbox =
          '<div id="lightbox">' +
          '<div id="background"></div>' +
          '<p>Click to close</p>' +
          '<div id="slideshow">' +
          '<ul></ul>' +
          '<div class="nav">' +
          '<a href="#prev" class="prev slide-nav" onClick="moveLeft(this)">prev</a>' +
          '<a href="#next" class="next slide-nav" onClick="moveRight(this)">next</a>' +
          '</div>' +
          '</div>' +
          '</div>';

          $('body').append(lightbox);
          let size = 0;
          $('.container-fluid').find('.user').each(function(i, el) {
            $('#slideshow ul').append(
            "<div>" +
            "<img src="+users[i].picture.medium+" alt='thumb pic' data-slide="+i+">" +
            "<p data-slide="+i+">"+users[i].name.first+" "+users[i].name.last+"</p>" +
            "<p data-slide="+i+">"+users[i].login.username+"</p>" +
            "<p data-slide="+i+">"+users[i].email+"</p>" +
            "-------------------------------------------" +
            "<p data-slide="+i+">"+users[i].cell+"</p>" +
            "<p data-slide="+i+">"+users[i].location.street+" "+users[i].location.city+", "+users[i].location.state+" "+users[i].location.postcode+"</p>" +
            "<p data-slide="+i+">"+users[i].dob.substr(0,10)+"</p>"+
            "</div>"
          );
          size++;
          });
    }
    //let size = $('#slideshow ul > div').length
    $('#slideshow ul > div').hide();
    $('#slideshow ul > div:eq('+slideNum +')').show();
    // $('body').on('click', '#lightbox', function() { // using .on() instead of .live(). more modern, and fixes event bubbling issues
    //   console.log("hiding");
    //   $('#lightbox').fadeOut(300);
    // });

    $('#background').on('click', function(event) {
      console.log("bgCLICK");
      $('#lightbox').fadeOut(300);

    });
    // toggle the navigation (prev and next) when mouse enters
    $('body').on(
      { mouseenter: function() {
        $('.nav').fadeIn(300);
      }, mouseleave: function() {
        $('.nav').fadeOut(300);
      }
      },'#slideshow');

      let currentSlide = slideNum;
      console.log("this is current slide"+currentSlide);
  //     $('body').on('click', '.slide-nav', function(event) {
  //       console.log(event.target);
  //       event.preventDefault();
  //       event.stopPropagation();
  //
  //       let $this = $(this);
  //
  //       let destinationSlide = 0;
  // console.log("curr", currentSlide, "dest", destinationSlide);
  //       if($this.hasClass('prev')){
  //         destinationSlide = currentSlide - 1;
  //         if (destinationSlide<0) {
  //           destinationSlide = 11;
  //         }
  //       } else {
  //         destinationSlide = currentSlide + 1;
  //         if (destinationSlide > 11) {
  //           destinationSlide = 0;
  //         }
  //       }
  //       console.log(destinationSlide);
  //       $('#slideshow ul > div:eq(' + currentSlide + ')').fadeOut(750);
  //       $('#slideshow ul > div:eq(' + destinationSlide + ')').fadeIn(750);
  //       currentSlide = destinationSlide;
  //     });
  });
}
function handleClick(event) {
  //console.log( $(event).attr('data-slide'));
  currentSlide = Number($(event).attr('data-slide'));
  console.log("setting the currentSlide to ", currentSlide)
}
function moveLeft(event) {
  console.log("moveleft");
  let destination = currentSlide - 1;

  if (destination < 0) {
    destination = numberOfUsers-1;
  }
  console.log("curr", currentSlide, "dest", destination);
  $('#slideshow ul > div:eq(' + currentSlide + ')').fadeOut(750);
  currentSlide = destination;
  $('#slideshow ul > div:eq(' + destination + ')').fadeIn(750);
}
// }
function moveRight(event) {
  //let curr = $(event).attr('data-slide') - 1;
  let destination = currentSlide + 1;

  if (destination > (numberOfUsers-1)) {
    destination = 0;
  }

console.log("curr", currentSlide, "dest", destination);
  // if($this.hasClass('prev')){
  //         destination = current - 1;
  //         if (destination<0) {
  //           destination = 11;
  //         }
  //       } else {
  //         destination = current + 1;
  //         if (destination > 11) {
  //           destination = 0;
  //         }
  //       }
  $('#slideshow ul > div:eq(' + currentSlide + ')').fadeOut(750);
  currentSlide = destination;
  $('#slideshow ul > div:eq(' + destination + ')').fadeIn(750);
}


// $('.container-fluid').on('click', function(event) {
//
//
//   let curr = (event.target);
//   console.log(curr);
//   // if (curr.attr('data-slide')
//   let slideNum = $(curr).attr('data-slide');
//   if ($('#lightbox').length > 0) {
//   //  console.log("should run first time");
//     $('#lightbox').fadeIn('400');
//   } else {
//     let lightbox =
//         '<div id="lightbox">' +
//         '<div id="background"></div>' +
//         '<p>Click to close</p>' +
//         '<div id="slideshow">' +
//         '<ul></ul>' +
//         '<div class="nav">' +
//         '<a href="#prev" class="prev slide-nav" onClick="moveLeft(this)">prev</a>' +
//         '<a href="#next" class="next slide-nav" onClick="moveRight(this)">next</a>' +
//         '</div>' +
//         '</div>' +
//         '</div>';
//
//         $('body').append(lightbox);
//         let size = 0;
//         $(this).find('.user').each(function(i, el) {
//           $('#slideshow ul').append(
//           "<div>" +
//           "<img src="+users[i].picture.medium+" alt='thumb pic' data-slide="+i+">" +
//           "<p data-slide="+i+">"+users[i].name.first+" "+users[i].name.last+"</p>" +
//           "<p data-slide="+i+">"+users[i].login.username+"</p>" +
//           "<p data-slide="+i+">"+users[i].email+"</p>" +
//           "-------------------------------------------" +
//           "<p data-slide="+i+">"+users[i].cell+"</p>" +
//           "<p data-slide="+i+">"+users[i].location.street+" "+users[i].location.city+", "+users[i].location.state+" "+users[i].location.postcode+"</p>" +
//           "<p data-slide="+i+">"+users[i].dob.substr(0,10)+"</p>"+
//           "</div>"
//         );
//         size++;
//         });
//   }
//   //let size = $('#slideshow ul > div').length
//   $('#slideshow ul > div').hide();
//   $('#slideshow ul > div:eq('+slideNum +')').show();
//   // $('body').on('click', '#lightbox', function() { // using .on() instead of .live(). more modern, and fixes event bubbling issues
//   //   console.log("hiding");
//   //   $('#lightbox').fadeOut(300);
//   // });
//
//   $('#background').on('click', function(event) {
//     console.log("bgCLICK");
//     $('#lightbox').fadeOut(300);
//
//   });
//   // toggle the navigation (prev and next) when mouse enters
//   $('body').on(
//     { mouseenter: function() {
//       $('.nav').fadeIn(300);
//     }, mouseleave: function() {
//       $('.nav').fadeOut(300);
//     }
//     },'#slideshow');
//
//     let currentSlide = slideNum;
//     console.log("this is current slide"+currentSlide);
// //     $('body').on('click', '.slide-nav', function(event) {
// //       console.log(event.target);
// //       event.preventDefault();
// //       event.stopPropagation();
// //
// //       let $this = $(this);
// //
// //       let destinationSlide = 0;
// // console.log("curr", currentSlide, "dest", destinationSlide);
// //       if($this.hasClass('prev')){
// //         destinationSlide = currentSlide - 1;
// //         if (destinationSlide<0) {
// //           destinationSlide = 11;
// //         }
// //       } else {
// //         destinationSlide = currentSlide + 1;
// //         if (destinationSlide > 11) {
// //           destinationSlide = 0;
// //         }
// //       }
// //       console.log(destinationSlide);
// //       $('#slideshow ul > div:eq(' + currentSlide + ')').fadeOut(750);
// //       $('#slideshow ul > div:eq(' + destinationSlide + ')').fadeIn(750);
// //       currentSlide = destinationSlide;
// //     });
// });
