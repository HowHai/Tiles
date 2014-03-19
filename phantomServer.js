var phantom = require('phantom');
phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open('http://dribbble.com/', function(status) {
      console.log(status);

      page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',function() {

        page.evaluate(function() {
          var images = [];

          function getImgDimensions($i) {
              return {
                  top : $i.offset().top,
                  left : $i.offset().left,
                  width : $i.width(),
                  height : $i.height()
              }
          }

          $('.dribbble-img img').each(function() {
              var img = getImgDimensions($(this));
              images.push(img);
          });


          return images;
        }, function(result) {

          page.clicRect = result[0];
          page.render('images/1.png');
          // result.forEach(function(imageObj, index, array){
          //     page.clipRect = imageObj;
          //     page.render('images/'+index+'.png')
          // });

          ph.exit();
        });
      });
    });

  });
});



// var phantom = require('phantom');
// phantom.create(function(ph) {
//   return ph.createPage(function(page) {
//     return page.open('https://twitter.com/', function(status) {
//       console.log('page loaded:', status);

//       page.render('twitter.png');
//       ph.exit();
//     });
//   });
// });

// var phantom = require('phantom');
//   phantom.create(function(ph) {
//     return ph.createPage(function(page) {
//       return page.open('http://www.thisiswhyimbroke.com/new/', function(status) {
//         console.log('opened site?', status);

//         page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
//           //jQuery loaded.
//           // Wait a bit for AJAX content to load on the page.
//           setTimeout(function() {
//             return page.evaluate(function() {

//               // Get what you want from page using jQuery.
//               var titleArr = [];
//               var contentArr = [];

//               titleArr.push(jQuery('article h1 a')[0].text);
//               contentArr.push(jQuery('article .details .desc p')[0].innerText);

//               // $(".listEntry h3 a").each(function() {
//               //   titleArr.push($(this)[0].text);
//               // });

//               // page.render('twitter.png');

//               return {name: titleArr[0], content: contentArr[0], imgUrl: 'photo1.jpg'};
//             });
//           }, 1000);

//         });
//       });
//     });
//   });
