"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CirceRenderer = void 0;
const TypeUtils_1 = require("../../Type/TypeUtils");
const Scala3Renderer_1 = require("./Scala3Renderer");
const utils_1 = require("./utils");
class CirceRenderer extends Scala3Renderer_1.Scala3Renderer {
    constructor() {
        super(...arguments);
        this.seenUnionTypes = [];
    }
    circeEncoderForType(t, __ = false, noOptional = false, paramName = "") {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => ["Encoder.encodeJson(", paramName, ")"], (_nullType) => ["Encoder.encodeNone(", paramName, ")"], (_boolType) => ["Encoder.encodeBoolean(", paramName, ")"], (_integerType) => ["Encoder.encodeLong(", paramName, ")"], (_doubleType) => ["Encoder.encodeDouble(", paramName, ")"], (_stringType) => ["Encoder.encodeString(", paramName, ")"], (arrayType) => [
            "Encoder.encodeSeq[",
            this.scalaType(arrayType.items),
            "].apply(",
            paramName,
            ")",
        ], (classType) => [
            "Encoder.AsObject[",
            this.scalaType(classType),
            "].apply(",
            paramName,
            ")",
        ], (mapType) => [
            "Encoder.encodeMap[String,",
            this.scalaType(mapType.values),
            "].apply(",
            paramName,
            ")",
        ], (_) => ["Encoder.encodeString(", paramName, ")"], (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null) {
                if (noOptional) {
                    return [
                        "Encoder.AsObject[",
                        this.nameForNamedType(nullable),
                        "]",
                    ];
                }
                return [
                    "Encoder.AsObject[Option[",
                    this.nameForNamedType(nullable),
                    "]]",
                ];
            }
            return [
                "Encoder.AsObject[",
                this.nameForNamedType(unionType),
                "]",
            ];
        });
    }
    emitEmptyClassDefinition(c, className) {
        this.emitDescription(this.descriptionForType(c));
        this.ensureBlankLine();
        this.emitLine("case class ", className, "()  derives Encoder.AsObject, Decoder");
    }
    anySourceType(optional) {
        return [(0, utils_1.wrapOption)("Json", optional)];
    }
    emitClassDefinitionMethods() {
        this.emitLine(") derives Encoder.AsObject, Decoder");
    }
    emitEnumDefinition(e, enumName) {
        this.emitDescription(this.descriptionForType(e));
        this.ensureBlankLine();
        this.emitItem(["type ", enumName, " = "]);
        let count = e.cases.size;
        this.forEachEnumCase(e, "none", (_, jsonName) => {
            // if (!(jsonName == "")) {
            /*                 const backticks =
                                                            shouldAddBacktick(jsonName) ||
                                                            jsonName.includes(" ") ||
                                                            !isNaN(parseInt(jsonName.charAt(0)))
                                                    if (backticks) {this.emitItem("`")} else  */
            this.emitItem(['"', jsonName, '"']);
            //                if (backticks) {this.emitItem("`")}
            if (--count > 0)
                this.emitItem([" | "]);
            // } else {
            // --count
            // }
        });
        this.ensureBlankLine();
    }
    emitHeader() {
        super.emitHeader();
        this.emitLine("import scala.util.Try");
        this.emitLine("import io.circe.syntax._");
        this.emitLine("import io.circe._");
        this.emitLine("import cats.syntax.functor._");
        this.ensureBlankLine();
        this.emitLine("// For serialising string unions");
        this.emitLine("given [A <: Singleton](using A <:< String): Decoder[A] = Decoder.decodeString.emapTry(x => Try(x.asInstanceOf[A])) ");
        this.emitLine("given [A <: Singleton](using ev: A <:< String): Encoder[A] = Encoder.encodeString.contramap(ev) ");
        this.ensureBlankLine();
        this.emitLine("// If a union has a null in, then we'll need this too... ");
        this.emitLine("type NullValue = None.type");
    }
    emitTopLevelArray(t, name) {
        super.emitTopLevelArray(t, name);
        const elementType = this.scalaType(t.items);
        this.emitLine([
            "given (using ev : ",
            elementType,
            "): Encoder[Map[String,",
            elementType,
            "]] = Encoder.encodeMap[String, ",
            elementType,
            "]",
        ]);
    }
    emitTopLevelMap(t, name) {
        super.emitTopLevelMap(t, name);
        const elementType = this.scalaType(t.values);
        this.ensureBlankLine();
        this.emitLine([
            "given (using ev : ",
            elementType,
            "): Encoder[Map[String, ",
            elementType,
            "]] = Encoder.encodeMap[String, ",
            elementType,
            "]",
        ]);
    }
    emitUnionDefinition(u, unionName) {
        function sortBy(t) {
            const kind = t.kind;
            if (kind === "class")
                return kind;
            return "_" + kind;
        }
        this.emitDescription(this.descriptionForType(u));
        const [maybeNull, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(u, sortBy);
        const theTypes = [];
        this.forEachUnionMember(u, nonNulls, "none", null, (_, t) => {
            theTypes.push(this.scalaType(t));
        });
        if (maybeNull !== null) {
            theTypes.push(this.nameForUnionMember(u, maybeNull));
        }
        this.emitItem(["type ", unionName, " = "]);
        theTypes.forEach((t, i) => {
            this.emitItem(i === 0 ? t : [" | ", t]);
        });
        const thisUnionType = theTypes
            .map((x) => this.sourcelikeToString(x))
            .join(" | ");
        this.ensureBlankLine();
        if (!this.seenUnionTypes.some((y) => y === thisUnionType)) {
            this.seenUnionTypes.push(thisUnionType);
            const sourceLikeTypes = [];
            this.forEachUnionMember(u, nonNulls, "none", null, (_, t) => {
                sourceLikeTypes.push([this.scalaType(t), t]);
            });
            if (maybeNull !== null) {
                sourceLikeTypes.push([
                    this.nameForUnionMember(u, maybeNull),
                    maybeNull,
                ]);
            }
            this.emitLine(["given Decoder[", unionName, "] = {"]);
            this.indent(() => {
                this.emitLine(["List[Decoder[", unionName, "]]("]);
                this.indent(() => {
                    sourceLikeTypes.forEach((t) => {
                        this.emitLine(["Decoder[", t[0], "].widen,"]);
                    });
                });
                this.emitLine(").reduceLeft(_ or _)");
            });
            this.emitLine(["}"]);
            this.ensureBlankLine();
            this.emitLine([
                "given Encoder[",
                unionName,
                "] = Encoder.instance {",
            ]);
            this.indent(() => {
                sourceLikeTypes.forEach((t, i) => {
                    const paramTemp = `enc${i.toString()}`;
                    this.emitLine([
                        "case ",
                        paramTemp,
                        " : ",
                        t[0],
                        " => ",
                        this.circeEncoderForType(t[1], false, false, paramTemp),
                    ]);
                });
            });
            this.emitLine("}");
        }
    }
}
exports.CirceRenderer = CirceRenderer;
