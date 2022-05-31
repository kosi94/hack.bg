from _sha256 import sha256
from ecdsa import SigningKey, SECP256k1, VerifyingKey

privatekey = SigningKey.generate(curve=SECP256k1, hashfunc=sha256)
publickey = privatekey.verifying_key

print(privatekey.to_string().hex())

publ=publickey.to_string()
print(publ.hex())

vk2 = VerifyingKey.from_string(publ, curve=SECP256k1)
print(vk2)
signature = privatekey.sign(b"Message for ECDSA signing")
assert publickey.verify(signature, b"Message for ECDSA signing")

