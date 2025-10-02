import hashlib
import json
import os
from time import time
from urllib.parse import urlparse
from uuid import uuid4

import psycopg2
import psycopg2.extras
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', 5432),
    'database': os.getenv('DB_NAME', 'sud_hackathon'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password')
}

class DatabaseManager:
    def __init__(self):
        self.connection = None
        self.connect()
    
    def connect(self):
        try:
            self.connection = psycopg2.connect(**DB_CONFIG)
            self.connection.autocommit = True
            print("Connected to PostgreSQL database")
        except Exception as e:
            print(f"Error connecting to database: {e}")
            self.connection = None
    
    def get_cursor(self):
        if not self.connection:
            self.connect()
        return self.connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    def save_block(self, block, block_hash):
        try:
            cursor = self.get_cursor()
            # Insert block
            cursor.execute("""
                INSERT INTO blockchain_blocks (block_index, timestamp, proof, previous_hash, block_hash)
                VALUES (%s, %s, %s, %s, %s) RETURNING id
            """, (block['index'], int(block['timestamp']), block['proof'], block['previous_hash'], block_hash))
            
            block_id = cursor.fetchone()['id']
            
            # Insert transactions
            for tx in block['transactions']:
                cursor.execute("""
                    INSERT INTO blockchain_transactions (block_id, sender, recipient, amount)
                    VALUES (%s, %s, %s, %s)
                """, (block_id, tx['sender'], tx['recipient'], tx['amount']))
            
            cursor.close()
            return block_id
        except Exception as e:
            print(f"Error saving block: {e}")
            return None
    
    def load_blockchain(self):
        try:
            cursor = self.get_cursor()
            # Load all blocks with their transactions
            cursor.execute("""
                SELECT b.*, array_agg(
                    json_build_object(
                        'sender', t.sender,
                        'recipient', t.recipient,
                        'amount', t.amount
                    ) ORDER BY t.id
                ) as transactions
                FROM blockchain_blocks b
                LEFT JOIN blockchain_transactions t ON b.id = t.block_id
                GROUP BY b.id, b.block_index, b.timestamp, b.proof, b.previous_hash, b.block_hash
                ORDER BY b.block_index
            """)
            
            rows = cursor.fetchall()
            cursor.close()
            
            chain = []
            for row in rows:
                block = {
                    'index': row['block_index'],
                    'timestamp': row['timestamp'],
                    'transactions': row['transactions'] if row['transactions'][0] else [],
                    'proof': row['proof'],
                    'previous_hash': row['previous_hash']
                }
                chain.append(block)
            
            return chain
        except Exception as e:
            print(f"Error loading blockchain: {e}")
            return []


