const fs = require('fs');
const listCssClasses = require('list-css-classes');

module.exports = function(setup, data){

    console.warn("Comparing [%s] against [%s]", setup.args[0], setup.args[1]);

    let olderFilename = setup.args[0];
    let newerFilename = setup.args[1];

    let olderString = fs.readFileSync(olderFilename, {encoding:'utf8'});
    let newerString = fs.readFileSync(newerFilename, {encoding:'utf8'});

    Promise.all([listCssClasses({css:olderString}), listCssClasses({css:newerString})]).then(values => {

      let olderList = values[0].selectors;
      let newerList = values[1].selectors;

      console.warn('Older has %s selectors', Object.keys(olderList).length)
      console.warn('Newer has %s selectors', Object.keys(newerList).length)

      console.warn(`\nList of ${olderFilename} classes removed from ${newerFilename}:\n`)
      Object.keys(olderList).sort().forEach(name => {
        if(!newerList[name]){
          console.log(`${name}`);
        }
      });

      console.warn(`\nList of new classes added to ${newerFilename}:\n`)
      Object.keys(newerList).sort().forEach(name => {
        if(!olderList[name]){
          console.log(`${name}`);
        }
      });

    });
}
