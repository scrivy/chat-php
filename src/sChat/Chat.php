<?php

namespace sChat;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface {
    protected $clients;
    protected $friendRequests;

    public function __construct() {
        $this->clients = [];
        $this->friendRequests = [];
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients[$conn->resourceId] = $conn;
        $this->broadcastClientCount();

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $json = json_decode($msg);

        var_dump($json);
        switch ($json->action) {
            case 'lobbymessage':
                foreach ($this->clients as $client) {
                    $client->send($msg);
                }
                break;

            case 'addFriend':
                if (isset($this->friendRequests[$json->data->to])) {
                    $exists = true;
                } else {
                    $exists = false;
                    $this->friendRequests[$json->data->from] = $from;
                }

                $from->send(json_encode([
                    'action' => 'addFriend',
                    'data' => [ 'exists' => $exists ]
                ]));
                break;

            case 'testMessage':
                if (isset($this->friendRequests[$json->data->to])) {
                    $this->friendRequests[$json->data->to]->send($msg);
                    unset($this->friendRequests[$json->data->from]);
                    unset($this->friendRequests[$json->data->to]);
                }
                break;

            default:
                echo 'error, not an action';
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
