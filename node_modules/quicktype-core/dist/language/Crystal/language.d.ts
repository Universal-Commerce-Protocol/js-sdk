import type { RenderContext } from "../../Renderer";
import { TargetLanguage } from "../../TargetLanguage";
import { CrystalRenderer } from "./CrystalRenderer";
export declare const crystalLanguageConfig: {
    readonly displayName: "Crystal";
    readonly names: readonly ["crystal", "cr", "crystallang"];
    readonly extension: "cr";
};
export declare class CrystalTargetLanguage extends TargetLanguage<typeof crystalLanguageConfig> {
    constructor();
    protected makeRenderer(renderContext: RenderContext): CrystalRenderer;
    protected get defaultIndentation(): string;
    getOptions(): {};
}
