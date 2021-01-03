function toggleMenu() {
  let menu = document.getElementById('mob-menu');
  if(menu.classList.contains('hidden')){
    menu.classList.remove('hidden');
    menu.classList.add('block');
  }
  else{
    menu.classList.remove('block');
    menu.classList.add('hidden');
  }
}
function sendEmail() 
{
    window.location = "mailto:cet.sac.zairza@gmail.com";
}
const isHidden = [true, true, true]
const sections = [0,1,1,2,2,3,3,4,5,5]

$(document).ready(function() {
  $('#mob-menu li').on('click', function() {
    if($('#mob-menu').hasClass('hidden')){
      $('#mob-menu').removeClass('hidden').addClass('block');
      $('.menu').toggleClass('opened');
    }else{
      $('#mob-menu').removeClass('block').addClass('hidden');
      $('.menu').toggleClass('opened');
    }
  })
  new fullpage('#fullpage', {
    afterLoad: function(origin, destination, direction){
        navs = $('ul#mob-menu > li');
        if(origin.index != 9)
          navs.eq(sections[origin.index]).removeClass("bg-focus");
        if(destination.index != 9)
        navs.eq(sections[destination.index]).addClass("bg-focus");
    },
    onLeave : function(origin, destination, direction) {
      if(origin.index == 0 && direction == 'down') {
        $('header').addClass('navbar-fixed');
      }
      else if(destination.index == 0 && direction == 'up'){
        $('header').removeClass('navbar-fixed');
      }
    },
    sectionsColor: ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
    scrollOverflow: true,
    scrollOverflowOptions: {
      scrollbars: false
    },
    bigSectionsDestination: "top",
    fixedElements: 'navbar'
  });

  $(".showHide").each((index, element) => {
    const cards = $(`#grid${index} .card`);
    let numHidden;
    if (index == 0) {
      numHidden = cards.length - 3;  

    } else {
       numHidden = cards.length - 4;  
    }
    
    const hiddenCards = cards.slice(-numHidden);
    hiddenCards.hide();
    $(element).click(() => {
      if (isHidden[index]) {
        hiddenCards.show();
        $(element).text("Show less");
      } else {
        hiddenCards.hide();
        $(element).text("Show More");
      }
      isHidden[index] = !isHidden[index];

      fullpage_api.reBuild();
    });
  });

  const navSectionMap = [1, 2, 4, 6, 8, 9];
  $("#mob-menu li").each((index, element) => {
    $(element).click(() => fullpage_api.moveTo(navSectionMap[index]));
  });
});