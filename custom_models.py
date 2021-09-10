from flask import Flask, render_template, request, redirect
from werkzeug.utils import secure_filename
import os
import db

path = "data/custom_modules/"
app = Flask(__name__)
app.config['UPLOAD_FILES'] = path
allowed_extensions = ['py']


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions


#TODO: Сам допишешь url как на js сделаешь загрузку
@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FILES'], filename))
#ну и тут че возвращать будет я тоже хз у меня на тесте был upload.html
    return 0


if __name__ == '__main__':
    app.run(debug=True)