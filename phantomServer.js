var phantom = require('phantom');
phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open('http://uncrate.com/', function(status) {
      console.log(status);

      page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',function() {

        // setTimeout(function() {

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

          console.log(jQuery('article .item img').length);

          // jQuery('article .item img').each(function() {
          //   var img = getImgDimensions(jQuery(this));
          //   images.push(img);
          // });
            $('.article-list.grid li .image-wrapper img').each(function() {
                var img = getImgDimensions($(this));
                images.push(img);
            });

          return images;
        }, function(result) {

          result.forEach(function(imageObj, index, array){
            page.set('clipRect', imageObj);
            page.render('images/' + index + '.png');
          });

          ph.exit();
        });
        // }, 1000);
      });
    });
  });
});



// var phantom = require('phantom');
// phantom.create(function(ph) {
//   return ph.createPage(function(page) {
//     return page.open('https://twitter.com/', function(status) {
//       console.log('page loaded:', status);

//       page.set('clipRect', { top: 186, left: 22, width: 179, height: 134 });
//       page.render('twitter5.png');
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
