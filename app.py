from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
app = Flask(__name__)
CORS(app)
# MongoDB Connection
client = MongoClient("mongodb://localhost:27017")  # Replace with your connection string
db = client['qna_db']
users_collection = db['users']
questions_collection = db['questions']
comments_collection = db['comments']
# Add Admin User
def create_admin_user():
    admin_name="admin"
    admin_email = "admin@example.com"
    admin_password = "admin123"
    if not users_collection.find_one({"email": admin_email}):
        users_collection.insert_one({
            "name": admin_name,
            "email": admin_email,
            "password": admin_password,
            "is_admin": True
        })
        print("Admin user created successfully.")
    else:
        print("Admin user already exists.")
# Ensure Flask app starts after admin user creation
create_admin_user()
@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Check if the email or username already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    # Insert new user into the database
    users_collection.insert_one({
        "username": username,
        "email": email,
        "password": password,
        "is_admin": False
    })

    return jsonify({"message": "Signup successful!"})

# Login Route
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = users_collection.find_one({"email": email})
    if not user or user['password'] != password:
        return jsonify({"error": "Invalid credentials"}), 400
    return jsonify({
        "message": "Login successful!",
        "user": {
            "email": email,
            "is_admin": user.get("is_admin", False)
        }
    })
# Admin: View Pending Questions
@app.route('/admin/questions', methods=['GET'])
def view_pending_questions():
    questions = list(questions_collection.find({"approved": False}))
    # Convert ObjectId to string for each question
    for question in questions:
        question['_id'] = str(question['_id'])
    return jsonify({"pending_questions": questions})
# Admin: Approve Question
@app.route('/admin/questions/approve', methods=['POST'])
def approve_question():
    data = request.json
    question_id = data.get('question_id')
    result = questions_collection.update_one(
        {"_id": ObjectId(question_id)},
        {"$set": {"approved": True, "approved_at": datetime.utcnow()}}
    )
    if result.matched_count:
        return jsonify({"message": "Question approved successfully!"})
    return jsonify({"error": "Question not found"}), 404
# Admin: Reject Question
@app.route('/admin/questions/reject', methods=['POST'])
def reject_question():
    data = request.json
    question_id = data.get('question_id')
    result = questions_collection.delete_one({"_id": ObjectId(question_id)})
    if result.deleted_count:
        return jsonify({"message": "Question rejected successfully!"})
    return jsonify({"error": "Question not found"}), 404
# Admin: Delete Any Post
@app.route('/admin/posts/delete', methods=['POST'])
def delete_post():
    data = request.json
    post_id = data.get('post_id')
    result = questions_collection.delete_one({"_id": ObjectId(post_id)})
    if result.deleted_count:
        return jsonify({"message": "Post deleted successfully!"})
    return jsonify({"error": "Post not found"}), 404
# Add Search Functionality
@app.route('/questions/search', methods=['GET'])
def search_questions():
    query = request.args.get('query', '').strip()
    if not query:
        return jsonify({"error": "Search query is required"}), 400

    # Search by content or tag (case-insensitive)
    questions = list(questions_collection.find({
        "$and": [
            {"approved": True},
            {"$or": [
                {"content": {"$regex": query, "$options": "i"}},
                {"tag": {"$regex": query, "$options": "i"}}
            ]}
        ]
    }))
    for question in questions:
        question['_id'] = str(question['_id'])
    return jsonify({"questions": questions})

# Updated POST /questions to initialize likes and dislikes
@app.route('/questions', methods=['POST'])
def post_question():
    data = request.json
    user_id = data.get('user_id')
    content = data.get('content')
    if not user_id:
        return jsonify({"error": "User ID is missing"}), 400
    tag = data.get('tag')
    if not user_id or not content or not tag:
        return jsonify({"error": "Missing required fields"}), 400
    question = {
        "user_id": user_id,
        "content": content,
        "tag": tag,
        "approved": False,
        
    }
    result = questions_collection.insert_one(question)
    return jsonify({"message": "Question submitted successfully!", "question_id": str(result.inserted_id)})


# Route to Fetch Questions
@app.route('/questions', methods=['GET'])
def get_questions():
    questions = list(
        questions_collection.find({"approved": True}).sort("approved_at", -1)
    )
    for question in questions:
        question['_id'] = str(question['_id'])
    return jsonify({"questions": questions})
@app.route('/questions/pending/<user_id>', methods=['GET'])
def get_user_pending_questions(user_id):
    questions = list(questions_collection.find({"user_id": user_id, "approved": False}))
    for question in questions:
        question['_id'] = str(question['_id'])
    return jsonify({"pending_questions": questions})
@app.route('/comments', methods=['POST'])
def add_comment():
    data = request.json
    post_id = data.get('post_id')
    user_id = data.get('user_id')
    content = data.get('content')
    if not post_id or not user_id or not content:
        return jsonify({"error": "Missing required fields"}), 400
    comment = {
        "post_id": post_id,
        "user_id": user_id,
        "content": content,
        "created_at": datetime.utcnow()
    }
    result = comments_collection.insert_one(comment)
    return jsonify({"message": "Comment added successfully!", "comment_id": str(result.inserted_id)})
# Route to fetch comments for a specific post
@app.route('/comments/<post_id>', methods=['GET'])
def get_comments(post_id):
    comments = list(comments_collection.find({"post_id": post_id}))
    for comment in comments:
        comment['_id'] = str(comment['_id'])
        comment['created_at'] = comment['created_at'].isoformat()
    return jsonify({"comments": comments})
@app.route('/questions/edit', methods=['PUT'])
def edit_question():
    data = request.json
    question_id = data.get('question_id')
    user_id = data.get('user_id')
    new_content = data.get('content')
    new_tag = data.get('tag')
    if not question_id or not user_id or not new_content or not new_tag:
        return jsonify({"error": "Missing required fields"}), 400
    result = questions_collection.update_one(
        {"_id": ObjectId(question_id), "user_id": user_id},  # Ensure only the owner can edit
        {"$set": {"content": new_content, "tag": new_tag}}
    )
    if result.matched_count:
        return jsonify({"message": "Post updated successfully!"})
    return jsonify({"error": "Post not found or not authorized"}), 404
@app.route('/questions/delete', methods=['DELETE'])
def delete_question():
    data = request.json
    question_id = data.get('question_id')
    user_id = data.get('user_id')
    if not question_id or not user_id:
        return jsonify({"error": "Missing required fields"}), 400
    result = questions_collection.delete_one(
        {"_id": ObjectId(question_id), "user_id": user_id}  # Ensure only the owner can delete
    )
    if result.deleted_count:
        return jsonify({"message": "Post deleted successfully!"})
    return jsonify({"error": "Post not found or not authorized"}), 404
if __name__ == '__main__':
    app.run(debug=True, threaded=False)