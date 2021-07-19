var Menu = require('../models/menu');
var mongoose = require('mongoose');
const { exists } = require('../models/menu');
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  });
var menus = [
    new Menu({
    imagePath: 'img.card-img-top(src='/img/' + menu.image)',
    menuName: 'Hibasha',
    menuDescription: 'Hibasha is it a kind of bread but in big circle size and differnt spices such as black seed, cumin, and others.',
    price: 10
  })
];
var done = 0;
for (var i = 0; i < menus.length; i++){
  menus[i].save(function(err, result){
    done++;
    if (done === menus.length){
      exit();
    }
  });
}
function exit(){
  mongoose.disconnect();
}

