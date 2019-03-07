"""
@package Abstract Car
"""
class Car:
    def __init__(self):
        """
        Constructor for Car
        """
        self.model = None
        self.make = None
        self.year = None

    def setModel(self, model):
        """
        """
        pass

    def setMake(self, make):
        """
        """
        pass

    def setYear(self, param0):
        """
        """
        pass

    def getModel(self):
        """
        """
        return null

    def getMake(self):
        """
        """
        return null

    def getYear(self):
        """
        """
        return null


"""
@package NamesInThings
"""
class NamesInThings:
    def __init__(self):
        """
        Constructor for NamesInThings
        """
        self.field = None
        self.field1 = None
        self._some_private = None
        self.field_2 = None

    def member(self):
        """
        """
        pass

    def _member2(self):
        """
        """
        return null

    def member3(self):
        """
        """
        pass

    def _member_s(self):
        """
        """
        return null


"""
@package Toyota
"""
class Toyota(Car):
    def __init__(self):
        """
        Constructor for Toyota
        """
        pass


"""
@package Honda
"""
class Honda(Car):
    def __init__(self):
        """
        Constructor for Honda
        """
        pass


"""
@package Ford
"""
class Ford(Car):
    def __init__(self):
        """
        Constructor for Ford
        """
        pass


"""
@package Hyundai
"""
class Hyundai(Car):
    def __init__(self):
        """
        Constructor for Hyundai
        """
        pass


