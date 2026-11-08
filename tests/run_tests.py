"""
Master Test Runner for Portfolio Automated Test Suite
Runs all test modules, summarizes execution metrics, and sets exit code for CI/CD.
"""

import os
import sys
import time
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TESTS_DIR = os.path.join(ROOT_DIR, "tests")


def run_all_tests():
    start_time = time.time()

    loader = unittest.TestLoader()
    suite = loader.discover(start_dir=TESTS_DIR, pattern="test_*.py")

    stream = unittest.runner._WritelnDecorator(sys.stdout)
    runner = unittest.TextTestRunner(stream=stream, verbosity=1)

    print("\n" + "=" * 65)
    print("  JOSUE TORRES SIBAJA - PORTFOLIO AUTOMATED TEST SUITE")
    print("=" * 65)
    print(f" Discovering and running tests in: {TESTS_DIR}")
    print("-" * 65)

    result = runner.run(suite)
    elapsed = time.time() - start_time

    print("-" * 65)
    print("  TEST EXECUTION SUMMARY")
    print("-" * 65)
    print(f"  Total Tests Run : {result.testsRun}")
    print(f"  Passed          : {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"  Failures        : {len(result.failures)}")
    print(f"  Errors          : {len(result.errors)}")
    print(f"  Skipped         : {len(result.skipped)}")
    print(f"  Total Time      : {elapsed:.3f} seconds")
    print("=" * 65)

    if result.wasSuccessful():
        print("  >>> OVERALL RESULT: ALL TESTS PASSED SUCCESSFULLY (100%) <<<")
        print("=" * 65 + "\n")
        sys.exit(0)
    else:
        print("  >>> OVERALL RESULT: TEST SUITE FAILED <<<")
        print("=" * 65 + "\n")
        sys.exit(1)


if __name__ == "__main__":
    run_all_tests()
