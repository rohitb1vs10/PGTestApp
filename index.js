// REST API //
var express = require('express')
var body_parser = require('body-parser')
var app = express()
app.use(body_parser.json())

app.set('port', (process.env.PORT || 8000));

app.use(express.static('views'));

//var distDir = _dirname + "/views/";
//app.use(express.static(distDir));

// Mongo DB //
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//var url = 'mongodb://localhost:27017/pgtest';
var url = 'mongodb://user:abcd1234@testcluster-shard-00-00-7f3ht.mongodb.net:27017,testcluster-shard-00-01-7f3ht.mongodb.net:27017,testcluster-shard-00-02-7f3ht.mongodb.net:27017/pgtest?ssl=true&replicaSet=TestCluster-shard-0&authSource=admin';


// Mongo DB Get Data //
var dataQuery = function(db, collection, request, fields, callback){
	var remove_attribute = {'_id' : false};
    var cursor = db.collection(collection).find(request, fields);
    var jsonarray = new Array();
    cursor.each(function(err, doc){
        if(err){
            callback(err);
        }
        if(doc){
            //console.log("\ndoc is: ", doc);
            jsonarray.push(doc);
        }
        else{
            callback(null, jsonarray);
        }
    });
};

// Insert Data into Mongo //
var insertDocument = function(db, collection, data, task_count, callback){
    var update_query_string = "tasks."+ (task_count-1).toString() + ".data";
    var updated_query = {};
    updated_query[update_query_string] = data.task_details;
    db.collection(collection).update({user_id:data.user_id}, {"$push":updated_query}, function(err, result){
        assert.equal(err, null);
        callback(result);
    })
};
var createNewUser = function(db, collection, data, callback){
    db.collection(collection).insertOne(data, function(err, result){
        assert.equal(err, null);
        //console.log("\ninserted document: data=> ", data, " and result: ", result);
        callback(data);
    });
}
var createNewTask = function(db, collection, id, date, callback){
    console.log("entered createNewTask with : ", id, " ", date);    
    db.collection(collection).update({user_id:id}, {"$push":{"tasks":{date:date, data:[]}}}, function(err, result){
        assert.equal(err, null);
        callback(result);
    })
}


// Update Data in Mongo //
var updateDocument = function(db, collection, data, task_count, callback){
    var update_query_string = "tasks."+ (task_count-1).toString() + ".data." + data.count.toString();
    var updated_query = {};
    updated_query[update_query_string] = data.task_details;
    db.collection(collection).update({user_id:data.user_id}, {"$set":updated_query}, function(err, result){
        assert.equal(err, null);
        console.log("\n updated document: data=> ", data, " and result=> ", result.result);
        callback(result);
    });
};
// Get count of tasks //
var getTaskCount = function(db, collection, data, callback){
    //console.log("\nentered getTaskCount with data: ", data);
    db.collection(collection).aggregate({"$match": {user_id: data.user_id}}, {"$project":{count:{"$size":'$tasks'}}}, function(err, result){
        callback(null, result[0].count);
    });
}



// REST End Points //
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



// Users Endpoints //
app.route('/users')
    .post(function(req, res, next){
        MongoClient.connect(url, function(err, db){
            assert.equal(null, err);

            dataQuery(db, 'tasks', req.body, {user_name:1, user_id:1}, function(err, userarray){
                console.log("\ngot users: ", userarray);
                if (err){
                    throw err;
                }
                if(userarray.length == 0){
                    console.log("\nstarting to add new user ");
                    var empty_user = {
                        user_name:req.body.user_name,
                        user_id:req.body.user_id,
                        tasks:[]
                    }
                    createNewUser(db, 'tasks', empty_user, function(new_user){
                        res.send(new_user);
                        db.close();
                    });
                }
                else{
                    res.send(userarray[0]);
                    db.close(); 
                }
            });
        });
    })


// Tasks //
app.route('/tasks')
    .get(function(req, res, next){
        var MyDate = new Date();

        var today = ('0' + MyDate.getDate()).slice(-2) + '-' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-' + MyDate.getFullYear().toString().slice(-2);
        console.log("get tasks ", req.query);
        //req.query.company_id = parseInt(req.query.company_id);
        MongoClient.connect(url, function(err, db){
            assert.equal(null, err);

            dataQuery(db, 'tasks', req.query, {}, function(err, taskarray){
                if (err){
                    throw err;
                }
                var obj = taskarray[0].tasks.filter(function ( obj ) {
                    return obj.date === today;
                })[0];
                if(obj == undefined){
                    createNewTask(db, 'tasks', req.query.user_id, today, function(){
                        taskarray[0].tasks.push({date:today, data:[]});
                        res.send(taskarray[0]);
                        db.close();
                    })
                }
                else{
                    res.send(taskarray[0]);
                    db.close();
                }
            });
        });
    })
    .post(function(req, res, next){
        console.log("hit post with data: ", req.body);
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            getTaskCount(db, 'tasks', req.body, function(err, count){
                console.log("\ngot count: ", count);
                insertDocument(db, 'tasks', req.body, count, function(result) {
                    res.send(result)
                    db.close();
                });
            });  
        });
    })
    .put(function(req, res, next){
        console.log("\nhit a put request with: ", req.body);
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            //get count
            getTaskCount(db, 'tasks', req.body, function(err, count){
                console.log("\ngot count: ", count);
                updateDocument(db, 'tasks', req.body, count, function(result) {
                    res.send(result)
                    db.close();
                });
            });      
        });
    })


app.route('/admin_tasks')
    .get(function(req, res, next){
        //req.query.company_id = parseInt(req.query.company_id);
        MongoClient.connect(url, function(err, db){
            assert.equal(null, err);

            dataQuery(db, 'tasks', {}, {}, function(err, taskarray){
                if (err){
                    throw err;
                }
                res.send(taskarray);
            });
        });
    })

app.listen(app.get('port'), function(){
	console.log('listening on 3000');
});