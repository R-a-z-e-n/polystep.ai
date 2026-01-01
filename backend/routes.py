from flask import Blueprint, jsonify, request
from backend.app import db
from backend.models import User, Vocabulary

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or 'username' not in data:
        return jsonify({'error': 'Username is required'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 409
        
    new_user = User(username=data['username'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@bp.route('/vocabulary', methods=['GET'])
def get_vocabulary():
    vocab_list = Vocabulary.query.all()
    return jsonify([v.to_dict() for v in vocab_list])

@bp.route('/vocabulary', methods=['POST'])
def add_vocabulary():
    data = request.get_json()
    required = ['word', 'translation']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400
        
    new_vocab = Vocabulary(
        word=data['word'],
        translation=data['translation'],
        example=data.get('example', ''),
        source=data.get('source', 'manual')
    )
    db.session.add(new_vocab)
    db.session.commit()
    return jsonify(new_vocab.to_dict()), 201
