class JSONSerializable:
    def toJSON(self):
        pass

class Ownership(JSONSerializable):
    def __init__(self, investor, shares, cash_paid, ownership):
        self.investor = investor
        self.shares = shares
        self.cash_paid = cash_paid
        self.ownership = ownership

    def toJSON(self):
        return {
            "investor": self.investor,
            "shares": int(self.shares),
            "cash_paid": float(self.cash_paid),
            "ownership": float(self.ownership)
        }

class Investment(JSONSerializable):
    def __init__(self, date, total_number_of_shares, cash_raised):
        self.date = date
        self.total_number_of_shares = total_number_of_shares
        self.cash_raised = cash_raised
        self.ownership = []

    def toJSON(self):
        output = {}
        segments = self.date.split('-')
        output['date'] = '/'.join([segments[1], segments[2], segments[0]])
        output['total_number_of_shares'] = float(self.total_number_of_shares)
        output['cash_raised'] = int(self.cash_raised)
        output['ownership'] = [o.toJSON() for o in self.ownership]
        return output
