const fs = require('fs');
const listCssClasses = require('list-css-classes');

module.exports = function(setup, data, done){

    console.warn("Comparing [%s] against [%s]", setup.args[0], setup.args[1]);

    let olderFilename = setup.args[0];
    let newerFilename = setup.args[1];

    let olderString = fs.readFileSync(olderFilename, {encoding:'utf8'});
    let newerString = fs.readFileSync(newerFilename, {encoding:'utf8'});

    Promise.all([listCssClasses({css:olderString}), listCssClasses({css:newerString})]).then(values => {


      // values[*] holds array of class names unprefixed with a "."

      let olderList = values[0].classNames;
      let olderSet = new Set(olderList);

      let newerList = values[1].classNames;
      let newerSet = new Set(newerList);


      // Strategy: create an object that can be used as "JSON reporter",
      // and then just print it out as text if reporter is type text.

      let report = {
        meta:{
          olderFilename,
          newerFilename,
          olderSelectorCount: olderList.length,
          newerSelectorCount: newerList.length,
        },
        data:{
          // initialise to empty
          deleted:[],
          created:[]
        },
      };


      olderList.forEach(name => {
        if(!newerSet.has(name)){
          report.data.deleted.push(name);
        }
      });

      newerList.forEach(name => {
        if(!olderSet.has(name)){
          report.data.created.push(name);
        }
      });


      if(setup.reporter === 'json'){
        console.log(JSON.stringify(report, null, '  '));
        if(done) done(null, report);
        return;
      }

      console.warn('Older has %s selectors', report.meta.olderSelectorCount);
      console.warn('Newer has %s selectors', report.meta.newerSelectorCount);
      console.warn(`\nList of ${olderFilename} classes removed from ${newerFilename}:\n`)
      report.data.deleted.map(name => console.log(name));
      console.warn(`\nList of new classes added to ${newerFilename}:\n`)
      report.data.created.map(name => console.log(name));

    });
}
