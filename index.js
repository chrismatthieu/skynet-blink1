var WeMo = require('wemo');

function Plugin(messenger, options){
  this.messenger = messenger;
  this.options = options;
  return this;
}

var optionsSchema = {
  type: 'object',
  properties: {
    friendlyName: {
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
    }
  }
};

Plugin.prototype.onMessage = function(data, cb){
  console.log('wemo data', data);
  var payload = data.payload || data.message || {};
  WeMo.Search(this.options.friendlyName, function(err, device) {

    if(device){
      var wemoSwitch = new WeMo(device.ip, device.port);
      var binaryState = 0;
      if(payload.on){
        binaryState = 1;
      }
      console.log(wemoSwitch);
      wemoSwitch.setBinaryState(binaryState, function(serr, result) {
        if (serr){
          console.error('error setting state', serr);
        }else{
          console.log(result);
        }

        if(cb){
          cb(serr, result);
        }

      });
    }else{
      if(cb){
        cb(err, null);
      }
    }
  });

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