class Blockchain:
    def __init__(self):
        self.current_transactions = []
        self.chain = []
        self.nodes = set()
        
        # Initialize database manager
        self.db = DatabaseManager()
        
        # Load existing blockchain from database
        self.chain = self.db.load_blockchain()
        
        # Create the genesis block if no blocks exist
        if not self.chain:
            self.new_block(previous_hash='1', proof=100)

    def register_node(self, address):
        """
        Add a new node to the list of nodes

        :param address: Address of node. Eg. 'http://192.168.0.5:5000'
        """

        parsed_url = urlparse(address)
        if parsed_url.netloc:
            self.nodes.add(parsed_url.netloc)
        elif parsed_url.path:
            # Accepts an URL without scheme like '192.168.0.5:5000'.
            self.nodes.add(parsed_url.path)
        else:
            raise ValueError('Invalid URL')


    def valid_chain(self, chain):
        """
        Determine if a given blockchain is valid

        :param chain: A blockchain
        :return: True if valid, False if not
        """

        last_block = chain[0]
        current_index = 1

        while current_index < len(chain):
            block = chain[current_index]
            print(f'{last_block}')
            print(f'{block}')
            print("\n-----------\n")
            # Check that the hash of the block is correct
            last_block_hash = self.hash(last_block)
            if block['previous_hash'] != last_block_hash:
                return False

            # Check that the Proof of Work is correct
            if not self.valid_proof(last_block['proof'], block['proof'], last_block_hash):
                return False

            last_block = block
            current_index += 1

        return True

    def resolve_conflicts(self):
        """
        This is our consensus algorithm, it resolves conflicts
        by replacing our chain with the longest one in the network.

        :return: True if our chain was replaced, False if not
        """

        neighbours = self.nodes
        new_chain = None

        # We're only looking for chains longer than ours
        max_length = len(self.chain)

        # Grab and verify the chains from all the nodes in our network
        for node in neighbours:
            response = requests.get(f'http://{node}/chain')

            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']

                # Check if the length is longer and the chain is valid
                if length > max_length and self.valid_chain(chain):
                    max_length = length
                    new_chain = chain

        # Replace our chain if we discovered a new, valid chain longer than ours
        if new_chain:
            self.chain = new_chain
            return True

        return False

    def new_block(self, proof, previous_hash):
        """
        Create a new Block in the Blockchain

        :param proof: The proof given by the Proof of Work algorithm
        :param previous_hash: Hash of previous Block
        :return: New Block
        """

        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1]),
        }

        # Calculate block hash
        block_hash = self.hash(block)
        
        # Save block to database
        self.db.save_block(block, block_hash)

        # Reset the current list of transactions
        self.current_transactions = []

        self.chain.append(block)
        return block

    def new_transaction(self, sender, recipient, amount):
        """
        Creates a new transaction to go into the next mined Block

        :param sender: Address of the Sender
        :param recipient: Address of the Recipient
        :param amount: Amount
        :return: The index of the Block that will hold this transaction
        """
        self.current_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
        })

        return self.last_block['index'] + 1

    def calculate_balances(self):
        balances = {}
        for block in self.chain:
            for tx in block['transactions']:
                sender = tx['sender']
                recipient = tx['recipient']
                amount = tx.get('amount', 0)  # Default to 0 if amount is None
                if amount is None:
                    amount = 0
                if sender != "0":
                    balances[sender] = balances.get(sender, 0) - amount
                balances[recipient] = balances.get(recipient, 0) + amount
        return balances

    @property
    def last_block(self):
        return self.chain[-1]

    @staticmethod
    def hash(block):
        """
        Creates a SHA-256 hash of a Block

        :param block: Block
        """

        # We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def proof_of_work(self, last_block):
        """
        Simple Proof of Work Algorithm:

         - Find a number p' such that hash(pp') contains leading 4 zeroes
         - Where p is the previous proof, and p' is the new proof
         
        :param last_block: <dict> last Block
        :return: <int>
        """

        last_proof = last_block['proof']
        last_hash = self.hash(last_block)

        proof = 0
        while self.valid_proof(last_proof, proof, last_hash) is False:
            proof += 1

        return proof

    @staticmethod
    def valid_proof(last_proof, proof, last_hash):
        """
        Validates the Proof

        :param last_proof: <int> Previous Proof
        :param proof: <int> Current Proof
        :param last_hash: <str> The hash of the Previous Block
        :return: <bool> True if correct, False if not.

        """

        guess = f'{last_proof}{proof}{last_hash}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"


# Instantiate the Node

app = Flask(__name__)
CORS(app)

# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')

# Instantiate the Blockchain
blockchain = Blockchain()


# Root endpoint for API info
@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Welcome to the Blockchain API!',
        'endpoints': [
            '/mine',
            '/transactions/new',
            '/chain',
            '/nodes/register',
            '/nodes/resolve'
        ]
    }), 200

