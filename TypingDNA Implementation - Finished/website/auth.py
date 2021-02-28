from flask import Blueprint, render_template, make_response, request, flash, jsonify
from . import db
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
auth = Blueprint('auth', __name__)


@auth.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user:
        if not check_password_hash(user.password, password):
            return make_response(jsonify({'message': 'Password incorrect.'}), 401)

        return make_response(jsonify({'message': 'Login succesful', 'user_id': user.typing_id}), 200)
    else:
        return make_response(jsonify({'message': 'No user with that email.'}), 401)


@auth.route('/api/sign-up', methods=['POST'])
def api_sign_up():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user or len(email) < 4:
        return make_response(jsonify({'message': 'Sign up form invalid.'}), 401)
    else:
        new_user = User(email=email, password=generate_password_hash(
            password, method='sha256'))
        db.session.add(new_user)
        db.session.commit()
        return make_response(jsonify({'message': 'New user created.', 'user_id': new_user.typing_id}), 201)


@auth.route('/login')
def login():
    return render_template("login.html")


@auth.route('/sign-up')
def sign_up():
    return render_template("sign_up.html")
