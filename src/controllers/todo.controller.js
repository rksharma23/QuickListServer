import { User } from "../Models/user.model.js";
import { Todo } from "../Models/todo.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/jsonErrorHandler.js"

//CONTROLLER TO CREATE TODO LOGIC
const createTodo = asyncHandler(async function(req, res, next){
    const userId = req.user._id
    
    if(!userId){
        // console.log("No userId found after JWT verification !!!");
        throw new ApiError(501, "Internal Server Error")
    }

    const user = await User.findById(userId);
    if(!user){
        // console.log("User not Found while creation of todo");
        throw new ApiError(501, "Internal server Error")
    }

    const {title, description} = req.body

    const status = 'active'

    if(!title || !status){
        throw new ApiError(404, "Fill the necessary fields")
    }

    const newTodo = await Todo.create({
        title,
        description,
        status,
        createdBy: userId
    })
    
    
    const createdTodo = await Todo.findOne(newTodo._id) //this should be done using _id as it is the only thing which is unique here
    if(!createdTodo){
        throw new ApiError(503, "Server is too busy, please try again later!!!")
    }

    const updatedUser = await User.updateOne(
        {_id: userId},
        {$push: {todos: createdTodo._id}}
    )

    return res.status(200).json({message: "Todo created successfully", data : createdTodo, updatedUser: updatedUser})
})


//CONTROLLER TO HANDLE GET-TODO LOGIC
const getTodos = asyncHandler(async function(req, res, next){
    const userId = req.user._id

    const userTodosID = await User.findById(userId).select("todos");
    if(!userTodosID){
        throw new ApiError(501, "Unable to fetch todos !!!")
    }

    //OPEN --> NOTES HERE
    /*
    let userTodos = [];
    userTodosID.todos.forEach(async element => {
        const individualTodo = await Todo.findById(element);        
        userTodos.push(individualTodo);
        console.log(userTodos);
    });
    console.log(userTodos);

    Asynchronous Call in forEach: In your code, you're using forEach to iterate over userTodosID.todos and making asynchronous calls to Todo.findById(element). However, forEach does not wait for the promises returned by the await expression to resolve before proceeding to the next iteration or to the next line of code outside the loop.

    When you call await inside a forEach, it does not pause the execution of the loop. Instead, it schedules the asynchronous operation and immediately continues to execute the next lines of code.

    This means that the console.log(userTodos) and the return statement after the loop execute immediately after the forEach starts, rather than waiting for all asynchronous operations inside the loop to complete.

    Possible Outputs: As a result, when you log userTodos, it might still be an empty array (or only contain some of the todos that have been fetched so far) because the asynchronous calls inside the forEach have not completed yet.

    How to Fix It
    To properly wait for all asynchronous operations to complete before proceeding, you can use Promise.all() in combination with map() instead of forEach().
    Use map():
    map() creates a new array populated with the results of calling a provided function on every element in the calling array.
    Wrap in Promise.all():

    Promise.all() takes an iterable of promises and returns a single promise that resolves when all of the promises in the iterable have resolved.

    */
    
    const userTodos = await Promise.all(
        userTodosID.todos.map(async (element) => {
            return( await Todo.findById(element) )
        })
    )
    return res.status(200).json({message: "Todos fetched successfully", data: userTodos})
})


//CONTROLLER TO UPDATE TODO LOGIC
const updateTodo = asyncHandler(async function(req, res, next){
    const { todoID, title, description, status } = req.body;

    if(!todoID || !title || !status){
        throw new ApiError(404, "Fill the necessary fields")
    }

    //OPEN --> NOTES HERE
    /*
        In MongoDB, you can perform update operations using various methods. The most common methods for updating documents in a collection are updateOne(), updateMany(), and findOneAndUpdate(). Below is an overview of each method, along with examples.

        1. updateOne()
        The updateOne() method updates a single document that matches the specified filter. If multiple documents match the filter, only the first one found will be updated.
        Syntax
        db.collection.updateOne(filter, update, options)
        filter: A query that matches the document you want to update.
        update: The update operations to apply.
        options: Optional settings, such as upsert, which creates a new document if no documents match the filter.
        Example
        db.users.updateOne(
            { username: "johndoe" }, // filter
            { $set: { age: 30 } }    // update
        );


        2. updateMany()
        The updateMany() method updates all documents that match the specified filter.
        Syntax
        db.collection.updateMany(filter, update, options)
        Example
        db.users.updateMany(
            { active: false },          // filter
            { $set: { status: "inactive" } } // update
        );


        3. findOneAndUpdate()
        The findOneAndUpdate() method finds a single document, updates it, and returns either the original document or the updated document based on the specified options.
        Syntax
        db.collection.findOneAndUpdate(filter, update, options)
        Example
        db.users.findOneAndUpdate(
            { username: "johndoe" }, // filter
            { $set: { age: 31 } },    // update
            { returnOriginal: false } // return updated document
        );


        Update Operators
        Here are some common update operators you can use in your update queries:

        $set: Sets the value of a field in a document.
        db.users.updateOne(
            { username: "johndoe" },
            { $set: { age: 31 } }
        );


        $unset: Removes a field from a document.
        db.users.updateOne(
            { username: "johndoe" },
            { $unset: { age: "" } } // Remove the "age" field
        );


        $inc: Increments the value of a field by a specified amount.
        db.users.updateOne(
            { username: "johndoe" },
            { $inc: { age: 1 } } // Increment age by 1
        );


        $push: Adds an item to an array.
        db.users.updateOne(
            { username: "johndoe" },
            { $push: { hobbies: "coding" } } // Add "coding" to hobbies array
        );


        $pull: Removes an item from an array.
        db.users.updateOne(
            { username: "johndoe" },
            { $pull: { hobbies: "coding" } } // Remove "coding" from hobbies array
        );

        LINK TO THE CHAT ABOVE :- https://chatgpt.com/share/67000ca0-d470-8010-88fb-1bcfdf038b3c
    */

    const updatedTodo = await Todo.findOneAndUpdate(
        {_id:todoID},
        {
            $set:{
                title: title,
                description: description,
                status: status
            }
        },
        {
            returnOriginal: false
        }
    )

    if(!updatedTodo){
        throw new ApiError(501, "Unable to update this time, please try again later !!!");
    }

    return res.status(200).json({message: "Todo updated Successfully !", data:updatedTodo})
})


//CONTROLLER TO DELETE A TODO LOGIC
const deleteTodo = asyncHandler(async function(req, res, next){
    const { todoID } = req.body
    const userID = req.user._id

    if(!todoID || !userID){
        // console.log(todoID)
        // console.log(userID);
        throw new ApiError(501, "Internal Server Error, please try again later!!!")
    }

    const deletedTodo = await Todo.findOneAndDelete(
        {
            _id: todoID
        }
    )
    if(!deletedTodo){
        throw new ApiError(502, "No such todo found to be deleted !!!")
    }

    const updatedUser = await User.findOneAndUpdate(
        {
            _id: userID
        },
        {
            $pull:
            {
                todos: todoID
            }
        },
        {
            returnOriginal: false
        }
    )

    // console.log(updatedUser);
    return res.status(200).json({message: "Todo Deleted Successfully", data:{deletedTodo: deletedTodo, newUser: updatedUser}});    
})


export {createTodo, getTodos, updateTodo, deleteTodo}