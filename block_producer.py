from _sha256 import sha256
import time
import datetime
import operator


list_with_blocks = []

class Block:
    def __init__(self, data):
        self.data = data
        self.timestamp = time.time()
        if len(list_with_blocks) != 0:

            last_blok = list_with_blocks[-1]
            self.hash = sha256(bytes(last_blok.hash.hexdigest() + last_blok.data, encoding="utf-8"))

        else:
            self.hash = sha256("a".encode('utf-8'))

        self.last = None
        list_with_blocks.append(self)

    def __repr__(self):
        return self.data

def find_by_time(time, relation):
    #2020-07-10 15:00:00.000
    time = datetime.datetime.fromisoformat(time)

    ops = {'>': operator.gt,
           '<': operator.lt,
           '>=': operator.ge,
           '<=': operator.le,
           '==': operator.eq}
    
    for blok in list_with_blocks:
        if ops[relation](blok.timestamp, time.timestamp()):
            print(blok)


first_Block = Block("a")
second_Block = Block("b")
third_Block = Block("c")
first_Block.last = second_Block
second_Block.last = third_Block

find_by_time("2022-06-01", ">")
