# playwright-csv-demo
Demo of fetching a CSV file and using it in a Playwright test

## Summary

This uses `axios` to fetch the CSV file and `csv-parse` to parse it into a list of objects.

Then, that data can be iterated over in the test.

If you have multiple tests which rely on the same CSV file, it may be faster to fetch the file before the test and reference it locally. Examples of both are included.