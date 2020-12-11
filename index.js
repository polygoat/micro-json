const _ = require('lodash');
const fs = require('fs');

const as_json = (obj, pretty=true) => JSON.stringify(obj, null, pretty ? 4 : null);

const to_json = (input, fallback) => {
	try {
		return JSON.parse(input);
	} catch(error) {
		return error;
	}
	return fallback;
};

const load_json = (path, fallback=false) => {
	if(fs.existsSync(path)) {
		let content = fs.readFileSync(path).toString();
		try {
			content = JSON.parse(content);
		} catch(error) {
			return { error: `File "${path}" could not be parsed.` };
		}
		return content;
	}
	return fallback || {
		error: `Could not find "${path}".`
	};
};

const save_json = (path, obj, pretty=true) => fs.writeFileSync(path, JSON.stringify(obj, null, pretty ? 4 : null));

class JsonStore {
	changed = false;
	storage = {};
	path = '';

	constructor(path) {
		this.path = path;
		this.load(path);

		const self = new Proxy(this, this);
		return self;
	}

	load(path=false) { 
		this.set(this, 'path', path || this.path);
		this.clear();
		if(this.path && this.path.length) {
			this.set(this, 'storage', load_json(this.path, {}));
		}
		this.changed = false;
		return this;
	}

	save(path=false, storage=false, pretty=true) { 
		this.set(this, 'path', path || this.path);
		if(storage) {
			this.set(this, 'storage', storage);
		}
		if(this.path && this.path.length) {
			save_json(this.path, this.storage, pretty);
		}
		this.changed = false;
		return this;
	}

	clear() {
		this.set(this, 'storage', {});
		return this;
	}

	get(self, field) {
		const value = _.get(self, field);
		if(value) {
			return value;
		}
		return _.get(self.storage, field);
	}

	set(self, field, value) {
		if(_.get(self, field)) {
			_.set(self, field, value);
		} else {
			_.set(self.storage, field, value);
			this.changed = true;
		}
		return true;
	}

	has(field) {
		return _.has(this.storage, field);
	}

	expect(field, default_value) {
		if(!this.has(field)) {
			this.set(this, field, default_value);
		}
		return this;
	}

	toString() {
		return String(this.storage);
	}
};

module.exports = { as_json, to_json, load_json, save_json, JsonStore };