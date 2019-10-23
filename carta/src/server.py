from flask import Flask, request
app = Flask('AggregationServer')

import aggregator

@app.route("/aggregate")
def aggregate():
    input = request.args.get('input')
    date = request.args.get('date')
    return aggregator.aggregate(input, date)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
