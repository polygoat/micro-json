Micro JSON for NodeJS
=====================

Lightweight utility to load/process/save JSON files

## Goals & Design

This small utility covers a `JsonStore` class for easy **loading and overwriting of json files** along with a couple of **helper functions** for easier JSON handling.
Look at this self-explanatory example:

```javascript
const { JsonStore } = require('micro-json');

const Users = new JsonStore('./user-registry.json');
/* user-registry.json before:
		[
			{
				"id": 999,
				"created": "2020-12-02 16:30:00"
			},
			...
		]
*/ 		

if(!Users.has('0.full_name')) {
	const first_user = Users[0];
	first_user.first_name = 'Bronco';
	first_user.larst_name = 'Mcfluffy';
	first_user.full_name = first_user.first_name + ' ' + first_user.last_name;
}

Users.save();

/* user-registry.json after:
		[
			{
				"id": 999,
				"created": "2020-12-02 16:30:00",
				"first_name": "Bronco",
				"last_name": "Mcfluffy"
			},
			...
		]
*/ 		

```

## Installation

In your terminal run:

```bash
$ npm i micro-json
```

## JsonStore methods

### load( [path] )
Either reloads a file from the path JsonStore has been instantiated with or from the path passed to `load`.

### save( [path] )
Either saves a file to the path this JsonStore has been loaded with or to the path passed to `save`.

### has( field )
Returns a boolean value indicating whether a certain value is included in the loaded JSON structure. Supports dot-path notation.

### expect( field, default_value )
Checks whether a field exists in the JSON structure and initiates it with the given default_value otherwise. Very useful when dealing with objects or arrays that need to be filled.
```javascript
const { JsonStore } = require('micro-json');
const Tasks = new JsonStore('tasks.json');

Tasks.expect('auth_tokens', []);
```

### clear()
Empties out the JSON structure. Combine with `save()` to truncate a JSON file.

## Helper functions

### load_json( path, default_value )
Shortcut method to load and parse JSON files.
```javascript
const { load_json } = require('micro-json');
const config = load_json('config/credentials.json', { 'some': 'defaultValue' });
```

### as_json( object, prettify=true )
Shortcut method to turn JS objects into JSON format
```javascript
const { as_json } = require('micro-json');
const response = as_json({ 'some': 'value' }, false);
```

### to_json( string, fallback )
Tries to parse `string` as JSON and returns `fallback` if it failed
```javascript
const { to_json } = require('micro-json');
const response_object = to_json('{!}', { error: 'broken JSON' });
```

### save_json
Shortcut method to save objects as JSON files.
```javascript
const { save_json } = require('micro-json');
save_json('tasks.json', tasks);
```