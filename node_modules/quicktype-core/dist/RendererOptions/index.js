"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumOption = exports.StringOption = exports.BooleanOption = exports.Option = void 0;
exports.getOptionValues = getOptionValues;
const Messages_1 = require("../Messages");
const Support_1 = require("../support/Support");
__exportStar(require("./types"), exports);
/**
 * The superclass for target language options.  You probably want to use one of its
 * subclasses, `BooleanOption`, `EnumOption`, or `StringOption`.
 */
class Option {
    constructor(definition) {
        this.definition = definition;
        (0, Support_1.assert)(definition.kind !== undefined, "Renderer option kind must be defined");
    }
    get name() {
        return this.definition.name;
    }
    getValue(values) {
        var _a;
        return ((_a = values[this.name]) !== null && _a !== void 0 ? _a : this.definition.defaultValue);
    }
    get cliDefinitions() {
        return { actual: [this.definition], display: [this.definition] };
    }
}
exports.Option = Option;
function getOptionValues(options, untypedOptionValues) {
    const optionValues = {};
    for (const [key, option] of Object.entries(options)) {
        const value = option.getValue(untypedOptionValues);
        if (option instanceof EnumOption) {
            optionValues[key] = option.getEnumValue(value);
        }
        else {
            optionValues[key] = value;
        }
    }
    return optionValues;
}
/**
 * A target language option that allows setting a boolean flag.
 */
class BooleanOption extends Option {
    /**
     * @param name The shorthand name.
     * @param description Short-ish description of the option.
     * @param defaultValue The default value.
     * @param kind Whether it's a primary or secondary option.
     */
    constructor(name, description, defaultValue, kind = "primary") {
        super({
            name,
            kind,
            optionType: "boolean",
            description,
            defaultValue,
        });
    }
    get cliDefinitions() {
        const negated = Object.assign({}, this.definition, {
            name: `no-${this.name}`,
            defaultValue: !this.definition.defaultValue,
        });
        const display = Object.assign({}, this.definition, {
            name: `[no-]${this.name}`,
            description: `${this.definition.description} (${this.definition.defaultValue ? "on" : "off"} by default)`,
        });
        return {
            display: [display],
            actual: [this.definition, negated],
        };
    }
    getValue(values) {
        let value = values[this.name];
        if (value === undefined) {
            value = this.definition.defaultValue;
        }
        let negated = values[`no-${this.name}`];
        if (negated === undefined) {
            negated = !this.definition.defaultValue;
        }
        if (value === "true") {
            value = true;
        }
        else if (value === "false") {
            value = false;
        }
        if (this.definition.defaultValue) {
            return (value && !negated);
        }
        return (value || !negated);
    }
}
exports.BooleanOption = BooleanOption;
class StringOption extends Option {
    constructor(name, description, typeLabel, defaultValue, kind = "primary") {
        super({
            name,
            kind,
            optionType: "string",
            description,
            typeLabel,
            defaultValue,
        });
    }
}
exports.StringOption = StringOption;
class EnumOption extends Option {
    constructor(name, description, values, defaultValue, kind = "primary") {
        super({
            name,
            kind,
            optionType: "enum",
            description,
            typeLabel: Object.keys(values).join("|"),
            defaultValue,
            values,
        });
        this._values = values;
    }
    getEnumValue(name) {
        if (!name) {
            const defaultKey = this.definition.defaultValue;
            return this._values[defaultKey];
        }
        if (!(name in this._values)) {
            return (0, Messages_1.messageError)("RendererUnknownOptionValue", {
                value: name,
                name: this.name,
            });
        }
        return this._values[name];
    }
}
exports.EnumOption = EnumOption;
