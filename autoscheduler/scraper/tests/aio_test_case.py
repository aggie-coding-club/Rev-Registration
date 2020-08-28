""" Definitions for asynchronous test cases that are subclasses of django.test.TestCase
    and unittest.TestCase.

    Allows for defining test functions that are async. To use, simply set the test class
    as a subclass as one of the two,

    Retrieved from: https://stackoverflow.com/a/37888085/4381227
"""

import unittest
import asyncio
import django.test

class AioTestCase(unittest.TestCase):
    """ Allows for asynchronous test function declarations for unittest tests """

    def __init__(self, methodName='runTest', loop=None):
        self.loop = loop or asyncio.get_event_loop()
        self._function_cache = {}
        super().__init__(methodName=methodName)

    def coroutine_function_decorator(self, func):
        """ Wraps the function in an event loop """
        def wrapper(*args, **kw):
            return self.loop.run_until_complete(func(*args, **kw))
        return wrapper

    def __getattribute__(self, item):
        """ Adds the tests functions to the function_cache """
        attr = object.__getattribute__(self, item)
        if asyncio.iscoroutinefunction(attr):
            if item not in self._function_cache:
                self._function_cache[item] = self.coroutine_function_decorator(attr)
            return self._function_cache[item]
        return attr

class AioDjangoTestCase(django.test.TestCase):
    """ Allows for asynchronous test function declarations for Django tests """

    def __init__(self, methodName='runTest', loop=None):
        self.loop = loop or asyncio.get_event_loop()
        self._function_cache = {}
        super().__init__(methodName=methodName)

    def coroutine_function_decorator(self, func):
        """ Wraps the function in an event loop """
        def wrapper(*args, **kw):
            return self.loop.run_until_complete(func(*args, **kw))
        return wrapper

    def __getattribute__(self, item):
        """ Adds the tests functions to the function_cache """
        attr = object.__getattribute__(self, item)
        if asyncio.iscoroutinefunction(attr):
            if item not in self._function_cache:
                self._function_cache[item] = self.coroutine_function_decorator(attr)
            return self._function_cache[item]
        return attr
