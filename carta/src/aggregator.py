import pandas as pd
import numpy as np
import json

from models import Ownership, Investment

def aggregate(input_file, date):
    df = pd.read_csv('./input/' + input_file, header=None)
    df.columns = ['date', 'shares', 'cash_raised', 'investor']
    df = df[df['date'] < date]

    total_share = df['shares'].sum()
    total_cash_raised = df['cash_raised'].sum()

    e = pd.Series(np.random.randn(len(df['date'])))
    df['ownership'] = df['shares'].map(lambda share: round(share / total_share * 100, 2))
    df_sum = df.groupby('investor').sum()

    def reduce(row, investment):
        ownership = Ownership(row.name, row['shares'], row['cash_raised'], row['ownership'])
        investment.ownership.append(ownership)
        return investment

    investment = Investment(date, total_share, total_cash_raised)
    df_sum.apply(reduce, axis=1, args=[investment])

    return json.dumps(investment.toJSON(), indent=4, separators=(',',':'))
