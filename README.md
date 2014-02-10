# What
Connect middleware to expose changes to a Mongoose model via SSE (Server Sent Events)

# TODO
* check if given model implements the required methods
* use next function to propagate the error
* options
  * startingAt, value or a function used to get the initial timestamp
  * environment, value or a function used to get extra data to give to the query function (the function is called with req parameter)
