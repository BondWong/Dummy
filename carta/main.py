import argparse
import os
import requests
import datetime

ap = argparse.ArgumentParser()
ap.add_argument("-i", "--input", required=True,
   help="input file name, e.g test.txt")
ap.add_argument("-d", "--date", required=False,
   help="a date to filter investment records")
args = vars(ap.parse_args())

if __name__ == "__main__":
    file_path = args['input']
    date = args['date']

    today = datetime.date.today().strftime('%Y-%m-%d')
    date = today if date == None else date
    url = 'http://127.0.0.1:5000/aggregate?input={}&date={}'.format(file_path, date)
    res = requests.get(url)
    print(res.json())
