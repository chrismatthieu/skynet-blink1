var request = require('request');

function Plugin(messenger, options){
  this.messenger = messenger;
  this.options = options;
  return this;
}

// var optionsSchema = {
//   type: 'object',
//   properties: {
//     ipAddress: {
//       type: 'string',
//       required: true,
//       default: '127.0.0.1'
//     }
//   }
// };

var messageSchema = {
  type: 'object',
  properties: {
    on: {
      type: 'boolean',
      required: true
    },
    color: {
      type: 'string',
      required: true
    }
  }
};

Plugin.prototype.onMessage = function(data, cb){
  console.log('blink1 data', data);
  var payload = data.payload || data.message || {};

  if(payload.on){
    if(payload.color != undefined){      
      var color = decodeURIComponent(payload.color);
    } else {
      var color = "#FFFFFF";
    }
    // request.get('http://' + this.options.ipAddress + ':8934/blink1/fadeToRGB',
    request.get('http://127.0.0.1:8934/blink1/fadeToRGB',
      {qs: {'rgb': color}}
      , function (error, response, body) {
      console.log(body);
    });
  } else {
    request.get('http://127.0.0.1:8934/blink1/fadeToRGB',
      {qs: {'rgb': '#000000'}}
      , function (error, response, body) {
      console.log(body);
    });    
  }

};

Plugin.prototype.destroy = function(){
  //clean up
  console.log('destroying.', this.options);
};


module.exports = {
  Plugin: Plugin,
  // optionsSchema: optionsSchema,
  messageSchema: messageSchema
};
