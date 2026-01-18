import type { RenderContext } from "../../Renderer";
import { TargetLanguage } from "../../TargetLanguage";
import { PikeRenderer } from "./PikeRenderer";
export declare const pikeOptions: {};
export declare const pikeLanguageConfig: {
    readonly displayName: "Pike";
    readonly names: readonly ["pike", "pikelang"];
    readonly extension: "pmod";
};
export declare class PikeTargetLanguage extends TargetLanguage<typeof pikeLanguageConfig> {
    constructor();
    getOptions(): {};
    protected makeRenderer(renderContext: RenderContext): PikeRenderer;
}