@app.route('/mine', methods=['GET'])
def mine():
    # We run the proof of work algorithm to get the next proof...
    last_block = blockchain.last_block
    proof = blockchain.proof_of_work(last_block)

    # We must receive a reward for finding the proof.
    # The sender is "0" to signify that this node has mined a new coin.
    blockchain.new_transaction(
        sender="0",
        recipient=node_identifier,
        amount=1,
    )

    # Forge the new Block by adding it to the chain
    previous_hash = blockchain.hash(last_block)
    block = blockchain.new_block(proof, previous_hash)

    response = {
        'message': "New Block Forged",
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash'],
    }
    return jsonify(response), 200


@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    values = request.get_json()

    # Check that the required fields are in the POST'ed data
    required = ['sender', 'recipient', 'amount']
    if not all(k in values for k in required):
        return 'Missing values', 400

    # Create a new Transaction
    index = blockchain.new_transaction(values['sender'], values['recipient'], values['amount'])

    response = {'message': f'Transaction will be added to Block {index}'}
    return jsonify(response), 201


@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain),
    }
    return jsonify(response), 200


@app.route('/nodes/register', methods=['POST'])
def register_nodes():
    values = request.get_json()

    nodes = values.get('nodes')
    if nodes is None:
        return "Error: Please supply a valid list of nodes", 400

    for node in nodes:
        blockchain.register_node(node)

    response = {
        'message': 'New nodes have been added',
        'total_nodes': list(blockchain.nodes),
    }
    return jsonify(response), 201


@app.route('/nodes/resolve', methods=['GET'])
def consensus():
    replaced = blockchain.resolve_conflicts()

    if replaced:
        response = {
            'message': 'Our chain was replaced',
            'new_chain': blockchain.chain
        }
    else:
        response = {
            'message': 'Our chain is authoritative',
            'chain': blockchain.chain
        }

    return jsonify(response), 200


# Endpoint to generate a new user ID
@app.route('/user/new', methods=['GET'])
def new_user():
    user_id = str(uuid4()).replace('-', '')
    return jsonify({'user_id': user_id, 'balance': 0}), 200


# Endpoint: earn rewards for a user by user_id (blockchain transaction + mine block)
@app.route('/rewards/earn', methods=['POST'])
def earn_rewards():
    values = request.get_json()
    user_id = values.get('user_id')
    amount = values.get('amount', 1)
    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400
    blockchain.new_transaction(sender="0", recipient=user_id, amount=amount)
    last_block = blockchain.last_block
    proof = blockchain.proof_of_work(last_block)
    previous_hash = blockchain.hash(last_block)
    blockchain.new_block(proof, previous_hash)
    balances = blockchain.calculate_balances()
    return jsonify({'message': f'{amount} token(s) added to user {user_id}', 'balance': balances.get(user_id, 0)}), 200


# Endpoint: spend rewards to buy items by user_id (blockchain transaction + mine block)
@app.route('/rewards/spend', methods=['POST'])
def spend_rewards():
    values = request.get_json()
    user_id = values.get('user_id')
    item = values.get('item')
    cost = values.get('cost', 1)
    if not user_id or not item:
        return jsonify({'error': 'Missing user_id or item'}), 400
    balances = blockchain.calculate_balances()
    balance = balances.get(user_id, 0)
    if balance < cost:
        return jsonify({'error': 'Insufficient balance'}), 400
    blockchain.new_transaction(sender=user_id, recipient="store", amount=cost)
    last_block = blockchain.last_block
    proof = blockchain.proof_of_work(last_block)
    previous_hash = blockchain.hash(last_block)
    blockchain.new_block(proof, previous_hash)
    balances = blockchain.calculate_balances()
    return jsonify({'message': f'User {user_id} bought {item} for {cost} token(s)', 'balance': balances.get(user_id, 0)}), 200


# Endpoint: get user balance by user_id (calculated from chain)
@app.route('/rewards/balance', methods=['GET'])
def get_balance():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400
    balances = blockchain.calculate_balances()
    balance = balances.get(user_id, 0)
    return jsonify({'user_id': user_id, 'balance': balance}), 200


if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)
