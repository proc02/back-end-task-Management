const express = require('express');
const bodyParser = require('body-parser');
const {mongoose}= require('./db/mongoose');
const app =express();
//Charger le modèle de donnée
const {List,Task}= require('./db/models');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
    next();

    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});
/**
 * GET /list
 * purpose: Get all lists
*/
app.get('/lists',(request,response)=>{
    //retouner toutes les liste dans la base
    List.find({}).then((lists)=>{
        response.send(lists);
    })
});
/**
 * POST /lists
 * purpose: create new List
*/
app.post('/lists',(request,response)=>{
    //Création de nouvelle liste et retourner à l'utilisateur
    let title = request.body.title;
    let newList = new List({title});
    newList.save().then((listDoc)=>{
        response.send(listDoc);
    });
});

/**
 * PATCH /lists/:id
 * purpose: Update specific list
*/
app.patch('/lists/:id',(request,response)=>{
    //Mise à jour d'une liste
    List.findOneAndUpdate({_id:request.params.id},{$set: request.body}).then(()=>{
        response.sendStatus(200);
    });
});

/**
 * DELETE /lists/:id
 * purpose: Delete specific list
*/
app.delete('/lists/:id',(request,response)=>{
    //Suppression d'une liste
    List.findOneAndRemove(({_id:request.params.id})).then((removeList)=>{
        response.send(removeList);
    });
});

app.get('/lists/:id/tasks',(request,response)=>{
    //retouner toutes les taches de la liste
    Task.find({_listId : request.params.id}).then((tasks)=>{
        response.send(tasks);
    });
});

app.post('/lists/:id/tasks',(request,response)=>{
    //
    let newTask = new Task({
        title :request.body.title,
        _listId:request.params.id ,
        complete:false
    });
    newTask.save().then((task)=>{
        response.send(task);
    });
});

app.patch('/lists/:listId/tasks/:taskId',(request,response)=>{
    //Mise à jour d'une liste
    Task.findOneAndUpdate({
        _listId:request.params.listId,
        _id:request.params.taskId
    },
        {
            $set: request.body
        }).then(()=>{
        response.send({message:'Updating success'});
    });
});

app.delete('/lists/:id/tasks/:taskId',(request,response)=>{
    //Suppression d'une liste
    Task.findOneAndRemove(({
        _listId:request.params.id,
        _id:request.params.taskId
    })).
    then((removeList)=>
    {
        response.send(removeList);
    });
});

app.get('/lists/:id/tasks/:taskId',(request,response)=>{
    //retouner toutes les taches de la liste
    Task.findOne({_listId : request.params.id,_id:request.params.taskId}).then((task)=>{
        response.send(task);
    });
});
app.listen(3000,()=>{
    console.log('Server listen on port 3000');
})
