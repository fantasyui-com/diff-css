require(__dirname+'/program.js')({reporter: 'json', args:['test/old.css','test/new.css']}, {}, function(error,data){
    if(JSON.stringify(data) === `{"meta":{"olderFilename":"test/old.css","newerFilename":"test/new.css","olderSelectorCount":3,"newerSelectorCount":3},"data":{"deleted":["b"],"created":["x"]}}`){
      process.exit();
    }else{
      process.exit(1);
    }
});
