# Delay Gate
Is node-red node that can be used to pass messages only after certain delay period since the initial "trigger message" has passed.

After the initial delay the gate can either stay open until the closing timer expires or be closed immediately after the first message is forwarded.

## Accepted message
Optionally only the messages with specific `msg.payload` can be allowed. Accepted message type and payload value can be specified in node properties. When `payload` value is not defined there all messages are accepted by the node.


## Behaviour
The gate has three states:

- closed state
- delay state
- open state

Initially the gate is in __closed state__.

When the first accepted message is received the gate enters __delay state__ and starts delay timer. During the delay state all accepted messages are ignored. When not accepted message is received during the delay state the delay is cancelled and the gate returns to __closed state__.

When the delay period has passed the gate enters __open state__ and the next accepted message will be passed to gate output.

In case the node is configured to close the gate immediately after passing the message the gate returns to __closed state__ after passing the first message. Otherwise it stays open for the accepted messages until the gate open period has passed. In case not accepted message is received during that time the gate returns to __closed state__.
