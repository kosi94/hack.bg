import hashlib
m = hashlib.sha256()
nonce = 0
while True:
    m = hashlib.sha256()
    m.update(b"ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb")
    #m.update(b'%i' %nonce)
    nonce = nonce + 1
    print(m.hexdigest())
    break
    if (m.hexdigest()[0:5]) == "00000":
        print(m.hexdigest())
        print(nonce)
        break