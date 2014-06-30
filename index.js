var request = require('request');

function Plugin(messenger, options){
  this.messenger = messenger;
  this.options = options;
  return this;
}

var optionsSchema = {
  type: 'object',
  properties: {
    ipAddress: {
      type: 'string',
      required: true
    }
  }
};

var messageSchema = {
  type: 'object',
  properties: {
    on: {
      type: 'boolean',
      required: true
    },
    rgb: {
      type: 'string',
      required: false
    }
  }
};

Plugin.prototype.onMessage = function(data, cb){
  console.log('blink1 data', data);
  var payload = data.payload || data.message || {};

  if(payload.off){
    request.get('http://' + this.options.ipAddress + '/blink1/off', function (error, response, body) {
      console.log(response);
    });
  }

  if(payload.on){
    if(payload.rgb){
      var color = payload.rgb;
    } else {
      var color = "#FFFFFF";
    }
    request.get('http://' + this.options.ipAddress + '/blink1/fadeToRGB',
      {qs: {'rgb': color}}
      , function (error, response, body) {
      console.log(response);
    });
  }

};

Plugin.prototype.destroy = function(){
  //clean up
  console.log('destroying.', this.options);
};


module.exports = {
  Plugin: Plugin,
  optionsSchema: optionsSchema,
  messageSchema: messageSchema
};
