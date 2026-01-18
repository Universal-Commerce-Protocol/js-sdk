"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaLegacyDateTimeProvider = exports.Java8DateTimeProvider = exports.JavaDateTimeProvider = void 0;
class JavaDateTimeProvider {
    constructor(_renderer, _className) {
        this._renderer = _renderer;
        this._className = _className;
        this.shouldEmitDateTimeConverter = true;
        this.shouldEmitTimeConverter = true;
        this.shouldEmitDateConverter = true;
    }
}
exports.JavaDateTimeProvider = JavaDateTimeProvider;
class Java8DateTimeProvider extends JavaDateTimeProvider {
    constructor() {
        super(...arguments);
        this.keywords = [
            "LocalDate",
            "OffsetDateTime",
            "OffsetTime",
            "ZoneOffset",
            "ZonedDateTime",
            "DateTimeFormatter",
            "DateTimeFormatterBuilder",
            "ChronoField",
        ];
        this.dateTimeImports = ["java.time.OffsetDateTime"];
        this.dateImports = ["java.time.LocalDate"];
        this.timeImports = ["java.time.OffsetTime"];
        this.converterImports = [
            "java.time.LocalDate",
            "java.time.OffsetDateTime",
            "java.time.OffsetTime",
            "java.time.ZoneOffset",
            "java.time.ZonedDateTime",
            "java.time.format.DateTimeFormatter",
            "java.time.format.DateTimeFormatterBuilder",
            "java.time.temporal.ChronoField",
        ];
        this.dateTimeType = "OffsetDateTime";
        this.dateType = "LocalDate";
        this.timeType = "OffsetTime";
        this.dateTimeJacksonAnnotations = [];
        this.dateJacksonAnnotations = [];
        this.timeJacksonAnnotations = [];
    }
    emitDateTimeConverters() {
        this._renderer.ensureBlankLine();
        this._renderer.emitLine("private static final DateTimeFormatter DATE_TIME_FORMATTER = new DateTimeFormatterBuilder()");
        this._renderer.indent(() => this._renderer.indent(() => {
            this._renderer.emitLine(".appendOptional(DateTimeFormatter.ISO_DATE_TIME)");
            this._renderer.emitLine(".appendOptional(DateTimeFormatter.ISO_OFFSET_DATE_TIME)");
            this._renderer.emitLine(".appendOptional(DateTimeFormatter.ISO_INSTANT)");
            this._renderer.emitLine('.appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SX"))');
            this._renderer.emitLine('.appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ssX"))');
            this._renderer.emitLine('.appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))');
            this._renderer.emitLine(".toFormatter()");
            this._renderer.emitLine(".withZone(ZoneOffset.UTC);");
        }));
        this._renderer.ensureBlankLine();
        this._renderer.emitBlock("public static OffsetDateTime parseDateTimeString(String str)", () => {
            this._renderer.emitLine("return ZonedDateTime.from(Converter.DATE_TIME_FORMATTER.parse(str)).toOffsetDateTime();");
        });
        this._renderer.ensureBlankLine();
        this._renderer.emitLine("private static final DateTimeFormatter TIME_FORMATTER = new DateTimeFormatterBuilder()");
        this._renderer.indent(() => this._renderer.indent(() => {
            this._renderer.emitLine(".appendOptional(DateTimeFormatter.ISO_TIME)");
            this._renderer.emitLine(".appendOptional(DateTimeFormatter.ISO_OFFSET_TIME)");
            this._renderer.emitLine(".parseDefaulting(ChronoField.YEAR, 2020)");
            this._renderer.emitLine(".parseDefaulting(ChronoField.MONTH_OF_YEAR, 1)");
            this._renderer.emitLine(".parseDefaulting(ChronoField.DAY_OF_MONTH, 1)");
            this._renderer.emitLine(".toFormatter()");
            this._renderer.emitLine(".withZone(ZoneOffset.UTC);");
        }));
        this._renderer.ensureBlankLine();
        this._renderer.emitBlock("public static OffsetTime parseTimeString(String str)", () => {
            this._renderer.emitLine("return ZonedDateTime.from(Converter.TIME_FORMATTER.parse(str)).toOffsetDateTime().toOffsetTime();");
        });
    }
    convertStringToDateTime(variable) {
        return [this._className, ".parseDateTimeString(", variable, ")"];
    }
    convertStringToTime(variable) {
        return [this._className, ".parseTimeString(", variable, ")"];
    }
    convertStringToDate(variable) {
        return ["LocalDate.parse(", variable, ")"];
    }
    convertDateTimeToString(variable) {
        return [
            variable,
            ".format(java.time.format.DateTimeFormatter.ISO_OFFSET_DATE_TIME)",
        ];
    }
    convertTimeToString(variable) {
        return [
            variable,
            ".format(java.time.format.DateTimeFormatter.ISO_OFFSET_TIME)",
        ];
    }
    convertDateToString(variable) {
        return [
            variable,
            ".format(java.time.format.DateTimeFormatter.ISO_DATE)",
        ];
    }
}
exports.Java8DateTimeProvider = Java8DateTimeProvider;
class JavaLegacyDateTimeProvider extends JavaDateTimeProvider {
    constructor() {
        super(...arguments);
        this.keywords = ["SimpleDateFormat", "Date"];
        this.dateTimeImports = ["java.util.Date"];
        this.dateImports = ["java.util.Date"];
        this.timeImports = ["java.util.Date"];
        this.converterImports = [
            "java.util.Date",
            "java.text.SimpleDateFormat",
        ];
        this.dateTimeType = "Date";
        this.dateType = "Date";
        this.timeType = "Date";
        this.dateTimeJacksonAnnotations = [
            '@JsonFormat(pattern = "yyyy-MM-dd\'T\'HH:mm:ssX", timezone = "UTC")',
        ];
        this.dateJacksonAnnotations = [
            '@JsonFormat(pattern = "yyyy-MM-dd")',
        ];
        this.timeJacksonAnnotations = [
            '@JsonFormat(pattern = "HH:mm:ssX", timezone = "UTC")',
        ];
        this.shouldEmitTimeConverter = false;
        this.shouldEmitDateConverter = false;
    }
    emitDateTimeConverters() {
        this._renderer.ensureBlankLine();
        this._renderer.emitLine("private static final String[] DATE_TIME_FORMATS = {");
        this._renderer.indent(() => this._renderer.indent(() => {
            this._renderer.emitLine("\"yyyy-MM-dd'T'HH:mm:ss.SX\",");
            this._renderer.emitLine("\"yyyy-MM-dd'T'HH:mm:ss.S\",");
            this._renderer.emitLine("\"yyyy-MM-dd'T'HH:mm:ssX\",");
            this._renderer.emitLine("\"yyyy-MM-dd'T'HH:mm:ss\",");
            this._renderer.emitLine('"yyyy-MM-dd HH:mm:ss.SX",');
            this._renderer.emitLine('"yyyy-MM-dd HH:mm:ss.S",');
            this._renderer.emitLine('"yyyy-MM-dd HH:mm:ssX",');
            this._renderer.emitLine('"yyyy-MM-dd HH:mm:ss",');
            this._renderer.emitLine('"HH:mm:ss.SZ",');
            this._renderer.emitLine('"HH:mm:ss.S",');
            this._renderer.emitLine('"HH:mm:ssZ",');
            this._renderer.emitLine('"HH:mm:ss",');
            this._renderer.emitLine('"yyyy-MM-dd",');
        }));
        this._renderer.emitLine("};");
        this._renderer.ensureBlankLine();
        this._renderer.emitBlock("public static Date parseAllDateTimeString(String str)", () => {
            this._renderer.emitBlock("for (String format : DATE_TIME_FORMATS)", () => {
                this._renderer.emitIgnoredTryCatchBlock(() => {
                    this._renderer.emitLine("return new SimpleDateFormat(format).parse(str);");
                });
            });
            this._renderer.emitLine("return null;");
        });
        this._renderer.ensureBlankLine();
        this._renderer.emitBlock("public static String serializeDateTime(Date datetime)", () => {
            this._renderer.emitLine("return new SimpleDateFormat(\"yyyy-MM-dd'T'hh:mm:ssZ\").format(datetime);");
        });
        this._renderer.ensureBlankLine();
        this._renderer.emitBlock("public static String serializeDate(Date datetime)", () => {
            this._renderer.emitLine('return new SimpleDateFormat("yyyy-MM-dd").format(datetime);');
        });
        this._renderer.ensureBlankLine();
        this._renderer.emitBlock("public static String serializeTime(Date datetime)", () => {
            this._renderer.emitLine('return new SimpleDateFormat("hh:mm:ssZ").format(datetime);');
        });
    }
    convertStringToDateTime(variable) {
        return [this._className, ".parseAllDateTimeString(", variable, ")"];
    }
    convertStringToTime(variable) {
        return [this._className, ".parseAllDateTimeString(", variable, ")"];
    }
    convertStringToDate(variable) {
        return [this._className, ".parseAllDateTimeString(", variable, ")"];
    }
    convertDateTimeToString(variable) {
        return [this._className, ".serializeDateTime(", variable, ")"];
    }
    convertTimeToString(variable) {
        return [this._className, ".serializeTime(", variable, ")"];
    }
    convertDateToString(variable) {
        return [this._className, ".serializeDate(", variable, ")"];
    }
}
exports.JavaLegacyDateTimeProvider = JavaLegacyDateTimeProvider;
