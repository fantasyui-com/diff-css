const fs = require('fs');
const listCssClasses = require('list-css-classes');

module.exports = function(setup, data, done){

    console.warn("Comparing [%s] against [%s]", setup.args[0], setup.args[1]);

    let olderFilename = setup.args[0];
    let newerFilename = setup.args[1];

    let olderString = fs.readFileSync(olderFilename, {encoding:'utf8'});
    let newerString = fs.readFileSync(newerFilename, {encoding:'utf8'});

    Promise.all([listCssClasses({css:olderString}), listCssClasses({css:newerString})]).then(values => {

      let olderList = values[0].selectors;
      let newerList = values[1].selectors;

      // Strategy: create an object that can be used as "JSON reporter",
      // and then just print it out as text if reporter is type text.

      let report = {
        meta:{
          olderFilename,
          newerFilename,
          olderSelectorCount: Object.keys(olderList).length,
          newerSelectorCount: Object.keys(newerList).length,
        },
        data:{
          deleted:[],
          created:[]
        },
      };


      Object.keys(olderList).sort().forEach(name => {
        if(!newerList[name]){
          report.data.deleted.push(name);
        }
      });

      Object.keys(newerList).sort().forEach(name => {
        if(!olderList[name]){
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
