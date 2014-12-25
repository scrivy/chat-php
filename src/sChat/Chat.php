<?php

namespace sChat;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = [];
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients[$conn->resourceId] = $conn;
        $this->broadcastClientCount();

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $numRecv = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

        foreach ($this->clients as $client) {
//            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected
                $client->send($msg);
//            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        unset($this->clients[$conn->resourceId]);
        $this->broadcastClientCount();

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occured: {$e->getMessage()}\n";
    }

    private function broadcastClientCount() {
        $clientCount = json_encode([
            'action' => 'clientcount',
            'data' => count($this->clients)
        ]);

        foreach ($this->clients as $client) {
            $client->send($clientCount);
        }
    }
}
