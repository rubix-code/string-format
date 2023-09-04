# String-Format
[![semantic-release: eslint](https://img.shields.io/badge/semantic--release-eslint-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![codecov](https://codecov.io/gh/rubix-code/string-format/graph/badge.svg?token=0CM91KRJW6)](https://codecov.io/gh/rubix-code/string-format)
[![npm version](https://badge.fury.io/js/%40rubix-code%2Fstring-format.svg)](https://badge.fury.io/js/%40rubix-code%2Fstring-format)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Highly functional and extensible string formatting library for JS.

## Inspiration
This repo is inspired by the following libraries:
- [string-format-js](https://github.com/tmaeda1981jp/string-format-js)
- [string-format](https://github.com/davidchambers/string-format)
- [pyformat](https://github.com/tamzinblake/pyformat)

All of this libraries are great in their own way. But installing them individually can be tedious. Also, they are not extensible, and have not been maintained for quite some time.

This library aims to provide a single library that can be used to format strings in a variety of ways. It also aims to be extensible, so that you can add your own custom formatters.

## Installation
```bash
npm install @rubix-code/string-format
```
## Usage

### Basic Usage
```ts
// Globally apply the default formatters
import "@rubix-code/string-format";

// Python style formatting
"My name is {name}".format({ name: "Slim Shady" }); // My name is Slim Shady

// C++ style formatting
"The answer to life, the universe and everything is %d".format(42); // The answer to life, the universe and everything is 42
```
