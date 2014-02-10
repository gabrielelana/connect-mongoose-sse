var util = require('util'),
    _ = require('lodash')

module.exports = function(model, options) {
  options = _({query: 'updatedBetween'}).merge(options || {}).valueOf()
  if (model && _.isUndefined(model[options.query])) {
    throw new Error(util.format(
      'Seems like "%s" doesn\'t implement the query method "%s"',
      model.modelName, options.query
    ))
  }

  return function(req, res, next) {
    if ((req.headers['accept'] || '').indexOf('text/event-stream') < 0) {
      return next()
    }

    var startAt = parseInt(req.headers['last-event-id'] || '0', 10),
        endAt = (new Date()).getTime()

    model[options.query](startAt, endAt, function(err, docs) {
      if (err) {
        res.writeHead(500)
        res.end()
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      })

      if (docs.length > 0) {
        res.write(util.format(
          'id: %d\nevent: %s\ndata: %s\n\n',
          endAt, model.collection.name, JSON.stringify(docs)
        ))
      }

      res.end()
    })
  }
}
