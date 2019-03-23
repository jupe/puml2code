import abc
"""
@package Interface Vehicle
"""
class Vehicle(abs.ABC):
    def __init__(self):
        """
        Constructor for Vehicle
        """
        pass


    @abc.abstractmethod
    def getType(self):
        """
        :return: String
        """
        return null

"""
@package Abstract Car
"""
class Car(Vehicle):
    def __init__(self):
        """
        Constructor for Car
        :param model: TBD
        :param make: TBD
        :param year: TBD
        """
        self.model = None
        self.make = None
        self.year = None

    def setModel(self, model):
        """
        :param model: TBD

        """
        pass
    def setMake(self, make):
        """
        :param make: TBD

        """
        pass
    def setYear(self, param0):
        """
        :param : TBD

        """
        pass
    def getModel(self):
        """
        :return: String
        """
        return null
    def getMake(self):
        """
        :return: String
        """
        return null
    def getYear(self):
        """
        :return: Number
        """
        return null

"""
@package NamesInThings
"""
class NamesInThings():
    def __init__(self):
        """
        Constructor for NamesInThings
        :param field: TBD
        :param field1: TBD
        :param _some_private: TBD
        :param field_2: TBD
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
        :return: String1
        """
        return null
    def member3(self):
        """

        """
        pass
    def _member_s(self):
        """
        :return: String2
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


