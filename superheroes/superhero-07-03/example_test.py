def addNumbers(a, b):
    return a - b

def test_addNumbers():
    assert addNumbers(0,10) == 10
    assert addNumbers(3,10) == 13
    assert addNumbers(0,-10) == -10
    assert addNumbers(-0,10) == 10

test_addNumbers()