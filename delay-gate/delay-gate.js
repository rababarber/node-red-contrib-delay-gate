module.exports = function(RED) {
    function DelayGateNode(config) {
        
        RED.nodes.createNode(this, config);
        var node = this;
        
        unitMapper = {
            'ms': 1,
            's': 1000,
            'mi': 60*1000,
            'hr': 60*60*1000
        };

        this.delayDuration = config.delayDuration;
        this.delayUnits = config.delayUnits;

        this.openDuration = config.openDuration;
        this.openUnits = config.openUnits;

        this.triggerPayloadType = config.triggerPayloadType;
        this.triggerPayload = config.triggerPayload;

        this.closeGate = config.closeGate

        if (!config.triggerPayload || String(config.triggerPayload).length==0) {
            this.payload = null
        } else {
            switch (this.triggerPayloadType) {
                case 'num':
                    this.payload = Number(config.triggerPayload);
                    break;
                case 'bool':
                    this.payload = Boolean(config.triggerPayload);
                    break;
                default:
                    this.payload = String(config.triggerPayload);
                    break;    
            }
        }
        
        var delay = null
        var timeout = null
        var nodeContext = this.context();

        function reset() {
            node.status({});
            nodeContext.set('triggered', undefined)
            if (delay) clearTimeout(delay);
            if (timeout) clearTimeout(timeout);
            delay = null
            timeout = null
        }
        
        this.on('input', function(msg) {
            this.log(this.payload);
            if (!this.payload || msg.payload === this.payload) {
                triggerTs = nodeContext.get('triggered');
                if (triggerTs) {
                    if ( Date.now() - triggerTs >= unitMapper[this.delayUnits]*this.delayDuration ) {
                        if (this.closeGate) reset();
                        node.send(msg);
                    } 
                } else {
                    nodeContext.set('triggered', Date.now())
                    node.status({fill:"yellow",shape:"ring",text:"delaying"});
                    delay = setTimeout(function() {
                        node.status({fill:"green",shape:"ring",text:"waiting message"});;
                    }, unitMapper[this.delayUnits]*this.delayDuration);
                    timeout = setTimeout(function() {
                        reset();
                    }, unitMapper[this.delayUnits]*this.delayDuration + unitMapper[this.openUnits]*this.openDuration);
                }
            } else {
                reset();
            }
        });

        this.on('close', function() {
            reset();
        });
    }
    RED.nodes.registerType("delay-gate", DelayGateNode);
}