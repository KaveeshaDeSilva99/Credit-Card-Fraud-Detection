import os  # Add this line to import the os module
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from bson import ObjectId, json_util  # Add json_util import
import pickle
from sentence_transformers import SentenceTransformer
from datetime import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_cors import CORS
import json
import pandas as pd
from flask import jsonify
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from bson import ObjectId
import json
import pandas as pd
from flask_cors import CORS
import stripe

# Set your secret key. Remember to switch to your live secret key in production.
stripe.api_key = 'sk_test_51P8umyBxihc4xLBtGvdZ9PQm7GgBUMRzsnVhQR7XRi6hBtbQeVxPm2tPBDGsuyJPPNXU0GafIAcUmyR47j9ltvly00ceoLOCwL'

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Generate a random secret key
secret_key = os.urandom(24)
app.secret_key = secret_key

login_manager = LoginManager()
login_manager.init_app(app)

client = MongoClient("mongodb+srv://pasindu:pasindu@cluster0.gzomo.mongodb.net/")
db = client["fraud"]
trained_data_collection = db["trained_data"]
prediction_data_collection = db["prediction_data"]
users_collection = db["users"]

class User(UserMixin):
    def __init__(self, username):
        self.id = username

@login_manager.user_loader
def load_user(user_id):
    user = users_collection.find_one({"_id": user_id})
    if not user:
        return None
    return User(user["_id"])

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user_type = data.get('user_type')  # 'admin' or 'client'

    if not username or not password or not user_type:
        return jsonify({'error': 'Username, password, and user_type are required.'}), 400

    existing_user = users_collection.find_one({'_id': username})
    if existing_user:
        return jsonify({'error': 'User already exists.'}), 400

    hashed_password = generate_password_hash(password)
    user_data = {
        "_id": username,
        "password": hashed_password,
        "user_type": user_type
    }
    users_collection.insert_one(user_data)
    return jsonify({'message': 'User created successfully.'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Authenticate user and get user_type from database
    # Assuming you fetch user_type from database based on username
    user = users_collection.find_one({"_id": username})
    if user and check_password_hash(user["password"], password):
        user_type = user.get("user_type", "")
        # Change this line to get username correctly
        username = user.get("_id", "")
        return jsonify({'message': 'Login successful.', 'username': username, 'user_type': user_type}), 200
    else:
        return jsonify({'error': 'Invalid username or password.'}), 401

@app.route('/logout')
def logout():
    # Your logout logic here (e.g., clearing session data)
    return jsonify({'message': 'Logged out successfully.'}), 200

# Protected route example
@app.route('/protected')
@login_required
def protected_route():
    return jsonify({'message': 'This is a protected route.'}), 200

# client = MongoClient("mongodb+srv://kaveeshas826:kaveeshas826@cluster0.od66xl0.mongodb.net/")
# db = client["fraud"]
# trained_data_collection = db["trained_data"]
# prediction_data_collection = db["prediction_data"]

if trained_data_collection.count_documents({}) == 0:
    # Load the training dataset
    trained_data = pd.read_csv('Updated_Data.csv')

    # Add a 'status' field with value 'valid' to each training data row
    # training_data['status'] = 'valid'
    
    # Convert each row of the training dataset into a dictionary and store them in MongoDB
    for index, row in trained_data.iterrows():
        trained_data_collection.insert_one(row.to_dict())

with open('weights/fraud-detection.pickle', 'rb') as f:
    rfc = pickle.load(f)

model = SentenceTransformer('sentence-transformers/paraphrase-MiniLM-L6-v2')

def compile_text(x):
    text = f"""NIC: {x['NIC']},
                Bank account number: {x['Bank account number']},
                Credit card number: {x['Credit card number']}
            """
    return text

def inference_fraud(sample_embedding):
    prediction = rfc.predict(sample_embedding)
    return prediction[0]

def send_email(sender_email, prediction_data, password):
    # Extract receiver email address from prediction data
    receiver_email = prediction_data.get('Additional Data', {}).get('Email Address', '')

    if receiver_email:
        # Create message container
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver_email
        msg['Subject'] = 'Payment Confirmation'

        # Email body
        prediction_label = prediction_data.get('Prediction', 'No prediction available')
        body = f'Your payment has been {prediction_label}.'
        msg.attach(MIMEText(body, 'plain'))

        # Create SMTP session
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, password)

        # Convert message to string and send
        text = msg.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()
    else:
        print("Receiver email address not found in additional data.")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        credit_card_number = request.json.get('Credit card number', '')
        bank_account_number = request.json.get('Bank account number', 0)
        nic = request.json.get('NIC', '')
        
        # New variables to retrieve
        company_name = request.json.get('Company name', '')
        company_address = request.json.get('Company address', '')
        company_contact = request.json.get('Company contact', '')
        company_registration = request.json.get('Company registration', '')
        
        tender_reference = request.json.get('Tender reference number', '')
        tender_title = request.json.get('Tender title', '')
        tender_instructions = request.json.get('Tender instructions', '')
        
        bidder_name = request.json.get('Bidder name', '')
        bidder_position = request.json.get('Bidder position', '')
        bidder_contact = request.json.get('Bidder contact', '')
        
        bid_price = request.json.get('Bid price', '')
        
        references = request.json.get('References', '')
        # terms_conditions = request.json.get('Terms and conditions', '')
        
        # # Retrieve files
        # attachments = request.files.getlist('Attachments')
        
        additional_data = trained_data_collection.find_one({'Credit card number': credit_card_number, 'Bank account number': bank_account_number, 'NIC': nic})
        
        prediction_id = ObjectId()
        
        prediction_data = {
            '_id': prediction_id,
            'Credit card number': credit_card_number,
            'Bank account number': bank_account_number,
            'NIC': nic,
            'Company name': company_name,
            'Company address': company_address,
            'Company contact': company_contact,
            'Company registration': company_registration,
            'Tender reference number': tender_reference,
            'Tender title': tender_title,
            'Tender instructions': tender_instructions, 
            'Bidder name': bidder_name,
            'Bidder position': bidder_position,
            'Bidder contact': bidder_contact,
            'Bid price': bid_price,
            'References': references,
            # 'Terms and conditions': terms_conditions,
            # 'Attachments': [],
            'Additional Data': additional_data,
            'Prediction': None,
            'Timestamp': datetime.now()  # Add timestamp
        }
        
        if additional_data is not None:
            sample_embedding = model.encode([compile_text(additional_data)], show_progress_bar=True, normalize_embeddings=True)
            prediction = inference_fraud(sample_embedding)
            prediction_label = 'valid' if prediction == 0 else 'invalid'
            prediction_data['Prediction'] = prediction_label
        
        # Define the directory to save files
        save_dir = 'fraud-detection/uploads'

        # Create the directory if it doesn't exist
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        
        prediction_data_collection.insert_one(prediction_data)

        send_email('kaveeshas826@gmail.com', prediction_data, 'kicz zrnd xkwp mkih')
        return jsonify({'prediction': prediction_label})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        data = request.json
        amount = data.get('amount', 2000)  # Default amount to 2000 cents if not provided

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': 'Tender Payment',
                        },
                        'unit_amount': amount,  # amount in cents
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url='http://localhost:3000/',
            cancel_url='http://localhost:3000/',
        )
        return jsonify({'id': session.id})
    except Exception as e:
        return jsonify(error=str(e)), 403

