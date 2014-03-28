import traceback

from cartodb import CartoDBAPIKey, CartoDBException
from flask import Flask, request

app = Flask(__name__)
app.config.from_object('default_config')
app.config.from_envvar('BERLIN_SETTINGS')


@app.route('/new-squat', methods=['POST'])
def new_squat():
    def value_to_db(value):
        if value == 'on':
            value = 'Yes'
        return "'%s'" % value.replace("'", "''")

    cl = CartoDBAPIKey(app.config.get('CARTODB_APIKEY'),
                       app.config.get('CARTODB_USER'))
    try:
        keys = request.form.keys()
        sql = 'INSERT INTO %s (%s) VALUES (%s)' % (
            app.config.get('CARTODB_TABLE'),
            ','.join(keys + ['needs_moderation',]),
            ','.join([value_to_db(request.form.get(k)) for k in keys] + ['true',]),
        )
        cl.sql(sql)
    except CartoDBException:
        traceback.print_exc()
    response = app.make_response('OK')
    if app.config.get('DEBUG'):
        response.headers['Access-Control-Allow-Origin'] = '*'
    return response


if __name__ == '__main__':
    app.run()
