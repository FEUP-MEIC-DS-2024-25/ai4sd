import unittest
from code_file import contas

class TestAdd(unittest.TestCase):
    def test_add(self):
        self.assertEqual(contas(2, 3), 4)

if __name__ == '__main__':
    unittest.main()