@app.route('/prediction_data', methods=['GET'])
def get_prediction_data():
    try:
        prediction_data = list(prediction_data_collection.find())
        
        # Convert ObjectId to string and format Timestamp
        formatted_data = []
        for item in prediction_data:
            additional_data = {}
            if item.get('Additional Data'):
                
                additional_data['Social security number'] = item['Additional Data'].get('Social security number')
                additional_data['Card holder name'] = item['Additional Data'].get('Card holder name')
                additional_data['Email Address'] = item['Additional Data'].get('Email Address')
                additional_data['Phone number'] = item['Additional Data'].get('Phone number')
                additional_data['Address'] = item['Additional Data'].get('Address')
                additional_data['Sexual orientation'] = item['Additional Data'].get('Sexual orientation')
                additional_data['Political affiliation'] = item['Additional Data'].get('Political affiliation')
                additional_data['Union membership'] = item['Additional Data'].get('Union membership')
                additional_data['Race or ethnicity'] = item['Additional Data'].get('Race or ethnicity')
                additional_data['purchase history'] = item['Additional Data'].get('purchase history')
            
            formatted_item = {
                '_id': str(item['_id']),
                'Credit card number': item.get('Credit card number'),
                'Bank account number': item.get('Bank account number'),
                'NIC': item.get('NIC'),
                'Additional Data': additional_data,
                'Prediction': item.get('Prediction'),
                'Timestamp': item['Timestamp'].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
            }
            formatted_data.append(formatted_item)
        
        return jsonify(formatted_data)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)